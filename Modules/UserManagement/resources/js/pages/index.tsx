import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import type { Paginated, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import type { UserData } from '../components/user-form';

export default function Index({ users }: { users: Paginated<UserData & { id: number }> }) {
    const me = usePage<SharedData>().props.auth.user;

    const hapus = (id: number) => {
        if (confirm('Yakin ingin menghapus user ini?')) router.delete(`/admin/users/${id}`);
    };

    return (
        <AppLayout title="Kelola User">
            <div className="mb-4 flex justify-end">
                <Link href="/admin/users/create" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    + Tambah User
                </Link>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Nama</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((u, i) => (
                            <tr key={u.id} className="border-t border-slate-100">
                                <td className="px-4 py-2">{(users.from ?? 1) + i}</td>
                                <td className="px-4 py-2">{u.name}</td>
                                <td className="px-4 py-2">{u.email}</td>
                                <td className="px-4 py-2">{u.role}</td>
                                <td className="px-4 py-2">
                                    <Link href={`/admin/users/${u.id}/edit`} className="mr-3 text-indigo-600 hover:underline">
                                        Ubah
                                    </Link>
                                    {/* admin tidak boleh menghapus akunnya sendiri */}
                                    {u.id !== me?.id && (
                                        <button onClick={() => hapus(u.id)} className="text-red-600 hover:underline">
                                            Hapus
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={users.links} />
        </AppLayout>
    );
}
