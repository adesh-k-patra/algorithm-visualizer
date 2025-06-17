import { ParsedCode, DataStructure, LogEntry, ExecutionStep } from '../types/algorithm';

export async function parseAndExecuteCode(
  code: string, 
  variableName: string, 
  dataStructureType: string
): Promise<ParsedCode> {
  const logs: LogEntry[] = [];
  const steps: ExecutionStep[] = [];
  let dataStructure: DataStructure | null = null;

  try {
    // Extract the variable value from code
    const variableRegex = new RegExp(`(?:const|let|var)\\s+${variableName}\\s*=\\s*([^;]+);?`, 'g');
    const match = variableRegex.exec(code);
    
    if (!match) {
      throw new Error(`Variable '${variableName}' not found in code`);
    }

    let variableValue;
    try {
      // Safely evaluate the variable value
      variableValue = eval(`(${match[1]})`);
    } catch (e) {
      throw new Error(`Could not parse variable '${variableName}': ${e}`);
    }

    // Create data structure based on type and value
    dataStructure = {
      type: dataStructureType as any,
      data: variableValue
    };

    logs.push({
      message: `Loaded ${dataStructureType} variable '${variableName}'`,
      type: 'success',
      timestamp: Date.now()
    });

    // Generate execution steps based on data structure type and code analysis
    if (dataStructureType === 'tree') {
      generateTreeTraversalSteps(variableValue, code, steps, logs);
    } else if (dataStructureType === 'array') {
      generateArraySteps(variableValue, code, steps, logs);
    } else if (dataStructureType === 'stack') {
      generateStackSteps(variableValue, code, steps, logs);
    }

  } catch (error) {
    logs.push({
      message: `Error: ${error}`,
      type: 'error',
      timestamp: Date.now()
    });
    
    // Provide fallback data structure
    dataStructure = {
      type: dataStructureType as any,
      data: getDefaultDataStructure(dataStructureType)
    };
  }

  return {
    dataStructure: dataStructure!,
    logs,
    steps
  };
}

function generateTreeTraversalSteps(
  treeData: any, 
  code: string, 
  steps: ExecutionStep[], 
  logs: LogEntry[]
) {
  if (code.includes('inorder') || code.includes('inOrder')) {
    const traversalOrder = getInorderTraversal(treeData);
    
    steps.push({
      stepNumber: 0,
      description: 'Starting inorder traversal',
      highlightedNodes: [],
      action: 'start'
    });

    traversalOrder.forEach((value, index) => {
      steps.push({
        stepNumber: index + 1,
        description: `Visiting node ${value}`,
        highlightedNodes: [value.toString()],
        currentValue: value,
        action: 'visit'
      });

      logs.push({
        message: `Visiting: ${value}`,
        type: 'info',
        timestamp: Date.now() + (index * 100)
      });
    });

    steps.push({
      stepNumber: traversalOrder.length + 1,
      description: 'Traversal complete',
      highlightedNodes: [],
      action: 'complete'
    });

    logs.push({
      message: 'Tree traversal completed!',
      type: 'success',
      timestamp: Date.now() + (traversalOrder.length * 100)
    });
  }
}

function generateArraySteps(
  arrayData: any[], 
  code: string, 
  steps: ExecutionStep[], 
  logs: LogEntry[]
) {
  if (code.includes('sort') || code.includes('bubble')) {
    steps.push({
      stepNumber: 0,
      description: 'Starting bubble sort',
      highlightedNodes: [],
      action: 'start'
    });

    // Simulate bubble sort steps
    const arr = [...arrayData];
    let stepCount = 1;

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        steps.push({
          stepNumber: stepCount++,
          description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
          highlightedNodes: [j.toString(), (j + 1).toString()],
          action: 'compare'
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            stepNumber: stepCount++,
            description: `Swapped ${arr[j + 1]} and ${arr[j]}`,
            highlightedNodes: [j.toString(), (j + 1).toString()],
            action: 'swap'
          });
        }
      }
    }

    logs.push({
      message: 'Array sorting completed!',
      type: 'success',
      timestamp: Date.now()
    });
  }
}

function generateStackSteps(
  stackData: any[], 
  code: string, 
  steps: ExecutionStep[], 
  logs: LogEntry[]
) {
  steps.push({
    stepNumber: 0,
    description: 'Stack visualization ready',
    highlightedNodes: [],
    action: 'ready'
  });

  stackData.forEach((value, index) => {
    steps.push({
      stepNumber: index + 1,
      description: `Element ${value} at position ${index}`,
      highlightedNodes: [index.toString()],
      currentValue: value,
      action: 'highlight'
    });
  });

  logs.push({
    message: `Stack contains ${stackData.length} elements`,
    type: 'info',
    timestamp: Date.now()
  });
}

function getInorderTraversal(node: any): any[] {
  if (!node) return [];
  
  const result: any[] = [];
  
  function traverse(current: any) {
    if (!current) return;
    
    traverse(current.left);
    result.push(current.value);
    traverse(current.right);
  }
  
  traverse(node);
  return result;
}

function getDefaultDataStructure(type: string): any {
  switch (type) {
    case 'tree':
      return {
        value: 5,
        left: {
          value: 3,
          left: { value: 1, left: null, right: null },
          right: { value: 4, left: null, right: null }
        },
        right: {
          value: 8,
          left: { value: 6, left: null, right: null },
          right: { value: 10, left: null, right: null }
        }
      };
    case 'array':
      return [1, 2, 3, 4, 5];
    case 'stack':
      return [1, 2, 3, 4, 5];
    default:
      return null;
  }
}

export function detectDataStructureType(code: string): string {
  if (code.includes('left:') && code.includes('right:')) return 'tree';
  if (code.includes('push') && code.includes('pop')) return 'stack';
  if (code.includes('enqueue') && code.includes('dequeue')) return 'queue';
  if (code.includes('next:')) return 'linkedlist';
  if (code.includes('[') && code.includes(']')) return 'array';
  if (code.includes('edges') || code.includes('vertices')) return 'graph';
  
  return 'unknown';
}