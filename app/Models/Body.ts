import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import System from 'App/Models/System'

import BodyStar from 'App/Models/BodyStar'
import BodyPlanet from 'App/Models/BodyPlanet'
export default class Body extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public systemId: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => System)
  public system: BelongsTo<typeof System>

  @hasMany(() => BodyStar)
  public stars: HasMany<typeof BodyStar>

  @hasMany(() => BodyPlanet)
  public planets: HasMany<typeof BodyPlanet>
}
