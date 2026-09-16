/* =====================================================================
   体験会アンケート（啓蒙型）
   ---------------------------------------------------------------
   設問は下の STEPS を編集するだけで増減できます（HTML は触らなくてOK）。
   回答の送信先は CONFIG.endpoint に Google Apps Script の
   ウェブアプリ URL を貼ってください（gas/Code.gs と README.md 参照）。
   ===================================================================== */

const CONFIG = {
  // 回答の送信先（Apps Script ウェブアプリ）
  // プロジェクト「鍼灸体験会アンケート受け取り」／中信鍼灸師会 t.shinnkyuu@gmail.com
  // 書き込み先スプレッドシート：鍼灸体験会アンケート回答
  endpoint: 'https://script.google.com/macros/s/AKfycbxR5gpK71tgR5hM9-HKd1XznIhZPuMGbFy2Gc3RnLFfqDS-oPLega9w05DZs3imB9yF/exec',
  eventName: '鍼灸体験会',
  selfCheckUrl: '../',
  societyUrl: 'https://hari-hari.jimdofree.com/%E6%89%80%E5%B1%9E%E6%B2%BB%E7%99%82%E9%99%A2/%E4%B8%AD%E4%BF%A1/',
  queueKey: 'tc-survey-queue-v1',
};

/* ---- 啓蒙パート：鍼灸で相談できることの一覧 ----------------------
   category: 'insurance' … 医師の同意書があれば健康保険の対象になりうる6疾患
             'common'    … 鍼灸院でよく相談される内容
             'life'      … 女性・こども・シニア・スポーツなど            */
const QUIZ_ITEMS = [
  { id: 'q_kata',    label: '肩こり・首こり',                       category: 'common' },
  { id: 'q_yotsu',   label: '腰痛',                                 category: 'insurance', tag: '腰痛症' },
  { id: 'q_50kata',  label: '五十肩',                               category: 'insurance', tag: '五十肩' },
  { id: 'q_muchi',   label: 'むちうちの後遺症',                     category: 'insurance', tag: '頸椎捻挫後遺症' },
  { id: 'q_keiwan',  label: '首・肩・腕のしびれ',                   category: 'insurance', tag: '頸腕症候群' },
  { id: 'q_shinkei', label: '坐骨神経痛などの神経痛',               category: 'insurance', tag: '神経痛' },
  { id: 'q_rheuma',  label: '関節リウマチ',                         category: 'insurance', tag: 'リウマチ' },
  { id: 'q_zutsu',   label: '頭痛・片頭痛',                         category: 'common' },
  { id: 'q_hiza',    label: 'ひざの痛み',                           category: 'common' },
  { id: 'q_me',      label: '眼精疲労',                             category: 'common' },
  { id: 'q_i',       label: '胃腸の不調・食欲不振',                 category: 'common' },
  { id: 'q_hie',     label: '冷え・むくみ',                         category: 'common' },
  { id: 'q_fumin',   label: '寝つきの悪さ・自律神経の乱れ',         category: 'common' },
  { id: 'q_josei',   label: '月経のトラブル・更年期の不調',         category: 'life' },
  { id: 'q_ninshin', label: 'つわり・逆子',                         category: 'life' },
  { id: 'q_shoni',   label: 'こどもの夜泣き・疳の虫',               category: 'life' },
  { id: 'q_sports',  label: 'スポーツ後のケア・コンディショニング', category: 'life' },
  { id: 'q_frail',   label: '介護予防・フレイル対策',               category: 'life' },
];

const CATEGORY_INFO = {
  insurance: {
    title: '① 健康保険が使えることもある6つの症状',
    note: '医師の同意書があれば、健康保険を使って鍼灸を受けられます。慢性的で、医療機関の治療では十分な効果が出ていない場合が対象です。同意書のもらい方は鍼灸院が案内します。',
  },
  common: {
    title: '② 鍼灸院でよく相談される不調',
    note: 'こりや痛みだけでなく、頭痛・胃腸・睡眠・自律神経にかかわる不調も、日常的に相談されています。',
  },
  life: {
    title: '③ 女性・こども・シニア・スポーツの場面でも',
    note: '妊娠中のつわりや逆子、こどもの夜泣き（刺さない「小児はり」）、介護予防やスポーツ後のケアにも使われています。',
  },
};

