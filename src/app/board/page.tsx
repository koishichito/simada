"use client";

import { useState } from "react";
import { positions, doctors, clinics } from "@/lib/data";
import type { Position } from "@/lib/data";
import { CloseIcon, SearchIcon, BookmarkIcon, PlusIcon } from "@/components/Icons";

function UrgencyStripe({ urgency }: { urgency: Position["urgency"] }) {
  const colors = { high: "bg-red-500", medium: "bg-amber-400", low: "bg-gray-300" };
  return <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${colors[urgency]}`} />;
}

function PositionDetailModal({ position, onClose }: { position: Position; onClose: () => void }) {
  const clinic = clinics.find((c) => c.id === position.clinicId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white rounded-t-xl z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {position.urgency === "high" && <span className="text-xs text-red-600 font-medium">急募</span>}
              <span className="text-xs text-gray-400">{position.postedAt} 掲載</span>
              {position.deadline && <span className="text-xs text-red-500">期限: {position.deadline}</span>}
            </div>
            <h3 className="font-semibold text-lg text-gray-900">{position.title}</h3>
            <p className="text-sm text-gray-500">{position.clinicName} / {position.area}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded-lg"><CloseIcon /></button>
        </div>
        <div className="p-5 space-y-4">
          {clinic && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
              <p className="text-xs font-medium text-gray-500 mb-2">医院情報</p>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-xs text-gray-400">施設名</span><p className="font-medium text-gray-800">{clinic.name}</p></div>
                <div><span className="text-xs text-gray-400">種別</span><p className="text-gray-800">{clinic.type}</p></div>
                <div><span className="text-xs text-gray-400">所在地</span><p className="text-gray-700">{clinic.area}</p></div>
                {clinic.bedCount && <div><span className="text-xs text-gray-400">病床数</span><p>{clinic.bedCount}床</p></div>}
              </div>
              {clinic.features && <p className="text-xs text-gray-500 pt-1">{clinic.features.join("、")}</p>}
            </div>
          )}

          <div className="text-sm space-y-2">
            <p><span className="text-gray-400 text-xs">雇用形態：</span>{position.employmentType} / <span className="text-gray-400 text-xs">報酬：</span>{position.salary}</p>
            {position.workSchedule && <p className="text-xs text-gray-600">{position.workSchedule}</p>}
          </div>

          <div className="text-sm space-y-1">
            <p className="text-xs font-medium text-gray-500">必須資格</p>
            <p className="text-gray-800">{position.requiredQualifications.join("・")}</p>
            {position.preferredQualifications && (
              <>
                <p className="text-xs font-medium text-gray-500 pt-1">歓迎資格</p>
                <p className="text-gray-700">{position.preferredQualifications.join("・")}</p>
              </>
            )}
            <p className="text-xs font-medium text-gray-500 pt-1">歓迎手技</p>
            <p className="text-gray-700">{position.preferredProcedures.join("、")}</p>
          </div>

          <div className="border-l-2 border-amber-300 pl-3 py-1">
            <p className="text-xs font-medium text-gray-500 mb-0.5">募集理由</p>
            <p className="text-sm text-gray-700">{position.reason}</p>
            {position.reasonDetail && <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{position.reasonDetail}</p>}
          </div>

          {position.benefits && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">福利厚生・待遇</p>
              <p className="text-sm text-gray-700">{position.benefits.join("、")}</p>
            </div>
          )}

          <p className="text-xs text-gray-400">
            {position.interestedCount}名が関心表明{position.viewCount ? ` / ${position.viewCount}回閲覧` : ""}
          </p>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-2 sticky bottom-0 bg-white rounded-b-xl">
          <button className="flex-1 bg-indigo-600 text-white text-sm py-2.5 rounded-lg hover:bg-indigo-700 cursor-pointer font-medium">匿名で関心を表明</button>
          <button onClick={onClose} className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer">閉じる</button>
        </div>
      </div>
    </div>
  );
}

function PositionCard({ position, onInterest, onSave, onDetail, saved }: { position: Position; onInterest: () => void; onSave: () => void; onDetail: () => void; saved: boolean }) {
  const clinic = clinics.find((c) => c.id === position.clinicId);
  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-4 pl-5 hover:border-gray-300 transition-colors">
      <UrgencyStripe urgency={position.urgency} />
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-gray-900">{position.title}</h3>
            {position.urgency === "high" && <span className="text-xs text-red-600 font-medium">急募</span>}
          </div>
          <p className="text-sm text-gray-500">{position.clinicName} / {position.area}</p>
          {clinic && <p className="text-xs text-gray-400 mt-0.5">{clinic.type}{clinic.bedCount ? ` / ${clinic.bedCount}床` : ""}</p>}
        </div>
        <button onClick={onSave} className={`p-1.5 rounded-lg transition-all cursor-pointer ${saved ? "text-amber-500" : "text-gray-300 hover:text-gray-400"}`} title="保存">
          <BookmarkIcon className="w-4 h-4" filled={saved} />
        </button>
      </div>

      {/* Compact inline info */}
      <p className="text-xs text-gray-600 mb-2">
        {position.employmentType} / {position.salary}{position.requiredQualifications.length > 0 ? ` / ${position.requiredQualifications.join("・")}` : ""}
      </p>

      {position.workSchedule && (
        <p className="text-xs text-gray-500 mb-2">{position.workSchedule}</p>
      )}

      <p className="text-xs text-gray-600 mb-3">{position.reason}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{position.postedAt} 掲載</span>
          {position.interestedCount > 0 && <span>{position.interestedCount}名関心</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onDetail} className="text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer">詳細</button>
          <button onClick={onInterest} className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
            関心を表明
          </button>
        </div>
      </div>
    </div>
  );
}

function ClinicPostManager() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">掲載中の案件</h2>
        <button className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700 cursor-pointer flex items-center gap-1.5">
          <PlusIcon className="w-4 h-4" />
          新規案件
        </button>
      </div>

      <div className="flex gap-3 text-sm">
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center min-w-[100px]">
          <div className="text-xl font-semibold text-gray-900">{positions.length}</div><div className="text-xs text-gray-500">掲載中</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center min-w-[100px]">
          <div className="text-xl font-semibold text-gray-900">{positions.reduce((a, p) => a + p.interestedCount, 0)}</div><div className="text-xs text-gray-500">関心表明</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center min-w-[100px]">
          <div className="text-xl font-semibold text-gray-900">{positions.filter(p => p.urgency === "high").length}</div><div className="text-xs text-gray-500">急募</div>
        </div>
      </div>

      {positions.map((pos) => {
        const clinic = clinics.find((c) => c.id === pos.clinicId);
        return (
          <div key={pos.id} className="relative bg-white rounded-lg border border-gray-200 p-4 pl-5">
            <UrgencyStripe urgency={pos.urgency} />
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm text-gray-900">{pos.title}</h3>
                  {pos.urgency === "high" && <span className="text-xs text-red-600">急募</span>}
                  <span className={`text-xs ${pos.status === "interviewing" ? "text-indigo-600" : "text-gray-400"}`}>
                    {pos.status === "open" ? "募集中" : pos.status === "interviewing" ? "面談中" : "充足"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{pos.area} / {pos.salary}</p>
                {clinic && <p className="text-xs text-gray-400">{clinic.type}</p>}
              </div>
              <div className="text-right text-xs text-gray-500">
                <span className="text-base font-semibold text-gray-900">{pos.interestedCount}</span> 関心
                {pos.viewCount && <p className="text-gray-400">{pos.viewCount}閲覧</p>}
              </div>
            </div>

            {pos.interestedCount > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 mb-2">
                <p className="text-xs text-gray-500 mb-1.5">関心表明した医師</p>
                <div className="space-y-1.5">
                  {doctors.filter((d) => d.specialty === pos.specialty).slice(0, pos.interestedCount).map((d) => (
                    <div key={d.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">{d.anonymousName.charAt(4)}</div>
                        <span className="text-sm text-gray-700">{d.anonymousName}</span>
                        <span className="text-xs text-gray-400">{d.subSpecialty || d.specialty} / {d.yearsOfExperience}年</span>
                      </div>
                      <button className="text-indigo-600 text-xs cursor-pointer hover:text-indigo-700">詳細</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">編集</button>
            </div>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Request Board</h1>
          <p className="text-sm text-gray-500">案件ボード</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setView("doctor")} className={`px-3 py-1.5 text-sm rounded-md transition-all cursor-pointer ${view === "doctor" ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"}`}>医師側</button>
          <button onClick={() => setView("clinic")} className={`px-3 py-1.5 text-sm rounded-md transition-all cursor-pointer ${view === "clinic" ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"}`}>医院側</button>
        </div>
      </div>

      {view === "doctor" ? (
        <>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="案件名、医院名、エリアで検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-5 flex-wrap">
            <button onClick={() => setFilter("all")} className={`text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>すべて ({positions.length})</button>
            {specialties.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === s ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{s}</button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((pos) => (<PositionCard key={pos.id} position={pos} saved={savedIds.has(pos.id)} onInterest={handleInterest} onSave={() => toggleSave(pos.id)} onDetail={() => setSelectedPosition(pos)} />))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">該当する案件がありません</p>
            </div>
          )}
        </>
      ) : (<ClinicPostManager />)}

      {selectedPosition && <PositionDetailModal position={selectedPosition} onClose={() => setSelectedPosition(null)} />}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
