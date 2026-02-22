"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateContentInput, ContentRank } from "@/lib/types";
import { contentsApi } from "@/lib/api";
import { Card, CardHeader, CardContent, Button } from "@/components";
import { useAuth } from "@/lib/auth-context";
import { CONTENT_RANKS, getRankLabel } from "@/lib/rank-utils";

export default function NewContentPage() {
  const router = useRouter();
  const { currentUser, hasPermission, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateContentInput, "authorId">>({
    title: "",
    body: "",
    thumbnail: "",
    requiredRank: "guest",
  });

  const canManageContent = hasPermission("content_manage");

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!canManageContent) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-500 text-lg">
              コンテンツを作成する権限がありません
            </p>
            <p className="text-gray-500 mt-2">
              「コンテンツ管理」権限を持つメンバーのみが作成できます
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => router.back()}
            >
              戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      await contentsApi.create({
        ...formData,
        authorId: currentUser.id,
      });
      router.push("/");
    } catch (err) {
      alert("作成に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">
            新規コンテンツ作成
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タイトル
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="コンテンツのタイトル"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                サムネイルURL（任意）
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                閲覧に必要なランク
              </label>
              <select
                value={formData.requiredRank}
                onChange={(e) =>
                  setFormData({ ...formData, requiredRank: e.target.value as ContentRank })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {CONTENT_RANKS.map((rank) => (
                  <option key={rank} value={rank}>
                    {getRankLabel(rank)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                選択したランク以上のメンバーのみが閲覧できます
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                本文
              </label>
              <textarea
                required
                rows={10}
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="コンテンツの本文を入力..."
              />
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
