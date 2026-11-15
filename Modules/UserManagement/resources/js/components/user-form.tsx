import Field, { inputClass } from '@/components/field';
import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export interface UserData {
    id?: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export default function UserForm({ user }: { user?: UserData }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        role: user?.role ?? 'user',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (user?.id) put(`/admin/users/${user.id}`);
        else post('/admin/users');
    };

    return (
        <form onSubmit={submit} className="max-w-xl rounded-lg border border-slate-200 bg-white p-5">
            <Field label="Nama" error={errors.name}>
                <input className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} />
            </Field>
            <Field label="Email" error={errors.email}>
                <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} />
            </Field>
            <Field label={user ? 'Password (kosongkan jika tidak diganti)' : 'Password'} error={errors.password}>
                <input type="password" className={inputClass} value={data.password} onChange={(e) => setData('password', e.target.value)} />
            </Field>
            <Field label="Role" error={errors.role}>
                <select className={inputClass} value={data.role} onChange={(e) => setData('role', e.target.value as 'admin' | 'user')}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
            </Field>
            <div className="flex gap-2">
                <button disabled={processing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                    Simpan
                </button>
                <Link href="/admin/users" className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
                    Batal
                </Link>
            </div>
        </form>
    );
}
