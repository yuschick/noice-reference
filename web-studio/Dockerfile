ARG docker_registry
FROM $docker_registry/mirror/node:20.4-alpine AS build

RUN set -x && \
    apk add --no-cache git ca-certificates

# let's only copy files that actually affect yarn install
COPY lib/ts/gen /usr/src/lib/ts/gen
COPY lib/ts/platform-client /usr/src/lib/ts/platform-client
COPY lib/ts/utils /usr/src/lib/ts/utils
COPY lib/ts/server /usr/src/lib/ts/server
COPY lib/ts/renderer /usr/src/lib/ts/renderer
COPY lib/ts/card-game /usr/src/lib/ts/card-game
COPY lib/ts/common-ui /usr/src/lib/ts/common-ui
COPY lib/ts/common-react-core /usr/src/lib/ts/common-react-core
COPY lib/ts/stream /usr/src/lib/ts/stream
COPY lib/ts/chat-react-web /usr/src/lib/ts/chat-react-web
COPY lib/ts/chat-react-core /usr/src/lib/ts/chat-react-core
COPY lib/ts/social /usr/src/lib/ts/social
COPY lib/ts/social-react-core /usr/src/lib/ts/social-react-core
COPY lib/ts/apollo-client-utils /usr/src/lib/ts/apollo-client-utils
COPY lib/ts/assets-core /usr/src/lib/ts/assets-core
COPY .yarn/ /usr/src/.yarn/
COPY tools/eslint-config /usr/src/tools/eslint-config
COPY tools/eslint-config-react /usr/src/tools/eslint-config-react
COPY tools/esbuild /usr/src/tools/esbuild
COPY tools/esbuild-plugins /usr/src/tools/esbuild-plugins
COPY tools/vite-plugins /usr/src/tools/vite-plugins
COPY tools/postcss /usr/src/tools/postcss
COPY tools/design-tokens /usr/src/tools/design-tokens

# Copy workspace stuff
COPY yarn.lock /usr/src/yarn.lock
COPY package.json /usr/src/package.json
COPY tsconfig.json /usr/src/tsconfig.json
COPY tsconfig.base.json /usr/src/tsconfig.base.json
# We don't copy .yarnrc.yml in so we don't leak any secrets,
# we instead mount it as a secret in commands that require it
#COPY .yarnrc.yml /usr/src/.yarnrc.yml

COPY clients/web-studio/package.json /usr/src/clients/web-studio/package.json

# Copy the GraphQL stuff
COPY graphql /usr/src/graphql

WORKDIR /usr/src/clients/web-studio

RUN --mount=type=cache,target=/root/.yarn --mount=type=secret,id=yarnrc,target=/usr/src/.yarnrc.yml YARN_CACHE_FOLDER=/root/.yarn yarn || { cat /tmp/*/build.log; exit 1; }

# lets copy rest of the source
COPY clients/web-studio/ /usr/src/clients/web-studio/

ARG workspace_hash
ENV WORKSPACE_HASH=${workspace_hash}

# Web client build
FROM build as web-studio-build
WORKDIR /usr/src/clients/web-studio
RUN --mount=type=secret,id=yarnrc,target=/usr/src/.yarnrc.yml BUNDLE_BASE_PATH="/" yarn build

# Web client
ARG docker_registry
FROM $docker_registry/mirror/node:20.4-alpine as web-studio

ARG build_time
ARG build_hash

ENV BUILD_TIME=${build_time}
ENV BUILD_HASH=${build_hash}
ENV PORT=80

COPY --from=web-studio-build /usr/src/clients/web-studio/package.json /usr/src/clients/web-studio/package.json
COPY --from=web-studio-build /usr/src/clients/web-studio/server_pack.js /usr/src/clients/web-studio/server_pack.js
COPY --from=web-studio-build /usr/src/clients/web-studio/dist/ /usr/src/clients/web-studio/dist/

WORKDIR /usr/src/clients/web-studio
CMD yarn serve-optimized
