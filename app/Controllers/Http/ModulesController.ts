import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Module from 'App/Models/Module'

export default class ModulesController {
  public async index({ response }: HttpContextContract) {
    try {
      const modules = await Module.query().orderBy('name', 'asc')
      return response.json(modules)
    } catch (error) {
      return response.status(500).json({ error })
    }
  }
}
