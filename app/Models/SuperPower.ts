import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SuperPower extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public key: string

  @column()
  public name: string
}
