import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Security from 'App/Models/Security'

export default class SecuritiesController {
  public async index({ response }: HttpContextContract) {
    try {
      const securities = await Security.all()
      return response.status(200).json(securities)
    } catch (e) {
      return response.status(500).json({
        error: e.message,
      })
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
