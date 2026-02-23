//스트레칭 성능 계측 키(스팬/속성) 정의
export const StretchingPerformanceConfig = {
  SpanNames: {
    SessionInit: 'stretching.session.init',
  },
  SpanOps: {
    SessionInit: 'stretching.session',
  },
  MeasurementNames: {
    LandmarkerInit: 'stretch.landmarker_init_ms',
    RendererInit: 'stretch.renderer_init_ms',
    SessionToVideoPlay: 'stretch.session_to_video_play_ms',
    SessionToCameraReady: 'stretch.session_to_camera_ready_ms',
    SessionToPoseReady: 'stretch.session_to_pose_ready_ms',
    CameraToPoseReady: 'stretch.camera_to_pose_ready_ms',
  },
  AttributeNames: {
    NetworkEffectiveType: 'net.effective_type',
    SessionId: 'stretch.session_id',
    SessionError: 'stretch.session_error',
  },
} as const;
