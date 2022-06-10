import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Systems extends BaseSchema {
  protected tableName = 'systems'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('distance').notNullable().defaultTo(0.0).after('population')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('distance')
    })
  }
}
