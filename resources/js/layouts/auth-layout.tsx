import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Head title={title} />
            <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="mb-1 text-center text-xl font-bold text-indigo-600">SiPustaka</h1>
                <h2 className="mb-5 text-center text-sm text-slate-500">{title}</h2>
                {children}
            </div>
        </div>
    );
}
