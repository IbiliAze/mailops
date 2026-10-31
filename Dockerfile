# MailOps — one image, two processes.
#
# The Swarm stack runs this image as `mailops-api` and `mailops-web`. Building
# both halves together guarantees that the static UI and API always come from
# the same commit.
FROM node:26.12.1-alpine

# Node 26 images ship neither yarn nor corepack; yarn classic matches yarn.lock
# and mise.toml.
RUN apk add --no-cache nginx \
    && npm install -g --silent --no-fund --no-audit yarn@1.22.22

WORKDIR /app

# GitLab CI writes the production `.env` before this build. It stays in the
# local image because the TypeORM migration runner and Nest API both need it;
# this image is consumed on the deploy host and is not pushed to a registry.
COPY . .

# An empty public API base makes browser requests same-origin (`/api/...`). The
# web container proxies those requests to the private API service.
RUN yarn install --frozen-lockfile \
    && NEXT_PUBLIC_API_URL= yarn build \
    && yarn cache clean \
    && rm -rf web/.next/cache

COPY deploy/docker/api-entrypoint.sh /usr/local/bin/api-entrypoint.sh
COPY deploy/nginx/web.conf /etc/nginx/http.d/default.conf
RUN chmod +x /usr/local/bin/api-entrypoint.sh

EXPOSE 5000

# Overridden by the web service in the production compose file.
CMD ["/usr/local/bin/api-entrypoint.sh"]
