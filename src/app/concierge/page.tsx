"use client";

import { useState } from "react";
import { doctors, positions, clinics } from "@/lib/data";
import type { Doctor, Position } from "@/lib/data";
import {
  X, ArrowRight, Check, AlertTriangle, Calendar,
  MapPin, Briefcase, GraduationCap, Stethoscope, ChevronRight,
  Sparkles, Copy, RefreshCw, FileText, Loader2
} from "lucide-react";

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#f1f0fb" strokeWidth="5" />
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-900 tabular-nums">{score}</span>
      </div>
    </div>
  );
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const letter = name.replace("Dr. ", "").charAt(0);
  const colors = ["bg-violet-100 text-violet-700", "bg-sky-100 text-sky-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700", "bg-emerald-100 text-emerald-700"];
  const idx = name.charCodeAt(4) % colors.length;
  const s = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return <div className={`${s} rounded-full ${colors[idx]} flex items-center justify-center font-medium shrink-0`}>{letter}</div>;
}

function DoctorDetailModal({ doctor, position, onClose }: { doctor: Doctor; position: Position; onClose: () => void }) {
  const clinic = clinics.find((c) => c.id === position.clinicId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white rounded-t-xl z-10">
          <div className="flex items-center gap-3">
            <ScoreRing score={doctor.matchScore ?? 0} />
            <div>
              <h3 className="font-semibold text-gray-900">{doctor.anonymousName}</h3>
              <p className="text-xs text-gray-500">{doctor.specialty}{doctor.subSpecialty ? ` / ${doctor.subSpecialty}` : ""} / {doctor.yearsOfExperience}年目</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-md hover:bg-gray-100"><X size={16} /></button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {doctor.matchReasons && doctor.matchReasons.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">マッチ理由</p>
              <div className="space-y-1">
                {doctor.matchReasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {doctor.matchCautions && doctor.matchCautions.length > 0 && (
            <div className="bg-amber-50/80 rounded-lg px-3 py-2.5">
              <div className="space-y-1">
                {doctor.matchCautions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50/80 rounded-lg p-3.5 space-y-2.5 text-sm">
            <div className="flex items-start gap-2">
              <GraduationCap size={14} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-800">{doctor.qualifications.join("・")}</p>
                <p className="text-xs text-gray-400 mt-0.5">{doctor.procedures.join("、")}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Briefcase size={14} className="text-gray-400 mt-0.5" />
              <p className="text-gray-800">{doctor.currentAffiliation || "非公開"}</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-gray-400 mt-0.5" />
              <p className="text-gray-800">{doctor.preferredArea} / {doctor.desiredSalary}</p>
            </div>
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-gray-400 mt-0.5" />
              <div>
                <div className="flex gap-0.5">
                  {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
                    <span key={day} className={`w-6 h-6 flex items-center justify-center rounded text-[11px] ${doctor.availableDays.includes(day) ? "bg-indigo-600 text-white" : "bg-gray-200/70 text-gray-400"}`}>{day}</span>
                  ))}
                </div>
                {doctor.availableStartDate && <p className="text-xs text-gray-400 mt-1">{doctor.availableStartDate}〜 入職可能</p>}
              </div>
            </div>
          </div>

          {doctor.ngConditions && doctor.ngConditions.length > 0 && (
            <p className="text-xs text-red-500">NG: {doctor.ngConditions.join("、")}</p>
          )}

          {doctor.selfPR && (
            <p className="text-sm text-gray-600 leading-relaxed">{doctor.selfPR}</p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">{position.title}</p>
              <p className="text-xs text-gray-400">{position.clinicName} / {position.salary}</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex gap-2 sticky bottom-0 bg-white rounded-b-xl">
          <button className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700 cursor-pointer font-medium flex items-center justify-center gap-1.5">
            面談を打診 <ArrowRight size={14} />
          </button>
          <button className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer">見送り</button>
        </div>
      </div>
    </div>
  );
}

function RecommendedDoctorCard({ doctor, position, rank, onAction, onDetail }: { doctor: Doctor; position: Position; rank: number; onAction: (a: string) => void; onDetail: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all group">
      <div className="flex items-start gap-3 mb-3">
        <ScoreRing score={doctor.matchScore ?? 0} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[11px] text-gray-300 tabular-nums">{rank}</span>
            <span className="font-medium text-sm text-gray-900">{doctor.anonymousName}</span>
            {doctor.status === "considering" && (
              <span className="text-[11px] text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">検討中</span>
            )}
          </div>
          <p className="text-xs text-gray-500">{doctor.specialty}{doctor.subSpecialty ? ` / ${doctor.subSpecialty}` : ""} / {doctor.yearsOfExperience}年目</p>
          <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
            <Stethoscope size={11} /> {position.title} ({position.clinicName})
          </p>
        </div>
      </div>

      <div className="space-y-0.5 mb-3">
        {doctor.matchReasons?.slice(0, 3).map((r, i) => (
          <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
            <Check size={12} className="text-indigo-400 mt-0.5 shrink-0" />
            <span>{r}</span>
          </div>
        ))}
        {doctor.matchCautions && doctor.matchCautions.length > 0 && (
          <div className="flex items-start gap-1.5 text-xs text-amber-600 mt-1">
            <AlertTriangle size={12} className="mt-0.5 shrink-0" />
            <span>{doctor.matchCautions[0]}{doctor.matchCautions.length > 1 ? ` 他${doctor.matchCautions.length - 1}件` : ""}</span>
          </div>
        )}
      </div>

      <div className="text-[11px] text-gray-400 mb-3">
        {doctor.qualifications.join("・")} / {doctor.desiredSalary} / {doctor.availableDays.join("・")}曜
      </div>

      <div className="flex items-center justify-end gap-1.5">
        <button onClick={onDetail} className="text-xs text-gray-500 px-2.5 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer flex items-center gap-0.5">
          詳細 <ChevronRight size={12} />
        </button>
        <button onClick={() => onAction("面談を打診")} className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-indigo-700 cursor-pointer flex items-center gap-1">
          面談を打診 <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

function DoctorPRGenerator({ doctor }: { doctor: Doctor }) {
  const [generatedPR, setGeneratedPR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState<"professional" | "friendly" | "confident">("professional");
  const [copied, setCopied] = useState(false);

  const generatePR = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "doctor-pr",
          doctor: {
            specialty: doctor.specialty,
            subSpecialty: doctor.subSpecialty,
            qualifications: doctor.qualifications,
            procedures: doctor.procedures,
            yearsOfExperience: doctor.yearsOfExperience,
            currentAffiliation: doctor.currentAffiliation,
            academicBackground: doctor.academicBackground,
            availableDays: doctor.availableDays,
            preferredArea: doctor.preferredArea,
            preferredWorkStyle: doctor.preferredWorkStyle,
            desiredSalary: doctor.desiredSalary,
          },
          tone,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedPR(data.result);
    } catch {
      setGeneratedPR("⚠ 生成に失敗しました。ANTHROPIC_API_KEY が設定されているか確認してください。");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedPR) {
      navigator.clipboard.writeText(generatedPR);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={12} className="text-violet-500" />
        <p className="text-[11px] font-medium text-gray-700">AI 自己PR生成</p>
      </div>
      <div className="flex gap-1 mb-2">
        {([["professional", "堅実"], ["friendly", "親しみ"], ["confident", "積極的"]] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTone(value)}
            className={`text-[10px] px-2 py-0.5 rounded-full cursor-pointer transition-colors ${tone === value ? "bg-violet-100 text-violet-700 font-medium" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <button
        onClick={generatePR}
        disabled={isGenerating}
        className="w-full bg-violet-600 text-white text-[11px] py-1.5 rounded-lg hover:bg-violet-700 cursor-pointer font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? <><Loader2 size={12} className="animate-spin" /> 生成中...</> : <><Sparkles size={12} /> 自己PRを生成</>}
      </button>
      {generatedPR && (
        <div className="mt-2.5">
          <div className="bg-violet-50/50 rounded-lg p-2.5 text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
            {generatedPR}
          </div>
          <div className="flex gap-1.5 mt-1.5">
            <button onClick={copyToClipboard} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-violet-600 cursor-pointer px-1.5 py-0.5 rounded hover:bg-gray-50">
              {copied ? <><Check size={10} className="text-green-500" /> コピー済</> : <><Copy size={10} /> コピー</>}
            </button>
            <button onClick={generatePR} disabled={isGenerating} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-violet-600 cursor-pointer px-1.5 py-0.5 rounded hover:bg-gray-50 disabled:opacity-50">
              <RefreshCw size={10} /> 再生成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DoctorProfilePanel({ doctor }: { doctor: Doctor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-16">
      <div className="flex items-center gap-2 mb-4">
        <Avatar name={doctor.anonymousName} />
        <div>
          <p className="text-sm font-medium text-gray-900">あなたのプロフィール</p>
          <p className="text-[11px] text-gray-400">{doctor.specialty}</p>
        </div>
      </div>
      <div className="space-y-2.5 text-xs">
        <div>
          <p className="text-gray-400 mb-0.5">資格</p>
          <p className="text-gray-700">{doctor.qualifications.join("・")}</p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">手技</p>
          <p className="text-gray-700">{doctor.procedures.join("、")}</p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">勤務可能日</p>
          <div className="flex gap-0.5 mt-0.5">
            {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
              <span key={day} className={`w-5 h-5 flex items-center justify-center rounded text-[10px] ${doctor.availableDays.includes(day) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>{day}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">希望</p>
          <p className="text-gray-700">{doctor.preferredArea} / {doctor.desiredSalary}</p>
        </div>
        {doctor.ngConditions && (
          <p className="text-red-500">NG: {doctor.ngConditions.join("、")}</p>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-[11px] text-gray-400 mb-1.5">匿名公開範囲</p>
        <div className="space-y-1">
          {["専門科・資格", "経験年数・手技", "希望エリア・条件"].map((item) => (
            <label key={item} className="flex items-center gap-1.5 text-[11px] cursor-pointer text-gray-600">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-indigo-600 w-3 h-3" />{item}
            </label>
          ))}
        </div>
      </div>
      <DoctorPRGenerator doctor={doctor} />
    </div>
  );
}

function ClinicProposalGenerator({ position, clinicData }: { position: Position; clinicData?: typeof clinics[0] }) {
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "clinic-proposal",
          position: {
            title: position.title,
            clinicName: position.clinicName,
            clinicType: position.clinicType,
            area: position.area,
            specialty: position.specialty,
            requiredQualifications: position.requiredQualifications,
            preferredQualifications: position.preferredQualifications,
            preferredProcedures: position.preferredProcedures,
            employmentType: position.employmentType,
            workSchedule: position.workSchedule,
            salary: position.salary,
            benefits: position.benefits,
            reason: position.reason,
            reasonDetail: position.reasonDetail,
          },
          clinic: clinicData ? {
            name: clinicData.name,
            area: clinicData.area,
            type: clinicData.type,
            bedCount: clinicData.bedCount,
            staffCount: clinicData.staffCount,
            features: clinicData.features,
          } : undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedProposal(data.result);
    } catch {
      setGeneratedProposal("⚠ 生成に失敗しました。ANTHROPIC_API_KEY が設定されているか確認してください。");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedProposal) {
      navigator.clipboard.writeText(generatedProposal);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <FileText size={14} className="text-indigo-500" />
          <p className="text-xs font-medium text-gray-700">条件提示書を作成</p>
        </div>
        <p className="text-[11px] text-gray-400">{position.title}</p>
      </div>
      <button
        onClick={generate}
        disabled={isGenerating}
        className="w-full bg-indigo-600 text-white text-xs py-2 rounded-lg hover:bg-indigo-700 cursor-pointer font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? <><Loader2 size={13} className="animate-spin" /> AI生成中...</> : <><Sparkles size={13} /> AIで条件提示書を生成</>}
      </button>
      {generatedProposal && (
        <div className="mt-3">
          <div className="bg-indigo-50/50 rounded-lg p-3 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
            {generatedProposal}
          </div>
          <div className="flex gap-1.5 mt-2">
            <button onClick={copyToClipboard} className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-indigo-600 cursor-pointer px-2 py-1 rounded hover:bg-gray-50">
              {copied ? <><Check size={11} className="text-green-500" /> コピー済</> : <><Copy size={11} /> コピー</>}
            </button>
            <button onClick={generate} disabled={isGenerating} className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-indigo-600 cursor-pointer px-2 py-1 rounded hover:bg-gray-50 disabled:opacity-50">
              <RefreshCw size={11} /> 再生成
            </button>
          </div>
        </div>
      )}
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
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">今週の推奨候補</h2>
          <p className="text-xs text-gray-400 mt-0.5">{recommendedDoctors.length}名の候補が見つかりました</p>
        </div>
      </div>

      {/* Vacancy chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {topPositions.slice(0, 3).map((pos) => (
          <div key={pos.id} className="bg-white rounded-lg border border-gray-100 px-3 py-2 min-w-[180px] flex-shrink-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Stethoscope size={12} className="text-gray-400" />
              <p className="text-xs font-medium text-gray-900 truncate">{pos.title}</p>
              {pos.urgency === "high" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
            </div>
            <p className="text-[11px] text-gray-400">{pos.salary} / {pos.interestedCount}名関心</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {recommendedDoctors
          .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
          .slice(0, 3)
          .map((doc, idx) => {
            const matchingPos = topPositions.find((p) => p.specialty === doc.specialty);
            if (!matchingPos) return null;
            return (
              <RecommendedDoctorCard
                key={doc.id} doctor={doc} position={matchingPos} rank={idx + 1}
                onAction={handleAction}
                onDetail={() => setSelectedDoctor({ doctor: doc, position: matchingPos })}
              />
            );
          })}
      </div>
      {recommendedDoctors.length > 3 && (
        <button className="w-full text-center text-xs text-gray-400 mt-3 py-2 hover:text-indigo-500 cursor-pointer">
          他{recommendedDoctors.length - 3}名の候補を見る
        </button>
      )}

      {/* AI条件提示書生成 */}
      <div className="mt-6">
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles size={14} className="text-indigo-500" />
          <h3 className="text-sm font-semibold text-gray-900">AI文書作成</h3>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">NEW</span>
        </div>
        <div className="space-y-2">
          {topPositions.slice(0, 2).map((pos) => {
            const clinic = clinics.find((c) => c.id === pos.clinicId);
            return <ClinicProposalGenerator key={pos.id} position={pos} clinicData={clinic} />;
          })}
        </div>
      </div>

      {selectedDoctor && <DoctorDetailModal doctor={selectedDoctor.doctor} position={selectedDoctor.position} onClose={() => setSelectedDoctor(null)} />}
      {toast && <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3.5 py-2 rounded-lg text-xs z-50">{toast}</div>}
    </div>
  );
}

function DoctorDashboard() {
  const [toast, setToast] = useState<string | null>(null);
  const currentDoctor = doctors[0];
  const incomingProposals = positions.filter((p) => p.specialty === currentDoctor.specialty && p.status === "open");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">あなたへの提案 ({incomingProposals.length}件)</h2>
        </div>
        {incomingProposals.map((pos) => {
          const clinic = clinics.find((c) => c.id === pos.clinicId);
          return (
            <div key={pos.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all">
              <div className="mb-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-medium text-sm text-gray-900">{pos.title}</h3>
                  {pos.urgency === "high" && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                </div>
                <p className="text-xs text-gray-500">{pos.clinicName} / {pos.area}</p>
                {clinic && <p className="text-[11px] text-gray-400">{clinic.type}</p>}
              </div>
              <div className="text-xs text-gray-600 space-y-0.5 mb-2.5">
                <p>{pos.employmentType} / {pos.salary}</p>
                {pos.workSchedule && <p className="text-gray-400">{pos.workSchedule}</p>}
              </div>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{pos.reason}</p>
              <div className="flex gap-1.5">
                <button onClick={() => { setToast("関心ありを送信しました"); setTimeout(() => setToast(null), 2000); }}
                  className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-indigo-700 cursor-pointer">関心あり</button>
                <button className="text-xs text-gray-500 px-2.5 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer">質問する</button>
              </div>
            </div>
          );
        })}
        {toast && <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3.5 py-2 rounded-lg text-xs z-50">{toast}</div>}
      </div>
      <div><DoctorProfilePanel doctor={currentDoctor} /></div>
    </div>
  );
}

export default function ConciergePage() {
  const [view, setView] = useState<"clinic" | "doctor">("clinic");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Concierge-first</h1>
          <p className="text-xs text-gray-400">推奨候補を厳選提示</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setView("clinic")} className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${view === "clinic" ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500"}`}>医院側</button>
          <button onClick={() => setView("doctor")} className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${view === "doctor" ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500"}`}>医師側</button>
        </div>
      </div>
      {view === "clinic" ? <ClinicDashboard /> : <DoctorDashboard />}
    </div>
  );
}
