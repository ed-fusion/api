import { BaseCommand } from '@adonisjs/core/build/standalone'

import Commodity from 'App/Models/Commodity'
import StationCommodity from 'App/Models/StationCommodity'

export default class UpdateCommodityPrices extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:commodity'

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
    const count = await Commodity.query().count('id as count')
    const offset = Math.ceil(count[0].$extras.count / 10)

    for (let i = 0; i < offset; i++) {
      await this.updatePricing(i * 10)
    }
  }

  private async updatePricing(offset) {
    const commodities = await Commodity.query().offset(offset).limit(10)
    const pricing = await Promise.all(
      commodities.map(async (commodity) => {
        this.logger.info(`Fetching pricelist for ${commodity.name}`)
        const minSell = await StationCommodity.query()
          .where('name', commodity.key)
          .where('sell_price', '>', 0)
          .min({ minSell: 'sell_price' })
        const minBuy = await StationCommodity.query()
          .where('name', commodity.key)
          .where('buy_price', '>', 0)
          .min({ minBuy: 'buy_price' })
        const max = await StationCommodity.query()
          .where('name', commodity.key)
          .max({ maxSell: 'sell_price', maxBuy: 'buy_price' })
        const avg = await StationCommodity.query()
          .where('name', commodity.key)
          .avg({ avgSell: 'sell_price', avgBuy: 'buy_price' })
        return {
          commodity: commodity.key,
          ...minSell[0].$extras,
          ...minBuy[0].$extras,
          ...max[0].$extras,
          ...avg[0].$extras,
        }
      })
    )
    pricing.forEach(async (price: any) => {
      this.logger.info(`Updating pricelist for ${price.commodity}`)
      try {
        await Commodity.query()
          .where('key', price.commodity)
          .update({
            avgSell: price.avgSell ? price.avgSell : 0,
            avgBuy: price.avgBuy ? price.avgBuy : 0,
            maxSell: price.maxSell ? price.maxSell : 0,
            maxBuy: price.maxBuy ? price.maxBuy : 0,
            minSell: price.minSell ? price.minSell : 0,
            minBuy: price.minBuy ? price.minBuy : 0,
            updatedAt: new Date(),
          })
      } catch (e) {
        this.logger.error(e)
      }
    })
  }
}
