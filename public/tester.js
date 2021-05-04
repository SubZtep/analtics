console.log(
  "%c KAJAIO %c𝛂%c🐛",
  "background-color: #107c10; color: #ffc83d;",
  "background-color: #107c10; color: #f03a17;",
  "background-color: transparent;"
);

// AJAX
var origOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
  console.log("request started!");
  this.addEventListener("load", function () {
    console.log("request completed!", this.responseURL);
    // console.log(this.readyState); //will always be 4 (ajax is completed successfully)
    // console.log(this.responseText); //whatever the response was
  });
  origOpen.apply(this, arguments);
};

// function getElementFromPath(path) {
//   console.log(path)
//   // while (path.length > 0) {
//   //   console.log
//   // }
// }
function getCssSelector(el) {
  names = [];
  do {
    index = 0;
    let cursorElement = el;
    while (cursorElement !== null) {
      ++index;
      cursorElement = cursorElement.previousElementSibling;
    }
    names.unshift(el.tagName + ":nth-child(" + index + ")");
    el = el.parentElement;
  } while (el !== null);

  return names.join(" > ");
}

document.addEventListener("click", (e) => {
  console.log("KICLOCK", e);
  // console.log("CLICKPATH", e.target);
  // console.log("CLICKFFF", finder(e.target));

  const selector = getCssSelector(e.target);

  console.log(
    "CLICKFFF",
    document.querySelector(selector).value
    // getCssSelector(e.target)
    // e.composedPath().map((p) => p)
  );
  // console.log("CLICKFFF", getElementFromPath(e.composedPath().map(t => t.``)));
  // console.log("CLICKFFF", finder(e.target, { seedMinLength: e.composedPath().length }));

  // console.log("%c KAJAIO loaded", "background: green; color: white;");
});

document.addEventListener("keydown", (e) => {
  console.log("KEYDOWN", e);
  // console.log("%c KAJAIO loaded", "background: green; color: white;");
});

// console.log("KAJAIO loaded");
// alert("BOOOO")

// document.addEventListener("blur", e => {
//   console.log("BLUUUR", e)
// })
