import { useEffect } from 'react';

interface KeyboardShortcuts {
  onPlayPause?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onBpmIncrease?: () => void;
  onBpmDecrease?: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onPlayPause,
  onUndo,
  onRedo,
  onBpmIncrease,
  onBpmDecrease,
  enabled = true
}: KeyboardShortcuts) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Space bar - Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        onPlayPause?.();
      }

      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo?.();
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault();
        onRedo?.();
      }

      // Arrow Up - Increase BPM
      if (e.code === 'ArrowUp' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onBpmIncrease?.();
      }

      // Arrow Down - Decrease BPM
      if (e.code === 'ArrowDown' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onBpmDecrease?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onPlayPause, onUndo, onRedo, onBpmIncrease, onBpmDecrease]);
};
