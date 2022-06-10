import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import System from 'App/Models/System'
import SystemFaction from 'App/Models/SystemFaction'
import Government from 'App/Models/Government'
import Security from 'App/Models/Security'
import Economy from 'App/Models/Economy'
import SuperPower from 'App/Models/SuperPower'
import Faction from 'App/Models/Faction'
import Station from 'App/Models/Station'
import Body from 'App/Models/Body'
import BodyStar from 'App/Models/BodyStar'
import BodyPlanet from 'App/Models/BodyPlanet'
import Commodity from 'App/Models/Commodity'
//import StationCommodity from 'App/Models/StationCommodity'

import Log from 'App/Models/Log'

export default class EDDNController {
  private whitelist = [
    'EDDiscovery',
    'E:D Market Connector [Windows]',
    'E:D Market Connector [Linux]',
    'E:D Market Connector [Mac OS]',
    'EDSM',
    'EDDI',
    'GameGlass',
  ]

  public async receive({ request, response }: HttpContextContract) {
    const data = request.input('data')

    if (!data) {
      return response.status(400).json({
        error: 'No message provided',
      })
    }
    if (!this.whitelist.includes(data.header.softwareName)) {
      return response.status(200).json({
        error: 'Software not whitelisted',
      })
    }
    // @ts-ignore
    const [protocol, notInUse, domain, path, schema, version] = data.$schemaRef.split('/')
    switch (schema) {
      case 'journal':
        switch (data.message.event) {
          case 'FSDJump':
            this.processJump(data)
            break
          case 'Docked':
            this.processDocked(data)
            break
          case 'Location':
            switch (data.message.BodyType) {
              case 'Station':
                this.processLocation(data)
                break
              case 'Star':
                this.processStar(data)
                break
            }
            break
          case 'Scan':
            if (data.message.hasOwnProperty('StarType')) {
              this.processScanStar(data)
            }

            if (data.message.hasOwnProperty('PlanetClass')) {
              this.processScanPlanet(data)
            }
        }
        break
      case 'outfitting':
        this.processModules(data)
        break
      case 'shipyard':
        this.processShipyard(data)
        break
      case 'commodity':
        this.processCommodity(data)
        break
    }

    return response.status(200).json({ message: 'ok' })
  }

  private async processShipyard(data: any) {
    try {
      const { stationName, marketId, ships } = data.message
      const station = await Station.query()
        .where('name', stationName)
        .where('marketId', marketId)
        .first()

      if (station) {
        station.related('ships').updateOrCreateMany(
          ships.map((s) => {
            return { name: s.toLowerCase() }
          }),
          'name'
        )

        /*await Log.create({
          type: 'station',
          typeId: station.id,
          event: data.message.event ? data.message.event : 'ships',
          schema: data.$schemaRef,
          software: data.header.softwareName,
          softwareVersion: data.header.softwareVersion,
          message: data,
        })*/
      }
    } catch (e) {
      console.log(e)
    }
  }

  private async processModules(data: any) {
    try {
      const { stationName, marketId, modules } = data.message
      const station = await Station.query()
        .where('name', stationName)
        .where('marketId', marketId)
        .first()

      if (station) {
        station.related('modules').updateOrCreateMany(
          modules.map((s) => {
            return { name: s.toLowerCase() }
          }),
          'name'
        )

        /*await Log.create({
          type: 'station',
          typeId: station.id,
          event: data.message.event ? data.message.event : 'modules',
          schema: data.$schemaRef,
          software: data.header.softwareName,
          softwareVersion: data.header.softwareVersion,
          message: data,
        })*/
      }
    } catch (e) {
      console.log(e)
    }
  }

