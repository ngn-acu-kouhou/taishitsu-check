const types = [
  {
    id: 'kikyo', name: '気虚タイプ', subtitle: 'エネルギー不足が気になる傾向',
    questions: ['疲れやすく、休んでも回復しにくい', '食欲がわきにくく、お腹をこわしやすい', '少し動いただけでも疲れやすい', '風邪をひきやすい、または長引きやすい', '胃もたれや胃腸の弱さを感じやすい', 'ねんざや肉離れなどを起こしやすい'],
    description: '東洋医学でいう「気」の働きが不足しやすいと考える状態です。疲れやすさや食欲の低下などが目安になります。',
    hint: '食事・睡眠・休息のリズムを整え、無理を重ねないことを意識しましょう。'
  },
  {
    id: 'kekkyo', name: '血虚タイプ', subtitle: '栄養・うるおい不足が気になる傾向',
    questions: ['顔色が青白く見え、唇や爪の色が淡い', 'めまい・立ちくらみ・動悸を感じることがある', '疲れやすく、貧血を指摘されたことがある', '肌の乾燥や小ジワが気になる', '髪のツヤがなく、枝毛や切れ毛が多い', '爪が薄く、割れたり折れたりしやすい'],
    description: '東洋医学でいう「血（けつ）」は、全身に栄養とうるおいを届ける働きを表す言葉です。顔色の淡さや乾燥などが目安になります。',
    hint: '偏りの少ない食事と十分な睡眠を心がけ、目を休める時間もつくりましょう。'
  },
  {
    id: 'inkyo', name: '陰虚タイプ', subtitle: 'うるおい不足・ほてりが気になる傾向',
    questions: ['のぼせやすく、手のひら・足の裏がほてる', '肌や髪、目の乾燥が気になる', '暑がりで、冷房の効いた場所を好む', '便が硬く、コロコロした便になりやすい', '口が渇きやすく、こまめに水分をとりたくなる', '冷たい飲み物を好む'],
    description: '東洋医学でいう「津液（しんえき）」という、体をうるおし熱を調整する水分の働きが不足しやすいと考える状態です。',
    hint: '室内の乾燥を避け、こまめな水分補給と十分な休息を意識しましょう。'
  },
  {
    id: 'kitai', name: '気滞タイプ', subtitle: 'ストレスによる滞りが気になる傾向',
    questions: ['食欲や食べたいものが、気分によって変わりやすい', 'ストレスをため込みやすい', 'イライラしやすく、気分が沈むこともある', '気分にムラがあり、怒りっぽくなることがある', '胃もたれ、お腹の張りを感じやすい', 'げっぷやおならが出やすい'],
    description: '東洋医学でいう「気」の巡りが滞りやすいと考える状態です。ストレスをきっかけに、気分の波やお腹の張りが出やすい傾向を目安にします。',
    hint: '深呼吸、軽い運動、入浴などで気分転換の時間をつくり、睡眠のリズムを整えましょう。'
  },
  {
    id: 'oketsu', name: '瘀血タイプ', subtitle: '巡りの滞りが気になる傾向',
    questions: ['顔色が暗く、くすんで見えることがある', '手足の冷えを感じやすい', 'あざができやすい、または傷あとが残りやすい', '肌のくすみやシミが気になる', '肩・首・背中のこりを感じやすい', '目の下のクマが気になる'],
    description: '瘀血（おけつ）は、東洋医学でいう「血」の巡りが滞りやすいと考える状態です。肩こりや顔色のくすみなどが目安とされます。',
    hint: '長時間同じ姿勢を避け、無理のない範囲で体を動かし、生活のリズムを整えましょう。'
  },
  {
    id: 'tanshitsu', name: '痰湿タイプ', subtitle: '水分バランスの乱れが気になる傾向',
    questions: ['体や手足が重だるく、むくみやすい', '雨の日や湿度の高い日に不調を感じやすい', '花粉症や鼻炎などで、鼻水が出やすい', 'じくじくして治りにくい吹き出物ができることがある', '吐き気を感じやすい', '便がやわらかくなりやすい'],
    description: '痰湿（たんしつ）は、東洋医学でいう水分の巡りや排出が滞りやすいと考える状態です。重だるさやむくみなどが目安になります。',
    hint: '食べ過ぎや飲酒を控えめにし、軽い運動と規則正しい食事・睡眠を心がけましょう。'
  }
];

const form = document.querySelector('#check-form');
const groups = document.querySelector('#question-groups');
const result = document.querySelector('#result');
const cards = document.querySelector('#result-cards');
const summary = document.querySelector('#result-summary');
const validation = document.querySelector('#validation-message');

types.forEach((type, groupIndex) => {
  const section = document.createElement('section');
  section.className = 'group';
  section.innerHTML = `<h2>チェック項目 ${groupIndex + 1}</h2><ul class="question-list"></ul>`;
  const list = section.querySelector('ul');
  type.questions.forEach((question, index) => {
    const id = `${type.id}-${index}`;
    list.insertAdjacentHTML('beforeend', `<li><label for="${id}"><input type="checkbox" id="${id}" name="${type.id}" value="${index}"><span>${question}</span></label></li>`);
  });
  groups.append(section);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const scores = types.map((type) => ({ ...type, score: form.querySelectorAll(`input[name="${type.id}"]:checked`).length }));
  const highest = Math.max(...scores.map((type) => type.score));

  if (highest === 0) {
    validation.hidden = false;
    result.hidden = true;
    return;
  }

  validation.hidden = true;
  const winners = scores.filter((type) => type.score === highest);
  summary.textContent = winners.length === 1
    ? `最も多く当てはまったのは「${winners[0].name}」でした。`
    : `同数で当てはまったタイプが${winners.length}つあります。`; 
  cards.replaceChildren(...winners.map((type) => {
    const card = document.createElement('article');
    card.className = 'result-card';
    card.innerHTML = `<p class="eyebrow">${type.score} CHECKS</p><h3>${type.name}</h3><p>${type.subtitle}</p><p>${type.description}</p><p class="hint"><strong>暮らしのヒント：</strong>${type.hint}</p>`;
    return card;
  }));
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

form.addEventListener('reset', () => {
  validation.hidden = true;
  result.hidden = true;
});
