import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ships extends BaseSchema {
  protected tableName = 'ships'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('manufacturer').notNullable().after('name')
      table.string('rank').notNullable().defaultTo('').after('price')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('manufacturer')
      table.dropColumn('rank')
    })
  }
}