  private async processCommodity(data: any) {
    try {
      const { systemName, stationName, marketId, commodities } = data.message

      const commoditiesPayload = await Promise.all(
        commodities
          .map(async (c) => {
            const commodity = await Commodity.query().where('key', c.name).first()
            if (commodity) {
              return {
                name: c.name ? c.name : '',
                commodityId: commodity?.id,
                buyPrice: c.buyPrice ? c.buyPrice : 0,
                sellPrice: c.sellPrice ? c.sellPrice : 0,
                demand: c.demand ? c.demand : 0,
                stock: c.stock ? c.stock : 0,
                demandBracket: c.demandBracket ? c.demandBracket : 0,
                stockBracket: c.stockBracket ? c.stockBracket : 0,
                meanPrice: c.meanPrice ? c.meanPrice : 0,
              }
            }
          })
          .filter((c) => c !== undefined)
      )

      const system = await System.updateOrCreate({ name: systemName }, { name: systemName })

      const stationPayload = {
        name: stationName,
        system_id: system.id,
        market_id: marketId,
      }

      const station = await Station.firstOrCreate({}, stationPayload)
      const com = await station
        .related('commodities')
        .updateOrCreateMany(commoditiesPayload, 'stationId')
      console.log(com)
      /*if (process.env.NODE_ENV === 'production') {
        commoditiesPayload.forEach(async (c) => {
          const sc = await StationCommodity.query()
            .where('name', c.name)
            .min({ minSell: 'sell_price', minBuy: 'buy_price' })
            .max({ maxSell: 'sell_price', maxBuy: 'buy_price' })
            .avg({ avgSell: 'sell_price', avgBuy: 'buy_price' })
          await Commodity.query().where('key', c.name).update({
            minSell: sc[0].$extras.minSell,
            maxSell: sc[0].$extras.maxSell,
            avgSell: sc[0].$extras.avgSell,
            minBuy: sc[0].$extras.minBuy,
            maxBuy: sc[0].$extras.maxBuy,
            avgBuy: sc[0].$extras.avgBuy,
          })
        })
      }*/

      await Log.create({
        type: 'system',
        typeId: system.id,
        event: data.message.event ? data.message.event : 'system',
        schema: data.$schemaRef,
        software: data.header.softwareName,
        softwareVersion: data.header.softwareVersion,
        message: data,
      })

      await Log.create({
        type: 'station',
        typeId: station.id,
        event: data.message.event ? data.message.event : 'commodity',
        schema: data.$schemaRef,
        software: data.header.softwareName,
        softwareVersion: data.header.softwareVersion,
        message: data,
      })
    } catch (e) {
      console.log(e)
    }
  }

  private async processJump(data: any) {
    try {
      const {
        StarPos,
        StarSystem,
        SystemAddress,
        SystemEconomy,
        SystemAllegiance,
        SystemGovernment,
        SystemSecurity,
        Population,
      } = data.message

      const government = await Government.query().where('key', SystemGovernment).first()
      const economy = await Economy.query().where('key', SystemEconomy).first()
      const security = await Security.query().where('key', SystemSecurity).first()
      const superPower = await SuperPower.query().where('name', SystemAllegiance).first()

      const payload = {
        name: StarSystem,
        address: SystemAddress,
        position: StarPos.join(';'),
        governmentId: government?.id,
        securityId: security?.id,
        primaryEconomyId: economy?.id,
        allegianceId: superPower?.id,
        population: Population,
      }

      const search = {
        name: StarSystem,
        address: SystemAddress,
      }

      await System.updateOrCreate(search, payload)
      /*await Log.create({
        type: 'system',
        typeId: system.id,
        event: data.message.event ? data.message.event : 'system',
        schema: data.$schemaRef,
        software: data.header.softwareName,
        softwareVersion: data.header.softwareVersion,
        message: data,
      })*/
    } catch (e) {
      console.log(e)
    }
  }

