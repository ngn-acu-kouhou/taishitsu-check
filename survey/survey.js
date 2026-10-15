/* =====================================================================
   鍼灸体験会アンケート（看護職向け・患者さんへの紹介につなげる設計）
   ---------------------------------------------------------------
   看護研究学会の企業出展ブースで、鍼灸を体験した看護職の方に答えてもらう。
   元にしたのは Google フォーム「体験会来場者アンケート」（2024年版）。
   ねらいは「患者さんに鍼灸をすすめてみよう」と思ってもらうこと。
     - 自分の体験 → 受け持ちの患者さんを思い浮かべる → 紹介のハードル
       → 何があれば紹介できるか、の順に考えてもらう
     - 送信後のページで、紹介に必要な情報（保険・同意書・安全性・紹介先）を
       そのまま持ち帰ってもらう
   設問は下の STEPS を編集するだけで増減できます（HTML は触らなくてOK）。
   col はスプレッドシートの列名です。省略すると id が列名になります。
   回答の送信先は CONFIG.endpoint（gas/Code.gs と README.md 参照）。
   ===================================================================== */

const CONFIG = {
  // 回答の送信先（Apps Script ウェブアプリ）
  // プロジェクト「看護研究学会 鍼灸体験会アンケート受け取り」／jc.kamijoe@gmail.com
  // 書き込み先：Drive「看護研究学会 企業出展鍼灸体験会」フォルダのスプレッドシート
  endpoint: 'https://script.google.com/macros/s/AKfycbxRjftfm_X1uSnvJh_lmhA_MBj6NeekrvKrd1ROjMlS2eAYnltDcJl6GRXCn_PpiK3o/exec',
  eventName: '看護研究学会 鍼灸体験会',
  selfCheckUrl: '../',
  medicalColumnUrl: '../columns/iryosha.html',
  partnerUrl: 'https://hari-hari.jimdofree.com/%E5%85%AC%E7%A4%BE-%E9%95%B7%E9%87%8E%E7%9C%8C%E7%9C%8B%E8%AD%B7%E5%8D%94%E4%BC%9A%E6%8F%90%E6%90%BA%E6%96%BD%E8%A1%93%E6%89%80/',
  queueKey: 'tc-survey-queue-nurse-v1',
};

/* ---- 啓蒙パート：患者さんの「こんな場面」 -------------------------
   category: 'insurance' … 医師の同意書があれば療養費（健康保険）の対象になる6疾患
             'common'    … 鍼灸院でよく相談される内容
             'life'      … 妊娠・治療中・高齢・スタッフ自身など           */
const QUIZ_ITEMS = [
  { id: 'q_yotsu',   label: '慢性の腰痛',                               category: 'insurance', tag: '腰痛症' },
  { id: 'q_50kata',  label: '五十肩',                                   category: 'insurance', tag: '五十肩' },
  { id: 'q_keiwan',  label: '首・肩・腕の痛みやしびれ',                 category: 'insurance', tag: '頸腕症候群' },
  { id: 'q_shinkei', label: '坐骨神経痛・肋間神経痛などの神経痛',       category: 'insurance', tag: '神経痛' },
  { id: 'q_rheuma',  label: '関節リウマチの痛み',                       category: 'insurance', tag: 'リウマチ' },
  { id: 'q_muchi',   label: 'むちうちの後遺症',                         category: 'insurance', tag: '頸椎捻挫後遺症' },
  { id: 'q_kata',    label: '肩こり・首こり',                           category: 'common' },
  { id: 'q_zutsu',   label: '頭痛',                                     category: 'common' },
  { id: 'q_hiza',    label: 'ひざの痛み',                               category: 'common' },
  { id: 'q_i',       label: '便秘・食欲不振などの胃腸の不調',           category: 'common' },
  { id: 'q_fumin',   label: '眠れない・気持ちが休まらない',             category: 'common' },
  { id: 'q_hie',     label: '冷え・むくみ（リンパ浮腫を除く）',         category: 'common' },
  { id: 'q_ninshin', label: '妊娠中のつわり・逆子',                     category: 'life' },
  { id: 'q_josei',   label: '月経のトラブル・更年期の不調',             category: 'life' },
  { id: 'q_cancer',  label: 'がん治療中・治療後のだるさやしびれ',       category: 'life' },
  { id: 'q_frail',   label: '高齢の方の痛み・フレイル予防',             category: 'life' },
  { id: 'q_shoni',   label: 'こどもの夜泣き・疳の虫（刺さない小児はり）', category: 'life' },
  { id: 'q_staff',   label: '夜勤明けや立ち仕事の疲れ（スタッフご自身）', category: 'life' },
];

