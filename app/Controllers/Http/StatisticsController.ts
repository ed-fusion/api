import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import System from 'App/Models/System'
import Station from 'App/Models/Station'

export default class StatisticsController {
  public async show({ response }: HttpContextContract) {
    try {
      const systems = await System.query().count('id', 'total')
      const stations = await Station.query().count('id', 'total')

      return response
        .status(200)
        .json({ systems: systems[0].$extras.total, stations: stations[0].$extras.total })
    } catch (e) {}
  }
}
