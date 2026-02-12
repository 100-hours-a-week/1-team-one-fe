import { useCallback, useEffect, useRef, useState } from 'react';

type GazePoint = { x: number; y: number };

export function DebugWebgazerPage() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [gaze, setGaze] = useState<GazePoint | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const webgazerRef = useRef<any>(null);
  const gazeRef = useRef<GazePoint | null>(null);
  const rafRef = useRef(0);

  // RAF로 UI 업데이트 (setState 과부하 방지)
  const scheduleUiUpdate = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setGaze(gazeRef.current ? { ...gazeRef.current } : null);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const mod = await import('webgazer');
        if (cancelled) return;

        const wg = mod.default;
        webgazerRef.current = wg;

        wg.params.saveDataAcrossSessions = false;

        wg.showPredictionPoints(true)
          .showVideo(true)
          .showFaceOverlay(true)
          .showFaceFeedbackBox(true);

        wg.setGazeListener((data: GazePoint | null) => {
          if (!data) return;
          gazeRef.current = data;
          scheduleUiUpdate();
        });

        await wg.begin();

        if (cancelled) {
          wg.end();
          return;
        }

        setStatus('ready');
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(String(err));
          setStatus('error');
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      try {
        webgazerRef.current?.end();
      } catch {
        // ignore
      }
    };
  }, [scheduleUiUpdate]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <span className="text-lg text-white">WebGazer 로딩 중...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <span className="text-sm text-red-400">오류: {errorMsg}</span>
      </div>
    );
  }

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1;
  const normX = gaze ? (gaze.x / vw).toFixed(3) : '—';
  const normY = gaze ? (gaze.y / vh).toFixed(3) : '—';

  return (
    <div className="relative h-screen w-full bg-black">
      {/* 시선 좌표 dot */}
      {gaze && (
        <div
          className="pointer-events-none absolute z-50"
          style={{
            left: gaze.x,
            top: gaze.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="block h-4 w-4 rounded-full bg-red-500 opacity-80" />
        </div>
      )}

      {/* 좌표 정보 패널 */}
      <div className="absolute bottom-4 left-4 z-50 rounded-lg bg-black/70 p-4 font-mono text-sm text-white">
        <div className="mb-2 text-xs text-gray-400">WebGazer Raw Output</div>
        <div>
          pixel: ({gaze ? Math.round(gaze.x) : '—'}, {gaze ? Math.round(gaze.y) : '—'})
        </div>
        <div>
          normalized: ({normX}, {normY})
        </div>
        <div>
          viewport: {vw} x {vh}
        </div>
      </div>
    </div>
  );
}