  private async processDocked(data: any): Promise<any> {
    try {
      const {
        DistFromStarLS,
        MarketID,
        StarPos,
        StarSystem,
        StationAllegiance,
        StationEconomies,
        StationEconomy,
        StationFaction,
        StationGovernment,
        StationName,
        StationType,
        SystemAddress,
        StationServices,
        LandingPads,
      } = data.message

      const system = await System.updateOrCreate(
        { name: StarSystem, address: SystemAddress },
        { name: StarSystem, address: SystemAddress, position: StarPos.join(';') }
      )
      const faction = await Faction.updateOrCreate(
        { name: StationFaction.Name },
        {
          name: StationFaction.Name,
          state: StationFaction.FactionState ? StationFaction.FactionState : '',
        }
      )

      const government = await Government.query().where('key', StationGovernment).first()
      const economy = await Economy.query().where('key', StationEconomy).first()
      const allegiance = await SuperPower.query()
        .where('name', StationAllegiance ? StationAllegiance : 'None')
        .first()

      const stationPayload = {
        name: StationName,
        system_id: system.id,
        market_id: MarketID,
        distance_from_star: DistFromStarLS,
        allegianceId: allegiance?.id,
        governmentId: government?.id,
        economyId: economy?.id,
        type: StationType,
      }
      let payload
      if (LandingPads) {
        let maxPadSize
        if (LandingPads.Large > 0) {
          maxPadSize = 'L'
        } else if (LandingPads.Medium > 0 && LandingPads.Large === 0) {
          maxPadSize = 'M'
        } else if (LandingPads.Small > 0 && LandingPads.Medium === 0 && LandingPads.Large === 0) {
          maxPadSize = 'S'
        }
        payload = {
          ...stationPayload,
          largePads: LandingPads.Large,
          mediumPads: LandingPads.Medium,
          smallPads: LandingPads.Small,
          max_landing_pad_size: maxPadSize,
        }
      } else {
        payload = stationPayload
      }

      const economiesPayload = StationEconomies.map((e) => {
        return {
          name: e.Name,
          proportion: e.Proportion,
        }
      })

      const servicesPayload = StationServices.map((e) => {
        return {
          name: e,
        }
      })

      const station = await Station.updateOrCreate({ marketId: MarketID }, payload)
      await station.related('economies').updateOrCreateMany(economiesPayload)
      await station.related('services').updateOrCreateMany(servicesPayload)
      await station
        .related('faction')
        .updateOrCreate({ factionId: faction.id }, { factionId: faction.id })

      /*await Log.create({
        type: 'station',
        typeId: station.id,
        event: data.message.event ? data.message.event : 'station',
        schema: data.$schemaRef,
        software: data.header.softwareName,
        softwareVersion: data.header.softwareVersion,
        message: data,
      })
      await Log.create({
        type: 'system',
        typeId: system.id,
        event: data.message.event ? data.message.event : 'station',
        schema: data.$schemaRef,
        software: data.header.softwareName,
        softwareVersion: data.header.softwareVersion,
        message: data,
      })*/

      return { station, system }
    } catch (e) {
      console.log(e)
    }
  }

  private async processLocation(data: any) {
    try {
      const { system } = await this.processDocked(data)
      const { Factions } = data.message

      if (Factions) {
        const factionsPayload = await Promise.all(
          Factions.map(async (faction) => {
            const allegiance = await SuperPower.query().where('name', faction.Allegiance).first()
            const government = await Government.query().where('name', faction.Government).first()
            return {
              name: faction.Name,
              allegiance_id: allegiance ? allegiance.id : 5,
              government_id: government ? government.id : 10,
              influence: faction.Influence,
              state: faction.FactionState,
              happiness: faction.Happiness,
              activeStates: faction.ActiveStates
                ? faction.ActiveStates.map((s) => s.State).join(';')
                : 'None',
              pendingStates: faction.PendingStates
                ? faction.PendingStates.map((s) => s.State).join(';')
                : 'None',
              recoveringStates: faction.RecoveringStates
                ? faction.RecoveringStates.map((s) => s.State).join(';')
                : 'None',
            }
          })
        )

        const factions = await Faction.updateOrCreateMany('name', factionsPayload)
        const systemFactions = factions.map((faction) => {
          return {
            systemId: system.id,
            factionId: faction.id,
          }
        })
        await SystemFaction.updateOrCreateMany(['systemId', 'factionId'], systemFactions)
      }

      /*await Log.create({
        type: 'station',
        typeId: station.id,
        event: data.message.event ? data.message.event : 'station',
        schema: data.$schemaRef,
        software: data.header.softwareName,
        softwareVersion: data.header.softwareVersion,
        message: data,
      })
      await Log.create({
        type: 'system',
        typeId: system.id,
        event: data.message.event ? data.message.event : 'station',
        schema: data.$schemaRef,
        software: data.header.softwareName,
        softwareVersion: data.header.softwareVersion,
        message: data,
      })*/
    } catch (e) {
      console.log(e)
    }
  }

