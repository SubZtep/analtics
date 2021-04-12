# Analtics 📊🦕

Website analytics, GraphQL + Deno.

:warning: **Work In Progress**

[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)

This document is for development purposes, otherwise visit
[docs](docs/index.md).

_tbc._

## Requirements

Here is a software requirement list that is supposed to be installed on the
developer machine.

- [Deno](https://deno.land) — TypeScript Runtime.
- [`deployctl` tool](https://deno.com/deploy/docs/running-scripts-locally) — For
  local _Deno Deploy_ developent.
- [Velociraptor](https://velociraptor.run) — Script runner.
- [Docker](https://www.docker.com/) — For local _FaunaDB_ instance.
- [Fauna Shell](https://docs.fauna.com/fauna/current/integrations/shell/) -
  Execute Fauna commands in local instance.

## Environment Variables

Create `.env` file with the following content:

```sh
GRAPHQL_URL=https://graphql.fauna.com/graphql
GRAPHQL_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxy
ACCOUNT=000000000000000001
```

## IP to Location

For IP to location
[download](https://www.maxmind.com/en/accounts/529567/geoip/downloads) database
to `bin/GeoLite2-City.mmdb`.

## Local Database

### Start

Start up local FaunaDB and create `.env.test` file.

```sh
$ ./scripts/faunadb-test-start.sh
```

### Stop

Stop local FaunaDB and delete `.env.test` file.

```sh
$ ./scripts/faunadb-test-stop.sh
```

## Local Scripts

Mostly helpers during development. Command `vr` is from the script runner.

```sh
# Create new account
$ deno run --allow-read --allow-net --no-check scripts/new-account.ts Testes
$ deno run --allow-read --allow-net --no-check scripts/new-account.ts 'Hello "eooo"'

# Start the server
$ deployctl run --no-check --watch ./public/routes.ts

# Lint files
$ deno lint --unstable

# Add missing location data from stored IPs
$ deno run --allow-read --allow-net --allow-env --no-check scripts/fill-geo.ts

# Delete all data
$ deno run --allow-env --allow-net --allow-read scripts/wipe-data.ts
$ deno run --allow-env --allow-net --allow-read scripts/wipe-data.ts --delete
```
