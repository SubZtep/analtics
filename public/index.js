addEventListener("fetch", event => {
  const response = new Response(
    `
                         _
        .-.          .-"' \`".
       :  .^._     .'        .
       "> I   +.-. : ,-.     :
       :  "."  I  "+ ._:     '
       |" "   .^.  I         .
       '.       "   \`-:     /
        \`-.     +        _.'
           \`-._     _.-='\`  zi.
                \`'\`
  `,
    {
      headers: { "content-type": "text/plain" },
    }
  )
  event.respondWith(response)
})
