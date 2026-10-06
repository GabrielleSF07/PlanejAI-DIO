import { StepProgress } from './Progress'
import { FormStep } from './FormStep'
import { useState } from 'react'
import { type SimulationFormData, simulationFormSteps } from '@/data/simulation'
import { useNavigate } from 'react-router-dom'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export const SimulationForm = () => {
  const { saveFormData } = useSimulationStorage()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<SimulationFormData>(
    {} as SimulationFormData,
  )
  const totalSteps = simulationFormSteps.length
  const currentStep = simulationFormSteps[currentStepIndex]
  const navigate = useNavigate()

  const handleNextStep = (value: string) => {
    const updatedFormData = { ...formData, [currentStep.id]: value }
    setFormData(updatedFormData)

    console.log({ updatedFormData })

    if (currentStepIndex + 1 > totalSteps - 1) {
      saveFormData(updatedFormData)
      void navigate('/resultado')
      return
    }

    setCurrentStepIndex((prev) => prev + 1)
  }

  const handlePreviousStep = () => {
    if (currentStepIndex === 0) {
      return
    }

    setCurrentStepIndex((prev) => prev - 1)
  }

  return (
    <>
      <StepProgress
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
      />
      <FormStep
        key={currentStep.id}
        {...currentStep}
        onBack={handlePreviousStep}
        onNext={handleNextStep}
        hideBackButton={currentStepIndex === 0}
      />
    </>
  )
}
