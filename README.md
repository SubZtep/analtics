# Analytics :earth_americas::earth_africa::earth_asia::godmode:

Analytics service that track and report website traffic to GraphQL. Keep it simple.

[![Netlify Status](https://api.netlify.com/api/v1/badges/37c894b5-d9b9-4897-92cf-2cd8b3c5be74/deploy-status)](https://app.netlify.com/sites/analytics-lambda/deploys)

## Setup

[Netlify](https://www.netlify.com/) and [Fanua](https://fauna.com/) are interchangeable but untested. These are **free services** on the level of my needs and easy to set up.

### Netlify

1. Deploy (functions)
2. Add required [environment variables](https://app.netlify.com/sites/analytics-lambda/settings/deploys#environment):

    | Name           | Value                                             |
    | -------------- | ------------------------------------------------- |
    | GRAPHQL_URL    | e.g. https://graphql.fauna.com/graphql            |
    | GRAPHQL_SECRET | Server key for `Authorization: Bearer ...` header |

### FanuaDB

1. Setup database (help [here](https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/#2-set-up-faunadb) and [here](https://github.com/netlify/netlify-faunadb-example#readme))
2. Import schema from [`scripts/schema.gql`](https://github.com/SubZtep/analytics/blob/main/scripts/schema.gql)
2. Generate server key in _security_

### Your website

_TBA_
