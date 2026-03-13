"use client";

import { useState } from "react";
import {
  pipelineCandidates,
  positions,
  clinics,
  stageLabels,
  stageColors,
} from "@/lib/data";
import type { PipelineCandidate, ActivityLogEntry } from "@/lib/data";

const stages: PipelineCandidate["stage"][] = [
  "sourced",
  "interested",
  "interview",
  "negotiation",
  "offer",
  "placed",
  "follow_up",
];

const actorLabels: Record<ActivityLogEntry["actor"], string> = {
  system: "システム",
  clinic: "医院",
  doctor: "医師",
  admin: "管理者",
};

const actorColors: Record<ActivityLogEntry["actor"], string> = {
  system: "bg-gray-100 text-gray-600",
  clinic: "bg-blue-100 text-blue-700",
  doctor: "bg-emerald-100 text-emerald-700",
  admin: "bg-purple-100 text-purple-700",
};

function daysAgo(dateStr: string): number {
  const now = new Date("2026-03-14");
  const d = new Date(dateStr);
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntil(dateStr: string): number {
  const now = new Date("2026-03-14");
  const d = new Date(dateStr);
  return Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function KanbanCard({
  candidate,
  onClick,
}: {
  candidate: PipelineCandidate;
  onClick: () => void;
}) {
  const pipelineDays = daysAgo(candidate.createdAt);
  const deadlineDays = candidate.nextActionDeadline
    ? daysUntil(candidate.nextActionDeadline)
    : null;
  const isUrgent = deadlineDays !== null && deadlineDays <= 2;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-3.5 hover:shadow-md transition-all duration-200 cursor-pointer group ${
        isUrgent ? "border-red-200 hover:border-red-300" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm text-gray-900">
          {candidate.doctorName}
        </span>
        {candidate.qualificationVerified ? (
          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            確認済
          </span>
        ) : (
          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
            未確認
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-0.5">{candidate.positionTitle}</p>
      <p className="text-xs text-gray-400 mb-2">{candidate.clinicName}</p>

      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
          {pipelineDays}日経過
        </span>
        {deadlineDays !== null && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
            isUrgent ? "bg-red-50 text-red-600 font-medium" : "bg-gray-50 text-gray-400"
          }`}>
            {deadlineDays <= 0 ? "期限超過" : `残${deadlineDays}日`}
          </span>
        )}
      </div>

      <div className={`rounded-lg p-2.5 transition-colors ${
        isUrgent ? "bg-red-50 group-hover:bg-red-100/70" : "bg-blue-50 group-hover:bg-blue-100/70"
      }`}>
        <p className={`text-[10px] mb-0.5 font-medium ${isUrgent ? "text-red-500" : "text-blue-500"}`}>
          次のアクション
        </p>
        <p className={`text-xs font-medium leading-relaxed ${isUrgent ? "text-red-700" : "text-blue-700"}`}>
          {candidate.nextAction}
        </p>
      </div>

      {candidate.notes && candidate.notes.length > 0 && (
        <p className="text-[10px] text-gray-400 mt-2 line-clamp-1 italic">
          {candidate.notes[0]}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-gray-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {candidate.activityLog.length}件の履歴
        </span>
        <span className="text-[10px] text-gray-400">{candidate.updatedAt}</span>
      </div>
    </div>
  );
}

function CandidateDetail({
  candidate,
  onClose,
  onAdvance,
}: {
  candidate: PipelineCandidate;
  onClose: () => void;
  onAdvance: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "log" | "notes">("overview");
  const currentStageIdx = stages.indexOf(candidate.stage);
  const pipelineDays = daysAgo(candidate.createdAt);
  const deadlineDays = candidate.nextActionDeadline
    ? daysUntil(candidate.nextActionDeadline)
    : null;
  const isUrgent = deadlineDays !== null && deadlineDays <= 2;

  const position = positions.find((p) => p.id === candidate.positionId);
  const clinic = position ? clinics.find((c) => c.id === position.clinicId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-xl text-gray-900">
                  {candidate.doctorName}
                </h3>
                {candidate.qualificationVerified ? (
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">資格確認済</span>
                ) : (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">資格未確認</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {candidate.positionTitle} — {candidate.clinicName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stage progress */}
          <div className="mb-4">
            <div className="flex items-center gap-0.5">
              {stages.map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-center">
                    <div
                      className={`h-2 w-full rounded-full transition-colors ${
                        i <= currentStageIdx ? "bg-emerald-500" : "bg-gray-200"
                      } ${i === currentStageIdx ? "ring-2 ring-emerald-200" : ""}`}
                    />
                  </div>
                  <span
                    className={`text-[8px] mt-1.5 leading-tight text-center ${
                      i === currentStageIdx
                        ? "text-emerald-700 font-bold"
                        : i < currentStageIdx
                        ? "text-emerald-500"
                        : "text-gray-400"
                    }`}
                  >
                    {stageLabels[s]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-100">
            {(["overview", "log", "notes"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer relative ${
                  activeTab === tab
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "overview" ? "概要" : tab === "log" ? `履歴 (${candidate.activityLog.length})` : `メモ (${candidate.notes?.length || 0})`}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-[10px] text-gray-400 block mb-0.5">現在ステージ</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${stageColors[candidate.stage]}`}>
                    {stageLabels[candidate.stage]}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-[10px] text-gray-400 block mb-0.5">パイプライン日数</span>
                  <span className="text-sm font-bold text-gray-900">{pipelineDays}日</span>
                  <span className="text-[10px] text-gray-400 ml-1">({candidate.createdAt}〜)</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-[10px] text-gray-400 block mb-0.5">最終更新</span>
                  <span className="text-sm font-medium text-gray-700">{candidate.updatedAt}</span>
                </div>
              </div>

              {/* Next action */}
              <div className={`border rounded-xl p-4 ${
                isUrgent ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isUrgent ? "text-red-500" : "text-blue-500"}`}>
                    次に押すべきアクション
                  </p>
                  {candidate.nextActionDeadline && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isUrgent ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-600"
                    }`}>
                      期限: {candidate.nextActionDeadline}
                      {deadlineDays !== null && (deadlineDays <= 0 ? "（超過）" : `（残${deadlineDays}日）`)}
                    </span>
                  )}
                </div>
                <p className={`text-sm font-semibold ${isUrgent ? "text-red-800" : "text-blue-800"}`}>
                  {candidate.nextAction}
                </p>
              </div>

              {/* Position & clinic info */}
              {position && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">募集ポジション情報</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-gray-400">ポジション</span>
                      <p className="text-gray-700 font-medium">{position.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">雇用形態</span>
                      <p className="text-gray-700 font-medium">{position.employmentType}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">報酬</span>
                      <p className="text-gray-700 font-medium">{position.salary}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">緊急度</span>
                      <p className={`font-medium ${position.urgency === "high" ? "text-red-600" : position.urgency === "medium" ? "text-amber-600" : "text-gray-600"}`}>
                        {position.urgency === "high" ? "急募" : position.urgency === "medium" ? "通常" : "新規"}
                      </p>
                    </div>
                    {position.workSchedule && (
                      <div className="col-span-2">
                        <span className="text-gray-400">勤務体制</span>
                        <p className="text-gray-700 font-medium">{position.workSchedule}</p>
                      </div>
                    )}
                  </div>
                  {clinic && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-700">{clinic.name}</span>
                        <span className="text-[10px] text-gray-400">{clinic.type}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mb-1">{clinic.area}</p>
                      {clinic.features && (
                        <div className="flex flex-wrap gap-1">
                          {clinic.features.map((f) => (
                            <span key={f} className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">{f}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "log" && (
            <div className="relative">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-200" />
              <div className="space-y-0">
                {[...candidate.activityLog].reverse().map((entry, i) => (
                  <div key={i} className="relative pl-8 pb-5 last:pb-0">
                    <div className={`absolute left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white ${
                      i === 0 ? "bg-emerald-500 ring-2 ring-emerald-100" : "bg-gray-300"
                    }`} />
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-gray-400 font-medium">{entry.date}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${actorColors[entry.actor]}`}>
                        {actorLabels[entry.actor]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 font-medium">{entry.action}</p>
                    {entry.detail && (
                      <p className="text-xs text-gray-500 mt-0.5">{entry.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              {candidate.notes && candidate.notes.length > 0 ? (
                <div className="space-y-2">
                  {candidate.notes.map((note, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-amber-50/50 border border-amber-100 rounded-xl p-3">
                      <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.784l-1.192.24a1 1 0 000 1.96l1.192.24a1 1 0 01.784.784l.24 1.192a1 1 0 001.96 0l.24-1.192a1 1 0 01.784-.784l1.192-.24a1 1 0 000-1.96l-1.192-.24a1 1 0 01-.784-.784l-.24-1.192zM7.5 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM3.5 10.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h4a.5.5 0 000-1H4z" />
                      </svg>
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  <p className="text-sm">メモがありません</p>
                </div>
              )}
              <div className="mt-4">
                <textarea
                  placeholder="メモを追加..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 resize-none"
                />
                <button className="mt-2 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-200 cursor-pointer font-medium">
                  メモを追加
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 mt-auto">
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            {currentStageIdx < stages.length - 1 && (
              <button
                onClick={onAdvance}
                className="flex-1 bg-gray-900 text-white text-sm py-2.5 rounded-xl hover:bg-gray-800 cursor-pointer font-medium flex items-center justify-center gap-2"
              >
                {stageLabels[stages[currentStageIdx + 1]]}へ進める
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PositionCreator({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-xl text-gray-900">新規募集作成</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">ポジション名</label>
            <input
              type="text"
              placeholder="例：消化器内科医（常勤）"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">専門科</label>
              <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200">
                <option>消化器内科</option>
                <option>整形外科</option>
                <option>麻酔科</option>
                <option>皮膚科</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">緊急度</label>
              <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200">
                <option value="high">急募</option>
                <option value="medium">通常</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">必須資格</label>
            <input
              type="text"
              placeholder="例：内科専門医、消化器病専門医"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">報酬</label>
            <input
              type="text"
              placeholder="例：年収1,800〜2,200万円"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">勤務体制</label>
            <input
              type="text"
              placeholder="例：月〜金 9:00-18:00、当直なし"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">募集理由（詳細）</label>
            <textarea
              placeholder="なぜこのポジションが必要なのかを記載"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button className="flex-1 bg-gray-900 text-white text-sm py-2.5 rounded-xl hover:bg-gray-800 cursor-pointer font-medium">
            作成して候補選定を開始
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [candidates, setCandidates] = useState(pipelineCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<PipelineCandidate | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [filterPosition, setFilterPosition] = useState<string>("all");

  const advanceCandidate = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = stages.indexOf(c.stage);
        if (idx >= stages.length - 1) return c;
        return { ...c, stage: stages[idx + 1] };
      })
    );
    setSelectedCandidate(null);
    setToast("ステージを進めました");
    setTimeout(() => setToast(null), 2000);
  };

  const filteredCandidates = filterPosition === "all"
    ? candidates
    : candidates.filter((c) => c.positionId === filterPosition);

  const totalActive = candidates.filter((c) => c.stage !== "placed" && c.stage !== "follow_up").length;
  const inInterview = candidates.filter((c) => c.stage === "interview").length;
  const inNegotiation = candidates.filter((c) => c.stage === "negotiation" || c.stage === "offer").length;
  const placed = candidates.filter((c) => c.stage === "placed" || c.stage === "follow_up").length;
  const urgentActions = candidates.filter((c) => {
    if (!c.nextActionDeadline) return false;
    return daysUntil(c.nextActionDeadline) <= 2;
  }).length;

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">型3</span>
            <h1 className="text-2xl font-bold text-gray-900">Pipeline OS</h1>
          </div>
          <p className="text-sm text-gray-500">
            案件進行を中心に置く型。採用進行のインフラとして低流動性でも価値を作る。
          </p>
        </div>
        <button
          onClick={() => setShowCreator(true)}
          className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-gray-800 cursor-pointer flex items-center gap-1.5 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          新規募集
        </button>
      </div>

      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex items-center gap-2">
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
        料金設計：医院向けSaaS月額 + オプション成功報酬
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalActive}</div>
              <div className="text-xs text-gray-500">進行中</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{inInterview}</div>
              <div className="text-xs text-gray-500">面談中</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{inNegotiation}</div>
              <div className="text-xs text-gray-500">条件調整〜オファー</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{placed}</div>
              <div className="text-xs text-gray-500">決定・定着</div>
            </div>
          </div>
        </div>
        <div className={`rounded-xl border p-4 ${urgentActions > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${urgentActions > 0 ? "bg-red-100" : "bg-gray-100"}`}>
              <svg className={`w-5 h-5 ${urgentActions > 0 ? "text-red-600" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className={`text-2xl font-bold ${urgentActions > 0 ? "text-red-600" : "text-gray-900"}`}>{urgentActions}</div>
              <div className="text-xs text-gray-500">期限間近</div>
            </div>
          </div>
        </div>
      </div>

      {/* Position filter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-400 font-medium">フィルタ:</span>
        <button
          onClick={() => setFilterPosition("all")}
          className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
            filterPosition === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          全て
        </button>
        {positions.filter((p) => candidates.some((c) => c.positionId === p.id)).map((pos) => (
          <button
            key={pos.id}
            onClick={() => setFilterPosition(pos.id)}
            className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
              filterPosition === pos.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {pos.title}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-3 min-w-max">
          {stages.map((stage) => {
            const stageCandidates = filteredCandidates.filter((c) => c.stage === stage);
            return (
              <div key={stage} className="w-64 flex-shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stageColors[stage]}`}>
                      {stageLabels[stage]}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center">
                    {stageCandidates.length}
                  </span>
                </div>
                <div className="space-y-2.5 min-h-[180px] bg-gray-100/60 rounded-xl p-2.5">
                  {stageCandidates.map((c) => (
                    <KanbanCard
                      key={c.id}
                      candidate={c}
                      onClick={() => setSelectedCandidate(c)}
                    />
                  ))}
                  {stageCandidates.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <svg className="w-8 h-8 mb-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span className="text-xs">該当なし</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Position list */}
      <div className="mt-8">
        <h2 className="font-bold text-gray-900 mb-4 text-lg">募集ポジション一覧</h2>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {positions.map((pos) => {
            const posCandidates = candidates.filter((c) => c.positionId === pos.id);
            const clinic = clinics.find((c) => c.id === pos.clinicId);
            return (
              <div key={pos.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-12 rounded-full ${
                      pos.urgency === "high" ? "bg-red-500" : pos.urgency === "medium" ? "bg-amber-400" : "bg-gray-300"
                    }`} />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm">{pos.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            pos.urgency === "high"
                              ? "bg-red-100 text-red-700"
                              : pos.urgency === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {pos.urgency === "high" ? "急募" : pos.urgency === "medium" ? "通常" : "新規"}
                        </span>
                        <span className="text-[10px] text-gray-400">{pos.employmentType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">
                          {pos.clinicName}
                        </p>
                        {clinic?.type && (
                          <span className="text-[10px] text-gray-400">({clinic.type})</span>
                        )}
                        <span className="text-[10px] text-gray-400">— {pos.area}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-gray-400">{pos.salary}</span>
                        {pos.workSchedule && (
                          <span className="text-[10px] text-gray-400">{pos.workSchedule}</span>
                        )}
                      </div>
                      {pos.deadline && (
                        <span className={`text-[10px] mt-0.5 inline-block ${
                          daysUntil(pos.deadline) <= 30 ? "text-red-500 font-medium" : "text-gray-400"
                        }`}>
                          募集期限: {pos.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-sm font-bold">{posCandidates.length}名</span>
                      <span className="text-xs text-gray-400 ml-1">パイプライン</span>
                      <div className="flex items-center gap-1 mt-0.5 justify-end">
                        <span className="text-[10px] text-gray-400">{pos.interestedCount}関心</span>
                        <span className="text-[10px] text-gray-300">|</span>
                        <span className="text-[10px] text-gray-400">{pos.viewCount || 0}閲覧</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {stages.map((s) => {
                        const count = posCandidates.filter((c) => c.stage === s).length;
                        return (
                          <div
                            key={s}
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                              count > 0 ? "bg-emerald-500 text-white" : "bg-gray-200"
                            }`}
                            title={`${stageLabels[s]}: ${count}名`}
                          >
                            {count > 0 ? count : ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCandidate && (
        <CandidateDetail
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onAdvance={() => advanceCandidate(selectedCandidate.id)}
        />
      )}

      {showCreator && (
        <PositionCreator onClose={() => setShowCreator(false)} />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}
