import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public typeId: number

  @column()
  public event: string

  @column()
  public schema: string

  @column()
  public software: string

  @column()
  public softwareVersion: string

  @column()
  public message: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
