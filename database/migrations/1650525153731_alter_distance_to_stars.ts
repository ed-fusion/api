import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stations extends BaseSchema {
  protected tableName = 'stations'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('distance_from_star', 24, 2).notNullable().defaultTo(0).alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('distance_from_star').notNullable().defaultTo(0).alter()
    })
  }
}
