import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Discount extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public systemName: string

  @column()
  public stations: string

  @column()
  public manufacturer: string

  @column()
  public ships: string

  @column()
  public modules: string

  @column()
  public discount: number
}
