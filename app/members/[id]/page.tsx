"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Member, Rank, Permission, UpdateMemberInput } from "@/lib/types";
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

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateMemberInput>({});

  useEffect(() => {
    loadMember();
  }, [id]);

  async function loadMember() {
    try {
      setLoading(true);
      const data = await membersApi.getById(id);
      setMember(data);
      setFormData({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        rank: data.rank,
        permissions: data.permissions,
      });
    } catch (err) {
      setError("メンバーの読み込みに失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await membersApi.update(id, formData);
      router.push("/members");
    } catch (err) {
      alert("更新に失敗しました");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handlePermissionChange(permission: Permission) {
    const currentPermissions = formData.permissions || [];
    setFormData((prev) => ({
      ...prev,
      permissions: currentPermissions.includes(permission)
        ? currentPermissions.filter((p) => p !== permission)
        : [...currentPermissions, permission],
    }));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500">{error || "メンバーが見つかりません"}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">
            メンバー編集
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <img
                src={formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "")}&background=random`}
                alt={formData.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">
                  作成日: {new Date(member.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                名前
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
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
                value={formData.email || ""}
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
                value={formData.avatar || ""}
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
                value={formData.rank || "bronze"}
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
                      checked={(formData.permissions || []).includes(
                        permission.value
                      )}
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
              <Button type="submit" disabled={saving}>
                {saving ? "保存中..." : "保存"}
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
