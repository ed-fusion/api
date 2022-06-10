import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Service from 'App/Models/Service'

export default class ServicesController {
  public async index({ response }: HttpContextContract) {
    const services = await Service.query().where('shown', true).orderBy('name', 'asc')
    return response.json(services)
  }
}
