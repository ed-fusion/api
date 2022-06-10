import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Factions extends BaseSchema {
  protected tableName = 'factions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('government_id')
      table.integer('allegiance_id')
      table.string('name')
      table.string('state')
      table.float('influence')
      table.string('active_states')
      table.string('pending_states')
      table.string('recovering_states')
      table.string('happiness')

      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
