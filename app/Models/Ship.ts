import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import ShipStats from 'App/Models/ShipStats'

export default class Ship extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public manufacturer: string

  @column()
  public key: string

  @column()
  public price: number

  @column()
  public rank: string

  @hasOne(() => ShipStats)
  public stats: HasOne<typeof ShipStats>
}
