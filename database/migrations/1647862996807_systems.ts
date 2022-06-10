import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Systems extends BaseSchema {
  protected tableName = 'systems'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('position').notNullable().defaultTo('0;0;0')
      table.bigInteger('address').notNullable().defaultTo(0)
      table.integer('primary_economy_id').notNullable().defaultTo(7)
      table.integer('security_id').notNullable().defaultTo(1)
      table.integer('government_id').notNullable().defaultTo(10)
      table.integer('allegiance_id').notNullable().defaultTo(5)
      table.bigInteger('population').notNullable().defaultTo(0)

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
