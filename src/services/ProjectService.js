import { dbService } from "./DatabaseService.js";

class ProjectService {
  constructor() {
    this.projectData = new Map();
    this.subscribers = new Map();
  }

  async subscribe(username, callback) {
    if (!this.subscribers.has(username)) {
      this.subscribers.set(username, new Set());
      this.loadData(username);
    }
    this.subscribers.get(username).add(callback);
    this.emitData(username, callback);
  }

  async loadData(username) {
    const cachedData = await dbService.getProjects(username);
    if (cachedData) {
      this.projectData.set(username, { data: cachedData, loaded: true });
      this.notifySubscribers(username, cachedData);
    } else {
      this.fetchProjects(username);
    }
  }

  async fetchProjects(username, page = 1, perPage = 30, accumulatedData = []) {
    try {
      const url = `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&page=${page}&per_page=${perPage}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      accumulatedData = [...accumulatedData, ...data];
      if (data.length < perPage) {
        await dbService.saveProjects(username, accumulatedData);
        this.projectData.set(username, { data: accumulatedData, loaded: true });
        this.notifySubscribers(username, accumulatedData);
      } else {
        this.fetchProjects(username, page + 1, perPage, accumulatedData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      this.notifySubscribers(username, null, error);
    }
  }

  async searchProjects(query) {
    const results = [];
    // eslint-disable-next-line no-unused-vars
    for (const [_username, data] of this.projectData) {
      const filteredProjects = data.data.filter(project =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
            (project.description && project.description.toLowerCase().includes(query.toLowerCase()))
      );
      results.push(...filteredProjects);
    }
    return results;
  }

  unsubscribe(username, callback) {
    const subscribers = this.subscribers.get(username);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(username);
      }
    }
  }

  emitData(username, callback) {
    const userData = this.projectData.get(username);
    if (userData) {
      callback(userData.data);
    }
  }

  notifySubscribers(username, data, error = null) {
    const subscribers = this.subscribers.get(username);
    if (subscribers) {
      subscribers.forEach(callback => callback(data, error));
    }
  }
}

const projectService = new ProjectService();
export default projectService;