/* ---- 設問 --------------------------------------------------------- */
const STEPS = [
  {
    id: 'intro',
    kind: 'intro',
    title: 'ご体験ありがとうございました',
    lead: 'いただいたご意見は、今後の体験会をよりよくするための参考にさせていただきます。<br />お名前・連絡先はうかがいません。所要時間は約3分です。',
  },
  {
    id: 'you',
    title: 'あなたについて',
    questions: [
      {
        id: 'age', label: 'ご年代', type: 'radio', required: true,
        options: ['10代・20代', '30代', '40代', '50代', '60代', '70代', '80代以上'],
      },
      {
        id: 'sex', label: '性別', type: 'radio', required: false,
        options: ['女性', '男性', '答えない'],
      },
      {
        id: 'role', label: 'お立場', type: 'radio', required: true,
        note: '医療・介護のお仕事の方には、あとで連携についてもうかがいます。',
        options: [
          '医療・介護のお仕事（ケアマネ・看護・リハビリ・介護職など）',
          'その他のお仕事',
          '学生',
          '主婦・主夫',
          'がんサバイバー',
          '退職・その他',
        ],
      },
    ],
  },
  {
    id: 'today',
    title: '今日の体験について',
    questions: [
      {
        id: 'menu', label: '今日受けたのはどちらですか', type: 'radio', required: true,
        options: ['鍼灸体験（鍼を1本刺してみる）', '鍼灸施術（20分程度）'],
      },
      {
        id: 'parts', label: '気になっている部位（いくつでも）', type: 'checkbox', required: true,
        options: ['肩', '首', '腰', '背中', '手・腕', '足', 'ひざ', '頭', 'その他'],
      },
      {
        id: 'symptoms', label: '自覚している症状（いくつでも）', type: 'checkbox', required: true,
        options: ['こり', '痛み', '疲労感', 'しびれ', 'むくみ', 'つっぱり', '冷え', '眠りの浅さ', 'その他'],
      },
    ],
  },
  {
    id: 'feel',
    title: '体験の感想',
    // 体験前 → 体験中（満足度）→ 体験後 の時系列で並べる
    questions: [
      {
        id: 'before_image', label: '体験する前、鍼灸にどんな印象がありましたか（いくつでも）', type: 'checkbox', required: true,
        options: [
          '痛そう・怖そうだった',
          '効くのかよくわからなかった',
          '副作用や衛生面が気になっていた',
          '費用が高そうだった',
          '興味はあったが機会がなかった',
          'よい印象があった',
          '特に印象はなかった',
        ],
      },
      {
        id: 'before_image_other', label: 'ほかに思っていたことがあれば、お書きください', type: 'textarea', required: false,
        placeholder: '例：家族がすすめてくれたが、なんとなく踏み出せずにいた。',
      },
      {
        id: 'satisfaction', label: '今日の体験の満足度', type: 'radio', required: true,
        // 前回の反省：「とても満足」を先頭に置き、押し間違いを防ぐ
        options: ['とても満足', '満足', 'ふつう', 'やや不満', '不満'],
      },
      {
        id: 'body_change', label: 'からだの変化を感じましたか', type: 'radio', required: true,
        options: ['はっきり変化を感じた', '少し感じた', 'よくわからない', '感じなかった'],
      },
      {
        id: 'after_change', label: '体験して、鍼灸への印象は変わりましたか', type: 'radio', required: true,
        options: ['よい方向に大きく変わった', '少し変わった', 'もともとよい印象で変わらない', '変わらない'],
      },
    ],
  },
  {
    id: 'quiz',
    kind: 'quiz',
    title: '鍼灸について、おうかがいします',
    lead: '次のうち、<strong>鍼灸で相談できそう</strong>だと思うものをすべて選んでください。<br />正解・不正解はありません。今の印象のままでお答えください。',
  },
  {
    id: 'know',
    title: '知っていましたか',
    questions: [
      {
        id: 'insurance_known', label: '鍼灸に健康保険が使える場合があることを、今日より前に知っていましたか', type: 'radio', required: true,
        options: ['知っていて、使ったことがある', '知っていたが使ったことはない', 'なんとなく聞いたことはあった', '知らなかった'],
      },
      {
        id: 'where_known', label: '近くの鍼灸院や、相談できる場所をご存じですか', type: 'radio', required: true,
        options: ['知っていて、通ったことがある', '場所は知っているが行ったことはない', '知らない'],
      },
      {
        id: 'useful', label: '鍼灸は、医療や介護の現場で役立つと思いますか', type: 'radio', required: true,
        showIf: (a) => String(a.role || '').indexOf('医療・介護') === 0,
        options: ['とても役立つ', 'ある程度役立つ', 'わからない', 'あまり役立たない'],
      },
      {
        id: 'barriers', label: '鍼灸と連携するうえで、ハードルになっていることは（いくつでも）', type: 'checkbox', required: false,
        showIf: (a) => String(a.role || '').indexOf('医療・介護') === 0,
        options: [
          '鍼灸でできることがよくわからない',
          '保険適用や手続きがわかりにくい',
          'どこに相談すればよいかわからない',
          '施術者による違いがわかりにくい',
          '費用の負担',
          '本人・家族の抵抗感',
          '特にない',
        ],
      },
    ],
  },
  {
    id: 'info',
    title: '鍼灸院えらびで、知りたいこと',
    lead: '鍼灸院が広告に出せる内容は、法律で次の8つに限られています。'
      + '<ul class="legal-list">'
      + '<li>施術者である旨、氏名・住所</li>'
      + '<li>施術所名・電話番号・所在地</li>'
      + '<li>施術日・施術時間</li>'
      + '<li>医療保険療養費の支給申請ができる旨（鍼灸は医師の同意が必要）</li>'
      + '<li>予約制</li>'
      + '<li>休日・夜間施術</li>'
      + '<li>出張施術</li>'
      + '<li>駐車設備</li>'
      + '</ul>'
      + 'そのため、知りたいことが調べても出てこない、ということが起こります。'
      + '<strong>何が分かれば行きやすいのか</strong>を教えてください。',
    questions: [
      {
        id: 'want_info', label: 'この8つのほかに、何が分かると鍼灸院に行きやすくなりますか（いくつでも）', type: 'checkbox', required: true,
        options: [
          '料金の目安',
          'どんな症状を相談できるか',
          '施術の流れ・1回にかかる時間',
          '痛みの程度（初めてでも大丈夫か）',
          '保険が使えるかどうかと、その手続きの仕方',
          '施術者の経歴・得意分野',
          '実際に受けた人の感想',
          '院内の写真・雰囲気',
          '女性の施術者がいるか',
          '子ども連れや車椅子でも行けるか',
          '着替えや持ち物の案内',
          'ネットで予約できるか',
          '特にない',
        ],
      },
      {
        id: 'want_info_other', label: 'ほかに「これが分かれば行きやすい」と思うことがあれば、お書きください', type: 'textarea', required: false,
        note: 'ここが一番うかがいたいところです。ひとことでも大歓迎です。',
        placeholder: '例：待合室でほかの人と一緒にならないか知りたい。',
      },
    ],
  },
  {
    id: 'next',
    title: 'これからについて',
    questions: [
      {
        id: 'intent', label: '今日をきっかけに、どうしたいと思いましたか（いくつでも）', type: 'checkbox', required: true,
        options: [
          '近くの鍼灸院に行ってみたい',
          '保険での受け方を詳しく知りたい',
          '適応と保険手続きをまとめた資料がほしい',
          '家族や知人にすすめたい',
          '職場や利用者さんに紹介したい',
          'また体験会があれば参加したい',
          '今回だけで十分',
        ],
      },
      {
        id: 'comment', label: 'ご感想・ご要望があればお書きください', type: 'textarea', required: false,
        placeholder: '例：短い時間でしたが肩が軽くなりました。',
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
  wrap.appendChild(el('p', 'quiz-help', 'わからないものは選ばずに進んでも大丈夫です。'));
  return wrap;
}

/* 送信後の「持ち帰りページ」に置く、鍼灸で相談できることの一覧。
   採点はしない。読みものとして、ゆっくり見てもらうための構成。 */
function buildTakeaway() {
  const wrap = el('section', 'takeaway');
  wrap.appendChild(el('p', 'eyebrow', 'ABOUT ACUPUNCTURE'));
  wrap.appendChild(el('h3', null, '鍼灸で相談できること'));
  wrap.appendChild(el('p', 'takeaway-lead',
    '先ほどおたずねした項目を、あらためて整理しました。いずれも、鍼灸院で日常的に相談されている内容です。'));

  ['insurance', 'common', 'life'].forEach((category) => {
    const info = CATEGORY_INFO[category];
    const card = el('div', 'reveal-card cat-' + category);
    card.appendChild(el('h4', null, info.title));
    const ul = el('ul', 'reveal-list');
    QUIZ_ITEMS.filter((item) => item.category === category).forEach((item) => {
      const li = el('li');
      li.innerHTML = '<span class="item">' + item.label + '</span>' +
        (item.tag && item.tag !== item.label ? '<span class="tag">保険名称：' + item.tag + '</span>' : '');
      ul.appendChild(li);
    });
    card.appendChild(ul);
    card.appendChild(el('p', 'reveal-note', info.note));
    wrap.appendChild(card);
  });

  wrap.appendChild(el('p', 'reveal-caution',
    '※「鍼灸院で相談できる」という意味です。効果の現れ方には個人差があり、すべての方に有効と保証するものではありません。' +
    '強い痛みや急な症状、原因のはっきりしない症状は、まず医療機関を受診してください。'));
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

function collectPayload() {
  const picked = QUIZ_ITEMS.filter((item) => quizSelection.has(item.id));
  const payload = {
    timestamp: new Date().toISOString(),
    event: CONFIG.eventName,
    quiz_picked_count: picked.length,
    quiz_total: QUIZ_ITEMS.length,
    quiz_picked: picked.map((item) => item.label).join(' / '),
    quiz_missed: QUIZ_ITEMS.filter((item) => !quizSelection.has(item.id)).map((item) => item.label).join(' / '),
  };
  STEPS.forEach((step) => {
    (step.questions || []).forEach((q) => {
      const value = answers[q.id];
      payload[q.id] = Array.isArray(value) ? value.join(' / ') : (value == null ? '' : value);
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
      ? 'いただいたご意見は、今後の体験会の参考にさせていただきます。<br />お時間のあるときに、下の内容もご覧ください。'
      : '電波の状況で送信できなかったため、この端末に一時保存しました。電波のよい場所でこのページをもう一度開くと自動で送信されます。<br />お時間のあるときに、下の内容もご覧ください。'));

  doneRoot.appendChild(buildTakeaway());

  const cards = el('div', 'result-cards');
  const takeaways = [
    {
      title: '鍼は使い捨て、施術は国家資格者が行います',
      body: '使うのは滅菌済みの使い捨て鍼で、使い回しはしません。はり師・きゅう師はいずれも国家資格です。今日感じていただいたとおり、多くの場合、強い痛みはありません。',
    },
    {
      title: '健康保険が使えることがあります',
      body: '神経痛・リウマチ・頸腕症候群・五十肩・腰痛症・頸椎捻挫後遺症（むちうち）の6つは、医師の同意書があれば健康保険で鍼灸を受けられます。同意書のもらい方も鍼灸院が案内しますので、まずはご相談ください。',
    },
    {
      title: '迷ったら、お近くの会員院へ',
      body: 'どこに行けばよいか迷ったら、中信鍼灸師会の会員院一覧からお探しいただけます。「これは鍼灸で診てもらえますか？」と聞いていただくだけで大丈夫です。<br /><a class="link-button" href="' + CONFIG.societyUrl + '" target="_blank" rel="noreferrer">会員院をさがす</a>',
    },
  ];
  takeaways.forEach((item) => {
    const card = el('div', 'result-card');
    card.appendChild(el('h3', null, item.title));
    card.appendChild(el('p', null, item.body));
    cards.appendChild(card);
  });
  doneRoot.appendChild(cards);

  const extra = el('aside', 'intro');
  extra.innerHTML = 'このページは、あとからでもご覧いただけます。東洋医学の見方で今の体調を整理する<a href="' + CONFIG.selfCheckUrl + '">「わたしの体質チェック」</a>もどうぞ。';
  doneRoot.appendChild(extra);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleNext() {
  const step = visibleSteps[stepIndex];
  const section = currentSection();

  // クイズは無回答でも進めるが、一度だけ確認する
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
