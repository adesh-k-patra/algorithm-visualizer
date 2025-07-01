import {
  ParsedCode,
  DataStructure,
  LogEntry,
  ExecutionStep,
  TraceEntry,
} from "../types/algorithm"
import * as Babel from "@babel/standalone"

export async function parseAndExecuteCode({
  code,
  targetVar,
}: {
  code: string
  targetVar: string
}): Promise<TraceEntry[]> {
  const traceArray: TraceEntry[] = []

  // js-interpreter is only compatible with ES5 and below
  const convertedCode = Babel.transform(code, {
    presets: ["env"],
  }).code

  // @ts-expect-error Interpreter is breaking ts
  const Interpreter = window.Interpreter
  if (!Interpreter) {
    throw new Error("Interpreter is not available on window.")
  }

  const interpreter = new Interpreter(convertedCode)
  let lastValue: any

  return new Promise((resolve) => {
    while (interpreter.step()) {
      const unwrapped = _getVariableValue(interpreter, targetVar)

      if (unwrapped != null && !_deepEqual(unwrapped, lastValue)) {
        lastValue = unwrapped

        const currentNode =
          interpreter.stateStack?.[interpreter.stateStack.length - 1]?.node

        traceArray.push(unwrapped)
      }
    }

    resolve(traceArray)
  })
}

// export async function parseAndExecuteCode(
//   code: string,
//   variableName: string,
//   dataStructureType: string
// ): Promise<ParsedCode> {
//   const logs: LogEntry[] = []
//   const steps: ExecutionStep[] = []
//   let dataStructure: DataStructure | null = null

//   try {
//     // Extract the variable value from code
//     const variableRegex = new RegExp(
//       `(?:const|let|var)\\s+${variableName}\\s*=\\s*([^;]+);?`,
//       "g"
//     )
//     const match = variableRegex.exec(code)

//     if (!match) {
//       throw new Error(`Variable '${variableName}' not found in code`)
//     }

//     let variableValue
//     try {
//       // Safely evaluate the variable value
//       variableValue = eval(`(${match[1]})`)
//     } catch (e) {
//       throw new Error(`Could not parse variable '${variableName}': ${e}`)
//     }

//     // Create data structure based on type and value
//     dataStructure = {
//       type: dataStructureType as any,
//       data: variableValue,
//     }

//     logs.push({
//       message: `Loaded ${dataStructureType} variable '${variableName}'`,
//       type: "success",
//       timestamp: Date.now(),
//     })

//     // Generate execution steps based on data structure type and code analysis
//     if (dataStructureType === "tree") {
//       generateTreeTraversalSteps(variableValue, code, steps, logs)
//     } else if (dataStructureType === "array") {
//       generateArraySteps(variableValue, code, steps, logs)
//     } else if (dataStructureType === "stack") {
//       generateStackSteps(variableValue, code, steps, logs)
//     }
//   } catch (error) {
//     logs.push({
//       message: `Error: ${error}`,
//       type: "error",
//       timestamp: Date.now(),
//     })

//     // Provide fallback data structure
//     dataStructure = {
//       type: dataStructureType as any,
//       data: getDefaultDataStructure(dataStructureType),
//     }
//   }

//   return {
//     dataStructure: dataStructure!,
//     logs,
//     steps,
//   }
// }
// export async function parseAndExecuteCode({
//   code,
//   targetVar,
//   interval = 1,
// }: {
//   code: string
//   targetVar: string
//   interval?: number
// }): Promise<TraceEntry[]> {
//   const traceArray: TraceEntry[] = []

//   // @ts-expect-error Interpreter is breaking ts
//   const Interpreter = window.Interpreter
//   if (!Interpreter) {
//     throw new Error("Interpreter is not available on window.")
//   }

//   const interpreter = new Interpreter(code)
//   let lastValue: any

//   return new Promise((resolve) => {
//     function step() {
//       const shouldContinue = interpreter.step()

//       const unwrapped = _getVariable(interpreter, targetVar)

//       if (unwrapped != null && !_deepEqual(unwrapped, lastValue)) {
//         lastValue = unwrapped

//         const currentNode =
//           interpreter.stateStack?.[interpreter.stateStack.length - 1]?.node
//         const lineNumber = currentNode?.loc?.start?.line

//         traceArray.push({
//           value: unwrapped,
//           lineNumber: lineNumber ?? -1,
//         })
//       }

//       if (shouldContinue) {
//         setTimeout(step, interval)
//       } else {
//         resolve(traceArray)
//       }
//     }

//     step()
//   })
// }

// function generateTreeTraversalSteps(
//   treeData: any,
//   code: string,
//   steps: ExecutionStep[],
//   logs: LogEntry[]
// ) {
//   if (code.includes("inorder") || code.includes("inOrder")) {
//     const traversalOrder = getInorderTraversal(treeData)

