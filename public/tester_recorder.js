// const events = []

const _addEventListener = EventTarget.prototype.addEventListener;
const _removeEventListener = EventTarget.prototype.removeEventListener;

EventTarget.prototype.addEventListener = function (type, fn, capture) {
  // this.f = f;
  // this.f(type, fn, capture);
  _addEventListener.apply(this, [].slice.call(arguments))
  // console.log("Added Event Listener: on" + type);
  console.log("Added Event Listener:", [type, this.tagName]);
};


EventTarget.prototype.removeEventListener = function (type, fn, options) {
  _removeEventListener.apply(this, [].slice.call(arguments))
  console.log("Remove Event Listener:", [type, this.tagName, options]);
}

function getCssSelector(domEl) {
  const names = [];
  let el = domEl;
  let cursorEl;
  let index;
  do {
    if (el.id) {
      names.unshift(`#${el.id}`);
      break;
    }
    index = 0;
    cursorEl = el;
    while (cursorEl !== null) {
      ++index;
      cursorEl = cursorEl.previousElementSibling;
    }
    names.unshift(`${el.tagName}:nth-child(${index})`);
    el = el.parentElement;
  } while (el !== null);
  return names.join(" > ");
}

function findEl(baseEl, tagName) {
  let el = baseEl;
  do {
    if (el.tagName === tagName) {
      break;
    }
    el = el.parentElement;
  } while (el !== null);
  return el;
}

function getAsButton(targetEl) {
  return findEl(targetEl, "BUTTON")
}

function getAsForm(targetEl) {
  return findEl(targetEl, "FORM")
}

const tempListeners = {
  blur: [],
};

function inputBlur() {
  this.removeEventListener("blur", inputBlur);
  tempListeners.blur.splice(tempListeners.blur.indexOf(getCssSelector(this)), 1);

  // document
  //   .querySelector("[qa-tag='login-email-address-btn']")
  //   .addEventListener("click", () => console.log("AAA"));
  // document
  //   .querySelector("[qa-tag='login-email-address-btn']")
  //   .addEventListener("click", () => console.log("BBB"));
  // document.querySelector("[qa-tag='login-email-address-btn']").onclick = () =>
  //   console.log("CCC");
}

// AJAX
// var origOpen = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function () {
//   console.log("request started!");
//   this.addEventListener("load", function () {
//     console.log("request completed!", this.responseURL);
//     // console.log(this.readyState); //will always be 4 (ajax is completed successfully)
//     // console.log(this.responseText); //whatever the response was
//   });
//   origOpen.apply(this, arguments);
// };

document.addEventListener("click", (e) => {
  const button = getAsButton(e.target);
  if (button !== null) {
    // console.log(listAllEventListeners())
    console.log("QQQ", getEventListeners(button));
    // console.log("evenenenenen", button["onclick"]())
    // console.log("HAAAAAA", [typeof button["onlick"], button["onclick"]])

    // for (const ev in button) {
    //   console.log("MAYEVENT", [ev, typeof button[ev], button[ev]]);
    //   if (
    //     button.hasOwnProperty(ev) &&
    //     (ev === "submit" || ev.startsWith("on"))
    //   ) {
    //     console.log("EVENTS", ev);
    //   }
    // }

    // const form = getAsForm(button)
    // if (form !== null) {
    //   console.log("FORM SUBMIT", typeof form.submit)
    //   // for (const ev in form) {
    //   //   // console.log("MAYEVENT", Object.getOwnPropertyNames(form))
    //   //   console.log("MAYEVENT", ev)
    //   // }

    // }
    // console.log(getCssSelector(button))
    // console.log("KICLOCK", getAsButton(e.target));
  }
  // console.log("CLICKPATH", e.target);
  // console.log("CLICKFFF", finder(e.target));

  // const selector = getCssSelector(e.target);

  // console.log(
  //   "CLICKFFF",
  //   [selector, document.querySelector(selector).value]
  //   // getCssSelector(e.target)
  //   // e.composedPath().map((p) => p)
  // );
  // // console.log("CLICKFFF", getElementFromPath(e.composedPath().map(t => t.``)));
  // // console.log("CLICKFFF", finder(e.target, { seedMinLength: e.composedPath().length }));

  // // console.log("%c KAJAIO loaded", "background: green; color: white;");
});

document.addEventListener("keydown", ({ target }) => {
  if (target.tagName === "INPUT") {
    const selector = getCssSelector(target);
    if (!tempListeners.blur.includes(selector)) {
      target.addEventListener("blur", inputBlur);
      tempListeners.blur.push(selector);
    }
  }
});
