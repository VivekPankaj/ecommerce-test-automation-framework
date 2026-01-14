import { useState } from 'react';
import { AlertCircle, Upload, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import { defectAPI } from '../services/api';
import toast from 'react-hot-toast';
import type { JiraDefect } from '../types';

export default function DefectLogger() {
  const [defects, setDefects] = useState<JiraDefect[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<JiraDefect>>({
    summary: '',
    description: '',
    scenario: '',
    module: '',
    priority: 'Medium',
    screenshot: '',
    logs: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.summary || !formData.description || !formData.module) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const defect = await defectAPI.createDefect(formData as JiraDefect);
      setDefects([defect, ...defects]);
      toast.success(`Defect ${defect.key} created successfully!`);
      setShowForm(false);
      setFormData({
        summary: '',
        description: '',
        scenario: '',
        module: '',
        priority: 'Medium',
        screenshot: '',
        logs: '',
      });
    } catch (error) {
      toast.error('Failed to create defect');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { url } = await defectAPI.uploadScreenshot(file);
        setFormData({ ...formData, screenshot: url });
        toast.success('Screenshot uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload screenshot');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Defect Logger</h2>
            <p className="text-gray-600">
              Create Jira defects for failed test scenarios automatically
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <AlertCircle className="w-5 h-5" />
            <span>Create Defect</span>
          </button>
        </div>
      </div>

      {/* Defect Creation Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Defect</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Summary */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary *
                </label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief description of the defect"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Module */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module *
                </label>
                <select
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Module</option>
                  <option value="Address Selection">Address Selection</option>
                  <option value="Navigation">Navigation</option>
                  <option value="PLP">Product Listing (PLP)</option>
                  <option value="PDP">Product Detail (PDP)</option>
                  <option value="Cart">Cart</option>
                  <option value="Checkout">Checkout</option>
                  <option value="Payment">Payment</option>
                  <option value="Search">Search</option>
                  <option value="User Profile">User Profile</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Highest">Highest</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Lowest">Lowest</option>
                </select>
              </div>

              {/* Scenario */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Failed Scenario
                </label>
                <input
                  type="text"
                  value={formData.scenario}
                  onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                  placeholder="e.g., test_select_delivery_address_with_zipcode"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the defect, steps to reproduce, expected vs actual results..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Logs */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Logs
                </label>
                <textarea
                  value={formData.logs}
                  onChange={(e) => setFormData({ ...formData, logs: e.target.value })}
                  placeholder="Paste error logs, stack traces, etc..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              {/* Screenshot Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screenshot
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5" />
                    <span>Upload Screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.screenshot && (
                    <span className="text-sm text-green-600 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Screenshot uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Create Jira Defect</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Defects List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Recent Defects</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {defects.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No defects logged yet. Failed scenarios will appear here.</p>
            </div>
          ) : (
            defects.map((defect) => (
              <div key={defect.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-mono text-sm font-semibold text-blue-600">
                        {defect.key}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          defect.priority === 'Highest' || defect.priority === 'High'
                            ? 'bg-red-100 text-red-700'
                            : defect.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {defect.priority}
                      </span>
                      <span className="text-xs text-gray-500">{defect.module}</span>
                    </div>

                    <h4 className="font-medium text-gray-900 mb-2">{defect.summary}</h4>
                    <p className="text-sm text-gray-600 mb-3">{defect.description}</p>

                    {defect.scenario && (
                      <div className="text-xs text-gray-500 mb-2">
                        Scenario: <span className="font-mono">{defect.scenario}</span>
                      </div>
                    )}

                    {defect.status && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {defect.status}
                      </span>
                    )}
                  </div>

                  <a
                    href={`https://vulcanmaterials.atlassian.net/browse/${defect.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <span>View in Jira</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
