import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'

import Station from 'App/Models/Station'

export default class StationsController {
  private columns = [
    'name',
    'systems.name',
    'super_powers.name',
    'distance_from_star',
    'distance',
    'updated_at',
  ]

  private stationTypes = [
    'Coriolis',
    'Ocellus',
    'Orbis',
    'Outpost',
    'Bernal',
    'MegaShip',
    'AsteroidBase',
  ]

  private directions = ['asc', 'desc']
  public async index({ response, request }: HttpContextContract) {
    let st = this.stationTypes
    const qs = request.qs()
    const page = qs.page ? parseInt(qs.page) : 1
    const column = this.columns.includes(qs.column) ? qs.column : 'systems.distance'
    const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
    const stationsQuery = Station.query()

    // Primary Query
    stationsQuery
      .select('stations.*', 'systems.name as system_name', 'systems.distance as distance')
      .whereNot('systems.address', 0)
      .join('systems', 'systems.id', '=', 'stations.system_id')

    // Preload
    stationsQuery
      .preload('system', (query) => {
        query.whereNot('address', 0)
      })
      .preload('government')
      .preload('economies', (query) => {
        query.preload('economy')
      })
      .preload('faction', (query) => {
        query.preload('faction')
      })
      .preload('allegiance')

    // Filters
    if (Object.keys(qs).includes('showFc') && qs.showFc === 'true') {
      st.push('FleetCarrier')
    } else {
      st = this.stationTypes.filter((t) => t !== 'FleetCarrier')
    }

    if (Object.keys(qs).includes('showPlanetary') && qs.showPlanetary === 'true') {
      st.push('CraterOutpost', 'CraterPort', 'OnFootSettlement')
    } else {
      st = this.stationTypes.filter((t) => t !== 'CraterOutpost')
      st = st.filter((t) => t !== 'CraterPort')
      st = st.filter((t) => t !== 'OnFootSettlement')
    }
    stationsQuery.whereIn('type', st)

    if (Object.keys(qs).includes('services')) {
      let services = qs.services
      if (services.includes('searchrescue')) {
        services.push('SearchAndRescue')
      } else {
        services = services.filter((s) => s !== 'SearchAndRescue')
      }
      stationsQuery.whereIn(
        'stations.id',
        Database.from('station_services').select('station_id').whereIn('name', services)
      )
    }

    if (Object.keys(qs).includes('commodities')) {
      stationsQuery.whereIn(
        'stations.id',
        Database.from('station_commodities').select('station_id').whereIn('name', qs.commodities)
      )
    }

    if (Object.keys(qs).includes('ships')) {
      stationsQuery.whereIn(
        'stations.id',
        Database.from('station_ships').select('station_id').whereIn('name', qs.ships)
      )
    }

    if (Object.keys(qs).includes('modules')) {
      stationsQuery.whereIn(
        'stations.id',
        Database.from('station_modules').select('station_id').whereIn('name', qs.modules)
      )
    }

    if (Object.keys(qs).includes('types')) {
      stationsQuery.whereIn('type', qs.types)
    }

    if (Object.keys(qs).includes('arrival') && qs.arrival !== '') {
      stationsQuery.where('distance_from_star', '<=', qs.arrival)
    }

    const stations = await stationsQuery
      .orderBy(column, direction)
      .orderBy('name', 'asc')
      .paginate(page, 25)
    return response.status(200).json({ stations })
  }

  public async types({ response }: HttpContextContract) {
    try {
      const types = await Station.query().distinct('type')

      return response.status(200).json(types)
    } catch (e) {
      return response.status(500).json({ message: 'Error fetching station types', msg: e.message })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const stationQuery = Station.query()
        .where('name', decodeURI(params.id))
        .preload('system')
        .preload('government')
        .preload('economy')
        .preload('economies', (query) => {
          query.preload('economy')
        })
        .preload('faction', (query) => {
          query.preload('faction')
        })
        .preload('commodities', (query) => {
          query.preload('commodity')
        })
        .preload('services', (query) => {
          query
            .distinct('name')
            .orderBy('name', 'asc')
            .preload('service', (query) => {
              query.where('shown', true)
            })
        })
        .preload('allegiance')
        .firstOrFail()

      const station = await stationQuery

      /*const body = await Body.query()
        .preload('planets')
        .preload('stars')
        .where('system_id', station.systemId)
        .first()

      const planet = body?.planets.filter((p) => {
        //console.log(Math.trunc(p.distance) === Math.trunc(station.distanceFromStar), p.name)
        return Math.trunc(p.distance) === Math.trunc(station.distanceFromStar)
      })*/
      if (!station) {
        return response.status(404).json({ message: 'Station not found' })
      }
      return response.status(200).json({ station })
    } catch (e) {
      return response.status(404).json({ message: 'Station not found' })
    }
  }

  public async find({ response, request }: HttpContextContract) {
    const qs = request.qs()
    if (qs.q.length <= 0) {
      return response.status(400).json({ stations: [] })
    }
    const stations = await Station.query()
      .where('name', 'like', `%${qs.q}%`)
      .preload('system')
      .preload('government')
      .preload('economy')
      .preload('allegiance')
      .limit(10)
    return response.status(200).json({ stations })
  }
}
