import { useState, useEffect, useCallback } from 'react';

type Prediction = {
  id: string;
  caseId: string;
  caseSummary: string;
  suggestedAction: string;
}

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/predictions');
      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }
      const data = await response.json();
      const formattedData = data.map((item: any) => ({ ...item, id: item._id }));
      setPredictions(formattedData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return {
    predictions,
    loading,
    error,
    fetchPredictions,
  };
}