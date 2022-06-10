import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Modules extends BaseSchema {
  protected tableName = 'modules'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('key')
      table.string('category')
      table.string('mount').nullable()
      table.string('guidance').nullable()
      table.string('ship').nullable()
      table.string('class')
      table.string('rating')
      table.integer('price').unsigned().defaultTo(0)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
