import React, { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import * as parser from "@babel/parser"
import traverse from "@babel/traverse"
import {
  isIdentifier,
  isObjectPattern,
  isArrayPattern,
  isRestElement,
  isAssignmentPattern,
  type Pattern,
  type Identifier,
  type ObjectPattern,
  type ArrayPattern,
  type RestElement,
  type AssignmentPattern,
  type VariableDeclarator,
  type FunctionDeclaration,
  type FunctionExpression,
  type ArrowFunctionExpression,
} from "@babel/types"
import type { NodePath } from "@babel/traverse"

interface VariableSelectorProps {
  code: string
  selectedVariable: string
  selectedDataStructure: string
  onVariableChange: (variable: string) => void
  onDataStructureChange: (dataStructure: string) => void
}

export function VariableSelector({
  code,
  selectedVariable,
  selectedDataStructure,
  onVariableChange,
  onDataStructureChange,
}: VariableSelectorProps) {
  const [variables, setVariables] = useState<string[]>([])
  const [showVariableDropdown, setShowVariableDropdown] = useState(false)
  const [showDataStructureDropdown, setShowDataStructureDropdown] =
    useState(false)

  const dataStructureTypes = [
    { value: "tree", label: "Binary Tree" },
    { value: "array", label: "Array" },
    { value: "stack", label: "Stack" },
    { value: "queue", label: "Queue" },
    { value: "linkedlist", label: "Linked List" },
    { value: "graph", label: "Graph" },
  ]

  // Helper to extract names from patterns (identifiers, arrays, objects)
  function _extractFromPattern(pattern: Pattern, variableList: string[]) {
    if (isIdentifier(pattern)) {
      variableList.push((pattern as Identifier).name)
    } else if (isObjectPattern(pattern)) {
      for (const prop of (pattern as ObjectPattern).properties) {
        if (prop.type === "ObjectProperty") {
          _extractFromPattern(prop.value as Pattern, variableList)
        } else if (prop.type === "RestElement") {
          _extractFromPattern(prop.argument as Pattern, variableList)
        }
      }
    } else if (isArrayPattern(pattern)) {
      for (const element of (pattern as ArrayPattern).elements) {
        if (element) _extractFromPattern(element as Pattern, variableList)
      }
    } else if (isRestElement(pattern)) {
      _extractFromPattern(
        (pattern as RestElement).argument as Pattern,
        variableList
      )
    } else if (isAssignmentPattern(pattern)) {
      _extractFromPattern(
        (pattern as AssignmentPattern).left as Pattern,
        variableList
      )
    }
  }

  useEffect(() => {
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    })
    const variables: string[] = []
    traverse(ast, {
      VariableDeclarator(path: NodePath<VariableDeclarator>) {
        _extractFromPattern(path.node.id as Pattern, variables)
      },
      FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
        path.node.params.forEach((param) =>
          _extractFromPattern(param as Pattern, variables)
        )
      },
      FunctionExpression(path: NodePath<FunctionExpression>) {
        path.node.params.forEach((param) =>
          _extractFromPattern(param as Pattern, variables)
        )
      },
      ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
        path.node.params.forEach((param) =>
          _extractFromPattern(param as Pattern, variables)
        )
      },
    })
    setVariables(variables)
  }, [code])

  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-6">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-300">
          Variable to Visualize:
        </label>
        <div className="relative">
          <button
            onClick={() => setShowVariableDropdown(!showVariableDropdown)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors min-w-[150px] justify-between"
          >
            <span className="text-white">
              {selectedVariable || "Select Variable"}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                showVariableDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showVariableDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
              {variables.length === 0 ? (
                <div className="px-3 py-2 text-gray-400 text-sm">
                  No variables found
                </div>
              ) : (
                variables.map((variable) => (
                  <button
                    key={variable}
                    onClick={() => {
                      onVariableChange(variable)
                      setShowVariableDropdown(false)
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-600 transition-colors text-white"
                  >
                    {variable}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-300">
          Data Structure Type:
        </label>
        <div className="relative">
          <button
            onClick={() =>
              setShowDataStructureDropdown(!showDataStructureDropdown)
            }
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors min-w-[150px] justify-between"
          >
            <span className="text-white">
              {dataStructureTypes.find(
                (ds) => ds.value === selectedDataStructure
              )?.label || "Select Type"}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                showDataStructureDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDataStructureDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
              {dataStructureTypes.map((dataStructure) => (
                <button
                  key={dataStructure.value}
                  onClick={() => {
                    onDataStructureChange(dataStructure.value)
                    setShowDataStructureDropdown(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-600 transition-colors text-white"
                >
                  {dataStructure.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedVariable && selectedDataStructure && (
        <div className="flex items-center gap-2 px-3 py-1 bg-pink-600/20 border border-pink-500/30 rounded-lg">
          <span className="text-pink-400 text-sm">
            Visualizing: <strong>{selectedVariable}</strong> as{" "}
            <strong>
              {
                dataStructureTypes.find(
                  (ds) => ds.value === selectedDataStructure
                )?.label
              }
            </strong>
          </span>
        </div>
      )}
    </div>
  )
}
