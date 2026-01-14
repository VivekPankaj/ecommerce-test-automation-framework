import React from 'react';
import { XCircle } from 'lucide-react';
import DefectLogger from './DefectLogger';

interface TestResultsProps {
  results: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    tests?: any[];
  };
  executionId: string;
}

const TestResults: React.FC<TestResultsProps> = ({ results, executionId: _executionId }) => {
  const [showDefectLogger, setShowDefectLogger] = React.useState(false);
  const [selectedFailure, setSelectedFailure] = React.useState<any>(null);

  const passRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0;

  const handleLogDefect = (test: any) => {
    setSelectedFailure(test);
    setShowDefectLogger(true);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Test Execution Summary</h3>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{results.total}</div>
            <div className="text-sm text-gray-600">Total Tests</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{results.passed}</div>
            <div className="text-sm text-gray-600">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{results.failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{results.skipped}</div>
            <div className="text-sm text-gray-600">Skipped</div>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-t">
          <div>
            <span className="text-sm text-gray-600">Pass Rate:</span>
            <span className="ml-2 text-lg font-semibold">{passRate}%</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Duration:</span>
            <span className="ml-2 text-lg font-semibold">{results.duration.toFixed(2)}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-green-500 h-4 float-left"
            style={{ width: `${(results.passed / results.total) * 100}%` }}
          />
          <div
            className="bg-red-500 h-4 float-left"
            style={{ width: `${(results.failed / results.total) * 100}%` }}
          />
          <div
            className="bg-yellow-500 h-4 float-left"
            style={{ width: `${(results.skipped / results.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Failed Tests */}
      {results.failed > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Failed Tests</h3>
          <div className="space-y-3">
            {results.tests
              ?.filter((test) => test.outcome === 'failed')
              .map((test, index) => (
                <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle size={18} className="text-red-600" />
                        <span className="font-medium text-sm">{test.nodeid}</span>
                      </div>
                      {test.call?.longrepr && (
                        <pre className="text-xs text-gray-700 mt-2 bg-white p-2 rounded overflow-x-auto">
                          {test.call.longrepr}
                        </pre>
                      )}
                    </div>
                    <button
                      onClick={() => handleLogDefect(test)}
                      className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Log Defect
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Defect Logger Modal */}
      {showDefectLogger && selectedFailure && (
        <DefectLogger
          testFailure={selectedFailure}
          onClose={() => {
            setShowDefectLogger(false);
            setSelectedFailure(null);
          }}
        />
      )}
    </div>
  );
};

export default TestResults;
