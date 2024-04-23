class UserCard extends HTMLElement {
  static get observedAttributes() {
    return ["name"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "name" && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const name = this.getAttribute("name") || "unknown";
    const size = 128;

    const html = /* html */`
      <style>
        .card {
          --size: 32px;

          display: inline-grid;
          place-items: center;
          gap: 1rem;
          grid-template-columns: var(--size) 1fr;
          border: 2px solid #aaa;
          border-bottom-color: slateblue;
          border-right-color: deeppink;
          border-radius: var(--size);
          padding: 0.5rem 1rem;
          margin: 0.5rem;
          background: #121212;

          & img {
            width: var(--size);
            height: var(--size);
            border-radius: 50%;
          }

          & span {
            font-family: Jost, sans-serif;
            font-size: clamp(1.25rem, 2vw, 1.6rem);
            font-weight: 700;
          }
        }
      </style>
      <div class="card">
        <img src="https://avatars.githubusercontent.com/${name}?size=${size}" alt="${name}">
        <span>${name}</span>
      </div>
    `;

    this.shadowRoot.innerHTML = html;
  }
}

customElements.define("user-card", UserCard);
