import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Ship from 'App/Models/Ship'
import Station from 'App/Models/Station'
export default class StationShip extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public stationId: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Ship, {
    localKey: 'name',
    foreignKey: 'key',
  })
  public ship: HasOne<typeof Ship>

  @belongsTo(() => Station, {
    localKey: 'id',
    foreignKey: 'stationId',
  })
  public station: BelongsTo<typeof Station>
}
