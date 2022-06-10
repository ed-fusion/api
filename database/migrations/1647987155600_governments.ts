import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GovernmentNames extends BaseSchema {
  protected tableName = 'governments'

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
