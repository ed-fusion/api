import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

import Faction from 'App/Models/Faction'
import Station from 'App/Models/Station'

export default class StationFaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public stationId: number

  @column()
  public factionId: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Station)
  public station: BelongsTo<typeof Station>

  @hasOne(() => Faction, {
    foreignKey: 'id',
    localKey: 'factionId',
  })
  public faction: HasOne<typeof Faction>
}
