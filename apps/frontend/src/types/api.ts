export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
  };
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    trainings?: number;
  };
};

export type Training = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  price: number | string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  _count?: {
    schedules?: number;
  };
};

export type Schedule = {
  id: string;
  trainingId: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  quota: number;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  training: {
    id: string;
    title: string;
    slug: string;
  };
  _count?: {
    participants?: number;
  };
};

export type Article = {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
  };
};

export type Participant = {
  id: string;
  scheduleId: string;
  name: string;
  email: string;
  phone?: string | null;
  status: 'REGISTERED' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  schedule: {
    id: string;
    trainingId: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    quota: number;
    status: string;
    training: {
      id: string;
      title: string;
      slug: string;
    };
  };
};

export type ParticipantRegistrationBody = {
  scheduleId: string;
  name: string;
  email: string;
  phone?: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthSession = {
  token: string;
  expiresIn: string;
  user: AuthUser;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
};

export type ContactInfo = {
  address: string;
  phone: string;
  email: string;
  telHref: string;
  mailHref: string;
  whatsappHref: string;
};

export type PublicPage<TContent = Record<string, unknown>> = {
  id: string;
  slug: string;
  title: string;
  content: TContent;
  createdAt: string;
  updatedAt: string;
};

export type HomePageContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  services: Array<{
    title: string;
    description: string;
  }>;
  legalHighlights: string[];
  trustPoints: string[];
  partnerSegments: string[];
  testimonials: Array<{
    quote: string;
    person: string;
    role: string;
  }>;
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    primaryTo: string;
    secondaryLabel: string;
  };
  contact: ContactInfo;
  scheduleNotes: string[];
};

export type ProfilePageContent = {
  about: string;
  vision: string;
  mission: string[];
  legalities: string[];
  experts: Array<{
    name: string;
    focus: string;
  }>;
  projects: string[];
  certifications: string[];
};

export type ContactPageContent = {
  contactInfo: ContactInfo;
  cards: Array<{
    title: string;
    description: string;
  }>;
};

export type CareerPageContent = {
  intro: string;
  openings: Array<{
    title: string;
    type: string;
    location: string;
    summary: string;
  }>;
};

export type GalleryPageContent = {
  items: string[];
};

export type SkpLicensePageContent = {
  intro: string;
  offerings: string[];
};

export type ContactInquiryBody = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
};

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
  createdAt: string;
  updatedAt: string;
};
