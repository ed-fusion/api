import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FDevs extends BaseSchema {
  protected tableName = 'fdevs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.text('token').nullable()
      table.string('refresh_token').nullable()
      table.integer('expires').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
