import localForage from "localforage";

class DatabaseService {
  constructor() {
    localForage.config({
      name: "GitHubProjectsDB"
    });
    this.cleanup();
  }

  async saveProjects(username, projects) {
    const timestamp = new Date().getTime();
    const data = {
      timestamp,
      projects
    };
    try {
      await localForage.setItem(username, data);
    } catch (error) {
      console.error("Error saving projects to IndexedDB:", error);
    }
  }

  async getProjects(username) {
    try {
      const data = await localForage.getItem(username);
      if (data && this.isDataValid(data.timestamp)) {
        return data.projects;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving projects from IndexedDB:", error);
      return null;
    }
  }

  isDataValid(timestamp) {
    const now = new Date().getTime();
    const ttl = 86400000; // 24 hours in milliseconds
    return (now - timestamp) < ttl;
  }

  async cleanup() {
    const keys = await localForage.keys();
    keys.forEach(async key => {
      const data = await localForage.getItem(key);
      if (data && !this.isDataValid(data.timestamp)) {
        await localForage.removeItem(key);
      }
    });
  }
}

export const dbService = new DatabaseService();
