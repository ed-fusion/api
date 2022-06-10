import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import System from 'App/Models/System'
import Economy from 'App/Models/Economy'
import Government from 'App/Models/Government'
import StationEconomy from 'App/Models/StationEconomy'
import StationFaction from 'App/Models/StationFaction'
import StationCommodity from 'App/Models/StationCommodity'
import StationService from 'App/Models/StationService'
import StationShip from 'App/Models/StationShip'
import StationModule from 'App/Models/StationModule'
import SuperPower from 'App/Models/SuperPower'

export default class Station extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public systemId: number

  @column()
  public marketId: number

  @column()
  public allegianceId: number

  @column()
  public economyId: number

  @column()
  public governmentId: number

  @column()
  public name: string

  @column()
  public distanceFromStar: number

  @column()
  public largePads: number

  @column()
  public mediumPads: number

  @column()
  public smallPads: number

  @column()
  public maxLandingPadSize: string

  @column()
  public type: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => System)
  public system: BelongsTo<typeof System>

  @hasOne(() => Government, {
    foreignKey: 'id',
    localKey: 'governmentId',
  })
  public government: HasOne<typeof Government>

  @hasOne(() => SuperPower, {
    foreignKey: 'id',
    localKey: 'allegianceId',
  })
  public allegiance: HasOne<typeof SuperPower>

  @hasOne(() => Economy, {
    foreignKey: 'id',
    localKey: 'economyId',
  })
  public economy: HasOne<typeof Economy>

  @hasOne(() => StationFaction)
  public faction: HasOne<typeof StationFaction>

  @hasMany(() => StationEconomy)
  public economies: HasMany<typeof StationEconomy>

  @hasMany(() => StationCommodity)
  public commodities: HasMany<typeof StationCommodity>

  @hasMany(() => StationService)
  public services: HasMany<typeof StationService>

  @hasMany(() => StationShip)
  public ships: HasMany<typeof StationShip>

  @hasMany(() => StationModule)
  public modules: HasMany<typeof StationModule>
}
