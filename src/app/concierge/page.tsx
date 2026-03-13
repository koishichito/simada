"use client";

import { useState } from "react";
import { doctors, positions, clinics } from "@/lib/data";
import type { Doctor, Position } from "@/lib/data";
import { CheckIcon, AlertIcon, ArrowRightIcon, CloseIcon } from "@/components/Icons";

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="5" />
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-semibold text-gray-900">{score}</span>
      </div>
    </div>
  );
}

function DoctorDetailModal({ doctor, position, onClose }: { doctor: Doctor; position: Position; onClose: () => void }) {
  const clinic = clinics.find((c) => c.id === position.clinicId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white rounded-t-xl z-10">
          <div className="flex items-center gap-4">
            <ScoreRing score={doctor.matchScore ?? 0} />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{doctor.anonymousName}</h3>
              <p className="text-sm text-gray-500">{doctor.specialty}{doctor.subSpecialty ? ` / ${doctor.subSpecialty}` : ""} / 経験{doctor.yearsOfExperience}年</p>
              <p className="text-xs text-gray-400 mt-0.5">最終アクティブ：{doctor.lastActiveAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded-lg">
            <CloseIcon />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Match reasons */}
          {doctor.matchReasons && doctor.matchReasons.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">マッチ理由</p>
              <ol className="space-y-1.5 list-decimal list-inside">
                {doctor.matchReasons.map((r, i) => (
                  <li key={i} className="text-sm text-gray-700">{r}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Cautions */}
          {doctor.matchCautions && doctor.matchCautions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-700 mb-1.5">注意事項</p>
              <ul className="space-y-1">
                {doctor.matchCautions.map((c, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">-</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Profile info */}
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">資格</p>
                <p className="text-sm text-gray-800">{doctor.qualifications.join("・")}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">手技</p>
                <p className="text-sm text-gray-800">{doctor.procedures.join("、")}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">現在の所属</p>
                  <p className="text-sm text-gray-800">{doctor.currentAffiliation || "非公開"}</p>
                  {doctor.academicBackground && <p className="text-xs text-gray-500 mt-0.5">{doctor.academicBackground}</p>}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">希望条件</p>
                  <p className="text-sm text-gray-800">{doctor.desiredSalary}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{doctor.preferredArea}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 mb-1.5">勤務可能日</p>
                <div className="flex gap-1">
                  {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
                    <span key={day} className={`w-7 h-7 flex items-center justify-center rounded text-xs ${doctor.availableDays.includes(day) ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"}`}>{day}</span>
                  ))}
                </div>
                {doctor.availableStartDate && <p className="text-xs text-gray-500 mt-2">入職可能日：{doctor.availableStartDate}</p>}
              </div>
            </div>

            {doctor.ngConditions && doctor.ngConditions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">NG条件</p>
                <p className="text-sm text-red-600">{doctor.ngConditions.join("、")}</p>
              </div>
            )}

            {doctor.selfPR && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">自己PR</p>
                <p className="text-sm text-gray-700 leading-relaxed">{doctor.selfPR}</p>
              </div>
            )}
          </div>

          {/* Target position */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">対象ポジション</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{position.title}</p>
                <p className="text-xs text-gray-500">{position.clinicName} / {position.area}</p>
                {clinic && <p className="text-xs text-gray-400 mt-0.5">{clinic.type}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{position.salary}</p>
                <p className="text-xs text-gray-500">{position.employmentType}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-2 sticky bottom-0 bg-white rounded-b-xl">
          <button className="flex-1 bg-indigo-600 text-white text-sm py-2.5 rounded-lg hover:bg-indigo-700 cursor-pointer font-medium flex items-center justify-center gap-1.5">
            面談を打診
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
          <button className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer">見送り</button>
          <button onClick={onClose} className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer">閉じる</button>
        </div>
      </div>
    </div>
  );
}

function RecommendedDoctorCard({ doctor, position, rank, onAction, onDetail }: { doctor: Doctor; position: Position; rank: number; onAction: (a: string) => void; onDetail: () => void }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-4 mb-4">
        <ScoreRing score={doctor.matchScore ?? 0} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs text-gray-400">#{rank}</span>
            <h3 className="font-semibold text-gray-900">{doctor.anonymousName}</h3>
            {doctor.status === "considering" && (
              <span className="text-xs text-amber-600">検討中</span>
            )}
          </div>
          <p className="text-sm text-gray-500">{doctor.specialty}{doctor.subSpecialty ? ` / ${doctor.subSpecialty}` : ""} / 経験{doctor.yearsOfExperience}年</p>
          <p className="text-xs text-gray-400 mt-0.5">{position.title} ({position.clinicName})</p>
        </div>
      </div>

      {/* Match reasons as numbered list */}
      <div className="mb-3">
        <ol className="space-y-0.5 text-sm text-gray-600">
          {doctor.matchReasons?.slice(0, 3).map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckIcon className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />
              <span>{r}</span>
            </li>
          ))}
        </ol>
        {doctor.matchCautions && doctor.matchCautions.length > 0 && (
          <div className="mt-2 space-y-0.5 text-sm">
            {doctor.matchCautions.slice(0, 2).map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-amber-600">
                <AlertIcon className="w-3.5 h-3.5 mt-0.5" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compact info row */}
      <div className="text-xs text-gray-500 mb-4 flex flex-wrap gap-x-4 gap-y-1">
        <span>{doctor.qualifications.join("・")}</span>
        <span>{doctor.desiredSalary}</span>
        <span>{doctor.availableDays.join("・")}曜</span>
        {doctor.availableStartDate && <span>{doctor.availableStartDate}〜</span>}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button onClick={onDetail} className="text-gray-500 text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">詳細</button>
        <button onClick={() => onAction("面談を打診")} className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-1.5">
          面談を打診
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function DoctorProfilePanel({ doctor }: { doctor: Doctor }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-20">
      <h3 className="font-semibold text-gray-900 mb-4">あなたのプロフィール</h3>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-gray-400">専門科</p>
          <p className="text-gray-900">{doctor.specialty}{doctor.subSpecialty ? ` / ${doctor.subSpecialty}` : ""}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">資格</p>
          <p className="text-gray-800 text-xs">{doctor.qualifications.join("・")}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">手技</p>
          <p className="text-gray-800 text-xs">{doctor.procedures.join("、")}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">勤務可能日</p>
          <div className="flex gap-1 mt-1">
            {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
              <span key={day} className={`w-6 h-6 flex items-center justify-center rounded text-xs ${doctor.availableDays.includes(day) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>{day}</span>
            ))}
          </div>
          {doctor.availableStartDate && <p className="text-xs text-gray-500 mt-1">入職可能日：{doctor.availableStartDate}</p>}
        </div>
        <div>
          <p className="text-xs text-gray-400">希望条件</p>
          <p className="text-gray-800">{doctor.preferredArea} / {doctor.desiredSalary}</p>
          {doctor.preferredWorkStyle && <p className="text-xs text-gray-500 mt-0.5">{doctor.preferredWorkStyle}</p>}
        </div>
        {doctor.ngConditions && (
          <div>
            <p className="text-xs text-gray-400">NG条件</p>
            <p className="text-xs text-red-600 mt-0.5">{doctor.ngConditions.join("、")}</p>
          </div>
        )}
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-2">匿名公開の範囲</p>
        <div className="space-y-1.5">
          {["専門科・資格", "経験年数・手技", "希望エリア・条件", "自己PR"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-indigo-600" />{item}
            </label>
          ))}
          {["氏名", "所属病院", "学歴"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-xs text-gray-400">
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
    setToast(`${action}を送信しました`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">
          今週の推奨候補 ({recommendedDoctors.length}名)
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">欠員ポジションに適合する医師の候補です</p>
      </div>

      {/* Vacancy summary - compact row */}
      <div className="flex gap-3 mb-6 overflow-x-auto">
        {topPositions.slice(0, 3).map((pos) => (
          <div key={pos.id} className="bg-white rounded-lg border border-gray-200 px-4 py-3 min-w-[200px] flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-sm text-gray-900 truncate">{pos.title}</p>
              {pos.urgency === "high" && <span className="text-xs text-red-600 font-medium ml-2">急募</span>}
            </div>
            <p className="text-xs text-gray-500">{pos.area} / {pos.salary}</p>
            <p className="text-xs text-gray-400 mt-1">{pos.interestedCount}名関心 / {pos.viewCount}閲覧</p>
          </div>
        ))}
      </div>

      {/* Recommended doctors - show top 3 only */}
      <div className="space-y-3">
        {recommendedDoctors
          .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
          .slice(0, 3)
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
      {recommendedDoctors.length > 3 && (
        <p className="text-center text-sm text-gray-400 mt-4 cursor-pointer hover:text-indigo-600">
          他{recommendedDoctors.length - 3}名の候補を見る
        </p>
      )}

      {selectedDoctor && (
        <DoctorDetailModal
          doctor={selectedDoctor.doctor}
          position={selectedDoctor.position}
          onClose={() => setSelectedDoctor(null)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm z-50">
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
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-0.5">あなたへの提案 ({incomingProposals.length}件)</h2>
          <p className="text-sm text-gray-500">プロフィールに基づく案件です</p>
        </div>

        {incomingProposals.map((pos) => {
          const clinic = clinics.find((c) => c.id === pos.clinicId);
          return (
            <div key={pos.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-gray-900">{pos.title}</h3>
                    {pos.urgency === "high" && <span className="text-xs text-red-600">急募</span>}
                  </div>
                  <p className="text-sm text-gray-500">{pos.clinicName} / {pos.area}</p>
                  {clinic && <p className="text-xs text-gray-400 mt-0.5">{clinic.type}</p>}
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p><span className="text-gray-400">雇用：</span>{pos.employmentType} / <span className="text-gray-400">報酬：</span>{pos.salary}</p>
                {pos.workSchedule && <p className="text-xs text-gray-500">{pos.workSchedule}</p>}
                <p className="text-xs text-gray-500">{pos.reason}</p>
              </div>

              {pos.benefits && (
                <p className="text-xs text-gray-500 mb-3">{pos.benefits.join("、")}</p>
              )}

              <div className="flex gap-2">
                <button onClick={() => { setToast("関心ありを送信しました"); setTimeout(() => setToast(null), 2000); }}
                  className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                  関心あり
                </button>
                <button className="text-gray-500 text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">質問する</button>
                <button className="text-gray-500 text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">見送り</button>
              </div>
            </div>
          );
        })}

        {toast && (
          <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm z-50">
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Concierge-first</h1>
          <p className="text-sm text-gray-500">推奨候補を厳選提示</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setView("clinic")} className={`px-3 py-1.5 text-sm rounded-md transition-all cursor-pointer ${view === "clinic" ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"}`}>医院側</button>
          <button onClick={() => setView("doctor")} className={`px-3 py-1.5 text-sm rounded-md transition-all cursor-pointer ${view === "doctor" ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"}`}>医師側</button>
        </div>
      </div>

      {view === "clinic" ? <ClinicDashboard /> : <DoctorDashboard />}
    </div>
  );
}
