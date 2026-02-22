const API_URL = "https://699ab762377ac05ce28e8920.mockapi.io";

const members = [
  {
    name: "田中 太郎",
    email: "tanaka@example.com",
    avatar: "https://i.pravatar.cc/150?u=tanaka",
    rank: "gold",
    permissions: ["admin", "content_manage"],
  },
  {
    name: "佐藤 花子",
    email: "sato@example.com",
    avatar: "https://i.pravatar.cc/150?u=sato",
    rank: "silver",
    permissions: ["content_manage"],
  },
  {
    name: "鈴木 一郎",
    email: "suzuki@example.com",
    avatar: "https://i.pravatar.cc/150?u=suzuki",
    rank: "silver",
    permissions: [],
  },
  {
    name: "山田 美咲",
    email: "yamada@example.com",
    avatar: "https://i.pravatar.cc/150?u=yamada",
    rank: "bronze",
    permissions: ["content_manage"],
  },
  {
    name: "伊藤 健太",
    email: "ito@example.com",
    avatar: "https://i.pravatar.cc/150?u=ito",
    rank: "bronze",
    permissions: [],
  },
  {
    name: "渡辺 さくら",
    email: "watanabe@example.com",
    avatar: "https://i.pravatar.cc/150?u=watanabe",
    rank: "gold",
    permissions: ["content_manage"],
  },
];

async function seedMembers() {
  console.log("メンバーデータを投入中...\n");

  for (const member of members) {
    try {
      const res = await fetch(`${API_URL}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...member,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const created = await res.json();
      console.log(`✓ ${created.name} (${created.rank}) - ID: ${created.id}`);
    } catch (err) {
      console.error(`✗ ${member.name} の作成に失敗:`, err.message);
    }
  }

  console.log("\n完了!");
}

seedMembers();
