export interface TreeNode {
  name: string
  value: any
  children: TreeNode[]
  x: number
  y: number
}

export interface LogEntry {
  message: string
  type: "info" | "error" | "warning" | "success"
  timestamp: number
}

export interface DataStructure {
  type: "tree" | "array" | "stack" | "queue" | "linkedlist" | "graph"
  data: any
  metadata?: {
    [key: string]: any
  }
}

export interface ExecutionStep {
  targetVars: any
  nonTargetVars: any
}

export interface AlgorithmState {
  isRunning: boolean
  isPaused: boolean
  currentStep: number
  totalSteps: number
  logs: LogEntry[]
  highlightedNodes: []
  dataStructure: DataStructure | null
  executionSteps?: ExecutionStep[]
  executionSpeed: number
}

export interface ParsedCode {
  dataStructure: DataStructure
  logs: LogEntry[]
  steps: ExecutionStep[]
}
