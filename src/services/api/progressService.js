// Local storage-based progress service for persistent game progress
const STORAGE_KEY = "bouncequest_progress";

// Initialize with default progress for level 1
const defaultProgress = [
  {
    Id: 1,
    levelId: 1,
    bestTime: null,
    stars: 0,
    unlocked: true,
    attempts: 0,
  }
];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get progress from localStorage
const getStoredProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProgress;
  } catch (error) {
    console.warn("Error reading progress from localStorage:", error);
    return defaultProgress;
  }
};

// Save progress to localStorage
const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Error saving progress to localStorage:", error);
  }
};

export const progressService = {
  async getAll() {
    await delay(200);
    return [...getStoredProgress()];
  },

  async getById(id) {
    await delay(150);
    const progress = getStoredProgress();
    const item = progress.find(p => p.Id === id);
    if (!item) {
      throw new Error(`Progress ${id} not found`);
    }
    return { ...item };
  },

  async getByLevelId(levelId) {
    await delay(150);
    const progress = getStoredProgress();
    const item = progress.find(p => p.levelId === levelId);
    return item ? { ...item } : null;
  },

  async updateProgress(levelId, data) {
    await delay(250);
    const progress = getStoredProgress();
    const existingIndex = progress.findIndex(p => p.levelId === levelId);

    if (existingIndex !== -1) {
      // Update existing progress
      const existing = progress[existingIndex];
      progress[existingIndex] = {
        ...existing,
        ...data,
        bestTime: data.bestTime && (!existing.bestTime || data.bestTime < existing.bestTime) 
          ? data.bestTime 
          : existing.bestTime,
        stars: data.stars > existing.stars ? data.stars : existing.stars,
        attempts: existing.attempts + (data.attempts || 0),
      };
    } else {
      // Create new progress entry
      const newId = Math.max(...progress.map(p => p.Id)) + 1;
      progress.push({
        Id: newId,
        levelId,
        bestTime: data.bestTime || null,
        stars: data.stars || 0,
        unlocked: true,
        attempts: data.attempts || 1,
      });
    }

    // Unlock next level if current level has stars
    if (data.stars > 0 && levelId < 20) {
      const nextLevelIndex = progress.findIndex(p => p.levelId === levelId + 1);
      if (nextLevelIndex === -1) {
        // Create progress for next level
        const nextId = Math.max(...progress.map(p => p.Id)) + 1;
        progress.push({
          Id: nextId,
          levelId: levelId + 1,
          bestTime: null,
          stars: 0,
          unlocked: true,
          attempts: 0,
        });
      } else {
        // Unlock existing next level
        progress[nextLevelIndex].unlocked = true;
      }
    }

    saveProgress(progress);
    return progress.find(p => p.levelId === levelId);
  },

  async create(progressData) {
    await delay(300);
    const progress = getStoredProgress();
    const newProgress = {
      ...progressData,
      Id: Math.max(...progress.map(p => p.Id)) + 1,
    };
    progress.push(newProgress);
    saveProgress(progress);
    return { ...newProgress };
  },

  async update(id, updates) {
    await delay(250);
    const progress = getStoredProgress();
    const index = progress.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Progress ${id} not found`);
    }
    progress[index] = { ...progress[index], ...updates };
    saveProgress(progress);
    return { ...progress[index] };
  },

  async delete(id) {
    await delay(200);
    const progress = getStoredProgress();
    const index = progress.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Progress ${id} not found`);
    }
    const deleted = progress.splice(index, 1)[0];
    saveProgress(progress);
    return { ...deleted };
  },

  async reset() {
    await delay(100);
    saveProgress(defaultProgress);
    return [...defaultProgress];
  }
};