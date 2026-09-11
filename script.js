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

// ツボの探し方（図の下に①②③で表示）
const pointSteps = {
  ST36: ['膝のお皿の下、外側にあるくぼみを見つける', 'そこから指4本分（人差し指〜小指の幅）下がる', 'すねの骨のすぐ外側。押すとズーンと響く所'],
  ST40: ['膝のお皿の下のくぼみと、外くるぶしを見つける', 'その2点のちょうど真ん中の高さ', 'すねの骨の外側、筋肉のふくらみの上'],
  SP9: ['すねの骨の内側の際（きわ）に指を当てる', '骨に沿って膝の方へなで上げる', '膝の下で指が止まるくぼみ'],
  SP10: ['膝のお皿の内側・上の角を見つける', 'そこから太ももの内側へ指3本分上がる', '押すと少し痛気持ちいい所'],
  SP6: ['内くるぶしの一番高い所に小指を当てる', '指4本をそろえ、人差し指の上の高さ', 'すねの骨のすぐ後ろ側の際'],
  KI3: ['内くるぶしの頂点と、アキレス腱を見つける', 'その2つのちょうど間のくぼみ', '脈がトクトク触れることもある'],
  KI6: ['内くるぶしの一番高い所を見つける', 'そこから真下へ指1本分ほど下がる', '骨のすぐ下のくぼみ'],
  LR3: ['足の甲、親指と人差し指の間に指を置く', '足首の方へなぞっていく', '2本の骨がぶつかる手前のくぼみで止まる'],
  LI4: ['親指と人差し指の付け根、水かきの部分', '人差し指の骨に沿って手首側へ少し', '骨の際を親指で押すと響く所'],
  CV17: ['胸の中央、平らな骨（胸骨）の上', '左右の乳頭を結んだ線の真ん中', '指の腹でやさしく押す'],
  CV12: ['みぞおち（肋骨のV字の下）とおへそを見つける', 'その2点を結んだ線のちょうど真ん中', '息を吐きながらゆっくり押す']
};

// ---- 図のパーツ ----
// 全身の小さな人型。拡大している場所を丸で示す
function locator(region) {
  const spots = { knee: [25, 68], shin: [25, 80], ankle: [25, 92], foot: [24, 97], hand: [36, 47], chest: [20, 28], belly: [20, 42] };
  const [sx, sy] = spots[region];
  return `
    <g class="locator" transform="translate(6 8) scale(0.72)">
      <circle class="locator-body" cx="20" cy="8" r="7" />
      <path class="locator-body" d="M 12 17 L 28 17 L 33 20 L 37 46 L 32 47 L 30 27 L 30 54 L 28 98 L 21 98 L 20 62 L 19 98 L 12 98 L 10 54 L 10 27 L 8 47 L 3 46 L 7 20 Z" />
      <circle class="locator-spot" cx="${sx}" cy="${sy}" r="9" />
      <text class="locator-text" x="20" y="114" text-anchor="middle">この辺り</text>
    </g>`;
}

// 指を n 本並べた「指◯本分」の目盛り
function fingers(n, x, y, opts = {}) {
  const w = opts.w || 42;
  const h = 12;
  const gap = 1;
  let bars = '';
  for (let i = 0; i < n; i += 1) {
    const by = y + i * (h + gap);
    bars += `<rect class="finger-bar" x="${x}" y="${by}" width="${w}" height="${h}" rx="6" /><rect class="finger-nail" x="${x + w - 10}" y="${by + 3}" width="7" height="${h - 6}" rx="3" />`;
  }
  const total = n * (h + gap) - gap;
  const side = opts.side || 'right';
  const bx = side === 'right' ? x + w + 4 : x - 4;
  const tx = side === 'right' ? bx + 4 : bx - 4;
  const anchor = side === 'right' ? 'start' : 'end';
  return `
    <g class="finger-gauge">
      ${bars}
      <path class="guide-arrow" d="M ${bx} ${y} L ${bx} ${y + total}" />
      <path class="guide-arrow" d="M ${bx - 3} ${y} L ${bx + 3} ${y} M ${bx - 3} ${y + total} L ${bx + 3} ${y + total}" />
      <text class="guide-subtext" x="${tx}" y="${y + total / 2 + 4}" text-anchor="${anchor}">指${n}本分</text>
    </g>`;
}

