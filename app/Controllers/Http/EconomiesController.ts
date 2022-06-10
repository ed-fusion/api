import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Economy from 'App/Models/Economy'

export default class EconomiesController {
  public async index({ response }: HttpContextContract) {
    try {
      const ecnomies = await Economy.all()
      return response.status(200).json(ecnomies)
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
