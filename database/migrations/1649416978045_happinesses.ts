import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Happinesses extends BaseSchema {
  protected tableName = 'happinesses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('key').notNullable()
      table.string('name').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
