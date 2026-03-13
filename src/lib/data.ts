// Dummy data for the medical staffing platform

export type Doctor = {
  id: string;
  anonymousName: string;
  specialty: string;
  subSpecialty?: string;
  qualifications: string[];
  procedures: string[];
  yearsOfExperience: number;
  currentAffiliation?: string;
  academicBackground?: string;
  availableDays: string[];
  availableStartDate?: string;
  preferredArea: string;
  preferredWorkStyle?: string;
  desiredSalary: string;
  ngConditions?: string[];
  selfPR?: string;
  status: "active" | "considering" | "paused";
  lastActiveAt?: string;
  matchScore?: number;
  matchReasons?: string[];
  matchCautions?: string[];
};

export type Clinic = {
  id: string;
  name: string;
  area: string;
  type: string;
  bedCount?: number;
  staffCount?: number;
  features?: string[];
  website?: string;
};

export type Position = {
  id: string;
  clinicId: string;
  clinicName: string;
  clinicType?: string;
  area: string;
  title: string;
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
  urgency: "high" | "medium" | "low";
  deadline?: string;
  postedAt: string;
  status: "open" | "interviewing" | "filled";
  interestedCount: number;
  viewCount?: number;
};

export type PipelineCandidate = {
  id: string;
  doctorId: string;
  doctorName: string;
  positionId: string;
  positionTitle: string;
  clinicName: string;
  stage: "sourced" | "interested" | "interview" | "negotiation" | "offer" | "placed" | "follow_up";
  updatedAt: string;
  createdAt: string;
  nextAction: string;
  nextActionDeadline?: string;
  qualificationVerified: boolean;
  notes?: string[];
  activityLog: ActivityLogEntry[];
};

export type ActivityLogEntry = {
  date: string;
  action: string;
  actor: "system" | "clinic" | "doctor" | "admin";
  detail?: string;
};

export type Notification = {
  id: string;
  type: "match" | "interest" | "interview" | "message" | "system";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
};

export const clinics: Clinic[] = [
  {
    id: "c1",
    name: "銀座三丁目消化器・内視鏡クリニック",
    area: "東京都中央区銀座3-5-12",
    type: "有床診療所",
    bedCount: 19,
    staffCount: 45,
    features: ["内視鏡センター併設", "ESD年間200件", "大学病院連携"],
    website: "https://example.com/ginza-gi",
  },
  {
    id: "c2",
    name: "新横浜けいゆう整形外科病院",
    area: "神奈川県横浜市港北区新横浜2-1-8",
    type: "一般病院（99床）",
    bedCount: 99,
    staffCount: 180,
    features: ["手術室4室", "リハビリセンター", "スポーツ外来"],
  },
  {
    id: "c3",
    name: "北浜よつば総合病院",
    area: "大阪府大阪市北区梅田1-12-3",
    type: "総合病院（320床）",
    bedCount: 320,
    staffCount: 650,
    features: ["手術室8室", "救急指定", "研修指定病院", "24時間麻酔科常駐"],
  },
  {
    id: "c4",
    name: "おおさき皮膚科クリニック",
    area: "東京都品川区大崎1-6-4",
    type: "無床診療所",
    staffCount: 12,
    features: ["保険診療+自費診療", "レーザー機器5台", "美容皮膚科併設"],
  },
  {
    id: "c5",
    name: "まつだ内科・消化器クリニック",
    area: "千葉県千葉市中央区富士見2-3-1",
    type: "無床診療所",
    staffCount: 15,
    features: ["消化器内科", "一般内科", "健診センター"],
  },
  {
    id: "c6",
    name: "湘南辻堂リハビリテーション病院",
    area: "神奈川県藤沢市辻堂4-2-10",
    type: "回復期リハビリテーション病院（120床）",
    bedCount: 120,
    staffCount: 200,
    features: ["回復期リハビリ病棟", "整形外科外来", "在宅医療連携"],
  },
];

