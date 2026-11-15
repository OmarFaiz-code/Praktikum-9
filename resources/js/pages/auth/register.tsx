import Field, { inputClass } from '@/components/field';
import AuthLayout from '@/layouts/auth-layout';
import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/register'); // route disediakan Fortify; role otomatis 'user'
    };

    return (
        <AuthLayout title="Daftar Akun">
            <form onSubmit={submit}>
                <Field label="Nama" error={errors.name}>
                    <input className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                </Field>
                <Field label="Email" error={errors.email}>
                    <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                </Field>
                <Field label="Password" error={errors.password}>
                    <input type="password" className={inputClass} value={data.password} onChange={(e) => setData('password', e.target.value)} />
                </Field>
                <Field label="Konfirmasi Password">
                    <input type="password" className={inputClass} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                </Field>
                <button disabled={processing} className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                    Daftar
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-indigo-600 hover:underline">
                    Login
                </Link>
            </p>
        </AuthLayout>
    );
}
