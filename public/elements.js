class DayButton extends HTMLElement {
  static get observedAttributes() {
    return ["day", "count"]
  }
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: "open" })
    const style = document.createElement("style")
    style.textContent = ":host button { width: 100%; font: 0.9rem Helvetica; padding: 2px; }"
    shadowRoot.appendChild(style)
    this.btn = document.createElement("button")
    shadowRoot.appendChild(this.btn)
  }
  attributeChangedCallback(name, _oldValue, newValue) {
    this[name] = name === "day" ? newValue.split("-").reverse().join("/") : newValue
    this.btn.innerText = `${this.day} 🚸 ${this.count}`
  }
}
class MemText extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: "open" })
    const style = document.createElement("style")
    style.textContent = ":host input { color: #fff; background: transparent; }"
    shadowRoot.appendChild(style)
    this.input = document.createElement("input")
    this.input.setAttribute("type", "text")
    this.input.addEventListener("change", () => {
      this.value = this.input.value
      window.localStorage.setItem(this.id, this.value)
    })
    shadowRoot.appendChild(this.input)
  }
  connectedCallback() {
    this.input.setAttribute("size", this.getAttribute("size"))
    this.value = window.localStorage.getItem(this.id) || ""
    this.input.setAttribute("value", this.value)
  }
}
customElements.define("day-button", DayButton)
customElements.define("mem-text", MemText);
