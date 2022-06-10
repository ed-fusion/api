import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stations extends BaseSchema {
  protected tableName = 'stations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('system_id').unsigned().references('systems.id').onDelete('CASCADE')
      table.bigInteger('market_id').notNullable().defaultTo(0)
      table.integer('allegiance_id').notNullable().defaultTo(1)
      table.integer('government_id').notNullable().defaultTo(10)
      table.integer('economy_id').notNullable().defaultTo(7)
      table.string('name').notNullable()
      table.float('distance_from_star').notNullable().defaultTo(0)
      table.string('max_landing_pad_size').notNullable().defaultTo('')
      table.string('type').notNullable().defaultTo('')
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
