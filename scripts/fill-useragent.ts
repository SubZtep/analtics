// import useragent from "https://cdn.skypack.dev/pin/useragent@v2.3.0-5VUbOLL3fzssUaZXQQrO/mode=imports,min/optimized/useragent.js?dts";

import uaParserJs from 'https://cdn.skypack.dev/ua-parser-js';

const ua = new uaParserJs()
// ua.setUA("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_1) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.24 Safari/535.2")
// ua.setUA("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0")
// ua.setUA("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 OPR/73.0.3856.434")
ua.setUA("Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3 ")

console.log(ua.getResult())

// useragent();
// console.log(
//   useragent(
//     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_1) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.24 Safari/535.2",
//   ),
// );
