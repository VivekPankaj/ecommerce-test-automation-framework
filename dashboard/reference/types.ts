// Type definitions for Vulcan Materials Automation Framework

export interface Module {
  id: string;
  name: string;
  description: string;
  scenarioCount: number;
  jiraStoryCount: number;
  featureFileScenarioCount?: number; // Scenarios from .feature files
  priorityCounts?: {
    p1: number;
    p2: number;
    p3: number;
  };
  status: 'ready' | 'pending' | 'in-progress';
  icon: string;
}

export interface TestScenario {
  id?: string; // Optional for backward compatibility
  name?: string; // Optional for backward compatibility
  module: string;
  scenario?: string; // The actual test scenario name from backend
  storyKey?: string; // JIRA story key (ECM-XXX)
  storySummary?: string; // JIRA story summary
  feature?: string; // Optional for backward compatibility
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string | null;
  screenshot?: string;
  testId?: string; // Pytest node ID
  steps?: Array<{
    keyword: string; // Given, When, Then, And, But
    text: string;
  }>;
  tags?: string[];
}

export interface TestExecution {
  id: string;
  modules: string[];
  startTime: string;
  endTime?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'stopped';
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  scenarios: TestScenario[];
}

export interface AICommand {
  id: string;
  command: string;
  timestamp: string;
  response?: string;
  generatedTests?: string[];
  status: 'processing' | 'completed' | 'error';
}

export interface JiraDefect {
  id?: string;
  key?: string;
  summary: string;
  description: string;
  scenario: string;
  module: string;
  priority: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
  status?: string;
  screenshot?: string;
  logs?: string;
  assignee?: string;
}

export interface TestStats {
  totalModules: number;
  totalScenarios: number;
  totalJiraStories: number;
  readyModules: number;
  pendingModules: number;
  lastExecutionTime?: string;
  passRate?: number;
}

export interface WebSocketMessage {
  type: 'test_start' | 'test_progress' | 'test_complete' | 'test_error';
  data: any;
}
