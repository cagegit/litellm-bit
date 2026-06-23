# syntax=docker/dockerfile:1.7
ARG NODE_IMAGE=node:20.18-alpine3.20
ARG LITELLM_BASE_IMAGE=litellm/litellm:main-stable

FROM ${NODE_IMAGE} AS ui-builder
ENV NEXT_TELEMETRY_DISABLED=1 \
    npm_config_fund=false \
    npm_config_audit=false
WORKDIR /app
COPY ui/litellm-dashboard/package.json ui/litellm-dashboard/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline
COPY ui/litellm-dashboard/ ./
RUN npm run build \
    && test -f out/index.html \
    && test -d out/_next \
    && test -f out/login/index.html \
    && touch out/.litellm_ui_ready

FROM ${LITELLM_BASE_IMAGE}
USER root
RUN rm -rf /var/lib/litellm/ui && mkdir -p /var/lib/litellm/ui
COPY --from=ui-builder --chown=0:0 /app/out/ /var/lib/litellm/ui/
RUN chmod -R u=rwX,go=rX /var/lib/litellm/ui
ENV LITELLM_UI_PATH=/var/lib/litellm/ui
