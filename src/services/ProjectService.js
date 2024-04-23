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

    const data = this.projectData.get(username);
    if (data) {
      callback(data);
    } else {
      this.initiateFetch(username);
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

  async initiateFetch(username) {
    if (!this.projectData.has(username) && !this.fetchControllers.has(username)) {
      const controller = new AbortController();
      this.fetchControllers.set(username, controller);
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        this.projectData.set(username, data);
        this.notifySubscribers(username, data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
          this.notifySubscribers(username, null, error);
        }
      } finally {
        this.fetchControllers.delete(username);
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
