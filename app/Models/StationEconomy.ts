import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Station from 'App/Models/Station'
import Economy from 'App/Models/Economy'

export default class StationEconomy extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public stationId: number

  @column()
  public name: string

  @column()
  public proportion: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Station)
  public station: BelongsTo<typeof Station>

  @hasOne(() => Economy, {
    foreignKey: 'key',
    localKey: 'name',
  })
  public economy: HasOne<typeof Economy>
}
