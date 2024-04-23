import projectService from "../services/ProjectService.js";

class GitHubProjects extends HTMLElement {
  static get observedAttributes() {
    return ["username"];
  }

  constructor() {
    super();
    this.classList.add("grid", "grid-cols-1", "gap-4", "sm:grid-cols-2");
  }

  connectedCallback() {
    const username = this.getAttribute("username");
    if (username) {
      projectService.subscribe(username, this.renderProjects.bind(this));
    }
  }

  disconnectedCallback() {
    const username = this.getAttribute("username");
    if (username) {
      projectService.unsubscribe(username, this.renderProjects.bind(this));
    }
  }

  renderProjects(projects) {
    this.innerHTML = projects.map(project => `
      <div class="flex flex-col h-full rounded-md border border-neutral-800 p-4">
        <div class="mb-2 flex items-center justify-between">
          <a href="${project.html_url}" target="_blank" class="group text-xl font-medium">
            <div class="flex items-center space-x-2 transition hover:text-gray-400">
            <h3>${project.name}</h3>
            <svg width="12" height="12" viewBox="0 0 24 24" stroke-width="3" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" name="Deploy" class="inline-block text-gray-500 transition-transform duration-300 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]"><path d="M6 19L19 6m0 0v12.48M19 6H6.52" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
          </a>
        </div>
        <p class="text-gray-400 line-clamp-3">${project.description || "No description provided."}</p>
        <div class="mt-3 flex items-center space-x-2">
          ${this.renderTechnologyIcons(project.topics)}
        </div>
      </div>
    `).join("");
  }

  renderTechnologyIcons(topics) {
    return topics.map(topic => `
      <span title="${topic}" class="icon-${topic}"></span>
    `).join("");
  }
}

customElements.define("github-projects", GitHubProjects);
