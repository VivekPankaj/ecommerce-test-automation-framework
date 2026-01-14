import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ModuleSelector from './components/ModuleSelector';
import TestExecutionPanel from './components/TestExecutionPanel';
import AICommandWindow from './components/AICommandWindow';
import DefectLogger from './components/DefectLogger';
import TestAnalytics from './components/TestAnalytics';
import './App.css';
// import useEnsureServers from './hooks/useEnsureServers';
// import ServiceStatusBanner from './components/ServiceStatusBanner';

function App() {
  const [activeTab, setActiveTab] = useState<'modules' | 'ai' | 'defects' | 'execution' | 'analytics'>('modules');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<Record<string, string[]>>({});
  // const { loading, result, error, retry, waitingForRecovery, recoveryElapsedMs } = useEnsureServers();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Service status check banner (appears when services are unhealthy or checking) */}
        {/* <ServiceStatusBanner
          loading={loading}
          result={result}
          error={error}
          retry={retry}
          waitingForRecovery={waitingForRecovery}
          recoveryElapsedMs={recoveryElapsedMs}
        /> */}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'modules' && (
            <ModuleSelector
              selectedModules={selectedModules}
              onModulesChange={setSelectedModules}
              selectedScenarios={selectedScenarios}
              onScenariosChange={setSelectedScenarios}
            />
          )}

          {activeTab === 'execution' && (
            <TestExecutionPanel 
              selectedModules={selectedModules}
              selectedScenarios={selectedScenarios}
            />
          )}

          {activeTab === 'ai' && (
            <AICommandWindow />
          )}

          {activeTab === 'defects' && (
            <DefectLogger />
          )}

          {activeTab === 'analytics' && (
            <TestAnalytics />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
