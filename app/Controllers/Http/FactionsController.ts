import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Faction from 'App/Models/Faction'

export default class FactionsController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const qs = request.qs()
      const column = qs.column || 'name'
      const direction = qs.direction || 'asc'
      const factions = await Faction.query().orderBy(column, direction).paginate(qs.page, 25)
      return response.status(200).json(factions)
    } catch (e) {
      return response.status(404).json({ message: 'No Factions found' })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const faction = await Faction.query().where('name', decodeURI(params.id)).firstOrFail()

      await faction.load('allegiance')
      await faction.load('government')

      if (!faction) {
        return response.status(404).json({ error: 'Faction not found' })
      }
      return response.status(200).json(faction)
    } catch (e) {
      return response.status(404).json({ message: 'Faction not found' })
    }
  }

  /*public async indexBySystem({ response, params }: HttpContextContract) {
    try {
      const factions = await SystemFaction.query().where('system_id', params.id).preload('faction')
      return response.status(200).json(factions)
    } catch (e) {
      return response.status(404).json({ message: 'System not found' })
    }
  }*/
}