const CATEGORY_INFO = {
  insurance: {
    title: '① 医師の同意書があれば、健康保険が使える6疾患',
    note: '神経痛・リウマチ・頸腕症候群・五十肩・腰痛症・頸椎捻挫後遺症は、医師の同意書があれば療養費として健康保険が使えます。慢性的な痛みが主な症状の場合が対象です。同意書の書式や手続きは、鍼灸院が案内します。',
  },
  common: {
    title: '② 鍼灸院で日常的に相談されている不調',
    note: '痛みやこりのほか、頭痛・胃腸・睡眠など、自律神経にかかわる不調の相談も多く受けています。',
  },
  life: {
    title: '③ 妊娠中・治療中・高齢の方、そしてスタッフご自身',
    note: '妊娠中や治療中の方には、主治医と相談のうえで施術内容を調整します。刺さない「小児はり」や、短時間で受けられる施術もあります。',
  },
};

/* ---- 設問 --------------------------------------------------------- */
const STEPS = [
  {
    id: 'intro',
    kind: 'intro',
    title: 'ご体験ありがとうございました',
    lead: '長野県針灸師会の鍼灸体験会にご参加いただき、ありがとうございます。<br />'
      + '今日の体験を、<strong>受け持ちの患者さんの顔</strong>を思い浮かべながら振り返っていただくアンケートです。'
      + 'いただいたご意見は、医療機関と鍼灸師の連携づくりに活かします。<br />'
      + 'お名前・連絡先はうかがいません。所要時間は約3分です。',
  },
  {
    id: 'you',
    title: 'あなたについて',
    questions: [
      {
        id: 'job', col: '職種', label: '職種', type: 'radio', required: true,
        options: ['看護師', '准看護師', '助産師', '保健師', '看護教員・研究者', '看護学生', 'その他の医療職', 'その他'],
      },
      {
        id: 'workplace', col: '勤務先', label: '主な勤務先', type: 'radio', required: true,
        options: ['病院（急性期）', '病院（回復期・慢性期・療養）', '診療所・クリニック', '訪問看護ステーション', '介護施設', '教育・研究機関', 'その他'],
      },
      {
        id: 'field', col: '担当領域', label: 'かかわることの多い領域（いくつでも）', type: 'checkbox', required: false,
        options: ['がん・緩和ケア', '整形外科・リハビリ', '産科・婦人科', '小児', '高齢者・認知症', '慢性疾患', '精神科', '在宅', 'その他'],
      },
    ],
  },
  {
    id: 'today',
    title: '今日の体験',
    // 体験前 → 体験の満足度 → 体験後の変化 の時系列
    questions: [
      {
        id: 'experience', col: '鍼の経験', label: '今日より前に、鍼を受けたことはありましたか', type: 'radio', required: true,
        options: ['今日が初めて', '以前に受けたことがある', 'わからない'],
      },
      {
        id: 'satisfaction', col: '満足度', label: '今日の体験の満足度', type: 'radio', required: true,
        // 「とても満足」を先頭に置き、押し間違いを防ぐ
        options: ['とても満足', '満足', 'ふつう', 'やや不満', '不満'],
      },
      {
        id: 'image_change', col: '印象の変化', label: '体験して、鍼灸への印象は変わりましたか', type: 'radio', required: true,
        options: ['よい方向に大きく変わった', '少しよくなった', 'もともとよい印象で変わらない', '変わらない', '悪くなった'],
      },
      {
        id: 'impressive', col: '印象に残ったこと', label: 'いちばん印象に残ったことは何ですか', type: 'textarea', required: false,
        placeholder: '例：思っていたより痛くなかった。終わったあと肩が軽くなった。',
      },
    ],
  },
  {
    id: 'quiz',
    kind: 'quiz',
    title: '患者さんの顔を思い浮かべて',
    lead: '受け持ちの患者さんやご家族、同僚の方を思い浮かべてください。<br />'
      + '次のうち、<strong>「この人なら鍼灸院に相談してみてもよさそう」</strong>と思う場面をすべて選んでください。'
      + '正解・不正解はありません。',
  },
  {
    id: 'refer',
    title: '患者さんにすすめることについて',
    questions: [
      {
        id: 'refer_intent', col: '紹介の意向', label: '患者さんに鍼灸をすすめてみたいと思いますか', type: 'radio', required: true,
        options: ['ぜひすすめたい', '条件が合えばすすめたい', 'まだわからない', 'すすめにくい'],
      },
      {
        id: 'refer_done', col: '紹介の経験', label: 'これまでに、患者さんに鍼灸をすすめたり、話題にしたりしたことはありますか', type: 'radio', required: true,
        options: ['すすめたことがある', '話題に出たことはある', 'ない'],
      },
      {
        id: 'barriers', col: '紹介のハードル', label: 'すすめるときに、ハードルになりそうなこと（いくつでも）', type: 'checkbox', required: true,
        options: [
          'どんな症状に対応できるか、よくわからない',
          '効果の根拠（エビデンス）を説明しにくい',
          '安全性・衛生面・副作用が気になる',
          '保険の使い方や同意書の手続きがわかりにくい',
          'どこの鍼灸院を紹介すればよいかわからない',
          '医師の理解・同意が得にくい',
          '費用の負担が気になる',
          '患者さん・ご家族の抵抗感',
          '職場のルール上、すすめにくい',
          '特にない',
        ],
      },
      {
        id: 'needed_info', col: 'あれば説明しやすいもの', label: '何があれば、患者さんに説明しやすくなりますか（いくつでも）', type: 'checkbox', required: true,
        options: [
          '症状別の適応がひと目でわかる早見表',
          '保険（療養費）と医師の同意書の流れをまとめた資料',
          '患者さんにそのまま渡せるリーフレット',
          '地域ごとの紹介先（施術所）の一覧',
          '研究・エビデンスの要約',
          '安全管理（使い捨て鍼・衛生管理）の説明資料',
          '料金の目安',
          '実際の紹介事例・症例報告',
          '鍼灸師に気軽に相談できる窓口',
        ],
      },
      {
        id: 'needed_info_other', col: 'あれば説明しやすいもの（自由記述）', label: 'ほかに「これがあれば紹介しやすい」と思うものがあれば、お書きください', type: 'textarea', required: false,
        note: 'ここがいちばんうかがいたいところです。ひとことでも大歓迎です。',
        placeholder: '例：抗凝固薬を飲んでいる患者さんでも受けられるか知りたい。',
      },
    ],
  },
  {
    id: 'next',
    title: 'これからについて',
    questions: [
      {
        id: 'self_try', col: '自分で受けたいか', label: 'ご自身でも、鍼灸を受けてみたいと思いますか', type: 'radio', required: true,
        options: ['ぜひ受けたい', '不調が出たときに考えたい', 'わからない', '受けたいとは思わない'],
      },
      {
        id: 'partner_known', col: '提携施術所の認知', label: '長野県看護協会の会員は、提携施術所で初回施術料の割引などが受けられることをご存じでしたか', type: 'radio', required: true,
        options: ['知っていて、利用したことがある', '知っていたが利用したことはない', '知らなかった', '看護協会の会員ではない'],
      },
      {
        id: 'collab', col: '連携に必要な取り組み', label: '医療機関と鍼灸師の連携を進めるには、どんな取り組みがあるとよいですか（いくつでも）', type: 'checkbox', required: false,
        options: [
          '院内・地域での勉強会や研修',
          '病棟や外来への資料の配布',
          '紹介状・情報提供書の共通書式',
          '鍼灸師と看護職の情報交換会',
          '共同での研究・症例報告',
          '今回のような体験会の継続',
        ],
      },
      {
        id: 'comment', col: 'ご感想・ご要望', label: 'ご感想・ご要望があればお書きください', type: 'textarea', required: false,
        placeholder: '例：病棟のスタッフにも体験してもらいたい。',
      },
    ],
  },
];

