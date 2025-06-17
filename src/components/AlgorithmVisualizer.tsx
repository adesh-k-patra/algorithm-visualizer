import React, { useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { CodeEditor } from "./CodeEditor"
import { VisualizationPanel } from "./VisualizationPanel"
import { ControlPanel } from "./ControlPanel"
import { ConsoleOutput } from "./ConsoleOutput"
import { VariableSelector } from "./VariableSelector"
import { AlgorithmState } from "../types/algorithm"

const initialCode = `// Tree Traversal Visualization
const tree = {
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

const myArray = [64, 34, 25, 12, 22, 11, 90];
const myStack = [1, 2, 3, 4, 5];

function inorderTraversal(root) {
  if (!root) return;
  
  inorderTraversal(root.left);
  console.log("Visiting:", root.value);
  inorderTraversal(root.right);
}

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

inorderTraversal(tree);`

export function AlgorithmVisualizer() {
  const [code, setCode] = useState(initialCode)
  const [selectedVariable, setSelectedVariable] = useState("")
  const [selectedDataStructure, setSelectedDataStructure] = useState("")
  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>({
    isRunning: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: 0,
    logs: [],
    dataStructure: null,
    highlightedNodes: [],
    executionSpeed: 1000,
  })

  // const files = [
  //   { name: 'README.md', type: 'md' },
  //   { name: 'main.js', type: 'js' },
  //   { name: 'sorting.js', type: 'js' },
  //   { name: 'traversal.js', type: 'js' }
  // ];

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
        <h1 className="text-lg font-semibold text-white">
          Algorithm Visualizer
        </h1>
      </div>

      {/* File Tabs */}
      {/* <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center">
        {files.map((file) => (
          <FileTab
            key={file.name}
            name={file.name}
            type={file.type}
            isActive={activeFile === file.name}
            onClick={() => setActiveFile(file.name)}
          />
        ))}
      </div> */}

      {/* Variable Selection Panel */}
      <div className="flex justify-between">
        <ControlPanel
          algorithmState={algorithmState}
          onStateChange={setAlgorithmState}
          code={code}
          selectedVariable={selectedVariable}
          selectedDataStructure={selectedDataStructure}
        />
        <VariableSelector
          code={code}
          selectedVariable={selectedVariable}
          selectedDataStructure={selectedDataStructure}
          onVariableChange={setSelectedVariable}
          onDataStructureChange={setSelectedDataStructure}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <PanelGroup direction="horizontal">
          {/* Left Side: Visualization + Console (vertical layout) */}
          <Panel>
            <PanelGroup direction="vertical">
              {/* Top Panel - Visualization Panel  */}
              <Panel defaultSize={70} minSize={30}>
                <div>
                  <VisualizationPanel algorithmState={algorithmState} />
                </div>
              </Panel>
              <PanelResizeHandle
                id="vertical-handle"
                className="h-2 bg-gray-700 hover:bg-gray-600 transition-colors cursor-row-resize"
              />
              {/* Bottom Panel - Consol Panel  */}
              <Panel defaultSize={30} minSize={20}>
                <div>
                  <ConsoleOutput logs={algorithmState.logs} />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle
            id="horizontal-handle"
            className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors cursor-col-resize"
          />

          {/* Right Panel - Code Editor */}
          <Panel defaultSize={50} minSize={30}>
            <CodeEditor code={code} onChange={setCode} language="javascript" />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}
