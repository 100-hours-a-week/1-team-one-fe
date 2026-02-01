import { Chip } from '@repo/ui/chip';
import Image from 'next/image';

type ResultStatusColor = {
  bgClass: string;
  textClass: string;
  badgeClass: string;
};

type StretchingSessionResultStatusCardProps = {
  title: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  color: ResultStatusColor;
};

export function StretchingSessionResultStatusCard({
  title,
  label,
  imageSrc,
  imageAlt,
  color,
}: StretchingSessionResultStatusCardProps) {
  return (
    <div
      className={`animate-result-pop flex flex-col items-center gap-3 rounded-lg px-4 py-5 ${color.bgClass}`}
    >
      <Chip label={title} size="sm" className={`text-xs font-semibold ${color.badgeClass}`} />
      <p className={`text-base font-semibold ${color.textClass} text-center whitespace-pre`}>
        {label}
      </p>
      <Image src={imageSrc} alt={imageAlt} width={220} height={160} priority />
    </div>
  );
}
