import type { NextApiResponse } from 'next';

const POST_MUTATION_METHODS = new Set(['DELETE', 'PUT', 'PATCH']);
const POST_PATH_PATTERN = /^\/api\/posts\/(\d+)$/;

export function extractPostIdToRevalidate(method: string | undefined, path: string): number | null {
  if (!method || !POST_MUTATION_METHODS.has(method)) return null;

  const match = POST_PATH_PATTERN.exec(path);
  if (!match) return null;

  return Number(match[1]);
}

export async function maybeRevalidatePost(
  res: NextApiResponse,
  method: string | undefined,
  targetPath: string,
  status: number,
): Promise<void> {
  if (status < 200 || status >= 300) return;

  const postId = extractPostIdToRevalidate(method, targetPath);
  if (postId === null) return;

  try {
    await res.revalidate(`/moments/post/${postId}`);
  } catch (err) {
    console.warn('[bff-proxy] revalidate failed', { postId, err });
  }
}
