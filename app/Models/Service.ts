import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public shown: boolean

  @column()
  public name: string

  @column()
  public key: string
}
