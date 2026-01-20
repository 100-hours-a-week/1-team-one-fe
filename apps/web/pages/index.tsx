import { Button } from '@repo/ui/button';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
    >
      <Button
        className="rounded-full bg-black px-6 py-3 font-mono text-white dark:bg-white dark:text-black"
        appName="web"
      >
        button
      </Button>
    </div>
  );
}
