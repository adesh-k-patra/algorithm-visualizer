import React from 'react';

interface FileTabProps {
  name: string;
  type: string;
  isActive: boolean;
  onClick: () => void;
}

export function FileTab({ name, type, isActive, onClick }: FileTabProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'js':
        return '🟨';
      case 'md':
        return '📝';
      default:
        return '📄';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm border-r border-gray-700 flex items-center gap-2 transition-colors ${
        isActive
          ? 'bg-gray-900 text-white border-b-2 border-b-pink-500'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      <span>{getIcon(type)}</span>
      {name}
    </button>
  );
}