import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { ContentIdea } from '@/types';

const STORAGE_KEY = 'saved_scripts';

export const [ContentProvider, useContent] = createContextHook(() => {
  const [savedScripts, setSavedScripts] = useState<ContentIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadScripts = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedScripts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading scripts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  const saveScript = useCallback(async (script: ContentIdea) => {
    try {
      setSavedScripts(prev => {
        const updated = [...prev, script];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Error saving script:', error);
    }
  }, []);

  const updateScript = useCallback(async (id: string, updates: Partial<ContentIdea>) => {
    try {
      setSavedScripts(prev => {
        const updated = prev.map(s => 
          s.id === id ? { ...s, ...updates } : s
        );
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Error updating script:', error);
    }
  }, []);

  const deleteScript = useCallback(async (id: string) => {
    try {
      setSavedScripts(prev => {
        const updated = prev.filter(s => s.id !== id);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Error deleting script:', error);
    }
  }, []);

  return useMemo(() => ({
    savedScripts,
    isLoading,
    saveScript,
    updateScript,
    deleteScript,
  }), [savedScripts, isLoading, saveScript, updateScript, deleteScript]);
});
