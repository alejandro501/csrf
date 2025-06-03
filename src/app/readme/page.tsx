"use client";

import React from "react";

const ReadmePage = () => {
  return (
    <div className="container mx-auto py-12 text-white">
      <h1 className="text-3xl font-bold mb-6 text-accent">Manual</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">
          Target URL and Method
        </h2>
        <p className="mb-4">
          Use the first input field to enter the target URL where the CSRF
          vulnerability might exist.{" "}
          <span className="text-red-500">Select</span> the appropriate HTTP
          method (GET, POST, PUT, or DELETE) from the dropdown below the URL
          field.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">Parameters</h2>
        <p className="mb-4">
          The Parameters section allows you to define the data that will be sent
          with the request.
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            Click the{" "}
            <span className="font-semibold text-accent text-red-500">
              Add Param
            </span>{" "}
            button to add a new parameter row.
          </li>
          <li>
            Each row has two input fields:{" "}
            <span className="font-semibold text-red-500">Name</span> and{" "}
            <span className="font-semibold text-red-500">Value</span>. Enter the
            parameter name and its corresponding value.
          </li>
          <li>You can add multiple parameters as needed.</li>
          <li>
            To{" "}
            <span className="font-semibold text-red-500">
              remove a parameter
            </span>
            , click the red{" "}
            <span className="font-semibold text-red-500">×</span> button next to
            the parameter row.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">
          HTML Payload
        </h2>
        <p className="mb-4">
          As you input the Target URL, Method, and Parameters, the application
          automatically generates the corresponding HTML payload in the{" "}
          <span className="font-semibold text-accent">HTML Payload</span> text
          area. This is the HTML form code that can be used to perform the CSRF
          attack.
        </p>
        <p>
          You can{" "}
          <span className="font-semibold text-red-500">manually edit</span> the
          generated HTML if needed, and the application will attempt to parse it
          back to update the URL, Method, and Parameters fields.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">
          Testing the Payload
        </h2>
        <p className="mb-4">
          Once your payload is ready, you can test it directly from the
          application:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            Click the{" "}
            <span className="font-semibold text-red-500">Test Payload</span>{" "}
            button.
          </li>
          <li>
            The application will send a request to the Target URL with the
            defined Method and Parameters.
          </li>
          <li>
            The <span className="font-semibold text-accent">Test Results</span>{" "}
            section will{" "}
            <span className="font-semibold text-red-500">display</span> the
            response status code, the response body, and the response headers,
            allowing you to analyze the outcome of the request.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ReadmePage;
