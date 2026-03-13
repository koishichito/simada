"use client";

import { useState } from "react";
import { doctors, positions, clinics, notifications } from "@/lib/data";
import type { Doctor, Position, Notification } from "@/lib/data";

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "text-emerald-500" : score >= 75 ? "text-blue-500" : "text-amber-500";
  const strokeColor = score >= 90 ? "#10b981" : score >= 75 ? "#3b82f6" : "#f59e0b";

  return (
    <div className="relative w-[72px] h-[72px] shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="5" />
        <circle cx="32" cy="32" r={radius} fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${color}`}>{score}</span>
        <span className="text-[8px] text-gray-400 -mt-0.5">適合度</span>
      </div>
    </div>
  );
}

function NotificationPanel({ items }: { items: Notification[] }) {
  const [open, setOpen] = useState(false);
  const unread = items.filter((n) => !n.read).length;
  const typeIcons: Record<string, string> = {
    match: "bg-emerald-100 text-emerald-600",
    interest: "bg-blue-100 text-blue-600",
    interview: "bg-purple-100 text-purple-600",
    message: "bg-amber-100 text-amber-600",
    system: "bg-red-100 text-red-600",
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 max-h-[400px] overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-bold text-sm text-gray-900">通知 ({unread}件の未読)</h4>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((n) => (
              <div key={n.id} className={`p-3 flex gap-3 ${n.read ? "" : "bg-blue-50/30"}`}>
                <div className={`w-8 h-8 rounded-full ${typeIcons[n.type]} flex items-center justify-center shrink-0 mt-0.5`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-900">{n.title}</p>
                    {!n.read && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{n.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DoctorDetailModal({ doctor, position, onClose }: { doctor: Doctor; position: Position; onClose: () => void }) {
  const clinic = clinics.find((c) => c.id === position.clinicId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-4">
            <ScoreRing score={doctor.matchScore ?? 0} />
            <div>
              <h3 className="font-bold text-xl text-gray-900">{doctor.anonymousName}</h3>
              <p className="text-sm text-gray-500">{doctor.specialty}{doctor.subSpecialty ? ` / ${doctor.subSpecialty}` : ""} / 経験{doctor.yearsOfExperience}年</p>
              <p className="text-xs text-gray-400 mt-0.5">最終アクティブ：{doctor.lastActiveAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Match reasons */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">マッチ理由</h4>
            <div className="space-y-1.5">
              {doctor.matchReasons?.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                  <span className="text-gray-700">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cautions */}
          {doctor.matchCautions && doctor.matchCautions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">注意事項</h4>
              <div className="space-y-1.5">
                {doctor.matchCautions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                    <span className="text-gray-700">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">資格</p>
              <div className="flex flex-wrap gap-1">
                {doctor.qualifications.map((q) => (
                  <span key={q} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{q}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">手技</p>
              <div className="flex flex-wrap gap-1">
                {doctor.procedures.map((p) => (
                  <span key={p} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{p}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">現在の所属</p>
              <p className="text-sm text-gray-900 font-medium">{doctor.currentAffiliation || "非公開"}</p>
              {doctor.academicBackground && <p className="text-xs text-gray-500 mt-0.5">{doctor.academicBackground}</p>}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">勤務可能日</p>
              <div className="flex gap-1 mt-1">
                {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
                  <span key={day} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs ${doctor.availableDays.includes(day) ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-400"}`}>{day}</span>
                ))}
              </div>
              {doctor.availableStartDate && <p className="text-xs text-gray-500 mt-2">入職可能日：{doctor.availableStartDate}</p>}
            </div>
          </div>

          {/* Conditions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">希望条件</p>
              <p className="text-sm font-medium text-gray-900">{doctor.desiredSalary}</p>
              <p className="text-xs text-gray-500 mt-0.5">{doctor.preferredArea}</p>
              {doctor.preferredWorkStyle && <p className="text-xs text-gray-500 mt-1">{doctor.preferredWorkStyle}</p>}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">NG条件</p>
              {doctor.ngConditions ? (
                <div className="flex flex-wrap gap-1">
                  {doctor.ngConditions.map((ng) => (
                    <span key={ng} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{ng}</span>
                  ))}
                </div>
              ) : <p className="text-xs text-gray-400">指定なし</p>}
            </div>
          </div>

          {/* Self PR */}
          {doctor.selfPR && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <p className="text-[10px] text-blue-600 uppercase tracking-wider font-bold mb-1">自己PR</p>
              <p className="text-sm text-gray-700 leading-relaxed">{doctor.selfPR}</p>
            </div>
          )}

          {/* Target position summary */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
            <p className="text-[10px] text-amber-600 uppercase tracking-wider font-bold mb-2">対象ポジション</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">{position.title}</p>
                <p className="text-xs text-gray-500">{position.clinicName} / {position.area}</p>
                {clinic && <p className="text-xs text-gray-400 mt-0.5">{clinic.type} / {clinic.features?.join("、")}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{position.salary}</p>
                <p className="text-xs text-gray-500">{position.employmentType}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-2 sticky bottom-0 bg-white rounded-b-2xl">
          <button className="flex-1 bg-gray-900 text-white text-sm py-2.5 rounded-xl hover:bg-gray-800 cursor-pointer font-medium flex items-center justify-center gap-1.5">
            面談を打診
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </button>
          <button className="px-5 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">見送り</button>
          <button onClick={onClose} className="px-5 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">閉じる</button>
        </div>
      </div>
    </div>
  );
}

