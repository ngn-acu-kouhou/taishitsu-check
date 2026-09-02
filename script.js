const types = [
  {
    id: 'kikyo', name: '気虚タイプ', subtitle: 'エネルギー不足が気になる傾向',
    questions: ['疲れやすく、休んでも回復しにくい', '朝、すっきり起きにくい', '少し動いただけでも疲れやすい', '食欲がわきにくい', '胃もたれや胃腸の弱さを感じやすい', 'お腹をこわしやすい', '風邪をひきやすい、または長引きやすい', '声が小さくなったり、ため息が増えたりする'],
    description: '東洋医学でいう「気」は、活動する力や、体を健やかに保つ働きを表す言葉です。気虚は、その働きが不足しやすいと考える状態で、疲れやすさ、食欲の低下、風邪をひきやすいことなどが目安になります。',
    signs: 'がんばった後にぐったりする、朝から力が出にくい、食後に眠くなりやすい、といった感覚が重なる場合があります。',
    habits: ['朝食を抜かず、温かく消化しやすい食事をゆっくりとる', '予定を詰め込みすぎず、疲れを感じる前に短い休憩を入れる', '就寝・起床時刻を大きくずらさない'],
    points: [{ name: '足三里（あしさんり）', code: 'ST36', location: '膝のお皿の外側のくぼみから、指4本分ほど下。すねの外側。', x: 114, y: 205 }, { name: '中脘（ちゅうかん）', code: 'CV12', location: 'おへそとみぞおちのほぼ中間。お腹の中央。', x: 100, y: 126 }]
  },
  {
    id: 'kekkyo', name: '血虚タイプ', subtitle: '栄養・うるおい不足が気になる傾向',
    questions: ['顔色が青白く見え、唇や爪の色が淡い', 'めまい・立ちくらみを感じることがある', '動悸や息切れを感じることがある', '疲れやすく、貧血を指摘されたことがある', '肌の乾燥や小ジワが気になる', '髪のツヤがなく、枝毛や切れ毛が多い', '爪が薄く、割れたり折れたりしやすい', '目が疲れやすく、かすみやすい'],
    description: '東洋医学でいう「血（けつ）」は、全身に栄養とうるおいを届ける働きを表す言葉です。血虚は、その働きが足りにくいと考える状態で、顔色の淡さ、乾燥、めまい、髪や爪の変化などが目安になります。',
    signs: '忙しさや睡眠不足が続くと、目の疲れ、肌・髪の乾燥、立ちくらみなどが気になりやすい傾向です。',
    habits: ['主食・主菜・副菜をそろえ、食事を極端に減らさない', '夜更かしを控え、目を休める時間をつくる', '強いめまい・息切れが続く場合は、貧血などを医療機関で確認する'],
    points: [{ name: '三陰交（さんいんこう）', code: 'SP6', location: '内くるぶしの一番高い所から、指4本分ほど上。すねの骨の後ろ側。', x: 87, y: 226 }, { name: '血海（けっかい）', code: 'SP10', location: '膝のお皿の内側上端から、指3本分ほど上。太ももの内側。', x: 86, y: 174 }]
  },
  {
    id: 'inkyo', name: '陰虚タイプ', subtitle: 'うるおい不足・ほてりが気になる傾向',
    questions: ['のぼせやすく、手のひら・足の裏がほてる', '肌や髪、目の乾燥が気になる', '口が渇きやすい', '夜にほてりや寝汗が気になることがある', '暑がりで、冷房の効いた場所を好む', '便が硬く、コロコロした便になりやすい', '冷たい飲み物を好む', '夕方以降に疲れやほてりを感じやすい'],
    description: '東洋医学でいう「津液（しんえき）」は、体をうるおし、熱を調整する水分の働きを指します。陰虚は、そのうるおいが不足しやすいと考える状態で、乾燥、口の渇き、ほてり、硬い便などが目安になります。',
    signs: '乾燥する季節や睡眠不足のときに、肌・目・口の乾きや、夕方からのほてりを自覚しやすい傾向です。',
    habits: ['室内の乾燥を避け、のどが渇く前に少量ずつ水分をとる', '刺激の強い食事・飲酒・夜更かしを続けない', '強い口渇、頻尿、急な体重変化がある場合は医療機関に相談する'],
    points: [{ name: '太渓（たいけい）', code: 'KI3', location: '内くるぶしとアキレス腱の間にあるくぼみ。', x: 88, y: 248 }, { name: '照海（しょうかい）', code: 'KI6', location: '内くるぶしの真下にあるくぼみ。', x: 85, y: 255 }]
  },
  {
    id: 'kitai', name: '気滞タイプ', subtitle: 'ストレスによる滞りが気になる傾向',
    questions: ['ストレスをため込みやすい', 'イライラしやすく、気分が沈むこともある', '気分にムラがあり、怒りっぽくなることがある', '胸やのどにつかえるような感じがある', '胃もたれ、お腹の張りを感じやすい', 'げっぷやおならが出やすい', '食欲や食べたいものが、気分によって変わりやすい', '月経前に気分や体調がゆらぎやすい'],
    description: '気滞は、東洋医学でいう「気」の巡りが滞りやすいと考える状態です。ストレスや生活リズムの乱れをきっかけに、気分の波、胸やお腹の張りなどが出やすい傾向を目安にします。',
    signs: '忙しい時期や人間関係の負荷が重なると、ため息、胸のつかえ、お腹の張りなどとして表れやすいとされます。',
    habits: ['呼吸が深くなる軽い運動やストレッチを生活に入れる', '入浴や散歩など、画面から離れる気分転換の時間をつくる', '気分の落ち込みや不安が続き生活に支障がある場合は専門家に相談する'],
    points: [{ name: '太衝（たいしょう）', code: 'LR3', location: '足の甲。親指と人差し指の骨が交わる手前のくぼみ。', x: 112, y: 262 }, { name: '膻中（だんちゅう）', code: 'CV17', location: '胸の中央。左右の乳頭を結ぶ線のほぼ中央。', x: 100, y: 101 }]
  },
  {
    id: 'oketsu', name: '瘀血タイプ', subtitle: '巡りの滞りが気になる傾向',
    questions: ['顔色が暗く、くすんで見えることがある', '手足の冷えを感じやすい', '肩・首・背中のこりを感じやすい', '目の下のクマが気になる', 'あざができやすい、または傷あとが残りやすい', '肌のくすみやシミが気になる', '同じ場所に刺すような痛みを感じることがある', '月経痛が強く、経血に塊が混じることがある'],
    description: '瘀血（おけつ）は、東洋医学でいう「血」の巡りが滞りやすいと考える状態です。肩こり、顔色のくすみ、目の下のクマ、月経時の痛みなどが目安とされますが、これらだけで体質を決めるものではありません。',
    signs: '座りっぱなしや冷え、睡眠不足が重なると、こりや冷え、顔色の印象が気になりやすい傾向です。',
    habits: ['長時間同じ姿勢を避け、1時間に一度は立って体を動かす', '入浴や足元を温める習慣を取り入れる', '突然の強い痛み、片側の腫れ、出血の異常がある場合は速やかに医療機関へ相談する'],
    points: [{ name: '血海（けっかい）', code: 'SP10', location: '膝のお皿の内側上端から、指3本分ほど上。太ももの内側。', x: 86, y: 174 }, { name: '合谷（ごうこく）', code: 'LI4', location: '手の甲。親指と人差し指の骨が交わる手前。', x: 58, y: 153 }]
  },
  {
    id: 'tanshitsu', name: '痰湿タイプ', subtitle: '水分バランスの乱れが気になる傾向',
    questions: ['体や手足が重だるく、むくみやすい', '雨の日や湿度の高い日に不調を感じやすい', '胃が重く、すっきりしないことがある', '食後に眠くなりやすい', '花粉症や鼻炎などで、鼻水が出やすい', 'じくじくして治りにくい吹き出物ができることがある', '吐き気を感じやすい', '便がやわらかくなりやすい'],
    description: '痰湿（たんしつ）は、東洋医学でいう水分の巡りや排出が滞りやすいと考える状態です。体の重だるさ、むくみ、湿度の高い日の不調、胃腸の不快感などが目安になります。',
    signs: '食べ過ぎ、飲酒、運動不足が続くと、重だるさやむくみ、胃腸のもたれ感を自覚しやすい傾向です。',
    habits: ['食べ過ぎ・飲酒を控えめにし、遅い時間の食事を続けない', '軽い有酸素運動や散歩を習慣にする', '急なむくみ、息苦しさ、強い吐き気がある場合は自己判断せず医療機関に相談する'],
    points: [{ name: '陰陵泉（いんりょうせん）', code: 'SP9', location: '膝の内側。すねの骨の内側を上になでて、膝下で指が止まるくぼみ。', x: 87, y: 195 }, { name: '豊隆（ほうりゅう）', code: 'ST40', location: '膝と外くるぶしの中間あたり。すねの外側。', x: 114, y: 222 }]
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

function bodyDiagram(point) {
  const diagrams = {
    ST36: { area: 'すねの外側', shape: '<path d="M78 20 C72 65 73 150 83 215 L119 215 C129 150 130 65 122 20 Z"/><path d="M100 24 L100 211"/>', marker: [125, 103] },
    ST40: { area: 'すねの外側', shape: '<path d="M78 20 C72 65 73 150 83 215 L119 215 C129 150 130 65 122 20 Z"/><path d="M100 24 L100 211"/>', marker: [126, 151] },
    SP6: { area: '下腿の内側', shape: '<path d="M78 20 C72 65 73 150 83 215 L119 215 C129 150 130 65 122 20 Z"/><path d="M100 24 L100 211"/>', marker: [75, 163] },
    SP9: { area: '膝の内側', shape: '<path d="M78 20 C72 65 73 150 83 215 L119 215 C129 150 130 65 122 20 Z"/><path d="M100 24 L100 211"/>', marker: [76, 67] },
    SP10: { area: '太ももの内側', shape: '<path d="M67 20 C62 73 66 162 82 215 L118 215 C134 162 138 73 133 20 Z"/><path d="M100 24 L100 211"/>', marker: [71, 104] },
    KI3: { area: '内くるぶし周辺', shape: '<path d="M75 18 C70 68 74 124 84 162 L82 203 L142 203 C151 196 152 183 141 178 L117 166 L119 18 Z"/><path d="M84 162 C100 171 117 168 130 163"/>', marker: [83, 158] },
    KI6: { area: '内くるぶし周辺', shape: '<path d="M75 18 C70 68 74 124 84 162 L82 203 L142 203 C151 196 152 183 141 178 L117 166 L119 18 Z"/><path d="M84 162 C100 171 117 168 130 163"/>', marker: [81, 174] },
    LR3: { area: '足の甲', shape: '<path d="M42 183 C56 102 77 44 102 24 C123 43 142 100 159 183 L145 213 L58 213 Z"/><path d="M70 184 L102 38 L135 184"/>', marker: [111, 132] },
    CV17: { area: '胸の中央', shape: '<path d="M48 190 L61 50 C72 28 128 28 139 50 L152 190 Z"/><path d="M100 38 L100 187"/>', marker: [100, 98] },
    CV12: { area: 'お腹の中央', shape: '<path d="M54 195 L67 25 L133 25 L146 195 Z"/><path d="M100 28 L100 192"/><path d="M70 102 C87 111 113 111 130 102"/>', marker: [100, 111] },
    LI4: { area: '手の甲', shape: '<path d="M57 189 L51 92 C50 76 63 70 72 81 L86 104 L80 42 C79 27 94 24 100 40 L108 94 L111 32 C112 18 128 20 130 35 L132 95 L141 49 C145 35 160 39 158 54 L145 126 C140 160 119 186 90 194 Z"/><path d="M87 105 L125 117"/>', marker: [112, 111] }
  };
  const diagram = diagrams[point.code];
  return `<figure class="point-figure"><svg class="body-diagram" viewBox="0 0 200 235" role="img" aria-label="${point.name}の位置の目安。${diagram.area}を拡大した図。"><title>${point.name}の位置の目安</title><g class="body-outline">${diagram.shape}</g><g class="point-marker"><circle cx="${diagram.marker[0]}" cy="${diagram.marker[1]}" r="8"/><circle class="point-pulse" cx="${diagram.marker[0]}" cy="${diagram.marker[1]}" r="13"/></g><text class="diagram-label" x="100" y="227" text-anchor="middle">${diagram.area}を拡大</text></svg><figcaption>${point.name}<span>${point.code}</span></figcaption></figure>`;
}

function pointGuides(points) {
  return `<div class="point-guides">${points.map((point) => `<article class="point-guide">${bodyDiagram(point)}<p>${point.location}</p></article>`).join('')}</div>`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const scores = types.map((type) => ({ ...type, score: form.querySelectorAll(`input[name="${type.id}"]:checked`).length }));
  const highest = Math.max(...scores.map((type) => type.score));
  if (highest === 0) { validation.hidden = false; result.hidden = true; return; }
  validation.hidden = true;
  const winners = scores.filter((type) => type.score === highest);
  summary.textContent = winners.length === 1 ? `最も多く当てはまったのは「${winners[0].name}」でした。` : `同数で当てはまったタイプが${winners.length}つあります。`;
  cards.replaceChildren(...winners.map((type) => {
    const card = document.createElement('article');
    card.className = 'result-card';
    card.innerHTML = `<p class="eyebrow">${type.score} CHECKS</p><h3>${type.name}</h3><p class="type-subtitle">${type.subtitle}</p><section class="result-section"><h4>どんな傾向？</h4><p>${type.description}</p><p>${type.signs}</p></section><section class="result-section"><h4>暮らしのヒント</h4><ul>${type.habits.map((habit) => `<li>${habit}</li>`).join('')}</ul></section><section class="point-section"><h4>代表的なツボ（指圧の目安）</h4>${pointGuides(type.points)}<p class="point-caution">図は位置を大まかに示すものです。痛くない強さで、ゆっくり呼吸しながら数秒押して離すことを繰り返してください。</p></section>`;
    return card;
  }));
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

form.addEventListener('reset', () => { validation.hidden = true; result.hidden = true; });
