import React from "react"
import Editor from "@monaco-editor/react"

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
  language: string
}

export function CodeEditor({ code, onChange, language }: CodeEditorProps) {
  return (
    <div className="h-full bg-gray-900">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          renderLineHighlight: "all",
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
