import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stations extends BaseSchema {
  protected tableName = 'stations'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('large_pads').defaultTo(0).after('distance_from_star')
      table.integer('medium_pads').defaultTo(0).after('large_pads')
      table.integer('small_pads').defaultTo(0).after('medium_pads')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('large_pads')
      table.dropColumn('medium_pads')
      table.dropColumn('small_pads')
    })
  }
}
