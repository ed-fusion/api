import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import StationModule from 'App/Models/StationModule'

export default class StationModulesController {
  private directions = ['asc', 'desc']

  public async index({ response, request, params }: HttpContextContract) {
    const qs = request.qs()
    const columns = ['modules.name', 'price', 'class', 'rating', 'updated_at']
    const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
    const column = columns.includes(qs.column) ? qs.column : 'name'
    try {
      const modules = await StationModule.query()
        .select('station_modules.*')
        .join('modules', 'station_modules.name', '=', 'modules.key')
        .preload('module')
        .where('station_id', params.station_id)
        .orderBy(column, direction)
      return response.status(200).json(modules)
    } catch (e) {
      return response
        .status(500)
        .json({ message: 'Error fetching station modules', msg: e.message })
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
