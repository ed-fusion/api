import { BaseCommand } from '@adonisjs/core/build/standalone'

import axios from 'axios'
import FormData from 'form-data'
import FDev from 'App/Models/FDev'

export default class FDevUpdate extends BaseCommand {
  private CLIENT_ID = '347160bb-4371-4681-8b01-1a6b3ff20e47'
  private TOKEN_URL = 'https://auth.frontierstore.net/token'
  /**
   * Command name is used to run the command
   */
  public static commandName = 'fdev:update'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    this.logger.info('Running refresh command')
    const fdevs = await FDev.all()
    const time = Math.floor(Date.now() / 1000)
    fdevs.forEach(async (fdev) => {
      if (fdev.expires - time <= 0) {
        this.logger.info(`Refreshing ${fdev.id}`)
        const params = {
          grant_type: 'refresh_token',
          client_id: this.CLIENT_ID,
          refresh_token: fdev.refresh_token,
        }
        const form = new FormData()
        for (const key in params) {
          form.append(key, params[key])
        }
        try {
          const res = await axios.post(this.TOKEN_URL, form, {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
            },
          })
          this.logger.info(res.data)
          const payload = {
            token: res.data.access_token,
            refresh_token: res.data.refresh_token,
            expires: time + res.data.expires_in,
          }
          await FDev.updateOrCreate({ userId: fdev.id }, payload)
        } catch (e) {
          this.logger.error(e)
        }
      }
    })
  }
}
