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

export async function createUser(data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
}): Promise<UserOption> {
    const response = await api.post<UserOption>('/api/users/create', data);
    return response.data;
}

export async function deleteUser(id: string): Promise<void> {
    await api.delete(`/api/users/${id}`);
}