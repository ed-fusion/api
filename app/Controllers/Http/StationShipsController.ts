import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import StationShip from 'App/Models/StationShip'

export default class StationShipsController {
  public async index({ response, params }: HttpContextContract) {
    try {
      const ships = await StationShip.query()
        .select('station_ships.*')
        .join('ships', 'station_ships.name', '=', 'ships.key')
        .preload('ship')
        .where('station_id', params.station_id)
        .orderBy('price', 'asc')
      return response.status(200).json(ships)
    } catch (e) {
      return response.status(500).json({ message: 'Error fetching station ships', msg: e.message })
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
