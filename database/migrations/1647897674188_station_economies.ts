import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Economies extends BaseSchema {
  protected tableName = 'station_economies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('station_id').unsigned().references('stations.id').onDelete('CASCADE')
      table.string('name').notNullable()
      table.float('proportion').nullable().defaultTo(0)
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