function marker(x, y) {
  return `<g class="point-marker"><circle class="point-pulse" cx="${x}" cy="${y}" r="10" /><circle class="main-dot" cx="${x}" cy="${y}" r="7" /></g>`;
}

// 「ここ」の吹き出し。(px,py) がツボ、(bx,by) が吹き出しの中心
function callout(px, py, bx, by, text = 'ここ') {
  const w = text.length * 11 + 14;
  const h = 20;
  return `
    <g class="callout">
      <line class="callout-line" x1="${px}" y1="${py}" x2="${bx}" y2="${by}" />
      <rect class="callout-box" x="${bx - w / 2}" y="${by - h / 2}" width="${w}" height="${h}" rx="10" />
      <text class="callout-text" x="${bx}" y="${by + 4}" text-anchor="middle">${text}</text>
    </g>`;
}

function badge(x, y, text) {
  const w = text.length * 9.5 + 12;
  return `<rect class="guide-badge" x="${x - w / 2}" y="${y - 9}" width="${w}" height="18" /><text class="guide-subtext" x="${x}" y="${y + 4}" text-anchor="middle">${text}</text>`;
}

function arrowHead(x, y, dir) {
  const heads = { down: `${x},${y + 4} ${x - 4},${y - 4} ${x + 4},${y - 4}`, up: `${x},${y - 4} ${x - 4},${y + 4} ${x + 4},${y + 4}`, left: `${x - 4},${y} ${x + 4},${y - 4} ${x + 4},${y + 4}`, right: `${x + 4},${y} ${x - 4},${y - 4} ${x - 4},${y + 4}` };
  return `<polygon class="guide-arrow-head" points="${heads[dir]}" />`;
}

function svgWrap(point, region, label, inner) {
  return `
    <svg class="body-diagram" viewBox="0 0 240 250" role="img" aria-label="${point.name}の位置の目安。${point.location}">
      <title>${point.name}の位置目安</title>
      ${inner}
      ${locator(region)}
      <text class="diagram-label" x="128" y="241" text-anchor="middle">${label}</text>
    </svg>`;
}

// ---- 部位ごとの下絵 ----
// すね（正面）。左＝内側、右＝外側
const shinFront = `
  <text class="side-label" x="70" y="24" text-anchor="middle">内側</text>
  <text class="side-label" x="192" y="24" text-anchor="middle">外側</text>
  <path class="body-outline" d="M 84 14 C 80 40 78 70 84 110 C 88 150 92 180 96 205 L 154 205 C 158 180 162 150 166 110 C 172 70 170 40 166 14 Z" />
  <ellipse class="body-landmark" cx="125" cy="40" rx="18" ry="20" />
  <text class="guide-text" x="125" y="44" text-anchor="middle" font-size="9">お皿</text>
  <ellipse class="landmark-dimple" cx="142" cy="66" rx="6" ry="4" />
  <path class="body-bone" d="M 128 62 L 126 205" />
  <path class="body-bone" d="M 118 62 L 116 205" />
  <text class="guide-text" x="108" y="150" text-anchor="end" font-size="9">すねの骨</text>
  <circle class="body-landmark" cx="158" cy="198" r="8" />
  <circle class="body-landmark" cx="94" cy="200" r="7" />`;

// すね〜足（内側から見た側面）。左＝かかと側、右＝つま先側
const legInner = `
  <text class="side-label" x="136" y="24" text-anchor="middle">内側から見た図</text>
  <path class="body-outline" d="M 96 30 C 84 70 86 110 100 150 C 106 168 104 182 100 196 L 100 208 C 100 214 106 218 114 218 L 206 218 C 214 218 218 212 214 206 C 200 196 178 192 160 186 C 158 150 160 100 160 30 Z" />
  <path class="body-bone" d="M 106 130 L 104 205" />
  <path class="body-bone" d="M 114 130 L 112 205" />
  <text class="guide-text" x="98" y="150" text-anchor="end" font-size="9">アキレス腱</text>
  <path class="body-bone" d="M 154 30 L 150 168" />
  <text class="guide-text" x="166" y="80" text-anchor="start" font-size="9">すねの骨</text>
  <circle class="body-landmark" cx="146" cy="176" r="11" />
  <text class="side-label" x="112" y="212" text-anchor="middle">かかと</text>
  <text class="side-label" x="192" y="212" text-anchor="middle">つま先</text>`;

