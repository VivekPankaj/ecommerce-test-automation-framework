import React, { useState } from 'react';
import { Wand2, Play, FileCode } from 'lucide-react';
import { automationService } from '../../services/automationService';

const AITestCommander: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<any>(null);

  const examples = [
    'Test the login flow with valid and invalid credentials',
    'Test adding 3 different products to cart and completing checkout',
    'Test search functionality with various product names',
    'Test user registration with email validation',
    'Test product filtering and sorting on PLP',
  ];

  const handleGenerateTest = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    try {
      const result = await automationService.generateTestFromPrompt(prompt);
      setGeneratedTest(result);
    } catch (error) {
      console.error('Failed to generate test:', error);
      alert('Failed to generate test');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteGeneratedTest = async () => {
    if (!generatedTest) return;
    alert('Test execution from AI-generated code is coming soon!');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wand2 className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold">AI Test Commander</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Describe what you want to test in natural language, and AI will generate executable test code.
        </p>

        {/* Prompt Input */}
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Test the complete checkout flow with a new user, including registration, adding products, and payment"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerateTest}
            disabled={isProcessing || !prompt.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <FileCode size={16} />
            {isProcessing ? 'Generating...' : 'Generate Test Code'}
          </button>
        </div>

        {/* Examples */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Example prompts:</p>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Test */}
      {generatedTest && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Generated Test</h3>
            <button 
              onClick={handleExecuteGeneratedTest}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Play size={16} />
              Execute Test
            </button>
          </div>

          {/* Gherkin Feature */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Feature File (Gherkin)</h4>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {generatedTest.gherkin}
            </pre>
          </div>

          {/* Step Definitions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Step Definitions (Python)</h4>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {generatedTest.step_definitions}
            </pre>
          </div>

          <div className="mt-4 flex gap-3">
            <button className="px-3 py-1 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
              Download Feature File
            </button>
            <button className="px-3 py-1 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
              Download Step Definitions
            </button>
            <button className="px-3 py-1 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITestCommander;
