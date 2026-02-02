import Image from 'next/image';

export function DevelopingScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 opacity-40">
      <h2 className="text-text text-center text-2xl font-semibold">현재 개발 중인 화면입니다</h2>
      <Image src={'/images/main/developing.png'} width={150} height={300} alt="Developing Screen" />
      <p className="text-text-muted max-w-md text-center">
        해당 화면은 아직 개발 중에 있어 일부 기능이 제한될 수 있습니다
      </p>
    </div>
  );
}
