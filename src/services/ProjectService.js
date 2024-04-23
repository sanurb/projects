class ProjectService {
  constructor() {
    this.projectData = new Map();
    this.subscribers = new Map();
    this.fetchControllers = new Map();
  }

  subscribe(username, callback) {
    if (!this.subscribers.has(username)) {
      this.subscribers.set(username, new Set());
    }
    this.subscribers.get(username).add(callback);

    const existingData = this.projectData.get(username);
    if (existingData && existingData.loaded) {
      callback(existingData.data);
    } else {
      this.fetchProjects(username, callback);
    }
  }

  async fetchProjects(username, callback, page = 1, perPage = 30) {
    const controller = new AbortController();
    this.fetchControllers.set(username, controller);
    const url = `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&page=${page}&per_page=${perPage}`;

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!this.projectData.has(username)) {
        this.projectData.set(username, { data: [], loaded: false });
      }
      const userData = this.projectData.get(username);
      userData.data = userData.data.concat(data);
      this.projectData.set(username, userData);
      callback(userData.data);

      if (data.length < perPage) {
        userData.loaded = true;
      } else {
        this.fetchProjects(username, callback, page + 1, perPage);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Fetch error:", error);
        this.notifySubscribers(username, null, error);
      }
    } finally {
      this.fetchControllers.delete(username);
    }
  }

  unsubscribe(username, callback) {
    if (this.subscribers.has(username)) {
      const userSubscribers = this.subscribers.get(username);
      userSubscribers.delete(callback);
      if (userSubscribers.size === 0) {
        this.subscribers.delete(username);
        this.cancelFetch(username);
      }
    }
  }

  cancelFetch(username) {
    if (this.fetchControllers.has(username)) {
      this.fetchControllers.get(username).abort();
      this.fetchControllers.delete(username);
    }
  }

  notifySubscribers(username, data, error = null) {
    if (this.subscribers.has(username)) {
      for (const callback of this.subscribers.get(username)) {
        callback(data, error);
      }
    }
  }
}

const projectService = new ProjectService();
export default projectService;
