import React from "react"
import { AlgorithmState } from "../types/algorithm"
import { TreeVisualization } from "./visualizations/TreeVisualization"
import { ArrayVisualization } from "./visualizations/ArrayVisualization"
import { StackVisualization } from "./visualizations/StackVisualization"

interface VisualizationPanelProps {
  algorithmState: AlgorithmState
}

export function VisualizationPanel({
  algorithmState,
}: VisualizationPanelProps) {
  const renderVisualization = () => {
    if (!algorithmState.dataStructure) {
      return <></>
    }

    switch (algorithmState.dataStructure.type) {
      case "tree":
        return (
          <TreeVisualization dataStructure={algorithmState.dataStructure} />
        )
      case "array":
        return (
          <ArrayVisualization dataStructure={algorithmState.dataStructure} />
        )
      case "stack":
        return (
          <StackVisualization dataStructure={algorithmState.dataStructure} />
        )
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>
              Visualization for {algorithmState.dataStructure.type} not yet
              implemented
            </p>
          </div>
        )
    }
  }

  return <div className="h-full bg-gray-900 p-4">{renderVisualization()}</div>
}
