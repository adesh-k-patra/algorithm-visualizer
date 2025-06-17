import React from 'react';
import { DataStructure } from '../../types/algorithm';

interface ArrayVisualizationProps {
  dataStructure: DataStructure;
}

export function ArrayVisualization({ dataStructure }: ArrayVisualizationProps) {
  if (!dataStructure?.data || !Array.isArray(dataStructure.data)) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No array data available</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Array Visualization</h3>
      
      <div className="flex items-center justify-center flex-wrap gap-2">
        {dataStructure.data.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gray-700 border-2 border-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-lg hover:bg-gray-600 transition-colors">
              {value}
            </div>
            <div className="text-xs text-gray-400 mt-1">{index}</div>
          </div>
        ))}
      </div>
    </div>
  );
}