export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  category: string;
  detailedDescription: string;
  technologies: string[];
  benefits: string[];
  problemsSolved: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  client: string;
  results: string[];
  metrics?: { label: string; value: string }[];
  technologies: string[];
  imageUrl: string;
  challenge: string;
  solution: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  tags: string[];
  likes: number;
}

export interface CareerOpportunity {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  salaryRange: string;
  requirements: string[];
  responsibilities: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  github?: string;
  linkedin?: string;
  skills: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "advisor";
  text: string;
  timestamp: Date;
  isGenerating?: boolean;
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  company: string;
  serviceType: string;
  projectBudget: string;
  projectBrief: string;
  customAnswers: Record<string, string | number>;
  status: "Nuevo" | "Contactado" | "Cerrado";
  createdAt: string;
}
