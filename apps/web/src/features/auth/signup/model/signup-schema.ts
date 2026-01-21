import { z } from 'zod';

import { VALIDATION_MESSAGES as MSG } from '../config/form-messages';
import { VALIDATION_RULES as RULES } from '../config/validation';

//TODO: 유틸로 빼기
function getFileExt(name: string) {
  const idx = name.lastIndexOf('.');
  if (idx < 0) return '';
  return name.slice(idx + 1).toLowerCase();
}

const EMAIL_ALLOWED_CHARS = /^[A-Za-z0-9@.]+$/;

/** 비밀번호 규칙(8~16, 대/소문자/숫자/특수문자 포함) */
const PASSWORD_COMPLEXITY = new RegExp(
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{${RULES.PASSWORD_MIN},${RULES.PASSWORD_MAX}}$`,
);

/** 닉네임 규칙(공백/특수문자 불가, 한글/영문만, 10자 이내) */
const NICKNAME_ALLOWED = /^[A-Za-z가-힣]+$/;

export const signupSchema = z
  .object({
    // 프로필 이미지 - 기본 디폴트 이미지는 없음으로 취급 → optional/nullable 허용
    profileImage: z
      .union([z.instanceof(File), z.null()])
      .optional()
      .superRefine((file, ctx) => {
        if (!file) return;

        // size check
        if (file.size > RULES.PROFILE_IMAGE_MAX_BYTES) {
          ctx.addIssue({
            code: 'custom',
            message: MSG.PROFILE_IMAGE_TOO_LARGE,
          });
          return;
        }

        // extension check
        const ext = getFileExt(file.name);
        if (!RULES.PROFILE_IMAGE_ALLOWED_EXT.includes(ext as any)) {
          ctx.addIssue({
            code: 'custom',
            message: MSG.PROFILE_IMAGE_INVALID_EXT,
          });
        }
      }),

    /** 이메일
     * - required
     * - max 254
     * - 영문/숫자 + @ . 만 허용(원문 그대로면 숫자 제외로 조정 가능)
     * - email 포맷
     */
    email: z
      .email(MSG.EMAIL_INVALID)
      .min(1, MSG.EMAIL_REQUIRED)
      .max(RULES.EMAIL_MAX_LENGTH, MSG.EMAIL_MAX)
      .regex(EMAIL_ALLOWED_CHARS, MSG.EMAIL_CHARSET),
    /** 닉네임
     * - required
     * - 10자 이내
     * - 공백 금지
     * - 특수문자 금지(한글/영문만)
     */
    nickname: z
      .string()
      .min(1, MSG.NICKNAME_REQUIRED)
      .max(RULES.NICKNAME_MAX_LENGTH, MSG.NICKNAME_MAX)
      .refine((v) => !/\s/.test(v), { message: MSG.NICKNAME_NO_SPACE })
      .refine((v) => NICKNAME_ALLOWED.test(v), { message: MSG.NICKNAME_ONLY_KO_EN }),

    /** 비밀번호
     * - required
     * - 8~16
     * - 대문자/소문자/숫자/특수문자 포함
     */
    password: z
      .string()
      .min(1, MSG.PASSWORD_REQUIRED)
      .refine((v) => PASSWORD_COMPLEXITY.test(v), { message: MSG.PASSWORD_RULE }),

    /** 비밀번호 확인
     * - required
     */
    passwordConfirm: z.string().min(1, MSG.PASSWORD_CONFIRM_REQUIRED),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: MSG.PASSWORD_MISMATCH,
    path: ['passwordConfirm'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
