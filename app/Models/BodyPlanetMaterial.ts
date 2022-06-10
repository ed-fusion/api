import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import BodyPlanet from 'App/Models/BodyPlanet'

export default class BodyPlanetMaterial extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bodyPlanetId: number

  @column()
  public type: string

  @column()
  public amount: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => BodyPlanet)
  public body: BelongsTo<typeof BodyPlanet>
}
