class FooterComponent extends HTMLElement {
  static get observedAttributes() {
    return ["name"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
          footer {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 16px;
            font-size: 24px;
            opacity: 0.5;
            border-top: 1px solid transparent;
          }
          h3 {
            font-weight: bold;
          }
          span {
            color: #6b7280;
          }
          p {
            color: #9ca3af;
          }
          @media (prefers-color-scheme: dark) {
            footer {
              border-top-color: rgba(255, 255, 255, 0.1);
            }
            span {
              color: #9ca3af;
            }
            p {
              color: #9ca3af;
          }
        </style>
        <footer>
          <p>Made with ❤ by ${this.getAttribute("name") || "Tu Nombre"}</p>
        </footer>
      `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "name" && oldValue !== newValue) {
      this.shadowRoot.querySelector("p").textContent = `Made with ❤ by ${newValue}`;
    }
  }
}

customElements.define("footer-component", FooterComponent);
