/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  me: {
    show: typeof routes['me.show']
  }
  missions: {
    index: typeof routes['missions.index']
    show: typeof routes['missions.show']
    store: typeof routes['missions.store']
    respond: typeof routes['missions.respond']
    reassign: typeof routes['missions.reassign']
    withdraw: typeof routes['missions.withdraw']
    cancel: typeof routes['missions.cancel']
    addSpottedPlayer: typeof routes['missions.add_spotted_player']
  }
  clubs: {
    index: typeof routes['clubs.index']
    store: typeof routes['clubs.store']
  }
  players: {
    index: typeof routes['players.index']
    show: typeof routes['players.show']
    store: typeof routes['players.store']
  }
  matches: {
    index: typeof routes['matches.index']
    store: typeof routes['matches.store']
  }
  scouts: {
    index: typeof routes['scouts.index']
  }
}
