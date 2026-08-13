export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface Industry {
  icon: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  capabilities: string[];
}

export interface TrustPillar {
  icon: string;
  title: string;
  description: string;
}

export interface Differentiator {
  icon: string;
  title: string;
  description: string;
}
