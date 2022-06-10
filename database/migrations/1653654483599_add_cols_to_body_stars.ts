import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BodyStars extends BaseSchema {
  protected tableName = 'body_stars'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('sub_class').nullable().after('mass')
      table.float('rotation_period', 24, 8).nullable().after('sub_class')
      table.bigInteger('radius').nullable().after('rotation_period')
      table.bigInteger('temperature').nullable().after('radius')
      table.string('luminosity').nullable().after('temperature')
      table.float('orbital_period', 24, 8).nullable().after('luminosity')
      table.float('inclination', 24, 8).nullable().after('orbital_period')
      table.float('eccentricity', 24, 8).nullable().after('inclination')
      table.integer('axial_tilt').nullable().after('eccentricity')
      table.integer('age').nullable().after('axial_tilt')
      table.float('absolute_magnitude', 24, 8).nullable().after('age')
      table.float('semi_major_axis', 24, 8).nullable().after('absolute_magnitude')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('sub_class')
      table.dropColumn('rotation_period')
      table.dropColumn('radius')
      table.dropColumn('temperature')
      table.dropColumn('luminosity')
      table.dropColumn('orbital_period')
      table.dropColumn('inclination')
      table.dropColumn('eccentricity')
      table.dropColumn('axial_tilt')
      table.dropColumn('age')
      table.dropColumn('absolute_magnitude')
      table.dropColumn('semi_major_axis')
    })
  }
}