/* ---- ここから下は基本的に編集不要 --------------------------------- */

const answers = {};
const quizSelection = new Set();
let stepIndex = 0;
const visibleSteps = STEPS.slice();

const form = document.getElementById('survey-form');
const stepsRoot = document.getElementById('steps');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const validation = document.getElementById('validation-message');
const doneRoot = document.getElementById('done');
const progressWrap = document.querySelector('.progress');
const progressFill = document.getElementById('progress-fill');
const progressNow = document.getElementById('progress-now');
const progressTotal = document.getElementById('progress-total');
const privacyNote = document.getElementById('privacy-note');

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function buildQuestion(question) {
  const block = el('div', 'question');
  block.dataset.questionId = question.id;
  block.appendChild(el('h3', 'question-label', question.label + (question.required ? ' <span class="req">必須</span>' : '')));
  if (question.note) block.appendChild(el('p', 'question-note', question.note));

  if (question.type === 'textarea') {
    const area = el('textarea', 'free-text');
    area.rows = 4;
    area.placeholder = question.placeholder || '';
    area.addEventListener('input', () => { answers[question.id] = area.value.trim(); });
    block.appendChild(area);
    return block;
  }

  const list = el('div', 'option-list' + (question.type === 'checkbox' ? ' is-multi' : ''));
  question.options.forEach((option, i) => {
    const id = question.id + '-' + i;
    const label = el('label', 'option');
    label.setAttribute('for', id);
    const input = document.createElement('input');
    input.type = question.type;
    input.name = question.id;
    input.id = id;
    input.value = option;
    input.addEventListener('change', () => {
      if (question.type === 'radio') {
        answers[question.id] = option;
      } else {
        answers[question.id] = Array.from(list.querySelectorAll('input:checked')).map((n) => n.value);
      }
      clearValidation();
    });
    label.appendChild(input);
    label.appendChild(el('span', 'option-text', option));
    list.appendChild(label);
  });
  block.appendChild(list);
  return block;
}

