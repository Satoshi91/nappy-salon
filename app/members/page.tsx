"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Member, Rank } from "@/lib/types";
import { membersApi } from "@/lib/api";
import { Card, CardContent, Button, RankBadge, PermissionBadge } from "@/components";
import { Pencil, Trash2 } from "lucide-react";

const RANK_OPTIONS: { value: Rank; label: string }[] = [
  { value: "bronze", label: "ブロンズ" },
  { value: "silver", label: "シルバー" },
  { value: "gold", label: "ゴールド" },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRanks, setSelectedRanks] = useState<Rank[]>([]);

  const filteredMembers = useMemo(() => {
    if (selectedRanks.length === 0) {
      return members;
    }
    return members.filter((member) => selectedRanks.includes(member.rank));
  }, [members, selectedRanks]);

  const toggleRank = (rank: Rank) => {
    setSelectedRanks((prev) =>
      prev.includes(rank)
        ? prev.filter((r) => r !== rank)
        : [...prev, rank]
    );
  };

  const clearFilter = () => {
    setSelectedRanks([]);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      setLoading(true);
      const data = await membersApi.getAll();
      setMembers(data);
    } catch (err) {
      setError("メンバーの読み込みに失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("このメンバーを削除しますか？")) return;
    try {
      await membersApi.delete(id);
      setMembers(members.filter((m) => m.id !== id));
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          メンバー管理
        </h1>
        <Link href="/members/new">
          <Button>新規メンバー追加</Button>
        </Link>
      </div>

      {/* ランクフィルター */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ランクで絞り込み:
            </span>
            <div className="flex flex-wrap gap-3">
              {RANK_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedRanks.includes(option.value)}
                    onChange={() => toggleRank(option.value)}
                    className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <RankBadge rank={option.value} size="sm" />
                </label>
              ))}
            </div>
            {selectedRanks.length > 0 && (
              <button
                onClick={clearFilter}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
              >
                クリア
              </button>
            )}
            {selectedRanks.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredMembers.length}件表示
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              {members.length === 0
                ? "メンバーがいません"
                : "該当するメンバーがいません"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {member.name}
                      </h2>
                      <RankBadge rank={member.rank} size="sm" />
                    </div>
                    <p className="text-sm text-gray-500">
                      {member.email}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {member.permissions.map((permission) => (
                        <PermissionBadge key={permission} permission={permission} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/members/${member.id}`}>
                    <button
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="編集"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  </Link>
                  <button
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="削除"
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
