import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BodyStars extends BaseSchema {
  protected tableName = 'body_stars'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('body_id').unsigned().references('bodies.id').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('type').notNullable().defaultTo('-')
      table.boolean('is_main').defaultTo(false)
      table.float('mass', 24, 2).notNullable()
      table.float('distance', 24, 2).notNullable()
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
