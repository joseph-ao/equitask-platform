import api from './axios';

export interface UserOption {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

export async function getUsers(): Promise<UserOption[]> {
    const response = await api.get<UserOption[]>('/api/users');
    return response.data;
}