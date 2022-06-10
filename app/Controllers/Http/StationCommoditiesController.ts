import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import StationCommodity from 'App/Models/StationCommodity'
import System from 'App/Models/System'

export default class StationCommoditiesController {
  private directions = ['asc', 'desc']
  private stationTypes = [
    'Coriolis',
    'Ocellus',
    'Orbis',
    'Outpost',
    'Bernal',
    'MegaShip',
    'AsteroidBase',
  ]

  public async index({ response, request, params }: HttpContextContract) {
    const qs = request.qs()
    const columns = ['commodities.name', 'sell_price', 'buy_price', 'demand', 'stock', 'updated_at']
    const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
    const column = columns.includes(qs.column) ? qs.column : 'name'
    try {
      const modules = await StationCommodity.query()
        .select('station_commodities.*')
        .preload('commodity')
        .join('commodities', 'station_commodities.name', '=', 'commodities.key')
        .where('station_id', params.station_id)
        .orderBy(column, direction)
      return response.status(200).json(modules)
    } catch (e) {
      return response
        .status(500)
        .json({ message: 'Error fetching station commodities', msg: e.message })
    }
  }

  public async showMin({ response, request, params }: HttpContextContract) {
    const qs = request.qs()
    let st = this.stationTypes
    try {
      const commoditiesQuery = StationCommodity.query()
        .select('station_commodities.*')
        .join('stations', 'stations.id', '=', 'station_commodities.station_id')
        .join('commodities', 'station_commodities.name', '=', 'commodities.key')
        .preload('station', (query) => {
          query.preload('system')
        })
        .where('station_commodities.name', decodeURI(params.name))
        .where('buy_price', '>', 0)
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
      commoditiesQuery.whereIn('stations.type', st)
      const commodities = await commoditiesQuery.orderBy('buy_price', 'asc').first()
      return response.status(200).json(commodities)
    } catch (e) {
      return response
        .status(500)
        .json({ message: 'Error fetching station commodities', msg: e.message })
    }
  }

  public async showMax({ response, request, params }: HttpContextContract) {
    const qs = request.qs()
    let st = this.stationTypes
    try {
      const commoditiesQuery = StationCommodity.query()
        .select('station_commodities.*')
        .join('stations', 'stations.id', '=', 'station_commodities.station_id')
        .join('commodities', 'station_commodities.name', '=', 'commodities.key')
        .preload('station', (query) => {
          query.preload('system')
        })
        .where('station_commodities.name', decodeURI(params.name))
        .where('sell_price', '>', 0)
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
      commoditiesQuery.whereIn('stations.type', st)
      const commodities = await commoditiesQuery.orderBy('sell_price', 'desc').first()
      return response.status(200).json(commodities)
    } catch (e) {
      return response
        .status(500)
        .json({ message: 'Error fetching station commodities', msg: e.message })
    }
  }

  public async showByName({ response, request, params }: HttpContextContract) {
    const qs = request.qs()
    let st = this.stationTypes
    const ref = qs.ref ? decodeURI(qs.ref) : 'sol'
    const limit = qs.limit ? qs.limit : 10
    try {
      const system = await System.findByOrFail('name', ref)
      const commoditiesQuery = StationCommodity.query()
        .select(
          'station_commodities.*',
          Database.raw(`distanceBetweenSystems('${system.position}', systems.position) as distance`)
        )
        .join('stations', 'stations.id', '=', 'station_commodities.station_id')
        .join('systems', 'systems.id', '=', 'stations.system_id')
        .join('commodities', 'station_commodities.name', '=', 'commodities.key')
        .preload('station', (query) => {
          query.preload('system')
        })
        .where('station_commodities.name', decodeURI(params.name))
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

      if (Object.keys(qs).includes('min') && qs.min === 'true') {
        commoditiesQuery.where('buy_price', '>', 0).orderBy('buy_price', 'asc')
      }
      if (Object.keys(qs).includes('max') && qs.max === 'true') {
        commoditiesQuery.where('sell_price', '>', 0).orderBy('sell_price', 'desc')
      }

      if (Object.keys(qs).includes('minSupply') && qs.minSupply !== 0) {
        commoditiesQuery.where('stock', '>=', qs.minSupply)
      }
      commoditiesQuery.whereIn('stations.type', st)
      const commodities = await commoditiesQuery.limit(limit)

      return response.status(200).json(commodities)
    } catch (e) {
      return response
        .status(500)
        .json({ message: 'Error fetching station commodities', msg: e.message })
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
