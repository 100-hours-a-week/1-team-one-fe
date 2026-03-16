import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

export function useMonthlyGrassTooltip() {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [lockedDate, setLockedDate] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lockedDate) return;

    const handlePointerDown = (event: PointerEvent) => {
      const eventTarget = event.target;
      if (!(eventTarget instanceof Node)) return;
      if (panelRef.current?.contains(eventTarget)) return;

      setLockedDate(null);
      setHoveredDate(null);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [lockedDate]);

  const isTooltipOpen = (cellDate: string) => {
    return lockedDate === cellDate || (!lockedDate && hoveredDate === cellDate);
  };

  const handleTooltipOpenChange = (cellDate: string, nextOpen: boolean) => {
    if (lockedDate) return;

    if (nextOpen) {
      setHoveredDate(cellDate);
      return;
    }

    if (hoveredDate !== cellDate) return;
    setHoveredDate(null);
  };

  const handleCellClick = (cellDate: string) => {
    if (lockedDate === cellDate) {
      setLockedDate(null);
      setHoveredDate(null);
      return;
    }

    setLockedDate(cellDate);
    setHoveredDate(cellDate);
  };

  const handleCellKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Escape') return;
    setLockedDate(null);
    setHoveredDate(null);
  };

  return {
    panelRef,
    isTooltipOpen,
    handleTooltipOpenChange,
    handleCellClick,
    handleCellKeyDown,
  } as const;
}
