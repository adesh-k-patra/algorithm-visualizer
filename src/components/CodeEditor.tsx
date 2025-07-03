import React, { useEffect, useRef, useState } from "react"
import Editor, { OnMount } from "@monaco-editor/react"
import { AlgorithmState } from "../types/algorithm"

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
  language: string
  algorithmState: AlgorithmState
}

export function CodeEditor({
  code,
  onChange,
  language,
  algorithmState,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)
  const [decorations, setDecorations] = useState<string[]>([])

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
  }

  // To highlight the lineNumber on algorithmState change
  useEffect(() => {
    if (
      !editorRef.current ||
      !monacoRef.current ||
      !algorithmState.executionSteps ||
      algorithmState.currentStep >= algorithmState.executionSteps.length
    )
      return

    const currentLine =
      algorithmState.executionSteps[algorithmState.currentStep]?.lineNumber
    console.log(currentLine)
    if (currentLine) {
      const Range = monacoRef.current.Range
      const newDecorations = editorRef.current.deltaDecorations(decorations, [
        {
          range: new Range(currentLine, 1, currentLine, 1000),
          options: {
            isWholeLine: true,
            className: "highlighted-line",
          },
        },
      ])
      setDecorations(newDecorations)
      editorRef.current.revealLineInCenter(currentLine)
    }
  }, [algorithmState.currentStep, algorithmState.executionSteps])

  // To remove highlight when user starts typing
  function handleEditorChange(value: string | undefined) {
    const editor = editorRef.current
    if (editor && decorations.length > 0) {
      editor.deltaDecorations(decorations, [])
      setDecorations([])
    }
    onChange(value || "")
  }

  return (
    <div className="h-full bg-gray-900">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          renderLineHighlight: "none",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: "on",
          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        }}
      />
    </div>
  )
}
