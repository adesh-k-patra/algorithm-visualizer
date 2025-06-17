import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Settings, Square } from 'lucide-react';
import { AlgorithmState } from '../types/algorithm';
import { parseAndExecuteCode } from '../utils/codeParser';

interface ControlPanelProps {
  algorithmState: AlgorithmState;
  onStateChange: (state: AlgorithmState) => void;
  code: string;
  selectedVariable: string;
  selectedDataStructure: string;
}

export function ControlPanel({ 
  algorithmState, 
  onStateChange, 
  code, 
  selectedVariable, 
  selectedDataStructure 
}: ControlPanelProps) {
  
  const handleRun = async () => {
    if (!selectedVariable || !selectedDataStructure) {
      onStateChange({
        ...algorithmState,
        logs: [{ 
          message: 'Please select a variable and data structure type first!', 
          type: 'warning', 
          timestamp: Date.now() 
        }]
      });
      return;
    }

    try {
      const result = await parseAndExecuteCode(code, selectedVariable, selectedDataStructure);
      onStateChange({
        ...algorithmState,
        isRunning: true,
        isPaused: false,
        dataStructure: result.dataStructure,
        logs: result.logs,
        totalSteps: result.steps.length,
        currentStep: 0,
        executionSteps: result.steps
      });

      // Start automatic step execution
      startAutoExecution(result.steps.length);
    } catch (error) {
      console.error('Error parsing code:', error);
      onStateChange({
        ...algorithmState,
        logs: [{ message: `Error: ${error}`, type: 'error', timestamp: Date.now() }]
      });
    }
  };

  const startAutoExecution = (totalSteps: number) => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= totalSteps - 1) {
        clearInterval(interval);
        onStateChange(prev => ({
          ...prev,
          isRunning: false,
          isPaused: false
        }));
        return;
      }

      onStateChange(prev => {
        if (prev.isPaused) {
          clearInterval(interval);
          return prev;
        }
        return {
          ...prev,
          currentStep: currentStep + 1
        };
      });
      currentStep++;
    }, algorithmState.executionSpeed);
  };

  const handlePause = () => {
    onStateChange({
      ...algorithmState,
      isPaused: !algorithmState.isPaused
    });
  };

  const handleStep = () => {
    if (algorithmState.currentStep < algorithmState.totalSteps - 1) {
      onStateChange({
        ...algorithmState,
        currentStep: algorithmState.currentStep + 1
      });
    }
  };

  const handleStop = () => {
    onStateChange({
      ...algorithmState,
      isRunning: false,
      isPaused: false,
      currentStep: 0
    });
  };

  const handleReset = () => {
    onStateChange({
      ...algorithmState,
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      logs: [],
      highlightedNodes: []
    });
  };

  const handleSpeedChange = (speed: number) => {
    onStateChange({
      ...algorithmState,
      executionSpeed: speed
    });
  };

  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handleRun}
          disabled={algorithmState.isRunning && !algorithmState.isPaused}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:opacity-50 rounded-lg transition-colors"
        >
          <Play size={16} />
          Run
        </button>
        
        {algorithmState.isRunning && (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
          >
            {algorithmState.isPaused ? <Play size={16} /> : <Pause size={16} />}
            {algorithmState.isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
        
        <button
          onClick={handleStep}
          disabled={!algorithmState.isRunning || !algorithmState.isPaused}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 rounded-lg transition-colors"
        >
          <SkipForward size={16} />
          Step
        </button>

        {algorithmState.isRunning && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <Square size={16} />
            Stop
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Speed:</span>
          <select
            value={algorithmState.executionSpeed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          >
            <option value={2000}>0.5x</option>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={250}>4x</option>
          </select>
        </div>

        <span className="text-sm text-gray-300">
          Step: {algorithmState.currentStep + 1} / {algorithmState.totalSteps || 1}
        </span>
        
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}