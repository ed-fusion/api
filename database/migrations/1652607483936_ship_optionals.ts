import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ShipOptionals extends BaseSchema {
  protected tableName = 'ship_optionals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('ship_id').unsigned().notNullable()
      table.string('size')
      table.string('type')
      table.string('module')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
