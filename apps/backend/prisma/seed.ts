import bcrypt from 'bcryptjs';
import { PrismaClient, PublishStatus, ScheduleStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const publicPages = [
  {
    slug: 'home',
    title: 'Beranda',
    content: {
      hero: {
        eyebrow: 'Penyedia layanan PJK3 & konsultansi sistem manajemen',
        title: 'Website pelatihan yang fokus pada kredibilitas, konversi, dan pengalaman belajar yang jelas.',
        description:
          'Bangun kepercayaan calon peserta dan perusahaan dengan profil yang kuat, katalog pelatihan yang mudah ditelusuri, dan alur pendaftaran yang ringkas.',
      },
      services: [
        {
          title: 'Pelatihan Korporat',
          description:
            'Program pelatihan untuk meningkatkan kompetensi tim dengan format yang fleksibel dan materi yang aplikatif.',
        },
        {
          title: 'Konsultansi Sistem',
          description:
            'Pendampingan untuk kebutuhan sistem manajemen, kesiapan audit, dan penguatan proses operasional.',
        },
        {
          title: 'Inhouse & Public Class',
          description:
            'Pelaksanaan kelas dapat disusun menyesuaikan kebutuhan perusahaan, lokasi, dan target peserta.',
        },
        {
          title: 'Dokumen & Legalitas',
          description:
            'Sorotan legalitas, sertifikasi, dan dokumen pendukung untuk memperkuat citra profesional perusahaan.',
        },
      ],
      legalHighlights: [
        'Highlight legalitas dan perizinan perusahaan',
        'Sorotan sertifikasi dan akreditasi yang dimiliki',
        'Struktur tim ahli dan pengalaman proyek yang mudah dipahami',
      ],
      trustPoints: [
        'Alur pendaftaran pelatihan yang ringkas',
        'Konten perusahaan yang siap mendukung kebutuhan presentasi bisnis',
        'Katalog pelatihan yang mudah dipilah berdasarkan kategori dan jadwal',
        'Tampilan profesional untuk kebutuhan promosi dan follow-up leads',
      ],
      partnerSegments: [
        'Perusahaan manufaktur',
        'Kontraktor & proyek',
        'Jasa profesional',
        'Tim operasional & HSE',
        'Manajemen SDM',
        'Unit pengembangan kompetensi',
      ],
      testimonials: [
        {
          quote:
            'Materi pelatihan tersusun rapi dan memudahkan tim kami memahami langkah implementasi di lapangan.',
          person: 'Supervisor operasional',
          role: 'Industri manufaktur',
        },
        {
          quote:
            'Komunikasinya jelas, jadwal mudah dipahami, dan kebutuhan administratif peserta bisa diikuti dengan baik.',
          person: 'Koordinator training',
          role: 'Perusahaan jasa',
        },
        {
          quote:
            'Penyajian profil perusahaan dan legalitas sangat membantu saat kami perlu mengajukan vendor ke internal.',
          person: 'Tim procurement',
          role: 'Perusahaan proyek',
        },
      ],
      cta: {
        eyebrow: 'CTA utama',
        title: 'Siapkan website yang membantu tim Anda menjual dan mengelola program pelatihan dengan lebih jelas.',
        description:
          'Mulai dari landing page, katalog program, jadwal kelas, hingga form pendaftaran peserta — semua bisa disusun dalam pengalaman yang lebih rapi dan siap digunakan.',
        primaryLabel: 'Daftar pelatihan',
        primaryTo: '/jadwal',
        secondaryLabel: 'Ajukan konsultasi',
      },
      contact: {
        address: 'Kabupaten Bandung, Indonesia',
        phone: '085770579485',
        email: 'muhammadmashfukh123@gmail.com',
        telHref: 'tel:085770579485',
        mailHref: 'mailto:muhammadmashfukh123@gmail.com',
        whatsappHref: 'https://wa.me/6285770579485',
      },
      scheduleNotes: [
        'Format pelaksanaan kelas dapat disesuaikan dengan kebutuhan program dan konfirmasi tim penyelenggara.',
        'Informasi pembayaran dan kebutuhan administratif peserta akan diinformasikan setelah proses pendaftaran diterima.',
        'Tim kami akan melakukan follow-up melalui email atau telepon setelah formulir pendaftaran dikirim.',
      ],
    },
  },
  {
    slug: 'profile',
    title: 'Profil perusahaan',
    content: {
      about:
        'MASFITA TECH hadir untuk membantu organisasi membangun program pelatihan dan konsultansi yang lebih terstruktur, komunikatif, dan siap dipresentasikan ke berbagai pemangku kepentingan.',
      vision:
        'Menjadi mitra terpercaya untuk pengembangan kompetensi, kepatuhan, dan sistem manajemen yang berdampak nyata pada kinerja organisasi.',
      mission: [
        'Menyusun layanan pelatihan yang relevan dengan kebutuhan operasional perusahaan.',
        'Menghadirkan informasi perusahaan yang rapi, kredibel, dan mudah diakses calon klien.',
        'Mendorong proses administrasi pelatihan agar lebih cepat, jelas, dan terdokumentasi.',
      ],
      legalities: [
        'Profil legalitas dan perizinan perusahaan',
        'Dokumen sertifikat dan akreditasi penting',
        'Ringkasan kepatuhan yang mudah dibaca calon klien',
      ],
      experts: [
        {
          name: 'Tim konsultansi sistem manajemen',
          focus: 'Penguatan proses, kesiapan audit, dan implementasi kebijakan internal.',
        },
        {
          name: 'Koordinator program pelatihan',
          focus: 'Perencanaan kelas, koordinasi peserta, dan sinkronisasi kebutuhan perusahaan.',
        },
        {
          name: 'Tim pendukung operasional',
          focus: 'Dokumentasi, jadwal, kebutuhan administrasi, dan tindak lanjut program.',
        },
      ],
      projects: [
        'Pendampingan penyusunan program pelatihan internal perusahaan',
        'Pengelolaan kelas publik dan inhouse untuk kebutuhan peningkatan kompetensi',
        'Penyusunan materi presentasi profil dan legalitas untuk kebutuhan penawaran bisnis',
      ],
      certifications: [
        'Dokumen legalitas perusahaan',
        'Sertifikat pendukung program pelatihan',
        'Arsip akreditasi dan bukti kompetensi yang dapat ditampilkan pada halaman profil',
      ],
    },
  },
  {
    slug: 'contact',
    title: 'Kontak',
    content: {
      contactInfo: {
        address: 'Kabupaten Bandung, Indonesia',
        phone: '085770579485',
        email: 'muhammadmashfukh123@gmail.com',
        telHref: 'tel:085770579485',
        mailHref: 'mailto:muhammadmashfukh123@gmail.com',
        whatsappHref: 'https://wa.me/6285770579485',
      },
      cards: [
        {
          title: 'Ajukan penawaran',
          description:
            'Cocok untuk kebutuhan perusahaan yang ingin menjalankan pelatihan untuk tim secara terstruktur.',
        },
        {
          title: 'Diskusi program',
          description:
            'Gunakan kontak ini untuk menyusun program, jadwal, atau format kelas yang lebih sesuai kebutuhan Anda.',
        },
        {
          title: 'Konsultasi legalitas',
          description:
            'Sorot kebutuhan legalitas, dokumen, atau informasi pendukung yang penting untuk proses penawaran dan kerja sama.',
        },
        {
          title: 'Follow-up peserta',
          description:
            'Setelah form pendaftaran dikirim, tim dapat memanfaatkan halaman ini untuk jalur komunikasi lanjutan dengan peserta.',
        },
      ],
    },
  },
  {
    slug: 'career',
    title: 'Karir',
    content: {
      intro:
        'Kami membuka ruang kolaborasi bagi talenta yang tertarik di area training operations, pengembangan bisnis, dan administrasi program.',
      openings: [
        {
          title: 'Training Operations Coordinator',
          type: 'Full-time',
          location: 'Bandung / Hybrid',
          summary:
            'Mengelola jadwal kelas, koordinasi peserta, kebutuhan trainer, dan kelengkapan dokumen pelatihan.',
        },
        {
          title: 'Business Development Executive',
          type: 'Full-time',
          location: 'Bandung / On-site',
          summary:
            'Mengembangkan peluang kerja sama, menindaklanjuti permintaan penawaran, dan membangun pipeline klien.',
        },
        {
          title: 'Program Administration Support',
          type: 'Contract',
          location: 'Remote',
          summary:
            'Mendukung administrasi peserta, publikasi jadwal, dan penyiapan materi komunikasi program.',
        },
      ],
    },
  },
  {
    slug: 'gallery',
    title: 'Galeri',
    content: {
      items: [
        'Dokumentasi kelas publik dan inhouse',
        'Momen presentasi materi dan sesi diskusi peserta',
        'Sorotan aktivitas pelatihan untuk kebutuhan promosi perusahaan',
        'Visual pendukung untuk memperkuat kepercayaan calon klien',
        'Konten event, workshop, dan pendampingan implementasi',
        'Arsip media yang nantinya dapat dihubungkan ke CMS/upload manager',
      ],
    },
  },
  {
    slug: 'skp-license',
    title: 'SKP & Lisensi',
    content: {
      intro:
        'Halaman ini menyoroti layanan pendukung terkait legalitas, lisensi, dan dokumen yang sering menjadi faktor kepercayaan dalam proses penawaran maupun tindak lanjut komersial.',
      offerings: [
        'Highlight legalitas dan kepatuhan perusahaan',
        'Pendampingan administrasi dokumen pendukung program',
        'Komunikasi nilai layanan untuk kebutuhan pengajuan vendor dan follow-up bisnis',
      ],
    },
  },
] as const;

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'ChangeMe123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? 'admin@example.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: process.env.ADMIN_EMAIL ?? 'admin@example.com',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: 'software-engineering' },
    update: {},
    create: {
      name: 'Software Engineering',
      slug: 'software-engineering',
      description: 'Backend and architecture training tracks.',
    },
  });

  const training = await prisma.training.upsert({
    where: { slug: 'nodejs-fastify-prisma' },
    update: {},
    create: {
      categoryId: category.id,
      title: 'Node.js API with Fastify and Prisma',
      slug: 'nodejs-fastify-prisma',
      description: 'Build production-grade backend APIs using Fastify and Prisma.',
      price: 2500000,
      status: PublishStatus.PUBLISHED,
    },
  });

  await prisma.schedule.create({
    data: {
      trainingId: training.id,
      title: 'Batch May 2026',
      startDate: new Date('2026-05-12T09:00:00.000Z'),
      endDate: new Date('2026-05-13T17:00:00.000Z'),
      location: 'Jakarta',
      quota: 30,
      status: ScheduleStatus.OPEN,
    },
  });

  await prisma.article.upsert({
    where: { slug: 'why-fastify-for-backend' },
    update: {},
    create: {
      authorId: admin.id,
      title: 'Why Fastify for Backend Services',
      slug: 'why-fastify-for-backend',
      excerpt: 'Fast startup, low overhead, and excellent plugin system.',
      content: 'Fastify is a strong option for high-performance Node.js APIs with robust type support.',
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  for (const page of publicPages) {
    await prisma.publicPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content,
      },
      create: {
        slug: page.slug,
        title: page.title,
        content: page.content,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
