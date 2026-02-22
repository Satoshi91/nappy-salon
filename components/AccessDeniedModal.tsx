"use client";

import { ContentRank, Rank } from "@/lib/types";
import { getRankLabel } from "@/lib/rank-utils";

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredRank: ContentRank;
  currentRank: Rank | null;
  onLoginClick?: () => void;
}

export function AccessDeniedModal({
  isOpen,
  onClose,
  requiredRank,
  currentRank,
  onLoginClick,
}: AccessDeniedModalProps) {
  if (!isOpen) return null;

  const isGuest = currentRank === null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-10V4a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2h-4" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            閲覧権限がありません
          </h2>

          <p className="text-center text-gray-600 mb-6">
            このコンテンツを閲覧するには
            <span className="font-semibold text-blue-600">
              {" "}{getRankLabel(requiredRank)}{" "}
            </span>
            以上のランクが必要です。
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">現在のランク</p>
                <p className="font-medium text-gray-900">
                  {isGuest ? "非会員（未ログイン）" : getRankLabel(currentRank)}
                </p>
              </div>
              <div className="text-2xl">→</div>
              <div>
                <p className="text-sm text-gray-500">必要なランク</p>
                <p className="font-medium text-blue-600">
                  {getRankLabel(requiredRank)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {isGuest && onLoginClick && (
              <button
                onClick={() => {
                  onClose();
                  onLoginClick();
                }}
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                ログインする
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
