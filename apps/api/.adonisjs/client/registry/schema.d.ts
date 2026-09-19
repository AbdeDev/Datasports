/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'me.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/me'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'missions.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/missions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'missions.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/missions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'missions.store': {
    methods: ["POST"]
    pattern: '/api/v1/missions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'missions.respond': {
    methods: ["POST"]
    pattern: '/api/v1/missions/:id/respond'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'missions.reassign': {
    methods: ["POST"]
    pattern: '/api/v1/missions/:id/reassign'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'missions.withdraw': {
    methods: ["POST"]
    pattern: '/api/v1/missions/:id/withdraw'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'missions.cancel': {
    methods: ["POST"]
    pattern: '/api/v1/missions/:id/cancel'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'missions.add_spotted_player': {
    methods: ["POST"]
    pattern: '/api/v1/missions/:id/targets'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'observations.store': {
    methods: ["POST"]
    pattern: '/api/v1/missions/:id/observations'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'evaluation_grids.active': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/evaluation-grids/active'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'clubs.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/clubs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'clubs.store': {
    methods: ["POST"]
    pattern: '/api/v1/clubs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'players.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/players'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'players.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/players/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'players.store': {
    methods: ["POST"]
    pattern: '/api/v1/players'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'matches.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/matches'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'matches.store': {
    methods: ["POST"]
    pattern: '/api/v1/matches'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'scouts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/scouts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
}
