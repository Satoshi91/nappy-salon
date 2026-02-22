"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rank, Permission, CreateMemberInput } from "@/lib/types";
import { membersApi } from "@/lib/api";
import { Card, CardHeader, CardContent, Button } from "@/components";

const ranks: { value: Rank; label: string }[] = [
  { value: "bronze", label: "ブロンズ" },
  { value: "silver", label: "シルバー" },
  { value: "gold", label: "ゴールド" },
];

const permissions: { value: Permission; label: string }[] = [
  { value: "admin", label: "管理者" },
  { value: "content_manage", label: "コンテンツ管理" },
];

export default function NewMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMemberInput>({
    name: "",
    email: "",
    avatar: "",
    rank: "bronze",
    permissions: [],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await membersApi.create(formData);
      router.push("/members");
    } catch (err) {
      alert("作成に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handlePermissionChange(permission: Permission) {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">
            新規メンバー追加
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                名前
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                アバターURL（任意）
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ランク
              </label>
              <select
                value={formData.rank}
                onChange={(e) =>
                  setFormData({ ...formData, rank: e.target.value as Rank })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {ranks.map((rank) => (
                  <option key={rank.value} value={rank.value}>
                    {rank.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                権限
              </label>
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <label
                    key={permission.value}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.value)}
                      onChange={() => handlePermissionChange(permission.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {permission.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "作成中..." : "作成"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
