import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class BodyRing extends BaseModel {
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
  public innerRad: number

  @column()
  public outerRad: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
