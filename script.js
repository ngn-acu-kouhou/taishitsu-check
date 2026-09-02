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
  const code = point.code;
  let svgContent = '';

  if (code === 'ST36') {
    // 足三里：膝下・すね外側
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。膝下・すねの外側の図。">
        <title>${point.name}（足三里）の位置目安</title>
        <!-- 下腿シルエット -->
        <path class="body-outline" d="M 65 15 C 65 15 60 55 58 80 C 56 105 60 160 68 195 L 152 195 C 160 160 164 105 162 80 C 160 55 155 15 155 15 Z" />
        <!-- 膝蓋骨（膝のお皿） -->
        <rect class="body-landmark" x="90" y="25" width="40" height="32" rx="10" />
        <text class="guide-text" x="110" y="45" text-anchor="middle" font-size="9">膝のお皿</text>
        <!-- 脛骨（すねの骨） -->
        <path class="body-bone" d="M 110 57 L 110 195" />
        <text class="guide-text" x="80" y="145" text-anchor="end" font-size="9">すねの骨</text>
        <!-- 指4本分ガイド -->
        <line class="guide-line" x1="110" y1="57" x2="110" y2="115" />
        <line class="guide-line" x1="90" y1="115" x2="150" y2="115" />
        <path class="guide-arrow" d="M 140 62 L 140 110" />
        <polygon class="guide-arrow-head" points="140,113 136,105 144,105" />
        <rect class="guide-badge" x="145" y="78" width="56" height="18" />
        <text class="guide-subtext" x="173" y="91" text-anchor="middle">指4本分↓</text>
        <!-- ツボ点マーカー（すねの外側） -->
        <g class="point-marker">
          <circle class="point-pulse" cx="132" cy="115" r="10" />
          <circle class="main-dot" cx="132" cy="115" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【すねの外側】お皿の下から指4本分</text>
      </svg>`;
  } else if (code === 'ST40') {
    // 豊隆：膝と外くるぶしの中間・すね外側
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。すねの中央外側の図。">
        <title>${point.name}（豊隆）の位置目安</title>
        <!-- 脚全体シルエット -->
        <path class="body-outline" d="M 65 15 C 60 55 58 100 68 185 L 152 185 C 162 100 160 55 155 15 Z" />
        <!-- 膝蓋骨 -->
        <rect class="body-landmark" x="90" y="20" width="40" height="28" rx="8" />
        <!-- 外くるぶし -->
        <circle class="body-landmark" cx="145" cy="180" r="10" />
        <text class="guide-text" x="160" y="195" text-anchor="middle" font-size="8.5">外くるぶし</text>
        <!-- すねの骨 -->
        <path class="body-bone" d="M 110 48 L 110 180" />
        <!-- 高さの中央ガイド -->
        <line class="guide-line" x1="60" y1="105" x2="160" y2="105" />
        <rect class="guide-badge" x="15" y="96" width="54" height="18" />
        <text class="guide-subtext" x="42" y="109" text-anchor="middle">高さの中央</text>
        <!-- ツボ点マーカー -->
        <g class="point-marker">
          <circle class="point-pulse" cx="132" cy="105" r="10" />
          <circle class="main-dot" cx="132" cy="105" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【すねの外側】膝とくるぶしの真ん中</text>
      </svg>`;
  } else if (code === 'SP9') {
    // 陰陵泉：膝の内側・すねの骨の際
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。膝内側のくぼみの図。">
        <title>${point.name}（陰陵泉）の位置目安</title>
        <!-- 脚内側シルエット -->
        <path class="body-outline" d="M 60 15 C 60 40 70 70 72 100 C 74 130 70 160 70 195 L 150 195 C 150 160 148 120 155 70 C 160 40 160 15 160 15 Z" />
        <!-- 脛骨内側ライン -->
        <path class="body-bone" d="M 85 195 L 85 90 C 85 75 75 65 72 60" />
        <text class="guide-text" x="125" y="150" text-anchor="middle" font-size="9">すねの骨の内側</text>
        <!-- なで上げ矢印 -->
        <path class="guide-arrow" d="M 88 160 L 88 75" />
        <polygon class="guide-arrow-head" points="88,68 83,78 93,78" />
        <rect class="guide-badge" x="100" y="105" width="80" height="18" />
        <text class="guide-subtext" x="140" y="118" text-anchor="middle">なで上げる↑</text>
        <!-- ツボ点マーカー -->
        <g class="point-marker">
          <circle class="point-pulse" cx="80" cy="62" r="10" />
          <circle class="main-dot" cx="80" cy="62" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【膝の内側】骨の際に沿って指が止まる所</text>
      </svg>`;
  } else if (code === 'SP10') {
    // 血海：太もも内側
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。太もも内側の図。">
        <title>${point.name}（血海）の位置目安</title>
        <!-- 太もも〜膝シルエット -->
        <path class="body-outline" d="M 50 15 C 55 60 65 110 70 150 C 72 170 75 195 80 200 L 140 200 C 145 195 148 170 150 150 C 155 110 165 60 170 15 Z" />
        <!-- 膝蓋骨（膝のお皿） -->
        <rect class="body-landmark" x="88" y="150" width="44" height="35" rx="10" />
        <text class="guide-text" x="110" y="172" text-anchor="middle" font-size="9">膝のお皿</text>
        <!-- 指3本分ガイド -->
        <line class="guide-line" x1="72" y1="150" x2="148" y2="150" />
        <line class="guide-line" x1="72" y1="102" x2="148" y2="102" />
        <path class="guide-arrow" d="M 78 145 L 78 108" />
        <polygon class="guide-arrow-head" points="78,103 74,112 82,112" />
        <rect class="guide-badge" x="15" y="115" width="56" height="18" />
        <text class="guide-subtext" x="43" y="128" text-anchor="middle">指3本分↑</text>
        <!-- ツボ点マーカー -->
        <g class="point-marker">
          <circle class="point-pulse" cx="80" cy="102" r="10" />
          <circle class="main-dot" cx="80" cy="102" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【太もも内側】お皿の内側上端から指3本分</text>
      </svg>`;
  } else if (code === 'SP6') {
    // 三陰交：内くるぶしから指4本分上
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。足首の内側の図。">
        <title>${point.name}（三陰交）の位置目安</title>
        <!-- 足首内側〜足底シルエット -->
        <path class="body-outline" d="M 70 15 L 70 150 C 70 170 65 180 50 185 L 50 200 L 160 200 C 175 200 180 185 170 175 C 150 160 130 150 130 15 Z" />
        <!-- 内くるぶし -->
        <circle class="body-landmark" cx="92" cy="150" r="12" />
        <text class="guide-text" x="125" y="162" text-anchor="start" font-size="8.5">内くるぶし</text>
        <!-- すねの骨（脛骨） -->
        <path class="body-bone" d="M 80 15 L 80 145" />
        <!-- 指4本分ガイド -->
        <line class="guide-line" x1="50" y1="150" x2="135" y2="150" />
        <line class="guide-line" x1="50" y1="88" x2="135" y2="88" />
        <path class="guide-arrow" d="M 60 145 L 60 94" />
        <polygon class="guide-arrow-head" points="60,89 56,98 64,98" />
        <rect class="guide-badge" x="5" y="110" width="52" height="18" />
        <text class="guide-subtext" x="31" y="123" text-anchor="middle">指4本分↑</text>
        <!-- ツボ点マーカー -->
        <g class="point-marker">
          <circle class="point-pulse" cx="92" cy="88" r="10" />
          <circle class="main-dot" cx="92" cy="88" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【足首の内側】くるぶしの頂点から指4本分</text>
      </svg>`;
  } else if (code === 'KI3') {
    // 太渓：内くるぶしとアキレス腱の間
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。内くるぶしとアキレス腱の間の図。">
        <title>${point.name}（太渓）の位置目安</title>
        <!-- 足首拡大シルエット -->
        <path class="body-outline" d="M 60 15 L 60 130 C 60 165 45 175 35 185 L 35 200 L 175 200 C 190 200 195 185 180 170 C 160 150 140 130 140 15 Z" />
        <!-- 内くるぶし -->
        <circle class="body-landmark" cx="88" cy="115" r="15" />
        <text class="guide-text" x="65" y="90" text-anchor="middle" font-size="9">内くるぶし</text>
        <!-- アキレス腱 -->
        <path class="body-bone" d="M 132 15 L 132 170" stroke-width="2.5" />
        <text class="guide-text" x="165" y="90" text-anchor="middle" font-size="9">アキレス腱</text>
        <!-- くぼみ矢印 -->
        <path class="guide-arrow" d="M 88 115 L 105 115" />
        <path class="guide-arrow" d="M 132 115 L 115 115" />
        <!-- ツボ点マーカー -->
        <g class="point-marker">
          <circle class="point-pulse" cx="110" cy="115" r="10" />
          <circle class="main-dot" cx="110" cy="115" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【かかと内側】くるぶしとアキレス腱の間のくぼみ</text>
      </svg>`;
  } else if (code === 'KI6') {
    // 照海：内くるぶしの真下
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。内くるぶしの真下の図。">
        <title>${point.name}（照海）の位置目安</title>
        <!-- 足首拡大シルエット -->
        <path class="body-outline" d="M 60 15 L 60 130 C 60 165 45 175 35 185 L 35 200 L 175 200 C 190 200 195 185 180 170 C 160 150 140 130 140 15 Z" />
        <!-- 内くるぶし -->
        <circle class="body-landmark" cx="95" cy="100" r="16" />
        <text class="guide-text" x="95" y="76" text-anchor="middle" font-size="9">内くるぶし</text>
        <!-- 真下矢印ガイド -->
        <path class="guide-arrow" d="M 95 116 L 95 132" />
        <polygon class="guide-arrow-head" points="95,136 91,127 99,127" />
        <rect class="guide-badge" x="120" y="125" width="60" height="18" />
        <text class="guide-subtext" x="150" y="138" text-anchor="middle">真下の凹み</text>
        <!-- ツボ点マーカー -->
        <g class="point-marker">
          <circle class="point-pulse" cx="95" cy="140" r="10" />
          <circle class="main-dot" cx="95" cy="140" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【足首の内側】くるぶしの真下1指分の凹み</text>
      </svg>`;
  } else if (code === 'LR3') {
    // 太衝：足の甲・親指と人差し指の骨の間
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。足の甲の図。">
        <title>${point.name}（太衝）の位置目安</title>
        <!-- 足の甲上面シルエット -->
        <path class="body-outline" d="M 65 195 C 65 150 55 100 45 65 C 40 50 48 35 62 35 C 72 35 78 45 80 60 C 83 45 92 38 102 38 C 112 38 118 48 120 65 C 123 50 133 45 142 45 C 150 45 155 55 155 70 C 158 60 166 58 172 62 C 178 66 178 78 174 95 C 165 130 155 150 155 195 Z" />
        <!-- 指の爪 -->
        <ellipse class="body-landmark" cx="58" cy="45" rx="6" ry="5" />
        <ellipse class="body-landmark" cx="91" cy="48" rx="5" ry="5" />
        <!-- 中足骨（V字骨格） -->
        <path class="body-bone" d="M 65 75 L 98 145" />
        <path class="body-bone" d="M 98 78 L 108 145" />
        <text class="guide-text" x="150" y="130" text-anchor="middle" font-size="8.5">骨の合流部</text>
        <!-- V字ガイド矢印 -->
        <path class="guide-arrow" d="M 80 65 L 95 115" />
        <polygon class="guide-arrow-head" points="97,120 90,113 97,108" />
        <!-- ツボ点マーカー -->
        <g class="point-marker">
          <circle class="point-pulse" cx="98" cy="125" r="10" />
          <circle class="main-dot" cx="98" cy="125" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【足の甲】親指と人差し指の骨が交わる手前</text>
      </svg>`;
  } else if (code === 'LI4') {
    // 合谷：手の甲・人差し指の骨の際
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。手の甲の図。">
        <title>${point.name}（合谷）の位置目安</title>
        <!-- 手の甲シルエット -->
        <path class="body-outline" d="M 75 195 L 75 140 C 65 130 35 110 25 90 C 18 78 28 65 42 75 C 55 85 72 105 78 110 C 78 80 75 40 85 25 C 93 15 105 18 108 30 C 110 50 110 95 112 95 C 115 80 120 40 130 30 C 138 22 148 25 150 38 C 152 55 148 95 150 95 C 153 85 160 50 168 45 C 175 40 182 45 182 58 C 182 80 170 140 165 195 Z" />
        <!-- 親指・人差し指の中手骨 -->
        <path class="body-bone" d="M 45 82 L 95 145" />
        <path class="body-bone" d="M 98 40 L 115 145" stroke-width="2" />
        <text class="guide-text" x="155" y="110" text-anchor="middle" font-size="8.5">人差し指の骨</text>
        <!-- 押し込む矢印 -->
        <path class="guide-arrow" d="M 70 125 L 92 125" />
        <polygon class="guide-arrow-head" points="97,125 89,120 89,130" />
        <rect class="guide-badge" x="10" y="135" width="80" height="18" />
        <text class="guide-subtext" x="50" y="148" text-anchor="middle">骨の際へ押す</text>
        <!-- ツボ点マーカー -->
        <g class="point-marker">
          <circle class="point-pulse" cx="102" cy="125" r="10" />
          <circle class="main-dot" cx="102" cy="125" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【手の甲】親指と人差し指の間・骨の際</text>
      </svg>`;
  } else if (code === 'CV17') {
    // 膻中：胸の中央・左右乳頭の中間
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。胸の中央の図。">
        <title>${point.name}（膻中）の位置目安</title>
        <!-- 上半身・胸部シルエット -->
        <path class="body-outline" d="M 85 15 C 95 25 125 25 135 15 C 160 25 185 45 195 70 L 180 195 L 40 195 L 25 70 C 35 45 60 25 85 15 Z" />
        <!-- 鎖骨 -->
        <path class="body-sub-outline" d="M 45 42 Q 85 55 110 50 Q 135 55 175 42" />
        <!-- 左右の乳頭 -->
        <circle class="body-landmark" cx="68" cy="115" r="6" />
        <circle class="body-landmark" cx="152" cy="115" r="6" />
        <text class="guide-text" x="68" y="133" text-anchor="middle" font-size="8.5">乳頭</text>
        <text class="guide-text" x="152" y="133" text-anchor="middle" font-size="8.5">乳頭</text>
        <!-- 左右を結ぶ直線ガイド -->
        <line class="guide-line" x1="68" y1="115" x2="152" y2="115" />
        <!-- 身体中心線 -->
        <path class="body-bone" d="M 110 30 L 110 185" />
        <!-- ツボ点マーカー -->
        <g class="point-marker">
          <circle class="point-pulse" cx="110" cy="115" r="10" />
          <circle class="main-dot" cx="110" cy="115" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【胸の中央】左右の乳頭を結ぶ線の真ん中</text>
      </svg>`;
  } else if (code === 'CV12') {
    // 中脘：お腹の中央・みぞおちとおへそを結ぶ中間
    svgContent = `
      <svg class="body-diagram" viewBox="0 0 220 230" role="img" aria-label="${point.name}の位置の目安。お腹の中央の図。">
        <title>${point.name}（中脘）の位置目安</title>
        <!-- 腹部シルエット -->
        <path class="body-outline" d="M 45 15 L 175 15 L 180 150 C 180 185 155 195 110 195 C 65 195 40 185 40 150 Z" />
        <!-- 肋骨弓（みぞおちのV字） -->
        <path class="body-sub-outline" d="M 50 15 L 110 55 L 170 15" />
        <text class="guide-text" x="110" y="45" text-anchor="middle" font-size="8.5">みぞおち</text>
        <!-- おへそ -->
        <circle class="body-landmark" cx="110" cy="155" r="7" />
        <text class="guide-text" x="110" y="178" text-anchor="middle" font-size="8.5">おへそ</text>
        <!-- みぞおち〜へそ結ぶガイドライン -->
        <line class="guide-line" x1="110" y1="55" x2="110" y2="155" />
        <rect class="guide-badge" x="130" y="96" width="56" height="18" />
        <text class="guide-subtext" x="158" y="109" text-anchor="middle">ちょうど中間</text>
        <!-- ツボ点マーカー -->
        <g class="point-marker">
          <circle class="point-pulse" cx="110" cy="105" r="10" />
          <circle class="main-dot" cx="110" cy="105" r="7" />
        </g>
        <text class="diagram-label" x="110" y="218" text-anchor="middle">【お腹の中央】みぞおちとおへその中間</text>
      </svg>`;
  }

  return `
    <figure class="point-figure">
      ${svgContent}
      <figcaption>${point.name}<span>${point.code}</span></figcaption>
    </figure>`;
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
