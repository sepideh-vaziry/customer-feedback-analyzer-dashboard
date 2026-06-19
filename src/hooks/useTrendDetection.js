import { useEffect, useRef, useState, useCallback } from 'react';
import { detectTrends, getDetectionJob, getDetectionJobLocation } from '../services/trendService';

const TERMINAL_STATUSES = new Set(['COMPLETED', 'FAILED']);

export function useTrendDetection({ pollIntervalMs = 2500, timeoutMs = 60000 } = {}) {
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef(false);
  const timeoutRef = useRef(null);

  const reset = useCallback(() => {
    cancelRef.current = false;
    setJob(null);
    setError(null);
  }, []);

  const start = useCallback(async (windowDays = 7) => {
    reset();
    setLoading(true);
    try {
      const response = await detectTrends({ windowDays });
      const jobId = getDetectionJobLocation(response.headers) || response.data?.id;
      if (!jobId) throw new Error('Detection job was not started.');
      setJob({ id: jobId, status: 'PENDING' });

      timeoutRef.current = setTimeout(() => {
        cancelRef.current = true;
        setError('Detection is taking longer than expected.');
        setLoading(false);
      }, timeoutMs);

      while (!cancelRef.current) {
        await new Promise((r) => setTimeout(r, pollIntervalMs));
        if (cancelRef.current) break;
        const next = await getDetectionJob(jobId);
        if (cancelRef.current) break;
        setJob(next);
        if (TERMINAL_STATUSES.has(next.status)) break;
      }
    } catch (err) {
      if (!cancelRef.current) setError(err.response?.data?.message || err.message || 'Detection failed.');
    } finally {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setLoading(false);
    }
  }, [pollIntervalMs, timeoutMs, reset]);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
  }, []);

  useEffect(() => () => {
    cancelRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { job, error, loading, start, cancel };
}
