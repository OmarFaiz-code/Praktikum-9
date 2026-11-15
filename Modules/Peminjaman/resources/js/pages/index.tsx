import Field, { inputClass } from '@/components/field';
import AppLayout from '@/layouts/app-layout';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';

interface Peminjaman {
    id: number;
    nama_peminjam: string;
    judul_buku: string;
    tanggal_pinjam: string;
    tanggal_kembali: string | null;
    status: 'Dipinjam' | 'Dikembalikan';
    bukti: string | null;
    bukti_url: string | null;
}

type Errors = Record<string, string[]>;

const emptyForm = {
    nama_peminjam: '',
    judul_buku: '',
    tanggal_pinjam: '',
    tanggal_kembali: '',
    status: 'Dipinjam',
};

// Header untuk fetch(): CSRF token dari meta tag + minta respons JSON
// (Accept: application/json membuat Laravel mengembalikan error 422 sebagai JSON)
function headers(): HeadersInit {
    const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
    return { 'X-CSRF-TOKEN': token, Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };
}

export default function Index() {
    const [rows, setRows] = useState<Peminjaman[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState<number | null>(null);
    const [currentBukti, setCurrentBukti] = useState<string | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // GET data (AJAX): isi tabel tanpa refresh halaman
    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/peminjaman/data', { headers: headers() });
            const json = await res.json();
            setRows(json.data);
        } catch {
            setMessage({ type: 'error', text: 'Gagal memuat data peminjaman.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setCurrentBukti(null);
        setErrors({});
        if (fileRef.current) fileRef.current.value = '';
    };

    // Ambil satu data lewat fetch lalu isi form untuk diedit
    const startEdit = async (id: number) => {
        const res = await fetch(`/peminjaman/${id}`, { headers: headers() });
        const { data } = (await res.json()) as { data: Peminjaman };
        setForm({
            nama_peminjam: data.nama_peminjam,
            judul_buku: data.judul_buku,
            tanggal_pinjam: data.tanggal_pinjam,
            tanggal_kembali: data.tanggal_kembali ?? '',
            status: data.status,
        });
        setEditId(id);
        setCurrentBukti(data.bukti_url);
        setErrors({});
        setMessage(null);
        if (fileRef.current) fileRef.current.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // POST (tambah) / PUT (ubah) memakai FormData supaya bisa upload file
    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        setMessage(null);

        const body = new FormData();
        Object.entries(form).forEach(([k, v]) => body.append(k, v));
        const file = fileRef.current?.files?.[0];
        if (file) body.append('bukti', file);
        // Laravel tidak membaca PUT dengan multipart, jadi dikirim sebagai POST + _method
        if (editId) body.append('_method', 'PUT');

        try {
            const res = await fetch(editId ? `/peminjaman/${editId}` : '/peminjaman', {
                method: 'POST',
                headers: headers(),
                body,
            });
            const json = await res.json();
            if (res.status === 422) {
                setErrors(json.errors); // pesan error validasi tampil di bawah input
                return;
            }
            if (!res.ok) throw new Error(json.message);
            setMessage({ type: 'success', text: json.message });
            resetForm();
            await load();
        } catch {
            setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan data.' });
        } finally {
            setSaving(false);
        }
    };

    // DELETE lewat fetch
    const hapus = async (id: number) => {
        if (!confirm('Yakin ingin menghapus data peminjaman ini?')) return;
        const res = await fetch(`/peminjaman/${id}`, { method: 'DELETE', headers: headers() });
        const json = await res.json();
        setMessage({ type: res.ok ? 'success' : 'error', text: json.message });
        if (editId === id) resetForm();
        await load();
    };

    const set = (key: keyof typeof emptyForm, value: string) => setForm((f) => ({ ...f, [key]: value }));
    const err = (key: string) => errors[key]?.[0];

    return (
        <AppLayout title="Data Peminjaman">
            {message && (
                <div
                    className={`mb-4 rounded-md border px-4 py-2 text-sm ${
                        message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={submit} className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="mb-3 font-semibold">{editId ? 'Ubah Peminjaman' : 'Tambah Peminjaman'}</h2>
                <div className="grid gap-x-4 md:grid-cols-2">
                    <Field label="Nama Peminjam" error={err('nama_peminjam')}>
                        <input className={inputClass} value={form.nama_peminjam} onChange={(e) => set('nama_peminjam', e.target.value)} />
                    </Field>
                    <Field label="Judul Buku" error={err('judul_buku')}>
                        <input className={inputClass} value={form.judul_buku} onChange={(e) => set('judul_buku', e.target.value)} />
                    </Field>
                    <Field label="Tanggal Pinjam" error={err('tanggal_pinjam')}>
                        <input type="date" className={inputClass} value={form.tanggal_pinjam} onChange={(e) => set('tanggal_pinjam', e.target.value)} />
                    </Field>
                    <Field label="Tanggal Kembali" error={err('tanggal_kembali')}>
                        <input type="date" className={inputClass} value={form.tanggal_kembali} onChange={(e) => set('tanggal_kembali', e.target.value)} />
                    </Field>
                    <Field label="Status" error={err('status')}>
                        <select className={inputClass} value={form.status} onChange={(e) => set('status', e.target.value)}>
                            <option value="Dipinjam">Dipinjam</option>
                            <option value="Dikembalikan">Dikembalikan</option>
                        </select>
                    </Field>
                    <Field label="Bukti Peminjaman (jpg/png/pdf, maks 2 MB)" error={err('bukti')}>
                        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className={inputClass} />
                        {currentBukti && (
                            <p className="mt-1 text-xs text-slate-500">
                                File saat ini:{' '}
                                <a href={currentBukti} target="_blank" className="text-indigo-600 hover:underline">
                                    lihat
                                </a>{' '}
                                (kosongkan jika tidak diganti)
                            </p>
                        )}
                    </Field>
                </div>
                <div className="flex gap-2">
                    <button disabled={saving} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                        {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    {editId && (
                        <button type="button" onClick={resetForm} className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
                            Batal
                        </button>
                    )}
                </div>
            </form>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Peminjam</th>
                            <th className="px-4 py-2">Judul Buku</th>
                            <th className="px-4 py-2">Tgl Pinjam</th>
                            <th className="px-4 py-2">Tgl Kembali</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Bukti</th>
                            <th className="px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                                    Memuat data...
                                </td>
                            </tr>
                        )}
                        {!loading && rows.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                                    Belum ada data peminjaman.
                                </td>
                            </tr>
                        )}
                        {rows.map((r, i) => (
                            <tr key={r.id} className="border-t border-slate-100">
                                <td className="px-4 py-2">{i + 1}</td>
                                <td className="px-4 py-2">{r.nama_peminjam}</td>
                                <td className="px-4 py-2">{r.judul_buku}</td>
                                <td className="px-4 py-2">{r.tanggal_pinjam}</td>
                                <td className="px-4 py-2">{r.tanggal_kembali ?? '-'}</td>
                                <td className="px-4 py-2">{r.status}</td>
                                <td className="px-4 py-2">
                                    {r.bukti_url ? (
                                        <a href={r.bukti_url} target="_blank" className="text-indigo-600 hover:underline">
                                            Lihat
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    <button onClick={() => startEdit(r.id)} className="mr-3 text-indigo-600 hover:underline">
                                        Ubah
                                    </button>
                                    <button onClick={() => hapus(r.id)} className="text-red-600 hover:underline">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
