import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:8000';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ask = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.response || JSON.stringify(data);
    } catch (err) {
      const msg = err.message.includes('fetch') 
        ? 'Backend offline. Connect to http://localhost:8000 to enable live AI responses.'
        : err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBrief = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/brief`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.brief || data.response || data.text || JSON.stringify(data);
    } catch (err) {
      const msg = err.message.includes('fetch')
        ? 'Backend offline. Morning brief unavailable without a running server.'
        : err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMemory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/memory`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      const msg = err.message.includes('fetch')
        ? 'Backend offline. Memory module requires a running server.'
        : err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { ask, getBrief, getMemory, loading, error };
}
