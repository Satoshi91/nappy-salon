"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Content, Member } from "@/lib/types";
import { contentsApi, membersApi } from "@/lib/api";
import { Card, CardContent, Button, RankBadge } from "@/components";
import { useAuth } from "@/lib/auth-context";
import { Pencil, Trash2 } from "lucide-react";

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { hasPermission } = useAuth();

  const [content, setContent] = useState<Content | null>(null);
  const [author, setAuthor] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canManageContent = hasPermission("content_manage");

  async function handleDelete() {
    if (!confirm("このコンテンツを削除しますか？")) return;
    
    setDeleting(true);
    try {
      await contentsApi.delete(id);
      router.push("/");
    } catch (err) {
      console.error("Failed to delete content:", err);
      alert("削除に失敗しました");
      setDeleting(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, [id]);

  async function loadContent() {
    try {
      setLoading(true);
      const contentData = await contentsApi.getById(id);
      setContent(contentData);

      try {
        const authorData = await membersApi.getById(contentData.authorId);
        setAuthor(authorData);
      } catch {
        console.log("Author not found");
      }
    } catch (err) {
      setError("コンテンツの読み込みに失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500">
          {error || "コンテンツが見つかりません"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/">
          <Button variant="secondary" size="sm">
            ← 一覧に戻る
          </Button>
        </Link>
      </div>

      {content.thumbnail && (
        <img
          src={content.thumbnail}
          alt={content.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
        />
      )}

      <Card>
        <CardContent>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {content.title}
            </h1>
            {canManageContent && (
              <Link href={`/contents/${content.id}/edit`}>
                <Button size="sm">編集</Button>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            {author && (
              <div className="flex items-center gap-3">
                <img
                  src={author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random&size=40`}
                  alt={author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {author.name}
                    </span>
                    <RankBadge rank={author.rank} size="sm" />
                  </div>
                  <span className="text-sm text-gray-500">
                    {author.email}
                  </span>
                </div>
              </div>
            )}
            <div className="ml-auto text-sm text-gray-500">
              <div>
                作成: {new Date(content.createdAt).toLocaleDateString("ja-JP")}
              </div>
              {content.updatedAt !== content.createdAt && (
                <div>
                  更新: {new Date(content.updatedAt).toLocaleDateString("ja-JP")}
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {content.body}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
