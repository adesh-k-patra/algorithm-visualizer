import { useEffect, useMemo, useRef, useState } from "react"
import { AlgorithmState, TreeNode } from "../types/algorithm"
import { normalizeToTree } from "../utils/normalizeToTree"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

interface renderTraceProps {
  algorithmState: AlgorithmState
  selectedVariable: string
}

export const RenderTrace = ({
  algorithmState,
  selectedVariable,
}: renderTraceProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 600,
  })
  console.log("Debug")
  console.log(algorithmState?.executionSteps?.[algorithmState.currentStep])
  const variableValue =
    algorithmState?.executionSteps?.[algorithmState.currentStep]?.targetVars?.[
      selectedVariable
    ]

  const startX = containerSize.width / 2
  const startY = 60
  const spacingX = 100
  const spacingY = 100

  // Step 1: Generate tree
  const treeNodes = useMemo(() => {
    return normalizeToTree(
      variableValue,
      selectedVariable,
      startX,
      startY,
      spacingX,
      spacingY
    )
  }, [variableValue, selectedVariable])

  // Step 2: Compute bounds
  const bounds = useMemo(() => {
    const coords = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    }

    const traverse = (node: TreeNode) => {
      coords.minX = Math.min(coords.minX, node.x)
      coords.minY = Math.min(coords.minY, node.y)
      coords.maxX = Math.max(coords.maxX, node.x)
      coords.maxY = Math.max(coords.maxY, node.y)
      node.children.forEach(traverse)
    }

    traverse(treeNodes)

    const padding = 50
    return {
      minX: coords.minX - padding,
      minY: coords.minY - padding,
      width: coords.maxX - coords.minX + padding * 2,
      height: coords.maxY - coords.minY + padding * 2,
    }
  }, [treeNodes])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSize = () => {
      const width = container.clientWidth
      const height = container.clientHeight

      // only update if changed
      setContainerSize((prev) => {
        if (prev.width !== width || prev.height !== height) {
          return { width, height }
        }
        return prev
      })
    }

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  // Wait until layout and scale is ready
  if (!algorithmState?.executionSteps) {
    return <div ref={containerRef} className="w-full h-full" />
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-w-0 bg-orange-700"
    >
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={5}
        centerOnInit
        wheel={{ step: 0.1 }}
        pinch={{ step: 5 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-2 left-2 z-10 flex gap-2">
              <button
                onClick={() => zoomIn()}
                className="px-2 py-1 bg-blue-600 text-white rounded"
              >
                Zoom In
              </button>
              <button
                onClick={() => zoomOut()}
                className="px-2 py-1 bg-blue-600 text-white rounded"
              >
                Zoom Out
              </button>
              <button
                onClick={() => resetTransform()}
                className="px-2 py-1 bg-gray-700 text-white rounded"
              >
                Reset
              </button>
            </div>

            <TransformComponent>
              <svg
                width={containerSize.width}
                height={containerSize.height}
                viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
                className="bg-slate-100 block"
              >
                {renderNodes(treeNodes)}
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}

const renderNodes = (root: TreeNode): JSX.Element => {
  const [lineArray, nodeArray] = _renderNodes([root])
  return (
    <>
      {lineArray}
      {nodeArray}
    </>
  )
}

const _renderNodes = (
  nodes: TreeNode[],
  parent?: TreeNode
): [JSX.Element[], JSX.Element[]] => {
  const lineArray: JSX.Element[] = []
  const nodeArray: JSX.Element[] = []

  nodes.forEach((node, i) => {
    if (parent) {
      lineArray.push(
        <line
          key={`line-${parent.name}-${node.name}-${i}`}
          x1={parent.x}
          y1={parent.y}
          x2={node.x}
          y2={node.y}
          stroke="#888"
          strokeWidth={2}
        />
      )
    }

    nodeArray.push(
      <g key={`node-${node.name}-${i}`}>
        <circle
          cx={node.x}
          cy={node.y}
          r={25}
          fill="#2563eb"
          stroke="#1e3a8a"
          strokeWidth={2}
        />
        <text
          x={node.x}
          y={node.y - 8}
          fill="white"
          fontSize="12"
          textAnchor="middle"
        >
          {node.name}
        </text>
        {node.value && (
          <text
            x={node.x}
            y={node.y + 12}
            fill="#d1d5db"
            fontSize="10"
            textAnchor="middle"
          >
            {typeof node.value === "object"
              ? JSON.stringify(node.value)
              : node.value}
          </text>
        )}
      </g>
    )

    if (node.children && node.children.length > 0) {
      const [_lines, _nodes] = _renderNodes(node.children, node)
      lineArray.push(..._lines)
      nodeArray.push(..._nodes)
    }
  })

  return [lineArray, nodeArray]
}

// export function RenderArray() {
//   const array = [1, 2, 3, 4, 5, 6]
//   return (
//     <div className="flex bg-blue-600">
//       {array.map((item: any, index: number) => (
//         <div
//           key={index}
//           className="border h-12 w-12 flex items-center justify-center bg-slate-600 border-orange-300 text-xl text-white"
//         >
//           {item}
//         </div>
//       ))}
//     </div>
//   )
// }
