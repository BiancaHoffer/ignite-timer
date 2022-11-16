import { differenceInSeconds } from "date-fns/esm";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { addNewCycleAction, interruptCycleAction, markFinishedAction } from "../reducers/cycles/action";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void;
  interruptCurrentCycle: () => void;
  createNewCycle: (data: CreateCycleData) => void;
} 

interface ChildrenProps {
  children: ReactNode;
}


export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesProvider({ children }: ChildrenProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
      cycles: [],
      activeCycleId: null,  
  }, 
  () => {
      const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
    },
  )

  //const [cycles, setCycles] = useState<Cycle[]>([]);
  //const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const { cycles, activeCycleId } = cyclesState;
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
     return 0;
  });
  // essa váriável vai percorrer o cyclo até encontrar um cyclo igual ao cyclo ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);
    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON);
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markFinishedAction())
    
    /*setCycles(state => state.map(cycle => {
      if (cycle === activeCycle) {
        return { ...cycle, finishedDate: new Date() }
      } else {
        return cycle;
      }
    }));
    */
  }

  function interruptCurrentCycle() {
    /*setCycles(state => state.map(cycle => {
      if (cycle === activeCycle) {
        return { ...cycle, interruptedDate: new Date() }
      } else {
        return cycle;
      }
    }));
    */

    dispatch(interruptCycleAction())

    //setActiveCycleId(null);
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    
    // para adicionar nova informação no array usamos o spreed, copiando 
    // todos os ciclos que eu já tenho, e em seguida adicionar o novo ciclo
    /*setCycles((state) => [...cycles, newCycle]);*/
    dispatch(addNewCycleAction(newCycle))

    //setActiveCycleId(id)
    setAmountSecondsPassed(0);
  }
  
  return (
    <CyclesContext.Provider value={{ 
      cycles,
      activeCycle,
      activeCycleId,
      amountSecondsPassed,
      markCurrentCycleAsFinished,
      setSecondsPassed,
      interruptCurrentCycle,
      createNewCycle,
    }}
    >
      { children }
    </CyclesContext.Provider>
  )
}