import Field, { inputClass } from '@/components/field';
import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export interface BukuData {
    id?: number;
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number | string;
    stok: number | string;
}

// Form dipakai bersama oleh halaman create dan edit
export default function BukuForm({ buku }: { buku?: BukuData }) {
    const { data, setData, post, put, processing, errors } = useForm({
        judul: buku?.judul ?? '',
        penulis: buku?.penulis ?? '',
        penerbit: buku?.penerbit ?? '',
        tahun_terbit: String(buku?.tahun_terbit ?? ''),
        stok: String(buku?.stok ?? 0),
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (buku?.id) put(`/buku/${buku.id}`);
        else post('/buku');
    };

    return (
        <form onSubmit={submit} className="max-w-xl rounded-lg border border-slate-200 bg-white p-5">
            <Field label="Judul" error={errors.judul}>
                <input className={inputClass} value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
            </Field>
            <Field label="Penulis" error={errors.penulis}>
                <input className={inputClass} value={data.penulis} onChange={(e) => setData('penulis', e.target.value)} />
            </Field>
            <Field label="Penerbit" error={errors.penerbit}>
                <input className={inputClass} value={data.penerbit} onChange={(e) => setData('penerbit', e.target.value)} />
            </Field>
            <Field label="Tahun Terbit" error={errors.tahun_terbit}>
                <input type="number" className={inputClass} value={data.tahun_terbit} onChange={(e) => setData('tahun_terbit', e.target.value)} />
            </Field>
            <Field label="Stok" error={errors.stok}>
                <input type="number" className={inputClass} value={data.stok} onChange={(e) => setData('stok', e.target.value)} />
            </Field>
            <div className="flex gap-2">
                <button disabled={processing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                    Simpan
                </button>
                <Link href="/buku" className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
                    Batal
                </Link>
            </div>
        </form>
    );
}
