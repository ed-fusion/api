import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Body from 'App/Models/Body'
import BodyRing from './BodyRing'

export default class BodyStar extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bodyId: number

  @column()
  public name: string

  @column()
  public mass: number

  @column()
  public type: string

  @column()
  public distance: number

  @column()
  public isMain: boolean

  @column()
  public absoluteMagnitude: number

  @column()
  public age: number

  @column()
  public axialTilt: number

  @column()
  public eccentricity: number

  @column()
  public inclination: number

  @column()
  public orbitalPeriod: number

  @column()
  public luminosity: string

  @column()
  public temperature: number

  @column()
  public radius: number

  @column()
  public rotationPeriod: number

  @column()
  public subClass: number

  @column()
  public semiMajorAxis: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => BodyRing, {
    localKey: 'id',
    foreignKey: 'bodyId',
  })
  public rings: HasMany<typeof BodyRing>

  @belongsTo(() => Body)
  public body: BelongsTo<typeof Body>
}
