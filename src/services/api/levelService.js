import levelsData from "@/services/mockData/levels.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const levelService = {
  async getAll() {
    await delay(200);
    return [...levelsData].reverse();
  },
  async getById(id) {
    await delay(200);
    const level = levelsData.find(level => level.Id === id);
    if (!level) {
      throw new Error(`Level ${id} not found`);
    }
    return { ...level };
  },

  async create(level) {
    await delay(400);
    const newLevel = {
      ...level,
      Id: Math.max(...levelsData.map(l => l.Id)) + 1
    };
    levelsData.push(newLevel);
    return { ...newLevel };
  },

  async update(id, updates) {
    await delay(350);
    const index = levelsData.findIndex(level => level.Id === id);
    if (index === -1) {
      throw new Error(`Level ${id} not found`);
    }
    levelsData[index] = { ...levelsData[index], ...updates };
    return { ...levelsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = levelsData.findIndex(level => level.Id === id);
    if (index === -1) {
      throw new Error(`Level ${id} not found`);
    }
    const deleted = levelsData.splice(index, 1)[0];
    return { ...deleted };
  }
};