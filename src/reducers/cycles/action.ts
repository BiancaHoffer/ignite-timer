import { Cycle } from "./reducer";

export enum ActionTypes {
  CREATE_NEW_CYCLE = "CREATE_NEW_CYCLE",
  INTERRUPTED_CURRENT_CYCLE = "INTERRUPTED_CURRENT_CYCLE",
  MARK_CURRENT_CYCLE_AS_FINISHED = "MARK_CURRENT_CYCLE_AS_FINISHED",
}

  export function addNewCycleAction(newCycle: Cycle) {
    return {
      type: ActionTypes.CREATE_NEW_CYCLE,
      payload: {
        newCycle
      }
    }
  }

  export function interruptCycleAction() {
    return {
      type: ActionTypes.INTERRUPTED_CURRENT_CYCLE,
    }
  }

  export function markFinishedAction() {
    return {
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
    }
  }