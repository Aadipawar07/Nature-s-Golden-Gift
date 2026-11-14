import { useCallback, useEffect, useState } from 'react';

export default function useApi(request) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const run = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await request();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  }, [request]);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, retry: run };
}
