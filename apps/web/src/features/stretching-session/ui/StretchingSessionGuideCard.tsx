import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';

type StretchingSessionGuideCardProps = {
  name: string;
  content: string;
  effect: string;
};

export function StretchingSessionGuideCard({
  name,
  content,
  effect,
}: StretchingSessionGuideCardProps) {
  return (
    <Card variant="elevated" padding="md">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-text-muted">{'운동 방법'}</span>
          <span className="text-text">{content}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-text-muted">{'운동 효과'}</span>
          <span className="text-text">{effect}</span>
        </div>
      </CardContent>
    </Card>
  );
}
