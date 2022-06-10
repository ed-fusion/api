import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BodyPlanets extends BaseSchema {
  protected tableName = 'body_planets'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('axial_tilt', 12, 8).nullable().after('landable')
      table.float('eccentricity', 12, 8).nullable().after('axial_tilt')
      table.float('inclination', 12, 8).nullable().after('eccentricity')
      table.float('orbital_period', 24, 8).nullable().after('inclination')
      table.float('periapsis', 12, 8).nullable().after('orbital_period')
      table.integer('radius').nullable().after('periapsis')
      table.float('rotation_period', 24, 8).nullable().after('radius')
      table.float('semi_major_axis', 24, 8).nullable().after('rotation_period')
      table.float('surface_gravity', 12, 8).nullable().after('semi_major_axis')
      table.float('surface_temperature', 12, 8).nullable().after('surface_gravity')
      table.float('surface_pressure', 24, 8).nullable().after('surface_temperature')
      table.string('terraform_state').nullable().after('surface_pressure')
      table.string('volcanism').nullable().after('terraform_state')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('axial_tilt')
      table.dropColumn('eccentricity')
      table.dropColumn('inclination')
      table.dropColumn('orbital_period')
      table.dropColumn('periapsis')
      table.dropColumn('radius')
      table.dropColumn('rotation_period')
      table.dropColumn('semi_major_axis')
      table.dropColumn('surface_gravity')
      table.dropColumn('surface_temperature')
      table.dropColumn('surface_pressure')
      table.dropColumn('terraform_state')
      table.dropColumn('volcanism')
    })
  }
}
