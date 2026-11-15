import type { PaginationLink } from '@/types';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) return null;

    return (
        <div className="mt-4 flex flex-wrap gap-1">
            {links.map((link, i) => {
                // label dari Laravel berisi entitas HTML (&laquo; Previous)
                const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');
                const base = 'rounded border px-3 py-1 text-sm';

                if (!link.url) {
                    return (
                        <span key={i} className={`${base} border-slate-200 text-slate-400`}>
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        preserveScroll
                        className={`${base} ${
                            link.active
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-300 bg-white hover:bg-slate-100'
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}
