import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Service from 'App/Models/Service'

export default class StationService extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public stationId: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Service, {
    foreignKey: 'key',
    localKey: 'name',
  })
  public service: HasOne<typeof Service>
}
