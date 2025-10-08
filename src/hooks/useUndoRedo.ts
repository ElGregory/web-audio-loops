import { useState, useCallback, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export const useUndoRedo = <T,>(initialState: T, maxHistory: number = 50) => {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  });
  
  const isUndoingRef = useRef(false);

  const setState = useCallback((newState: T) => {
    if (isUndoingRef.current) return;
    
    setHistory((current) => {
      // Only add to history if state actually changed
      if (JSON.stringify(current.present) === JSON.stringify(newState)) {
        return current;
      }

      const newPast = [...current.past, current.present].slice(-maxHistory);
      return {
        past: newPast,
        present: newState,
        future: []
      };
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    setHistory((current) => {
      if (current.past.length === 0) return current;

      const previous = current.past[current.past.length - 1];
      const newPast = current.past.slice(0, -1);

      isUndoingRef.current = true;
      setTimeout(() => { isUndoingRef.current = false; }, 0);

      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.future.length === 0) return current;

      const next = current.future[0];
      const newFuture = current.future.slice(1);

      isUndoingRef.current = true;
      setTimeout(() => { isUndoingRef.current = false; }, 0);

      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const reset = useCallback((newState: T) => {
    setHistory({
      past: [],
      present: newState,
      future: []
    });
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0
  };
};
