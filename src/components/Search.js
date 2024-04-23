class SearchComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
      :host {
        --border-color: #ccc;
        --text-color: #333;
        --bg-color: transparent;

        /* Dark theme adjustments */
        --border-color-dark: #666;
        --text-color-dark: #ccc;

        display: block;
        width: 100%;
      }

      .flex {
        display: flex;
        width: 100%;
        gap: 12px;
      }

      .w-full {
        width: 100%;
      }

      .relative {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px; /* Small gap */
        background-color: var(--bg-color);
        cursor: pointer;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        padding: 8px;
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.3s;
      }

      input {
        flex-grow: 1;
        background-color: transparent;
        outline: none;
        border: none;
        color: var(--text-color);
      }

      button {
        background: none;
        border: none;
        cursor: pointer;
        display: none; /* Initially hidden */
        position: absolute;
        right: 5px;
        transform: translateY(-50%);
        top: 50%;

        svg {
          color: #ffffff99;
        }
      }

      :host(:focus-within) .relative {
        border-color: #4A90E2;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          --border-color: var(--border-color-dark);
          --text-color: var(--text-color-dark);
        }
      }
      </style>
      <div class="flex">
        <div class="w-full">
          <div class="relative">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="min-w-5">
              <path d="M17.5 17.5L13.9167 13.9167M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"></path>
            </svg>
            <input type="text" placeholder="Search projects">
            <button class="clear-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="my-1  " xmlns="http://www.w3.org/2000/svg"><path d="M5 5L15 15M5 15L15 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    this.input = this.shadowRoot.querySelector("input");
    this.clearButton = this.shadowRoot.querySelector(".clear-btn");
    this.input.addEventListener("input", this.debounce(this.handleInput.bind(this), 300));
    this.clearButton.addEventListener("click", this.handleClear.bind(this));
  }

  debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  handleInput() {
    const value = this.input.value.trim();
    this.clearButton.style.display = value ? "block" : "none";
    this.emitSearchEvent(value);
  }

  handleClear() {
    this.input.value = "";
    this.clearButton.style.display = "none";
    this.emitSearchEvent("");
  }

  emitSearchEvent() {
    const event = new CustomEvent("search", { detail: { query: this.input.value.trim() }, bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
}

customElements.define("search-component", SearchComponent);
