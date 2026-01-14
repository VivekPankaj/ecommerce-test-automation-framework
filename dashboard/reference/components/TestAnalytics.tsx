import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Calendar,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  X,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { testAPI } from '../services/api';

export default function TestAnalytics() {
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed' | 'skipped'>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [slideOutOpen, setSlideOutOpen] = useState(false);
  const [slideOutFilter, setSlideOutFilter] = useState<'passed' | 'failed' | 'skipped' | null>(null);
  const [expandedScenarios, setExpandedScenarios] = useState<Set<string>>(new Set());

  // Fetch all test executions
  const { data: executions = [], isLoading } = useQuery({
    queryKey: ['test-executions'],
    queryFn: () => testAPI.getAllExecutions(),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch detailed execution data
  const { data: executionDetails } = useQuery({
    queryKey: ['execution-details', selectedExecution],
    queryFn: () => testAPI.getExecution(selectedExecution!),
    enabled: !!selectedExecution,
    refetchInterval: 3000,
  });

  // Calculate aggregate statistics
  const aggregateStats = React.useMemo(() => {
    const totalExecutions = executions.length;
    const totalTests = executions.reduce((sum, ex) => sum + ex.totalTests, 0);
    const totalPassed = executions.reduce((sum, ex) => sum + ex.passed, 0);
    const totalFailed = executions.reduce((sum, ex) => sum + ex.failed, 0);
    const totalSkipped = executions.reduce((sum, ex) => sum + ex.skipped, 0);
    const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0';
    
    return {
      totalExecutions,
      totalTests,
      totalPassed,
      totalFailed,
      totalSkipped,
      passRate,
    };
  }, [executions]);

  // Filter scenarios
  const filteredScenarios = React.useMemo(() => {
    if (!executionDetails?.scenarios) return [];
    
    return executionDetails.scenarios.filter(scenario => {
      const statusMatch = filterStatus === 'all' || scenario.status === filterStatus;
      const moduleMatch = filterModule === 'all' || scenario.module === filterModule;
      return statusMatch && moduleMatch;
    });
  }, [executionDetails, filterStatus, filterModule]);

  // Get unique modules from current execution
  const availableModules = React.useMemo(() => {
    if (!executionDetails?.scenarios) return [];
    return [...new Set(executionDetails.scenarios.map(s => s.module))];
  }, [executionDetails]);

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'skipped': return 'text-yellow-600 bg-yellow-50';
      case 'running': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const openSlideOut = (status: 'passed' | 'failed' | 'skipped') => {
    if (!executionDetails) return;
    setSlideOutFilter(status);
    setSlideOutOpen(true);
  };

  const closeSlideOut = () => {
    setSlideOutOpen(false);
    setSlideOutFilter(null);
  };

  // Get filtered scenarios for slide-out
  const slideOutScenarios = React.useMemo(() => {
    if (!executionDetails?.scenarios || !slideOutFilter) return [];
    return executionDetails.scenarios.filter(s => s.status === slideOutFilter);
  }, [executionDetails, slideOutFilter]);

  const downloadReport = () => {
    if (!executionDetails) return;
    
    const report = {
      execution: executionDetails,
      summary: {
        total: executionDetails.totalTests,
        passed: executionDetails.passed,
        failed: executionDetails.failed,
        skipped: executionDetails.skipped,
        passRate: ((executionDetails.passed / executionDetails.totalTests) * 100).toFixed(2) + '%',
      },
      scenarios: executionDetails.scenarios,
      generatedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${executionDetails.id}.json`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading test analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Aggregate Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900">{aggregateStats.totalExecutions}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{aggregateStats.totalTests}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => executionDetails && openSlideOut('passed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Passed</p>
              <p className="text-2xl font-bold text-green-600">{aggregateStats.totalPassed}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              {executionDetails && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => executionDetails && openSlideOut('failed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{aggregateStats.totalFailed}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <XCircle className="w-8 h-8 text-red-600" />
              {executionDetails && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => executionDetails && openSlideOut('skipped')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Skipped</p>
              <p className="text-2xl font-bold text-yellow-600">{aggregateStats.totalSkipped}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-8 h-8 text-yellow-600" />
              {executionDetails && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pass Rate</p>
              <p className="text-2xl font-bold text-blue-600">{aggregateStats.passRate}%</p>
            </div>
            {parseFloat(aggregateStats.passRate) >= 80 ? (
              <TrendingUp className="w-8 h-8 text-green-600" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Execution History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Test Execution History
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Execution ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modules
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pass Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {executions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No test executions found. Run some tests to see analytics.
                  </td>
                </tr>
              ) : (
                executions.map((execution) => {
                  const passRate = execution.totalTests > 0 
                    ? ((execution.passed / execution.totalTests) * 100).toFixed(0)
                    : '0';
                  
                  return (
                    <tr 
                      key={execution.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedExecution === execution.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedExecution(execution.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {execution.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {execution.modules.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(execution.startTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(execution.status)}`}>
                          {execution.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-3">
                          <span className="text-green-600">{execution.passed}✓</span>
                          <span className="text-red-600">{execution.failed}✗</span>
                          <span className="text-yellow-600">{execution.skipped}○</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                parseFloat(passRate) >= 80 ? 'bg-green-600' : 
                                parseFloat(passRate) >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${passRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{passRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExecution(execution.id);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Scenario Analysis */}
      {executionDetails && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Detailed Test Results - Execution {executionDetails.id.substring(0, 8)}
              </h2>
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>

            {/* Execution Status Banner */}
            <div className="mt-6 mb-4">
              {executionDetails.status === 'completed' && (
                <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-green-200 bg-green-50">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-green-900">Execution Completed Successfully</div>
                    <div className="text-sm text-green-700 mt-0.5">
                      All tests have finished running. Duration: {
                        executionDetails.endTime && executionDetails.startTime
                          ? ((new Date(executionDetails.endTime).getTime() - new Date(executionDetails.startTime).getTime()) / 1000).toFixed(2)
                          : 'N/A'
                      }s
                    </div>
                  </div>
                </div>
              )}
              {executionDetails.status === 'running' && (
                <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-blue-900">Execution In Progress</div>
                    <div className="text-sm text-blue-700 mt-0.5">
                      Tests are currently running. Please wait for completion...
                    </div>
                  </div>
                </div>
              )}
              {executionDetails.status === 'failed' && (
                <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-red-200 bg-red-50">
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-red-900">Execution Failed</div>
                    <div className="text-sm text-red-700 mt-0.5">
                      Test execution encountered an error and could not complete.
                    </div>
                  </div>
                </div>
              )}
              {executionDetails.status === 'pending' && (
                <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50">
                  <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-yellow-900">Execution Pending</div>
                    <div className="text-sm text-yellow-700 mt-0.5">
                      Waiting to start test execution...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="passed">Passed Only</option>
                  <option value="failed">Failed Only</option>
                  <option value="skipped">Skipped Only</option>
                </select>
              </div>

              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Modules</option>
                {availableModules.map((module) => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>

              <div className="ml-auto text-sm text-gray-600">
                Showing {filteredScenarios.length} of {executionDetails.scenarios.length} tests
              </div>
            </div>
          </div>

          {/* Test Scenarios Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Scenario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredScenarios.map((scenario, index) => {
                  const scenarioId = `${scenario.module}-${scenario.storyKey}-${index}`;
                  const isExpanded = expandedScenarios.has(scenarioId);
                  const hasSteps = scenario.steps && scenario.steps.length > 0;
                  
                  return (
                    <React.Fragment key={scenarioId}>
                      <tr 
                        className={`hover:bg-gray-50 ${hasSteps ? 'cursor-pointer' : ''}`}
                        onClick={() => {
                          if (hasSteps) {
                            const newExpanded = new Set(expandedScenarios);
                            if (isExpanded) {
                              newExpanded.delete(scenarioId);
                            } else {
                              newExpanded.add(scenarioId);
                            }
                            setExpandedScenarios(newExpanded);
                          }
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {hasSteps && (
                              isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )
                            )}
                            {scenario.status === 'passed' && (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            )}
                            {scenario.status === 'failed' && (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            {scenario.status === 'skipped' && (
                              <Clock className="w-5 h-5 text-yellow-600" />
                            )}
                            {scenario.status === 'running' && (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                            )}
                            {!scenario.status && (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{scenario.scenario || scenario.name || 'Unknown Scenario'}</div>
                          <div className="text-xs text-gray-500 mt-1">{scenario.storySummary || ''}</div>
                          {scenario.tags && scenario.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {scenario.tags.map((tag, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {scenario.error && (
                            <div className="mt-1 text-xs text-red-600 flex items-start gap-1">
                              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{scenario.error}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {scenario.module}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {scenario.storyKey || scenario.feature || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {scenario.duration !== null && scenario.duration !== undefined 
                            ? `${scenario.duration.toFixed(2)}s` 
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            {scenario.screenshot && (
                              <button
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                title="View Screenshot"
                              >
                                <ImageIcon className="w-4 h-4" />
                              </button>
                            )}
                            {scenario.error && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Error Details:\n\n${scenario.error}`);
                                }}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                title="View Error Details"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            )}
                            {scenario.status === 'passed' && !scenario.error && (
                              <span className="text-xs text-green-600 font-medium">✓ Test passed</span>
                            )}
                            {scenario.status === 'skipped' && (
                              <span className="text-xs text-yellow-600 font-medium">Skipped</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && hasSteps && (
                        <tr className="bg-gray-50">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="ml-8 space-y-2">
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">Test Steps:</h4>
                              {scenario.steps?.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-start gap-2 text-sm">
                                  <span className="font-semibold text-blue-600 min-w-[60px]">
                                    {step.keyword}
                                  </span>
                                  <span className="text-gray-700">{step.text}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Executive Summary */}
      {executionDetails && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Executive Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Execution Overview</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[140px]">Execution ID:</span>
                    <span className="font-mono text-sm">{executionDetails.id}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[140px]">Modules Tested:</span>
                    <span>{executionDetails.modules.join(', ')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[140px]">Start Time:</span>
                    <span>{formatDate(executionDetails.startTime)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[140px]">End Time:</span>
                    <span>{executionDetails.endTime ? formatDate(executionDetails.endTime) : 'In Progress'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[140px]">Total Duration:</span>
                    <span>
                      {executionDetails.endTime 
                        ? `${((new Date(executionDetails.endTime).getTime() - new Date(executionDetails.startTime).getTime()) / 1000).toFixed(2)}s`
                        : 'Running...'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Results Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">Passed Tests</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{executionDetails.passed}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="font-medium">Failed Tests</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">{executionDetails.failed}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="font-medium">Skipped Tests</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">{executionDetails.skipped}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
                    <span className="font-bold text-gray-900">Success Rate</span>
                    <span className="text-3xl font-bold text-blue-600">
                      {((executionDetails.passed / executionDetails.totalTests) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Most Tested Module</p>
                <p className="text-lg font-semibold text-gray-900">
                  {executionDetails.scenarios.reduce((acc, s) => {
                    acc[s.module] = (acc[s.module] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>) && 
                  Object.entries(executionDetails.scenarios.reduce((acc, s) => {
                    acc[s.module] = (acc[s.module] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Average Test Duration</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(executionDetails.scenarios.reduce((sum, s) => sum + (s.duration || 0), 0) / 
                    executionDetails.scenarios.length / 1000).toFixed(2)}s
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className={`text-lg font-semibold ${
                  executionDetails.status === 'completed' ? 'text-green-600' : 
                  executionDetails.status === 'failed' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {executionDetails.status.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {executionDetails.failed > 0 && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">Action Required</p>
                  <p className="text-sm text-red-800 mt-1">
                    {executionDetails.failed} test(s) failed. Click on the "Failed" card above to see detailed error messages 
                    and consider creating Jira defects for critical issues.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>💡 This report persists until a new test execution begins</p>
          </div>
        </div>
      )}

      {/* Slide-out Panel */}
      {slideOutOpen && slideOutFilter && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeSlideOut}
          />
          
          {/* Slide-out Panel */}
          <div className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col">
            {/* Header */}
            <div className={`p-6 ${
              slideOutFilter === 'passed' ? 'bg-green-50 border-b-4 border-green-500' :
              slideOutFilter === 'failed' ? 'bg-red-50 border-b-4 border-red-500' :
              'bg-yellow-50 border-b-4 border-yellow-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {slideOutFilter === 'passed' && <CheckCircle2 className="w-8 h-8 text-green-600" />}
                  {slideOutFilter === 'failed' && <XCircle className="w-8 h-8 text-red-600" />}
                  {slideOutFilter === 'skipped' && <Clock className="w-8 h-8 text-yellow-600" />}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                      {slideOutFilter} Tests
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {slideOutScenarios.length} test scenario(s)
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeSlideOut}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  title="Close"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {slideOutScenarios.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">No {slideOutFilter} tests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {slideOutScenarios.map((scenario, index) => (
                    <div 
                      key={scenario.id}
                      className="bg-gray-50 rounded-lg p-5 border-l-4 hover:shadow-md transition-shadow"
                      style={{
                        borderLeftColor: 
                          slideOutFilter === 'passed' ? '#10b981' :
                          slideOutFilter === 'failed' ? '#ef4444' : '#f59e0b'
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                            <h3 className="text-lg font-semibold text-gray-900">{scenario.name}</h3>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <span className="text-gray-600">Module: </span>
                              <span className="font-medium text-gray-900">{scenario.module}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Feature: </span>
                              <span className="font-medium text-gray-900">{scenario.feature}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Duration: </span>
                              <span className="font-medium text-gray-900">{formatDuration(scenario.duration)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Status: </span>
                              <span className={`font-semibold capitalize ${
                                scenario.status === 'passed' ? 'text-green-600' :
                                scenario.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                                {scenario.status}
                              </span>
                            </div>
                          </div>

                          {scenario.error && (
                            <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-red-900">Error Details:</p>
                                  <p className="text-sm text-red-800 mt-1 font-mono">{scenario.error}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {scenario.screenshot && (
                            <div className="mt-3">
                              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                                <ImageIcon className="w-4 h-4" />
                                View Screenshot
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {slideOutScenarios.length} of {executionDetails?.totalTests || 0} total tests
                </p>
                <button
                  onClick={closeSlideOut}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
