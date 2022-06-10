import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Commodity from 'App/Models/StationCommodity'

export default class TradeRoutesController {
  public async find({ response }: HttpContextContract) {
    const sell = await Commodity.query()
      .preload('station', (stationQuery) => {
        stationQuery.preload('system')
      })
      .whereNotIn('name', [
        'unknownartifact',
        'unknownartifact2',
        'unknownartifact3',
        'unknownbiologicalmatter',
        'unknownresin',
        'unknowntechnologysamples',
      ])
      .orderBy('sell_price', 'desc')
      .orderBy('updated_at', 'desc')
      .groupBy('name')
      .paginate(1, 100)

    const buy = await Promise.all(
      sell.map(async (commodity) => {
        const buyFrom = await Commodity.query()
          .preload('station', (stationQuery) => {
            stationQuery.preload('system')
          })
          .join('stations', (q) => {
            q.on('stations.id', '=', 'commodities.station_id')
          })
          .where('commodities.name', commodity.name)
          .where('buy_price', '<', commodity.sellPrice)
          .where('stock', '>', 100)
          .whereNotIn('stations.type', ['FleetCarrier', ''])
          .where(
            Database.raw(
              `distanceBetweenSystems(${commodity.station.system.id}, stations.system_id)`
            ),
            '<',
            100
          )
          .orderBy('buy_price', 'asc')
          .first()
        if (!buyFrom) {
          return null
        }
        return {
          commodity: commodity.name,
          buyFrom: {
            station: buyFrom?.station.name,
            price: buyFrom?.buyPrice,
            stock: buyFrom?.stock,
          },
          sellTo: {
            station: commodity?.station.name,
            price: commodity?.sellPrice,
            demand: commodity?.demand,
          },
          profit: commodity?.sellPrice - (buyFrom ? buyFrom?.buyPrice : 0),
          distance: await Database.query()
            .select(
              Database.raw(
                `distanceBetweenSystems(${commodity.station.systemId}, ${buyFrom.station.systemId}) as distance`
              )
            )
            .first(),
        }
      })
    )

    const route = buy.filter((item) => item !== null)
    route.sort((a, b) => b!.profit - a!.profit)

    return response.status(200).json(route)
  }
}
