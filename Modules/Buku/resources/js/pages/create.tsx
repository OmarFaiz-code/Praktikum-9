import AppLayout from '@/layouts/app-layout';
import BukuForm from '../components/buku-form';

export default function Create() {
    return (
        <AppLayout title="Tambah Buku">
            <BukuForm />
        </AppLayout>
    );
}
