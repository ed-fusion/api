import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Commodity from 'App/Models/StationCommodity'

export default class TradesController {
  public async indexRoutes({ response }: HttpContextContract) {
    const loop = await this.getRoute()

    return response.json({ loop })
  }

  /*private async returnRoute(stationParam, commoditiesParam) {
    const station = await Station.query()
      .where('id', stationParam.id)
      .preload('commodities', (CommoditiesQuery) => {
        CommoditiesQuery.where('id', commoditiesParam.id)
      })

    return station
  }*/

  private async stationWithDemand(commodityParams) {
    //console.log(commodity)
    const commodities = await Commodity.query()
      .where('name', commodityParams.name)
      .andWhere('demand', '>', 5000)
      .andWhere('sell_price', '>', commodityParams.buyPrice)
      .whereNot('station_id', commodityParams.stationId)
      .preload('station', (stationQuery) => {
        stationQuery.whereNot('type', 'FleetCarrier').preload('system', (systemQuery) => {
          systemQuery.whereNot('position', '0;0;0')
        })
      })
      .orderBy('sell_price', 'desc')
    const com = Promise.all(
      commodities.map(async (commodity) => {
        console.log(commodity.station.system === null ? 'null' : commodity.station.system.name)
        return {
          commodity: commodity.name,
          sellPrice: commodity.sellPrice,
          station: commodity.station,
          distance: 0, //await this.calcDist(commodity.station.system, commodityParams.station.system),
          demand: commodity.demand,
          profit: commodity.sellPrice - commodityParams.buyPrice,
        }
      })
    )
    //.toSQL()
    return com
  }

  private async getRoute() {
    const commodities = await Commodity.query()
      .where('name', 'Aluminium')
      .where('stock', '>', 5000)
      .preload('station', (stationQuery) => {
        stationQuery.preload('system')
      })
      .limit(1)
    const com = await Promise.all(
      commodities.map(async (commodity) => {
        const demandStations = await this.stationWithDemand(commodity)
        const stations = demandStations.filter((station) => {
          if (station.distance < 150) {
            return station
          }
        })
        return {
          commodity: commodity.name,
          buyPrice: commodity.buyPrice,
          stock: commodity.stock,
          supplyStation: commodity.station,
          demandStations: stations,
        }
      })
    )

    return com
  }

  /*private async calcDist(systemOne, systemTwo) {
    const [x1, y1, z1] = systemOne.position.split(';').map(Number)
    const [x2, y2, z2] = systemTwo.position.split(';').map(Number)
    const distance = Math.pow(
      Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2),
      0.5
    )
    return parseFloat(distance.toFixed(2))
  }*/
}