function buildQuiz() {
  const wrap = el('div', 'quiz');
  const grid = el('div', 'chip-grid');
  QUIZ_ITEMS.forEach((item) => {
    const label = el('label', 'chip');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = item.id;
    input.addEventListener('change', () => {
      if (input.checked) quizSelection.add(item.id);
      else quizSelection.delete(item.id);
      clearValidation();
    });
    label.appendChild(input);
    label.appendChild(el('span', 'chip-text', item.label));
    grid.appendChild(label);
  });
  wrap.appendChild(grid);
  wrap.appendChild(el('p', 'quiz-help', '思い当たらないものは選ばずに進んで大丈夫です。'));
  return wrap;
}

/* 送信後の「持ち帰りページ」に置く導線。
   紹介先 → 医療者向けの読みもの → 患者さんとも使えるチェック、の順。 */
function buildNextSteps() {
  const wrap = el('section', 'next-steps');
  wrap.appendChild(el('p', 'eyebrow', 'TAKE HOME'));
  wrap.appendChild(el('h3', null, '患者さんにすすめるときに'));
  wrap.appendChild(el('p', 'next-lead',
    'スマホでそのまま開けます。病棟や外来で思い出したときのために、このページをブックマークしておくのもおすすめです。'));

  const items = [
    {
      kind: 'roster',
      eyebrow: '長野県看護協会提携施術所',
      title: '紹介先をさがす',
      body: '長野県内の提携施術所を、地区ごとに住所と電話番号つきで一覧にしています。看護協会の会員の方は、予約の際に会員であることを伝えて会員証を提示すると、初回施術料の割引などが受けられます。まずはご自身で受けてみるのもおすすめです。',
      label: '提携施術所の一覧を見る',
      href: CONFIG.partnerUrl,
      external: true,
    },
    {
      kind: 'column',
      eyebrow: 'FOR MEDICAL STAFF',
      title: '医療者のための東洋医学ことば案内',
      body: '「気・血・津液」など、鍼灸師が使うことばを医療のことばに置きかえて整理した早見表です。鍼灸師との情報交換や、患者さんへの説明に。',
      label: 'コラムを読む',
      href: CONFIG.medicalColumnUrl,
      external: false,
    },
    {
      kind: 'check',
      eyebrow: 'SELF CHECK',
      title: '体質チェック',
      body: '当てはまる項目を選ぶだけで、いまの体調を東洋医学の見方から整理します。ご自身の振り返りにも、患者さんとの会話のきっかけにも使えます。',
      label: 'チェックしてみる',
      href: CONFIG.selfCheckUrl,
      external: false,
    },
  ];

  items.forEach((item) => {
    const card = el('a', 'next-card next-' + item.kind);
    card.href = item.href;
    if (item.external) {
      card.target = '_blank';
      card.rel = 'noreferrer';
    }
    card.appendChild(el('p', 'next-eyebrow', item.eyebrow));
    card.appendChild(el('h4', null, item.title));
    card.appendChild(el('p', 'next-body', item.body));
    card.appendChild(el('span', 'next-cta', item.label));
    wrap.appendChild(card);
  });
  return wrap;
}

