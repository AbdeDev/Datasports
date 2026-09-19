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
  }
}