  private async processStar(data: any) {
    try {
      const {
        StarPos,
        StarSystem,
        SystemAddress,
        SystemEconomy,
        SystemAllegiance,
        SystemGovernment,
        SystemSecurity,
        Population,
        Factions,
      } = data.message

      const search = {
        address: SystemAddress,
      }

      const government = await Government.query().where('key', SystemGovernment).first()
      const economy = await Economy.query().where('key', SystemEconomy).first()
      const security = await Security.query().where('key', SystemSecurity).first()
      const superPower = await SuperPower.query().where('name', SystemAllegiance).first()

      const payload = {
        name: StarSystem,
        address: SystemAddress,
        position: StarPos.join(';'),
        population: Population,
        governmentId: government?.id,
        securityId: security?.id,
        primaryEconomyId: economy?.id,
        allegianceId: superPower?.id,
      }
      const system = await System.updateOrCreate(search, payload)
      if (Factions) {
        const factionsPayload = await Promise.all(
          Factions.map(async (f) => {
            const allegiance = await SuperPower.query().where('name', f.Allegiance).first()
            const government = await Government.query().where('name', f.Government).first()
            return {
              name: f.Name,
              state: f.FactionState,
              allegiance_id: allegiance ? allegiance.id : 5,
              government_id: government ? government.id : 10,
              happiness: f.Happiness,
              influence: f.Influence,
              activeStates: f.ActiveStates ? f.ActiveStates.map((s) => s.State).join(';') : 'None',
              pendingStates: f.PendingStates
                ? f.PendingStates.map((s) => s.State).join(';')
                : 'None',
              recoveringStates: f.RecoveringStates
                ? f.RecoveringStates.map((s) => s.State).join(';')
                : 'None',
            }
          })
        )

        const factions = await Faction.updateOrCreateMany('name', factionsPayload)
        const systemFactions = factions.map((faction) => {
          return {
            systemId: system.id,
            factionId: faction.id,
          }
        })
        await SystemFaction.updateOrCreateMany(['systemId', 'factionId'], systemFactions)
      }
      /*await Log.create({
        type: 'system',
        typeId: system.id,
        event: data.message.event ? data.message.event : 'system',
        schema: data.$schemaRef,
        software: data.header.softwareName,
        softwareVersion: data.header.softwareVersion,
        message: data,
      })*/
    } catch (e) {
      console.log(e)
    }
  }

  private async processBody(data): Promise<Body | undefined> {
    try {
      const { StarPos, StarSystem, SystemAddress } = data.message

      const systemPayload = {
        name: StarSystem,
        position: StarPos.join(';'),
        address: SystemAddress,
      }

      const system = await System.updateOrCreate({ address: SystemAddress }, systemPayload)
      const body = await Body.updateOrCreate({ systemId: system.id }, { systemId: system.id })

      /*await Log.create({
        type: 'system',
        typeId: system.id,
        event: data.message.event ? data.message.event : 'system',
        schema: data.$schemaRef,
        software: data.header.softwareName,
        softwareVersion: data.header.softwareVersion,
        message: data,
      })*/

      return body
    } catch (e) {
      console.log(e)
    }
  }

  private async processScanStar(data: any) {
    try {
      const {
        StarType,
        BodyName,
        StellarMass,
        DistanceFromArrivalLS,
        AbsoluteMagnitude,
        AxialTilt,
        Eccentricity,
        OrbitalInclination,
        OrbitalPeriod,
        RotationPeriod,
        Luminosity,
        SurfaceTemperature,
        Subclass,
        SemiMajorAxis,
        Radius,
        Rings,
      } = data.message

      const body = await this.processBody(data)
      if (body) {
        const bodyStarPayload = {
          bodyId: body.id,
          name: BodyName,
          mass: StellarMass,
          type: StarType,
          distance: DistanceFromArrivalLS,
          isMain: DistanceFromArrivalLS === 0,
          age: data.message.Age_MY,
          absoluteMagnitude: AbsoluteMagnitude,
          axialTilt: AxialTilt,
          eccentricity: Eccentricity,
          inclination: OrbitalInclination,
          orbitalPeriod: OrbitalPeriod,
          rotationPeriod: RotationPeriod,
          luminosity: Luminosity,
          temperature: SurfaceTemperature,
          subClass: Subclass,
          semiMajorAxis: SemiMajorAxis,
          radius: Radius,
        }

        const star = await BodyStar.updateOrCreate(
          { bodyId: body.id, name: BodyName },
          bodyStarPayload
        )

        if (Rings) {
          const ringsPayload = Rings.map((ring) => {
            return {
              bodyId: star.id,
              name: ring.Name,
              innerRad: ring.InnerRad,
              outerRad: ring.OuterRad,
              mass: ring.MassMT,
              class: ring.RingClass,
            }
          })
          star.related('rings').updateOrCreateMany(ringsPayload)

          /*await Log.create({
            type: 'ring',
            typeId: star.id,
            event: data.message.event ? data.message.event : 'ring',
            schema: data.$schemaRef,
            software: data.header.softwareName,
            softwareVersion: data.header.softwareVersion,
            message: data,
          })*/
        }

        /*await Log.create({
          type: 'star',
          typeId: star.id,
          event: data.message.event ? data.message.event : 'star',
          schema: data.$schemaRef,
          software: data.header.softwareName,
          softwareVersion: data.header.softwareVersion,
          message: data,
        })*/
      }
    } catch (e) {
      console.log(e)
    }
  }

