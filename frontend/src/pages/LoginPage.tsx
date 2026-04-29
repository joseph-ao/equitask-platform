import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await loginUser(email, password);
            login(user);
            navigate('/workload');
        } catch {
            setError('Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-2 bg-white">

            {/* keft side*/}
            <div className="relative overflow-hidden">
                <img
                    src="/logingif.gif"  
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                    className="absolute bottom-0 left-0 right-0 p-10"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-md bg-white/20 relative flex-shrink-0">
                            <span className="absolute left-[8px] top-[6px] w-[3px] h-[12px] bg-white rounded-sm" />
                            <span className="absolute left-[13px] top-[10px] w-[3px] h-[8px] bg-white rounded-sm" />
                        </div>
                        <span className="text-white font-semibold text-[15px]">Equitask</span>
                    </div>
                    <p className="text-white font-semibold text-2xl leading-snug mb-2">
                        Distribute tasks equally,<br />and fairly.
                    </p>
                    <p className="text-white/70 text-sm">
                        See how loaded every team member really is.
                    </p>
                </div>
            </div>

            {/*right side*/}
            <div className="flex items-center justify-center p-14">
                <div className="w-full max-w-sm">
                    <h2 className="text-[22px] font-semibold tracking-tight text-zinc-900 mb-1">Welcome back</h2>
                    <p className="text-sm text-zinc-400 mb-7">Sign in to your team workspace</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[12.5px] font-medium text-zinc-700 mb-1.5">Email</label>
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
                                placeholder="you@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-[12.5px] font-medium text-zinc-700 mb-1.5">Password</label>
                            <input
                                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-[10px] rounded-md text-sm font-medium text-white transition disabled:opacity-50 mt-2"
                            style={{ background: 'oklch(0.52 0.18 295)' }}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                    <p className="mt-4 text-xs text-zinc-400 text-center">Use your registered credentials to sign in</p>
                </div>
            </div>

        </div>
    );
}