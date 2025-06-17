import React from 'react';
import { DataStructure } from '../../types/algorithm';

interface StackVisualizationProps {
  dataStructure: DataStructure;
}

export function StackVisualization({ dataStructure }: StackVisualizationProps) {
  if (!dataStructure?.data || !Array.isArray(dataStructure.data)) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No stack data available</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Stack Visualization</h3>
      
      <div className="flex flex-col-reverse items-center justify-center gap-1">
        {dataStructure.data.map((value, index) => (
          <div
            key={index}
            className="w-32 h-12 bg-gray-700 border-2 border-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-lg hover:bg-gray-600 transition-colors relative"
          >
            {value}
            {index === dataStructure.data.length - 1 && (
              <div className="absolute -right-16 text-pink-400 text-sm font-medium">
                ← TOP
              </div>
            )}
          </div>
        ))}
        
        <div className="w-36 h-2 bg-gray-600 rounded-full mt-2"></div>
        <div className="text-xs text-gray-400 mt-1">BASE</div>
      </div>
    </div>
  );
}