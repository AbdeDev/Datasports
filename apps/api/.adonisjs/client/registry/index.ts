/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'me.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/me',
    tokens: [{"old":"/api/v1/me","type":0,"val":"api","end":""},{"old":"/api/v1/me","type":0,"val":"v1","end":""},{"old":"/api/v1/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['me.show']['types'],
  },
  'missions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/missions',
    tokens: [{"old":"/api/v1/missions","type":0,"val":"api","end":""},{"old":"/api/v1/missions","type":0,"val":"v1","end":""},{"old":"/api/v1/missions","type":0,"val":"missions","end":""}],
    types: placeholder as Registry['missions.index']['types'],
  },
  'missions.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/missions/:id',
    tokens: [{"old":"/api/v1/missions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/missions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/missions/:id","type":0,"val":"missions","end":""},{"old":"/api/v1/missions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['missions.show']['types'],
  },
  'missions.store': {
    methods: ["POST"],
    pattern: '/api/v1/missions',
    tokens: [{"old":"/api/v1/missions","type":0,"val":"api","end":""},{"old":"/api/v1/missions","type":0,"val":"v1","end":""},{"old":"/api/v1/missions","type":0,"val":"missions","end":""}],
    types: placeholder as Registry['missions.store']['types'],
  },
  'missions.respond': {
    methods: ["POST"],
    pattern: '/api/v1/missions/:id/respond',
    tokens: [{"old":"/api/v1/missions/:id/respond","type":0,"val":"api","end":""},{"old":"/api/v1/missions/:id/respond","type":0,"val":"v1","end":""},{"old":"/api/v1/missions/:id/respond","type":0,"val":"missions","end":""},{"old":"/api/v1/missions/:id/respond","type":1,"val":"id","end":""},{"old":"/api/v1/missions/:id/respond","type":0,"val":"respond","end":""}],
    types: placeholder as Registry['missions.respond']['types'],
  },
  'missions.reassign': {
    methods: ["POST"],
    pattern: '/api/v1/missions/:id/reassign',
    tokens: [{"old":"/api/v1/missions/:id/reassign","type":0,"val":"api","end":""},{"old":"/api/v1/missions/:id/reassign","type":0,"val":"v1","end":""},{"old":"/api/v1/missions/:id/reassign","type":0,"val":"missions","end":""},{"old":"/api/v1/missions/:id/reassign","type":1,"val":"id","end":""},{"old":"/api/v1/missions/:id/reassign","type":0,"val":"reassign","end":""}],
    types: placeholder as Registry['missions.reassign']['types'],
  },
  'missions.withdraw': {
    methods: ["POST"],
    pattern: '/api/v1/missions/:id/withdraw',
    tokens: [{"old":"/api/v1/missions/:id/withdraw","type":0,"val":"api","end":""},{"old":"/api/v1/missions/:id/withdraw","type":0,"val":"v1","end":""},{"old":"/api/v1/missions/:id/withdraw","type":0,"val":"missions","end":""},{"old":"/api/v1/missions/:id/withdraw","type":1,"val":"id","end":""},{"old":"/api/v1/missions/:id/withdraw","type":0,"val":"withdraw","end":""}],
    types: placeholder as Registry['missions.withdraw']['types'],
  },
  'missions.cancel': {
    methods: ["POST"],
    pattern: '/api/v1/missions/:id/cancel',
    tokens: [{"old":"/api/v1/missions/:id/cancel","type":0,"val":"api","end":""},{"old":"/api/v1/missions/:id/cancel","type":0,"val":"v1","end":""},{"old":"/api/v1/missions/:id/cancel","type":0,"val":"missions","end":""},{"old":"/api/v1/missions/:id/cancel","type":1,"val":"id","end":""},{"old":"/api/v1/missions/:id/cancel","type":0,"val":"cancel","end":""}],
    types: placeholder as Registry['missions.cancel']['types'],
  },
  'missions.add_spotted_player': {
    methods: ["POST"],
    pattern: '/api/v1/missions/:id/targets',
    tokens: [{"old":"/api/v1/missions/:id/targets","type":0,"val":"api","end":""},{"old":"/api/v1/missions/:id/targets","type":0,"val":"v1","end":""},{"old":"/api/v1/missions/:id/targets","type":0,"val":"missions","end":""},{"old":"/api/v1/missions/:id/targets","type":1,"val":"id","end":""},{"old":"/api/v1/missions/:id/targets","type":0,"val":"targets","end":""}],
    types: placeholder as Registry['missions.add_spotted_player']['types'],
  },
  'clubs.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/clubs',
    tokens: [{"old":"/api/v1/clubs","type":0,"val":"api","end":""},{"old":"/api/v1/clubs","type":0,"val":"v1","end":""},{"old":"/api/v1/clubs","type":0,"val":"clubs","end":""}],
    types: placeholder as Registry['clubs.index']['types'],
  },
  'clubs.store': {
    methods: ["POST"],
    pattern: '/api/v1/clubs',
    tokens: [{"old":"/api/v1/clubs","type":0,"val":"api","end":""},{"old":"/api/v1/clubs","type":0,"val":"v1","end":""},{"old":"/api/v1/clubs","type":0,"val":"clubs","end":""}],
    types: placeholder as Registry['clubs.store']['types'],
  },
  'players.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/players',
    tokens: [{"old":"/api/v1/players","type":0,"val":"api","end":""},{"old":"/api/v1/players","type":0,"val":"v1","end":""},{"old":"/api/v1/players","type":0,"val":"players","end":""}],
    types: placeholder as Registry['players.index']['types'],
  },
  'players.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/players/:id',
    tokens: [{"old":"/api/v1/players/:id","type":0,"val":"api","end":""},{"old":"/api/v1/players/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/players/:id","type":0,"val":"players","end":""},{"old":"/api/v1/players/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['players.show']['types'],
  },
  'players.store': {
    methods: ["POST"],
    pattern: '/api/v1/players',
    tokens: [{"old":"/api/v1/players","type":0,"val":"api","end":""},{"old":"/api/v1/players","type":0,"val":"v1","end":""},{"old":"/api/v1/players","type":0,"val":"players","end":""}],
    types: placeholder as Registry['players.store']['types'],
  },
  'matches.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/matches',
    tokens: [{"old":"/api/v1/matches","type":0,"val":"api","end":""},{"old":"/api/v1/matches","type":0,"val":"v1","end":""},{"old":"/api/v1/matches","type":0,"val":"matches","end":""}],
    types: placeholder as Registry['matches.index']['types'],
  },
  'matches.store': {
    methods: ["POST"],
    pattern: '/api/v1/matches',
    tokens: [{"old":"/api/v1/matches","type":0,"val":"api","end":""},{"old":"/api/v1/matches","type":0,"val":"v1","end":""},{"old":"/api/v1/matches","type":0,"val":"matches","end":""}],
    types: placeholder as Registry['matches.store']['types'],
  },
  'scouts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/scouts',
    tokens: [{"old":"/api/v1/scouts","type":0,"val":"api","end":""},{"old":"/api/v1/scouts","type":0,"val":"v1","end":""},{"old":"/api/v1/scouts","type":0,"val":"scouts","end":""}],
    types: placeholder as Registry['scouts.index']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
