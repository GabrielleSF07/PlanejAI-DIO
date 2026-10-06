import { StepProgress } from './Progress'
import { FormStep } from './FormStep'
import { simulationFormSteps } from '@/data/simulation'

export const SimulationForm = () => {
  const currentStep = simulationFormSteps[5]
  return (
    <>
      <StepProgress currentStep={6} totalSteps={10} />
      <FormStep key={currentStep.id} {...currentStep} />
    </>
  )
}
