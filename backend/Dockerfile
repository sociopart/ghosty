ARG RUBY_VERSION=3.4.6
FROM ruby:${RUBY_VERSION}-slim-bookworm

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        postgresql-client \
        git \
        nodejs \
        npm \
        tzdata \
        libvips42 \
        ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g yarn

WORKDIR /api

# Keeping container alive (by default)
CMD ["sleep", "infinity"]