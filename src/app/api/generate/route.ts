import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type } = body;

  if (type === "doctor-pr") {
    return generateDoctorPR(body);
  } else if (type === "clinic-proposal") {
    return generateClinicProposal(body);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

async function generateDoctorPR(body: {
  doctor: {
    specialty: string;
    subSpecialty?: string;
    qualifications: string[];
    procedures: string[];
    yearsOfExperience: number;
    currentAffiliation?: string;
    academicBackground?: string;
    availableDays: string[];
    preferredArea: string;
    preferredWorkStyle?: string;
    desiredSalary: string;
  };
  tone?: string;
}) {
  const { doctor, tone = "professional" } = body;

  const toneInstruction =
    tone === "friendly"
      ? "親しみやすく温かい文体で"
      : tone === "confident"
        ? "自信に満ちた力強い文体で"
        : "プロフェッショナルで信頼感のある文体で";

  const prompt = `あなたは医師の転職・採用支援のプロフェッショナルです。
以下の医師プロフィール情報をもとに、医院側に向けた魅力的な自己PR文を${toneInstruction}作成してください。

【医師プロフィール】
- 専門科目: ${doctor.specialty}${doctor.subSpecialty ? `（サブスペシャリティ: ${doctor.subSpecialty}）` : ""}
- 資格: ${doctor.qualifications.join("、")}
- 対応可能な手技・処置: ${doctor.procedures.join("、")}
- 経験年数: ${doctor.yearsOfExperience}年
${doctor.currentAffiliation ? `- 現所属: ${doctor.currentAffiliation}` : ""}
${doctor.academicBackground ? `- 学歴: ${doctor.academicBackground}` : ""}
- 勤務可能曜日: ${doctor.availableDays.join("、")}
- 希望エリア: ${doctor.preferredArea}
${doctor.preferredWorkStyle ? `- 希望勤務スタイル: ${doctor.preferredWorkStyle}` : ""}
- 希望年収: ${doctor.desiredSalary}

【要件】
- 200〜400文字程度
- 医師の強みと経験を具体的にアピール
- 医院側が「この先生と面談したい」と思える内容に
- 箇条書きではなく、自然な文章で
- 最初に「はじめまして」等の挨拶は不要。自己PRとして直接本題から入る`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Doctor PR generation error:", error);
    return NextResponse.json(
      { error: "AI生成に失敗しました。APIキーを確認してください。" },
      { status: 500 }
    );
  }
}

async function generateClinicProposal(body: {
  position: {
    title: string;
    clinicName: string;
    clinicType?: string;
    area: string;
    specialty: string;
    requiredQualifications: string[];
    preferredQualifications?: string[];
    preferredProcedures: string[];
    employmentType: string;
    workSchedule?: string;
    salary: string;
    benefits?: string[];
    reason: string;
    reasonDetail?: string;
  };
  clinic?: {
    name: string;
    area: string;
    type: string;
    bedCount?: number;
    staffCount?: number;
    features?: string[];
  };
}) {
  const { position, clinic } = body;

  const prompt = `あなたは医療機関の採用担当コンサルタントです。
以下の募集ポジション情報と医院情報をもとに、医師に提示するための「条件提示書」をフォーマルかつ魅力的に作成してください。

【募集ポジション】
- ポジション名: ${position.title}
- 医院名: ${position.clinicName}
${position.clinicType ? `- 医院種別: ${position.clinicType}` : ""}
- エリア: ${position.area}
- 診療科: ${position.specialty}
- 必須資格: ${position.requiredQualifications.join("、")}
${position.preferredQualifications ? `- 歓迎資格: ${position.preferredQualifications.join("、")}` : ""}
- 求める手技: ${position.preferredProcedures.join("、")}
- 雇用形態: ${position.employmentType}
${position.workSchedule ? `- 勤務体制: ${position.workSchedule}` : ""}
- 年収: ${position.salary}
${position.benefits ? `- 福利厚生: ${position.benefits.join("、")}` : ""}
- 募集背景: ${position.reason}
${position.reasonDetail ? `- 詳細: ${position.reasonDetail}` : ""}

${
  clinic
    ? `【医院情報】
- 医院名: ${clinic.name}
- エリア: ${clinic.area}
- 種別: ${clinic.type}
${clinic.bedCount ? `- 病床数: ${clinic.bedCount}床` : ""}
${clinic.staffCount ? `- スタッフ数: ${clinic.staffCount}名` : ""}
${clinic.features ? `- 特徴: ${clinic.features.join("、")}` : ""}`
    : ""
}

【要件】
- 以下のセクションで構成:
  1. ご挨拶（医院の紹介と募集の趣旨を簡潔に）
  2. 募集概要（ポジション、診療科、雇用形態）
  3. 勤務条件（年収、勤務体制、福利厚生）
  4. 求める人材像（資格、スキル、人物像）
  5. 当院の魅力（働く環境としての強み）
- フォーマルだが堅すぎない文体
- 医師が「ここで働きたい」と思える内容に
- 全体で400〜600文字程度`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Clinic proposal generation error:", error);
    return NextResponse.json(
      { error: "AI生成に失敗しました。APIキーを確認してください。" },
      { status: 500 }
    );
  }
}
