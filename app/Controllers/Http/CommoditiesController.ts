import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Commodity from 'App/Models/Commodity'
import StationCommodity from 'App/Models/StationCommodity'
//import StationCommodity from 'App/Models/StationCommodity'

export default class CommoditiesController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const qs = request.qs()
      const commodities = await Commodity.query().orderBy(qs.column, qs.direction)
      return response.status(200).json({ commodities })
    } catch (e) {
      console.log(e)
      return response.status(500).json({ error: e.message })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const commodities = await Commodity.query().where('name', decodeURI(params.id)).first()
      return response.status(200).json(commodities)
    } catch (e) {
      console.log(e)
      return response.status(500).json({ error: e.message })
    }
  }

  public async categories({ response }: HttpContextContract) {
    try {
      const categories = await Commodity.query().distinct('category')
      return response.status(200).json(categories)
    } catch (e) {
      return response.status(500).json({ error: e.message })
    }
  }

  public async prices({ response, request }: HttpContextContract) {
    try {
      const qs = request.qs()
      console.log(qs)
      const commodity = await StationCommodity.query()
        .where('name', decodeURI(qs.name))
        .avg({ avgBuy: 'buy_price', avgSell: 'sell_price' })

      return response.status(200).json(commodity[0].$extras)
    } catch (e) {
      return response.status(500).json({ error: e.message })
    }
  }
}
