import { Play } from 'phosphor-react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { 
  CountDownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmountInput, 
  Separator, 
  StartCountdownButton, 
  TaskInput 
} from './styles';

/*interface NewCycleFormData {
  task: string;
  minutesAmount: number;
}*/

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a terefa'),
  minutesAmount: zod.number().min(5).max(60),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

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

  function handleSubmit(data: NewCycleFormData) {
    console.log(data);
    reset();
  }

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
            {...register('minutesAmount',  { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>      

        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}