//     steps.push({
//       stepNumber: 0,
//       description: "Starting inorder traversal",
//       highlightedNodes: [],
//       action: "start",
//     })

//     traversalOrder.forEach((value, index) => {
//       steps.push({
//         stepNumber: index + 1,
//         description: `Visiting node ${value}`,
//         highlightedNodes: [value.toString()],
//         currentValue: value,
//         action: "visit",
//       })

//       logs.push({
//         message: `Visiting: ${value}`,
//         type: "info",
//         timestamp: Date.now() + index * 100,
//       })
//     })

//     steps.push({
//       stepNumber: traversalOrder.length + 1,
//       description: "Traversal complete",
//       highlightedNodes: [],
//       action: "complete",
//     })

//     logs.push({
//       message: "Tree traversal completed!",
//       type: "success",
//       timestamp: Date.now() + traversalOrder.length * 100,
//     })
//   }
// }

// function generateArraySteps(
//   arrayData: any[],
//   code: string,
//   steps: ExecutionStep[],
//   logs: LogEntry[]
// ) {
//   if (code.includes("sort") || code.includes("bubble")) {
//     steps.push({
//       stepNumber: 0,
//       description: "Starting bubble sort",
//       highlightedNodes: [],
//       action: "start",
//     })

//     // Simulate bubble sort steps
//     const arr = [...arrayData]
//     let stepCount = 1

//     for (let i = 0; i < arr.length; i++) {
//       for (let j = 0; j < arr.length - i - 1; j++) {
//         steps.push({
//           stepNumber: stepCount++,
//           description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
//           highlightedNodes: [j.toString(), (j + 1).toString()],
//           action: "compare",
//         })

//         if (arr[j] > arr[j + 1]) {
//           ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
//           steps.push({
//             stepNumber: stepCount++,
//             description: `Swapped ${arr[j + 1]} and ${arr[j]}`,
//             highlightedNodes: [j.toString(), (j + 1).toString()],
//             action: "swap",
//           })
//         }
//       }
//     }

//     logs.push({
//       message: "Array sorting completed!",
//       type: "success",
//       timestamp: Date.now(),
//     })
//   }
// }

// function generateStackSteps(
//   stackData: any[],
//   code: string,
//   steps: ExecutionStep[],
//   logs: LogEntry[]
// ) {
//   steps.push({
//     stepNumber: 0,
//     description: "Stack visualization ready",
//     highlightedNodes: [],
//     action: "ready",
//   })

//   stackData.forEach((value, index) => {
//     steps.push({
//       stepNumber: index + 1,
//       description: `Element ${value} at position ${index}`,
//       highlightedNodes: [index.toString()],
//       currentValue: value,
//       action: "highlight",
//     })
//   })

//   logs.push({
//     message: `Stack contains ${stackData.length} elements`,
//     type: "info",
//     timestamp: Date.now(),
//   })
// }

// function getInorderTraversal(node: any): any[] {
//   if (!node) return []

//   const result: any[] = []

//   function traverse(current: any) {
//     if (!current) return

//     traverse(current.left)
//     result.push(current.value)
//     traverse(current.right)
//   }

//   traverse(node)
//   return result
// }

// function getDefaultDataStructure(type: string): any {
//   switch (type) {
//     case "tree":
//       return {
//         value: 5,
//         left: {
//           value: 3,
//           left: { value: 1, left: null, right: null },
//           right: { value: 4, left: null, right: null },
//         },
//         right: {
//           value: 8,
//           left: { value: 6, left: null, right: null },
//           right: { value: 10, left: null, right: null },
//         },
//       }
//     case "array":
//       return [1, 2, 3, 4, 5]
//     case "stack":
//       return [1, 2, 3, 4, 5]
//     default:
//       return null
//   }
// }

// export function detectDataStructureType(code: string): string {
//   if (code.includes("left:") && code.includes("right:")) return "tree"
//   if (code.includes("push") && code.includes("pop")) return "stack"
//   if (code.includes("enqueue") && code.includes("dequeue")) return "queue"
//   if (code.includes("next:")) return "linkedlist"
//   if (code.includes("[") && code.includes("]")) return "array"
//   if (code.includes("edges") || code.includes("vertices")) return "graph"

//   return "unknown"
// }

// Helper functions

function _getVariableValue(interpreter: any, name: string): any {
  let scope = interpreter.getScope()
  while (scope) {
    const obj = scope.object
    const props = obj?.properties
    if (props && Object.prototype.hasOwnProperty.call(props, name)) {
      return interpreter.pseudoToNative(props[name])
    }
    scope = scope.parentScope
  }
  return undefined
}

function _deepEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (typeof a !== typeof b) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((val, idx) => _deepEqual(val, b[idx]))
    )
  }

  if (typeof a === "object" && a && b) {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false

    return aKeys.every((key) => _deepEqual(a[key], b[key]))
  }

  return false
}
