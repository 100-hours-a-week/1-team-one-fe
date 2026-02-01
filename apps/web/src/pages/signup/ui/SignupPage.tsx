import { useRouter } from 'next/router';
import z from 'zod';

import { SignupForm } from '@/src/features/auth/signup';
import {
  uploadToPresignedPut,
  useProfileImageUploadMutation,
  useSignupMutation,
} from '@/src/features/auth/signup/api';
import { signupSchema } from '@/src/features/auth/signup/model/signup-schema';
import { ROUTES } from '@/src/shared/routes';

type SignupValues = z.infer<typeof signupSchema>;

const PROFILE_DEFAULT_IMAGE_URL = '/users/profile/default.png';

export function SignupPage() {
  const router = useRouter();
  const signupMutation = useSignupMutation();
  const profileImageUploadMutation = useProfileImageUploadMutation();

  const handleSubmit = async (values: SignupValues) => {
    let imagePath: string | undefined;
    const profileImage = values.profileImage;

    //presigned url upload
    if (profileImage) {
      const contentType = profileImage.type || 'application/octet-stream';
      let uploadInfo = await profileImageUploadMutation.mutateAsync({
        fileName: profileImage.name,
        contentType,
      });

      if (isExpired(uploadInfo.expiresAt)) {
        uploadInfo = await profileImageUploadMutation.mutateAsync({
          fileName: profileImage.name,
          contentType,
        });
      }

      await uploadToPresignedPut(uploadInfo.uploadUrl, profileImage, contentType);
      imagePath = uploadInfo.filePath;
    }

    await signupMutation.mutateAsync(
      {
        email: values.email,
        nickname: values.nickname,
        password: values.password,
        imagePath: imagePath || PROFILE_DEFAULT_IMAGE_URL, //빈 문자열도 default
      },
      { onSuccess: () => router.push(ROUTES.LOGIN) },
    );
  };

  return (
    <div className="flex h-full items-center gap-6 p-6">
      <SignupForm
        onSubmit={handleSubmit}
        isPending={signupMutation.isPending}
        isProfileImageUploading={profileImageUploadMutation.isPending}
      />
    </div>
  );
}

function isExpired(expiresAt: string) {
  const expiresAtMs = Date.parse(expiresAt);
  if (Number.isNaN(expiresAtMs)) return false;
  return Date.now() >= expiresAtMs;
}
