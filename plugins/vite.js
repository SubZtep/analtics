/**
 * @param {{tracker: string, account: string, productionOnly?: boolean}} obj Plugin options
 */
exports.default = ({ tracker, account, productionOnly }) => ({
  name: "analytics",
  transformIndexHtml(html) {
    if (productionOnly && process.env.NODE_ENV === "development") {
      return html
    }

    const h = `<script async src="${tracker}?account=${account}"></script>`
    let b =
      `<noscript><iframe src="${tracker}?account=${account}&noscript=true "` +
      `height="0" width="0" style="display:none;visibility:hidden"/></noscript>`

    let pos = html.search(/<\/head>/i)
    if (pos !== -1) {
      html = html.slice(0, pos) + h + html.slice(pos)
    } else {
      b = h + b
    }

    const body = html.match(/<body.*?>/i)
    if (body !== null) {
      pos = body.index + body[0].length
    } else {
      pos = html.search(/<\/body>/i)
      if (pos === -1) {
        pos = html.length
      }
    }
    return html.slice(0, pos) + b + html.slice(pos)
  },
})
