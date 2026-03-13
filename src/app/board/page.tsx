"use client";

import { useState } from "react";
import { positions, doctors, clinics } from "@/lib/data";
import type { Position } from "@/lib/data";
import {
  X, Search, Bookmark, Plus, Building2, MapPin, Clock,
  Eye, Users, ChevronRight
} from "lucide-react";

function UrgencyDot({ urgency }: { urgency: Position["urgency"] }) {
  if (urgency !== "high") return null;
  return <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />;
}

function PositionDetailModal({ position, onClose }: { position: Position; onClose: () => void }) {
  const clinic = clinics.find((c) => c.id === position.clinicId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white rounded-t-xl z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-gray-900">{position.title}</h3>
              <UrgencyDot urgency={position.urgency} />
            </div>
            <p className="text-xs text-gray-500">{position.clinicName} / {position.area}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-md hover:bg-gray-100"><X size={16} /></button>
        </div>
        <div className="px-5 py-4 space-y-4 text-sm">
          {clinic && (
            <div className="bg-gray-50/80 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Building2 size={12} />
                <span>{clinic.name} ({clinic.type})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin size={12} />
                <span>{clinic.area}</span>
              </div>
              {clinic.features && <p className="text-xs text-gray-400 pl-5">{clinic.features.join("、")}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <p className="text-gray-800">{position.employmentType} / {position.salary}</p>
            {position.workSchedule && (
              <div className="flex items-start gap-1.5 text-xs text-gray-500">
                <Clock size={12} className="mt-0.5 shrink-0" />
                <span>{position.workSchedule}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400">必須：{position.requiredQualifications.join("・")}</p>
            {position.preferredQualifications && <p className="text-xs text-gray-400">歓迎：{position.preferredQualifications.join("・")}</p>}
            <p className="text-xs text-gray-400">手技：{position.preferredProcedures.join("、")}</p>
          </div>

          <div className="border-l-2 border-amber-300 pl-3">
            <p className="text-sm text-gray-700">{position.reason}</p>
            {position.reasonDetail && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{position.reasonDetail}</p>}
          </div>

          {position.benefits && (
            <p className="text-xs text-gray-500">{position.benefits.join(" / ")}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Users size={12} />{position.interestedCount}名関心</span>
            {position.viewCount && <span className="flex items-center gap-1"><Eye size={12} />{position.viewCount}閲覧</span>}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex gap-2 sticky bottom-0 bg-white rounded-b-xl">
          <button className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700 cursor-pointer font-medium">匿名で関心を表明</button>
          <button onClick={onClose} className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer">閉じる</button>
        </div>
      </div>
    </div>
  );
}

function PositionCard({ position, onInterest, onSave, onDetail, saved }: { position: Position; onInterest: () => void; onSave: () => void; onDetail: () => void; saved: boolean }) {
  const clinic = clinics.find((c) => c.id === position.clinicId);
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between mb-1.5">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="text-sm font-medium text-gray-900">{position.title}</h3>
            <UrgencyDot urgency={position.urgency} />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Building2 size={11} className="text-gray-400" />
            <span>{position.clinicName}</span>
            <span className="text-gray-300">|</span>
            <MapPin size={11} className="text-gray-400" />
            <span>{position.area}</span>
          </div>
          {clinic && <p className="text-[11px] text-gray-400 mt-0.5">{clinic.type}{clinic.bedCount ? ` ${clinic.bedCount}床` : ""}</p>}
        </div>
        <button onClick={onSave} className={`p-1 rounded cursor-pointer transition-colors ${saved ? "text-amber-500" : "text-gray-300 hover:text-gray-400"}`}>
          <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-600 my-2">
        <span>{position.employmentType}</span>
        <span className="text-gray-300">/</span>
        <span>{position.salary}</span>
      </div>

      <p className="text-xs text-gray-500 mb-2.5 line-clamp-2">{position.reason}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[11px] text-gray-400">
          <span>{position.postedAt}</span>
          {position.interestedCount > 0 && <span className="flex items-center gap-0.5"><Users size={10} />{position.interestedCount}</span>}
          {position.viewCount && <span className="flex items-center gap-0.5"><Eye size={10} />{position.viewCount}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onDetail} className="text-xs text-gray-500 px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer flex items-center gap-0.5">
            詳細 <ChevronRight size={12} />
          </button>
          <button onClick={onInterest} className="bg-indigo-600 text-white text-xs px-2.5 py-1 rounded-md hover:bg-indigo-700 cursor-pointer">
            関心を表明
          </button>
        </div>
      </div>
    </div>
  );
}

function ClinicPostManager() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">掲載中の案件</h2>
        <button className="bg-indigo-600 text-white text-xs px-2.5 py-1.5 rounded-md hover:bg-indigo-700 cursor-pointer flex items-center gap-1">
          <Plus size={12} /> 新規案件
        </button>
      </div>

      <div className="flex gap-2 text-xs">
        <div className="bg-white rounded-lg border border-gray-100 px-3 py-2 text-center">
          <div className="text-lg font-semibold text-gray-900">{positions.length}</div><div className="text-gray-400">掲載中</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 px-3 py-2 text-center">
          <div className="text-lg font-semibold text-gray-900">{positions.reduce((a, p) => a + p.interestedCount, 0)}</div><div className="text-gray-400">関心表明</div>
        </div>
      </div>

      {positions.map((pos) => {
        const clinic = clinics.find((c) => c.id === pos.clinicId);
        return (
          <div key={pos.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-medium text-gray-900">{pos.title}</span>
                  <UrgencyDot urgency={pos.urgency} />
                  <span className={`text-[11px] ${pos.status === "interviewing" ? "text-indigo-600" : "text-gray-400"}`}>
                    {pos.status === "open" ? "募集中" : pos.status === "interviewing" ? "面談中" : "充足"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{pos.area} / {pos.salary}</p>
                {clinic && <p className="text-[11px] text-gray-400">{clinic.type}</p>}
              </div>
              <div className="text-right text-xs">
                <span className="text-base font-semibold text-gray-900">{pos.interestedCount}</span>
                <span className="text-gray-400 ml-0.5">関心</span>
              </div>
            </div>

            {pos.interestedCount > 0 && (
              <div className="bg-gray-50/60 rounded-lg p-2.5 space-y-1.5">
                {doctors.filter((d) => d.specialty === pos.specialty).slice(0, pos.interestedCount).map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">{d.anonymousName.charAt(4)}</div>
                      <span className="text-gray-700">{d.anonymousName}</span>
                      <span className="text-gray-400">{d.yearsOfExperience}年目</span>
                    </div>
                    <button className="text-indigo-600 cursor-pointer hover:text-indigo-700">詳細</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BoardPage() {
  const [view, setView] = useState<"doctor" | "clinic">("doctor");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const filtered = positions
    .filter((p) => filter === "all" || p.specialty === filter)
    .filter((p) => search === "" || p.title.includes(search) || p.clinicName.includes(search) || p.area.includes(search));

  const specialties = [...new Set(positions.map((p) => p.specialty))];

  const handleInterest = () => { setToast("匿名で関心を表明しました"); setTimeout(() => setToast(null), 2000); };
  const toggleSave = (posId: string) => { setSavedIds((prev) => { const next = new Set(prev); if (next.has(posId)) next.delete(posId); else next.add(posId); return next; }); };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Request Board</h1>
          <p className="text-xs text-gray-400">案件ボード</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setView("doctor")} className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${view === "doctor" ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500"}`}>医師側</button>
          <button onClick={() => setView("clinic")} className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${view === "clinic" ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500"}`}>医院側</button>
        </div>
      </div>

      {view === "doctor" ? (
        <>
          <div className="mb-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="案件名、医院名、エリアで検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300" />
            </div>
          </div>

          <div className="flex items-center gap-1 mb-4 flex-wrap">
            <button onClick={() => setFilter("all")} className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>すべて</button>
            {specialties.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${filter === s ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>{s}</button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((pos) => (<PositionCard key={pos.id} position={pos} saved={savedIds.has(pos.id)} onInterest={handleInterest} onSave={() => toggleSave(pos.id)} onDetail={() => setSelectedPosition(pos)} />))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center py-12 text-xs text-gray-400">該当する案件がありません</p>
          )}
        </>
      ) : (<ClinicPostManager />)}

      {selectedPosition && <PositionDetailModal position={selectedPosition} onClose={() => setSelectedPosition(null)} />}
      {toast && <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3.5 py-2 rounded-lg text-xs z-50">{toast}</div>}
    </div>
  );
}
