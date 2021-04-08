import { h } from "https://deno.land/x/sift@0.2.0/mod.ts"

export default account => (
  <div>
    Test page with embed
    <script type="text/javascript" src={`/tracker/${account}`} defer></script>
    <noscript>
      <iframe src={`/tracker/${account}/noscript`} width="0" height="0" style="display:none;visibility:hidden" />
    </noscript>
  </div>
)
