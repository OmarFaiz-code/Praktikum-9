import type { ReactNode } from 'react';

// Pembungkus label + pesan error di bawah input
export default function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">{label}</label>
            {children}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export const inputClass =
    'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';
