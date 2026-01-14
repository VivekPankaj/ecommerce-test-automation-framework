import { useState } from 'react';
import { Send, Bot, Sparkles, Loader, CheckCircle2 } from 'lucide-react';
import { aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import type { AICommand } from '../types';

export default function AICommandWindow() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<AICommand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) {
      toast.error('Please enter a command');
      return;
    }

    setIsProcessing(true);
    const newCommand: AICommand = {
      id: Date.now().toString(),
      command: command.trim(),
      timestamp: new Date().toISOString(),
      status: 'processing',
    };

    setHistory([newCommand, ...history]);
    setCommand('');

    try {
      const response = await aiAPI.sendCommand(newCommand.command);
      setHistory(prev => 
        prev.map(cmd => 
          cmd.id === newCommand.id
            ? { ...cmd, ...response, status: 'completed' as const }
            : cmd
        )
      );
      toast.success('AI command processed successfully');
    } catch (error) {
      setHistory(prev => 
        prev.map(cmd => 
          cmd.id === newCommand.id
            ? { ...cmd, status: 'error' as const, response: 'Failed to process command' }
            : cmd
        )
      );
      toast.error('Failed to process AI command');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exampleCommands = [
    'Generate test scenarios for Cart module',
    'Create tests for ECM-542 Badge Configuration story',
    'Run all PLP tests with zipcode 37303',
    'Find all failed scenarios from last execution',
    'Generate test data for checkout flow',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">AI Test Commander</h2>
            <p className="text-blue-100">
              Use natural language to generate tests, run scenarios, and analyze results
            </p>
          </div>
        </div>
      </div>

      {/* Command Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Your Command
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="e.g., Generate test scenarios for the Cart module..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !command.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isProcessing ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span>{isProcessing ? 'Processing...' : 'Send'}</span>
              </button>
            </div>
          </div>

          {/* Example Commands */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleCommands.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCommand(example)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  disabled={isProcessing}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Command History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Command History</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {history.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No commands yet. Start by entering a command above.</p>
            </div>
          ) : (
            history.map((cmd) => (
              <div key={cmd.id} className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {cmd.status === 'processing' && (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                      </div>
                    )}
                    {cmd.status === 'completed' && (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                    )}
                    {cmd.status === 'error' && (
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold">!</span>
                      </div>
                    )}
                  </div>

                  {/* Command Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{cmd.command}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(cmd.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {cmd.response && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {cmd.response}
                        </p>
                      </div>
                    )}

                    {cmd.generatedTests && cmd.generatedTests.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Generated Tests:
                        </p>
                        <ul className="space-y-1">
                          {cmd.generatedTests.map((test, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {test}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          cmd.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : cmd.status === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {cmd.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">AI Capabilities</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Generate test scenarios from Jira stories automatically
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Create BDD feature files and step definitions
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Run tests using natural language commands
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Analyze test results and suggest improvements
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Generate test data for specific scenarios
          </li>
        </ul>
      </div>
    </div>
  );
}
