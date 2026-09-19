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
