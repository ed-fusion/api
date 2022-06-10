import { BaseModel, column, hasOne, HasOne, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import ShipCore from 'App/Models/ShipCore'
import ShipHardpoint from 'App/Models/ShipHardpoint'
import ShipOptional from 'App/Models/ShipOptional'

export default class ShipStats extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public shipId: number

  @column()
  public size: string

  @column()
  public crew: number

  @column()
  public hull: number

  @column()
  public agility: number

  @column()
  public shield: number

  @column()
  public speed: number

  @column()
  public boost: number

  @column()
  public massLock: number

  @column()
  public utility: string

  @column()
  public armour: number

  @column()
  public description: string

  @hasOne(() => ShipCore, {
    localKey: 'shipId',
    foreignKey: 'shipId',
  })
  public core: HasOne<typeof ShipCore>

  @hasMany(() => ShipOptional, {
    localKey: 'shipId',
    foreignKey: 'shipId',
  })
  public optionals: HasMany<typeof ShipOptional>

  @hasMany(() => ShipHardpoint, {
    localKey: 'shipId',
    foreignKey: 'shipId',
  })
  public hardpoints: HasMany<typeof ShipHardpoint>
}
