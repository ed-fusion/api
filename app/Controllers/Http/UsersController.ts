import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async signup({ response, request }: HttpContextContract) {
    const user = await User.create({
      name: request.input('username'),
      email: request.input('email'),
      password: request.input('password'),
    })

    user.related('profile').create({ image: request.input('image') })

    return response.json({ user })
  }

  public async show({}: HttpContextContract) {}

  public async me({ response, auth }: HttpContextContract) {
    try {
      if (auth.user) {
        const user = await User.query()
          .select('id', 'name', 'email')
          .where('id', auth.user!.id)
          .preload('profile')
          .first()
        return response.json({ user })
      } else {
        console.log(auth.user)
        return response.json({ error: 'Not authenticated' })
      }
    } catch (e) {
      console.log(e)
      return response.json({ error: 'Not authenticated' })
    }
  }

  public async update({ response, request, auth }: HttpContextContract) {
    try {
      if (auth.user) {
        const user = await User.findOrFail(auth.user!.id)
        if (request.input('password')) {
          user.password = request.input('password')
          user.save()
        }
        if (request.input('image')) {
          await user.related('profile').updateOrCreate(
            {},
            {
              image: request.input('image'),
            }
          )
        }
        return response.json({ message: 'Successfully updated', user })
      } else {
        console.log(auth.user)
        return response.json({ error: 'Not authenticated' })
      }
    } catch (e) {
      console.log(e)
      return response.json({ error: 'Not authenticated' })
    }
  }

  public async destroy({}: HttpContextContract) {}

  public async hash({ response }: HttpContextContract) {
    const hash = await Hash.make('password')
    return response.status(200).json({ hash })
  }

  public async login({ auth, response, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    try {
      const token = await auth.use('api').attempt(email, password)
      return response.json({ token: token.token, type: 'Bearer' })
    } catch {
      return response.status(401).json({ error: 'Unauthorized' })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').logout()
    await auth.use('api').revoke()
    return response.json({ message: 'Successfully logged out' })
  }
}
