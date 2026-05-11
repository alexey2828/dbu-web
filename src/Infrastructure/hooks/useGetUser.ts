import { useMemo } from "react";

export interface IUser {
    token: string
    user: any
    role: string
}
export const useGetUser = (): IUser | null => {

    const userString = localStorage.getItem("user");

    if (!userString) return null;

    try {
        return JSON.parse(userString) as IUser;
    } catch {
        return null;
    }
};