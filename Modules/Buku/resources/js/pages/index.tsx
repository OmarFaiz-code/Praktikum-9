import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import type { Paginated, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import type { BukuData } from '../components/buku-form';

export default function Index({ buku, filters }: { buku: Paginated<BukuData & { id: number }>; filters: { q: string } }) {
    const isAdmin = usePage<SharedData>().props.auth.user?.role === 'admin';
    const [q, setQ] = useState(filters.q);

    const search = (e: FormEvent) => {
        e.preventDefault();
        router.get('/buku', { q }, { preserveState: true });
    };

    const hapus = (id: number) => {
        if (confirm('Yakin ingin menghapus buku ini?')) router.delete(`/buku/${id}`);
    };

    return (
        <AppLayout title="Data Buku">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <form onSubmit={search} className="flex gap-2">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari judul / penulis / penerbit"
                        className="w-72 rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button className="rounded-md bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-900">Cari</button>
                </form>
                {isAdmin && (
                    <Link href="/buku/create" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        + Tambah Buku
                    </Link>
                )}
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Judul</th>
                            <th className="px-4 py-2">Penulis</th>
                            <th className="px-4 py-2">Penerbit</th>
                            <th className="px-4 py-2">Tahun</th>
                            <th className="px-4 py-2">Stok</th>
                            {isAdmin && <th className="px-4 py-2">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {buku.data.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                                    Data buku tidak ditemukan.
                                </td>
                            </tr>
                        )}
                        {buku.data.map((b, i) => (
                            <tr key={b.id} className="border-t border-slate-100">
                                <td className="px-4 py-2">{(buku.from ?? 1) + i}</td>
                                <td className="px-4 py-2">{b.judul}</td>
                                <td className="px-4 py-2">{b.penulis}</td>
                                <td className="px-4 py-2">{b.penerbit}</td>
                                <td className="px-4 py-2">{b.tahun_terbit}</td>
                                <td className="px-4 py-2">{b.stok}</td>
                                {isAdmin && (
                                    <td className="px-4 py-2">
                                        <Link href={`/buku/${b.id}/edit`} className="mr-3 text-indigo-600 hover:underline">
                                            Ubah
                                        </Link>
                                        <button onClick={() => hapus(b.id)} className="text-red-600 hover:underline">
                                            Hapus
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={buku.links} />
        </AppLayout>
    );
}
