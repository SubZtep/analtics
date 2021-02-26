# Analtics:godmode:

Analytics service that track and report website traffic to GraphQL. Keep it simple.

> :construction: On-Going
>
> [![Netlify Status](https://api.netlify.com/api/v1/badges/37c894b5-d9b9-4897-92cf-2cd8b3c5be74/deploy-status)](https://app.netlify.com/sites/analtics/deploys)

## Setup

[Netlify](https://www.netlify.com/) and [Fanua](https://fauna.com/) are interchangeable but untested. These are **free services** on the level of my current needs and easy to set up.

### Netlify

1. Deploy (functions)
2. Add required [environment variables](https://app.netlify.com/sites/analtics/settings/deploys#environment)

   | Name           | Value                                                |
   | -------------- | ---------------------------------------------------- |
   | GRAPHQL_URL    | e.g. https://graphql.fauna.com/graphql               |
   | GRAPHQL_SECRET | For `Authorization: Bearer ${GRAPHQL_SECRET}` header |

### Fanua

1. Setup database (help [here](https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/#2-set-up-faunadb) and [here](https://github.com/netlify/netlify-faunadb-example#readme))
2. Import schema from [`scripts/schema.gql`](https://github.com/SubZtep/analtics/blob/main/scripts/schema.gql)
3. Generate server key in _security_

### Account ID

1. Run this query below and receive your ID
   ```sh
   mutation {
     createAccount(data: {
       name: "YOUR_ACCOUNT_NAME"
     }) {
       _id
     }
   }
   ```
2. Save it somewhere

## Embed Tracking

| Variable    | Example                                                         |
| ----------- | --------------------------------------------------------------- |
| TRACKER_URL | https://analtics.netlify.app/.netlify/functions/tracker |
| ACCOUNT_ID  | 234567890123456789                                              |

1. To somewhere to the top of `head` tag
   ```html
   <script async src="TRACKER_URL?account=ACCOUNT_ID"></script>
   ```
2. To top of `body` tag, in case of JavaScript disabled
   ```html
   <noscript><iframe src="TRACKER_URL?account=ACCOUNT_ID&noscript=true" width="0" height="0" style="display:none;visibility:hidden"/></noscript>
   ```

## Plugins

To generate tracking embeds.

### Vite

[plugins/vite.js](https://github.com/SubZtep/analtics/blob/main/plugins/vite.js)

---

## :earth_asia: :curly_loop: :earth_africa: :curly_loop: :earth_americas:
