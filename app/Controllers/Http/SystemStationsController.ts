import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import System from 'App/Models/System'
import Station from 'App/Models/Station'

export default class SystemStationsController {
  private directions = ['asc', 'desc']
  public async index({ response, params, request }: HttpContextContract) {
    try {
      const qs = request.qs()
      const columns = ['type', 'name', 'updated_at', 'distance_from_star', 'max_landing_pad_size']
      const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
      const column = columns.includes(qs.column) ? qs.column : 'distance_from_star'
      const id = decodeURI(params.system_id)
      const system = await System.find(id)
      const sys = system ? system.id : 492
      const stations = await Station.query()
        .where('system_id', sys)
        .andWhereNot('type', 'FleetCarrier')
        .preload('economies', (query) => {
          query.preload('economy')
        })
        .preload('faction', (query) => {
          query.preload('faction')
        })
        .preload('government')
        .orderBy(column, direction)

      return response.status(200).json(stations)
    } catch (e) {
      console.log(e.message)
      return response.status(404).json({ message: 'System not found' })
    }
  }

  public async show({}: HttpContextContract) {}

  public async orbital({ response, params, request }: HttpContextContract) {
    try {
      const qs = request.qs()
      const columns = ['type', 'name', 'updated_at', 'distance_from_star', 'max_landing_pad_size']
      const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
      const column = columns.includes(qs.column) ? qs.column : 'distance_from_star'
      const id = decodeURI(params.system_id)
      const system = await System.find(id)
      const sys = system ? system.id : 492
      const stationTypes = ['FleetCarrier', 'CraterOutpost', 'OnFootSettlement', 'CraterPort']
      const stations = await Station.query()
        .where('system_id', sys)
        .whereNotIn('type', stationTypes)
        .preload('economies', (query) => {
          query.preload('economy')
        })
        .preload('faction', (query) => {
          query.preload('faction')
        })
        .preload('government')
        .orderBy(column, direction)

      return response.status(200).json(stations)
    } catch (e) {
      console.log(e.message)
      return response.status(404).json({ message: 'System not found' })
    }
  }

  public async planetary({ response, params, request }: HttpContextContract) {
    try {
      const qs = request.qs()
      const columns = ['type', 'name', 'updated_at', 'distance_from_star', 'max_landing_pad_size']
      const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
      const column = columns.includes(qs.column) ? qs.column : 'distance_from_star'
      const id = decodeURI(params.system_id)
      const system = await System.find(id)
      const sys = system ? system.id : 492
      const stationTypes = ['CraterOutpost', 'OnFootSettlement', 'CraterPort']
      const stations = await Station.query()
        .where('system_id', sys)
        .whereIn('type', stationTypes)
        .preload('economies', (query) => {
          query.preload('economy')
        })
        .preload('faction', (query) => {
          query.preload('faction')
        })
        .preload('government')
        .orderBy(column, direction)

      return response.status(200).json(stations)
    } catch (e) {
      console.log(e.message)
      return response.status(404).json({ message: 'System not found' })
    }
  }

  public async fleetCarrier({ response, params, request }: HttpContextContract) {
    try {
      const qs = request.qs()
      const columns = ['type', 'name', 'updated_at', 'distance_from_star', 'max_landing_pad_size']
      const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
      const column = columns.includes(qs.column) ? qs.column : 'distance_from_star'
      const id = decodeURI(params.system_id)
      const system = await System.find(id)
      const sys = system ? system.id : 492
      const stations = await Station.query()
        .where('system_id', sys)
        .andWhere('type', 'FleetCarrier')
        .preload('economies', (query) => {
          query.preload('economy')
        })
        .preload('faction', (query) => {
          query.preload('faction')
        })
        .preload('government')
        .orderBy(column, direction)

      return response.status(200).json(stations)
    } catch (e) {
      console.log(e.message)
      return response.status(404).json({ message: 'System not found' })
    }
  }
}
