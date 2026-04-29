import { useEffect, useState } from 'react';
import { getUsers, createUser, deleteUser, type UserOption } from '../api/users';

const ROLE_BADGE: Record<string, string> = {
    Admin:      'bg-violet-100 text-violet-700',
    TeamLeader: 'bg-blue-100 text-blue-700',
    Member:     'bg-zinc-100 text-zinc-600',
};

const AVATAR_COLORS = [
    'bg-violet-100 text-violet-700', 'bg-orange-100 text-orange-700',
    'bg-teal-100 text-teal-700',     'bg-pink-100 text-pink-700',
    'bg-sky-100 text-sky-700',       'bg-amber-100 text-amber-700',
    'bg-lime-100 text-lime-700',     'bg-rose-100 text-rose-700',
];

function initials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function UsersPanel({ onClose }: { onClose: () => void }) {
    const [users, setUsers] = useState<UserOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Member');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getUsers().then(setUsers).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 2500);
        return () => clearTimeout(t);
    }, [toast]);

    const resetForm = () => {
        setFullName(''); setEmail(''); setPassword('');
        setRole('Member'); setError(''); setShowForm(false);
    };

    const handleCreate = async () => {
        if (!fullName || !email || !password) {
            setError('All fields are required.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const newUser = await createUser({ fullName, email, password, role });
            setUsers(prev => [...prev, newUser]);
            setToast(`${newUser.fullName} created`);
            resetForm();
        } catch {
            setError('Failed to create user. Email may already exist.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (user: UserOption) => {
        const confirmed = window.confirm(`Delete ${user.fullName}? This cannot be undone.`);
        if (!confirmed) return;
        setDeletingId(user.id);
        try {
            await deleteUser(user.id);
            setUsers(prev => prev.filter(u => u.id !== user.id));
            setToast(`${user.fullName} deleted`);
        } catch {
            setToast('Failed to delete user.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end"
             style={{ background: 'rgba(24,24,27,0.25)', backdropFilter: 'blur(2px)' }}
             onClick={onClose}>
            <div className="bg-white h-full w-[520px] max-w-full flex flex-col shadow-2xl"
                 onClick={e => e.stopPropagation()}>

                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
                    <div>
                        <div className="text-[11px] font-medium text-violet-600 uppercase tracking-widest mb-0.5">Admin</div>
                        <div className="font-semibold text-[15px]">User management</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setShowForm(!showForm); setError(''); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white"
                            style={{ background: 'oklch(0.52 0.18 295)' }}>
                            {showForm ? 'Cancel' : '+ Create user'}
                        </button>
                        <button onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 transition text-lg">
                            ✕
                        </button>
                    </div>
                </div>

                {/* form  */}
                {showForm && (
                    <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex flex-col gap-3">
                        <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-widest">New user</div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">{error}</div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11.5px] font-medium text-zinc-600 mb-1">Full name</label>
                                <input value={fullName} onChange={e => setFullName(e.target.value)}
                                       className="w-full border border-zinc-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 bg-white"
                                       placeholder="Jane Smith" />
                            </div>
                            <div>
                                <label className="block text-[11.5px] font-medium text-zinc-600 mb-1">Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                       className="w-full border border-zinc-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 bg-white"
                                       placeholder="jane@equitask.com" />
                            </div>
                            <div>
                                <label className="block text-[11.5px] font-medium text-zinc-600 mb-1">Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                       className="w-full border border-zinc-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 bg-white"
                                       placeholder="Min 6 chars + number" />
                            </div>
                            <div>
                                <label className="block text-[11.5px] font-medium text-zinc-600 mb-1">Role</label>
                                <select value={role} onChange={e => setRole(e.target.value)}
                                        className="w-full border border-zinc-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-violet-500 bg-white">
                                    <option value="Member">Member</option>
                                    <option value="TeamLeader">Team Leader</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <button disabled={submitting || !fullName || !email || !password}
                                onClick={handleCreate}
                                className="self-end px-4 py-1.5 rounded-md text-sm font-medium text-white disabled:opacity-40 transition"
                                style={{ background: 'oklch(0.52 0.18 295)' }}>
                            {submitting ? 'Creating...' : 'Create user'}
                        </button>
                    </div>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-4 px-6 py-3 border-b border-zinc-100 bg-white">
                    {[
                        { label: 'Total',        value: users.length },
                        { label: 'Members',      value: users.filter(u => u.role === 'Member').length },
                        { label: 'Team Leaders', value: users.filter(u => u.role === 'TeamLeader').length },
                        { label: 'Admins',       value: users.filter(u => u.role === 'Admin').length },
                    ].map(s => (
                        <div key={s.label} className="text-center">
                            <div className="text-[18px] font-semibold mono">{s.value}</div>
                            <div className="text-[11px] text-zinc-400">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {loading ? (
                        <div className="text-sm text-zinc-400 py-8 text-center">Loading users...</div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {users.map((user, idx) => (
                                <div key={user.id}
                                     className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white transition">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                                        {initials(user.fullName)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13.5px] font-medium text-zinc-900 truncate">{user.fullName}</div>
                                        <div className="text-[11.5px] text-zinc-400 truncate">{user.email}</div>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${ROLE_BADGE[user.role] ?? 'bg-zinc-100 text-zinc-600'}`}>
                    {user.role === 'TeamLeader' ? 'Team Leader' : user.role}
                  </span>
                                    {user.id !== 'admin-001' && (
                                        <button
                                            disabled={deletingId === user.id}
                                            onClick={() => handleDelete(user)}
                                            className="text-xs text-red-400 hover:text-red-600 font-medium disabled:opacity-40 transition flex-shrink-0">
                                            {deletingId === user.id ? '...' : 'Delete'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {toast && (
                    <div className="mx-6 mb-4 bg-zinc-900 text-white text-[13px] font-medium px-4 py-2.5 rounded-lg text-center">
                        ✓ {toast}
                    </div>
                )}
            </div>
        </div>
    );
}