function RecommendedDoctorCard({ doctor, position, rank, onAction, onDetail }: { doctor: Doctor; position: Position; rank: number; onAction: (a: string) => void; onDetail: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
      <div className="flex items-start gap-4 mb-4">
        <ScoreRing score={doctor.matchScore ?? 0} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">#{rank}</span>
            <h3 className="font-bold text-gray-900">{doctor.anonymousName}</h3>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${doctor.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {doctor.status === "active" ? "積極的" : "検討中"}
            </span>
          </div>
          <p className="text-sm text-gray-500">{doctor.specialty}{doctor.subSpecialty ? ` / ${doctor.subSpecialty}` : ""} / 経験{doctor.yearsOfExperience}年</p>
          <p className="text-xs text-gray-400 mt-0.5">対象：{position.title}（{position.clinicName}）</p>
          {doctor.availableStartDate && <p className="text-xs text-gray-400">入職可能：{doctor.availableStartDate}〜</p>}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">なぜ合うか</p>
        <div className="flex flex-wrap gap-1.5">
          {doctor.matchReasons?.slice(0, 3).map((r, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full border border-emerald-200">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
              {r}
            </span>
          ))}
        </div>
        {doctor.matchCautions && doctor.matchCautions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {doctor.matchCautions.slice(0, 2).map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full border border-amber-200">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 mb-5 bg-gray-50 rounded-xl p-3">
        <div><span className="text-gray-400">資格：</span>{doctor.qualifications.join("、")}</div>
        <div><span className="text-gray-400">希望：</span>{doctor.desiredSalary}</div>
        <div><span className="text-gray-400">勤務可能：</span>{doctor.availableDays.join("・")}</div>
        <div><span className="text-gray-400">エリア：</span>{doctor.preferredArea}</div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button onClick={onDetail} className="text-gray-500 text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">詳細を見る</button>
        <button onClick={() => onAction("面談を打診")} className="bg-gray-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-1.5">
          面談を打診
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </button>
      </div>
    </div>
  );
}

function DoctorProfilePanel({ doctor }: { doctor: Doctor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">あなたのプロフィール</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${doctor.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {doctor.status === "active" ? "公開中" : "検討中"}
        </span>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-gray-400 text-xs">専門科</p>
          <p className="text-gray-900 font-medium">{doctor.specialty}{doctor.subSpecialty ? ` — ${doctor.subSpecialty}` : ""}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">資格</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {doctor.qualifications.map((q) => (<span key={q} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{q}</span>))}
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-xs">手技</p>
          <p className="text-gray-900 text-xs leading-relaxed">{doctor.procedures.join("、")}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">勤務可能日</p>
          <div className="flex gap-1 mt-1">
            {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
              <span key={day} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs ${doctor.availableDays.includes(day) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}`}>{day}</span>
            ))}
          </div>
          {doctor.availableStartDate && <p className="text-xs text-gray-500 mt-1">入職可能日：{doctor.availableStartDate}</p>}
        </div>
        <div>
          <p className="text-gray-400 text-xs">希望条件</p>
          <p className="text-gray-900">{doctor.preferredArea} / {doctor.desiredSalary}</p>
          {doctor.preferredWorkStyle && <p className="text-xs text-gray-500 mt-0.5">{doctor.preferredWorkStyle}</p>}
        </div>
        {doctor.ngConditions && (
          <div>
            <p className="text-gray-400 text-xs">NG条件</p>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {doctor.ngConditions.map((ng) => (<span key={ng} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{ng}</span>))}
            </div>
          </div>
        )}
        {doctor.selfPR && (
          <div>
            <p className="text-gray-400 text-xs">自己PR</p>
            <p className="text-xs text-gray-700 leading-relaxed mt-0.5">{doctor.selfPR}</p>
          </div>
        )}
      </div>
      <div className="mt-5 pt-5 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-2 font-medium">匿名公開の範囲</p>
        <div className="space-y-2">
          {["専門科・資格", "経験年数・手技", "希望エリア・条件", "自己PR"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-gray-900" />{item}
            </label>
          ))}
          {["氏名", "所属病院", "学歴"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" disabled className="rounded border-gray-200" />{item}（面談後に公開）
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClinicDashboard() {
  const [toast, setToast] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<{ doctor: Doctor; position: Position } | null>(null);
  const recommendedDoctors = doctors.filter((d) => d.matchScore);
  const topPositions = positions.filter((p) => p.status === "open");

  const handleAction = (action: string) => {
    setToast(`「${action}」を送信しました`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            今週の推奨候補 <span className="text-emerald-600">{recommendedDoctors.length}名</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">貴院の欠員ポジションに適合する医師をAIが選定しました</p>
        </div>
        <NotificationPanel items={notifications} />
      </div>

      {/* Vacancy summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 mb-8">
        {topPositions.slice(0, 3).map((pos) => {
          const clinic = clinics.find((c) => c.id === pos.clinicId);
          return (
            <div key={pos.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${pos.urgency === "high" ? "bg-red-100 text-red-700" : pos.urgency === "medium" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                  {pos.urgency === "high" ? "急募" : pos.urgency === "medium" ? "通常" : "新規"}
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {Array.from({ length: Math.min(pos.interestedCount, 3) }).map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{pos.interestedCount}名</span>
                </div>
              </div>
              <p className="font-semibold text-sm text-gray-900">{pos.title}</p>
              <p className="text-xs text-gray-500">{pos.area}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">{pos.salary}</span>
                {pos.deadline && <span className="text-[10px] text-red-500">期限: {pos.deadline}</span>}
              </div>
              {clinic && <p className="text-[10px] text-gray-400 mt-1">{clinic.type} / {clinic.features?.slice(0, 2).join("、")}</p>}
            </div>
          );
        })}
      </div>

      {/* Recommended doctors */}
      <div className="space-y-4">
        {recommendedDoctors
          .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
          .map((doc, idx) => {
            const matchingPos = topPositions.find((p) => p.specialty === doc.specialty);
            if (!matchingPos) return null;
            return (
              <RecommendedDoctorCard
                key={doc.id}
                doctor={doc}
                position={matchingPos}
                rank={idx + 1}
                onAction={handleAction}
                onDetail={() => setSelectedDoctor({ doctor: doc, position: matchingPos })}
              />
            );
          })}
      </div>

      {/* Qualification verification */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">資格確認状況</h3>
        <div className="space-y-3">
          {recommendedDoctors.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">{doc.anonymousName}</span>
                <span className="text-xs text-gray-400">{doc.specialty}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {doc.qualifications.map((q) => (
                  <span key={q} className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                    {q}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDoctor && (
        <DoctorDetailModal
          doctor={selectedDoctor.doctor}
          position={selectedDoctor.position}
          onClose={() => setSelectedDoctor(null)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-2 z-50">
          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
          {toast}
        </div>
      )}
    </div>
  );
}

function DoctorDashboard() {
  const [toast, setToast] = useState<string | null>(null);
  const currentDoctor = doctors[0];
  const incomingProposals = positions.filter((p) => p.specialty === currentDoctor.specialty && p.status === "open");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">あなたへの提案 <span className="text-emerald-600">{incomingProposals.length}件</span></h2>
          <p className="text-sm text-gray-500">あなたのプロフィールに基づき、適合する案件をお知らせします</p>
        </div>

        {incomingProposals.map((pos) => {
          const clinic = clinics.find((c) => c.id === pos.clinicId);
          return (
            <div key={pos.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{pos.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${pos.urgency === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {pos.urgency === "high" ? "急募" : "通常"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{pos.clinicName} / {pos.area}</p>
                  {clinic && <p className="text-xs text-gray-400 mt-0.5">{clinic.type} / {clinic.features?.slice(0, 3).join("、")}</p>}
                </div>
                {pos.viewCount && <span className="text-xs text-gray-400">{pos.viewCount}回閲覧</span>}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-400 text-xs block">雇用形態</span>
                    <span className="font-medium text-gray-900">{pos.employmentType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">報酬</span>
                    <span className="font-medium text-gray-900">{pos.salary}</span>
                  </div>
                  {pos.workSchedule && (
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs block">勤務体制</span>
                      <span className="text-gray-700 text-xs">{pos.workSchedule}</span>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-gray-400 text-xs block">募集理由</span>
                    <span className="text-gray-700 text-xs">{pos.reason}</span>
                  </div>
                  {pos.reasonDetail && (
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs block">詳細背景</span>
                      <span className="text-gray-700 text-xs leading-relaxed">{pos.reasonDetail}</span>
                    </div>
                  )}
                </div>
              </div>

              {pos.benefits && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {pos.benefits.map((b) => (
                    <span key={b} className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={() => { setToast("関心ありを送信しました"); setTimeout(() => setToast(null), 2000); }}
                  className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-1.5">
                  関心あり
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
                <button className="text-gray-500 text-sm px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">質問する</button>
                <button className="text-gray-500 text-sm px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">今は見送り</button>
              </div>
            </div>
          );
        })}

        {toast && (
          <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-2 z-50">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            {toast}
          </div>
        )}
      </div>
      <div><DoctorProfilePanel doctor={currentDoctor} /></div>
    </div>
  );
}

export default function ConciergePage() {
  const [view, setView] = useState<"clinic" | "doctor">("clinic");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">型1</span>
            <h1 className="text-2xl font-bold text-gray-900">Concierge-first</h1>
          </div>
          <p className="text-sm text-gray-500">推奨候補を厳選提示。低流動性に強く、最初の1件の価値が高い領域向き。</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button onClick={() => setView("clinic")} className={`px-4 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer ${view === "clinic" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>医院側</button>
          <button onClick={() => setView("doctor")} className={`px-4 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer ${view === "doctor" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>医師側</button>
        </div>
      </div>

      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex items-center gap-2">
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
        料金設計：医院側の月額 + 成功報酬、または着手金 + 成功報酬
      </div>

      {view === "clinic" ? <ClinicDashboard /> : <DoctorDashboard />}
    </div>
  );
}
