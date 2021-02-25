var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true})), module2);
};

// node_modules/data-uri-to-buffer/dist/src/index.js
var require_src = __commonJS((exports2, module2) => {
  "use strict";
  function dataUriToBuffer(uri) {
    if (!/^data:/i.test(uri)) {
      throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
    }
    uri = uri.replace(/\r?\n/g, "");
    const firstComma = uri.indexOf(",");
    if (firstComma === -1 || firstComma <= 4) {
      throw new TypeError("malformed data: URI");
    }
    const meta = uri.substring(5, firstComma).split(";");
    let charset = "";
    let base64 = false;
    const type = meta[0] || "text/plain";
    let typeFull = type;
    for (let i = 1; i < meta.length; i++) {
      if (meta[i] === "base64") {
        base64 = true;
      } else {
        typeFull += `;${meta[i]}`;
        if (meta[i].indexOf("charset=") === 0) {
          charset = meta[i].substring(8);
        }
      }
    }
    if (!meta[0] && !charset.length) {
      typeFull += ";charset=US-ASCII";
      charset = "US-ASCII";
    }
    const encoding = base64 ? "base64" : "ascii";
    const data = unescape(uri.substring(firstComma + 1));
    const buffer = Buffer.from(data, encoding);
    buffer.type = type;
    buffer.typeFull = typeFull;
    buffer.charset = charset;
    return buffer;
  }
  module2.exports = dataUriToBuffer;
});

// node_modules/fetch-blob/index.js
var require_fetch_blob = __commonJS((exports2, module2) => {
  var {Readable} = require("stream");
  var wm = new WeakMap();
  async function* read(parts) {
    for (const part of parts) {
      if ("stream" in part) {
        yield* part.stream();
      } else {
        yield part;
      }
    }
  }
  var Blob = class {
    constructor(blobParts = [], options = {type: ""}) {
      let size = 0;
      const parts = blobParts.map((element) => {
        let buffer;
        if (element instanceof Buffer) {
          buffer = element;
        } else if (ArrayBuffer.isView(element)) {
          buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
        } else if (element instanceof ArrayBuffer) {
          buffer = Buffer.from(element);
        } else if (element instanceof Blob) {
          buffer = element;
        } else {
          buffer = Buffer.from(typeof element === "string" ? element : String(element));
        }
        size += buffer.length || buffer.size || 0;
        return buffer;
      });
      const type = options.type === void 0 ? "" : String(options.type).toLowerCase();
      wm.set(this, {
        type: /[^\u0020-\u007E]/.test(type) ? "" : type,
        size,
        parts
      });
    }
    get size() {
      return wm.get(this).size;
    }
    get type() {
      return wm.get(this).type;
    }
    async text() {
      return Buffer.from(await this.arrayBuffer()).toString();
    }
    async arrayBuffer() {
      const data = new Uint8Array(this.size);
      let offset = 0;
      for await (const chunk of this.stream()) {
        data.set(chunk, offset);
        offset += chunk.length;
      }
      return data.buffer;
    }
    stream() {
      return Readable.from(read(wm.get(this).parts));
    }
    slice(start = 0, end = this.size, type = "") {
      const {size} = this;
      let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
      let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
      const span = Math.max(relativeEnd - relativeStart, 0);
      const parts = wm.get(this).parts.values();
      const blobParts = [];
      let added = 0;
      for (const part of parts) {
        const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
        if (relativeStart && size2 <= relativeStart) {
          relativeStart -= size2;
          relativeEnd -= size2;
        } else {
          const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
          blobParts.push(chunk);
          added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
          relativeStart = 0;
          if (added >= span) {
            break;
          }
        }
      }
      const blob = new Blob([], {type});
      Object.assign(wm.get(blob), {size: span, parts: blobParts});
      return blob;
    }
    get [Symbol.toStringTag]() {
      return "Blob";
    }
    static [Symbol.hasInstance](object) {
      return typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
    }
  };
  Object.defineProperties(Blob.prototype, {
    size: {enumerable: true},
    type: {enumerable: true},
    slice: {enumerable: true}
  });
  module2.exports = Blob;
});

