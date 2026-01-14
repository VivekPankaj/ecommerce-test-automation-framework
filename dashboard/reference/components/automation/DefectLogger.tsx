import React, { useState } from 'react';
import { X } from 'lucide-react';
import { automationService } from '../../services/automationService';

interface DefectLoggerProps {
  testFailure: any;
  onClose: () => void;
}

const DefectLogger: React.FC<DefectLoggerProps> = ({ testFailure, onClose }) => {
  const [formData, setFormData] = useState({
    summary: `Test Failure: ${testFailure.nodeid}`,
    description: 'Automated test failed',
    priority: 'High',
    severity: 'High',
    component: '',
    environment: 'Automation',
    steps_to_reproduce: `1. Run automated test: ${testFailure.nodeid}\n2. Test executes and fails`,
    expected_result: 'Test should pass successfully',
    actual_result: testFailure.call?.longrepr || 'Test failed',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await automationService.createDefect(formData);
      setResult(response);
    } catch (error) {
      console.error('Failed to create defect:', error);
      alert('Failed to create defect');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result?.success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-lg w-full p-6">
          <div className="text-center">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h3 className="text-xl font-bold mb-2">Defect Created Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Defect Key: <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{result.defect_key}</a>
            </p>
            <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Log Defect in Jira</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Summary */}
            <div>
              <label className="block text-sm font-medium mb-2">Summary *</label>
              <input
                type="text"
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Priority & Severity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Blocker">Blocker</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Severity</label>
                <select
                  value={formData.severity}
                  onChange={(e) => handleChange('severity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Blocker">Blocker</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Component & Environment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Component</label>
                <input
                  type="text"
                  value={formData.component}
                  onChange={(e) => handleChange('component', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Cart, Checkout"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Environment</label>
                <select
                  value={formData.environment}
                  onChange={(e) => handleChange('environment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Automation">Automation</option>
                  <option value="QA">QA</option>
                  <option value="Staging">Staging</option>
                  <option value="Production">Production</option>
                </select>
              </div>
            </div>

            {/* Steps to Reproduce */}
            <div>
              <label className="block text-sm font-medium mb-2">Steps to Reproduce</label>
              <textarea
                value={formData.steps_to_reproduce}
                onChange={(e) => handleChange('steps_to_reproduce', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>

            {/* Expected Result */}
            <div>
              <label className="block text-sm font-medium mb-2">Expected Result</label>
              <textarea
                value={formData.expected_result}
                onChange={(e) => handleChange('expected_result', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Actual Result */}
            <div>
              <label className="block text-sm font-medium mb-2">Actual Result</label>
              <textarea
                value={formData.actual_result}
                onChange={(e) => handleChange('actual_result', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Defect...' : 'Create Defect in Jira'}
            </button>
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefectLogger;
