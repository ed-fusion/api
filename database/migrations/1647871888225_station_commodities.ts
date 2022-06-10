import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Commodities extends BaseSchema {
  protected tableName = 'station_commodities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('station_id').unsigned().references('stations.id').onDelete('CASCADE')
      table.integer('commodity_id').notNullable().defaultTo(0)
      table.string('name').notNullable()
      table.integer('buy_price', 12).notNullable()
      table.integer('mean_price', 12).notNullable()
      table.integer('sell_price', 12).notNullable()
      table.integer('demand', 12).notNullable()
      table.integer('stock', 12).notNullable()
      table.integer('demand_bracket').notNullable()
      table.integer('stock_bracket').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
