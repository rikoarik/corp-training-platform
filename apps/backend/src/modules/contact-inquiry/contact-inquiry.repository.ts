import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';

const contactInquirySelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  company: true,
  message: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ContactInquirySelect;

export type ContactInquiryEntity = Prisma.ContactInquiryGetPayload<{ select: typeof contactInquirySelect }>;

export function findContactInquiries(skip: number, take: number) {
  return prisma.contactInquiry.findMany({
    orderBy: { createdAt: 'desc' },
    skip,
    take,
    select: contactInquirySelect,
  });
}

export function findContactInquiryById(id: string) {
  return prisma.contactInquiry.findUnique({
    where: { id },
    select: contactInquirySelect,
  });
}

export function createContactInquiry(data: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
}) {
  return prisma.contactInquiry.create({
    data,
    select: contactInquirySelect,
  });
}
