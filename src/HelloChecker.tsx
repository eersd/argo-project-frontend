import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

// In production, we can inject this or use a relative path if using a reverse proxy.
// For now, we'll check if a global config exists or fallback to localhost.
const BACKEND_URL = (window as any)._env_?.BACKEND_URL || 'http://localhost:8080';

export function HelloChecker() {
  const [name, setName] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const helloMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BACKEND_URL}/hello`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.text();
    },
    onSuccess: (data) => setResponse(data),
  });

  const helloNameMutation = useMutation({
    mutationFn: async (userName: string) => {
      const res = await fetch(`${BACKEND_URL}/hello/${userName}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.text();
    },
    onSuccess: (data) => setResponse(data),
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Hello Backend Checker (POST)</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={() => helloMutation.mutate()}
          disabled={helloMutation.isPending}
        >
          Call /hello (POST)
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter name"
          style={{ marginRight: '10px' }}
        />
        <button 
          onClick={() => helloNameMutation.mutate(name)}
          disabled={helloNameMutation.isPending || !name}
        >
          Call /hello/{name || '{name}'} (POST)
        </button>
      </div>

      {response && (
        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
          Backend says: {response}
        </div>
      )}

      {(helloMutation.isError || helloNameMutation.isError) && (
        <div style={{ marginTop: '10px', color: 'red' }}>
          Error: Could not connect to backend at {BACKEND_URL}.
        </div>
      )}
    </div>
  );
}
