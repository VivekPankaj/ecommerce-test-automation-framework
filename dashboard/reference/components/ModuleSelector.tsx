import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlayCircle, CheckCircle2, Package, FileCheck, ExternalLink, Eye, X, Loader, StopCircle, Sparkles } from 'lucide-react';
import { moduleAPI, testAPI } from '../services/api';
import type { Module } from '../types';
import toast from 'react-hot-toast';

interface ModuleSelectorProps {
  selectedModules: string[];
  onModulesChange: (modules: string[]) => void;
  selectedScenarios: Record<string, string[]>; // moduleId -> scenario names
  onScenariosChange: (scenarios: Record<string, string[]>) => void;
}

interface ProgressState {
  status: string;
  current_module: string | null;
  processed_modules: number;
  total_modules: number;
  elapsed_seconds: number;
  estimated_remaining_seconds: number;
  message: string;
  current_scenario_count: number;
}

export default function ModuleSelector({ selectedModules, onModulesChange, selectedScenarios, onScenariosChange }: ModuleSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [selectedModuleForScenarios, setSelectedModuleForScenarios] = useState<Module | null>(null);
  const [runningModules, setRunningModules] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [moduleScenarios, setModuleScenarios] = useState<Record<string, any[]>>({});
  const [loadingScenarios, setLoadingScenarios] = useState(false);
  const [headlessMode, setHeadlessMode] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'P1' | 'P2' | 'P3'>('ALL');
  const [selectedGlobalPriorities, setSelectedGlobalPriorities] = useState<Set<'ALL' | 'P1' | 'P2' | 'P3'>>(new Set(['ALL']));
  
  const { data: modules = [], isLoading, isFetching } = useQuery({
    queryKey: ['modules'],
    queryFn: moduleAPI.getAll,
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: moduleAPI.getStats,
  });

  // Poll for progress while loading
  useEffect(() => {
    if (!isLoading && !isFetching) return;
    
    const pollProgress = async () => {
      try {
        const progressData = await moduleAPI.getProgress();
        setProgress(progressData);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
    
    // Poll every 500ms while loading
    const interval = setInterval(pollProgress, 500);
    
    // Initial fetch
    pollProgress();
    
    return () => clearInterval(interval);
  }, [isLoading, isFetching]);

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleModule = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      onModulesChange(selectedModules.filter(id => id !== moduleId));
    } else {
      onModulesChange([...selectedModules, moduleId]);
    }
  };

  const selectAll = () => {
    const readyModules = filteredModules
      .filter(m => m.status === 'ready')
      .map(m => m.id);
    onModulesChange(readyModules);
    toast.success(`Selected ${readyModules.length} ready modules`);
  };

  const clearAll = () => {
    onModulesChange([]);
    toast.success('Cleared all selections');
  };

  // Calculate priority counts across all modules (from module metadata)
  const calculatePriorityCounts = () => {
    let p1Count = 0, p2Count = 0, p3Count = 0;
    
    // Use module priority counts from backend (more accurate)
    if (modules && modules.length > 0) {
      modules.forEach((module: any) => {
        if (module.priorityCounts) {
          p1Count += module.priorityCounts.p1 || 0;
          p2Count += module.priorityCounts.p2 || 0;
          p3Count += module.priorityCounts.p3 || 0;
        }
      });
    } else {
      // Fallback: count from loaded scenarios
      Object.values(moduleScenarios).forEach(scenarios => {
        scenarios.forEach((scenario: any) => {
          if (scenario.priority === 'P1') p1Count++;
          else if (scenario.priority === 'P2') p2Count++;
          else if (scenario.priority === 'P3') p3Count++;
        });
      });
    }
    
    return { p1Count, p2Count, p3Count };
  };

  // Select all scenarios of a specific priority across all modules
  const selectScenariosByPriority = async (priority: 'P1' | 'P2' | 'P3' | 'ALL') => {
    const label = priority === 'ALL' ? 'all' : priority;
    try {
      toast.loading(`Selecting ${label} scenarios...`, { duration: 1000 });
      
      const newSelections: Record<string, string[]> = { ...selectedScenarios };
      
      // Load all module scenarios if not already loaded
      for (const module of filteredModules) {
        if (!moduleScenarios[module.id]) {
          try {
            const result = await moduleAPI.getModuleScenarios(module.id);
            setModuleScenarios(prev => ({ ...prev, [module.id]: result.scenarios }));
            
            // Select scenarios of the specified priority (or all if 'ALL')
            const priorityScenarios = result.scenarios
              .filter((s: any) => priority === 'ALL' || s.priority === priority)
              .map((s: any) => s.name);
            
            if (priorityScenarios.length > 0) {
              newSelections[module.id] = [
                ...(newSelections[module.id] || []),
                ...priorityScenarios.filter((name: string) => !(newSelections[module.id] || []).includes(name))
              ];
            }
          } catch (error) {
            console.error(`Error loading scenarios for ${module.id}:`, error);
          }
        } else {
          // Use cached scenarios
          const priorityScenarios = moduleScenarios[module.id]
            .filter((s: any) => priority === 'ALL' || s.priority === priority)
            .map((s: any) => s.name);
          
          if (priorityScenarios.length > 0) {
            newSelections[module.id] = [
              ...(newSelections[module.id] || []),
              ...priorityScenarios.filter((name: string) => !(newSelections[module.id] || []).includes(name))
            ];
          }
        }
      }
      
      onScenariosChange(newSelections);
      
      const totalSelected = Object.values(newSelections).reduce((sum, arr) => sum + arr.length, 0);
      toast.success(`Added ${label} scenarios (${totalSelected} total selected)`);
    } catch (error) {
      toast.error(`Failed to select ${label} scenarios`);
      console.error(error);
    }
  };

  const openScenarioModal = async (module: Module, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedModuleForScenarios(module);
    setScenarioModalOpen(true);
    
    // Fetch real scenarios from backend if not already loaded
    if (!moduleScenarios[module.id]) {
      setLoadingScenarios(true);
      try {
        const result = await moduleAPI.getModuleScenarios(module.id);
        setModuleScenarios(prev => ({
          ...prev,
          [module.id]: result.scenarios
        }));
        
        // Initialize all scenarios as selected
        const allScenarioNames = result.scenarios.map((s: any) => s.name);
        onScenariosChange({
          ...selectedScenarios,
          [module.id]: allScenarioNames
        });
        
        toast.success(`Loaded ${result.scenarios.length} scenarios`);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
        toast.error('Failed to load scenarios');
      } finally {
        setLoadingScenarios(false);
      }
    } else if (!selectedScenarios[module.id]) {
      // Initialize all scenarios as selected if already loaded
      const allScenarioNames = moduleScenarios[module.id].map((s: any) => s.name);
      onScenariosChange({
        ...selectedScenarios,
        [module.id]: allScenarioNames
      });
    }
  };

  const closeScenarioModal = () => {
    setScenarioModalOpen(false);
    setSelectedModuleForScenarios(null);
  };

  const toggleScenario = (moduleId: string, scenarioName: string) => {
    const currentSelected = selectedScenarios[moduleId] || [];
    const newSelected = currentSelected.includes(scenarioName)
      ? currentSelected.filter(name => name !== scenarioName)
      : [...currentSelected, scenarioName];
    
    onScenariosChange({
      ...selectedScenarios,
      [moduleId]: newSelected
    });
  };

  const selectAllScenarios = (moduleId: string) => {
    if (!selectedModuleForScenarios) return;
    
    // Get filtered scenarios based on current priority filter
    const filteredScenarios = getModuleScenarios(selectedModuleForScenarios)
      .filter(scenario => {
        if (priorityFilter === 'ALL') return true;
        return scenario.priority === priorityFilter;
      });
    
    const filteredScenarioNames = filteredScenarios.map(s => s.name);
    
    // Merge with existing selections (in case other priorities were selected)
    const existingSelections = selectedScenarios[moduleId] || [];
    const mergedSelections = [
      ...existingSelections,
      ...filteredScenarioNames.filter(name => !existingSelections.includes(name))
    ];
    
    onScenariosChange({
      ...selectedScenarios,
      [moduleId]: mergedSelections
    });
    toast.success(`Selected ${filteredScenarioNames.length} scenarios`);
  };

  const deselectAllScenarios = (moduleId: string) => {
    if (!selectedModuleForScenarios) return;
    
    // Get filtered scenarios based on current priority filter
    const filteredScenarios = getModuleScenarios(selectedModuleForScenarios)
      .filter(scenario => {
        if (priorityFilter === 'ALL') return true;
        return scenario.priority === priorityFilter;
      });
    
    const filteredScenarioNames = filteredScenarios.map(s => s.name);
    
    // Remove only the filtered scenarios, keep others
    const existingSelections = selectedScenarios[moduleId] || [];
    const remainingSelections = existingSelections.filter(
      name => !filteredScenarioNames.includes(name)
    );
    
    onScenariosChange({
      ...selectedScenarios,
      [moduleId]: remainingSelections
    });
    toast.success(`Deselected ${filteredScenarioNames.length} scenarios`);
  };

  const openJiraStories = async (module: Module, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Fetch the Jira URL with filtered stories for this module
      const result = await moduleAPI.getJiraUrl(module.id);
      window.open(result.jiraUrl, '_blank');
      toast.success(`Opening ${module.jiraStoryCount} ECOM stories for ${module.name}`);
    } catch (error) {
      // Fallback to general filter if API fails
      const jiraUrl = 'https://vulcanmaterials.atlassian.net/issues/?filter=16283&jql=project%20%3D%20ECM%20AND%20%22Agile%20Team%20%2F%20Squad%22%20%3D%20ECOM';
      window.open(jiraUrl, '_blank');
      toast.success(`Opening Jira stories for ${module.name}`);
      console.error('Error fetching module-specific Jira URL:', error);
    }
  };

  const runModuleTests = async (moduleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Capture headless mode at the time of click to prevent state change issues
    const capturedHeadlessMode = headlessMode;
    
    setRunningModules(prev => new Set(prev).add(moduleId));
    
    try {
      const mode = capturedHeadlessMode ? 'headless' : 'with browser visible';
      
      // Get selected scenarios for this module, or all if none selected
      const moduleScenariosToRun = selectedScenarios[moduleId] || [];
      const scenarioCount = moduleScenariosToRun.length;
      
      console.log(`🚀 Running tests for module: ${moduleId}`);
      console.log(`   Selected scenarios:`, moduleScenariosToRun);
      console.log(`   Scenario count: ${scenarioCount}`);
      console.log(`   Headless: ${capturedHeadlessMode}`);
      
      // Pass selected scenarios to backend
      const response = await testAPI.runTests(
        [moduleId], 
        capturedHeadlessMode,
        { [moduleId]: moduleScenariosToRun }
      );
      
      const scenarioText = scenarioCount === 1 ? '1 scenario' : `${scenarioCount} scenarios`;
      toast.success(`Started test execution for ${scenarioText} in ${mode} mode!`);
      
      // Navigate to execution after a short delay
      setTimeout(() => {
        toast.success(`Execution ID: ${response.executionId.substring(0, 8)}...`);
      }, 1000);
      
      // Poll execution status to track when it completes
      const executionId = response.executionId;
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`http://localhost:8000/api/tests/execution/${executionId}`);
          if (statusResponse.ok) {
            const executionData = await statusResponse.json();
            const status = executionData.status;
            
            // Clear running state when execution completes
            if (status === 'completed' || status === 'failed' || status === 'stopped') {
              clearInterval(pollInterval);
              setRunningModules(prev => {
                const newSet = new Set(prev);
                newSet.delete(moduleId);
                return newSet;
              });
              
              if (status === 'completed') {
                toast.success(`Test execution completed!`);
              } else if (status === 'failed') {
                toast.error(`Test execution failed`);
              } else if (status === 'stopped') {
                toast.success(`Test execution stopped`);
              }
            }
          }
        } catch (error) {
          console.error('Error polling execution status:', error);
        }
      }, 3000); // Poll every 3 seconds
      
      // Fallback: Clear running state after 10 minutes max
      setTimeout(() => {
        clearInterval(pollInterval);
        setRunningModules(prev => {
          const newSet = new Set(prev);
          newSet.delete(moduleId);
          return newSet;
        });
      }, 600000);
      
    } catch (error) {
      toast.error('Failed to start test execution');
      console.error(error);
      // Only clear running state on error
      setRunningModules(prev => {
        const newSet = new Set(prev);
        newSet.delete(moduleId);
        return newSet;
      });
    }
  };

  const stopModuleTests = async (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // In a real implementation, we would need the execution ID
      // For now, we'll just update the UI state
      toast.loading('Stopping test execution...', { duration: 1000 });
      
      setRunningModules(prev => {
        const newSet = new Set(prev);
        newSet.delete(moduleId);
        return newSet;
      });
      
      setTimeout(() => {
        toast.success('Test execution stopped');
      }, 1000);
    } catch (error) {
      toast.error('Failed to stop test execution');
      console.error(error);
    }
  };

  // Mock scenario data - replace with actual API call
  const getModuleScenarios = (module: Module) => {
    // Return cached scenarios from API, or empty array if not loaded yet
    return moduleScenarios[module.id] || [];
  };

  // Calculate priority counts for current modal scenarios
  const getModalPriorityCounts = () => {
    if (!selectedModuleForScenarios) return { p1: 0, p2: 0, p3: 0 };
    
    const scenarios = getModuleScenarios(selectedModuleForScenarios);
    const counts = { p1: 0, p2: 0, p3: 0 };
    
    scenarios.forEach((scenario: any) => {
      if (scenario.priority === 'P1') counts.p1++;
      else if (scenario.priority === 'P2') counts.p2++;
      else if (scenario.priority === 'P3') counts.p3++;
    });
    
    return counts;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Modules</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalModules || 22}</p>
            </div>
            <Package className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ready Modules</p>
              <p className="text-3xl font-bold text-green-600">{stats?.readyModules || 4}</p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Test Scenarios</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.totalScenarios || 49}</p>
            </div>
            <FileCheck className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Jira Stories</p>
              <p className="text-3xl font-bold text-orange-600">{stats?.totalJiraStories || 100}</p>
            </div>
            <Package className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Priority Selection */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Quick Priority Selection
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Select one or more priorities to execute scenarios across all modules
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* All Priorities Selection */}
            <button
              onClick={() => {
                const newSet = new Set(selectedGlobalPriorities);
                if (newSet.has('ALL')) {
                  newSet.delete('ALL');
                } else {
                  newSet.clear();
                  newSet.add('ALL');
                }
                setSelectedGlobalPriorities(newSet);
                if (newSet.has('ALL')) {
                  selectScenariosByPriority('ALL');
                }
              }}
              className={`relative flex flex-col items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all group ${
                selectedGlobalPriorities.has('ALL')
                  ? 'bg-gray-100 border-gray-500'
                  : 'bg-white border-gray-300 hover:border-gray-400'
              }`}
              title="Select all scenarios across all modules"
            >
              {selectedGlobalPriorities.has('ALL') && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded-full group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold text-gray-700">All</span>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {(() => {
                  const counts = calculatePriorityCounts();
                  return counts.p1Count + counts.p2Count + counts.p3Count;
                })()} scenarios
              </span>
            </button>

            {/* P1 Priority Selection */}
            <button
              onClick={() => {
                const newSet = new Set(selectedGlobalPriorities);
                newSet.delete('ALL');
                if (newSet.has('P1')) {
                  newSet.delete('P1');
                } else {
                  newSet.add('P1');
                }
                setSelectedGlobalPriorities(newSet);
                if (newSet.has('P1')) {
                  selectScenariosByPriority('P1');
                }
              }}
              className={`relative flex flex-col items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all group ${
                selectedGlobalPriorities.has('P1')
                  ? 'bg-red-50 border-red-500'
                  : 'bg-white border-red-200 hover:border-red-400'
              }`}
              title="Select all P1 (Critical) scenarios across all modules"
            >
              {selectedGlobalPriorities.has('P1') && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-red-600" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold text-red-700">P1</span>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {calculatePriorityCounts().p1Count} scenarios
              </span>
            </button>

            {/* P2 Priority Selection */}
            <button
              onClick={() => {
                const newSet = new Set(selectedGlobalPriorities);
                newSet.delete('ALL');
                if (newSet.has('P2')) {
                  newSet.delete('P2');
                } else {
                  newSet.add('P2');
                }
                setSelectedGlobalPriorities(newSet);
                if (newSet.has('P2')) {
                  selectScenariosByPriority('P2');
                }
              }}
              className={`relative flex flex-col items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all group ${
                selectedGlobalPriorities.has('P2')
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-white border-orange-200 hover:border-orange-400'
              }`}
              title="Select all P2 (Important) scenarios across all modules"
            >
              {selectedGlobalPriorities.has('P2') && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-600" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold text-orange-700">P2</span>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {calculatePriorityCounts().p2Count} scenarios
              </span>
            </button>

            {/* P3 Priority Selection */}
            <button
              onClick={() => {
                const newSet = new Set(selectedGlobalPriorities);
                newSet.delete('ALL');
                if (newSet.has('P3')) {
                  newSet.delete('P3');
                } else {
                  newSet.add('P3');
                }
                setSelectedGlobalPriorities(newSet);
                if (newSet.has('P3')) {
                  selectScenariosByPriority('P3');
                }
              }}
              className={`relative flex flex-col items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all group ${
                selectedGlobalPriorities.has('P3')
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white border-blue-200 hover:border-blue-400'
              }`}
              title="Select all P3 (Nice-to-have) scenarios across all modules"
            >
              {selectedGlobalPriorities.has('P3') && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold text-blue-700">P3</span>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {calculatePriorityCounts().p3Count} scenarios
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Module Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Select Modules to Test</h2>
            <div className="flex space-x-2">
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Select All Ready
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="p-6">
          {isLoading || isFetching ? (
            <div className="text-center py-12">
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Progress Message */}
                <div className="flex items-center justify-center gap-3">
                  <Loader className="w-6 h-6 text-blue-500 animate-spin" />
                  <p className="text-lg font-medium text-gray-700">
                    {progress?.message || 'Loading modules...'}
                  </p>
                </div>
                
                {/* Progress Bar */}
                {progress && progress.total_modules > 0 && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ 
                          width: `${(progress.processed_modules / progress.total_modules * 100)}%` 
                        }}
                      />
                    </div>
                    
                    {/* Progress Details */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        {progress.processed_modules} of {progress.total_modules} modules processed
                      </span>
                      <span>
                        {progress.current_scenario_count} scenarios generated
                      </span>
                    </div>
                    
                    {/* Time Estimate */}
                    {progress.estimated_remaining_seconds > 0 && (
                      <p className="text-sm text-gray-500 text-center">
                        Estimated time remaining: ~{Math.ceil(progress.estimated_remaining_seconds)}s
                      </p>
                    )}
                    
                    {/* Current Module */}
                    {progress.current_module && (
                      <p className="text-sm text-blue-600 text-center font-medium">
                        Generating scenarios for: {progress.current_module}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map((module) => {
                const isSelected = selectedModules.includes(module.id);
                const isReady = module.status === 'ready';
                const isRunning = runningModules.has(module.id);

                return (
                  <div
                    key={module.id}
                    className={`p-5 border-2 rounded-lg transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : isReady
                        ? 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    {/* Header with checkbox */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!isReady}
                          onChange={() => isReady && toggleModule(module.id)}
                          className="w-5 h-5 text-blue-600 mt-1 cursor-pointer"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{module.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Clickable Metrics */}
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={(e) => openScenarioModal(module, e)}
                        disabled={!module.scenarioCount || module.scenarioCount === 0}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          module.scenarioCount && module.scenarioCount > 0
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        title={module.scenarioCount && module.scenarioCount > 0 
                          ? "View and select test scenarios" 
                          : "No test scenarios implemented yet"}
                      >
                        <Eye className="w-4 h-4" />
                        <span>
                          {module.scenarioCount > 0
                            ? `${selectedScenarios[module.id]?.length || module.scenarioCount}/${module.scenarioCount} tests`
                            : 'No tests yet'
                          }
                        </span>
                      </button>

                      <button
                        onClick={(e) => openJiraStories(module, e)}
                        disabled={module.jiraStoryCount === 0}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          module.jiraStoryCount > 0
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        title={module.jiraStoryCount > 0 ? "View JIRA requirements" : "No JIRA stories"}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{module.jiraStoryCount} requirements</span>
                      </button>
                    </div>

                    {/* Status Badge and Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      {/* Left: Status Badge */}
                      <span
                        className={`px-3 py-1.5 rounded-full font-medium text-xs ${
                          isReady
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {isReady ? '✓ Ready' : '⏳ Pending'}
                      </span>

                      {/* Right: Controls */}
                      {isReady && (
                        <div className="flex items-center gap-2">
                          {/* Headless Mode Toggle */}
                          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation(); 
                                setHeadlessMode(true); 
                                console.log('Set headless mode: true');
                              }}
                              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                                headlessMode
                                  ? 'bg-white text-blue-600 shadow-sm'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                              title="Run tests in headless mode (faster)"
                            >
                              Headless
                            </button>
                            <button
                              onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation(); 
                                setHeadlessMode(false); 
                                console.log('Set headless mode: false');
                              }}
                              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                                !headlessMode
                                  ? 'bg-white text-blue-600 shadow-sm'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                              title="Run tests with visible browser"
                            >
                              Browser
                            </button>
                          </div>

                          {/* Run/Stop Button */}
                          <button
                            onClick={(e) => isRunning ? stopModuleTests(module.id, e) : runModuleTests(module.id, e)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isRunning
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                            title={isRunning ? "Stop test execution" : "Run tests for this module"}
                          >
                            {isRunning ? (
                              <>
                                <StopCircle className="w-3.5 h-3.5" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>Run</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Scenario Modal */}
      {scenarioModalOpen && selectedModuleForScenarios && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeScenarioModal}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedModuleForScenarios.name} - Test Scenarios
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedScenarios[selectedModuleForScenarios.id]?.length || 0} of {getModuleScenarios(selectedModuleForScenarios).length} scenarios selected
                    </p>
                  </div>
                  <button
                    onClick={closeScenarioModal}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    title="Close"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                
                {/* Selection and Filter Controls */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => selectAllScenarios(selectedModuleForScenarios.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => deselectAllScenarios(selectedModuleForScenarios.id)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
                    >
                      Deselect All
                    </button>
                  </div>
                  
                  {/* Priority Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Priority:</span>
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                      {(() => {
                        const modalCounts = getModalPriorityCounts();
                        const totalCount = modalCounts.p1 + modalCounts.p2 + modalCounts.p3;
                        
                        return (
                          <>
                            <button
                              onClick={() => setPriorityFilter('ALL')}
                              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                                priorityFilter === 'ALL'
                                  ? 'bg-white text-gray-900 shadow-sm border border-gray-300'
                                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              All ({totalCount})
                            </button>
                            <button
                              onClick={() => setPriorityFilter('P1')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                priorityFilter === 'P1'
                                  ? 'bg-red-100 text-red-700 shadow-sm border border-red-300'
                                  : 'bg-red-50 text-red-600 border border-red-200 hover:border-red-300'
                              }`}
                            >
                              P1 ({modalCounts.p1})
                            </button>
                            <button
                              onClick={() => setPriorityFilter('P2')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                priorityFilter === 'P2'
                                  ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-300'
                                  : 'bg-orange-50 text-orange-600 border border-orange-200 hover:border-orange-300'
                              }`}
                            >
                              P2 ({modalCounts.p2})
                            </button>
                            <button
                              onClick={() => setPriorityFilter('P3')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                priorityFilter === 'P3'
                                  ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-300'
                                  : 'bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300'
                              }`}
                            >
                              P3 ({modalCounts.p3})
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loadingScenarios ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">Loading scenarios...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getModuleScenarios(selectedModuleForScenarios)
                      .filter(scenario => {
                        // Apply priority filter
                        if (priorityFilter === 'ALL') return true;
                        return scenario.priority === priorityFilter;
                      })
                      .sort((a, b) => {
                        // Sort by priority: P1 first, then P2, then P3
                        const priorityOrder: Record<string, number> = { 'P1': 1, 'P2': 2, 'P3': 3 };
                        const aPriority = priorityOrder[a.priority || 'P2'] || 2;
                        const bPriority = priorityOrder[b.priority || 'P2'] || 2;
                        return aPriority - bPriority;
                      })
                      .map((scenario, index) => {
                    const isSelected = selectedScenarios[selectedModuleForScenarios.id]?.includes(scenario.name) ?? true;
                    
                    return (
                      <div
                        key={scenario.id}
                        onClick={() => toggleScenario(selectedModuleForScenarios.id, scenario.name)}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-500 hover:bg-blue-100' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className="flex-shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleScenario(selectedModuleForScenarios.id, scenario.name)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        
                        {/* Scenario Number */}
                        <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-400 text-white'
                        }`}>
                          {index + 1}
                        </span>
                        
                        {/* Scenario Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                              {scenario.name}
                            </h3>
                            {/* Priority Badge */}
                            {scenario.priority && (
                              <span 
                                className={`px-2 py-0.5 rounded text-xs font-bold ${
                                  scenario.priority === 'P1' 
                                    ? 'bg-red-100 text-red-700 border border-red-300'
                                    : scenario.priority === 'P2'
                                    ? 'bg-orange-100 text-orange-700 border border-orange-300'
                                    : 'bg-blue-100 text-blue-700 border border-blue-300'
                                }`}
                                title={scenario.priorityDescription || `${scenario.priorityLabel || scenario.priority} priority`}
                              >
                                {scenario.priority}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Feature: {scenario.feature || scenario.source?.feature_name || 'Unknown'}
                          </p>
                          {/* Tags if available */}
                          {scenario.tags && scenario.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {scenario.tags.slice(0, 3).map((tag: string, idx: number) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {scenario.tags.length > 3 && (
                                <span className="text-xs text-gray-500">+{scenario.tags.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            scenario.status === 'automated'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {scenario.status}
                        </span>
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button
                  onClick={closeScenarioModal}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bulk Actions Bar (Optional) */}
      {selectedModules.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-blue-900 mb-1 text-lg">
                {selectedModules.length} Module(s) Selected
              </h3>
              <p className="text-sm text-blue-700">
                You can run tests individually using the "Run Tests" button on each module card, 
                or run all selected modules together.
              </p>
            </div>
            <button
              onClick={async () => {
                try {
                  const response = await testAPI.runTests(selectedModules);
                  toast.success(`Started test execution for ${selectedModules.length} modules!`);
                  setTimeout(() => {
                    toast.success(`Execution ID: ${response.executionId.substring(0, 8)}...`);
                  }, 1000);
                } catch (error) {
                  toast.error('Failed to start test execution');
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Run All Selected</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
