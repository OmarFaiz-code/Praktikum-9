import AppLayout from '@/layouts/app-layout';
import BukuForm, { type BukuData } from '../components/buku-form';

export default function Edit({ buku }: { buku: BukuData }) {
    return (
        <AppLayout title="Ubah Buku">
            <BukuForm buku={buku} />
        </AppLayout>
    );
}
