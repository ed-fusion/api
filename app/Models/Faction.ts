import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import SuperPower from 'App/Models/SuperPower'
import Government from 'App/Models/Government'
import Happiness from 'App/Models/Happiness'

export default class Faction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public governmentId: number

  @column()
  public allegianceId: number

  @column()
  public name: string

  @column()
  public influence: number

  @column()
  public state: string

  @column()
  public activeStates: string

  @column()
  public pendingStates: string

  @column()
  public recoveringStates: string

  @column()
  public happiness: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => SuperPower, {
    foreignKey: 'id',
    localKey: 'allegianceId',
  })
  public allegiance: HasOne<typeof SuperPower>

  @hasOne(() => Government, {
    foreignKey: 'id',
    localKey: 'governmentId',
  })
  public government: HasOne<typeof Government>

  @hasOne(() => Happiness, {
    foreignKey: 'name',
    localKey: 'key',
  })
  public happinessNice: HasOne<typeof Happiness>
}
