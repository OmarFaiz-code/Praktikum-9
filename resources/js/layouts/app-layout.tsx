import type { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardList, LogOut, Users } from 'lucide-react';
import type { ReactNode } from 'react';

interface NavItem {
    title: string;
    href: string;
    match: string;
    roles: Array<'admin' | 'user'>;
}

// Menu sidebar. Kolom "roles" menentukan siapa yang boleh melihat menu tsb.
const navItems: NavItem[] = [
    { title: 'Buku', href: '/buku', match: '/buku', roles: ['admin', 'user'] },
    { title: 'Peminjaman', href: '/peminjaman', match: '/peminjaman', roles: ['admin', 'user'] },
    { title: 'Kelola User', href: '/admin/users', match: '/admin/users', roles: ['admin'] },
];

const icons: Record<string, ReactNode> = {
    '/buku': <BookOpen size={18} />,
    '/peminjaman': <ClipboardList size={18} />,
    '/admin/users': <Users size={18} />,
};

export default function AppLayout({ title, children }: { title: string; children: ReactNode }) {
    // shared props dari HandleInertiaRequests: auth.user.role dan flash
    const { auth, flash, name } = usePage<SharedData>().props;
    const url = usePage().url;
    const user = auth.user;

    const visibleItems = navItems.filter((item) => user && item.roles.includes(user.role));

    return (
        <div className="flex min-h-screen">
            <Head title={title} />

            <aside className="flex w-60 flex-col border-r border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4 text-lg font-bold text-indigo-600">
                    {name || 'SiPustaka'}
                </div>

                <nav className="flex-1 space-y-1 p-3">
                    {visibleItems.map((item) => {
                        const active = url.startsWith(item.match);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {icons[item.match]}
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-200 p-3 text-sm">
                    <div className="mb-2 px-1">
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-xs text-slate-500">
                            {user?.email} &middot; {user?.role}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6">
                <h1 className="mb-4 text-2xl font-semibold">{title}</h1>

                {flash?.success && (
                    <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                        {flash.error}
                    </div>
                )}

                {children}
            </main>
        </div>
    );
}
