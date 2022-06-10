import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StationServices extends BaseSchema {
  protected tableName = 'station_services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('station_id')
        .unsigned()
        .references('id')
        .inTable('stations')
        .onDelete('CASCADE')
      table.string('name')
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
