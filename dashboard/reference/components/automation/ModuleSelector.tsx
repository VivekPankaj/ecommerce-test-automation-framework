import React from 'react';

interface ModuleSelectorProps {
  modules: string[];
  selectedModules: string[];
  onSelectionChange: (selected: string[]) => void;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  modules,
  selectedModules,
  onSelectionChange,
}) => {
  const handleToggleAll = () => {
    if (selectedModules.length === modules.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(modules);
    }
  };

  const handleToggleModule = (module: string) => {
    if (selectedModules.includes(module)) {
      onSelectionChange(selectedModules.filter((m) => m !== module));
    } else {
      onSelectionChange([...selectedModules, module]);
    }
  };

  const allSelected = selectedModules.length === modules.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 pb-2 border-b">
        <input
          type="checkbox"
          id="select-all"
          checked={allSelected}
          onChange={handleToggleAll}
          className="w-4 h-4"
        />
        <label htmlFor="select-all" className="font-medium">
          Select All Modules
        </label>
        <span className="text-sm text-gray-600 ml-auto">
          ({selectedModules.length}/{modules.length})
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {modules.map((module) => (
          <label
            key={module}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedModules.includes(module)}
              onChange={() => handleToggleModule(module)}
              className="w-4 h-4"
            />
            <span className="text-sm">{module}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ModuleSelector;
