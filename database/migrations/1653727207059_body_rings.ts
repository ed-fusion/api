import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BodyRings extends BaseSchema {
  protected tableName = 'body_rings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('body_id').unsigned().notNullable()
      table.string('name').notNullable()
      table.bigInteger('mass').notNullable()
      table.string('class').notNullable()
      table.bigInteger('inner_rad').notNullable()
      table.bigInteger('outer_rad').notNullable()
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
