import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bodies extends BaseSchema {
  protected tableName = 'bodies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('system_id').unsigned().references('systems.id').onDelete('CASCADE')
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
