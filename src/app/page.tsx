import Link from "next/link";

const patterns = [
  {
    href: "/concierge",
    number: "1",
    title: "Concierge-first 型",
    subtitle: "厳選レコメンド",
    description:
      "「今週の推奨3名」「なぜ合うか」「次に押すべき1ボタン」を配置。低流動性に強く、最初の1件の価値が高い領域に最適。",
    features: [
      "AIによる推奨候補の厳選",
      "マッチ理由の明示",
      "匿名プロフィール公開範囲の制御",
      "ワンアクションで面談打診",
    ],
    pricing: "医院側の月額 + 成功報酬 / 着手金 + 成功報酬",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    color: "emerald",
  },
  {
    href: "/board",
    number: "2",
    title: "Request Board 型",
    subtitle: "案件ボード",
    description:
      "医院が案件を構造化して掲載し、医師が匿名で関心表明。通知・保存・匿名関心表明・募集理由の明示を強化。",
    features: [
      "構造化された案件カード",
      "専門科フィルタリング",
      "ブックマーク保存機能",
      "匿名での関心表明",
    ],
    pricing: "掲載課金 / 月額サブスク / 優先表示",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    color: "blue",
  },
  {
    href: "/pipeline",
    number: "3",
    title: "Pipeline OS 型",
    subtitle: "採用パイプライン",
    description:
      "発見よりも案件進行を中心に。募集作成から定着フォローまでを一画面のカンバンで管理。採用進行のインフラとして機能。",
    features: [
      "7ステージのカンバンボード",
      "ワンクリックでステージ進行",
      "資格確認ステータス管理",
      "募集ポジション別パイプライン",
    ],
    pricing: "医院向けSaaS月額 + オプション成功報酬",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: "purple",
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; hover: string; iconBg: string; iconText: string }> = {
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    hover: "hover:border-emerald-400",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    hover: "hover:border-blue-400",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    hover: "hover:border-purple-400",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
  },
};

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-6">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          プロトタイプ — 3パターン比較
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          医師・医院マッチング
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          同じ課題に対する3つのUIアプローチ。
          それぞれの型が異なる市場特性と料金設計に対応します。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {patterns.map((p) => {
          const c = colorMap[p.color];
          return (
            <Link
              key={p.href}
              href={p.href}
              className={`group flex flex-col rounded-2xl border-2 ${c.border} ${c.hover} p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className={`w-14 h-14 rounded-xl ${c.iconBg} ${c.iconText} flex items-center justify-center mb-4`}>
                {p.icon}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge} uppercase tracking-wider`}>
                  型{p.number}
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">{p.title}</h2>
              <p className="text-xs text-gray-400 mb-3">{p.subtitle}</p>

              <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-grow">{p.description}</p>

              <ul className="space-y-2 mb-5">
                {p.features.map((f) => (
                  <li key={f} className="text-xs text-gray-500 flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <div className={`${c.bg} rounded-xl p-3 mb-4`}>
                <p className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wider">料金設計</p>
                <p className="text-xs text-gray-700 font-medium">{p.pricing}</p>
              </div>

              <div className="text-sm font-semibold text-gray-900 flex items-center gap-2 group-hover:gap-3 transition-all">
                プロトタイプを見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
