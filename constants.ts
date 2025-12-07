import { Category } from './types';

// Icons are represented as simple emoji or Lucide component names mapping
export const CATEGORIES: Category[] = [
  {
    id: 'history',
    title: 'History & Origin',
    icon: '📜',
    description: 'Invention & evolution',
    promptTemplate: "Identify the object in this image. Then, provide a short and engaging summary of its invention, historical development, and origin. (e.g., When was it first invented and how did it evolve?)"
  },
  {
    id: 'tech',
    title: 'Technical Specs',
    icon: '⚙️',
    description: 'Structure & anatomy',
    promptTemplate: "Identify the object in this image. Then, explain its anatomy, how it is manufactured, and its technical/structural specifications in bullet points."
  },
  {
    id: 'maintenance',
    title: 'Care & Cleaning',
    icon: '🧼',
    description: 'Maintenance tips',
    promptTemplate: "Identify the object in this image. Then, explain how to clean it properly, maintenance tips, and how to extend its lifespan."
  },
  {
    id: 'tips',
    title: 'Tips & Hacks',
    icon: '💡',
    description: 'Life hacks',
    promptTemplate: "Identify the object in this image. Then, provide life hacks, little-known features, or practical tips to make life easier using this object."
  },
  {
    id: 'fun',
    title: 'Fun & Games',
    icon: '🎲',
    description: 'Creative activities',
    promptTemplate: "Identify the object in this image. Then, suggest creative games and activities that can be done with this object for children or adults."
  },
  {
    id: 'next_move',
    title: 'Next Move',
    icon: '♟️',
    description: 'Game Strategy',
    promptTemplate: "Identify the game shown in the image (Chess, Backgammon, Poker, Board Game, etc.). Analyze the current board state or situation and suggest the best next move or winning strategy."
  },
  {
    id: 'fix_heal',
    title: 'Heal / Repair',
    icon: '❤️‍🩹',
    description: 'Fix or Cure',
    promptTemplate: "Identify the subject in the image. If it is a LIVING thing (plant, animal, person), suggest remedies, healing tips, or care instructions for potential ailments. If it is an INANIMATE object (device, furniture, tool), explain how to repair, fix, or mend it."
  },
  {
    id: 'usage',
    title: 'How to Use',
    icon: '🛠️',
    description: 'Practical usage',
    promptTemplate: "Identify the object in this image. Then, explain its primary purposes and any unknown practical usage methods (life hacks)."
  },
  {
    id: 'safety',
    title: 'Safety & Risks',
    icon: '⚠️',
    description: 'Warnings & hazards',
    promptTemplate: "Identify the object in this image. Then, list potential hazards, safety warnings, and things to watch out for regarding this object."
  },
  {
    id: 'diy',
    title: 'DIY & Mods',
    icon: '🎨',
    description: 'Repair & modify',
    promptTemplate: "Identify the object in this image. Then, give creative ideas on how I can build, repair, or modify/upcycle this object at home."
  },
  {
    id: 'science',
    title: 'Scientific Explanation',
    icon: '🔬',
    description: 'Physics & chemistry',
    promptTemplate: "Identify the object in this image. Then, explain its working principle scientifically based on the rules of physics, chemistry, or biology."
  },
  {
    id: 'decoration',
    title: 'Decor & Style',
    icon: '✨',
    description: 'Interior design',
    promptTemplate: "Identify the object in this image. Then, suggest how this object can be used decoratively in a space (home, office, etc.), which colors it matches with, and styling tips."
  },
  {
    id: 'storage',
    title: 'Storage',
    icon: '📦',
    description: 'Preservation',
    promptTemplate: "Identify the object in this image. Then, explain the best storage conditions to prevent damage or spoilage. How should it be preserved?"
  },
  {
    id: 'buying',
    title: 'Buying Guide',
    icon: '💰',
    description: 'Quality factors',
    promptTemplate: "Identify the object in this image. Then, explain what to look for when buying a new one. What factors determine its quality?"
  },
  {
    id: 'material',
    title: 'Material Analysis',
    icon: '🪵',
    description: 'What is it made of?',
    promptTemplate: "Identify the object in this image. Then, analyze what materials it is likely made of (type of plastic, metal, wood, etc.) and the properties of these materials."
  }
];