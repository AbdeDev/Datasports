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
    'missions.withdraw': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'missions.cancel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'missions.add_spotted_player': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'observations.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'observations.validate_analysis': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'evaluation_grids.active': { paramsTuple?: []; params?: {} }
    'clubs.index': { paramsTuple?: []; params?: {} }
    'clubs.store': { paramsTuple?: []; params?: {} }
    'players.index': { paramsTuple?: []; params?: {} }
    'players.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'players.store': { paramsTuple?: []; params?: {} }
    'matches.index': { paramsTuple?: []; params?: {} }
    'matches.store': { paramsTuple?: []; params?: {} }
    'scouts.index': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'me.show': { paramsTuple?: []; params?: {} }
    'missions.index': { paramsTuple?: []; params?: {} }
    'missions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'evaluation_grids.active': { paramsTuple?: []; params?: {} }
    'clubs.index': { paramsTuple?: []; params?: {} }
    'players.index': { paramsTuple?: []; params?: {} }
    'players.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.index': { paramsTuple?: []; params?: {} }
    'scouts.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'me.show': { paramsTuple?: []; params?: {} }
    'missions.index': { paramsTuple?: []; params?: {} }
    'missions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'evaluation_grids.active': { paramsTuple?: []; params?: {} }
    'clubs.index': { paramsTuple?: []; params?: {} }
    'players.index': { paramsTuple?: []; params?: {} }
    'players.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.index': { paramsTuple?: []; params?: {} }
    'scouts.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'missions.store': { paramsTuple?: []; params?: {} }
    'missions.respond': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'missions.reassign': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'missions.withdraw': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'missions.cancel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'missions.add_spotted_player': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'observations.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clubs.store': { paramsTuple?: []; params?: {} }
    'players.store': { paramsTuple?: []; params?: {} }
    'matches.store': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'observations.validate_analysis': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}