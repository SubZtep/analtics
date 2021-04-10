# Analtics 📊🦕

HTML embed code for public pages that log visits and selected events triggered
by visitors to [Fauna](https://fauna.com/) GraphQL via
[Deno Deploy](https://deno.com/deploy).

> :warning: **Work In Progress** — Let's change anything anytime anywhere ∑d(°∀°d)
>
> No Cookies ⊂(´• ω •`⊂)

[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)

## Why

There are plenty of free analytics scripts but I couldn't find one that just as
basic as satisfies my simple needs.

## Self-Hosting Setup

I have it [live](https://analytics.demo.land) and it costs no money so far on my
level, this description should be enough to run your own service. Also it's the
doc for now. If something is not clear feel free to check the open source or
[raise a ticket](https://github.com/SubZtep/analtics/issues).

### Database

Tested only and running on [Fauna](https://fauna.com/) which does its job quite
well, I can't compare. All queries and mutations are written in **GraphQL**.

1. Register.
2. Set up a database.
3. generate a _server key_ for _Bearer Authorization_ header.
4. Import schema from
   [`bin/schema.gql`](https://github.com/SubZtep/analtics/blob/main/bin/schema.gql).

| Type    | Description                                        |
| ------- | -------------------------------------------------- |
| Account | Owner of an embed code for website (You).          |
| Visit   | Ideally one entry is one user session.             |
| Geo     | Visitor location data populated by a local script. |
| Event   | On/off for now.                                    |
| Feature | Screen data for now.                               |

### Backend

Tested only and running on [Deno Deploy](https://deno.com/deploy). Started as
~~Netlify lambda~~ but **Deno** is much more cool, it's like _NodeJS_ without
the experience.

1. Register.
2. Add
   [`public/routes.ts`](https://github.com/SubZtep/analtics/blob/main/public/routes)
   as entry point.
3. Set some environment variables.

| Variable       | Value                             |
| -------------- | --------------------------------- |
| GRAPHQL_URL    | https://graphql.fauna.com/graphql |
| GRAPHQL_SECRET | Server key from above.            |
| ACCOUNT        | Generated GraphQL ID.             |

## Embed Code

Add to the following HTML snippet to the `head` tag, change url and ID where
necessary.

<!-- prettier ignore -->

```html
<script type="text/javascript" src="https://analtics.demo.land/tracker/000000000000000001" defer></script>
<noscript><iframe src="https://analtics.demo.land/tracker/000000000000000001/noscript" width="0" height="0" style="display:none;visibility:hidden" /></noscript>
```

## Plugins

Good to generate tracking embeds, make maintenance easier.

Only for [Vite](https://vitejs.dev/) atm
[plugins/vite.js](https://github.com/SubZtep/analtics/blob/main/plugins/vite.js)
and it might be broken but planning for _WordPress_ as well.

## Local Scripts

Mostly helpers during development. Had to add `--no-check` for a dependency. For
IP to location
[download](https://www.maxmind.com/en/accounts/529567/geoip/downloads) database
to `bin/GeoLite2-City.mmdb`.

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

Install script runner

```sh
$ deno install -qA -n vr https://deno.land/x/velociraptor@1.0.0-beta.18/cli.ts
```

## Links for good

- [Google Analytics uses gif get request why not post
  request?](https://stackoverflow.com/a/30433304/1398275)
- [HTTP Cache Headers - A Complete Guide](https://www.keycdn.com/blog/http-cache-headers)
- [Sending Data to Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits)
- [Beaconing In Practice](https://calendar.perfplanet.com/2020/beaconing-in-practice/)
- [Tracking Protection](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Privacy/Tracking_Protection)
- [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)

# License

Unlicense :trollface:
