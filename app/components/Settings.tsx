"use client";

import React, { useState, useEffect } from 'react';
import { 
  setOpenAIApiKey, 
  setUseOpenAI, 
  getOpenAIApiKey, 
  isOpenAIEnabled 
} from '../utils/store';

export default function Settings({ onClose }: { onClose: () => void }) {
  const [apiKey, setApiKey] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load current settings
    setApiKey(getOpenAIApiKey());
    setEnabled(isOpenAIEnabled());
  }, []);

  const handleSave = () => {
    try {
      if (enabled && !apiKey.trim()) {
        setError('API Key is required when OpenAI is enabled');
        return;
      }

      // Save settings
      setOpenAIApiKey(apiKey);
      setUseOpenAI(enabled);
      
      // Show success message
      setSaved(true);
      setError('');
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[var(--secondary)] rounded-xl p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">GlazeHub Settings</h2>
          <button 
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium text-[var(--text-primary)]">Enable OpenAI for comments</label>
            <div 
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-[var(--primary)]' : 'bg-gray-300 dark:bg-gray-600'}`}
              onClick={() => setEnabled(!enabled)}
            >
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} 
              />
            </div>
          </div>
          
          <div>
            <label className="block font-medium text-[var(--text-primary)] mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-200'
              } bg-white dark:bg-gray-800 text-[var(--text-primary)]`}
              disabled={!enabled}
            />
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
            >
              Save
            </button>
          </div>
          
          {saved && (
            <p className="text-green-500 text-sm text-center">Settings saved successfully!</p>
          )}
        </div>
      </div>
    </div>
  );
}
