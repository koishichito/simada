"use client";

import { useState } from "react";
import {
  pipelineCandidates,
  positions,
  clinics,
  stageLabels,
} from "@/lib/data";
import type { PipelineCandidate, ActivityLogEntry } from "@/lib/data";
import { CloseIcon, PlusIcon, ArrowRightIcon } from "@/components/Icons";

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
      className={`bg-white rounded-lg border p-3 hover:border-gray-300 transition-colors cursor-pointer ${
        isUrgent ? "border-red-200" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-medium text-sm text-gray-900">
          {candidate.doctorName}
        </span>
        <span className="text-xs text-gray-400">{pipelineDays}日</span>
      </div>
      <p className="text-xs text-gray-500 mb-2">{candidate.positionTitle}</p>

      <div className={`rounded-md p-2 ${isUrgent ? "bg-red-50" : "bg-gray-50"}`}>
        <p className={`text-xs ${isUrgent ? "text-red-700 font-medium" : "text-gray-600"}`}>
          {candidate.nextAction}
        </p>
        {deadlineDays !== null && (
          <p className={`text-xs mt-0.5 ${isUrgent ? "text-red-500" : "text-gray-400"}`}>
            {deadlineDays <= 0 ? "期限超過" : `残${deadlineDays}日`}
          </p>
        )}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 pb-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-lg text-gray-900">
                  {candidate.doctorName}
                </h3>
                {candidate.qualificationVerified ? (
                  <span className="text-xs text-green-600">資格確認済</span>
                ) : (
                  <span className="text-xs text-amber-600">資格未確認</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {candidate.positionTitle} / {candidate.clinicName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Stage progress */}
          <div className="mb-4">
            <div className="flex items-center gap-0.5">
              {stages.map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center">
                  <div className={`h-1.5 w-full rounded-full ${
                    i <= currentStageIdx ? "bg-indigo-500" : "bg-gray-200"
                  }`} />
                  <span className={`text-[9px] mt-1 leading-tight text-center ${
                    i === currentStageIdx
                      ? "text-indigo-700 font-medium"
                      : i < currentStageIdx
                      ? "text-indigo-400"
                      : "text-gray-400"
                  }`}>
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
                className={`px-4 py-2 text-sm transition-colors cursor-pointer relative ${
                  activeTab === tab
                    ? "text-gray-900 font-medium"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "overview" ? "概要" : tab === "log" ? `履歴 (${candidate.activityLog.length})` : `メモ (${candidate.notes?.length || 0})`}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Key metrics - compact */}
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-xs text-gray-400">ステージ</span>
                  <p className="font-medium text-gray-900">{stageLabels[candidate.stage]}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">日数</span>
                  <p className="font-medium text-gray-900">{pipelineDays}日</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">最終更新</span>
                  <p className="text-gray-700">{candidate.updatedAt}</p>
                </div>
              </div>

              {/* Next action */}
              <div className={`border rounded-lg p-3 ${
                isUrgent ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
              }`}>
                <p className={`text-xs font-medium mb-0.5 ${isUrgent ? "text-red-500" : "text-gray-500"}`}>
                  次のアクション
                  {candidate.nextActionDeadline && (
                    <span className="ml-2">
                      (期限: {candidate.nextActionDeadline}
                      {deadlineDays !== null && (deadlineDays <= 0 ? " 超過" : ` 残${deadlineDays}日`)})
                    </span>
                  )}
                </p>
                <p className={`text-sm font-medium ${isUrgent ? "text-red-800" : "text-gray-800"}`}>
                  {candidate.nextAction}
                </p>
              </div>

              {/* Position info */}
              {position && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                  <p className="text-xs font-medium text-gray-500 mb-1">ポジション情報</p>
                  <p className="text-gray-800">{position.title} ({position.employmentType})</p>
                  <p className="text-gray-600">{position.salary}</p>
                  {position.workSchedule && <p className="text-xs text-gray-500">{position.workSchedule}</p>}
                  {clinic && (
                    <p className="text-xs text-gray-400 pt-1">{clinic.name} / {clinic.type} / {clinic.area}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "log" && (
            <div className="relative">
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-200" />
              <div className="space-y-0">
                {[...candidate.activityLog].reverse().map((entry, i) => (
                  <div key={i} className="relative pl-7 pb-4 last:pb-0">
                    <div className={`absolute left-1 top-1 w-3 h-3 rounded-full border-2 border-white ${
                      i === 0 ? "bg-indigo-500" : "bg-gray-300"
                    }`} />
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-gray-400">{entry.date}</span>
                      <span className="text-xs text-gray-500">{actorLabels[entry.actor]}</span>
                    </div>
                    <p className="text-sm text-gray-800">{entry.action}</p>
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
                <ul className="space-y-2">
                  {candidate.notes.map((note, i) => (
                    <li key={i} className="text-sm text-gray-700 pl-3 border-l-2 border-gray-200 py-0.5">
                      {note}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">メモがありません</p>
              )}
              <div className="mt-4">
                <textarea
                  placeholder="メモを追加..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none"
                />
                <button className="mt-2 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-200 cursor-pointer">
                  追加
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 pt-0 mt-auto">
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            {currentStageIdx < stages.length - 1 && (
              <button
                onClick={onAdvance}
                className="flex-1 bg-indigo-600 text-white text-sm py-2.5 rounded-lg hover:bg-indigo-700 cursor-pointer font-medium flex items-center justify-center gap-2"
              >
                {stageLabels[stages[currentStageIdx + 1]]}へ進める
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900">新規募集作成</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded-lg"><CloseIcon /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">ポジション名</label>
            <input type="text" placeholder="例：消化器内科医（常勤）" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">専門科</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100">
                <option>消化器内科</option><option>整形外科</option><option>麻酔科</option><option>皮膚科</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">緊急度</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100">
                <option value="high">急募</option><option value="medium">通常</option><option value="low">低</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">必須資格</label>
            <input type="text" placeholder="例：内科専門医、消化器病専門医" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">報酬</label>
            <input type="text" placeholder="例：年収1,800〜2,200万円" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">募集理由</label>
            <textarea placeholder="なぜこのポジションが必要なのか" rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none" />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button className="flex-1 bg-indigo-600 text-white text-sm py-2.5 rounded-lg hover:bg-indigo-700 cursor-pointer font-medium">作成</button>
          <button onClick={onClose} className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer">キャンセル</button>
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
  const urgentActions = candidates.filter((c) => {
    if (!c.nextActionDeadline) return false;
    return daysUntil(c.nextActionDeadline) <= 2;
  }).length;
  const placed = candidates.filter((c) => c.stage === "placed" || c.stage === "follow_up").length;

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Pipeline OS</h1>
          <p className="text-sm text-gray-500">採用パイプライン管理</p>
        </div>
        <button
          onClick={() => setShowCreator(true)}
          className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700 cursor-pointer flex items-center gap-1.5 font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          新規募集
        </button>
      </div>

      {/* Stats - 3 only */}
      <div className="flex gap-3 mb-5">
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 min-w-[100px]">
          <div className="text-xl font-semibold text-gray-900">{totalActive}</div>
          <div className="text-xs text-gray-500">進行中</div>
        </div>
        <div className={`rounded-lg border px-4 py-3 min-w-[100px] ${urgentActions > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
          <div className={`text-xl font-semibold ${urgentActions > 0 ? "text-red-600" : "text-gray-900"}`}>{urgentActions}</div>
          <div className="text-xs text-gray-500">期限間近</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 min-w-[100px]">
          <div className="text-xl font-semibold text-gray-900">{placed}</div>
          <div className="text-xs text-gray-500">決定済</div>
        </div>
      </div>

      {/* Position filter */}
      <div className="flex items-center gap-1.5 mb-4">
        <button
          onClick={() => setFilterPosition("all")}
          className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
            filterPosition === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          全て
        </button>
        {positions.filter((p) => candidates.some((c) => c.positionId === p.id)).map((pos) => (
          <button
            key={pos.id}
            onClick={() => setFilterPosition(pos.id)}
            className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
              filterPosition === pos.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {pos.title}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {stages.map((stage) => {
            const stageCandidates = filteredCandidates.filter((c) => c.stage === stage);
            const isCurrent = stageCandidates.length > 0;
            return (
              <div key={stage} className="w-56 flex-shrink-0">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className={`text-xs font-medium ${isCurrent ? "text-gray-700" : "text-gray-400"}`}>
                    {stageLabels[stage]}
                  </span>
                  {stageCandidates.length > 0 && (
                    <span className="text-xs text-gray-400 bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center">
                      {stageCandidates.length}
                    </span>
                  )}
                </div>
                <div className="space-y-2 min-h-[160px] bg-gray-50 rounded-lg p-2">
                  {stageCandidates.map((c) => (
                    <KanbanCard
                      key={c.id}
                      candidate={c}
                      onClick={() => setSelectedCandidate(c)}
                    />
                  ))}
                  {stageCandidates.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-gray-300 text-xs">
                      --
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Position list */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">募集ポジション一覧</h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {positions.map((pos) => {
            const posCandidates = candidates.filter((c) => c.positionId === pos.id);
            const clinic = clinics.find((c) => c.id === pos.clinicId);
            return (
              <div key={pos.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-8 rounded-full ${
                    pos.urgency === "high" ? "bg-red-500" : pos.urgency === "medium" ? "bg-amber-400" : "bg-gray-300"
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{pos.title}</span>
                      {pos.urgency === "high" && <span className="text-xs text-red-600">急募</span>}
                    </div>
                    <p className="text-xs text-gray-500">
                      {pos.clinicName}{clinic?.type ? ` (${clinic.type})` : ""} / {pos.salary}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">{posCandidates.length}名</span>
                  <div className="flex gap-0.5">
                    {stages.map((s) => {
                      const count = posCandidates.filter((c) => c.stage === s).length;
                      return (
                        <div
                          key={s}
                          className={`w-3 h-3 rounded-full ${
                            count > 0 ? "bg-indigo-500" : "bg-gray-200"
                          }`}
                          title={`${stageLabels[s]}: ${count}名`}
                        />
                      );
                    })}
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
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
