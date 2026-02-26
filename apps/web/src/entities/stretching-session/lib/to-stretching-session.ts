import type {
  RoutineStepResponseType,
  StretchingSessionDataType,
} from '../api/dto/stretching-session.dto';
import type {
  StretchingSessionExercisePoseType,
  StretchingSessionStepType,
  StretchingSessionType,
} from '../model/types';
import { toEyeReference } from './to-eye-reference';
import { toReferencePose } from './to-reference-pose';

/**
 * @description API 응답 형태의 RoutineStepResponseType 를 정확도 엔진의 input 형식으로 변환
 */

const toStretchingSessionPose = (
  step: RoutineStepResponseType,
): StretchingSessionExercisePoseType => {
  if (step.exercise.type === 'EYES') {
    return {
      eyeReference: toEyeReference(
        step.exercise.pose.keyFrames ?? [],
        step.exercise.pose.totalDurationMs ?? 0,
      ),
    };
  }

  return {
    referencePose: toReferencePose(step.exercise.pose.referencePose!),
  };
};

const toStretchingSessionStep = (step: RoutineStepResponseType): StretchingSessionStepType => {
  return {
    routineStepId: step.routineStepId,
    stepOrder: step.stepOrder,
    targetReps: step.targetReps,
    durationTime: step.durationTime,
    limitTime: step.limitTime,
    exercise: {
      exerciseId: step.exercise.exerciseId,
      type: step.exercise.type,
      name: step.exercise.name,
      content: step.exercise.content,
      effect: step.exercise.effect,
      pose: toStretchingSessionPose(step),
    },
  };
};

export function toStretchingSession(data: StretchingSessionDataType): StretchingSessionType {
  return {
    routineId: data.routineId,
    routineOrder: data.routineOrder,
    createdAt: data.createdAt,
    routineSteps: data.routineSteps.map(toStretchingSessionStep),
  };
}
