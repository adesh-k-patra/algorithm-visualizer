import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types/algorithm';

interface ConsoleOutputProps {
  logs: LogEntry[];
}

export function ConsoleOutput({ logs }: ConsoleOutputProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="h-full bg-gray-900 border-t border-gray-700">
      <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-4">
        <h3 className="text-sm font-medium text-gray-300">Console Output</h3>
      </div>
      
      <div 
        ref={consoleRef}
        className="h-40 overflow-y-auto p-2 space-y-1 font-mono text-sm"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 italic">No output yet...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`${getLogColor(log.type)} leading-relaxed`}>
              <span className="text-gray-500 text-xs mr-2">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}