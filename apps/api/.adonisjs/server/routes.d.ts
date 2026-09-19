import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'me.show': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'me.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'me.show': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}