// // interface RunWithTraceOptions {
// //   code: string
// //   targetVar: string
// //   interval?: number
// //   onTraceUpdate?: (val: any) => void
// //   onComplete?: (trace: any[]) => void
// // }

// // function getVariable(interpreter: any, name: string): any {
// //   let scope = interpreter.getScope() // current scope
// //   while (scope) {
// //     const obj = scope.object
// //     if (
// //       obj &&
// //       obj.properties &&
// //       Object.prototype.hasOwnProperty.call(obj.properties, name)
// //     ) {
// //       return interpreter.pseudoToNative(obj.properties[name])
// //     }
// //     scope = scope.parentScope
// //   }
// //   return undefined // not found
// // }

// function _getVariable(interpreter: any, name: string): any {
//   let scope = interpreter.getScope()
//   while (scope) {
//     const obj = scope.object
//     const props = obj?.properties
//     if (props && Object.prototype.hasOwnProperty.call(props, name)) {
//       return interpreter.pseudoToNative(props[name])
//     }
//     scope = scope.parentScope
//   }
//   return undefined
// }

// function _filterConsecutiveDuplicates(trace: any[]): any[] {
//   const result: any[] = []
//   for (let i = 0; i < trace.length; i++) {
//     const curr = trace[i]
//     const prev = result[result.length - 1]

//     const isEqual =
//       Array.isArray(curr) && Array.isArray(prev)
//         ? curr.length === prev.length &&
//           curr.every((val, idx) => val === prev[idx])
//         : curr === prev

//     if (!isEqual) {
//       result.push(curr)
//     }
//   }
//   return result
// }

// function _deepEqual(a: any, b: any): boolean {
//   if (a === b) return true

//   if (typeof a !== typeof b) return false

//   if (Array.isArray(a) && Array.isArray(b)) {
//     return (
//       a.length === b.length && a.every((val, idx) => _deepEqual(val, b[idx]))
//     )
//   }

//   if (typeof a === "object" && a && b) {
//     const aKeys = Object.keys(a)
//     const bKeys = Object.keys(b)
//     if (aKeys.length !== bKeys.length) return false

//     return aKeys.every((key) => _deepEqual(a[key], b[key]))
//   }

//   return false
// }

// // function instrumentCode(code: string): string {
// //   const ast = parse(code, { sourceType: "module" })

// //   traverse(ast, {
// //     AssignmentExpression(path) {
// //       const varName = path.node.left.name
// //       const traceCall = t.expressionStatement(
// //         t.callExpression(t.identifier("__trace__"), [
// //           t.stringLiteral(varName),
// //           t.identifier(varName),
// //         ])
// //       )
// //       path.insertAfter(traceCall)
// //     },
// //     UpdateExpression(path) {
// //       const varName = path.node.argument.name
// //       const traceCall = t.expressionStatement(
// //         t.callExpression(t.identifier("__trace__"), [
// //           t.stringLiteral(varName),
// //           t.identifier(varName),
// //         ])
// //       )
// //       path.insertAfter(traceCall)
// //     },
// //   })

// //   return generate(ast).code
// // }

// // export function instrumentCode(code: string): string {
// //   const ast = parser.parse(code, {
// //     sourceType: "script",
// //     plugins: ["jsx"], // you can add more plugins if needed
// //   })

// //   traverse(ast, {
// //     AssignmentExpression(path) {
// //       const left = path.node.left
// //       let name: string

// //       if (t.isIdentifier(left)) {
// //         name = left.name
// //       } else if (t.isMemberExpression(left)) {
// //         name = generate(left).code
// //       } else {
// //         return
// //       }

// //       const traceCall = t.expressionStatement(
// //         t.callExpression(t.identifier("__trace__"), [
// //           t.stringLiteral(name),
// //           left,
// //         ])
// //       )

// //       path.insertAfter(traceCall)
// //     },
// //   })

// //   const { code: output } = generate(ast)
// //   console.log(output)
// //   return output
// // }

