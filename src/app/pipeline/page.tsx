"use client";

import { useState } from "react";
import {
  pipelineCandidates,
  positions,
  clinics,
  stageLabels,
} from "@/lib/data";
import type { PipelineCandidate, ActivityLogEntry } from "@/lib/data";
import {
  X, Plus, ArrowRight, Clock, CheckCircle2, AlertCircle,
  Building2, ChevronRight
} from "lucide-react";

const stages: PipelineCandidate["stage"][] = [
  "sourced", "interested", "interview", "negotiation", "offer", "placed", "follow_up",
];

const actorLabels: Record<ActivityLogEntry["actor"], string> = {
  system: "SYS", clinic: "医院", doctor: "医師", admin: "管理",
};

function daysAgo(dateStr: string): number {
  return Math.floor((new Date("2026-03-14").getTime() - new Date(dateStr).getTime()) / 864e5);
}
function daysUntil(dateStr: string): number {
  return Math.floor((new Date(dateStr).getTime() - new Date("2026-03-14").getTime()) / 864e5);
}

function KanbanCard({ candidate, onClick }: { candidate: PipelineCandidate; onClick: () => void }) {
  const deadlineDays = candidate.nextActionDeadline ? daysUntil(candidate.nextActionDeadline) : null;
  const isUrgent = deadlineDays !== null && deadlineDays <= 2;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border p-2.5 cursor-pointer transition-all hover:shadow-sm ${
        isUrgent ? "border-red-200 hover:border-red-300" : "border-gray-150 hover:border-gray-250"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-900">{candidate.doctorName}</span>
        {candidate.qualificationVerified ? (
          <CheckCircle2 size={12} className="text-green-500" />
        ) : (
          <AlertCircle size={12} className="text-amber-400" />
        )}
      </div>
      <p className="text-[11px] text-gray-400 mb-1.5 truncate">{candidate.positionTitle}</p>
      <p className={`text-[11px] leading-snug ${isUrgent ? "text-red-600" : "text-gray-500"}`}>
        {candidate.nextAction}
      </p>
      {deadlineDays !== null && (
        <div className="flex items-center gap-1 mt-1.5 text-[10px]">
          <Clock size={10} className={isUrgent ? "text-red-400" : "text-gray-400"} />
          <span className={isUrgent ? "text-red-500 font-medium" : "text-gray-400"}>
            {deadlineDays <= 0 ? "超過" : `残${deadlineDays}日`}
          </span>
        </div>
      )}
    </div>
  );
}

