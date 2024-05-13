import projectService from "../services/ProjectService.js";

class GitHubProjects extends HTMLElement {
  static get observedAttributes() {
    return ["username"];
  }

  constructor() {
    super();
    this.classList.add("grid", "grid-cols-1", "gap-4", "sm:grid-cols-2");
    window.addEventListener("search", this.handleSearch.bind(this));
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

  handleSearch(event) {
    const query = event.detail.query;
    if (query.length >= 3) {
      projectService.searchProjects(query).then(results => {
        this.renderProjects(results);
      });
    } else if (query.length === 0) {
      const username = this.getAttribute("username");
      projectService.subscribe(username, this.renderProjects.bind(this));
    }
  }

  /**
   * Renders the template icon based on the value of `isTemplate`.
   *
   * @param {boolean} isTemplate - Indicates whether the icon should be rendered as a template.
   * @returns {string} - The SVG icon markup if `isTemplate` is true, otherwise an empty string.
   */
  renderTemplateIcon(isTemplate) {
    if (isTemplate) {
      return `<svg aria-hidden="true" fill="rgb(132, 141, 151)" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-template color-fg-muted mr-2 d-none d-sm-none d-md-block">
      <path d="M13.25 8a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-.75a.75.75 0 0 1 0-1.5h.75v-.25a.75.75 0 0 1 .75-.75ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2ZM2.75 8a.75.75 0 0 1 .75.75v.268c.083-.012.166-.018.25-.018h.5a.75.75 0 0 1 0 1.5h-.5a.25.25 0 0 0-.25.25v.75c0 .28.114.532.3.714a.75.75 0 1 1-1.05 1.072A2.495 2.495 0 0 1 2 11.5V8.75A.75.75 0 0 1 2.75 8ZM11 .75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V1.5h-.75A.75.75 0 0 1 11 .75Zm-5 0A.75.75 0 0 1 6.75 0h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 6 .75Zm0 9A.75.75 0 0 1 6.75 9h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 6 9.75ZM4.992.662a.75.75 0 0 1-.636.848c-.436.063-.783.41-.846.846a.751.751 0 0 1-1.485-.212A2.501 2.501 0 0 1 4.144.025a.75.75 0 0 1 .848.637ZM2.75 4a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 2.75 4Zm10.5 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75Z"></path>
    </svg>`;
    }
    return "";
  }

  renderProjects(projects) {
    this.innerHTML = projects.map(project => `
      <div class="flex flex-col h-full rounded-md border border-neutral-800 p-4" data-primary-language="${project.language}">
        <div class="mb-2 flex items-center justify-between">
          <a href="${project.homepage || project.html_url}" target="_blank" class="group text-xl font-medium">
            <div class="flex items-center space-x-2 transition hover:text-gray-400">
            ${this.renderTemplateIcon(project.is_template)}
            <h3>${project.name}</h3>
            <svg width="12" height="12" viewBox="0 0 24 24" stroke-width="3" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" name="Deploy" class="inline-block text-gray-500 transition-transform duration-300 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]"><path d="M6 19L19 6m0 0v12.48M19 6H6.52" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
          </a>
          <div class="flex items-center space-x-3">
            <a href="${project.html_url}" target="_blank" title="Repository"><svg width="20" height="20" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" class="text-gray-400 transition-colors duration-150 hover:text-gray-100" name="Github"><path d="M16 22.027v-2.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 00-1.5-3.75 5.07 5.07 0 00-.09-3.77s-1.18-.35-3.91 1.48a13.38 13.38 0 00-7 0c-2.73-1.83-3.91-1.48-3.91-1.48A5.07 5.07 0 005 5.797a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 00-.94 2.58v2.87M9 20.027c-3 .973-5.5 0-7-3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </a>
          </div>
        </div>
        <p class="text-gray-400 line-clamp-3">${project.description || "No description provided."}</p>
        <div class="mt-3 flex items-center space-x-2">
          ${this.renderTechnologyIcons(project.language)}
        </div>
      </div>
    `).join("");
  }

  renderTechnologyIcons(languages) {
    if (!languages) return "";
    if (typeof languages === "string") languages = [languages];
    return languages.map(language => `
      <div title="${language}" class="truncate rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 font-mono text-xs icon-${language.toLowerCase()}">${language}</div>
    `).join("");
  }
}

customElements.define("github-projects", GitHubProjects);
