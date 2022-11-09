import { HandPalm, Play } from 'phosphor-react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { differenceInSeconds } from 'date-fns'

import { 
  CountDownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmountInput, 
  Separator, 
  StartCountdownButton, 
  StopCountdownButton,
  TaskInput 
} from './styles';
import { useEffect, useState } from 'react';

/*interface NewCycleFormData {
  task: string;
  minutesAmount: number;
}*/

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a terefa'),
  minutesAmount: zod.number().min(5).max(60),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
}

export function Home() {
  const { 
    register, 
    handleSubmit: handleSubmitReactHookForm,
    watch,
    reset
  } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

   // essa váriável vai percorrer o cyclo até encontrar um cyclo igual ao cyclo ativo
   const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate))
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      setAmountSecondsPassed(0);
    }
  }, [activeCycle])

  function handleSubmit(data: NewCycleFormData) {
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

    reset();
  }

  function handleInterruptCycle() {
    setCycles(cycles.map(cycle => {
      if (cycle === activeCycle) {
        return { ...cycle, interruptedDate: new Date() }
      } else {
        return cycle;
      }
    }));

    setActiveCycleId(null);
  }

  console.log(cycles)

  // converter minutos em segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60); // números de minutos
  const secondsAmount = currentSeconds % 60 // número de segundos
  
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${activeCycle.task} - ${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  // controle disabled 
  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmitReactHookForm(handleSubmit)}>
        <FormContainer >
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            id="task" 
            placeholder='Dê um nome para o seu projeto' 
            list="task-suggestions"
            disabled={!!activeCycle}
            {...register('task')}
          />
          
          <datalist id="task-suggestions">
            <option value="Estudo React js" />
            <option value="Estudo SASS" />
            <option value="Estudo Node js" />
          </datalist>

          <label>durante</label>
          <MinutesAmountInput 
            type="number"
            id="minutesAmount" 
            placeholder='00'
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount',  { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>      

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}

        
      </form>
    </HomeContainer>
  );
}