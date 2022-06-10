import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ShipHardpoint extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public shipId: number

  @column()
  public size: string

  @column()
  public module: string
}
