import { Permission } from "@/lib/types";

interface PermissionBadgeProps {
  permission: Permission;
}

const permissionConfig: Record<Permission, { label: string; className: string }> = {
  admin: {
    label: "管理者",
    className: "bg-red-100 text-red-800",
  },
  content_manage: {
    label: "コンテンツ管理",
    className: "bg-blue-100 text-blue-800",
  },
};

export function PermissionBadge({ permission }: PermissionBadgeProps) {
  const config = permissionConfig[permission];
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
