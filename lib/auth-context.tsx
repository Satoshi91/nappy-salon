"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Member, Permission, ContentRank } from "./types";
import { membersApi } from "./api";
import { canAccessContent } from "./rank-utils";

const STORAGE_KEY = "nappy-salon-user-id";

interface AuthContextType {
  currentUser: Member | null;
  login: (name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithMember: (member: Member) => void;
  register: (name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  canAccessRank: (requiredRank: ContentRank) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    const savedUserId = localStorage.getItem(STORAGE_KEY);
    if (savedUserId) {
      try {
        const member = await membersApi.getById(savedUserId);
        setCurrentUser(member);
      } catch (err) {
        console.error("Failed to restore session:", err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }

  function saveToStorage(member: Member) {
    localStorage.setItem(STORAGE_KEY, member.id);
  }

  function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
  }

  async function login(name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const member = await membersApi.getByName(name);
      if (member) {
        setCurrentUser(member);
        saveToStorage(member);
        return { success: true };
      } else {
        return { success: false, error: "メンバーが見つかりません" };
      }
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: "ログインに失敗しました" };
    }
  }

  async function register(name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const existing = await membersApi.getByName(name);
      if (existing) {
        return { success: false, error: "このメンバー名は既に使用されています" };
      }
      const newMember = await membersApi.create({
        name,
        email: "",
        rank: "bronze",
        permissions: [],
      });
      setCurrentUser(newMember);
      saveToStorage(newMember);
      return { success: true };
    } catch (err) {
      console.error("Registration failed:", err);
      return { success: false, error: "登録に失敗しました" };
    }
  }

  function loginWithMember(member: Member) {
    setCurrentUser(member);
    saveToStorage(member);
  }

  function logout() {
    setCurrentUser(null);
    clearStorage();
  }

  function hasPermission(permission: Permission): boolean {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  }

  function canAccessRank(requiredRank: ContentRank): boolean {
    return canAccessContent(currentUser?.rank || null, requiredRank);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, login, loginWithMember, register, logout, hasPermission, canAccessRank, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
