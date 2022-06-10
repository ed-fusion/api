import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import StationCommodity from 'App/Models/StationCommodity'

export default class Commodity extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public commodityId: number

  @column()
  public key: string

  @column()
  public name: string

  @column()
  public avgSell: number

  @column()
  public avgBuy: number

  @column()
  public maxSell: number

  @column()
  public maxBuy: number

  @column()
  public minSell: number

  @column()
  public minBuy: number

  @column()
  public category: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => StationCommodity, {
    localKey: 'key',
    foreignKey: 'name',
  })
  public stationCommodities: HasMany<typeof StationCommodity>
}
