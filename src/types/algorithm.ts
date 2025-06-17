export interface LogEntry {
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
  timestamp: number;
}

export interface DataStructure {
  type: 'tree' | 'array' | 'stack' | 'queue' | 'linkedlist' | 'graph';
  data: any;
  metadata?: {
    [key: string]: any;
  };
}

export interface ExecutionStep {
  stepNumber: number;
  description: string;
  highlightedNodes?: string[];
  currentValue?: any;
  action?: string;
}

export interface AlgorithmState {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  logs: LogEntry[];
  dataStructure: DataStructure | null;
  highlightedNodes: string[];
  executionSteps?: ExecutionStep[];
  executionSpeed: number;
}

export interface ParsedCode {
  dataStructure: DataStructure;
  logs: LogEntry[];
  steps: ExecutionStep[];
}