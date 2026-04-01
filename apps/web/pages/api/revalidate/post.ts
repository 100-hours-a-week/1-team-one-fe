import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  if (req.headers['x-revalidate-secret'] !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  const postId = Number(req.body.postId);

  if (Number.isNaN(postId) || postId <= 0) {
    return res.status(400).json({ message: 'Invalid postId' });
  }

  await res.revalidate(`/moments/post/${postId}`);

  return res.status(200).json({ revalidated: true, postId });
}
