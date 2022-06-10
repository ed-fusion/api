import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ShipCores extends BaseSchema {
  protected tableName = 'ship_cores'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('ship_id').unsigned().notNullable()
      table.string('power_plant')
      table.string('thrusters')
      table.string('fsd')
      table.string('life_support')
      table.string('power_distributor')
      table.string('sensor')
      table.string('fuel_tank')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