function CandidateDetail({ candidate, onClose, onAdvance }: { candidate: PipelineCandidate; onClose: () => void; onAdvance: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "log" | "notes">("overview");
  const currentStageIdx = stages.indexOf(candidate.stage);
  const pipelineDays = daysAgo(candidate.createdAt);
  const deadlineDays = candidate.nextActionDeadline ? daysUntil(candidate.nextActionDeadline) : null;
  const isUrgent = deadlineDays !== null && deadlineDays <= 2;
  const position = positions.find((p) => p.id === candidate.positionId);
  const clinic = position ? clinics.find((c) => c.id === position.clinicId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 pb-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-gray-900">{candidate.doctorName}</span>
                {candidate.qualificationVerified ? (
                  <CheckCircle2 size={14} className="text-green-500" />
                ) : (
                  <AlertCircle size={14} className="text-amber-400" />
                )}
              </div>
              <p className="text-xs text-gray-500">{candidate.positionTitle} / {candidate.clinicName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-md hover:bg-gray-100"><X size={16} /></button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-0.5 mb-3">
            {stages.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center">
                <div className={`h-1 w-full rounded-full ${i <= currentStageIdx ? "bg-indigo-500" : "bg-gray-100"}`} />
                <span className={`text-[9px] mt-1 ${i === currentStageIdx ? "text-indigo-600 font-medium" : "text-gray-400"}`}>
                  {stageLabels[s]}
                </span>
              </div>
            ))}
          </div>

          <div className="flex border-b border-gray-100">
            {(["overview", "log", "notes"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-xs cursor-pointer relative ${activeTab === tab ? "text-gray-900 font-medium" : "text-gray-400 hover:text-gray-600"}`}>
                {tab === "overview" ? "概要" : tab === "log" ? `履歴 (${candidate.activityLog.length})` : `メモ (${candidate.notes?.length || 0})`}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 overflow-y-auto flex-1">
          {activeTab === "overview" && (
            <div className="space-y-3">
              <div className="flex gap-4 text-xs">
                <div><span className="text-gray-400">ステージ</span><p className="font-medium text-gray-900 mt-0.5">{stageLabels[candidate.stage]}</p></div>
                <div><span className="text-gray-400">経過日数</span><p className="font-medium text-gray-900 mt-0.5">{pipelineDays}日</p></div>
                <div><span className="text-gray-400">更新</span><p className="text-gray-700 mt-0.5">{candidate.updatedAt}</p></div>
              </div>

              <div className={`rounded-lg p-3 ${isUrgent ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
                <div className="flex items-center gap-1 mb-0.5">
                  <Clock size={12} className={isUrgent ? "text-red-500" : "text-gray-400"} />
                  <span className={`text-[11px] ${isUrgent ? "text-red-500 font-medium" : "text-gray-400"}`}>
                    次のアクション
                    {candidate.nextActionDeadline && ` (${candidate.nextActionDeadline}${deadlineDays !== null && deadlineDays <= 0 ? " 超過" : ""})`}
                  </span>
                </div>
                <p className={`text-sm ${isUrgent ? "text-red-800 font-medium" : "text-gray-800"}`}>{candidate.nextAction}</p>
              </div>

              {position && (
                <div className="bg-gray-50/80 rounded-lg p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Building2 size={12} />
                    <span>{position.clinicName} ({position.clinicType || clinic?.type})</span>
                  </div>
                  <p className="text-gray-600 pl-4">{position.employmentType} / {position.salary}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "log" && (
            <div className="relative">
              <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gray-100" />
              {[...candidate.activityLog].reverse().map((entry, i) => (
                <div key={i} className="relative pl-5 pb-3 last:pb-0">
                  <div className={`absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-white ${i === 0 ? "bg-indigo-500" : "bg-gray-200"}`} />
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] text-gray-400 tabular-nums">{entry.date}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1 py-px rounded">{actorLabels[entry.actor]}</span>
                  </div>
                  <p className="text-xs text-gray-800">{entry.action}</p>
                  {entry.detail && <p className="text-[11px] text-gray-500 mt-0.5">{entry.detail}</p>}
                </div>
              ))}
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              {candidate.notes && candidate.notes.length > 0 ? (
                <ul className="space-y-1.5">
                  {candidate.notes.map((note, i) => (
                    <li key={i} className="text-xs text-gray-700 pl-3 border-l-2 border-gray-200 py-0.5">{note}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 text-center py-6">メモがありません</p>
              )}
              <div className="mt-3">
                <textarea placeholder="メモを追加..." rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none" />
                <button className="mt-1.5 text-xs text-gray-500 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer">追加</button>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-100">
          <div className="flex gap-2">
            {currentStageIdx < stages.length - 1 && (
              <button onClick={onAdvance} className="flex-1 bg-indigo-600 text-white text-xs py-2 rounded-lg hover:bg-indigo-700 cursor-pointer font-medium flex items-center justify-center gap-1.5">
                {stageLabels[stages[currentStageIdx + 1]]}へ進める <ArrowRight size={12} />
              </button>
            )}
            <button onClick={onClose} className="px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer">閉じる</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PositionCreator({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">新規募集作成</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-md hover:bg-gray-100"><X size={16} /></button>
        </div>
        <div className="space-y-2.5">
          <div>
            <label className="text-[11px] text-gray-500 block mb-1">ポジション名</label>
            <input type="text" placeholder="例：消化器内科医（常勤）" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">専門科</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100">
                <option>消化器内科</option><option>整形外科</option><option>麻酔科</option><option>皮膚科</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">緊急度</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100">
                <option>急募</option><option>通常</option><option>低</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 block mb-1">報酬</label>
            <input type="text" placeholder="例：年収1,800〜2,200万円" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 block mb-1">募集理由</label>
            <textarea placeholder="なぜこのポジションが必要なのか" rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-indigo-600 text-white text-xs py-2 rounded-lg hover:bg-indigo-700 cursor-pointer font-medium">作成</button>
          <button onClick={onClose} className="px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer">キャンセル</button>
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
    setCandidates((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const idx = stages.indexOf(c.stage);
      if (idx >= stages.length - 1) return c;
      return { ...c, stage: stages[idx + 1] };
    }));
    setSelectedCandidate(null);
    setToast("ステージを進めました");
    setTimeout(() => setToast(null), 2000);
  };

  const filteredCandidates = filterPosition === "all" ? candidates : candidates.filter((c) => c.positionId === filterPosition);
  const totalActive = candidates.filter((c) => c.stage !== "placed" && c.stage !== "follow_up").length;
  const urgentActions = candidates.filter((c) => c.nextActionDeadline && daysUntil(c.nextActionDeadline) <= 2).length;
  const placed = candidates.filter((c) => c.stage === "placed" || c.stage === "follow_up").length;

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Pipeline OS</h1>
          <p className="text-xs text-gray-400">採用パイプライン管理</p>
        </div>
        <button onClick={() => setShowCreator(true)} className="bg-indigo-600 text-white text-xs px-2.5 py-1.5 rounded-md hover:bg-indigo-700 cursor-pointer flex items-center gap-1 font-medium">
          <Plus size={12} /> 新規募集
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-2 mb-4">
        <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
          <div className="text-lg font-semibold text-gray-900 tabular-nums">{totalActive}</div>
          <div className="text-[11px] text-gray-400">進行中</div>
        </div>
        <div className={`rounded-lg border px-3 py-2 ${urgentActions > 0 ? "bg-red-50 border-red-100" : "bg-white border-gray-100"}`}>
          <div className={`text-lg font-semibold tabular-nums ${urgentActions > 0 ? "text-red-600" : "text-gray-900"}`}>{urgentActions}</div>
          <div className="text-[11px] text-gray-400">期限間近</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
          <div className="text-lg font-semibold text-gray-900 tabular-nums">{placed}</div>
          <div className="text-[11px] text-gray-400">決定済</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 mb-3">
        <button onClick={() => setFilterPosition("all")} className={`text-[11px] px-2.5 py-1 rounded-md cursor-pointer transition-colors ${filterPosition === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>全て</button>
        {positions.filter((p) => candidates.some((c) => c.positionId === p.id)).map((pos) => (
          <button key={pos.id} onClick={() => setFilterPosition(pos.id)} className={`text-[11px] px-2.5 py-1 rounded-md cursor-pointer transition-colors ${filterPosition === pos.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            {pos.title}
          </button>
        ))}
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-3 -mx-4 px-4">
        <div className="flex gap-1.5 min-w-max">
          {stages.map((stage) => {
            const stageCandidates = filteredCandidates.filter((c) => c.stage === stage);
            const hasItems = stageCandidates.length > 0;
            return (
              <div key={stage} className="w-52 flex-shrink-0">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className={`text-[11px] font-medium ${hasItems ? "text-gray-600" : "text-gray-400"}`}>{stageLabels[stage]}</span>
                  {hasItems && <span className="text-[10px] text-gray-400 bg-gray-100 w-4 h-4 rounded-full flex items-center justify-center">{stageCandidates.length}</span>}
                </div>
                <div className="space-y-1.5 min-h-[120px] bg-gray-50/80 rounded-lg p-1.5">
                  {stageCandidates.map((c) => <KanbanCard key={c.id} candidate={c} onClick={() => setSelectedCandidate(c)} />)}
                  {!hasItems && <div className="flex items-center justify-center py-6 text-gray-300 text-[11px]">--</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Positions table */}
      <div className="mt-5">
        <p className="text-xs font-medium text-gray-500 mb-2">募集ポジション</p>
        <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
          {positions.map((pos) => {
            const posCandidates = candidates.filter((c) => c.positionId === pos.id);
            return (
              <div key={pos.id} className="px-3.5 py-2.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className={`w-1 h-6 rounded-full ${pos.urgency === "high" ? "bg-red-500" : pos.urgency === "medium" ? "bg-amber-400" : "bg-gray-200"}`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-gray-900">{pos.title}</span>
                      <UrgencyDot urgency={pos.urgency} />
                    </div>
                    <p className="text-[11px] text-gray-400">{pos.clinicName} / {pos.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-900 tabular-nums">{posCandidates.length}名</span>
                  <div className="flex gap-px">
                    {stages.map((s) => {
                      const count = posCandidates.filter((c) => c.stage === s).length;
                      return <div key={s} className={`w-2.5 h-2.5 rounded-sm ${count > 0 ? "bg-indigo-500" : "bg-gray-100"}`} title={`${stageLabels[s]}: ${count}`} />;
                    })}
                  </div>
                  <ChevronRight size={12} className="text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCandidate && <CandidateDetail candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} onAdvance={() => advanceCandidate(selectedCandidate.id)} />}
      {showCreator && <PositionCreator onClose={() => setShowCreator(false)} />}
      {toast && <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3.5 py-2 rounded-lg text-xs">{toast}</div>}
    </div>
  );
}

function UrgencyDot({ urgency }: { urgency: string }) {
  if (urgency !== "high") return null;
  return <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />;
}
