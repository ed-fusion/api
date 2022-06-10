import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import System from 'App/Models/System'
import Body from 'App/Models/Body'

export default class SystemBodiesController {
  private directions = ['asc', 'desc']
  public async index({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async stars({ response, request, params }: HttpContextContract) {
    try {
      const qs = request.qs()
      const columns = ['name', 'type', 'is_main', 'mass', 'distance', 'updated_at']
      const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
      const column = columns.includes(qs.column) ? qs.column : 'name'
      const id = decodeURI(params.system_id)
      const system = await System.findOrFail(id)

      const bodies = await Body.query()
        .where('system_id', system.id)
        .preload('stars', (query) => {
          query.orderBy(column, direction)
        })
        .first()

      if (bodies) {
        return response.status(200).json(bodies)
      } else {
        return response
          .status(200)
          .json({ id: null, system_id: system.id, updated_at: null, planets: [], stars: [] })
      }
    } catch (e) {
      return response.status(404).json({ message: 'System not found' })
    }
  }

  public async planets({ response, request, params }: HttpContextContract) {
    try {
      const qs = request.qs()
      const columns = ['name', 'class', 'atmosphere', 'mass', 'landable', 'distance', 'updated_at']
      const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
      const column = columns.includes(qs.column) ? qs.column : 'name'
      const id = decodeURI(params.system_id)
      const system = await System.findOrFail(id)

      const bodies = await Body.query()
        .where('system_id', system.id)
        .preload('planets', (query) => {
          query.preload('compositions').preload('materials').orderBy(column, direction)
        })
        .first()

      if (bodies) {
        return response.status(200).json(bodies)
      } else {
        return response
          .status(200)
          .json({ id: null, system_id: system.id, updated_at: null, planets: [], stars: [] })
      }
    } catch (e) {
      return response.status(404).json({ message: 'System not found' })
    }
  }
}
