// Enemy utility functions for GameCanvas

export const getEnemyStyle = (type) => {
  const baseStyle = "rounded-lg border-2 shadow-lg animate-pulse-glow";
  
  switch (type) {
    case 'goblin':
      return `${baseStyle} bg-gradient-to-br from-green-600 to-green-800 border-green-400`;
    case 'spider':
      return `${baseStyle} bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400`;
    case 'orc':
      return `${baseStyle} bg-gradient-to-br from-red-700 to-red-900 border-red-500`;
    case 'bat':
      return `${baseStyle} bg-gradient-to-br from-gray-700 to-black border-gray-500`;
    case 'troll':
      return `${baseStyle} bg-gradient-to-br from-brown-600 to-brown-800 border-brown-400`;
    case 'demon':
      return `${baseStyle} bg-gradient-to-br from-red-800 to-black border-red-600`;
    case 'fire_elemental':
      return `${baseStyle} bg-gradient-to-br from-orange-600 to-red-700 border-orange-400`;
    case 'dragon':
      return `${baseStyle} bg-gradient-to-br from-red-900 to-orange-800 border-red-700`;
    case 'robot':
      return `${baseStyle} bg-gradient-to-br from-blue-600 to-cyan-700 border-blue-400`;
    case 'ai':
      return `${baseStyle} bg-gradient-to-br from-cyan-600 to-blue-800 border-cyan-400`;
    case 'virus':
      return `${baseStyle} bg-gradient-to-br from-purple-700 to-pink-800 border-purple-500`;
    case 'alien':
      return `${baseStyle} bg-gradient-to-br from-green-500 to-teal-700 border-green-400`;
    case 'cosmic_beast':
      return `${baseStyle} bg-gradient-to-br from-purple-800 to-indigo-900 border-purple-600`;
    case 'void_lord':
      return `${baseStyle} bg-gradient-to-br from-black to-purple-900 border-purple-700`;
    case 'final_boss':
      return `${baseStyle} bg-gradient-to-br from-black via-red-900 to-black border-red-800`;
    default:
      return `${baseStyle} bg-gradient-to-br from-gray-600 to-gray-800 border-gray-400`;
  }
};

export const getEnemyIcon = (type) => {
  switch (type) {
    case 'goblin':
      return '👺';
    case 'spider':
      return '🕷️';
    case 'orc':
      return '👹';
    case 'bat':
      return '🦇';
    case 'troll':
      return '🧌';
    case 'demon':
      return '😈';
    case 'fire_elemental':
      return '🔥';
    case 'dragon':
      return '🐉';
    case 'robot':
      return '🤖';
    case 'ai':
      return '🔷';
    case 'virus':
      return '☠️';
    case 'alien':
      return '👽';
    case 'cosmic_beast':
      return '🌌';
    case 'void_lord':
      return '🕳️';
    case 'final_boss':
      return '👑';
    default:
      return '❓';
  }
};