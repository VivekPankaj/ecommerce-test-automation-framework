import React, { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, Download } from 'lucide-react';
import { automationService } from '../../services/automationService';
import ModuleSelector from './ModuleSelector';
import TestResults from './TestResults';

const TestExecutionPanel: React.FC = () => {
  const [modules, setModules] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [browser, setBrowser] = useState<string>('chromium');
  const [parallel, setParallel] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentExecution, setCurrentExecution] = useState<any>(null);
  const [executionOutput, setExecutionOutput] = useState<string[]>([]);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const data = await automationService.getAvailableModules();
      setModules(data.modules);
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const handleExecuteTests = async () => {
    setIsRunning(true);
    setExecutionOutput([]);

    try {
      const stream = await automationService.streamTests({
        modules: selectedModules.length > 0 ? selectedModules : undefined,
        browser,
        parallel,
      });

      if (!stream) {
        throw new Error('No stream received');
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'output') {
              setExecutionOutput((prev) => [...prev, data.data]);
            } else if (data.type === 'complete') {
              setCurrentExecution(data);
              setIsRunning(false);
            } else if (data.type === 'error') {
              console.error('Execution error:', data.error);
              setIsRunning(false);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error executing tests:', error);
      setIsRunning(false);
    }
  };

  const handleStopExecution = async () => {
    if (currentExecution?.execution_id) {
      await automationService.stopExecution(currentExecution.execution_id);
      setIsRunning(false);
    }
  };

  const handleGenerateScenarios = async () => {
    try {
      await automationService.generateScenarios(selectedModules);
      alert('Scenarios generated successfully!');
    } catch (error) {
      console.error('Failed to generate scenarios:', error);
      alert('Failed to generate scenarios');
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Test Execution Configuration</h2>
        
        <div className="space-y-4">
          {/* Module Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Modules</label>
            <ModuleSelector
              modules={modules}
              selectedModules={selectedModules}
              onSelectionChange={setSelectedModules}
            />
          </div>

          {/* Browser Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Browser</label>
            <select
              value={browser}
              onChange={(e) => setBrowser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="chromium">Chromium</option>
              <option value="firefox">Firefox</option>
              <option value="webkit">WebKit</option>
            </select>
          </div>

          {/* Parallel Execution */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="parallel"
              checked={parallel}
              onChange={(e) => setParallel(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="parallel" className="text-sm">
              Run tests in parallel
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleExecuteTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? <Square size={16} /> : <Play size={16} />}
            {isRunning ? 'Running...' : 'Execute Tests'}
          </button>

          {isRunning && (
            <button 
              onClick={handleStopExecution} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Stop Execution
            </button>
          )}

          <button 
            onClick={handleGenerateScenarios} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
          >
            <RefreshCw size={16} />
            Generate Scenarios from Jira
          </button>
        </div>
      </div>

      {/* Execution Output */}
      {executionOutput.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Execution Output</h3>
            <button className="text-gray-600 hover:text-gray-900">
              <Download size={16} />
            </button>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
            {executionOutput.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {currentExecution?.results && (
        <TestResults results={currentExecution.results} executionId={currentExecution.execution_id} />
      )}
    </div>
  );
};

export default TestExecutionPanel;
