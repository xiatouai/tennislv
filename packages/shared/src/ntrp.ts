export interface NtrpCharacteristic {
  overall: string;
  groundstroke: string;
  serve: string;
  net: string;
  footwork: string;
  tactics: string;
  match: string;
}

export interface NtrpLevel {
  level: string;
  label: string;
  shortDescription: string;
  characteristics: NtrpCharacteristic;
  suitableMatchRange: string;
  nextGoal: string;
}

export const NTRP_LEVELS: NtrpLevel[] = [
  {
    level: '1.0',
    label: '初学者',
    shortDescription: '刚开始接触网球，正在学习规则、握拍和基本挥拍。',
    characteristics: {
      overall: '几乎没有打过网球，刚开始学习规则、握拍和基本挥拍。',
      groundstroke: '不熟悉击球点和基本挥拍动作，难以连续把球打过网。',
      serve: '无法稳定完成连续发球动作。',
      footwork: '站位不确定，常站在底线中间，不知道如何移动到合适击球位置。',
      net: '基本没有网前截击能力。',
      tactics: '尚未形成比赛意识。',
      match: '尚不能进行有效对打。',
    },
    suitableMatchRange: '1.0-1.5',
    nextGoal: '学习基本握拍、正反手挥拍、发球动作和简单规则。',
  },
  {
    level: '1.5',
    label: '新手',
    shortDescription: '有过几次练习，能偶尔把球打过网，但稳定性较差。',
    characteristics: {
      overall: '有过几次练习，对规则和基本动作有初步概念。',
      groundstroke: '能偶尔把球打过网，但方向、高度和落点控制较弱。',
      serve: '偶尔能发进，但动作和抛球不稳定。',
      footwork: '经常站位过近或过远，击球点模糊。',
      net: '很少上网，截击动作不稳定。',
      tactics: '主要目标是把球打过网。',
      match: '能进行简短对打，但缺乏稳定性。',
    },
    suitableMatchRange: '1.0-2.0',
    nextGoal: '提高把球打过网的稳定性，建立基本击球点和站位意识。',
  },
  {
    level: '2.0',
    label: '初级',
    shortDescription: '能进行基本对打，但控制节奏、击球选择和比赛稳定性仍需提高。',
    characteristics: {
      overall: '能进行基本对打，对站位和击球有初步概念。',
      groundstroke: '正反手能控制回球方向到一定程度，但速度慢、落点不稳定。',
      serve: '能以下手或慢速上手方式发进。',
      net: '能接近球网尝试截击，但掌控感较弱。',
      tactics: '开始理解击球深度、边线和对角线。',
      footwork: '移动和恢复还不够有效，击球点经常不舒服。',
      match: '在控制节奏和击球选择上仍需要指导。',
    },
    suitableMatchRange: '1.5-2.5',
    nextGoal: '提高正反手连续性、发球进区率和基本站位意识。',
  },
  {
    level: '2.5',
    label: '入门提高',
    shortDescription: '能维持短回合，开始控制方向并理解基本比赛节奏。',
    characteristics: {
      overall: '已能稳定进行轻度底线来回，开始理解比赛节奏。',
      groundstroke: '能有节奏地打几拍，开始尝试上旋和方向控制。',
      serve: '能较稳定地发球入界，但力量和变化不足。',
      net: '能接球和简单截击，但方向控制困难。',
      tactics: '能理解基本站位与单双打配合。',
      footwork: '能判断来球大致方向，但移动到位和击球后恢复仍不稳定。',
      match: '能打短局或低强度比赛，但节奏和稳定性不足。',
    },
    suitableMatchRange: '2.0-3.0',
    nextGoal: '提高底线连续性、发球稳定性和移动恢复能力。',
  },
  {
    level: '3.0',
    label: '中级',
    shortDescription: '能稳定进行底线回合，具备基本发球和比赛能力，但深度、落点和变化仍不够稳定。',
    characteristics: {
      overall: '已能稳定进行底线来回，具备基本比赛能力。',
      groundstroke: '能打出中速球，有方向和深度概念，但精度仍不足。',
      serve: '上手发球较稳定，开始尝试加速或变化。',
      net: '能做出正确截击动作，但在较快来球下不稳定。',
      tactics: '开始理解攻防转换，但执行欠稳定。',
      footwork: '能完成基本移动，但面对超出舒适击球区的球容易失误。',
      match: '能参与友谊赛或低级别比赛，主要问题是非受迫性失误和稳定性。',
    },
    suitableMatchRange: '2.5-3.5',
    nextGoal: '提高方向控制、发球稳定性、网前处理和减少非受迫性失误。',
  },
  {
    level: '3.5',
    label: '中上级',
    shortDescription: '击球已有稳定性和方向控制，开始使用战术，但深度、变化和网前能力仍有限。',
    characteristics: {
      overall: '技术基本成熟，能执行多种击球，具备较强业余比赛能力。',
      groundstroke: '能主动控制方向、深度、旋转，击球稳定性明显提升。',
      serve: '第一发有速度，第二发能稳定入界。',
      net: '能借机会上网得分，但面对高质量来球仍有失误。',
      tactics: '开始使用战术，例如对角、直线、放小球和攻防转换。',
      footwork: '移动和恢复较流畅，有分腿垫步意识。',
      match: '能持续保持回合，具备一定对抗力，但变化和稳定性仍有限。',
    },
    suitableMatchRange: '3.0-4.0',
    nextGoal: '提高击球深度、战术执行、二发质量和网前终结能力。',
  },
  {
    level: '4.0',
    label: '进阶',
    shortDescription: '击球稳定且有战术意识，能主动控制比赛节奏，具备俱乐部比赛竞争力。',
    characteristics: {
      overall: '能稳定且有计划地打出战术型网球。',
      groundstroke: '正反手都能控制节奏、深度、旋转和落点。',
      serve: '第一发具备攻击性，第二发有上旋或切削。',
      net: '反应快，能应对多数网前球，并能主动上网终结分数。',
      tactics: '能根据对手弱点调整策略。',
      footwork: '移动效率较高，攻防转换较快。',
      match: '已能参加俱乐部比赛或市级业余赛，并具备竞争力。',
    },
    suitableMatchRange: '3.5-4.5',
    nextGoal: '提高发球攻击性、接发质量、战术变化和关键分稳定性。',
  },
  {
    level: '4.5',
    label: '高级',
    shortDescription: '技术全面，速度、旋转、深度和战术能力较强，能在业余比赛中形成压制力。',
    characteristics: {
      overall: '技术全面，体能较好，战术成熟。',
      groundstroke: '击球速度快，深度稳定，失误少，能主动制造压力。',
      serve: '第一发有力且变化丰富，第二发有旋转和稳定性。',
      net: '截击稳定且有攻击性，能通过发球上网或接发上网制造优势。',
      tactics: '具备成熟战术思维，能判断对手弱点并持续施压。',
      footwork: '场地覆盖能力强，能在防守中反击。',
      match: '在俱乐部或地区业余比赛中具备竞争力。',
    },
    suitableMatchRange: '4.0-5.0',
    nextGoal: '提高高压下稳定性、比赛策略变化和关键分处理。',
  },
  {
    level: '5.0',
    label: '专家',
    shortDescription: '接近高水平业余或大学校队水平，能用稳定武器组织比赛并赢下高质量对抗。',
    characteristics: {
      overall: '技术、体能和心理成熟，能稳定执行高强度比赛。',
      groundstroke: '具备职业水准倾向的速度、精确度和变化能力。',
      serve: '发球多变、有攻击性，能控制落点和旋转。',
      net: '截击和上网稳定且具威胁，可快速结束回合。',
      tactics: '能读懂对手节奏并快速调整策略。',
      footwork: '移动质量高，能覆盖大范围场地。',
      match: '能在高水平业余赛事中获胜。',
    },
    suitableMatchRange: '4.5-5.5',
    nextGoal: '提升对抗强度、稳定武器和比赛抗压能力。',
  },
  {
    level: '5.5',
    label: '准职业',
    shortDescription: '具备准职业水准，训练强度高，能在职业预选或高水平赛事中竞争。',
    characteristics: {
      overall: '几乎达到职业水准，训练强度高。',
      groundstroke: '技术动作成熟，击球点精准，质量稳定。',
      serve: '发球具备战术性和主导得分能力。',
      net: '网前处理稳定且具有进攻性。',
      tactics: '能全面执行复杂比赛策略。',
      footwork: '移动、爆发和恢复能力接近职业要求。',
      match: '可参加职业预选赛或高水平公开赛。',
    },
    suitableMatchRange: '5.0-6.0',
    nextGoal: '提升职业赛事对抗能力和连续比赛稳定性。',
  },
  {
    level: '6.0',
    label: '职业初级',
    shortDescription: '拥有职业选手经验，通常以高强度训练和比赛为主。',
    characteristics: {
      overall: '拥有职业选手经验。',
      groundstroke: '具备职业级击球质量。',
      serve: '发球可作为主要武器。',
      net: '网前处理成熟。',
      tactics: '能在职业级比赛中执行战术。',
      footwork: '移动和体能达到职业要求。',
      match: '曾在职业巡回赛或高水平职业赛事中参赛。',
    },
    suitableMatchRange: '5.5-6.5',
    nextGoal: '提升职业积分、排名和巡回赛稳定表现。',
  },
  {
    level: '6.5',
    label: '职业中级',
    shortDescription: '拥有职业积分或排名，常年征战职业巡回赛并有稳定成绩。',
    characteristics: {
      overall: '拥有职业积分或排名。',
      groundstroke: '技术、节奏和心理达到职业级别。',
      serve: '发球与接发球具备高水平竞争力。',
      net: '网前选择和执行能力成熟。',
      tactics: '能针对不同对手制定并执行战术。',
      footwork: '具备高强度职业比赛移动能力。',
      match: '常年参加职业巡回赛并有稳定成绩。',
    },
    suitableMatchRange: '6.0-7.0',
    nextGoal: '提升职业巡回赛排名和高等级赛事胜率。',
  },
  {
    level: '7.0',
    label: '顶级职业',
    shortDescription: '世界级职业选手，能参加 ATP/WTA 巡回赛并具备世界排名竞争力。',
    characteristics: {
      overall: '顶尖职业选手。',
      groundstroke: '技术全面，速度、旋转、落点和变化均为世界级。',
      serve: '发球与接发球均具备世界级竞争力。',
      net: '网前技术、反应和选择极强。',
      tactics: '战术灵活，心理极强。',
      footwork: '移动、体能和恢复能力达到世界级。',
      match: '参加 ATP/WTA 巡回赛，具备世界排名竞争力。',
    },
    suitableMatchRange: '6.5-7.0',
    nextGoal: '维持世界级竞技水平。',
  },
];

export function getNtrpLevel(level: string): NtrpLevel | undefined {
  return NTRP_LEVELS.find(l => l.level === level);
}