function buildTakeaway() {
  const wrap = el('section', 'takeaway');
  wrap.appendChild(el('p', 'eyebrow', 'ABOUT ACUPUNCTURE'));
  wrap.appendChild(el('h3', null, '鍼灸院に相談できること'));
  wrap.appendChild(el('p', 'takeaway-lead',
    '先ほど思い浮かべていただいた場面を、あらためて整理しました。いずれも、鍼灸院で日常的に相談されている内容です。'));

  ['insurance', 'common', 'life'].forEach((category) => {
    const info = CATEGORY_INFO[category];
    const card = el('div', 'reveal-card cat-' + category);
    card.appendChild(el('h4', null, info.title));
    const ul = el('ul', 'reveal-list');
    QUIZ_ITEMS.filter((item) => item.category === category).forEach((item) => {
      const li = el('li');
      li.innerHTML = '<span class="item">' + item.label + '</span>' +
        (item.tag && item.tag !== item.label ? '<span class="tag">療養費の傷病名：' + item.tag + '</span>' : '');
      ul.appendChild(li);
    });
    card.appendChild(ul);
    card.appendChild(el('p', 'reveal-note', info.note));
    wrap.appendChild(card);
  });

  wrap.appendChild(el('p', 'reveal-caution',
    '※「鍼灸院で相談できる」という意味です。効果の現れ方には個人差があり、すべての方に有効と保証するものではありません。' +
    '強い痛みや急な症状、原因のはっきりしない症状は、まず医療機関での診察を優先してください。'));
  return wrap;
}

function buildStep(step, index) {
  const section = el('section', 'step');
  section.dataset.stepId = step.id;
  section.hidden = true;
  section.appendChild(el('p', 'eyebrow', 'STEP ' + (index + 1)));
  section.appendChild(el('h2', null, step.title));
  // lead には箇条書きが入ることがあるので p ではなく div
  if (step.lead) section.appendChild(el('div', 'step-lead', step.lead));

  if (step.kind === 'quiz') {
    section.appendChild(buildQuiz());
  } else if (step.questions) {
    step.questions.forEach((q) => section.appendChild(buildQuestion(q)));
  }
  return section;
}

