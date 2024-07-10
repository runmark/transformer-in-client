'use client';

import { useState, useEffect, useRef, useCallback } from "react";


export default function Home() {

  // add state variable
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(false);

  // create a ref to worker object
  const worker = useRef(null);

  // useEffect initiate worker and onmessage listener
  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    console.log('baseUrl: ', import.meta.url);

    worker.current.addEventListener('message', (e) => {
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          break;
        case 'ready':
          setReady(true);
          break;
        case 'complete':
          setResult(e.data.output[0]);
          break;
      }
    });
  });


  // classify function
  const classify = useCallback((text) => {
    if (worker.current) {
      worker.current.postMessage({ text });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold mb-2 text-center">Transformers.js</h1>
      <h2 className="text-2xl mb-4 text-center">Next.js template</h2>

      <input
        className="w-full max-w-xs p-2 border border-gray-300 rounded mb-4"
        type="text"
        placeholder="Enter text here"
        onInput={e => {
          classify(e.target.value);
        }}
      />

      {ready !== null && (
        <pre className="bg-gray-100 p-2 rounded">
          {(!ready || !result) ? 'Loading...' : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );

}