import { AlgorithmState } from "../types/algorithm"

interface NonTargetOutputProps {
  algorithmState: AlgorithmState
}

export const NonTargetOutput = ({ algorithmState }: NonTargetOutputProps) => {
  const nonTargetValues =
    algorithmState?.executionSteps?.[algorithmState.currentStep]?.nonTargetVars

  return <>{JSON.stringify(nonTargetValues)}</>
}
