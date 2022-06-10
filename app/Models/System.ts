import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
  beforeSave,
} from '@ioc:Adonis/Lucid/Orm'
import Station from 'App/Models/Station'
import Government from 'App/Models/Government'
import Economy from 'App/Models/Economy'
import Security from 'App/Models/Security'
import SuperPower from 'App/Models/SuperPower'
import SystemFaction from 'App/Models/SystemFaction'
import Body from 'App/Models/Body'

export default class System extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public needsPermit: boolean

  @column()
  public primaryEconomyId: number

  @column()
  public securityId: number

  @column()
  public governmentId: number

  @column()
  public allegianceId: number

  @column()
  public name: string

  @column()
  public position: string

  @column()
  public address: number

  @column()
  public population: number

  @column()
  public distance: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Station)
  public stations: HasMany<typeof Station>

  @hasOne(() => Government, {
    foreignKey: 'id',
    localKey: 'governmentId',
  })
  public government: HasOne<typeof Government>

  @hasOne(() => Economy, {
    foreignKey: 'id',
    localKey: 'primaryEconomyId',
  })
  public primaryEconomy: HasOne<typeof Economy>

  @hasOne(() => Security, {
    foreignKey: 'id',
    localKey: 'securityId',
  })
  public security: HasOne<typeof Security>

  @hasOne(() => SuperPower, {
    foreignKey: 'id',
    localKey: 'allegianceId',
  })
  public allegiance: HasOne<typeof SuperPower>

  @hasMany(() => SystemFaction)
  public factions: HasMany<typeof SystemFaction>

  @hasMany(() => Body)
  public bodies: HasMany<typeof Body>

  @beforeSave()
  public static async calculateDistance(system: System) {
    const [x, y, z] = system.position.split(';')
    const distance = Math.pow(
      Math.pow(parseFloat(x) - 0, 2) +
        Math.pow(parseFloat(y) - 0, 2) +
        Math.pow(parseFloat(z) - 0, 2),
      0.5
    )
    system.distance = parseFloat(distance.toFixed(2))
  }
}
