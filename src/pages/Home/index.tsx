import { useContext, useEffect } from 'react';
import * as zod from 'zod';
import { HandPalm, Play } from 'phosphor-react';

import { 
  HomeContainer, 
  StartCountdownButton, 
  StopCountdownButton,
} from './styles';

import { CountDown } from './components/CountDown';
import { NewCycleForm } from './components/NewCycleForm';

import { CyclesContext } from '../../context/CyclesContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';


type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a terefa'),
  minutesAmount: zod.number().min(5).max(60),
})

export function Home() {
 const { activeCycle, interruptCurrentCycle, createNewCycle } = useContext(CyclesContext);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const { handleSubmit: handleSubmitReactHookForm, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  // controle disabled 
  const task = watch('task');
  const isSubmitDisabled = !task;


  return (
    <HomeContainer>
      <form onSubmit={handleSubmitReactHookForm(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
    
        <CountDown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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