# ========== 1단계: 의존성 및 빌드 스테이지 ==========
FROM node:24-alpine AS builder
# Alpine 환경에서 Next.js 구동을 위해 필요한 호환 라이브러리 설치
RUN apk add --no-cache libc6-compat
# PNPM 글로벌 세팅 및 활성화
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 전체 소스 복사 (포트폴리오 빌드용이므로 단순화하여 전체 복사 진행)
COPY . .

# 의존성 설치 및 Next.js 빌드 진행
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# ========== 2단계: 런타임 스테이지 ==========
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Alpine(musl) 호환 패키지 재설치
RUN apk add --no-cache libc6-compat

# 1단계 빌더에서 생성된 standalone 빌드 산출물과 정적(Static/Public) 자산만 복사
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

USER nobody
EXPOSE 3000

# Next.js standalone 빌드 결과물의 진입점 실행
CMD ["node", "apps/web/server.js"]