export const doctors: Doctor[] = [
  {
    id: "d1",
    anonymousName: "Dr. A（匿名）",
    specialty: "消化器内科",
    subSpecialty: "内視鏡治療",
    qualifications: ["内科専門医", "消化器病専門医", "内視鏡専門医"],
    procedures: ["上部内視鏡", "下部内視鏡", "ESD", "ERCP", "EUS"],
    yearsOfExperience: 12,
    currentAffiliation: "大学病院（助教）",
    academicBackground: "国立大学医学部卒、同大学院修了（医学博士）",
    availableDays: ["月", "火", "木"],
    availableStartDate: "2026-06-01",
    preferredArea: "東京都23区",
    preferredWorkStyle: "クリニック中心の内視鏡専門外来を希望。当直なしが条件。",
    desiredSalary: "年収1,750万〜",
    ngConditions: ["当直あり", "救急対応必須"],
    selfPR: "大学病院でESD 300件以上の経験あり。学会発表・論文実績も豊富で、後進の指導にも意欲があります。",
    status: "active",
    lastActiveAt: "2026-03-13",
    matchScore: 95,
    matchReasons: [
      "内視鏡専門医の資格が合致",
      "ESD経験300件が求人要件を大幅に上回る",
      "希望エリアが勤務地と合致",
      "当直なし希望と募集条件が一致",
    ],
    matchCautions: [
      "希望開始日が6月のため、急募対応は要相談",
    ],
  },
  {
    id: "d2",
    anonymousName: "Dr. B（匿名）",
    specialty: "整形外科",
    subSpecialty: "関節外科・スポーツ整形",
    qualifications: ["整形外科専門医", "スポーツ医", "運動器リハビリテーション医"],
    procedures: ["人工関節置換術（TKA/THA）", "関節鏡手術（膝・肩）", "骨折観血的整復", "ACL再建術"],
    yearsOfExperience: 8,
    currentAffiliation: "急性期病院（医長）",
    academicBackground: "私立大学医学部卒",
    availableDays: ["水", "金"],
    availableStartDate: "2026-04-01",
    preferredArea: "神奈川県",
    preferredWorkStyle: "手術を中心とした業務。外来は週2日程度。",
    desiredSalary: "年収1,950万〜",
    ngConditions: ["外来のみ", "手術機会が少ない"],
    selfPR: "関節鏡手術を専門に年間150件以上の手術実績。スポーツ外来での経験も豊富です。",
    status: "active",
    lastActiveAt: "2026-03-12",
    matchScore: 82,
    matchReasons: [
      "整形外科専門医の資格が合致",
      "関節鏡手術150件/年の実績が即戦力",
      "エリアが隣接（通勤圏内30分）",
    ],
    matchCautions: [
      "年収希望が1,950万以上（求人上限2,500万円）",
      "水・金のみのため常勤形態の調整が必要",
      "副部長ポジションへの関心度が未確認",
    ],
  },
  {
    id: "d3",
    anonymousName: "Dr. C（匿名）",
    specialty: "麻酔科",
    subSpecialty: "心臓麻酔・ペインクリニック",
    qualifications: ["麻酔科専門医", "ペインクリニック専門医", "集中治療専門医"],
    procedures: ["全身麻酔", "硬膜外麻酔", "神経ブロック", "心臓麻酔（人工心肺管理）", "超音波ガイド下神経ブロック"],
    yearsOfExperience: 15,
    currentAffiliation: "大学病院（講師）",
    academicBackground: "国立大学医学部卒、同大学院修了（医学博士）",
    availableDays: ["月", "火", "水", "木", "金"],
    availableStartDate: "2026-07-01",
    preferredArea: "大阪府",
    preferredWorkStyle: "手術麻酔を中心に、ペインクリニック外来も週1回希望。",
    desiredSalary: "年収2,200万〜",
    ngConditions: ["非常勤のみ", "地方勤務"],
    selfPR: "全身麻酔5,000件以上、心臓麻酔500件以上の経験。集中治療の指導医資格も保持。部門の立ち上げ・運営経験あり。",
    status: "considering",
    lastActiveAt: "2026-03-10",
    matchScore: 78,
    matchReasons: [
      "麻酔科専門医+集中治療専門医",
    ],
    matchCautions: [
      "年収希望2,200万以上（求人上限2,400万円で交渉余地あり）",
      "開始が7月と遅め",
      "現在「検討中」ステータス — 転職意思が確定していない",
    ],
  },
  {
    id: "d4",
    anonymousName: "Dr. D（匿名）",
    specialty: "皮膚科",
    subSpecialty: "美容皮膚科",
    qualifications: ["皮膚科専門医", "レーザー専門医"],
    procedures: ["レーザー治療（CO2・Qスイッチ）", "皮膚生検", "小手術（粉瘤等）", "ケミカルピーリング", "ボトックス注射"],
    yearsOfExperience: 6,
    currentAffiliation: "美容クリニック勤務医",
    academicBackground: "私立大学医学部卒",
    availableDays: ["火", "木", "土"],
    availableStartDate: "2026-04-15",
    preferredArea: "東京都23区",
    preferredWorkStyle: "保険診療と自費診療の両立。美容のみでなく一般皮膚科も対応したい。",
    desiredSalary: "年収1,450万〜",
    selfPR: "保険診療の経験を基盤に、美容皮膚科の技術を習得。両方のニーズに対応できることが強みです。",
    status: "active",
    lastActiveAt: "2026-03-13",
    matchScore: 88,
    matchReasons: [
      "皮膚科専門医+レーザー専門医で要件完全合致",
      "保険+自費の両立志向が医院方針と一致",
      "4月開始可能で早期着任が可能",
    ],
  },
  {
    id: "d5",
    anonymousName: "Dr. E（匿名）",
    specialty: "消化器内科",
    subSpecialty: "一般消化器内科",
    qualifications: ["内科専門医", "消化器病専門医"],
    procedures: ["上部内視鏡", "腹部エコー", "下部内視鏡（研修中）"],
    yearsOfExperience: 4,
    currentAffiliation: "市中病院（後期研修修了）",
    academicBackground: "国立大学医学部卒",
    availableDays: ["月", "水", "金"],
    availableStartDate: "2026-04-01",
    preferredArea: "千葉県",
    preferredWorkStyle: "内視鏡スキルを伸ばせる環境。指導医がいることが望ましい。",
    desiredSalary: "年収1,350万〜",
    ngConditions: ["僻地勤務"],
    selfPR: "後期研修を修了し消化器病専門医を取得。上部内視鏡は1,000件以上の経験あり。下部内視鏡・ESDの技術習得に意欲的です。",
    status: "active",
    lastActiveAt: "2026-03-14",
    matchScore: 70,
    matchReasons: [
      "消化器病専門医の資格が合致",
      "4月から即入職可能",
    ],
    matchCautions: [
      "ESD未経験（要育成）",
      "希望エリアが千葉県で東京中央区から遠い",
      "下部内視鏡は研修中レベル",
    ],
  },
  {
    id: "d6",
    anonymousName: "Dr. F（匿名）",
    specialty: "消化器内科",
    subSpecialty: "肝臓内科",
    qualifications: ["内科専門医", "消化器病専門医", "肝臓専門医"],
    procedures: ["上部内視鏡", "腹部エコー", "肝生検", "TACE", "RFA"],
    yearsOfExperience: 10,
    currentAffiliation: "大学病院（助教）",
    academicBackground: "私立大学医学部卒、同大学院修了（医学博士）",
    availableDays: ["月", "火", "水", "木", "金"],
    availableStartDate: "2026-09-01",
    preferredArea: "東京都・神奈川県",
    preferredWorkStyle: "消化器全般を幅広くカバーしたい。肝臓外来も希望。",
    desiredSalary: "年収1,800万〜",
    selfPR: "肝臓内科を専門に10年。C型肝炎のDAA治療、肝細胞がんのRFA/TACEの経験が豊富です。",
    status: "active",
    lastActiveAt: "2026-03-11",
    matchScore: 65,
    matchReasons: [
      "消化器病専門医の資格が合致",
    ],
    matchCautions: [
      "ESD経験なし（内視鏡が主力でない）",
      "開始が9月と遅い",
      "肝臓専門の志向が求人ニーズとずれる可能性",
    ],
  },
  {
    id: "d7",
    anonymousName: "Dr. G（匿名）",
    specialty: "整形外科",
    subSpecialty: "脊椎外科",
    qualifications: ["整形外科専門医", "脊椎脊髄外科専門医"],
    procedures: ["脊椎固定術", "椎弓切除術", "経皮的椎体形成術", "脊椎内視鏡手術"],
    yearsOfExperience: 14,
    currentAffiliation: "脊椎専門病院（部長）",
    academicBackground: "国立大学医学部卒",
    availableDays: ["月", "火", "水", "木", "金"],
    availableStartDate: "2026-10-01",
    preferredArea: "神奈川県・東京都",
    preferredWorkStyle: "脊椎手術の症例数を確保できる環境。",
    desiredSalary: "年収2,500万〜",
    selfPR: "脊椎手術2,000件以上。特にMIS（低侵襲脊椎手術）を得意としています。",
    status: "considering",
    lastActiveAt: "2026-03-08",
  },
];

