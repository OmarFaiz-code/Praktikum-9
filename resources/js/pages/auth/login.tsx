import Field, { inputClass } from '@/components/field';
import AuthLayout from '@/layouts/auth-layout';
import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/login'); // route disediakan Fortify
    };

    return (
        <AuthLayout title="Login">
            <form onSubmit={submit}>
                <Field label="Email" error={errors.email}>
                    <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} autoFocus />
                </Field>
                <Field label="Password" error={errors.password}>
                    <input type="password" className={inputClass} value={data.password} onChange={(e) => setData('password', e.target.value)} />
                </Field>
                <label className="mb-4 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                    Ingat saya
                </label>
                <button disabled={processing} className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                    Login
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
                Belum punya akun?{' '}
                <Link href="/register" className="text-indigo-600 hover:underline">
                    Daftar
                </Link>
            </p>
        </AuthLayout>
    );
}
