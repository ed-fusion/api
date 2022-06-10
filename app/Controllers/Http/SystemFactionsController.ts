import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import SystemFaction from 'App/Models/SystemFaction'
import System from 'App/Models/System'

export default class SystemFactionsController {
  private directions = ['asc', 'desc']
  public async index({ response, request, params }: HttpContextContract) {
    try {
      const qs = request.qs()
      const columns = [
        'factions.name',
        'influence',
        'state',
        'super_powers.name',
        'governments.name',
        'factions.updated_at',
      ]
      const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
      const column = columns.includes(qs.column) ? qs.column : 'influence'
      const id = decodeURI(params.system_id)
      const system = await System.find(id)
      const sys = system ? system.id : 492
      const stations = await SystemFaction.query()
        .select('faction_id', 'factions.*', 'governments.name', 'super_powers.name')
        .where('system_id', sys)
        .join('factions', 'system_factions.faction_id', '=', 'factions.id')
        .join('governments', 'factions.government_id', '=', 'governments.id')
        .join('super_powers', 'factions.allegiance_id', '=', 'super_powers.id')
        .preload('faction', (query) => {
          query.preload('government').preload('allegiance')
        })
        .orderBy(column, direction)

      return response.status(200).json(stations)
    } catch (e) {
      console.log(e.message)
      return response.status(404).json({ message: 'System not found' })
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