// // export function fun({
// //   code,
// //   targetVar,
// // }: {
// //   code: string
// //   targetVar: string
// //   interval?: number
// // }) {
// //   const trace: any[] = []
// //   const transformed = instrumentCode(code)
// //   // @ts-expect-error Interpreter is breaking ts
// //   const Interpreter = window.Interpreter
// //   if (!Interpreter) {
// //     throw new Error("Interpreter is not available on window.")
// //   }
// //   const interpreter = new Interpreter(
// //     transformed,
// //     (interpreter: any, globalObj: any) => {
// //       interpreter.setProperty(
// //         globalObj,
// //         "__trace__",
// //         interpreter.createNativeFunction((name: string, value: any) => {
// //           if (name === targetVar) trace.push(value) // capture into your array
// //         })
// //       )
// //     }
// //   )
// //   console.log("FINAL TRACE")
// //   console.log(trace)
// // }

// export async function parseAndExecuteCode({
//   code,
//   targetVar,
//   interval = 1,
// }: {
//   code: string
//   targetVar: string
//   interval?: number
// }): Promise<any[]> {
//   const trace: any[] = []

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

//         trace.push({
//           value: unwrapped,
//           line: lineNumber ?? -1, // fallback to -1 if location is missing
//         })

//         console.log(trace)
//       }

//       if (shouldContinue) {
//         setTimeout(step, interval)
//       } else {
//         resolve(trace)
//       }
//     }

//     step()
//   })
// }

// // export function runWithTrace({
// //   code,
// //   targetVar,
// //   interval = 500,
// //   onTraceUpdate = () => {},
// //   onComplete = () => {},
// // }: RunWithTraceOptions): void {
// //   const trace: any[] = [];

// //   const Interpreter = window.Interpreter;
// //   if (!Interpreter) {
// //     throw new Error("Interpreter is not available on window.");
// //   }

// //   const interpreter = new Interpreter(code);

// //   let lastValue: any;

// //   function step(): void {
// //     const shouldContinue = interpreter.step();

// //     const scope = interpreter.getScope();
// //     const value = scope.properties[targetVar];
// //     const unwrapped = interpreter.pseudoToNative(value);

// //     if (unwrapped !== undefined && unwrapped !== lastValue) {
// //       lastValue = unwrapped;
// //       trace.push(unwrapped);
// //       onTraceUpdate(unwrapped);
// //     }

// //     if (shouldContinue) {
// //       setTimeout(step, interval);
// //     } else {
// //       onComplete(trace);
// //     }
// //   }

// //   step();
// // }

const _normalizeToTree = (obj, key = "root", x, y) => {
  const node = {
    key,
    value: null,
    children: [],
    x,
    y,
  }

  const childY = y + 100
  const spacing = 100

  if (obj !== null && typeof obj === "object") {
    if (Array.isArray(obj)) {
      node.value = obj
    } else {
      const keys = Object.keys(obj)
      const mid = Math.floor(keys.length / 2)

      keys.forEach((childKey, index) => {
        const offset = (index - mid) * spacing
        const childX = x + offset
        const childNode = _normalizeToTree(
          obj[childKey],
          childKey,
          childX,
          childY
        )
        node.children.push(childNode)
      })
    }
  } else {
    node.value = obj
  }

  return node
}

// const user = {
//   username: [1, 2, 3],
//   details: {
//     email: "john@example.com",
//     address: {
//       city: "New York",
//       zip: "10001",
//     },
//   },
// }

const user = [1, 2, 3]

const tree = {
  value: 5,
  left: {
    value: 2,
    left: {
      value: 4,
      left: null,
      right: null,
    },
    right: {
      value: 1,
      left: null,
      right: null,
    },
  },
  right: {
    value: 3,
    left: {
      value: 6,
      left: null,
      right: null,
    },
    right: {
      value: 7,
      left: null,
      right: null,
    },
  },
}

const normalizedTree = _normalizeToTree(tree, "user", 300, 100)
console.log(normalizedTree)
// You can now render this `normalizedTree` using your tree/graph visualizer
