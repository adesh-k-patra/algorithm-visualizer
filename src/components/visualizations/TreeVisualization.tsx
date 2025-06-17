import React, { useEffect, useState } from 'react';
import { DataStructure, AlgorithmState } from '../../types/algorithm';

interface TreeVisualizationProps {
  dataStructure: DataStructure;
  algorithmState?: AlgorithmState;
}

interface TreeNode {
  value: any;
  x: number;
  y: number;
  left?: TreeNode;
  right?: TreeNode;
  isHighlighted?: boolean;
  isVisited?: boolean;
}

export function TreeVisualization({ dataStructure, algorithmState }: TreeVisualizationProps) {
  const [animatedNodes, setAnimatedNodes] = useState<Set<string>>(new Set());

  const calculatePositions = (node: any, x: number, y: number, spacing: number): TreeNode => {
    if (!node) return null;

    const treeNode: TreeNode = {
      value: node.value,
      x,
      y,
      isHighlighted: false,
      isVisited: false
    };

    if (node.left) {
      treeNode.left = calculatePositions(node.left, x - spacing, y + 80, spacing / 2);
    }

    if (node.right) {
      treeNode.right = calculatePositions(node.right, x + spacing, y + 80, spacing / 2);
    }

    return treeNode;
  };

  const updateNodeHighlights = (node: TreeNode, currentStep: number, steps: any[]): TreeNode => {
    if (!node || !steps || steps.length === 0) return node;

    const currentStepData = steps[currentStep];
    const isCurrentlyHighlighted = currentStepData?.highlightedNodes?.includes(node.value.toString());
    const isVisited = steps.slice(0, currentStep + 1).some(step => 
      step.highlightedNodes?.includes(node.value.toString()) && step.description?.includes('Visiting')
    );

    const updatedNode = {
      ...node,
      isHighlighted: isCurrentlyHighlighted,
      isVisited: isVisited && !isCurrentlyHighlighted
    };

    if (node.left) {
      updatedNode.left = updateNodeHighlights(node.left, currentStep, steps);
    }

    if (node.right) {
      updatedNode.right = updateNodeHighlights(node.right, currentStep, steps);
    }

    return updatedNode;
  };

  const renderNode = (node: TreeNode, parentX?: number, parentY?: number) => {
    if (!node) return null;

    const nodeColor = node.isHighlighted 
      ? "#ec4899" 
      : node.isVisited 
        ? "#10b981" 
        : "#374151";
    
    const strokeColor = node.isHighlighted 
      ? "#ec4899" 
      : node.isVisited 
        ? "#10b981" 
        : "#6b7280";

    return (
      <g key={`${node.x}-${node.y}-${node.value}`}>
        {/* Edge to parent */}
        {parentX !== undefined && parentY !== undefined && (
          <line
            x1={parentX}
            y1={parentY}
            x2={node.x}
            y2={node.y}
            stroke={strokeColor}
            strokeWidth={node.isHighlighted ? 3 : 2}
            className="transition-all duration-500"
          />
        )}

        {/* Node circle with animation */}
        <circle
          cx={node.x}
          cy={node.y}
          r={node.isHighlighted ? 30 : 25}
          fill={nodeColor}
          stroke={strokeColor}
          strokeWidth={2}
          className="transition-all duration-500 cursor-pointer hover:fill-gray-600"
          style={{
            filter: node.isHighlighted ? 'drop-shadow(0 0 10px #ec4899)' : 'none'
          }}
        />

        {/* Pulse animation for highlighted nodes */}
        {node.isHighlighted && (
          <circle
            cx={node.x}
            cy={node.y}
            r={25}
            fill="none"
            stroke="#ec4899"
            strokeWidth={2}
            opacity={0.6}
            className="animate-ping"
          />
        )}

        {/* Node value */}
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          className="transition-all duration-300"
        >
          {node.value}
        </text>

        {/* Recursively render children */}
        {node.left && renderNode(node.left, node.x, node.y)}
        {node.right && renderNode(node.right, node.x, node.y)}
      </g>
    );
  };

  if (!dataStructure?.data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No tree data available</p>
      </div>
    );
  }

  let rootNode = calculatePositions(dataStructure.data, 300, 60, 120);
  
  // Update highlights based on current step
  if (algorithmState?.executionSteps && algorithmState.currentStep >= 0) {
    rootNode = updateNodeHighlights(rootNode, algorithmState.currentStep, algorithmState.executionSteps);
  }

  const currentStepInfo = algorithmState?.executionSteps?.[algorithmState.currentStep];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Tree Visualization</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Unvisited</span>
          </div>
        </div>
      </div>

      {currentStepInfo && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
          <p className="text-sm text-pink-400 font-medium">
            Step {algorithmState.currentStep + 1}: {currentStepInfo.description}
          </p>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 600 400"
          className="bg-gray-900"
        >
          {rootNode && renderNode(rootNode)}
        </svg>
      </div>
    </div>
  );
}