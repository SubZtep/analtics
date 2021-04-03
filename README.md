# Analtics:godmode:

[![Netlify Status](https://api.netlify.com/api/v1/badges/37c894b5-d9b9-4897-92cf-2cd8b3c5be74/deploy-status)](https://app.netlify.com/sites/analtics/deploys)

Analytics service that tracks and reports website traffic. When someone opens the webpage, it calls a _serverless_ function that fetches visitor data from request headers and parameters and forwards it to _GraphQL_ for storing. **Free from _cookies_** and other evil stuff. Meant to be self-hosted.

## Why

There are plenty of analytics scripts but I couldn't find one so much basic that satisfies my simple needs.

From this point, it's easy to add any extra features, like event tracking or some kind of in-game analytics.

## Setup

This description should be enough to run the service. If something is not clear feel free to check the open source.

> The following module descriptions use [Netlify](https://www.netlify.com/) and [Fauna](https://fauna.com/) as an example. Both (in a sense) interchangeable, but these are **free services** on the entry-level and easy to set up.

### Database

All queries and mutations are written in GraphQL. Using Fauna flavour which is hopefully identical to any other implementation. Requests using the [node-fetch](https://github.com/node-fetch/node-fetch) library — the only production dependency.

All you need is set up a database and generate a _server key_. that works with _Bearer_ _Authorization_ header.

Import schema manually from this repository: [`scripts/schema.gql`](https://github.com/SubZtep/analtics/blob/main/scripts/schema.gql).

#### Account ID

For being able to use the same setup for multiple locations, create an account first with the following command and save the result id somewhere.

```sh
mutation {
   createAccount(data: {
      name: "YOUR_ACCOUNT_NAME"
   }) {
      _id
   }
}
```

### Backend

All you need is a lambda that authenticates the GraphQL request and does some basic data parsing. Deploy to _functions_ and add required [environment variables](https://app.netlify.com/sites/analtics/settings/deploys#environment).

| Variable       | Value                                                |
| -------------- | ---------------------------------------------------- |
| GRAPHQL_URL    | e.g. https://graphql.fauna.com/graphql               |
| GRAPHQL_SECRET | For `Authorization: Bearer ${GRAPHQL_SECRET}` header |

#### Embed Code

The goal is to call the lambda for somehow at every trackable page.
Replace the snippets with proper values.

| Snippet     | Example Value                                           |
| ----------- | ------------------------------------------------------- |
| TRACKER_URL | https://analtics.netlify.app/.netlify/functions/tracker |
| ACCOUNT_ID  | 234567890123456789                                      |

Add the following code to the `head` tag for all the data, earlier is better.

```html
<script type="text/javascript">
  ;(function (d) {
    var q = []
    q.push("account=ACCOUNT_ID")
    q.push("referrer=" + encodeURIComponent(d.referrer))
    q.push("location=" + encodeURIComponent(d.location))

    var a = d.createElement("script")
    a.type = "text/javascript"
    a.async = true
    a.src = "TRACKER_URL?" + q.join("&")
    var s = d.getElementsByTagName("script")[0]
    s.parentNode.insertBefore(a, s)
  })(document)
</script>
```

Use a minified version for production.

```
<script type="text/javascript">(function(d){var a=d.createElement("script");a.type="text/javascript";a.async=true;a.src="TRACKER_URL?account=ACCOUNT_I&referrer="+encodeURIComponent(d.referrer)+"&location="+encodeURIComponent(d.location);var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)})(document);</script>
```

In case of disabled _JavaScript_ the tracking is still available, straight into the top of the `body` tag.

```html
<noscript>
  <iframe
    src="TRACKER_URL?account=ACCOUNT_ID&noscript=true"
    width="0"
    height="0"
    style="display:none;visibility:hidden"
  />
</noscript>
```

Smaller is better here too.

```
<noscript><iframe src="TRACKER_URL?account=ACCOUNT_ID&noscript=true" width="0" height="0" style="display:none;visibility:hidden"/></noscript>
```

### Plugins

Good to generate tracking embeds. It's an on-going project, anything can change, make maintenance easier.

Only for [Vite](https://vitejs.dev/) at the moment: [plugins/vite.js](https://github.com/SubZtep/analtics/blob/main/plugins/vite.js).

Install: `npm i SubZtep/analtics#main`

## Local Scripts

Install the project on a terminal, add the previously described `GRAPHQL_URL` and `GRAPHQL_SECRET` variables to a new `.env` file. Run it with parameterized _npm_ like the following example.

```sh
$ npm run script -- scripts/visits.ts [ACCOUNT_ID]
```

---

> _#tba #wip_
>
> ## :construction: :earth_asia: :earth_africa: :earth_americas: :construction:

---
