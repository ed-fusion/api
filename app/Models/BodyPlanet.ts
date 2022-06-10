import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Body from 'App/Models/Body'
import BodyRing from 'App/Models/BodyRing'
import BodyPlanetComposition from 'App/Models/BodyPlanetComposition'
import BodyPlanetMaterial from 'App/Models/BodyPlanetMaterial'

export default class BodyPlanet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bodyId: number

  @column()
  public name: string

  @column()
  public mass: number

  @column()
  public class: string

  @column()
  public atmosphere: string

  @column()
  public landable: boolean

  @column()
  public axialTilt: number

  @column()
  public eccentricity: number

  @column()
  public inclination: number

  @column()
  public orbitalPeriod: number

  @column()
  public periapsis: number

  @column()
  public radius: number

  @column()
  public rotationPeriod: number

  @column()
  public semiMajorAxis: number

  @column()
  public surfaceGravity: number

  @column()
  public surfaceTemperature: number

  @column()
  public surfacePressure: number

  @column()
  public terraformState: string

  @column()
  public volcanism: string

  @column()
  public distance: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Body)
  public body: BelongsTo<typeof Body>

  @hasMany(() => BodyRing, {
    localKey: 'id',
    foreignKey: 'bodyId',
  })
  public rings: HasMany<typeof BodyRing>

  @hasMany(() => BodyPlanetComposition)
  public compositions: HasMany<typeof BodyPlanetComposition>

  @hasMany(() => BodyPlanetMaterial)
  public materials: HasMany<typeof BodyPlanetMaterial>
}
