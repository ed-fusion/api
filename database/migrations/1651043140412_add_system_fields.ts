import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Systems extends BaseSchema {
  protected tableName = 'systems'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('needs_permit').notNullable().defaultTo(false).after('address')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('type')
      table.dropColumn('needs_permit')
    })
  }
}
