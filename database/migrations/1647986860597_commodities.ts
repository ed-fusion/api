import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CommodityNames extends BaseSchema {
  protected tableName = 'commodities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('commodity_id').notNullable().defaultTo(0)
      table.string('key')
      table.string('name')
      table.string('category')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
