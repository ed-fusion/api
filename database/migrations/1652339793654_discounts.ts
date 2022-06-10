import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Discounts extends BaseSchema {
  protected tableName = 'discounts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('system_name')
      table.string('stations').defaultTo('-')
      table.string('manufacturer').defaultTo('-')
      table.text('ships')
      table.text('modules')
      table.float('discount').defaultTo(0)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
