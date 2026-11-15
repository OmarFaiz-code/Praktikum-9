import AppLayout from '@/layouts/app-layout';
import UserForm, { type UserData } from '../components/user-form';

export default function Edit({ user }: { user: UserData }) {
    return (
        <AppLayout title="Ubah User">
            <UserForm user={user} />
        </AppLayout>
    );
}
