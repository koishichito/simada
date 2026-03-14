import Link from "next/link";
import { Sparkles, LayoutGrid, GitBranch, BookOpen, ArrowRight } from "lucide-react";

const patterns = [
  {
    href: "/concierge",
    title: "Concierge-first",
    description: "厳選された推奨候補を提示し、1件ずつ確実に進める",
    icon: Sparkles,
    accent: "group-hover:bg-violet-50 group-hover:text-violet-600",
  },
  {
    href: "/board",
    title: "Request Board",
    description: "案件を構造化して掲載し、医師が匿名で関心を表明",
    icon: LayoutGrid,
    accent: "group-hover:bg-sky-50 group-hover:text-sky-600",
  },
  {
    href: "/pipeline",
    title: "Pipeline OS",
    description: "採用進行をカンバンで管理し、パイプライン全体を可視化",
    icon: GitBranch,
    accent: "group-hover:bg-teal-50 group-hover:text-teal-600",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="font-semibold text-gray-900">SIMADA</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight leading-tight">
          医師・医院<br />マッチング
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          3つのUIアプローチ
        </p>
      </div>

      <Link
        href="/tutorial"
        className="group flex items-center gap-3 rounded-xl bg-indigo-50/50 px-4 py-3 border border-indigo-100 transition-all hover:shadow-sm hover:border-indigo-200 mb-4"
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
          <BookOpen size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium text-gray-900">チュートリアル</h2>
          <p className="text-xs text-gray-400 mt-0.5">各UIパターンの使い方ガイド</p>
        </div>
        <ArrowRight size={14} className="text-indigo-300 group-hover:text-indigo-400 transition-colors" />
      </Link>

      <div className="space-y-2">
        {patterns.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.href}
              href={p.href}
              className="group flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 border border-gray-100 transition-all hover:shadow-sm hover:border-gray-200"
            >
              <div className={`w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center transition-colors ${p.accent}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium text-gray-900">{p.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
