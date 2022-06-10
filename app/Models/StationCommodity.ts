import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Station from 'App/Models/Station'
import Commodity from 'App/Models/Commodity'

export default class StationCommodity extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public stationId: number

  @column()
  public commodityId: number

  @column()
  public name: string

  @column()
  public buyPrice: number

  @column()
  public sellPrice: number

  @column()
  public meanPrice: number

  @column()
  public demand: number

  @column()
  public stock: number

  @column()
  public demandBracket: number

  @column()
  public stockBracket: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Station)
  public station: BelongsTo<typeof Station>

  @hasOne(() => Commodity, {
    foreignKey: 'key',
    localKey: 'name',
  })
  public commodity: HasOne<typeof Commodity>
}
