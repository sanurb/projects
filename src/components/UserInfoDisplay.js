import userService from "../services/UserService.js";

class UserInfoDisplay extends HTMLElement {
  static get observedAttributes() {
    return ["username"];
  }

  constructor() {
    super();
    this.innerHTML = `
    <div class="flex flex-col items-center justify-center px-4 py-5 md:px-0 md:py-24">
      <div class="flex w-full max-w-6xl items-center justify-between">
        <div class="info">
          <div class="no-print"></div>
          <h1 class="mb-4 text-3xl font-bold md:text-5xl"></h1>
          <h2 class="text-md text-gray-300"></h2>
          <p class="mt-3 text-md text-gray-300">
            🎯 All Of My Projects, Some useful, some stupid, all fun!
          </p>
          🗃️ <span class="stats text-md text-gray-300"></span>
        </div>
      </div>
    </div>`;
    this.updateInfo = this.updateInfo.bind(this);
  }

  connectedCallback() {
    const username = this.getAttribute("username");
    if (username) {
      userService.subscribe(username, this.updateInfo);
    }
  }

  disconnectedCallback() {
    const username = this.getAttribute("username");
    if (username) {
      userService.unsubscribe(username, this.updateInfo);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "username" && oldValue !== newValue) {
      if (oldValue) {
        userService.unsubscribe(oldValue, this.updateInfo);
      }
      userService.subscribe(newValue, this.updateInfo);
    }
  }

  updateInfo(data) {
    this.querySelector("h1").textContent = `Hi, I'm ${data.name} ✌️` || "";
    this.querySelector("h2").textContent = data.bio || "";
    this.querySelector(".stats").innerHTML = `Repos: ${data.public_repos}`;
  }
}

customElements.define("user-info-display", UserInfoDisplay);
