import useragent from "https://cdn.skypack.dev/pin/useragent@v2.3.0-5VUbOLL3fzssUaZXQQrO/mode=imports,min/optimized/useragent.js?dts";

useragent();
console.log(
  useragent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_1) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.24 Safari/535.2",
  ),
);
