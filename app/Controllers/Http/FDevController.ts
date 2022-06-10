import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import FDev from 'App/Models/FDev'

import Axios from 'axios'
import crypto from 'crypto'
import FormData from 'form-data'

export default class FDevController {
  private CLIENT_ID = '347160bb-4371-4681-8b01-1a6b3ff20e47'
  private AUTH_URL = 'https://auth.frontierstore.net/auth'
  private TOKEN_URL = 'https://auth.frontierstore.net/token'
  private ENDPOINT = 'https://companion.orerve.net'
  private CALLBACK_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://ed-fusion.com/frontier'
      : 'http://localhost:3000/frontier'

  public async url({ response }: HttpContextContract) {
    try {
      const statesting = this.base64URLEncode(crypto.randomBytes(32))
      const verifier = this.base64URLEncode(crypto.randomBytes(32))
      const challenge = this.base64URLEncode(this.sha256(verifier))
      const params = {
        audience: 'all',
        scope: 'auth capi',
        response_type: 'code',
        client_id: this.CLIENT_ID,
        code_challenge: challenge,
        code_challenge_method: 'S256',
        state: statesting,
        redirect_uri: this.CALLBACK_URL,
      }
      const url = this.AUTH_URL + '?' + new URLSearchParams(params).toString()
      return response.status(200).json({ url, verifier })
    } catch (e) {
      console.log(e)
      return response.status(500).json({ error: e.message })
    }
  }

  public async token({ response, request, auth }: HttpContextContract) {
    try {
      const user = await FDev.query().where('user_id', auth.user!.id).first()
      const time = Math.floor(Date.now() / 1000)
      if (!user || !user.expires || user.expires < time) {
        const params = {
          redirect_uri: this.CALLBACK_URL,
          code: request.input('code'),
          grant_type: 'authorization_code',
          client_id: this.CLIENT_ID,
          code_verifier: request.input('verifier'),
        }
        const form = new FormData()
        for (const key in params) {
          form.append(key, params[key])
        }
        const res = await Axios.post(this.TOKEN_URL, form, {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
        })
        const payload = {
          token: res.data.access_token,
          refresh_token: res.data.refresh_token,
          expires: time + res.data.expires_in,
        }
        const fdev = await FDev.updateOrCreate({ userId: auth.user!.id }, payload)
        if (fdev) {
          return response.status(200).json({ connected: true })
        } else {
          return response.status(200).json({ connected: false })
        }
      } else {
        return response.status(200).json({ connected: true })
      }
    } catch (e) {
      console.log(e)
      return response.status(500).json({ error: e.message })
    }
  }

  public async profile({ response, auth }: HttpContextContract) {
    try {
      const fdev = await FDev.findBy('user_id', auth.user!.id)
      if (fdev) {
        const res = await Axios.get(`${this.ENDPOINT}/profile`, {
          headers: {
            Authorization: `Bearer ${fdev.token}`,
          },
        })
        return response.json(res.data)
      } else {
        return response.status(500).json({ error: 'Failed to get profile' })
      }
    } catch (e) {
      console.log(e)
      return response.status(500).json({ error: e.message })
    }
  }

  private base64URLEncode(str) {
    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  private sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest()
  }
}
