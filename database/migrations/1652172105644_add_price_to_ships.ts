import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ships extends BaseSchema {
  protected tableName = 'ships'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('price').unsigned().defaultTo(0).after('key')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('price')
    })
  }
}
