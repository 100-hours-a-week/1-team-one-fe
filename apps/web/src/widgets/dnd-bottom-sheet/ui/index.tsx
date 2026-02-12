import { tz } from '@date-fns/tz';
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
} from '@repo/ui/bottom-sheet';
import { cn } from '@repo/ui/lib/utils';
import { Switch } from '@repo/ui/switch';
import { format } from 'date-fns';
import type { PointerEventHandler } from 'react';
import { useId, useRef, useState } from 'react';

import { useAlarmSettingsQuery } from '@/src/features/alarm-settings';
import {
  DND_MESSAGES,
  DND_OPTION_IDS,
  DND_OPTIONS,
  formatDndUntilLabel,
  getDndFinishedAt,
  isDndActive,
  toDndPayloadUtc,
  useDndMutation,
} from '@/src/features/dnd';

import { useDndMutationOptions } from '../model/useDndMutationOptions';

const DRAG_HANDLE_HEIGHT = 40;
const DRAG_CLOSE_THRESHOLD = 80;

interface DndBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DndBottomSheet({ open, onOpenChange }: DndBottomSheetProps) {
  //TODO: 알람 설정 시 캐싱 정책 정리 필요
  //TODO: 알람 설정 시 optimistic update 적용 고려 - 지금 적용했지만 더 고민 필요
  const { data: alarmSettings } = useAlarmSettingsQuery({
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
  const dndMutationOptions = useDndMutationOptions();
  const { mutateAsync, isPending } = useDndMutation(dndMutationOptions);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef<number | null>(null);
  const switchLabelId = useId();
  const isDndOn = isDndActive(alarmSettings?.dnd, alarmSettings?.dndFinishedAt);
  const dndStatusLabel = isDndOn ? formatDndUntilLabel(alarmSettings?.dndFinishedAt) : '';

  const handleOptionClick = async (optionId: (typeof DND_OPTIONS)[number]['id']) => {
    if (isPending) return;

    const finishedAt = getDndFinishedAt(optionId);
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    console.log(
      '[dnd] finishedAt (local)',
      format(finishedAt, 'yyyy-MM-dd HH:mm:ss', { in: tz(localTimeZone) }),
    );
    await mutateAsync({ dndFinishedAt: toDndPayloadUtc(finishedAt) });
  };

  const handleToggleChange = async (checked: boolean) => {
    if (isPending) return;

    const finishedAt = checked ? getDndFinishedAt(DND_OPTION_IDS.INFINITE) : new Date();
    await mutateAsync({ dndFinishedAt: toDndPayloadUtc(finishedAt) });
  };

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    if (offsetY > DRAG_HANDLE_HEIGHT) return;

    dragStartY.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isDragging || dragStartY.current === null) return;

    const delta = event.clientY - dragStartY.current;
    if (delta <= 0) return;
    setDragOffset(delta);
  };

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isDragging) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);

    const shouldClose = dragOffset > DRAG_CLOSE_THRESHOLD;
    setDragOffset(0);
    dragStartY.current = null;

    if (!shouldClose) return;
    onOpenChange(false);
  };

  const handlePointerCancel: PointerEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
    setDragOffset(0);
    dragStartY.current = null;
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 180ms ease',
        }}
      >
        <div className="flex flex-col gap-2">
          <BottomSheetTitle>{DND_MESSAGES.TITLE}</BottomSheetTitle>
          <BottomSheetDescription>{DND_MESSAGES.DESCRIPTION}</BottomSheetDescription>
        </div>

        <div className="mt-5 flex items-center justify-start gap-2 rounded-lg">
          <p id={switchLabelId} className="text-text text-sm font-medium">
            {DND_MESSAGES.TOGGLE_LABEL}
          </p>
          <Switch
            aria-labelledby={switchLabelId}
            checked={isDndOn}
            disabled={isPending}
            onCheckedChange={handleToggleChange}
          />
          {dndStatusLabel && <p className="text-text-muted text-sm">{dndStatusLabel}</p>}
        </div>

        <div className="mt-6 max-h-64 w-full overflow-y-auto pr-1">
          <div className="flex w-full flex-col gap-2">
            {DND_OPTIONS.map((option, index) => {
              const isLast = index === DND_OPTIONS.length - 1;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={cn(
                    'text-text hover:bg-bg-subtle focus-visible:ring-focus-ring focus-visible:ring-offset-bg flex w-full items-center justify-between px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-(--disabled-opacity)',
                    !isLast && 'border-border border-b',
                  )}
                  disabled={isPending}
                  onClick={() => handleOptionClick(option.id)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}
