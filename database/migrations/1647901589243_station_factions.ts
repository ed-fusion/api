import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Factions extends BaseSchema {
  protected tableName = 'station_factions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('station_id').unsigned().references('stations.id').onDelete('CASCADE')
      table.integer('faction_id').unsigned().references('factions.id')
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
