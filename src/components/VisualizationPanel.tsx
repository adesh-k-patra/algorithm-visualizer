import React from 'react';
import { AlgorithmState } from '../types/algorithm';
import { TreeVisualization } from './visualizations/TreeVisualization';
import { ArrayVisualization } from './visualizations/ArrayVisualization';
import { StackVisualization } from './visualizations/StackVisualization';

interface VisualizationPanelProps {
  algorithmState: AlgorithmState;
}

export function VisualizationPanel({ algorithmState }: VisualizationPanelProps) {
  const renderVisualization = () => {
    if (!algorithmState.dataStructure) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <div className="text-6xl mb-4">🌳</div>
            <h3 className="text-xl font-semibold mb-2">No Data Structure Detected</h3>
            <p>Run your code to see the visualization</p>
          </div>
        </div>
      );
    }

    switch (algorithmState.dataStructure.type) {
      case 'tree':
        return <TreeVisualization dataStructure={algorithmState.dataStructure} />;
      case 'array':
        return <ArrayVisualization dataStructure={algorithmState.dataStructure} />;
      case 'stack':
        return <StackVisualization dataStructure={algorithmState.dataStructure} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Visualization for {algorithmState.dataStructure.type} not yet implemented</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-900 p-4">
      {renderVisualization()}
    </div>
  );
}