import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ShipCore extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public shipId: number

  @column()
  public powerPlant: string

  @column()
  public thrusters: string

  @column()
  public fsd: string

  @column()
  public lifeSupport: string

  @column()
  public powerDistributor: string

  @column()
  public sensor: string

  @column()
  public fuelTank: string

  @column()
  public armour: string
}
