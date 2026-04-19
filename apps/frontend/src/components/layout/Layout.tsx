import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { siteContent } from '../../lib/site-content';
import { clearStoredSession, getStoredSession, validateStoredSession } from '../../services/auth';

const navigation = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil' },
  { to: '/pelatihan', label: 'Pelatihan' },
  { to: '/jadwal', label: 'Jadwal' },
  { to: '/skp-lisensi', label: 'SKP & Lisensi' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/artikel', label: 'Artikel' },
  { to: '/karir', label: 'Karir' },
  { to: '/kontak', label: 'Kontak' },
];

function navigationClassName(isActive: boolean) {
  return isActive
    ? 'text-primary-600'
    : 'text-slate-600 hover:text-primary-600';
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="page-shell flex items-center justify-between gap-6 py-4">
        <Link to="/" className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-500">
            {siteContent.brand.name}
          </div>
          <div className="mt-1 max-w-xl text-sm text-slate-500">{siteContent.brand.tagline}</div>
        </Link>

        <button
          type="button"
          className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 lg:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          Menu
        </button>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${navigationClassName(isActive)}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-3">
            <Link to="/admin/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600">
              Login
            </Link>
            <a
              href={siteContent.contact.telHref}
              className="rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600"
            >
              Konsultasi
            </a>
          </div>
        </nav>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="page-shell flex flex-col gap-2 py-4">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
            >
              Login admin
            </Link>
            <a
              href={siteContent.contact.telHref}
              className="rounded-2xl bg-primary-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-600"
            >
              Hubungi kami
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="page-shell grid gap-10 py-14 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-100">
              {siteContent.brand.name}
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-white">{siteContent.brand.tagline}</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">{siteContent.brand.summary}</p>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <h3 className="text-base font-semibold text-white">Kontak</h3>
          <p>{siteContent.contact.address}</p>
          <a href={siteContent.contact.telHref} className="block hover:text-white">
            {siteContent.contact.phone}
          </a>
          <a href={siteContent.contact.mailHref} className="block hover:text-white">
            {siteContent.contact.email}
          </a>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <h3 className="text-base font-semibold text-white">Navigasi</h3>
          <div className="grid gap-2">
            {navigation.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function AdminRouteGuard() {
  const session = getStoredSession();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (!session?.token) {
        if (active) {
          setAllowed(false);
          setChecking(false);
        }
        return;
      }

      const validatedSession = await validateStoredSession();

      if (!active) {
        return;
      }

      setAllowed(Boolean(validatedSession?.token));
      setChecking(false);
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [session?.token]);

  if (checking) {
    return <div className="page-shell py-10 text-sm text-slate-500">Memverifikasi sesi admin...</div>;
  }

  if (!allowed) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

const adminNavigation = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/trainings', label: 'Trainings' },
  { to: '/admin/schedules', label: 'Schedules' },
  { to: '/admin/participants', label: 'Participants' },
  { to: '/admin/articles', label: 'Articles' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    const session = getStoredSession();
    setUserName(session?.user.name ?? 'Admin');
  }, []);

  function handleLogout() {
    clearStoredSession();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-white">
        <div className="page-shell flex items-center justify-between gap-6 py-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-500">Admin panel</div>
            <div className="mt-1 text-sm text-slate-500">{userName}</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary-200 hover:text-primary-600"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="page-shell grid gap-8 py-10 lg:grid-cols-[260px_1fr] lg:items-start">
        <aside className="card-surface p-4">
          <div className="mb-4 px-3 pt-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Modul</div>
          <nav className="grid gap-2">
            {adminNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
