import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import System from 'App/Models/System'

export default class SystemsController {
  private columns = ['name', 'population', 'distance', 'updated_at', 'dist']
  private directions = ['asc', 'desc']
  public async index({ response, request }: HttpContextContract) {
    try {
      const qs = request.qs()
      const ref = qs.ref ? decodeURI(qs.ref) : null
      const page = qs.page ? parseInt(qs.page) : 1
      let column = this.columns.includes(qs.column) ? qs.column : 'distance'
      const direction = this.directions.includes(qs.direction) ? qs.direction : 'asc'
      const systemsQuery = System.query()

      // Preloads
      systemsQuery
        .select('*')
        .whereNot('address', 0)
        .preload('stations', (query) => {
          query.select('name', 'type')
        })
        .preload('government')
        .preload('security')
        .preload('primaryEconomy')
        .preload('allegiance')

      if (ref) {
        const system = await System.findBy('name', ref)
        if (system) {
          systemsQuery.select(
            Database.raw(`distanceBetweenSystems('${system.position}', position) as dist`)
          )
          column = column === 'distance' ? 'dist' : column
        }
      }

      if (Object.keys(qs).includes('showPopulated') && qs.showPopulated === 'true') {
        systemsQuery.whereNot('population', 0)
      }

      if (Object.keys(qs).includes('needsPermit') && qs.needsPermit === 'true') {
        systemsQuery.where('needs_permit', 1)
      }
      const systems = await systemsQuery.orderBy(column, direction).paginate(page, 25)
      return response.status(200).json({ systems })
    } catch (e) {
      console.log(e.message)
      return response.status(404).json({ message: 'System not found' })
    }
  }
  public async find({ response, request }: HttpContextContract) {
    const qs = request.qs()
    if (qs.q.length <= 0) {
      return response.status(400).json({ systems: [] })
    }
    const systems = await System.query()
      .where('name', 'like', `%${qs.q}%`)
      .preload('stations', (query) => {
        query.select('name', 'type')
      })
      .preload('government')
      .preload('security')
      .preload('primaryEconomy')
      .preload('allegiance')
      .limit(10)
    return response.status(200).json({ systems })
  }

  public async positions({ response, request }: HttpContextContract) {
    const qs = request.qs()
    const dist = qs.distance ? (parseInt(qs.distance) > 70000 ? 70000 : parseInt(qs.distance)) : 150
    const systems = await System.query()
      .select('name', 'position', 'distance')
      .whereNot('address', 0)
      .where('distance', '<=', dist)
      .orderBy('distance', 'asc')
    return response.status(200).json(systems)
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const name = decodeURI(params.id)
      const system = await System.query()
        .where('name', name)
        .preload('government')
        .preload('security')
        .preload('primaryEconomy')
        .preload('allegiance')
        .first()
      if (!system) {
        return response.status(404).json({ message: 'System not found' })
      }
      return response.status(200).json({ system })
    } catch (e) {
      return response.status(404).json({ message: 'System not found' })
    }
  }

  public async distance({ response, params }: HttpContextContract) {
    const systemA = params.a ? decodeURI(params.a) : 'Sol'
    const systemB = params.b ? decodeURI(params.b) : 'Sol'
    const distance = await this.distanceCalc(systemA, systemB)

    return response.status(200).json(distance)
  }

  public async routePlotter({ response, request }: HttpContextContract) {
    const qs = request.qs()
    const systemA = qs.start ? decodeURI(qs.start) : 'Sol'
    const systemB = qs.end ? decodeURI(qs.end) : 'Sol'
    const maxJump = qs.maxJump ? parseInt(qs.maxJump) : 10
    const systems = await System.query().whereNot('address', 0)

    const start = systems.find((system) => system.name === systemA)!
    const end = systems.find((system) => system.name === systemB)!
    const startDistance = await this.distanceCalc(start.position, end.position)
    const route: any[] = []
    this.routePlotterCalc(route, systems, start, end, maxJump, startDistance, [0, start.address], 0)
    route.unshift({ name: start.name, position: start.position })
    route.push({ name: end.name, position: end.position })

    return response.status(200).json({ route })
  }

  private routePlotterCalc(
    route: any[] = [],
    systems: System[],
    current: System,
    end: System,
    maxJump: number,
    startDistance: number,
    blacklist: number[] = [],
    iteration: number = 0
  ) {
    if (iteration === 20) {
      return
    }

    const nearby = systems.filter((system) => {
      return this.distanceCalc(system.position, current.position) <= maxJump
    })

    if (current.address === end.address) {
      return
    }
    console.log(startDistance)

    for (let i = 0; i < nearby.length; i++) {
      const system = nearby[i]
      const distanceToEnd = this.distanceCalc(system.position, end.position)
      const distanceBetween = this.distanceCalc(system.position, current.position)

      if (blacklist.includes(system.address)) {
        continue
      }

      if (distanceToEnd > startDistance) {
        continue
      }

      console.log(system.name, distanceToEnd, distanceBetween)
      route.push({ name: system.name, position: system.position })
    }
  }

  private distanceCalc(systemA: string = '0;0;0', systemB: string = '0;0;0'): number {
    if (systemA === systemB) {
      return 0.0
    }

    const [x1, y1, z1] = systemA.split(';')
    const [x2, y2, z2] = systemB.split(';')

    const distance = Math.pow(
      Math.pow(Number(x1) - Number(x2), 2) +
        Math.pow(Number(y1) - Number(y2), 2) +
        Math.pow(Number(z1) - Number(z2), 2),
      0.5
    )

    return parseFloat(distance.toFixed(2))
  }
}
