import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'me.show': { paramsTuple?: []; params?: {} }
    'missions.index': { paramsTuple?: []; params?: {} }
    'missions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'missions.store': { paramsTuple?: []; params?: {} }
    'missions.respond': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'missions.reassign': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'me.show': { paramsTuple?: []; params?: {} }
    'missions.index': { paramsTuple?: []; params?: {} }
    'missions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'me.show': { paramsTuple?: []; params?: {} }
    'missions.index': { paramsTuple?: []; params?: {} }
    'missions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'missions.store': { paramsTuple?: []; params?: {} }
    'missions.respond': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'missions.reassign': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}