export const positions: Position[] = [
  {
    id: "p1",
    clinicId: "c1",
    clinicName: "銀座三丁目消化器・内視鏡クリニック",
    clinicType: "有床診療所（19床）",
    area: "東京都中央区",
    title: "消化器内科医（常勤）",
    specialty: "消化器内科",
    requiredQualifications: ["内科専門医", "消化器病専門医"],
    preferredQualifications: ["内視鏡専門医", "消化器内視鏡学会技術認定医"],
    preferredProcedures: ["上部内視鏡", "下部内視鏡", "ESD"],
    employmentType: "常勤",
    workSchedule: "月〜金 9:00-18:00（水曜午後休）、当直なし、土日祝休み",
    salary: "年収1,750〜2,150万円",
    benefits: ["社会保険完備", "学会参加費補助（年50万円）", "住宅手当あり", "退職金制度あり", "引越し費用補助"],
    reason: "診療体制拡充のため増員。内視鏡検査件数増加に対応。",
    reasonDetail: "当院は内視鏡検査年間4,000件を超え、現在の医師3名体制では検査枠に余裕がありません。ESD施行医がもう1名加わることで、大学病院からの紹介患者も受け入れ可能になります。2026年度には内視鏡センター拡張工事も予定しており、将来的には内視鏡部門の副部長をお任せすることも想定しています。",
    urgency: "high",
    deadline: "2026-05-31",
    postedAt: "2026-03-01",
    status: "open",
    interestedCount: 3,
    viewCount: 47,
  },
  {
    id: "p2",
    clinicId: "c2",
    clinicName: "新横浜けいゆう整形外科病院",
    clinicType: "一般病院（99床）",
    area: "神奈川県横浜市",
    title: "整形外科医（常勤）",
    specialty: "整形外科",
    requiredQualifications: ["整形外科専門医"],
    preferredQualifications: ["スポーツ医", "リウマチ専門医"],
    preferredProcedures: ["人工関節置換術", "関節鏡手術"],
    employmentType: "常勤",
    workSchedule: "月〜金 8:30-17:30、当直：月2〜3回（当直明け半日休み）",
    salary: "年収1,800〜2,500万円",
    benefits: ["社会保険完備", "学会参加費補助", "当直手当別途", "駐車場無料", "職員寮あり"],
    reason: "定年退職に伴う後任募集。手術枠の維持が急務。",
    reasonDetail: "関節外科のベテラン医師が2026年6月末で定年退職予定です。現在週10枠の手術枠のうち4枠を担当しており、後任がいなければ手術枠を縮小せざるを得ません。特に人工関節と関節鏡の経験が豊富な方を求めています。着任後は副部長として、将来的には部長職もお任せする想定です。",
    urgency: "high",
    deadline: "2026-06-30",
    postedAt: "2026-02-15",
    status: "interviewing",
    interestedCount: 2,
    viewCount: 112,
  },
  {
    id: "p3",
    clinicId: "c3",
    clinicName: "北浜よつば総合病院",
    clinicType: "総合病院（320床）",
    area: "大阪府大阪市",
    title: "麻酔科医（常勤・非常勤）",
    specialty: "麻酔科",
    requiredQualifications: ["麻酔科専門医"],
    preferredQualifications: ["集中治療専門医", "心臓血管麻酔専門医"],
    preferredProcedures: ["全身麻酔", "硬膜外麻酔", "心臓麻酔"],
    employmentType: "常勤・非常勤",
    workSchedule: "常勤：月〜金 8:00-17:00（当直月4回）/ 非常勤：週1〜3日（9:00-18:00）",
    salary: "常勤：年収1,950〜2,400万円 / 非常勤：日給12万円",
    benefits: ["社会保険完備", "学会参加費補助", "当直手当5万円/回", "院内保育所", "永年勤続報奨"],
    reason: "手術件数増加に伴う麻酔科体制強化。",
    reasonDetail: "新たに心臓血管外科を開設し、年間手術件数が前年比30%増の見込みです。現在の麻酔科医4名では人員が不足しており、特に心臓麻酔の経験がある方を求めています。常勤・非常勤いずれも可能ですが、常勤の場合は麻酔科副部長としてのポジションを想定しています。",
    urgency: "medium",
    deadline: "2026-08-31",
    postedAt: "2026-01-20",
    status: "open",
    interestedCount: 1,
    viewCount: 28,
  },
  {
    id: "p4",
    clinicId: "c4",
    clinicName: "おおさき皮膚科クリニック",
    clinicType: "無床診療所",
    area: "東京都品川区",
    title: "皮膚科医（非常勤）",
    specialty: "皮膚科",
    requiredQualifications: ["皮膚科専門医"],
    preferredQualifications: ["レーザー専門医"],
    preferredProcedures: ["レーザー治療", "ケミカルピーリング", "ボトックス注射"],
    employmentType: "非常勤",
    workSchedule: "週2〜3日（火・木・土のいずれか）、9:30-18:30",
    salary: "日給9.5万〜（経験考慮）",
    benefits: ["交通費全額支給", "学会参加費補助", "施術研修制度", "社員割引"],
    reason: "週2日の外来枠を新設。美容皮膚科にも対応可能な方歓迎。",
    reasonDetail: "保険診療の皮膚科外来を拡充するため、新たに外来枠を設けます。一般皮膚科の外来に加えて、希望があれば美容施術（レーザー・注入治療）も担当いただけます。美容施術の売上に応じたインセンティブ制度もあります。",
    urgency: "low",
    deadline: "2026-06-30",
    postedAt: "2026-03-10",
    status: "open",
    interestedCount: 0,
    viewCount: 3,
  },
  {
    id: "p5",
    clinicId: "c5",
    clinicName: "まつだ内科・消化器クリニック",
    clinicType: "無床診療所",
    area: "千葉県千葉市",
    title: "消化器内科医（常勤・非常勤）",
    specialty: "消化器内科",
    requiredQualifications: ["内科専門医"],
    preferredQualifications: ["消化器病専門医", "内視鏡専門医"],
    preferredProcedures: ["上部内視鏡", "腹部エコー"],
    employmentType: "常勤・非常勤",
    workSchedule: "常勤：月〜土（半日x1） 9:00-18:00 / 非常勤：週1〜3日",
    salary: "常勤：年収1,450〜1,750万円 / 非常勤：日給8万〜",
    benefits: ["社会保険完備", "駐車場無料", "開業支援制度あり"],
    reason: "院長の診療負荷軽減と内視鏡検査の立ち上げ。",
    reasonDetail: "院長1名で運営してきましたが、患者数増加により内視鏡検査を導入したいと考えています。消化器専門医に加わっていただくことで、健診後の精密検査にも院内で対応可能になります。将来的な承継も視野に入れています。",
    urgency: "medium",
    postedAt: "2026-03-08",
    status: "open",
    interestedCount: 1,
    viewCount: 22,
  },
  {
    id: "p6",
    clinicId: "c6",
    clinicName: "湘南辻堂リハビリテーション病院",
    clinicType: "回復期リハ病院（120床）",
    area: "神奈川県藤沢市",
    title: "整形外科医（非常勤）",
    specialty: "整形外科",
    requiredQualifications: ["整形外科専門医"],
    preferredProcedures: ["骨折手術", "リハビリ処方"],
    employmentType: "非常勤",
    workSchedule: "週1〜2日（曜日応相談）、9:00-17:00",
    salary: "日給8万〜（経験考慮）",
    benefits: ["交通費全額支給", "駐車場無料"],
    reason: "回復期リハビリ病棟の整形外科サポート体制強化。",
    reasonDetail: "大腿骨骨折や脊椎圧迫骨折の術後患者が増加しており、整形外科専門医による回診・処方の充実を図りたいと考えています。手術はなく外来と回診が中心です。",
    urgency: "low",
    postedAt: "2026-03-12",
    status: "open",
    interestedCount: 0,
    viewCount: 8,
  },
];

