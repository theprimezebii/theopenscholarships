export interface ImportantDates {
  resultsAnnouncement?: string;
  programmeStart?: string;
}

export interface Faq {
  question: string;
  answer: string;
  _id?: string;
}

export interface Scholarship {
  _id: string;
  title: string;
  slug: string;
  provider: string;
  hostCountries: string[];
  region: string[];
  fields: string[];
  degreeLevel: string[];
  fundingType: string[];
  programMode: string[];
  programDuration: string[];
  programLevel: string[];
  deadline: Date | string;
  status: 'open' | 'closing-soon' | 'closed' | 'coming-soon';
  description: string;
  benefits?: string[];
  eligibility?: string[];
  howToApply?: string[];
  requiredDocuments?: string[];
  applicationTips?: string;
  importantDates?: ImportantDates;
  faqs?: Faq[];
  officialLink: string;
  featured: boolean;
  views: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
