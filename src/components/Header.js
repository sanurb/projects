class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            position: sticky;
            top: 0;
            z-index: 40;
            width: 100%;
            padding-top: .75rem;
            padding-bottom: .75rem;
            font-weight: medium;
          }
          @media (min-width: 768px) {
            :host {
              padding-top: 1.75rem;
              padding-bottom: 1.75rem;
            }
          }
        </style>
        <slot></slot>
      `;
  }
}

customElements.define("header-component", HeaderComponent);
