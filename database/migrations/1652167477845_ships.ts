import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ships extends BaseSchema {
  protected tableName = 'ships'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('key')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
