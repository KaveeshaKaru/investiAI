import { useState, useEffect, useCallback } from 'react';
import { PoliceReport } from '@/lib/types';

export function usePoliceReports() {
  const [reports, setReports] = useState<PoliceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (query?: string, status?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (status && status !== 'all') params.append('status', status);

      const response = await fetch('/api/police-reports?' + params.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      // Map _id to id
      const formattedData = data.map((item: any) => ({ ...item, id: item._id }));
      setReports(formattedData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReport = async (id: string, reportData: Partial<PoliceReport>) => {
    try {
      const response = await fetch('/api/police-reports/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to update report');
      }
      // Re-fetch reports to get the latest data
      await fetchReports();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const response = await fetch('/api/police-reports/' + id, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }
      // Re-fetch reports to get the latest data
      await fetchReports();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    fetchReports,
    updateReport,
    deleteReport,
  };
}