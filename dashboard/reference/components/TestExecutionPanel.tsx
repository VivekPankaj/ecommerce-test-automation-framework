import { useState, useEffect } from 'react';
import { PlayCircle, StopCircle, CheckCircle2, XCircle, Clock, Loader, ChevronDown, ChevronRight } from 'lucide-react';
import { testAPI } from '../services/api';
import toast from 'react-hot-toast';
import type { TestExecution, TestScenario } from '../types';

interface TestExecutionPanelProps {
  selectedModules: string[];
  selectedScenarios: Record<string, string[]>; // moduleId -> scenario names
}

// Component for expandable scenario row
function ScenarioRow({ scenario }: { scenario: TestScenario }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Parse error to find failed step
  const getFailedStepIndex = (): number => {
    if (!scenario.error || !scenario.steps) return -1;
    
    // Try to find which step failed based on error message
    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      if (scenario.error.toLowerCase().includes(step.text.toLowerCase())) {
        return i;
      }
    }
    
    // If we can't determine, assume the last step failed
    return scenario.steps.length - 1;
  };
  
  const failedStepIndex = scenario.status === 'failed' ? getFailedStepIndex() : -1;
  
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* Scenario Header - Clickable */}
      <div 
        className={`p-4 cursor-pointer transition-colors ${
          isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {/* Expand/Collapse Icon */}
              <div className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </div>
              
              {/* Status Icon */}
              {scenario.status === 'passed' && (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
              {scenario.status === 'failed' && (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              {scenario.status === 'running' && (
                <Loader className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
              )}
              {scenario.status === 'pending' && (
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              {scenario.status === 'skipped' && (
                <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 text-xs font-bold">S</span>
                </div>
              )}

              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{scenario.name || scenario.scenario}</h4>
                <p className="text-sm text-gray-500">
                  {scenario.module} • {scenario.feature}
                </p>
              </div>
            </div>
          </div>

          <div className="ml-4 text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                scenario.status === 'passed'
                  ? 'bg-green-100 text-green-700'
                  : scenario.status === 'failed'
                  ? 'bg-red-100 text-red-700'
                  : scenario.status === 'running'
                  ? 'bg-blue-100 text-blue-700'
                  : scenario.status === 'skipped'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {scenario.status}
            </span>
            {scenario.duration && (
              <p className="text-xs text-gray-500 mt-1">{scenario.duration}s</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Content - Steps and Error */}
      {isExpanded && (
        <div className="px-4 pb-4 bg-gray-50">
          {/* Steps */}
          {scenario.steps && scenario.steps.length > 0 && (
            <div className="mt-2 ml-8">
              <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Steps</h5>
              <div className="space-y-1">
                {scenario.steps.map((step, index) => {
                  const isFailed = index === failedStepIndex;
                  const isPastFailed = failedStepIndex >= 0 && index > failedStepIndex;
                  const isPassed = scenario.status === 'passed' || (scenario.status === 'failed' && index < failedStepIndex);
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-start space-x-2 p-2 rounded text-sm ${
                        isFailed 
                          ? 'bg-red-100 border border-red-300' 
                          : isPastFailed
                          ? 'bg-gray-100 text-gray-400'
                          : isPassed
                          ? 'bg-green-50'
                          : 'bg-white'
                      }`}
                    >
                      {/* Step Status Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {isFailed ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : isPastFailed ? (
                          <Clock className="w-4 h-4 text-gray-300" />
                        ) : isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1">
                        <span className={`font-semibold ${
                          isFailed ? 'text-red-700' : 'text-blue-600'
                        }`}>
                          {step.keyword}
                        </span>
                        <span className={isFailed ? 'text-red-700' : 'text-gray-700'}>
                          {' '}{step.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {scenario.error && (
            <div className="mt-3 ml-8 p-3 bg-red-50 border border-red-200 rounded">
              <h5 className="text-xs font-semibold text-red-600 uppercase mb-1">Error Details</h5>
              <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono overflow-x-auto">
                {scenario.error}
              </pre>
            </div>
          )}
          
          {/* Screenshot Link */}
          {scenario.screenshot && (
            <div className="mt-3 ml-8">
              <a 
                href={scenario.screenshot} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                📷 View Screenshot
              </a>
            </div>
          )}
          
          {/* No steps available message */}
          {(!scenario.steps || scenario.steps.length === 0) && !scenario.error && (
            <div className="mt-2 ml-8 text-sm text-gray-500 italic">
              No step details available for this scenario.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TestExecutionPanel({ selectedModules, selectedScenarios: _selectedScenarios }: TestExecutionPanelProps) {
  const [execution, setExecution] = useState<TestExecution | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [headless, setHeadless] = useState(true);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Check for active execution on mount
  useEffect(() => {
    const checkActiveExecution = async () => {
      try {
        const activeExec = await testAPI.getActiveExecution();
        if (activeExec && (activeExec.status === 'running' || activeExec.status === 'pending')) {
          setExecution(activeExec);
          setIsRunning(true);
          startPolling(activeExec.id);
          toast('Resumed active execution', { icon: '▶️' });
        }
      } catch (error) {
        console.error('Error checking active execution:', error);
      }
    };
    
    checkActiveExecution();
    
    // Cleanup on unmount
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

  const startPolling = (executionId: string) => {
    // Clear any existing interval
    if (pollInterval) {
      clearInterval(pollInterval);
    }

    const interval = setInterval(async () => {
      try {
        const exec = await testAPI.getExecution(executionId);
        setExecution(exec);
        
        if (exec.status === 'completed' || exec.status === 'failed' || exec.status === 'stopped') {
          clearInterval(interval);
          setPollInterval(null);
          setIsRunning(false);
          if (exec.status === 'stopped') {
            toast('Test execution stopped', { icon: 'ℹ️' });
          } else {
            toast.success('Test execution completed!');
          }
        }
      } catch (error) {
        console.error('Error polling execution:', error);
        clearInterval(interval);
        setPollInterval(null);
        setIsRunning(false);
      }
    }, 2000);
    
    setPollInterval(interval);
  };

  const startTests = async () => {
    if (selectedModules.length === 0) {
      toast.error('Please select at least one module to test');
      return;
    }

    try {
      setIsRunning(true);
      const mode = headless ? 'headless' : 'with browser visible';
      toast.success(`Starting test execution (${mode})...`);
      const { executionId } = await testAPI.runTests(selectedModules, headless);
      
      // Start polling for this execution
      startPolling(executionId);
    } catch (error: any) {
      setIsRunning(false);
      const errorMsg = error.response?.data?.detail || 'Failed to start tests';
      toast.error(errorMsg);
      console.error(error);
    }
  };

  const stopTests = async () => {
    if (execution) {
      try {
        const response = await testAPI.stopExecution(execution.id);
        
        // Update execution state with final counts from the response
        if (response.execution) {
          setExecution(response.execution);
        }
        
        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
        }
        setIsRunning(false);
        toast.success('Test execution stopped');
      } catch (error) {
        toast.error('Failed to stop tests');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Execution Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Test Execution</h2>
            <p className="text-gray-600">
              {selectedModules.length === 0
                ? 'No modules selected. Go to Module Selection tab.'
                : `${selectedModules.length} module(s) selected for testing`}
            </p>
          </div>

          <div className="flex space-x-3">
            {!isRunning ? (
              <button
                onClick={startTests}
                disabled={selectedModules.length === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start Tests</span>
              </button>
            ) : (
              <button
                onClick={stopTests}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <StopCircle className="w-5 h-5" />
                <span>Stop Tests</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Headless Mode Toggle */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Browser Mode</label>
              <p className="text-xs text-gray-500 mt-1">
                {headless 
                  ? 'Tests will run in headless mode (faster, no browser window)'
                  : 'Tests will run with visible browser (watch tests execute in real-time)'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setHeadless(true)}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  headless
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Headless (Fast)
              </button>
              <button
                onClick={() => setHeadless(false)}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !headless
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Visible Browser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Stats */}
      {execution && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-lg font-bold text-gray-900">
                  {execution.endTime
                    ? `${Math.round((new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()) / 1000)}s`
                    : 'Running...'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-700 font-bold">{execution.totalTests}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-lg font-bold text-gray-900">{execution.totalTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Passed</p>
                <p className="text-lg font-bold text-green-600">{execution.passed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-xs text-gray-500">Failed</p>
                <p className="text-lg font-bold text-red-600">{execution.failed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-700 font-bold">{execution.skipped}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Skipped</p>
                <p className="text-lg font-bold text-yellow-600">{execution.skipped}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {execution && execution.scenarios.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Test Scenarios</h3>
            <p className="text-sm text-gray-500 mt-1">Click on a scenario to expand and view step details</p>
          </div>

          <div>
            {execution.scenarios.map((scenario, index) => (
              <ScenarioRow key={scenario.id || index} scenario={scenario} />
            ))}
          </div>
        </div>
      )}

      {/* No execution placeholder */}
      {!execution && !isRunning && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Execution Running</h3>
          <p className="text-gray-500">
            Select modules from the Module Selection tab and click "Start Tests" to begin
          </p>
        </div>
      )}
    </div>
  );
}
