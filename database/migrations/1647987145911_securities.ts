import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SecurityNames extends BaseSchema {
  protected tableName = 'securities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('key')
      table.string('name')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
