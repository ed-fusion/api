import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

import System from 'App/Models/System'
import Station from 'App/Models/Station'
import Commodity from 'App/Models/StationCommodity'

export default class TradeRoute extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fromSystemId: number

  @column()
  public toSystemId: number

  @column()
  public fromStationId: number

  @column()
  public toStationId: number

  @column()
  public commodityId: number

  @column()
  public distance: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => System, {
    foreignKey: 'id',
    localKey: 'fromSystemId',
  })
  public fromSystem: HasOne<typeof System>

  @hasOne(() => Station, {
    foreignKey: 'id',
    localKey: 'fromSystemId',
  })
  public fromStation: HasOne<typeof Station>

  @hasOne(() => System, {
    foreignKey: 'id',
    localKey: 'toSystemId',
  })
  public toSystem: HasOne<typeof System>

  @hasOne(() => Station, {
    foreignKey: 'id',
    localKey: 'toStationId',
  })
  public toStation: HasOne<typeof Station>

  @hasOne(() => Commodity, {
    foreignKey: 'id',
    localKey: 'commodityId',
  })
  public commodity: HasOne<typeof Commodity>
}
