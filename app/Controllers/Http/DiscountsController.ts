import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Discount from 'App/Models/Discount'

export default class DiscountsController {
  public async index({ response }: HttpContextContract) {
    try {
      const discounts = await Discount.all()
      return response.status(200).json(discounts)
    } catch (e) {
      return response.status(500).json({ error: e.message })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const discount = await Discount.query().where('system_name', decodeURI(params.id))
      if (!discount) {
        return response.status(200).json([])
      }
      return response.status(200).json(discount)
    } catch (e) {
      return response.status(500).json({ error: e.message })
    }
  }
}
