import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ShipOptional extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public shipId: number

  @column()
  public size: number

  @column()
  public type: string

  @column()
  public module: number
}
