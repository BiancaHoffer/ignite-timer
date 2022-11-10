import { createContext, ReactElement, ReactNode, useEffect, useState } from "react";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
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
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  // essa váriável vai percorrer o cyclo até encontrar um cyclo igual ao cyclo ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles(state => state.map(cycle => {
      if (cycle === activeCycle) {
        return { ...cycle, finishedDate: new Date() }
      } else {
        return cycle;
      }
    }));
  }

  function interruptCurrentCycle() {
    setCycles(state => state.map(cycle => {
      if (cycle === activeCycle) {
        return { ...cycle, interruptedDate: new Date() }
      } else {
        return cycle;
      }
    }));

    setActiveCycleId(null);
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
    setCycles((state) => [...cycles, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);
  }
  
  return (
    <CyclesContext.Provider value={{ 
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