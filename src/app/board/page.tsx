"use client";

import { useState } from "react";
import { positions, doctors, clinics } from "@/lib/data";
import type { Position } from "@/lib/data";

function UrgencyStripe({ urgency }: { urgency: Position["urgency"] }) {
  const colors = { high: "bg-red-500", medium: "bg-amber-400", low: "bg-gray-300" };
  return <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${colors[urgency]}`} />;
}

function UrgencyBadge({ urgency }: { urgency: Position["urgency"] }) {
  const styles = { high: "bg-red-100 text-red-700", medium: "bg-amber-100 text-amber-700", low: "bg-gray-100 text-gray-600" };
  const labels = { high: "急募", medium: "通常", low: "新規" };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[urgency]}`}>{labels[urgency]}</span>;
}

function PositionDetailModal({ position, onClose }: { position: Position; onClose: () => void }) {
  const clinic = clinics.find((c) => c.id === position.clinicId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UrgencyBadge urgency={position.urgency} />
              <span className="text-xs text-gray-400">{position.postedAt} 掲載</span>
              {position.deadline && <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded">期限: {position.deadline}</span>}
            </div>
            <h3 className="font-bold text-xl text-gray-900">{position.title}</h3>
            <p className="text-sm text-gray-500">{position.clinicName} — {position.area}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Clinic info */}
          {clinic && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">医院情報</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-400 text-xs block">施設名</span><span className="font-medium">{clinic.name}</span></div>
                <div><span className="text-gray-400 text-xs block">種別</span><span className="font-medium">{clinic.type}</span></div>
                <div><span className="text-gray-400 text-xs block">所在地</span><span>{clinic.area}</span></div>
                {clinic.bedCount && <div><span className="text-gray-400 text-xs block">病床数</span><span>{clinic.bedCount}床</span></div>}
                {clinic.staffCount && <div><span className="text-gray-400 text-xs block">職員数</span><span>約{clinic.staffCount}名</span></div>}
                {clinic.features && (
                  <div className="col-span-2"><span className="text-gray-400 text-xs block">特徴</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">{clinic.features.map((f) => (<span key={f} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{f}</span>))}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Position details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 mb-1">雇用形態</p>
              <p className="text-sm font-medium">{position.employmentType}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 mb-1">報酬</p>
              <p className="text-sm font-medium">{position.salary}</p>
            </div>
          </div>

          {position.workSchedule && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 mb-1">勤務体制</p>
              <p className="text-sm">{position.workSchedule}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 mb-1">必須資格</p>
              <div className="flex flex-wrap gap-1">{position.requiredQualifications.map((q) => (<span key={q} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{q}</span>))}</div>
              {position.preferredQualifications && (
                <div className="mt-2">
                  <p className="text-[10px] text-gray-400 mb-1">歓迎資格</p>
                  <div className="flex flex-wrap gap-1">{position.preferredQualifications.map((q) => (<span key={q} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{q}</span>))}</div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 mb-1">歓迎手技</p>
              <div className="flex flex-wrap gap-1">{position.preferredProcedures.map((p) => (<span key={p} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{p}</span>))}</div>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">募集理由</p>
            <p className="text-sm text-gray-700 font-medium">{position.reason}</p>
            {position.reasonDetail && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{position.reasonDetail}</p>}
          </div>

          {/* Benefits */}
          {position.benefits && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">福利厚生・待遇</p>
              <div className="flex flex-wrap gap-1.5">
                {position.benefits.map((b) => (<span key={b} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200">{b}</span>))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{position.interestedCount}名が関心表明</span>
            {position.viewCount && <span>{position.viewCount}回閲覧</span>}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-2 sticky bottom-0 bg-white rounded-b-2xl">
          <button className="flex-1 bg-gray-900 text-white text-sm py-2.5 rounded-xl hover:bg-gray-800 cursor-pointer font-medium">匿名で関心を表明</button>
          <button onClick={onClose} className="px-5 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">閉じる</button>
        </div>
      </div>
    </div>
  );
}

function PositionCard({ position, onInterest, onSave, onDetail, saved }: { position: Position; onInterest: () => void; onSave: () => void; onDetail: () => void; saved: boolean }) {
  const clinic = clinics.find((c) => c.id === position.clinicId);
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 p-6 pl-7 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
      <UrgencyStripe urgency={position.urgency} />
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <UrgencyBadge urgency={position.urgency} />
            <span className="text-xs text-gray-400">{position.postedAt} 掲載</span>
            {position.interestedCount > 0 && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{position.interestedCount}名が関心表明</span>}
            {position.viewCount && <span className="text-xs text-gray-400">{position.viewCount}回閲覧</span>}
          </div>
          <h3 className="font-bold text-gray-900 text-lg">{position.title}</h3>
          <p className="text-sm text-gray-500">{position.clinicName} — {position.area}</p>
          {clinic && <p className="text-xs text-gray-400 mt-0.5">{clinic.type}{clinic.bedCount ? ` / ${clinic.bedCount}床` : ""}{clinic.features ? ` / ${clinic.features.slice(0, 2).join("、")}` : ""}</p>}
        </div>
        <button onClick={onSave} className={`p-2 rounded-lg transition-all cursor-pointer ${saved ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-amber-400 hover:bg-gray-50"}`} title="保存">
          <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-gray-400 mb-0.5">雇用形態</p>
          <p className="text-sm font-medium text-gray-900">{position.employmentType}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-gray-400 mb-0.5">報酬</p>
          <p className="text-sm font-medium text-gray-900">{position.salary}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-gray-400 mb-0.5">必須資格</p>
          <div className="flex flex-wrap gap-1 mt-0.5">{position.requiredQualifications.map((q) => (<span key={q} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{q}</span>))}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-gray-400 mb-0.5">歓迎手技</p>
          <div className="flex flex-wrap gap-1 mt-0.5">{position.preferredProcedures.map((p) => (<span key={p} className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{p}</span>))}</div>
        </div>
      </div>

      {position.workSchedule && (
        <div className="text-xs text-gray-500 mb-3">
          <span className="text-gray-400">勤務体制：</span>{position.workSchedule}
        </div>
      )}

      <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 mb-4">
        <p className="text-[10px] text-amber-600 font-medium mb-0.5 uppercase tracking-wider">募集理由</p>
        <p className="text-sm text-gray-700">{position.reason}</p>
        {position.reasonDetail && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{position.reasonDetail.slice(0, 120)}...</p>}
      </div>

      {position.benefits && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {position.benefits.slice(0, 4).map((b) => (<span key={b} className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{b}</span>))}
          {position.benefits.length > 4 && <span className="text-[11px] text-gray-400">+{position.benefits.length - 4}件</span>}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={onDetail} className="text-sm text-blue-600 hover:underline cursor-pointer">詳細を見る →</button>
        <button onClick={onInterest} className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          匿名で関心を表明
        </button>
      </div>
    </div>
  );
}

function ClinicPostManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">掲載中の案件</h2>
        <button className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
          新規案件を作成
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{positions.length}</div><div className="text-xs text-gray-500">掲載中</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{positions.reduce((a, p) => a + p.interestedCount, 0)}</div><div className="text-xs text-gray-500">関心表明合計</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{positions.reduce((a, p) => a + (p.viewCount ?? 0), 0)}</div><div className="text-xs text-gray-500">総閲覧数</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{positions.filter(p => p.urgency === "high").length}</div><div className="text-xs text-gray-500">急募</div>
        </div>
      </div>

      {positions.map((pos) => {
        const clinic = clinics.find((c) => c.id === pos.clinicId);
        return (
          <div key={pos.id} className="relative bg-white rounded-2xl border border-gray-200 p-6 pl-7">
            <UrgencyStripe urgency={pos.urgency} />
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <UrgencyBadge urgency={pos.urgency} />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pos.status === "open" ? "bg-green-100 text-green-700" : pos.status === "interviewing" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                    {pos.status === "open" ? "募集中" : pos.status === "interviewing" ? "面談中" : "充足"}
                  </span>
                  {pos.deadline && <span className="text-[10px] text-red-500">期限: {pos.deadline}</span>}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{pos.title}</h3>
                <p className="text-sm text-gray-500">{pos.area} / {pos.salary}</p>
                {clinic && <p className="text-xs text-gray-400 mt-0.5">{clinic.type}</p>}
              </div>
              <div className="text-center bg-gray-50 rounded-xl px-4 py-2">
                <div className="text-2xl font-bold text-gray-900">{pos.interestedCount}</div>
                <div className="text-[10px] text-gray-400">関心表明</div>
                {pos.viewCount && <div className="text-[10px] text-gray-400 mt-0.5">{pos.viewCount}閲覧</div>}
              </div>
            </div>

            {pos.interestedCount > 0 && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-3">
                <p className="text-xs text-blue-600 font-bold mb-2">関心表明した医師（匿名）</p>
                <div className="space-y-2">
                  {doctors.filter((d) => d.specialty === pos.specialty).slice(0, pos.interestedCount).map((d) => (
                    <div key={d.id} className="flex items-center justify-between bg-white rounded-lg p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">{d.anonymousName.charAt(4)}</div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">{d.anonymousName}</span>
                          <span className="text-xs text-gray-400 ml-2">{d.subSpecialty || d.specialty} / 経験{d.yearsOfExperience}年</span>
                        </div>
                      </div>
                      <button className="text-blue-600 text-xs font-medium hover:underline cursor-pointer">詳細を見る →</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">編集</button>
              <button className="text-sm px-4 py-2 rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 cursor-pointer">優先表示に変更</button>
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
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const filtered = positions
    .filter((p) => filter === "all" || p.specialty === filter)
    .filter((p) => search === "" || p.title.includes(search) || p.clinicName.includes(search) || p.area.includes(search));

  const specialties = [...new Set(positions.map((p) => p.specialty))];

  const handleInterest = () => { setToast("匿名で関心を表明しました"); setTimeout(() => setToast(null), 2000); };
  const toggleSave = (posId: string) => { setSavedIds((prev) => { const next = new Set(prev); if (next.has(posId)) next.delete(posId); else next.add(posId); return next; }); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">型2</span>
            <h1 className="text-2xl font-bold text-gray-900">Request Board</h1>
          </div>
          <p className="text-sm text-gray-500">構造化された案件ボード。通知・保存・匿名関心表明・募集理由の明示を重視。</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button onClick={() => setView("doctor")} className={`px-4 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer ${view === "doctor" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>医師側</button>
          <button onClick={() => setView("clinic")} className={`px-4 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer ${view === "clinic" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>医院側</button>
        </div>
      </div>

      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex items-center gap-2">
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
        料金設計：掲載課金、月額サブスク、優先表示
      </div>

      {view === "doctor" ? (
        <>
          <div className="mb-4"><div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input type="text" placeholder="案件名、医院名、エリアで検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300" />
          </div></div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => setFilter("all")} className={`text-sm px-3 py-1.5 rounded-full transition-colors cursor-pointer ${filter === "all" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>すべて ({positions.length})</button>
              {specialties.map((s) => (
                <button key={s} onClick={() => setFilter(s)} className={`text-sm px-3 py-1.5 rounded-full transition-colors cursor-pointer ${filter === s ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{s} ({positions.filter((p) => p.specialty === s).length})</button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer shrink-0">
              <div className={`relative w-9 h-5 rounded-full transition-colors ${notifyEnabled ? "bg-gray-900" : "bg-gray-300"}`} onClick={() => setNotifyEnabled(!notifyEnabled)}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifyEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>通知
            </label>
          </div>

          {savedIds.size > 0 && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              保存済み {savedIds.size}件
            </div>
          )}

          <div className="space-y-4">
            {filtered.map((pos) => (<PositionCard key={pos.id} position={pos} saved={savedIds.has(pos.id)} onInterest={handleInterest} onSave={() => toggleSave(pos.id)} onDetail={() => setSelectedPosition(pos)} />))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              <p className="text-gray-400">該当する案件がありません</p><p className="text-xs text-gray-300 mt-1">検索条件を変更してください</p>
            </div>
          )}
        </>
      ) : (<ClinicPostManager />)}

      {selectedPosition && <PositionDetailModal position={selectedPosition} onClose={() => setSelectedPosition(null)} />}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-2 z-50">
          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
          {toast}
        </div>
      )}
    </div>
  );
}
