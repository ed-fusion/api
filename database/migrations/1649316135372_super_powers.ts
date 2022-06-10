import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SuperPowers extends BaseSchema {
  protected tableName = 'super_powers'

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
