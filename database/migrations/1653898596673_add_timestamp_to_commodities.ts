import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Commodities extends BaseSchema {
  protected tableName = 'commodities'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('updated_at', { useTz: true }).after('avg_buy')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('updated_at')
    })
  }
}
