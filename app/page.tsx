"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Content, Member, ContentRank } from "@/lib/types";
import { contentsApi, membersApi } from "@/lib/api";
import { Card, CardContent, Button, RankBadge, LoginModal } from "@/components";
import { AccessDeniedModal } from "@/components/AccessDeniedModal";
import { useAuth } from "@/lib/auth-context";

type ViewMode = "card" | "list";

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { hasPermission, canAccessRank, currentUser } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [members, setMembers] = useState<Map<string, Member>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [accessDeniedModal, setAccessDeniedModal] = useState<{
    isOpen: boolean;
    requiredRank: ContentRank;
  }>({ isOpen: false, requiredRank: "guest" });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const canManageContent = hasPermission("content_manage");

  function handleContentClick(content: Content) {
    const requiredRank = content.requiredRank || "guest";
    if (canAccessRank(requiredRank)) {
      router.push(`/contents/${content.id}`);
    } else {
      setAccessDeniedModal({ isOpen: true, requiredRank });
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [contentsData, membersData] = await Promise.all([
        contentsApi.getAll(),
        membersApi.getAll(),
      ]);
      setContents(contentsData);
      const membersMap = new Map<string, Member>();
      membersData.forEach((m) => membersMap.set(m.id, m));
      setMembers(membersMap);
    } catch (err) {
      setError("コンテンツの読み込みに失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("このコンテンツを削除しますか？")) return;
    try {
      await contentsApi.delete(id);
      setContents(contents.filter((c) => c.id !== id));
    } catch (err) {
      alert("削除に失敗しました");
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          コンテンツ一覧
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "card"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="カードビュー"
            >
              <GridIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="リストビュー"
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
          {canManageContent && (
            <Link href="/contents/new">
              <Button>新規コンテンツ作成</Button>
            </Link>
          )}
        </div>
      </div>

      {contents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              コンテンツがありません
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "card" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contents.map((content) => {
            const author = members.get(content.authorId);
            const requiredRank = content.requiredRank || "guest";
            return (
              <Card
                key={content.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleContentClick(content)}
              >
                <div className="relative">
                  {content.thumbnail && (
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  {!content.thumbnail && (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {content.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <RankBadge rank={requiredRank} size="sm" />
                  </div>
                </div>
                <CardContent>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {content.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                    {content.body}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {author && (
                        <>
                          <img
                            src={author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random&size=24`}
                            alt={author.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-gray-600">
                            {author.name}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-gray-400">
                      {new Date(content.createdAt).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  {canManageContent && (
                    <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/contents/${content.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          編集
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(content.id)}
                      >
                        削除
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {contents.map((content) => {
            const author = members.get(content.authorId);
            const requiredRank = content.requiredRank || "guest";
            return (
              <Card
                key={content.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleContentClick(content)}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="relative flex-shrink-0">
                    {content.thumbnail ? (
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center rounded-lg">
                        <span className="text-white text-2xl font-bold">
                          {content.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                      {content.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {content.body}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
                      <RankBadge rank={requiredRank} size="sm" />
                      {author && (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random&size=24`}
                            alt={author.name}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-gray-600">
                            {author.name}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-400">
                        {new Date(content.createdAt).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                  </div>
                  {canManageContent && (
                    <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/contents/${content.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          編集
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(content.id)}
                      >
                        削除
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AccessDeniedModal
        isOpen={accessDeniedModal.isOpen}
        onClose={() => setAccessDeniedModal({ ...accessDeniedModal, isOpen: false })}
        requiredRank={accessDeniedModal.requiredRank}
        currentRank={currentUser?.rank || null}
        onLoginClick={() => setShowLoginModal(true)}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
