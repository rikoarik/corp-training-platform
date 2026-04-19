import { useState } from 'react';

export function useAdminListState() {
  const [query, setQuery] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();

  async function runRowAction(id: string, action: () => Promise<void>, fallbackMessage: string) {
    setActionId(id);
    setActionError(null);

    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : fallbackMessage);
    } finally {
      setActionId(null);
    }
  }

  return {
    query,
    setQuery,
    normalizedQuery,
    actionId,
    actionError,
    setActionError,
    runRowAction,
  };
}