  private async processScanPlanet(data: any) {
    try {
      const {
        BodyName,
        MassEM,
        DistanceFromArrivalLS,
        PlanetClass,
        Composition,
        Materials,
        Landable,
        AtmosphereType,
        AxialTilt,
        Eccentricity,
        Radius,
        OrbitalInclination,
        OrbitalPeriod,
        RotationPeriod,
        SurfaceTemperature,
        SurfaceGravity,
        SurfacePressure,
        TerraformState,
        Volcanism,
        SemiMajorAxis,
        Periapsis,
        Rings,
      } = data.message

      const body = await this.processBody(data)
      if (body) {
        const planetSearch = {
          bodyId: body.id,
          name: BodyName,
        }

        const planetPayload = {
          bodyId: body.id,
          name: BodyName,
          mass: MassEM ? MassEM : 0,
          class: PlanetClass,
          landable: Landable,
          atmosphere: AtmosphereType ? AtmosphereType : 'None',
          distance: DistanceFromArrivalLS,
          axialTilt: AxialTilt,
          periapsis: Periapsis,
          eccentricity: Eccentricity,
          inclination: OrbitalInclination,
          orbitalPeriod: OrbitalPeriod,
          rotationPeriod: RotationPeriod,
          surfaceTemperature: SurfaceTemperature,
          surfaceGravity: SurfaceGravity,
          surfacePressure: SurfacePressure,
          terraformState: TerraformState,
          volcanism: Volcanism,
          semiMajorAxis: SemiMajorAxis,
          radius: Radius,
        }

        const planet = await BodyPlanet.updateOrCreate(planetSearch, planetPayload)
        const compositions = Composition
          ? Object.keys(Composition).map((k) => {
              return { type: k, amount: Composition[k] }
            })
          : []

        const materials = Materials
          ? Materials.map((m) => {
              return { type: m.Name, amount: m.Percent }
            })
          : []

        if (compositions.length > 0) {
          await planet.related('compositions').updateOrCreateMany(compositions, 'bodyPlanetId')
        }
        if (materials.length > 0) {
          await planet.related('materials').updateOrCreateMany(compositions, 'bodyPlanetId')
        }

        if (Rings) {
          const ringsPayload = Rings.map((ring) => {
            return {
              bodyId: planet.id,
              name: ring.Name,
              innerRad: ring.InnerRad,
              outerRad: ring.OuterRad,
              mass: ring.MassMT,
              class: ring.RingClass,
            }
          })
          planet.related('rings').updateOrCreateMany(ringsPayload)

          /*await Log.create({
            type: 'ring',
            typeId: planet.id,
            event: data.message.event ? data.message.event : 'ring',
            schema: data.$schemaRef,
            software: data.header.softwareName,
            softwareVersion: data.header.softwareVersion,
            message: data,
          })*/
        }

        /*await Log.create({
          type: 'planet',
          typeId: planet.id,
          event: data.message.event ? data.message.event : 'planet',
          schema: data.$schemaRef,
          software: data.header.softwareName,
          softwareVersion: data.header.softwareVersion,
          message: data,
        })*/
      }
    } catch (e) {
      console.log(e)
    }
  }
}
