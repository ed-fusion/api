import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Body from 'App/Models/Body'
import BodyPlanet from 'App/Models/BodyPlanet'
import BodyStar from 'App/Models/BodyStar'

export default class BodiesController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const qs = request.qs()
      const bodies = await Body.query()
        .select('bodies.*')
        .join('systems', 'systems.id', '=', 'bodies.system_id')
        .preload('system')
        .preload('stars', (query) => {
          query.orderBy('distance', 'asc').preload('rings')
        })
        .preload('planets', (query) => {
          query.orderBy('distance', 'asc').preload('rings')
        })
        .orderBy('systems.distance', 'asc')
        .paginate(qs.page, 10)

      return response.json({ bodies })
    } catch (e) {
      console.log(e)
      return response.status(500).json({ error: e })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    const name = decodeURI(params.id)
    try {
      const star = await BodyStar.query()
        .where('name', name)
        .preload('body', (query) => {
          query.preload('system')
        })
        .firstOrFail()

      return response.json({ star })
    } catch (e) {
      try {
        const planet = await BodyPlanet.query()
          .where('name', name)
          .preload('body', (query) => {
            query.preload('system')
          })
          .preload('materials', (query) => {
            query
              .select('type', 'amount')
              .where('amount', '>', 0)
              .distinct('type')
              .orderBy('updated_at', 'desc')
          })
          .preload('compositions', (query) => {
            query
              .select('type', 'amount')
              .where('amount', '>', 0)
              .distinct('type')
              .orderBy('updated_at', 'desc')
          })
          .firstOrFail()

        return response.json({ planet })
      } catch (e) {
        return response.status(500).json({ error: e })
      }
    }
  }
}
