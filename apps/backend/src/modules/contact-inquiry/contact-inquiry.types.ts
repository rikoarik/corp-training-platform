export interface ContactInquiryQuery {
  page?: number;
  limit?: number;
}

export interface ContactInquiryIdParams {
  id: string;
}

export interface CreateContactInquiryBody {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}
