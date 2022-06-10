import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import SuperPower from 'App/Models/SuperPower'

export default class AllegiancesController {
  public async index({ response }: HttpContextContract) {
    try {
      const superPowers = await SuperPower.all()
      return response.status(200).json(superPowers)
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