function applyConditionalQuestions(step, section) {
  if (!step.questions) return;
  step.questions.forEach((q) => {
    if (!q.showIf) return;
    const block = section.querySelector('[data-question-id="' + q.id + '"]');
    if (!block) return;
    const show = q.showIf(answers);
    block.hidden = !show;
    if (!show) delete answers[q.id];
  });
}

function missingQuestions(step, section) {
  if (!step.questions) return [];
  return step.questions.filter((q) => {
    if (!q.required) return false;
    const block = section.querySelector('[data-question-id="' + q.id + '"]');
    if (block && block.hidden) return false;
    const value = answers[q.id];
    return value == null || value === '' || (Array.isArray(value) && value.length === 0);
  });
}

function clearValidation() {
  validation.hidden = true;
  validation.textContent = '';
}

function showValidation(message) {
  validation.textContent = message;
  validation.hidden = false;
}

function currentSection() {
  return stepsRoot.children[stepIndex];
}

function showStep(index) {
  stepIndex = index;
  Array.from(stepsRoot.children).forEach((node, i) => { node.hidden = i !== index; });
  const step = visibleSteps[index];
  const section = currentSection();
  applyConditionalQuestions(step, section);

  prevButton.hidden = index === 0;
  nextButton.textContent = index === 0 ? 'はじめる'
    : index === visibleSteps.length - 1 ? '回答を送信する'
    : 'つぎへ';

  progressNow.textContent = String(index + 1);
  progressTotal.textContent = String(visibleSteps.length);
  progressFill.style.width = ((index + 1) / visibleSteps.length * 100) + '%';
  clearValidation();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* スプレッドシートの列名は日本語にする（集計する人が読みやすいように） */
function collectPayload() {
  const picked = QUIZ_ITEMS.filter((item) => quizSelection.has(item.id));
  const payload = {
    '送信日時': new Date().toISOString(),
    'イベント': CONFIG.eventName,
  };
  STEPS.forEach((step) => {
    if (step.kind === 'quiz') {
      // 「5 / 18」のような文字列は日付と誤認されるので、数だけを送る
      payload['相談できそうな場面（選んだ数）'] = picked.length;
      payload['相談できそうな場面'] = picked.map((item) => item.label).join(' / ');
      return;
    }
    (step.questions || []).forEach((q) => {
      const value = answers[q.id];
      payload[q.col || q.id] = Array.isArray(value) ? value.join(' / ') : (value == null ? '' : value);
    });
  });
  return payload;
}

function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.queueKey) || '[]');
  } catch (e) {
    return [];
  }
}

function writeQueue(queue) {
  try {
    localStorage.setItem(CONFIG.queueKey, JSON.stringify(queue));
  } catch (e) {
    /* 保存できなくても回答は続行できる */
  }
}

function send(payload) {
  if (!CONFIG.endpoint) return Promise.resolve(false);
  return fetch(CONFIG.endpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  }).then(() => true).catch(() => false);
}

function flushQueue() {
  if (!CONFIG.endpoint) return;
  const queue = readQueue();
  if (queue.length === 0) return;
  const rest = [];
  queue.reduce(
    (chain, item) => chain.then(() => send(item)).then((ok) => { if (!ok) rest.push(item); }),
    Promise.resolve()
  ).then(() => writeQueue(rest));
}

function submit() {
  const payload = collectPayload();
  nextButton.disabled = true;
  nextButton.textContent = '送信中…';
  send(payload).then((ok) => {
    if (!ok && CONFIG.endpoint) {
      const queue = readQueue();
      queue.push(payload);
      writeQueue(queue);
    }
    showDone(ok);
  });
}

