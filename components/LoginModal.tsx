"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/auth-context";
import { membersApi } from "@/lib/api";
import { Member } from "@/lib/types";
import { RankBadge } from "./RankBadge";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "login" | "register";

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, loginWithMember, register, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
  }, [isOpen]);

  async function loadMembers() {
    setLoadingMembers(true);
    try {
      const data = await membersApi.getAll();
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoadingMembers(false);
    }
  }

  function handleDemoLogin(member: Member) {
    loginWithMember(member);
    resetForm();
    onClose();
  }

  if (!isOpen || !mounted) return null;

  function resetForm() {
    setName("");
    setError("");
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setError("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("メンバー名を入力してください");
      return;
    }
    setError("");
    const result = await login(name.trim());
    if (result.success) {
      resetForm();
      onClose();
    } else {
      setError(result.error || "ログインに失敗しました");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("メンバー名を入力してください");
      return;
    }
    setError("");
    const result = await register(name.trim());
    if (result.success) {
      resetForm();
      onClose();
    } else {
      setError(result.error || "登録に失敗しました");
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => handleTabChange("login")}
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "login"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              ログイン
            </button>
            <button
              onClick={() => handleTabChange("register")}
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "register"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              新規登録
            </button>
          </div>

          {activeTab === "login" ? (
            <div className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-name" className="block text-sm font-medium text-gray-700 mb-1">
                    メンバー名
                  </label>
                  <input
                    id="login-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="メンバー名を入力"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "ログイン中..." : "ログイン"}
                </button>
              </form>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">デモ用ログイン</h3>
                {loadingMembers ? (
                  <p className="text-sm text-gray-500">読み込み中...</p>
                ) : members.length === 0 ? (
                  <p className="text-sm text-gray-500">メンバーがいません</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {members.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => handleDemoLogin(member)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors text-left"
                      >
                        <span className="text-sm font-medium text-gray-900">{member.name}</span>
                        <RankBadge rank={member.rank} size="sm" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
                  メンバー名
                </label>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="メンバー名を入力"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "登録中..." : "新規登録"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
