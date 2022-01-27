# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci 

FROM node:16-alpine AS builder 


# ARG [ 'NEXT_PUBLIC_DATABASE_CONNECTION', 'NEXT_PUBLIC_PAYPAL_CLIENT_ID', 'NEXT_PUBLIC_PAYPAL_SECRET', 'NEXT_PUBLIC_CLOUDINARY_NAME', 'NEXT_PUBLIC_API_KEY', 'NEXT_PUBLIC_API_SECRET', 'NEXT_PUBLIC_GOOGLE_MAP_API', 'NEXT_PUBLIC_JWT_TOKEN_SECRET' ]

# ENV NEXT_PUBLIC_DATABASE_CONNECTION: ${{secrets.NEXT_PUBLIC_DATABASE_CONNECTION}}


WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm install --production --ignore-scripts --prefer-offline 
#--no-install-recommends cypress
# RUN apt-get -y install --no-install-recommends cypress

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

# ARG [ 'NEXT_PUBLIC_DATABASE_CONNECTION', 'NEXT_PUBLIC_PAYPAL_CLIENT_ID', 'NEXT_PUBLIC_PAYPAL_SECRET', 'NEXT_PUBLIC_CLOUDINARY_NAME', 'NEXT_PUBLIC_API_KEY', 'NEXT_PUBLIC_API_SECRET', 'NEXT_PUBLIC_GOOGLE_MAP_API', 'NEXT_PUBLIC_JWT_TOKEN_SECRET' ]


ENV NODE_ENV = production
    
# ARG NEXT_PUBLIC_DATABASE_CONNECTION 

# ENV NEXT_PUBLIC_DATABASE_CONNECTION: ${{secrets.NEXT_PUBLIC_DATABASE_CONNECTION}}


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
 COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8000

ENV PORT 8000 

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1


CMD ["npm", "run", "start"]