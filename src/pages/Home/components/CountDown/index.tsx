import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";
import { CyclesContext } from "../../../../context/CyclesContext";
import { CountDownContainer, Separator } from "./styles";

export function CountDown() {
  const { 
    markCurrentCycleAsFinished, 
    activeCycle,
    activeCycleId,
    amountSecondsPassed,
    setSecondsPassed,

  } = useContext(CyclesContext);

   // converter minutos em segundos
   const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
   const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
 
   const minutesAmount = Math.floor(currentSeconds / 60); // números de minutos
   const secondsAmount = currentSeconds % 60; // número de segundos
 
   const minutes = String(minutesAmount).padStart(2, '0');
   const seconds = String(secondsAmount).padStart(2, '0');
 
  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(), 
          new Date(activeCycle.startDate)
        )
        
        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()

          setSecondsPassed(0);
          clearInterval(0);
        } else {
          setSecondsPassed(secondsDifference);
        }
        
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      setSecondsPassed(0);
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${activeCycle.task} - ${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  
  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>   
  );
}