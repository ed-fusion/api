import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BodyPlanetMaterials extends BaseSchema {
  protected tableName = 'body_planet_materials'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('body_planet_id').unsigned().references('body_planets.id').onDelete('CASCADE')
      table.string('type').notNullable()
      table.float('amount', 8, 4).notNullable()
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
