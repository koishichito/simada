"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  LayoutGrid,
  GitBranch,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Users,
  Building2,
  Search,
  Bookmark,
  Eye,
  Star,
  CheckCircle2,
  MousePointerClick,
  Monitor,
  BookOpen,
} from "lucide-react";

type Step = {
  title: string;
  description: string;
  icon: React.ElementType;
};

type Section = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
  accentBg: string;
  href: string;
  overview: string;
  clinicSteps: Step[];
  doctorSteps: Step[];
};

const sections: Section[] = [
  {
    id: "concierge",
    title: "Concierge-first",
    subtitle: "厳選マッチング",
    icon: Sparkles,
    accent: "text-violet-600",
    accentBg: "bg-violet-50",
    href: "/concierge",
    overview:
      "運営が厳選した推奨候補を1件ずつ提示するUIです。マッチスコアと推奨理由を確認しながら、確実にマッチングを進めることができます。",
    clinicSteps: [
      {
        title: "推奨候補を確認",
        description:
          "ダッシュボードに表示される「今週のおすすめ医師」リストから、マッチスコアの高い候補を確認します。",
        icon: Star,
      },
      {
        title: "マッチ理由を確認",
        description:
          "各候補カードに表示される「マッチ理由」（緑）と「注意点」（黄）を確認し、相性を判断します。",
        icon: CheckCircle2,
      },
      {
        title: "詳細プロフィールを閲覧",
        description:
          "候補カードの「詳細を見る」ボタンをクリックすると、資格・施術実績・勤務可能日などの詳細情報が表示されます。",
        icon: Eye,
      },
      {
        title: "面談をリクエスト",
        description:
          "候補に興味がある場合は「面談をリクエスト」ボタンから次のステップへ進みます。",
        icon: MousePointerClick,
      },
    ],
    doctorSteps: [
      {
        title: "ポジション提案を確認",
        description:
          "「医師ダッシュボード」タブに切り替えると、あなたに届いたポジション提案の一覧が表示されます。",
        icon: Building2,
      },
      {
        title: "条件を確認",
        description:
          "各提案カードで給与・勤務形態・勤務地などの条件を確認できます。",
        icon: Eye,
      },
      {
        title: "匿名設定を管理",
        description:
          "プロフィールパネルで「匿名プロフィール共有」の設定を管理し、どの情報を公開するか制御できます。",
        icon: Users,
      },
    ],
  },
  {
    id: "board",
    title: "Request Board",
    subtitle: "案件掲示板",
    icon: LayoutGrid,
    accent: "text-sky-600",
    accentBg: "bg-sky-50",
    href: "/board",
    overview:
      "案件を掲示板形式で掲載し、医師が匿名で関心を表明できるUIです。自由に案件を検索・閲覧し、気になるものを保存できます。",
    clinicSteps: [
      {
        title: "掲載中の案件を管理",
        description:
          "「クリニック管理」タブで、掲載中のポジション一覧と各案件の関心数を確認します。",
        icon: Building2,
      },
      {
        title: "興味を持った医師を確認",
        description:
          "各案件の「興味あり医師を見る」をクリックすると、匿名化された医師プロフィールが表示されます。",
        icon: Users,
      },
    ],
    doctorSteps: [
      {
        title: "案件を検索",
        description:
          "検索バーでポジション名・クリニック名・エリアを入力し、専門科目のフィルタで絞り込みます。",
        icon: Search,
      },
      {
        title: "案件詳細を閲覧",
        description:
          "案件カードをクリックすると、給与・勤務条件・求める資格などの詳細が表示されます。",
        icon: Eye,
      },
      {
        title: "案件を保存",
        description:
          "気になる案件のブックマークアイコンをクリックして保存します。後から見返すことができます。",
        icon: Bookmark,
      },
      {
        title: "興味を表明",
        description:
          "案件詳細画面の「興味あり」ボタンで匿名のまま関心を表明できます。",
        icon: MousePointerClick,
      },
    ],
  },
  {
    id: "pipeline",
    title: "Pipeline OS",
    subtitle: "パイプライン管理",
    icon: GitBranch,
    accent: "text-teal-600",
    accentBg: "bg-teal-50",
    href: "/pipeline",
    overview:
      "採用プロセス全体をカンバンボードで可視化するUIです。候補者を7つのステージで管理し、進捗と次のアクションを一目で把握できます。",
    clinicSteps: [
      {
        title: "パイプライン全体を把握",
        description:
          "カンバンボードで「ソーシング → 興味あり → 面談 → 条件交渉 → オファー → 成約 → フォローアップ」の7ステージを俯瞰します。",
        icon: Monitor,
      },
      {
        title: "候補者カードを確認",
        description:
          "各カードに表示される次のアクション・期限・緊急度を確認します。赤枠のカードは期限が迫っています。",
        icon: Eye,
      },
      {
        title: "候補者の詳細を管理",
        description:
          "カードをクリックすると「概要・活動ログ・メモ」のタブで進捗詳細を確認・記録できます。",
        icon: BookOpen,
      },
      {
        title: "新規ポジションを作成",
        description:
          "「新規ポジション」ボタンから、新しい採用ポジションをフォームで作成できます。",
        icon: MousePointerClick,
      },
    ],
    doctorSteps: [
      {
        title: "進捗状況を確認",
        description:
          "自分が応募中のポジションについて、現在のステージとプログレスバーで進捗を確認できます。",
        icon: CheckCircle2,
      },
      {
        title: "活動ログを閲覧",
        description:
          "詳細画面の「Activity」タブで、面談日程・条件変更などの活動履歴を時系列で確認できます。",
        icon: BookOpen,
      },
    ],
  },
];

