import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

import Station from 'App/Models/Station'
import Module from 'App/Models/Module'

export default class StationModule extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public stationId: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Station)
  public station: BelongsTo<typeof Station>

  @hasOne(() => Module, {
    localKey: 'name',
    foreignKey: 'key',
  })
  public module: HasOne<typeof Module>
}
