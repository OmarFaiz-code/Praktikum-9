import { Head, Link } from '@inertiajs/react';

// Halaman error (dipakai untuk 403 dari bootstrap/app.php)
export default function ErrorPage({ status, message }: { status: number; message: string }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <Head title={`Error ${status}`} />
            <div className="text-6xl font-bold text-indigo-600">{status}</div>
            <p className="mt-3 text-lg">{message}</p>
            <Link href="/buku" className="mt-5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                Kembali ke beranda
            </Link>
        </div>
    );
}