const ankleLabel = `
  <line class="guide-line" x1="157" y1="174" x2="176" y2="174" />
  <text class="guide-text" x="178" y="171" text-anchor="start" font-size="9">内くるぶし</text>
  <text class="guide-text" x="178" y="182" text-anchor="start" font-size="8.5">（出っぱり）</text>`;

// 膝（内側から見た側面）。右＝お皿側
const kneeInner = `
  <text class="side-label" x="136" y="24" text-anchor="middle">内側から見た図</text>
  <path class="body-outline" d="M 92 14 C 90 40 92 70 96 96 C 98 110 96 130 98 150 C 100 180 102 200 104 215 L 162 215 C 164 190 166 160 162 130 C 160 115 168 106 170 96 C 176 80 176 50 172 14 Z" />
  <ellipse class="body-landmark" cx="166" cy="86" rx="10" ry="16" />
  <text class="guide-text" x="186" y="90" text-anchor="start" font-size="9">お皿</text>
  <path class="body-bone" d="M 150 215 L 146 150 C 144 130 134 122 122 118" />
  <line class="guide-line" x1="148" y1="180" x2="174" y2="180" />
  <text class="guide-text" x="176" y="184" text-anchor="start" font-size="9">すねの骨</text>`;

// 太もも〜膝（正面）。左＝内側、右＝外側
const thighFront = `
  <text class="side-label" x="60" y="24" text-anchor="middle">内側</text>
  <text class="side-label" x="196" y="24" text-anchor="middle">外側</text>
  <path class="body-outline" d="M 80 14 C 78 60 84 110 92 150 C 96 170 96 190 98 215 L 158 215 C 160 190 160 170 164 150 C 172 110 178 60 176 14 Z" />
  <ellipse class="body-landmark" cx="128" cy="178" rx="20" ry="22" />
  <text class="guide-text" x="128" y="182" text-anchor="middle" font-size="9">お皿</text>
  <text class="guide-text" x="128" y="70" text-anchor="middle" font-size="9">太もも</text>`;

// 足の甲（上から）。左＝親指側
const footTop = `
  <path class="body-outline" d="M 62 70 C 58 110 60 160 68 215 L 176 215 C 184 160 186 110 176 76 C 170 68 158 64 150 66 C 140 60 128 58 118 60 C 108 56 96 62 92 72 C 84 74 68 70 62 70 Z" />
  <ellipse class="body-landmark" cx="78" cy="54" rx="15" ry="20" />
  <ellipse class="body-landmark" cx="110" cy="42" rx="9" ry="15" />
  <ellipse class="body-landmark" cx="131" cy="44" rx="8.5" ry="14" />
  <ellipse class="body-landmark" cx="150" cy="50" rx="8" ry="13" />
  <ellipse class="body-landmark" cx="167" cy="60" rx="7.5" ry="12" />
  <text class="guide-text" x="78" y="58" text-anchor="middle" font-size="8.5">親指</text>
  <text class="guide-text" x="112" y="22" text-anchor="middle" font-size="8.5">人差し指</text>
  <path class="body-bone" d="M 80 76 L 96 140" />
  <path class="body-bone" d="M 110 60 L 104 140" />`;

// 手の甲。親指は左
const handBack = `
  <path class="body-outline" d="M 78 100 C 74 130 72 160 80 195 L 150 195 C 160 160 160 130 156 100 Z" />
  <rect class="body-outline" x="56" y="88" width="20" height="64" rx="10" transform="rotate(-40 76 150)" />
  <rect class="body-outline" x="78" y="34" width="20" height="72" rx="10" />
  <rect class="body-outline" x="101" y="24" width="21" height="82" rx="10" />
  <rect class="body-outline" x="125" y="30" width="20" height="76" rx="10" />
  <rect class="body-outline" x="148" y="48" width="16" height="58" rx="8" />
  <path class="body-sub-outline" style="fill:none" d="M 82 200 Q 115 206 148 200" />
  <text class="guide-text" x="88" y="30" text-anchor="middle" font-size="8.5">人差し指</text>
  <text class="guide-text" x="40" y="96" text-anchor="middle" font-size="8.5">親指</text>
  <path class="body-bone" d="M 88 106 L 86 185" />`;

