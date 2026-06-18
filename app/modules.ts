export interface Module {
  id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
}

export const LEARNING_MODULES: Module[] = [
  {
    id: 'python-basics',
    title: 'Python Fundamentals',
    description: 'Master core Python concepts used in AI and automation.',
    topics: ['Variables', 'Loops', 'Functions', 'Lists', 'File I/O'],
    difficulty: 'beginner',
    estimatedTime: 90,
  },
  {
    id: 'ai-tools',
    title: 'AI Tools & APIs',
    description: 'Learn to work with OpenAI, Gemini and other AI APIs.',
    topics: ['Prompt Engineering', 'API Keys', 'Chat Completions', 'Tokens', 'Error Handling'],
    difficulty: 'intermediate',
    estimatedTime: 120,
  },
  {
    id: 'web-development',
    title: 'Web Development Basics',
    description: 'Build modern web apps with HTML, CSS and JavaScript.',
    topics: ['HTML', 'CSS', 'JavaScript', 'Fetch API', 'Responsive Design'],
    difficulty: 'beginner',
    estimatedTime: 100,
  },
  {
    id: 'flutter-mobile',
    title: 'Flutter Mobile Development',
    description: 'Build cross-platform mobile apps with Flutter and Dart.',
    topics: ['Dart Basics', 'Widgets', 'State Management', 'Navigation', 'APIs'],
    difficulty: 'intermediate',
    estimatedTime: 150,
  },
  {
    id: 'automation',
    title: 'Automation with n8n',
    description: 'Create no-code automation workflows using n8n.',
    topics: ['Workflows', 'Triggers', 'Actions', 'API Integration', 'Error Handling'],
    difficulty: 'intermediate',
    estimatedTime: 80,
  },
  {
    id: 'freelancing',
    title: 'Freelancing & Portfolio',
    description: 'Launch your freelance career on Fiverr and Upwork.',
    topics: ['Profile Setup', 'Proposals', 'Pricing', 'Client Communication', 'Portfolio'],
    difficulty: 'beginner',
    estimatedTime: 60,
  },
];