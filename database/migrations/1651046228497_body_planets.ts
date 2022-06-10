import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BodyPlanets extends BaseSchema {
  protected tableName = 'body_planets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('body_id').unsigned().references('bodies.id').onDelete('CASCADE')
      table.string('name').notNullable()
      table.float('mass', 24, 2).notNullable()
      table.string('class').notNullable()
      table.string('atmosphere').notNullable()
      table.boolean('landable').notNullable().defaultTo(false)
      table.float('distance', 16, 8).notNullable()

      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
