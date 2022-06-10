import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ShipStats extends BaseSchema {
  protected tableName = 'ship_stats'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('ship_id').unsigned().notNullable()
      table.string('size').notNullable()
      table.integer('crew').notNullable()
      table.integer('hull').notNullable()
      table.integer('agility').notNullable()
      table.integer('shield').notNullable()
      table.integer('speed').notNullable()
      table.integer('boost').notNullable()
      table.integer('mass_lock').notNullable()
      table.integer('armour').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
