import {
  ParsedCode,
  DataStructure,
  LogEntry,
  ExecutionStep,
} from "../types/algorithm"
import * as Babel from "@babel/standalone"
import { SourceMapConsumer } from "source-map-js"

export async function parseAndExecuteCode({
  code,
  targetVar,
  nonTargetVars,
}: {
  code: string
  targetVar: string
  nonTargetVars: string[]
}): Promise<ExecutionStep[]> {
  const traceArray: ExecutionStep[] = []

  const transformed = Babel.transform(code, {
    presets: ["env"],
    sourceMaps: true,
    filename: "/user-code.js",
  })

  // @ts-expect-error Interpreter is not typed
  const Interpreter = window.Interpreter
  if (!Interpreter) {
    throw new Error("Interpreter is not available on window.")
  }

  const interpreter = new Interpreter(transformed.code)
  let lastValue: any
  const consumer = new SourceMapConsumer(transformed.map)

  return new Promise((resolve) => {
    while (interpreter.step()) {
      const result = _getVariableValue(interpreter, targetVar, nonTargetVars)
      const unwrapped = result.targetVars?.[targetVar]

      if (unwrapped != null && !_deepEqual(unwrapped, lastValue)) {
        lastValue = unwrapped

        const currentNode =
          interpreter.stateStack?.[interpreter.stateStack.length - 1]?.node

        let lineNumber: number | null = null

        if (currentNode?.loc) {
          const original = consumer.originalPositionFor({
            line: currentNode.loc.start.line,
            column: currentNode.loc.start.column,
          })
          lineNumber = original.line || 1
        }
        result.lineNumber = lineNumber
        traceArray.push(result)
      }
    }
    resolve(traceArray)
  })
}

// export async function parseAndExecuteCode({
//   code,
//   targetVar,
//   nonTargetVars,
// }: {
//   code: string
//   targetVar: string
//   nonTargetVars: string[]
// }): Promise<ExecutionStep[]> {
//   const traceArray: ExecutionStep[] = []

//   // js-interpreter is only compatible with ES5 and below
//   const convertedCode = Babel.transform(code, {
//     presets: ["env"],
//   }).code

//   // @ts-expect-error Interpreter is breaking ts
//   const Interpreter = window.Interpreter
//   if (!Interpreter) {
//     throw new Error("Interpreter is not available on window.")
//   }

//   const interpreter = new Interpreter(convertedCode)
//   let lastValue: any

//   return new Promise((resolve) => {
//     while (interpreter.step()) {
//       const result = _getVariableValue(interpreter, targetVar, nonTargetVars)
//       const unwrapped = result.targetVars[targetVar]

//       if (unwrapped != null && !_deepEqual(unwrapped, lastValue)) {
//         lastValue = unwrapped

//         const currentNode =
//           interpreter.stateStack?.[interpreter.stateStack.length - 1]?.node
//         let lineNumber: number | null = null

//         if (currentNode?.loc?.start?.line) {
//           lineNumber = currentNode.loc.start.line
//         } else if (currentNode?.start !== undefined) {
//           // fallback: estimate line from code string
//           const upToChar = convertedCode.slice(0, currentNode.start)
//           lineNumber = upToChar.split("\n").length
//         }
//         console.log("Line Number :" + lineNumber)
//         traceArray.push(result)
//       }
//     }

//     resolve(traceArray)
//   })
// }

// Helper function

function _getVariableValue(
  interpreter: any,
  targetVar: string,
  nonTargetVars: string[]
): ExecutionStep {
  const ans: ExecutionStep = {
    targetVars: {},
    nonTargetVars: {},
    lineNumber: null,
  }

  let scope = interpreter.getScope()
  while (scope) {
    const props = scope.object?.properties
    if (props) {
      // Add targetVar if found
      if (
        targetVar &&
        !(targetVar in ans.targetVars) &&
        Object.prototype.hasOwnProperty.call(props, targetVar)
      ) {
        ans.targetVars[targetVar] = interpreter.pseudoToNative(props[targetVar])
      }

      // Add nonTargetVars if found
      for (const varName of nonTargetVars) {
        if (
          !(varName in ans.nonTargetVars) &&
          Object.prototype.hasOwnProperty.call(props, varName)
        ) {
          ans.nonTargetVars[varName] = interpreter.pseudoToNative(
            props[varName]
          )
        }
      }
    }

    scope = scope.parentScope
  }

  return ans
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
