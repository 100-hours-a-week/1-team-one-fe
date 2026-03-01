import { z } from 'zod';

const NICKNAME_ALLOWED = /^[A-Za-z가-힣]+$/;

export const profileEditNicknameSchema = z.object({
  nickname: z
    .string()
    .min(1, '닉네임을 입력해 주세요.')
    .max(10, '닉네임은 최대 10자까지 작성 가능합니다.')
    .refine((v) => !/\s/.test(v), { message: '띄어쓰기를 없애주세요.' })
    .refine((v) => NICKNAME_ALLOWED.test(v), {
      message: '닉네임에는 영문과 한글만 사용 가능합니다.',
    }),
});

export type ProfileEditNicknameValues = z.infer<typeof profileEditNicknameSchema>;
