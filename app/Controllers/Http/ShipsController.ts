import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'

import Ship from 'App/Models/Ship'
import StationShip from 'App/Models/StationShip'
import System from 'App/Models/System'

export default class ShipsController {
  public async index({ response }: HttpContextContract) {
    try {
      const ships = await Ship.query().orderBy('price', 'asc')
      return response.json(ships)
    } catch (error) {
      return response.status(500).json({ error })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const ship = await Ship.query()
        .where('name', decodeURI(params.id))
        .preload('stats', (query) => {
          query
            .preload('core')
            .preload('optionals', (query) => {
              query.orderBy('type', 'asc').orderBy('size', 'desc')
            })
            .preload('hardpoints', (query) => {
              query.orderBy('size', 'desc')
            })
        })
        .first()
      if (!ship) {
        return response.status(404).json({ error: 'Ship not found' })
      }
      return response.status(200).json(ship)
    } catch (e) {
      return response.status(500).json({ error: e.message })
    }
  }

  public async nearest({ response, request }: HttpContextContract) {
    try {
      const qs = request.qs()
      const systemName = qs.system ? decodeURI(qs.system) : decodeURI('Sol')
      const system = await System.findByOrFail('name', systemName)
      const ships = await StationShip.query()
        .select(
          'station_ships.*',
          Database.raw(`distanceBetweenSystems('${system.position}', stations.system_id) as dist`)
        )
        .join('stations', 'stations.id', '=', 'station_ships.station_id')
        .where('station_ships.name', qs.name)
        .preload('station', (query) => {
          query.preload('system')
        })
        .orderBy('dist', 'asc')
        .limit(10)
      const res = ships.map((ship) => ship.serialize())
      return response.status(200).json(res)
    } catch (e) {
      return response.status(500).json({ message: 'Error fetching station ships', msg: e.message })
    }
  }
}
