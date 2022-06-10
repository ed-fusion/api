import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Module extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public key: string

  @column()
  public category: string

  @column()
  public mount: string

  @column()
  public guidance: string

  @column()
  public ship: string

  @column()
  public class: string

  @column()
  public rating: string

  @column()
  public price: number
}
