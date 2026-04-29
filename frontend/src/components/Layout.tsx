import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import UsersPanel from './UsersPanel';

interface Props {
    title?: string;
    topRight?: ReactNode;
    children: ReactNode;
}

export default function Layout({ title, topRight, children }: Props) {
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';
    const [usersOpen, setUsersOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-14 border-b border-zinc-200 bg-white flex items-center px-6 sticky top-0 z-10 gap-3">
                    <h1 className="text-[15px] font-semibold tracking-tight">{title}</h1>
                    <div className="ml-auto flex items-center gap-2">
                        {isAdmin && (
                            <button
                                onClick={() => setUsersOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition">
                                👤 Manage users
                            </button>
                        )}
                        {topRight}
                    </div>
                </div>
                <div className="p-8 w-full max-w-[1200px]">
                    {children}
                </div>
            </div>

            {usersOpen && <UsersPanel onClose={() => setUsersOpen(false)} />}
        </div>
    );
}