// 胴体（正面）
const torso = `
  <path class="body-outline" d="M 100 14 C 104 24 136 24 140 14 L 150 22 C 172 30 190 44 198 66 L 188 100 C 184 140 186 180 190 215 L 50 215 C 54 180 56 140 52 100 L 42 66 C 50 44 68 30 90 22 Z" />
  <path class="body-sub-outline" style="fill:none" d="M 52 44 Q 90 58 120 52 Q 150 58 188 44" />
  <path class="body-bone" d="M 116 40 L 116 132" />
  <path class="body-bone" d="M 124 40 L 124 132" />
  <path class="body-sub-outline" style="fill:none" d="M 60 118 Q 100 150 120 132 Q 140 150 180 118" />
  <circle class="body-landmark" cx="84" cy="100" r="6" />
  <circle class="body-landmark" cx="156" cy="100" r="6" />
  <circle class="body-landmark" cx="120" cy="192" r="6" />`;

function bodyDiagram(point) {
  const code = point.code;

  if (code === 'ST36') {
    return svgWrap(point, 'knee', '【すねの外側】お皿の下のくぼみから指4本分', `
      ${shinFront}
      <line class="guide-line" x1="148" y1="64" x2="166" y2="56" />
      <text class="guide-text" x="168" y="52" text-anchor="start" font-size="8.5">お皿の下の</text>
      <text class="guide-text" x="168" y="62" text-anchor="start" font-size="8.5">くぼみ</text>
      ${fingers(4, 134, 72)}
      ${marker(140, 130)}
      ${callout(146, 132, 196, 156)}`);
  }
  if (code === 'ST40') {
    return svgWrap(point, 'shin', '【すねの外側】膝下と外くるぶしの真ん中', `
      ${shinFront}
      <line class="guide-line" x1="148" y1="70" x2="156" y2="192" />
      <line class="guide-line" x1="120" y1="131" x2="172" y2="131" />
      <line class="guide-line" x1="148" y1="64" x2="166" y2="56" />
      <text class="guide-text" x="168" y="52" text-anchor="start" font-size="8.5">お皿の下の</text>
      <text class="guide-text" x="168" y="62" text-anchor="start" font-size="8.5">くぼみ</text>
      <text class="guide-text" x="170" y="222" text-anchor="middle" font-size="8.5">外くるぶし</text>
      ${badge(196, 118, 'ちょうど真ん中')}
      ${marker(140, 131)}
      ${callout(146, 133, 196, 162)}`);
  }
  if (code === 'SP9') {
    return svgWrap(point, 'knee', '【膝の内側】骨の際をなで上げて止まる所', `
      ${kneeInner}
      <path class="guide-arrow" d="M 150 205 L 146 150 C 145 135 138 126 130 122" />
      ${arrowHead(129, 121, 'left')}
      <text class="guide-subtext" x="94" y="168" text-anchor="end">下から</text>
      <text class="guide-subtext" x="94" y="180" text-anchor="end">なで上げる</text>
      ${marker(124, 118)}
      ${callout(130, 116, 196, 132)}`);
  }
  if (code === 'SP10') {
    return svgWrap(point, 'knee', '【太ももの内側】お皿の内側上の角から指3本分', `
      ${thighFront}
      <line class="guide-line" x1="109" y1="163" x2="92" y2="192" />
      <text class="guide-text" x="90" y="200" text-anchor="end" font-size="8.5">お皿の内側</text>
      <text class="guide-text" x="90" y="210" text-anchor="end" font-size="8.5">・上の角</text>
      ${fingers(3, 88, 120, { side: 'left' })}
      ${marker(104, 114)}
      ${callout(110, 112, 184, 96)}`);
  }
  if (code === 'SP6') {
    return svgWrap(point, 'ankle', '【足首の内側】内くるぶしの頂点から指4本分', `
      ${legInner}
      ${ankleLabel}
      ${fingers(4, 130, 112, { w: 40 })}
      ${marker(136, 108)}
      ${callout(140, 104, 196, 60)}`);
  }
  if (code === 'KI3') {
    return svgWrap(point, 'ankle', '【足首の内側】くるぶしとアキレス腱の間のくぼみ', `
      ${legInner}
      ${ankleLabel}
      <path class="guide-arrow" d="M 134 178 L 130 178" />
      ${arrowHead(129, 178, 'left')}
      <path class="guide-arrow" d="M 114 178 L 118 178" />
      ${arrowHead(119, 178, 'right')}
      ${badge(60, 120, '2つの間')}
      ${marker(124, 178)}
      ${callout(130, 174, 196, 118)}`);
  }
  if (code === 'KI6') {
    return svgWrap(point, 'ankle', '【足首の内側】くるぶしの真下・指1本分のくぼみ', `
      ${legInner}
      ${ankleLabel}
      <path class="guide-arrow" d="M 146 189 L 146 198" />
      ${arrowHead(146, 200, 'down')}
      ${badge(202, 200, '真下へ指1本分')}
      ${marker(146, 206)}
      ${callout(152, 204, 196, 140)}`);
  }
  if (code === 'LR3') {
    return svgWrap(point, 'foot', '【足の甲】親指と人差し指の骨が交わる手前', `
      ${footTop}
      <path class="guide-arrow" d="M 92 82 L 96 116" />
      ${arrowHead(96, 119, 'down')}
      <text class="guide-subtext" x="112" y="150" text-anchor="start">骨がぶつかる</text>
      <text class="guide-subtext" x="112" y="162" text-anchor="start">手前のくぼみ</text>
      ${marker(98, 126)}
      ${callout(92, 128, 36, 126)}`);
  }
  if (code === 'LI4') {
    return svgWrap(point, 'hand', '【手の甲】親指と人差し指の間・骨の際', `
      ${handBack}
      <line class="guide-line" x1="86" y1="140" x2="98" y2="150" />
      <text class="guide-text" x="100" y="154" text-anchor="start" font-size="8.5">人差し指の骨</text>
      <path class="guide-arrow" d="M 68 116 L 76 124" />
      ${arrowHead(78, 126, 'right')}
      <text class="guide-text" x="52" y="176" text-anchor="middle" font-size="8.5">水かき</text>
      <line class="guide-line" x1="58" y1="168" x2="70" y2="122" />
      ${marker(82, 132)}
      ${callout(88, 130, 196, 120)}`);
  }
  if (code === 'CV17') {
    return svgWrap(point, 'chest', '【胸の中央】左右の乳頭を結ぶ線の真ん中', `
      ${torso}
      <line class="guide-line" x1="84" y1="100" x2="156" y2="100" />
      <text class="guide-text" x="84" y="116" text-anchor="middle" font-size="8.5">乳頭</text>
      <text class="guide-text" x="156" y="116" text-anchor="middle" font-size="8.5">乳頭</text>
      <text class="guide-text" x="140" y="66" text-anchor="start" font-size="8.5">胸の中央の</text>
      <text class="guide-text" x="140" y="76" text-anchor="start" font-size="8.5">平らな骨の上</text>
      ${marker(120, 100)}
      ${callout(114, 104, 62, 150)}`);
  }
  if (code === 'CV12') {
    return svgWrap(point, 'belly', '【お腹の中央】みぞおちとおへその真ん中', `
      ${torso}
      <line class="guide-line" x1="120" y1="136" x2="120" y2="186" />
      <line class="guide-line" x1="112" y1="136" x2="128" y2="136" />
      <line class="guide-line" x1="112" y1="186" x2="128" y2="186" />
      <text class="guide-text" x="130" y="130" text-anchor="start" font-size="8.5">みぞおち</text>
      <text class="guide-text" x="120" y="211" text-anchor="middle" font-size="8.5">おへそ</text>
      ${badge(162, 152, '真ん中')}
      ${marker(120, 161)}
      ${callout(114, 163, 62, 150)}`);
  }
  return '';
}

function pointGuides(points) {
  return `<div class="point-guides">${points.map((point) => {
    const steps = pointSteps[point.code] || [];
    return `<article class="point-guide"><figure class="point-figure">${bodyDiagram(point)}<figcaption>${point.name}<span>${point.code}</span></figcaption></figure><ol class="point-steps">${steps.map((step) => `<li>${step}</li>`).join('')}</ol></article>`;
  }).join('')}</div>`;
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
