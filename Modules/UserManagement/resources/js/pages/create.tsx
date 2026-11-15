import AppLayout from '@/layouts/app-layout';
import UserForm from '../components/user-form';

export default function Create() {
    return (
        <AppLayout title="Tambah User">
            <UserForm />
        </AppLayout>
    );
}
