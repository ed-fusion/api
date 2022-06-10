import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

import Faction from 'App/Models/Faction'
import System from 'App/Models/System'

export default class SystemFaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public systemId: number

  @column()
  public factionId: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => System)
  public system: BelongsTo<typeof System>

  @hasOne(() => Faction, {
    foreignKey: 'id',
    localKey: 'factionId',
  })
  public faction: HasOne<typeof Faction>
}
