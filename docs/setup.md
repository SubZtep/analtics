# Self-Hosting Setup

I have it [live](https://analytics.demo.land) and it costs no money so far on my
level, this description should be enough to run your own service. Also it's the
doc for now. If something is not clear feel free to check the open source or
[raise a ticket](https://github.com/SubZtep/analtics/issues).

## Database

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

## Backend

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