function showDone(sent) {
  form.hidden = true;
  if (progressWrap) progressWrap.hidden = true;
  privacyNote.hidden = true;
  doneRoot.hidden = false;
  doneRoot.innerHTML = '';
  doneRoot.appendChild(el('p', 'eyebrow', 'THANK YOU'));
  doneRoot.appendChild(el('h2', null, 'ご協力ありがとうございました'));
  doneRoot.appendChild(el('p', 'result-summary',
    (sent || !CONFIG.endpoint)
      ? 'いただいたご意見は、医療機関と鍼灸師の連携づくりに活かします。<br />患者さんに鍼灸をすすめるときに役立つ情報を、下にまとめました。'
      : '電波の状況で送信できなかったため、この端末に一時保存しました。電波のよい場所でこのページをもう一度開くと自動で送信されます。<br />患者さんに鍼灸をすすめるときに役立つ情報を、下にまとめました。'));

  doneRoot.appendChild(buildNextSteps());

  // 紹介するときに押さえておきたい3点
  const cards = el('div', 'result-cards');
  const points = [
    {
      title: '保険を使うなら、医師の同意書を',
      body: '神経痛・リウマチ・頸腕症候群・五十肩・腰痛症・頸椎捻挫後遺症の6つは、医師の同意書があれば健康保険（療養費）で鍼灸を受けられます。同意書の書式や手続きは鍼灸院が案内しますので、「保険が使えるか聞いてみてください」と伝えるだけで大丈夫です。',
    },
    {
      title: '使い捨ての鍼と、国家資格の施術者',
      body: '鍼は滅菌済みの使い捨てで、使い回しはしません。はり師・きゅう師はいずれも国家資格です。今日感じていただいたとおり、多くの場合、強い痛みはありません。',
    },
    {
      title: '予約のときに伝えてほしいこと',
      body: '治療中の病気と治療の内容・時期、服用中の薬（抗凝固薬など）、ペースメーカーなどの植込み機器、リンパ浮腫やポートの有無を伝えてもらえると、鍼灸師が施術内容を安全に調整できます。体調によっては、鍼を使わない方法を選ぶこともできます。',
    },
  ];
  points.forEach((item) => {
    const card = el('div', 'result-card');
    card.appendChild(el('h3', null, item.title));
    card.appendChild(el('p', null, item.body));
    cards.appendChild(card);
  });
  doneRoot.appendChild(cards);

  doneRoot.appendChild(buildTakeaway());

  const extra = el('aside', 'intro');
  extra.innerHTML = 'このページは、あとからでもご覧いただけます。会場の QR コードからも、同じページが開きます。本日はご体験いただき、ありがとうございました。';
  doneRoot.appendChild(extra);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleNext() {
  const step = visibleSteps[stepIndex];
  const section = currentSection();

  // 場面の選択は無回答でも進めるが、一度だけ確認する
  if (step.kind === 'quiz' && quizSelection.size === 0 && !section.dataset.confirmed) {
    section.dataset.confirmed = '1';
    showValidation('ひとつも選ばずに進みますか？ もう一度ボタンを押すと進みます。');
    return;
  }

  const missing = missingQuestions(step, section);
  if (missing.length > 0) {
    showValidation('「' + missing[0].label + '」にお答えください。');
    const block = section.querySelector('[data-question-id="' + missing[0].id + '"]');
    if (block) block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (stepIndex === visibleSteps.length - 1) {
    submit();
    return;
  }
  showStep(stepIndex + 1);
}

function init() {
  visibleSteps.forEach((step, i) => stepsRoot.appendChild(buildStep(step, i)));
  nextButton.addEventListener('click', handleNext);
  prevButton.addEventListener('click', () => { if (stepIndex > 0) showStep(stepIndex - 1); });
  form.addEventListener('submit', (e) => { e.preventDefault(); handleNext(); });
  showStep(0);
  flushQueue();
}

init();