function StepList({ steps, accent }: { steps: Step[]; accent: string }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <li key={i} className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className={`text-xs font-semibold ${accent}`}>
                  {i + 1}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon size={13} className={accent} />
                <span className="text-sm font-medium text-gray-900">
                  {step.title}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function TutorialPage() {
  const [expandedId, setExpandedId] = useState<string | null>("concierge");

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Link href="/" className="hover:text-gray-600 transition-colors">
            ホーム
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">チュートリアル</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
          UIチュートリアル
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          3つのUIパターンの使い方を、クリニック側・医師側それぞれの視点で解説します。
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedId === section.id;
          const Icon = section.icon;

          return (
            <div
              key={section.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? "border-gray-200 shadow-sm"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : section.id)
                }
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isExpanded
                      ? `${section.accentBg} ${section.accent}`
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-medium text-gray-900">
                    {section.title}
                  </h2>
                  <p className="text-xs text-gray-400">{section.subtitle}</p>
                </div>
                {isExpanded ? (
                  <ChevronDown size={14} className="text-gray-400" />
                ) : (
                  <ChevronRight size={14} className="text-gray-300" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 pl-11">
                    {section.overview}
                  </p>

                  <div className="space-y-4 pl-11">
                    <div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <Building2 size={13} className="text-gray-400" />
                        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          クリニック側の操作
                        </h3>
                      </div>
                      <StepList
                        steps={section.clinicSteps}
                        accent={section.accent}
                      />
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Users size={13} className="text-gray-400" />
                        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          医師側の操作
                        </h3>
                      </div>
                      <StepList
                        steps={section.doctorSteps}
                        accent={section.accent}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pl-11">
                    <Link
                      href={section.href}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${section.accent} hover:underline`}
                    >
                      {section.title} を試す
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl bg-gray-50 border border-gray-100 px-4 py-4">
        <h2 className="text-sm font-medium text-gray-900 mb-2">
          どのUIを選ぶべき？
        </h2>
        <ul className="space-y-2 text-xs text-gray-500">
          <li className="flex items-start gap-2">
            <Sparkles size={13} className="text-violet-500 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-gray-700">Concierge-first</strong> —
              少数精鋭のマッチングで質を重視したい場合に最適です。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <LayoutGrid size={13} className="text-sky-500 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-gray-700">Request Board</strong> —
              医師に自由に案件を探してもらい、幅広く関心を集めたい場合に向いています。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <GitBranch size={13} className="text-teal-500 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-gray-700">Pipeline OS</strong> —
              複数案件を並行管理し、進捗を漏れなく追いたい場合に使います。
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