// node_modules/node-fetch/dist/index.cjs
var require_dist = __commonJS((exports2, module2) => {
  "use strict";
  exports2 = module2.exports = fetch2;
  var http = require("http");
  var https = require("https");
  var zlib = require("zlib");
  var Stream = require("stream");
  var dataUriToBuffer = require_src();
  var util = require("util");
  var Blob = require_fetch_blob();
  var crypto = require("crypto");
  var url = require("url");
  var FetchBaseError = class extends Error {
    constructor(message, type) {
      super(message);
      Error.captureStackTrace(this, this.constructor);
      this.type = type;
    }
    get name() {
      return this.constructor.name;
    }
    get [Symbol.toStringTag]() {
      return this.constructor.name;
    }
  };
  var FetchError = class extends FetchBaseError {
    constructor(message, type, systemError) {
      super(message, type);
      if (systemError) {
        this.code = this.errno = systemError.code;
        this.erroredSysCall = systemError.syscall;
      }
    }
  };
  var NAME = Symbol.toStringTag;
  var isURLSearchParameters = (object) => {
    return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
  };
  var isBlob = (object) => {
    return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
  };
  function isFormData(object) {
    return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
  }
  var isAbortSignal = (object) => {
    return typeof object === "object" && object[NAME] === "AbortSignal";
  };
  var carriage = "\r\n";
  var dashes = "-".repeat(2);
  var carriageLength = Buffer.byteLength(carriage);
  var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
  function getHeader(boundary, name, field) {
    let header = "";
    header += `${dashes}${boundary}${carriage}`;
    header += `Content-Disposition: form-data; name="${name}"`;
    if (isBlob(field)) {
      header += `; filename="${field.name}"${carriage}`;
      header += `Content-Type: ${field.type || "application/octet-stream"}`;
    }
    return `${header}${carriage.repeat(2)}`;
  }
  var getBoundary = () => crypto.randomBytes(8).toString("hex");
  async function* formDataIterator(form, boundary) {
    for (const [name, value] of form) {
      yield getHeader(boundary, name, value);
      if (isBlob(value)) {
        yield* value.stream();
      } else {
        yield value;
      }
      yield carriage;
    }
    yield getFooter(boundary);
  }
  function getFormDataLength(form, boundary) {
    let length = 0;
    for (const [name, value] of form) {
      length += Buffer.byteLength(getHeader(boundary, name, value));
      if (isBlob(value)) {
        length += value.size;
      } else {
        length += Buffer.byteLength(String(value));
      }
      length += carriageLength;
    }
    length += Buffer.byteLength(getFooter(boundary));
    return length;
  }
  var INTERNALS = Symbol("Body internals");
  var Body = class {
    constructor(body, {
      size = 0
    } = {}) {
      let boundary = null;
      if (body === null) {
        body = null;
      } else if (isURLSearchParameters(body)) {
        body = Buffer.from(body.toString());
      } else if (isBlob(body))
        ;
      else if (Buffer.isBuffer(body))
        ;
      else if (util.types.isAnyArrayBuffer(body)) {
        body = Buffer.from(body);
      } else if (ArrayBuffer.isView(body)) {
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      } else if (body instanceof Stream)
        ;
      else if (isFormData(body)) {
        boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
        body = Stream.Readable.from(formDataIterator(body, boundary));
      } else {
        body = Buffer.from(String(body));
      }
      this[INTERNALS] = {
        body,
        boundary,
        disturbed: false,
        error: null
      };
      this.size = size;
      if (body instanceof Stream) {
        body.on("error", (err) => {
          const error = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
          this[INTERNALS].error = error;
        });
      }
    }
    get body() {
      return this[INTERNALS].body;
    }
    get bodyUsed() {
      return this[INTERNALS].disturbed;
    }
    async arrayBuffer() {
      const {buffer, byteOffset, byteLength} = await consumeBody(this);
      return buffer.slice(byteOffset, byteOffset + byteLength);
    }
    async blob() {
      const ct = this.headers && this.headers.get("content-type") || this[INTERNALS].body && this[INTERNALS].body.type || "";
      const buf = await this.buffer();
      return new Blob([buf], {
        type: ct
      });
    }
    async json() {
      const buffer = await consumeBody(this);
      return JSON.parse(buffer.toString());
    }
    async text() {
      const buffer = await consumeBody(this);
      return buffer.toString();
    }
    buffer() {
      return consumeBody(this);
    }
  };
  Object.defineProperties(Body.prototype, {
    body: {enumerable: true},
    bodyUsed: {enumerable: true},
    arrayBuffer: {enumerable: true},
    blob: {enumerable: true},
    json: {enumerable: true},
    text: {enumerable: true}
  });
  async function consumeBody(data) {
    if (data[INTERNALS].disturbed) {
      throw new TypeError(`body used already for: ${data.url}`);
    }
    data[INTERNALS].disturbed = true;
    if (data[INTERNALS].error) {
      throw data[INTERNALS].error;
    }
    let {body} = data;
    if (body === null) {
      return Buffer.alloc(0);
    }
    if (isBlob(body)) {
      body = body.stream();
    }
    if (Buffer.isBuffer(body)) {
      return body;
    }
    if (!(body instanceof Stream)) {
      return Buffer.alloc(0);
    }
    const accum = [];
    let accumBytes = 0;
    try {
      for await (const chunk of body) {
        if (data.size > 0 && accumBytes + chunk.length > data.size) {
          const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
          body.destroy(err);
          throw err;
        }
        accumBytes += chunk.length;
        accum.push(chunk);
      }
    } catch (error) {
      if (error instanceof FetchBaseError) {
        throw error;
      } else {
        throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error.message}`, "system", error);
      }
    }
    if (body.readableEnded === true || body._readableState.ended === true) {
      try {
        if (accum.every((c) => typeof c === "string")) {
          return Buffer.from(accum.join(""));
        }
        return Buffer.concat(accum, accumBytes);
      } catch (error) {
        throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error.message}`, "system", error);
      }
    } else {
      throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
    }
  }
  var clone = (instance, highWaterMark) => {
    let p1;
    let p2;
    let {body} = instance;
    if (instance.bodyUsed) {
      throw new Error("cannot clone body after it is used");
    }
    if (body instanceof Stream && typeof body.getBoundary !== "function") {
      p1 = new Stream.PassThrough({highWaterMark});
      p2 = new Stream.PassThrough({highWaterMark});
      body.pipe(p1);
      body.pipe(p2);
      instance[INTERNALS].body = p1;
      body = p2;
    }
    return body;
  };
  var extractContentType = (body, request) => {
    if (body === null) {
      return null;
    }
    if (typeof body === "string") {
      return "text/plain;charset=UTF-8";
    }
    if (isURLSearchParameters(body)) {
      return "application/x-www-form-urlencoded;charset=UTF-8";
    }
    if (isBlob(body)) {
      return body.type || null;
    }
    if (Buffer.isBuffer(body) || util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
      return null;
    }
    if (body && typeof body.getBoundary === "function") {
      return `multipart/form-data;boundary=${body.getBoundary()}`;
    }
    if (isFormData(body)) {
      return `multipart/form-data; boundary=${request[INTERNALS].boundary}`;
    }
    if (body instanceof Stream) {
      return null;
    }
    return "text/plain;charset=UTF-8";
  };
  var getTotalBytes = (request) => {
    const {body} = request;
    if (body === null) {
      return 0;
    }
    if (isBlob(body)) {
      return body.size;
    }
    if (Buffer.isBuffer(body)) {
      return body.length;
    }
    if (body && typeof body.getLengthSync === "function") {
      return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
    }
    if (isFormData(body)) {
      return getFormDataLength(request[INTERNALS].boundary);
    }
    return null;
  };
  var writeToStream = (dest, {body}) => {
    if (body === null) {
      dest.end();
    } else if (isBlob(body)) {
      body.stream().pipe(dest);
    } else if (Buffer.isBuffer(body)) {
      dest.write(body);
      dest.end();
    } else {
      body.pipe(dest);
    }
  };
  var validateHeaderName = typeof http.validateHeaderName === "function" ? http.validateHeaderName : (name) => {
    if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
      const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
      Object.defineProperty(err, "code", {value: "ERR_INVALID_HTTP_TOKEN"});
      throw err;
    }
  };
  var validateHeaderValue = typeof http.validateHeaderValue === "function" ? http.validateHeaderValue : (name, value) => {
    if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
      const err = new TypeError(`Invalid character in header content ["${name}"]`);
      Object.defineProperty(err, "code", {value: "ERR_INVALID_CHAR"});
      throw err;
    }
  };
  var Headers = class extends URLSearchParams {
    constructor(init) {
      let result = [];
      if (init instanceof Headers) {
        const raw = init.raw();
        for (const [name, values] of Object.entries(raw)) {
          result.push(...values.map((value) => [name, value]));
        }
      } else if (init == null)
        ;
      else if (typeof init === "object" && !util.types.isBoxedPrimitive(init)) {
        const method = init[Symbol.iterator];
        if (method == null) {
          result.push(...Object.entries(init));
        } else {
          if (typeof method !== "function") {
            throw new TypeError("Header pairs must be iterable");
          }
          result = [...init].map((pair) => {
            if (typeof pair !== "object" || util.types.isBoxedPrimitive(pair)) {
              throw new TypeError("Each header pair must be an iterable object");
            }
            return [...pair];
          }).map((pair) => {
            if (pair.length !== 2) {
              throw new TypeError("Each header pair must be a name/value tuple");
            }
            return [...pair];
          });
        }
      } else {
        throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
      }
      result = result.length > 0 ? result.map(([name, value]) => {
        validateHeaderName(name);
        validateHeaderValue(name, String(value));
        return [String(name).toLowerCase(), String(value)];
      }) : void 0;
      super(result);
      return new Proxy(this, {
        get(target, p, receiver) {
          switch (p) {
            case "append":
            case "set":
              return (name, value) => {
                validateHeaderName(name);
                validateHeaderValue(name, String(value));
                return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
              };
            case "delete":
            case "has":
            case "getAll":
              return (name) => {
                validateHeaderName(name);
                return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
              };
            case "keys":
              return () => {
                target.sort();
                return new Set(URLSearchParams.prototype.keys.call(target)).keys();
              };
            default:
              return Reflect.get(target, p, receiver);
          }
        }
      });
    }
    get [Symbol.toStringTag]() {
      return this.constructor.name;
    }
    toString() {
      return Object.prototype.toString.call(this);
    }
    get(name) {
      const values = this.getAll(name);
      if (values.length === 0) {
        return null;
      }
      let value = values.join(", ");
      if (/^content-encoding$/i.test(name)) {
        value = value.toLowerCase();
      }
      return value;
    }
    forEach(callback) {
      for (const name of this.keys()) {
        callback(this.get(name), name);
      }
    }
    *values() {
      for (const name of this.keys()) {
        yield this.get(name);
      }
    }
    *entries() {
      for (const name of this.keys()) {
        yield [name, this.get(name)];
      }
    }
    [Symbol.iterator]() {
      return this.entries();
    }
    raw() {
      return [...this.keys()].reduce((result, key) => {
        result[key] = this.getAll(key);
        return result;
      }, {});
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return [...this.keys()].reduce((result, key) => {
        const values = this.getAll(key);
        if (key === "host") {
          result[key] = values[0];
        } else {
          result[key] = values.length > 1 ? values : values[0];
        }
        return result;
      }, {});
    }
  };
  Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
    result[property] = {enumerable: true};
    return result;
  }, {}));
  function fromRawHeaders(headers = []) {
    return new Headers(headers.reduce((result, value, index, array) => {
      if (index % 2 === 0) {
        result.push(array.slice(index, index + 2));
      }
      return result;
    }, []).filter(([name, value]) => {
      try {
        validateHeaderName(name);
        validateHeaderValue(name, String(value));
        return true;
      } catch {
        return false;
      }
    }));
  }
  var redirectStatus = new Set([301, 302, 303, 307, 308]);
  var isRedirect = (code) => {
    return redirectStatus.has(code);
  };
  var INTERNALS$1 = Symbol("Response internals");
  var Response = class extends Body {
    constructor(body = null, options = {}) {
      super(body, options);
      const status = options.status || 200;
      const headers = new Headers(options.headers);
      if (body !== null && !headers.has("Content-Type")) {
        const contentType = extractContentType(body);
        if (contentType) {
          headers.append("Content-Type", contentType);
        }
      }
      this[INTERNALS$1] = {
        url: options.url,
        status,
        statusText: options.statusText || "",
        headers,
        counter: options.counter,
        highWaterMark: options.highWaterMark
      };
    }
    get url() {
      return this[INTERNALS$1].url || "";
    }
    get status() {
      return this[INTERNALS$1].status;
    }
    get ok() {
      return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
    }
    get redirected() {
      return this[INTERNALS$1].counter > 0;
    }
    get statusText() {
      return this[INTERNALS$1].statusText;
    }
    get headers() {
      return this[INTERNALS$1].headers;
    }
    get highWaterMark() {
      return this[INTERNALS$1].highWaterMark;
    }
    clone() {
      return new Response(clone(this, this.highWaterMark), {
        url: this.url,
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        ok: this.ok,
        redirected: this.redirected,
        size: this.size
      });
    }
    static redirect(url2, status = 302) {
      if (!isRedirect(status)) {
        throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
      }
      return new Response(null, {
        headers: {
          location: new URL(url2).toString()
        },
        status
      });
    }
    get [Symbol.toStringTag]() {
      return "Response";
    }
  };
  Object.defineProperties(Response.prototype, {
    url: {enumerable: true},
    status: {enumerable: true},
    ok: {enumerable: true},
    redirected: {enumerable: true},
    statusText: {enumerable: true},
    headers: {enumerable: true},
    clone: {enumerable: true}
  });
  var getSearch = (parsedURL) => {
    if (parsedURL.search) {
      return parsedURL.search;
    }
    const lastOffset = parsedURL.href.length - 1;
    const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
    return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
  };
  var INTERNALS$2 = Symbol("Request internals");
  var isRequest = (object) => {
    return typeof object === "object" && typeof object[INTERNALS$2] === "object";
  };
  var Request = class extends Body {
    constructor(input, init = {}) {
      let parsedURL;
      if (isRequest(input)) {
        parsedURL = new URL(input.url);
      } else {
        parsedURL = new URL(input);
        input = {};
      }
      let method = init.method || input.method || "GET";
      method = method.toUpperCase();
      if ((init.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
        throw new TypeError("Request with GET/HEAD method cannot have body");
      }
      const inputBody = init.body ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
      super(inputBody, {
        size: init.size || input.size || 0
      });
      const headers = new Headers(init.headers || input.headers || {});
      if (inputBody !== null && !headers.has("Content-Type")) {
        const contentType = extractContentType(inputBody, this);
        if (contentType) {
          headers.append("Content-Type", contentType);
        }
      }
      let signal = isRequest(input) ? input.signal : null;
      if ("signal" in init) {
        signal = init.signal;
      }
      if (signal !== null && !isAbortSignal(signal)) {
        throw new TypeError("Expected signal to be an instanceof AbortSignal");
      }
      this[INTERNALS$2] = {
        method,
        redirect: init.redirect || input.redirect || "follow",
        headers,
        parsedURL,
        signal
      };
      this.follow = init.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init.follow;
      this.compress = init.compress === void 0 ? input.compress === void 0 ? true : input.compress : init.compress;
      this.counter = init.counter || input.counter || 0;
      this.agent = init.agent || input.agent;
      this.highWaterMark = init.highWaterMark || input.highWaterMark || 16384;
      this.insecureHTTPParser = init.insecureHTTPParser || input.insecureHTTPParser || false;
    }
    get method() {
      return this[INTERNALS$2].method;
    }
    get url() {
      return url.format(this[INTERNALS$2].parsedURL);
    }
    get headers() {
      return this[INTERNALS$2].headers;
    }
    get redirect() {
      return this[INTERNALS$2].redirect;
    }
    get signal() {
      return this[INTERNALS$2].signal;
    }
    clone() {
      return new Request(this);
    }
    get [Symbol.toStringTag]() {
      return "Request";
    }
  };
  Object.defineProperties(Request.prototype, {
    method: {enumerable: true},
    url: {enumerable: true},
    headers: {enumerable: true},
    redirect: {enumerable: true},
    clone: {enumerable: true},
    signal: {enumerable: true}
  });
  var getNodeRequestOptions = (request) => {
    const {parsedURL} = request[INTERNALS$2];
    const headers = new Headers(request[INTERNALS$2].headers);
    if (!headers.has("Accept")) {
      headers.set("Accept", "*/*");
    }
    let contentLengthValue = null;
    if (request.body === null && /^(post|put)$/i.test(request.method)) {
      contentLengthValue = "0";
    }
    if (request.body !== null) {
      const totalBytes = getTotalBytes(request);
      if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
        contentLengthValue = String(totalBytes);
      }
    }
    if (contentLengthValue) {
      headers.set("Content-Length", contentLengthValue);
    }
    if (!headers.has("User-Agent")) {
      headers.set("User-Agent", "node-fetch");
    }
    if (request.compress && !headers.has("Accept-Encoding")) {
      headers.set("Accept-Encoding", "gzip,deflate,br");
    }
    let {agent} = request;
    if (typeof agent === "function") {
      agent = agent(parsedURL);
    }
    if (!headers.has("Connection") && !agent) {
      headers.set("Connection", "close");
    }
    const search = getSearch(parsedURL);
    const requestOptions = {
      path: parsedURL.pathname + search,
      pathname: parsedURL.pathname,
      hostname: parsedURL.hostname,
      protocol: parsedURL.protocol,
      port: parsedURL.port,
      hash: parsedURL.hash,
      search: parsedURL.search,
      query: parsedURL.query,
      href: parsedURL.href,
      method: request.method,
      headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
      insecureHTTPParser: request.insecureHTTPParser,
      agent
    };
    return requestOptions;
  };
  var AbortError = class extends FetchBaseError {
    constructor(message, type = "aborted") {
      super(message, type);
    }
  };
  var supportedSchemas = new Set(["data:", "http:", "https:"]);
  async function fetch2(url2, options_) {
    return new Promise((resolve, reject) => {
      const request = new Request(url2, options_);
      const options = getNodeRequestOptions(request);
      if (!supportedSchemas.has(options.protocol)) {
        throw new TypeError(`node-fetch cannot load ${url2}. URL scheme "${options.protocol.replace(/:$/, "")}" is not supported.`);
      }
      if (options.protocol === "data:") {
        const data = dataUriToBuffer(request.url);
        const response2 = new Response(data, {headers: {"Content-Type": data.typeFull}});
        resolve(response2);
        return;
      }
      const send = (options.protocol === "https:" ? https : http).request;
      const {signal} = request;
      let response = null;
      const abort = () => {
        const error = new AbortError("The operation was aborted.");
        reject(error);
        if (request.body && request.body instanceof Stream.Readable) {
          request.body.destroy(error);
        }
        if (!response || !response.body) {
          return;
        }
        response.body.emit("error", error);
      };
      if (signal && signal.aborted) {
        abort();
        return;
      }
      const abortAndFinalize = () => {
        abort();
        finalize();
      };
      const request_ = send(options);
      if (signal) {
        signal.addEventListener("abort", abortAndFinalize);
      }
      const finalize = () => {
        request_.abort();
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      };
      request_.on("error", (err) => {
        reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
        finalize();
      });
      request_.on("response", (response_) => {
        request_.setTimeout(0);
        const headers = fromRawHeaders(response_.rawHeaders);
        if (isRedirect(response_.statusCode)) {
          const location = headers.get("Location");
          const locationURL = location === null ? null : new URL(location, request.url);
          switch (request.redirect) {
            case "error":
              reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
              finalize();
              return;
            case "manual":
              if (locationURL !== null) {
                try {
                  headers.set("Location", locationURL);
                } catch (error) {
                  reject(error);
                }
              }
              break;
            case "follow": {
              if (locationURL === null) {
                break;
              }
              if (request.counter >= request.follow) {
                reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                finalize();
                return;
              }
              const requestOptions = {
                headers: new Headers(request.headers),
                follow: request.follow,
                counter: request.counter + 1,
                agent: request.agent,
                compress: request.compress,
                method: request.method,
                body: request.body,
                signal: request.signal,
                size: request.size
              };
              if (response_.statusCode !== 303 && request.body && options_.body instanceof Stream.Readable) {
                reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                finalize();
                return;
              }
              if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
                requestOptions.method = "GET";
                requestOptions.body = void 0;
                requestOptions.headers.delete("content-length");
              }
              resolve(fetch2(new Request(locationURL, requestOptions)));
              finalize();
              return;
            }
          }
        }
        response_.once("end", () => {
          if (signal) {
            signal.removeEventListener("abort", abortAndFinalize);
          }
        });
        let body = Stream.pipeline(response_, new Stream.PassThrough(), (error) => {
          reject(error);
        });
        if (process.version < "v12.10") {
          response_.on("aborted", abortAndFinalize);
        }
        const responseOptions = {
          url: request.url,
          status: response_.statusCode,
          statusText: response_.statusMessage,
          headers,
          size: request.size,
          counter: request.counter,
          highWaterMark: request.highWaterMark
        };
        const codings = headers.get("Content-Encoding");
        if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
          response = new Response(body, responseOptions);
          resolve(response);
          return;
        }
        const zlibOptions = {
          flush: zlib.Z_SYNC_FLUSH,
          finishFlush: zlib.Z_SYNC_FLUSH
        };
        if (codings === "gzip" || codings === "x-gzip") {
          body = Stream.pipeline(body, zlib.createGunzip(zlibOptions), (error) => {
            reject(error);
          });
          response = new Response(body, responseOptions);
          resolve(response);
          return;
        }
        if (codings === "deflate" || codings === "x-deflate") {
          const raw = Stream.pipeline(response_, new Stream.PassThrough(), (error) => {
            reject(error);
          });
          raw.once("data", (chunk) => {
            if ((chunk[0] & 15) === 8) {
              body = Stream.pipeline(body, zlib.createInflate(), (error) => {
                reject(error);
              });
            } else {
              body = Stream.pipeline(body, zlib.createInflateRaw(), (error) => {
                reject(error);
              });
            }
            response = new Response(body, responseOptions);
            resolve(response);
          });
          return;
        }
        if (codings === "br") {
          body = Stream.pipeline(body, zlib.createBrotliDecompress(), (error) => {
            reject(error);
          });
          response = new Response(body, responseOptions);
          resolve(response);
          return;
        }
        response = new Response(body, responseOptions);
        resolve(response);
      });
      writeToStream(request_, request);
    });
  }
  exports2.AbortError = AbortError;
  exports2.FetchError = FetchError;
  exports2.Headers = Headers;
  exports2.Request = Request;
  exports2.Response = Response;
  exports2.default = fetch2;
  exports2.isRedirect = isRedirect;
});

// lambda/tracker.ts
var import_node_fetch = __toModule(require_dist());
var gql = (url) => async (mutation) => {
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GRAPHQL_SECRET}`
    },
    body: JSON.stringify({query: mutation})
  };
  const res = await import_node_fetch.default(url, opts);
  return await res.json();
};
var createVisit = (event) => `mutation {
  createVisit(data: {
    ip: "${event.headers["client-ip"]}"
    userAgent: "${event.headers["user-agent"]}",
    created: "${new Date().toISOString()}",
    account: {
      connect: "${event.queryStringParameters.account}"
    }
  }) {
   _id
 }
}`;
exports.handler = async (event) => {
  let statusCode = 200;
  const res = await gql(process.env.GRAPHQL_URL)(createVisit(event));
  console.log(res);
  return {
    statusCode
  };
};
