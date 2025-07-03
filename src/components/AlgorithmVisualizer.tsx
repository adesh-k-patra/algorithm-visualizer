import React, { useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { CodeEditor } from "./CodeEditor"
import { VisualizationPanel } from "./VisualizationPanel"
import { ControlPanel } from "./ControlPanel"
import { ConsoleOutput } from "./ConsoleOutput"
import { VariableSelector } from "./VariableSelector"
import { AlgorithmState } from "../types/algorithm"
import { RenderTrace } from "./RenderTrace"
import { NonTargetOutput } from "./NonTargetOutput"

const initialCode = `var person = {
  name: "Alice",
  age: 25,
  address: {
    city: {
      road: {
        house: {
          floor: 2
        }
      }
    },
    zip: "10001"
  }
};

// Step 1
person.age = 26;


// Step 3
person.email = "alice@example.com";

// Step 4
delete person.address.zip;

// Step 5
person.hobbies = ["reading", "traveling"];

`

export function AlgorithmVisualizer() {
  const [code, setCode] = useState(initialCode)
  const [variables, setVariables] = useState<string[]>([])
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
          variables={variables}
          selectedVariable={selectedVariable}
          selectedDataStructure={selectedDataStructure}
        />
        <VariableSelector
          code={code}
          variables={variables}
          onVariablesSet={setVariables}
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
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top Panel - Visualization Panel  */}
              <Panel defaultSize={70} minSize={30}>
                <div className="flex h-full">
                  <div className="flex-1 min-w-24 bg-slate-600">
                    <RenderTrace
                      algorithmState={algorithmState}
                      selectedVariable={selectedVariable}
                    />
                  </div>
                  <div className="w-[250px] bg-orange-500">
                    <NonTargetOutput algorithmState={algorithmState} />
                  </div>
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
            <CodeEditor
              code={code}
              onChange={setCode}
              language="javascript"
              algorithmState={algorithmState}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}
