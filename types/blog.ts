export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  author: string;
  authorRole?: string;
  image?: string;
  tags: string[];
  published: boolean;
  preview?: boolean;
  views: number;
  faqs?: BlogFaq[];
  createdAt?: Date;
  updatedAt?: Date;
}
