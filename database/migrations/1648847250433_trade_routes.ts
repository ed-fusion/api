import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TradeRoutes extends BaseSchema {
  protected tableName = 'trade_routes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('from_system_id').unsigned().notNullable().references('systems.id')
      table.integer('to_system_id').unsigned().notNullable().references('systems.id')
      table.integer('from_station_id').unsigned().notNullable().references('stations.id')
      table.integer('to_station_id').unsigned().notNullable().references('stations.id')
      table.integer('commodity_id').unsigned().notNullable().references('station_commodities.id')
      table.float('distance').notNullable().defaultTo('0.0')

      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