export const pipelineCandidates: PipelineCandidate[] = [
  {
    id: "pc1",
    doctorId: "d1",
    doctorName: "Dr. A（匿名）",
    positionId: "p1",
    positionTitle: "消化器内科医（常勤）",
    clinicName: "銀座三丁目消化器・内視鏡クリニック",
    stage: "negotiation",
    updatedAt: "2026-03-13",
    createdAt: "2026-02-20",
    nextAction: "条件提示書を送付する",
    nextActionDeadline: "2026-03-17",
    qualificationVerified: true,
    notes: [
      "ESD実績が非常に高く、即戦力として期待できる",
      "6月入職希望のため、4月入職は難しい",
      "年収1,900万円+学会補助で合意の見込み",
    ],
    activityLog: [
      { date: "2026-02-20", action: "候補としてリストアップ", actor: "system", detail: "マッチングスコア95で自動抽出" },
      { date: "2026-02-22", action: "医師側に打診", actor: "admin", detail: "メッセージ送信" },
      { date: "2026-02-25", action: "関心表明を受領", actor: "doctor", detail: "「条件次第で前向きに検討」" },
      { date: "2026-03-01", action: "資格証明書を受領・確認完了", actor: "admin", detail: "内科・消化器病・内視鏡の3資格すべて確認" },
      { date: "2026-03-05", action: "院長との面談実施", actor: "clinic", detail: "オンライン面談60分。ESDの症例写真を共有。" },
      { date: "2026-03-08", action: "面談結果：双方好感触", actor: "admin", detail: "院長から「ぜひ来てほしい」とのコメント" },
      { date: "2026-03-10", action: "条件調整フェーズに移行", actor: "admin", detail: "給与・入職日・業務範囲を協議中" },
      { date: "2026-03-13", action: "給与条件で暫定合意", actor: "admin", detail: "年収1,900万円+学会補助50万円で暫定合意" },
    ],
  },
  {
    id: "pc2",
    doctorId: "d2",
    doctorName: "Dr. B（匿名）",
    positionId: "p2",
    positionTitle: "整形外科医（常勤）",
    clinicName: "新横浜けいゆう整形外科病院",
    stage: "interview",
    updatedAt: "2026-03-12",
    createdAt: "2026-02-28",
    nextAction: "面談日程を確定する（3/18候補）",
    nextActionDeadline: "2026-03-15",
    qualificationVerified: true,
    notes: [
      "関節鏡の症例数は十分",
      "常勤形態（水・金のみ可）をどう調整するか要検討",
      "副部長ポジションに関心あり",
    ],
    activityLog: [
      { date: "2026-02-28", action: "候補としてリストアップ", actor: "system", detail: "マッチングスコア82で自動抽出" },
      { date: "2026-03-02", action: "医師側に打診", actor: "admin" },
      { date: "2026-03-05", action: "関心表明を受領", actor: "doctor", detail: "「手術症例数によっては前向き」" },
      { date: "2026-03-08", action: "資格証明書を受領・確認完了", actor: "admin" },
      { date: "2026-03-12", action: "面談日程調整中", actor: "admin", detail: "3/18 14:00で先方に打診中" },
    ],
  },
  {
    id: "pc3",
    doctorId: "d3",
    doctorName: "Dr. C（匿名）",
    positionId: "p3",
    positionTitle: "麻酔科医（常勤・非常勤）",
    clinicName: "北浜よつば総合病院",
    stage: "interested",
    updatedAt: "2026-03-10",
    createdAt: "2026-03-06",
    nextAction: "医師の関心度を確認する",
    nextActionDeadline: "2026-03-16",
    qualificationVerified: false,
    notes: [
      "心臓麻酔の経験が豊富で、新設の心臓血管外科に最適",
      "ステータスが「検討中」のため慎重なアプローチが必要",
    ],
    activityLog: [
      { date: "2026-03-06", action: "候補としてリストアップ", actor: "system", detail: "マッチングスコア78で自動抽出" },
      { date: "2026-03-07", action: "医師側に打診", actor: "admin", detail: "心臓血管外科新設のビジョンを含めた案内を送付" },
      { date: "2026-03-10", action: "「興味はあるが現時点では確定できない」と返答", actor: "doctor" },
    ],
  },
  {
    id: "pc4",
    doctorId: "d5",
    doctorName: "Dr. E（匿名）",
    positionId: "p1",
    positionTitle: "消化器内科医（常勤）",
    clinicName: "銀座三丁目消化器・内視鏡クリニック",
    stage: "sourced",
    updatedAt: "2026-03-09",
    createdAt: "2026-03-09",
    nextAction: "候補者にポジションを打診する",
    nextActionDeadline: "2026-03-18",
    qualificationVerified: false,
    notes: [
      "若手だがESD習得意欲が高い",
      "Dr.Aが入職するならサブとしても検討可能",
    ],
    activityLog: [
      { date: "2026-03-09", action: "候補としてリストアップ", actor: "system", detail: "マッチングスコア70で自動抽出。ESD未経験だが育成枠として候補に" },
    ],
  },
  {
    id: "pc5",
    doctorId: "d4",
    doctorName: "Dr. D（匿名）",
    positionId: "p4",
    positionTitle: "皮膚科医（非常勤）",
    clinicName: "おおさき皮膚科クリニック",
    stage: "offer",
    updatedAt: "2026-03-14",
    createdAt: "2026-02-18",
    nextAction: "入職意思を最終確認する",
    nextActionDeadline: "2026-03-20",
    qualificationVerified: true,
    notes: [
      "保険+美容の両立志向が医院方針と完全一致",
      "日給9.5万円で合意済み",
      "4/15から勤務開始で調整中",
    ],
    activityLog: [
      { date: "2026-02-18", action: "候補としてリストアップ", actor: "system" },
      { date: "2026-02-20", action: "医師側に打診", actor: "admin" },
      { date: "2026-02-22", action: "関心表明を受領", actor: "doctor" },
      { date: "2026-02-25", action: "資格証明書を受領・確認完了", actor: "admin" },
      { date: "2026-03-01", action: "院長との面談実施（対面）", actor: "clinic", detail: "レーザー機器の実機を確認。院長との相性も良好。" },
      { date: "2026-03-05", action: "条件提示", actor: "clinic", detail: "日給9.5万円、火・木勤務、4/15開始" },
      { date: "2026-03-08", action: "条件を承諾", actor: "doctor" },
      { date: "2026-03-10", action: "オファーレター送付", actor: "admin" },
      { date: "2026-03-14", action: "入職意思の最終回答待ち", actor: "admin", detail: "回答期限3/20" },
    ],
  },
  {
    id: "pc6",
    doctorId: "d6",
    doctorName: "Dr. F（匿名）",
    positionId: "p5",
    positionTitle: "消化器内科医（常勤・非常勤）",
    clinicName: "まつだ内科・消化器クリニック",
    stage: "interview",
    updatedAt: "2026-03-13",
    createdAt: "2026-03-09",
    nextAction: "面談結果を双方に確認する",
    nextActionDeadline: "2026-03-17",
    qualificationVerified: true,
    notes: [
      "院長が承継も視野に入れており、長期的な関係構築に前向き",
    ],
    activityLog: [
      { date: "2026-03-09", action: "候補としてリストアップ", actor: "system" },
      { date: "2026-03-10", action: "関心表明を受領", actor: "doctor" },
      { date: "2026-03-11", action: "資格証明書を受領・確認完了", actor: "admin" },
      { date: "2026-03-13", action: "院長との面談実施（オンライン）", actor: "clinic", detail: "1時間。内視鏡導入計画について意見交換。" },
    ],
  },
  {
    id: "pc7",
    doctorId: "d5",
    doctorName: "Dr. E（匿名）",
    positionId: "p5",
    positionTitle: "消化器内科医（常勤・非常勤）",
    clinicName: "まつだ内科・消化器クリニック",
    stage: "interested",
    updatedAt: "2026-03-12",
    createdAt: "2026-03-10",
    nextAction: "資格証明書の提出を依頼する",
    nextActionDeadline: "2026-03-19",
    qualificationVerified: false,
    notes: [
      "千葉県希望でエリアが完全一致",
    ],
    activityLog: [
      { date: "2026-03-10", action: "候補としてリストアップ", actor: "system" },
      { date: "2026-03-11", action: "医師側に打診", actor: "admin" },
      { date: "2026-03-12", action: "関心表明を受領", actor: "doctor", detail: "「千葉で探していたので嬉しい」" },
    ],
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "match",
    title: "新しい推奨候補",
    body: "Dr. F（匿名）が消化器内科医（常勤・非常勤）に65%でマッチしました",
    timestamp: "2026-03-14 09:00",
    read: false,
  },
  {
    id: "n2",
    type: "interest",
    title: "関心表明を受領",
    body: "Dr. E（匿名）がまつだ内科・消化器クリニックの案件に関心を表明しました",
    timestamp: "2026-03-12 14:30",
    read: false,
  },
  {
    id: "n3",
    type: "interview",
    title: "面談完了",
    body: "Dr. F x まつだ内科・消化器クリニックの面談が完了しました。結果確認をお願いします。",
    timestamp: "2026-03-13 16:00",
    read: true,
  },
  {
    id: "n4",
    type: "system",
    title: "アクション期限",
    body: "Dr. B（匿名）の面談日程確定が期限（3/15）に迫っています",
    timestamp: "2026-03-14 08:00",
    read: false,
  },
  {
    id: "n5",
    type: "message",
    title: "医院からのメッセージ",
    body: "銀座三丁目消化器・内視鏡クリニック院長から条件提示書の修正依頼が届きました",
    timestamp: "2026-03-13 11:00",
    read: true,
  },
  {
    id: "n6",
    type: "match",
    title: "新規案件",
    body: "湘南辻堂リハビリテーション病院から新規案件「整形外科医（非常勤）」が掲載されました",
    timestamp: "2026-03-12 10:00",
    read: true,
  },
];

export const stageLabels: Record<PipelineCandidate["stage"], string> = {
  sourced: "候補選定",
  interested: "相互関心",
  interview: "面談",
  negotiation: "条件調整",
  offer: "オファー",
  placed: "決定",
  follow_up: "定着フォロー",
};
