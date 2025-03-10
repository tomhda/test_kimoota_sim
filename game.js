// ゲームの状態を管理するオブジェクト
const gameState = {
    // プレイヤーのステータス
    stats: {
        mental: 50,  // 精神力
        social: 20,  // 社会性
        otaku: 80,   // オタク度
        gadgets: []  // 所持ガジェット
    },
    
    // 現在のシーン
    currentScene: null,
    
    // フラグ管理
    flags: {
        metGirl: false,
        boughtFigure: false,
        visitedAkiba: false,
        triedDating: false,
        rejectedCount: 0,
        daysPassed: 0
    }
};

// ガジェットデータ
const gadgets = [
    {
        id: 'smartphone',
        name: '最新スマホ',
        description: '毎年買い替える最新モデル。実際には使いこなせていない。',
        image: 'images/gadget-smartphone.png'
    },
    {
        id: 'gaming-pc',
        name: 'ゲーミングPC',
        description: 'LEDが光りまくる自作PC。スペックは高いが主にアニメ視聴用。',
        image: 'images/gadget-pc.png'
    },
    {
        id: 'vr-headset',
        name: 'VRヘッドセット',
        description: '没入感抜群のVR機器。何に使っているかは言わないでおこう。',
        image: 'images/gadget-vr.png'
    },
    {
        id: 'camera',
        name: '一眼レフカメラ',
        description: '高級カメラ。フィギュア撮影とコスプレイヤー盗撮に使用。',
        image: 'images/gadget-camera.png'
    },
    {
        id: 'tablet',
        name: 'タブレット',
        description: 'ベッドでの漫画閲覧用。画面に不審な指紋が付いている。',
        image: 'images/gadget-tablet.png'
    },
    {
        id: 'smartwatch',
        name: 'スマートウォッチ',
        description: '健康管理用だが、運動はしていない。通知を見るだけ。',
        image: 'images/gadget-watch.png'
    },
    {
        id: 'drone',
        name: 'ドローン',
        description: '一度も飛ばしていない高級ドローン。部屋のオブジェと化している。',
        image: 'images/gadget-drone.png'
    },
    {
        id: 'figure',
        name: 'プレミアムフィギュア',
        description: '等身大の美少女フィギュア。毎晩「おやすみ」と話しかけている。',
        image: 'images/gadget-figure.png'
    },
    {
        id: 'dakimakura',
        name: '抱き枕',
        description: '二次元キャラの抱き枕。洗濯頻度は聞かないでほしい。',
        image: 'images/gadget-dakimakura.png'
    }
];

// シーンデータ
const scenes = {
    // 起床シーン
    'wake-up': {
        image: 'images/scene-room.jpg',
        text: '朝日が部屋に差し込む。散らかった部屋の中、積みあがったフィギュアやガジェットに囲まれて目を覚ました。今日も一日が始まる...',
        choices: [
            {
                text: 'SNSをチェックする',
                nextScene: 'check-sns',
                effect: () => {
                    updateStat('mental', -5);
                    updateStat('otaku', +3);
                    advanceTimePeriod();
                }
            },
            {
                text: '二度寝する',
                nextScene: 'sleep-again',
                effect: () => {
                    updateStat('mental', +5);
                    updateStat('social', -3);
                    advanceTimePeriod();
                }
            },
            {
                text: '朝食を食べに出かける',
                nextScene: 'go-breakfast',
                effect: () => {
                    updateStat('social', +5);
                    updateStat('mental', +3);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // SNSチェック
    'check-sns': {
        image: 'images/scene-sns.jpg',
        text: 'スマホを手に取り、SNSをチェックする。友達の投稿には楽しそうな日常や恋人との写真が並んでいる。自分の投稿へのいいねは0のまま。',
        choices: [
            {
                text: 'アニメの考察を投稿する',
                nextScene: 'post-anime',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '新しいガジェットの情報を探す',
                nextScene: 'search-gadget',
                effect: () => {
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'SNSを閉じて外出する',
                nextScene: 'go-outside',
                effect: () => {
                    updateStat('social', +5);
                    updateStat('mental', +3);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // アニメ考察投稿
    'post-anime': {
        image: 'images/scene-anime-post.jpg',
        text: '最新アニメの深い考察を5000文字の大作として投稿した。「これで注目されるはず...」と思ったが、1時間経っても反応はゼロ。',
        choices: [
            {
                text: 'アニメ関連のコミュニティで宣伝する',
                nextScene: 'promote-post',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('social', -5);
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: '諦めて秋葉原に出かける',
                nextScene: 'go-akiba',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', +5);
                    gameState.flags.visitedAkiba = true;
                    advanceTimePeriod();
                }
            },
            {
                text: '部屋でアニメを見続ける',
                nextScene: 'watch-anime',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 投稿宣伝
    'promote-post': {
        image: 'images/scene-community.jpg',
        text: 'アニメコミュニティで自分の投稿を宣伝したが、「キモい」「長すぎ」などの反応が返ってきた。一部では「こういうオタクが業界をダメにする」と炎上している。',
        choices: [
            {
                text: '反論コメントを書きまくる',
                nextScene: 'argue-online',
                effect: () => {
                    updateStat('mental', -20);
                    updateStat('social', -15);
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '黙って投稿を削除する',
                nextScene: 'delete-post',
                effect: () => {
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'ネットを離れて現実逃避する',
                nextScene: 'escape-reality',
                effect: () => {
                    updateStat('mental', +5);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // ネット論争
    'argue-online': {
        image: 'images/scene-keyboard-warrior.jpg',
        text: '深夜まで反論コメントを書き続けた。自分の知識の深さを示そうとするほど、「チー牛」「キモオタ」などの罵倒が増えていく。気づけば朝になっていた。',
        choices: [
            {
                text: '疲れ果てて眠る',
                nextScene: 'sleep-depressed',
                effect: () => {
                    updateStat('mental', -15);
                    advanceTimePeriod();
                }
            },
            {
                text: '新しいアカウントを作り直す',
                nextScene: 'new-account',
                effect: () => {
                    updateStat('mental', -5);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'ネットを断ち切って外出する',
                nextScene: 'go-outside-desperate',
                effect: () => {
                    updateStat('mental', +10);
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 秋葉原
    'go-akiba': {
        image: 'images/scene-akiba.jpg',
        text: '秋葉原に来た。アニメやゲームのポスターが街を彩り、同じような趣味を持つ人々が行き交っている。ここなら自分は浮かないはずだ。',
        choices: [
            {
                text: 'フィギュアショップに行く',
                nextScene: 'figure-shop',
                effect: () => {
                    updateStat('otaku', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'メイド喫茶に入る',
                nextScene: 'maid-cafe',
                effect: () => {
                    updateStat('social', +5);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '電気街でガジェットを物色する',
                nextScene: 'gadget-shopping',
                effect: () => {
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // フィギュアショップ
    'figure-shop': {
        image: 'images/scene-figure-shop.jpg',
        text: 'フィギュアショップに入った。新作の美少女フィギュアが目に入る。等身大で20万円。先月のボーナスがあるから買えないことはないが...',
        choices: [
            {
                text: '衝動買いする',
                nextScene: 'buy-figure',
                condition: () => !gameState.flags.boughtFigure,
                effect: () => {
                    updateStat('otaku', +20);
                    updateStat('mental', +10);
                    updateStat('social', -15);
                    gameState.flags.boughtFigure = true;
                    addGadget('figure');
                    advanceTimePeriod();
                }
            },
            {
                text: '写真だけ撮って帰る',
                nextScene: 'take-photo',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '店を出る',
                nextScene: 'leave-shop',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // フィギュア購入
    'buy-figure': {
        image: 'images/scene-figure-bought.jpg',
        text: '衝動的に等身大フィギュアを購入してしまった。店員からの「良い目を持ってますね」という言葉に複雑な気持ちになる。どうやって家まで運ぼう...',
        choices: [
            {
                text: '配送を頼む',
                nextScene: 'delivery-figure',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '自力で持ち帰る',
                nextScene: 'carry-figure',
                effect: () => {
                    updateStat('social', -10);
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // メイド喫茶
    'maid-cafe': {
        image: 'images/scene-maid-cafe.jpg',
        text: 'メイド喫茶に入った。「お帰りなさいませ、ご主人様♪」と元気な声で迎えられる。他の客は楽しそうに会話しているが、自分は何を話せばいいのかわからない。',
        choices: [
            {
                text: '無言でメニューを指さす',
                nextScene: 'silent-order',
                effect: () => {
                    updateStat('social', -10);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '会話を試みる',
                nextScene: 'try-conversation',
                effect: () => {
                    updateStat('social', +10);
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: '写真撮影オプションを頼む',
                nextScene: 'maid-photo',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 会話を試みる
    'try-conversation': {
        image: 'images/scene-maid-talk.jpg',
        text: 'メイドさんと会話を試みる。「あの、最近のアニメについてどう思いますか？」と聞くと、営業スマイルで「詳しくないんです〜」と返される。沈黙が流れる。',
        choices: [
            {
                text: 'アニメについて熱く語り始める',
                nextScene: 'anime-lecture',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('social', -20);
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: '黙って食事だけして帰る',
                nextScene: 'silent-meal',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '連絡先を聞いてみる',
                nextScene: 'ask-contact',
                effect: () => {
                    updateStat('social', -15);
                    updateStat('mental', -20);
                    gameState.flags.rejectedCount++;
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // アニメ講義
    'anime-lecture': {
        image: 'images/scene-anime-lecture.jpg',
        text: 'アニメについて熱く語り始めた。メイドさんは笑顔で頷いているが、明らかに引いている。周りの客から視線を感じる。店長が近づいてきた。',
        choices: [
            {
                text: '謝って店を出る',
                nextScene: 'leave-embarrassed',
                effect: () => {
                    updateStat('mental', -15);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: '勢いで追加注文する',
                nextScene: 'order-more',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '「オタクを差別するのか！」と声を上げる',
                nextScene: 'otaku-discrimination',
                effect: () => {
                    updateStat('mental', -25);
                    updateStat('social', -30);
                    gameState.flags.daysPassed++;
                }
            }
        ]
    },
    
    // ガジェットショッピング
    'gadget-shopping': {
        image: 'images/scene-gadget-shop.jpg',
        text: '電気街でガジェットを物色している。新型スマートウォッチが目に入る。すでに3つ持っているが、新しい機能が気になる...',
        choices: [
            {
                text: '衝動買いする',
                nextScene: 'buy-smartwatch',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', +5);
                    addGadget('smartwatch');
                    advanceTimePeriod();
                }
            },
            {
                text: 'ドローンを買う',
                nextScene: 'buy-drone',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('mental', +5);
                    addGadget('drone');
                    advanceTimePeriod();
                }
            },
            {
                text: '我慢して帰る',
                nextScene: 'resist-buying',
                effect: () => {
                    updateStat('mental', -5);
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 外出
    'go-outside': {
        image: 'images/scene-outside.jpg',
        text: '珍しく外出することにした。日差しが眩しい。どこに行こうか...',
        choices: [
            {
                text: '秋葉原に行く',
                nextScene: 'go-akiba',
                effect: () => {
                    updateStat('otaku', +5);
                    gameState.flags.visitedAkiba = true;
                    advanceTimePeriod();
                }
            },
            {
                text: 'カフェで読書する',
                nextScene: 'cafe-reading',
                effect: () => {
                    updateStat('social', +5);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '公園をぶらつく',
                nextScene: 'park-walking',
                effect: () => {
                    updateStat('mental', +10);
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 公園散歩
    'park-walking': {
        image: 'images/scene-park.jpg',
        text: '公園を歩いていると、ベンチで一人で本を読んでいる女性が目に入る。なんとなく自分と同じような雰囲気を感じる。',
        choices: [
            {
                text: '声をかけてみる',
                nextScene: 'talk-to-girl',
                effect: () => {
                    updateStat('social', +10);
                    updateStat('mental', -5);
                    gameState.flags.metGirl = true;
                    advanceTimePeriod();
                }
            },
            {
                text: '遠くから観察する',
                nextScene: 'observe-girl',
                effect: () => {
                    updateStat('social', -5);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '無視して歩き続ける',
                nextScene: 'ignore-girl',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 女性に話しかける
    'talk-to-girl': {
        image: 'images/scene-girl-talk.jpg',
        text: '勇気を出して声をかけた。「あの、何の本を読んでるんですか？」女性は少し驚いた様子だが、「ライトノベルです」と答えてくれた。',
        choices: [
            {
                text: 'アニメの話題を振る',
                nextScene: 'anime-talk-girl',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '普通に会話を続ける',
                nextScene: 'normal-conversation',
                effect: () => {
                    updateStat('social', +15);
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: '連絡先を聞く',
                nextScene: 'ask-girl-contact',
                effect: () => {
                    updateStat('social', -5);
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 普通の会話
    'normal-conversation': {
        image: 'images/scene-normal-talk.jpg',
        text: '意外にも会話が続いた。共通の趣味があることがわかり、楽しい時間を過ごせた。「また会えたらいいですね」と彼女は言ってくれた。',
        choices: [
            {
                text: '連絡先を交換する',
                nextScene: 'exchange-contact',
                effect: () => {
                    updateStat('social', +20);
                    updateStat('mental', +20);
                    gameState.flags.triedDating = true;
                    advanceTimePeriod();
                }
            },
            {
                text: '「次は映画でも行きませんか」と誘う',
                nextScene: 'ask-movie-date',
                effect: () => {
                    updateStat('social', +10);
                    updateStat('mental', +5);
                    gameState.flags.triedDating = true;
                    advanceTimePeriod();
                }
            },
            {
                text: '何も言えず別れる',
                nextScene: 'silent-goodbye',
                effect: () => {
                    updateStat('mental', -15);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 連絡先交換
    'exchange-contact': {
        image: 'images/scene-exchange-contact.jpg',
        text: '勇気を出して連絡先を交換した。彼女は「趣味の話、また聞かせてくださいね」と笑顔で言ってくれた。胸がドキドキする。',
        choices: [
            {
                text: 'その日のうちにメッセージを送る',
                nextScene: 'send-message',
                effect: () => {
                    updateStat('social', +5);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '数日待ってからメッセージを送る',
                nextScene: 'wait-message',
                effect: () => {
                    updateStat('social', +10);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '怖くなって連絡しない',
                nextScene: 'no-message',
                effect: () => {
                    updateStat('mental', -10);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // メッセージを送る
    'send-message': {
        image: 'images/scene-message.jpg',
        text: 'その日のうちにメッセージを送った。「今日は楽しかったです。また会いたいです。」送信後、既読マークがついたが返信はない。一時間...二時間...',
        choices: [
            {
                text: '追加メッセージを送る',
                nextScene: 'send-more-messages',
                effect: () => {
                    updateStat('social', -15);
                    updateStat('mental', -15);
                    gameState.flags.rejectedCount++;
                    advanceTimePeriod();
                }
            },
            {
                text: '気長に待つ',
                nextScene: 'wait-patiently',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'SNSで彼女を検索する',
                nextScene: 'search-sns',
                effect: () => {
                    updateStat('social', -10);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 気長に待つ
    'wait-patiently': {
        image: 'images/scene-waiting.jpg',
        text: '翌日、彼女から返信が来た。「こちらこそ楽しかったです。今度の週末、もし良ければカフェでも行きませんか？」',
        choices: [
            {
                text: '喜んで承諾する',
                nextScene: 'accept-date',
                effect: () => {
                    updateStat('social', +20);
                    updateStat('mental', +20);
                    advanceTimePeriod();
                }
            },
            {
                text: '緊張して返信できない',
                nextScene: 'too-nervous',
                effect: () => {
                    updateStat('mental', -15);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // デート承諾
    'accept-date': {
        image: 'images/scene-date-accept.jpg',
        text: 'デートの約束ができた！何を着ていこう？何を話そう？緊張と期待で眠れない夜を過ごした...',
        choices: [
            {
                text: 'オタク趣味を隠して普通に振る舞う',
                nextScene: 'hide-otaku',
                effect: () => {
                    updateStat('social', +10);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '素直に自分の趣味を話す',
                nextScene: 'honest-otaku',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // オタク隠し
    'hide-otaku': {
        image: 'images/scene-hide-otaku.jpg',
        text: 'デート当日、オタク趣味を隠して普通の話題だけで会話を続けようとした。しかし話題が続かず、気まずい沈黙が何度も訪れる...',
        choices: [
            {
                text: '無理して会話を続ける',
                nextScene: 'forced-conversation',
                effect: () => {
                    updateStat('mental', -15);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '正直に趣味を打ち明ける',
                nextScene: 'confess-otaku',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 正直に趣味を話す
    'honest-otaku': {
        image: 'images/scene-honest-otaku.jpg',
        text: 'デート中、素直に自分のアニメやゲームの趣味について話した。すると彼女も「実は私も好きなんです」と嬉しそうに応えてくれた。共通の話題で盛り上がる。',
        choices: [
            {
                text: '次のデートに誘う',
                nextScene: 'next-date',
                effect: () => {
                    updateStat('social', +20);
                    updateStat('mental', +20);
                    advanceTimePeriod();
                }
            },
            {
                text: '調子に乗ってマニアックな話をし過ぎる',
                nextScene: 'too-maniac',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('social', -10);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 次のデート
    'next-date': {
        image: 'images/scene-next-date.jpg',
        text: '何度かデートを重ね、お互いの趣味や価値観が合うことがわかってきた。彼女は「あなたと一緒にいると楽しい」と言ってくれる。',
        choices: [
            {
                text: '告白する',
                nextScene: 'confession',
                effect: () => {
                    updateStat('social', +20);
                    updateStat('mental', +20);
                    advanceTimePeriod();
                }
            },
            {
                text: 'もう少し様子を見る',
                nextScene: 'wait-more',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 告白
    'confession': {
        image: 'images/scene-confession.jpg',
        text: '勇気を出して告白した。「好きです。付き合ってください。」彼女は少し驚いた表情をしたあと、優しく微笑んだ。',
        choices: [
            {
                text: '結果を待つ',
                nextScene: 'confession-result',
                effect: () => {
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 告白結果
    'confession-result': {
        image: 'images/scene-confession-result.jpg',
        text: '「私も好きです。付き合いましょう。」彼女の言葉に、心臓が高鳴る。32年間の孤独が報われた瞬間だった。',
        choices: [
            {
                text: '幸せな日々を過ごす',
                nextScene: 'happy-ending',
                effect: () => {
                    updateStat('mental', +50);
                    updateStat('social', +50);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 朝食
    'go-breakfast': {
        image: 'images/scene-breakfast.jpg',
        text: '近所の定食屋で朝食を食べることにした。店員さんから「いつもありがとうございます」と言われるが、会話はそれだけ。隣のテーブルでは友人同士が楽しそうに話している。',
        choices: [
            {
                text: '黙々と食事する',
                nextScene: 'silent-breakfast',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '店員さんと会話を試みる',
                nextScene: 'talk-to-staff',
                effect: () => {
                    updateStat('social', +5);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'スマホでSNSを見ながら食べる',
                nextScene: 'check-sns',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 朝食（黙々）
    'silent-breakfast': {
        image: 'images/scene-silent-breakfast.jpg',
        text: '黙々と朝食を食べる。静かな時間が過ぎていく。他のことを考えながら自動的に箸を動かす。',
        choices: [
            {
                text: '食べ終わって出かける',
                nextScene: 'go-outside',
                effect: () => {
                    updateStat('mental', +3);
                    advanceTimePeriod();
                }
            },
            {
                text: '帰って部屋に引きこもる',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', -5);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 部屋に引きこもる
    'back-to-room': {
        image: 'images/scene-room.jpg',
        text: '結局部屋に戻ってきてしまった。外の世界は疲れる。ここが一番落ち着く。',
        choices: [
            {
                text: 'ゲームをする',
                nextScene: 'play-game',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'SNSをチェックする',
                nextScene: 'check-sns',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '昼寝する',
                nextScene: 'nap',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // ゲームプレイ
    'play-game': {
        image: 'images/scene-gaming.jpg',
        text: 'オンラインゲームを起動する。いつものギルドメンバーが「おはよう」と挨拶してくれる。ここでは自分は重要な存在だ。',
        choices: [
            {
                text: '一日中ゲームをする',
                nextScene: 'game-all-day',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('mental', +10);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: '少しだけプレイする',
                nextScene: 'game-short',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 昼寝
    'nap': {
        image: 'images/scene-sleep-again.jpg',
        text: 'ベッドに潜り込み、目を閉じる。外の世界と向き合うことから一時的に解放される。',
        choices: [
            {
                text: '夕方まで寝てしまう',
                nextScene: 'wake-up-evening',
                effect: () => {
                    updateStat('mental', +15);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '短い昼寝の後、起きる',
                nextScene: 'wake-up-afternoon',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 夕方に起きる
    'wake-up-evening': {
        image: 'images/scene-room.jpg',
        text: '気づけば外は暗くなりつつあった。昼間の時間を完全に無駄にしてしまった。',
        choices: [
            {
                text: '外食に出かける',
                nextScene: 'go-dinner',
                effect: () => {
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'カップ麺で済ます',
                nextScene: 'cup-noodle',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'オンラインゲームをする',
                nextScene: 'play-game',
                effect: () => {
                    updateStat('otaku', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 写真撮影
    'take-photo': {
        image: 'images/scene-take-photo.jpg',
        text: 'フィギュアの写真を撮る。「購入するかもしれないから」と言い訳しながら、何枚も撮影する。店員の視線が痛い。',
        choices: [
            {
                text: '他の店も見て回る',
                nextScene: 'go-akiba',
                effect: () => {
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '秋葉原を後にする',
                nextScene: 'leave-akiba',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 秋葉原を出る
    'leave-shop': {
        image: 'images/scene-akiba.jpg',
        text: 'お金を使わずに済んだことに少し安心しながら、店を出る。',
        choices: [
            {
                text: '他のショップを見て回る',
                nextScene: 'go-akiba',
                effect: () => {
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '秋葉原を後にする',
                nextScene: 'leave-akiba',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 秋葉原を後にする
    'leave-akiba': {
        image: 'images/scene-outside.jpg',
        text: '秋葉原を後にする。オタク趣味に溢れた街での時間は楽しかったが、同時に疲れも感じる。',
        choices: [
            {
                text: '家に帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'カフェで一息つく',
                nextScene: 'cafe-reading',
                effect: () => {
                    updateStat('mental', +10);
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 朝食（会話）
    'talk-to-staff': {
        image: 'images/scene-talk-staff.jpg',
        text: '店員さんと会話を試みる。「今日は暖かいですね」と声をかけると、忙しなさそうに「そうですね」と返される。それ以上の会話は続かなかった。',
        choices: [
            {
                text: '黙って食事を続ける',
                nextScene: 'silent-breakfast',
                effect: () => {
                    updateStat('mental', -3);
                    advanceTimePeriod();
                }
            },
            {
                text: '早めに店を出る',
                nextScene: 'go-outside',
                effect: () => {
                    updateStat('social', -3);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 二度寝
    'sleep-again': {
        image: 'images/scene-sleep-again.jpg',
        text: '「今日は何もする気が起きない...」そう思って二度寝した。気づけば日が暮れていた。また一日を無駄にしてしまった。',
        choices: [
            {
                text: '夜更かしして動画を見る',
                nextScene: 'night-videos',
                effect: () => {
                    updateStat('mental', -5);
                    updateStat('social', -5);
                    // 時間を進める
                    advanceTimePeriod();
                }
            },
            {
                text: '深夜アニメを見る',
                nextScene: 'night-anime',
                effect: () => {
                    updateStat('otaku', +10);
                    // 時間を進める
                    advanceTimePeriod();
                }
            },
            {
                text: '明日こそは頑張ろうと決意して寝る',
                nextScene: 'wake-up',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },
    
    // 深夜アニメ
    'night-anime': {
        image: 'images/scene-night-anime.jpg',
        text: '深夜アニメを見ながら、SNSで実況コメントを投稿する。「この作画すごい」「このキャラかわいい」などのコメントにも反応はほとんどない。',
        choices: [
            {
                text: 'アニメグッズを衝動買いする',
                nextScene: 'impulse-buy',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('mental', +5);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '寝る',
                nextScene: 'wake-up',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // アニメ視聴
    'watch-anime': {
        image: 'images/scene-night-anime.jpg',
        text: '部屋にこもってアニメを見続ける。気づけば外は暗くなっていた。今日もまた一日が終わる...',
        choices: [
            {
                text: '夜更かしして続きを見る',
                nextScene: 'night-anime',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '寝る',
                nextScene: 'wake-up',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 一日中ゲーム
    'game-all-day': {
        image: 'images/scene-gaming.jpg',
        text: '気づけば外は暗くなっていた。ゲームに没頭するあまり、食事も取らずに一日が過ぎてしまった。しかし、ギルドからの感謝と新装備の達成感が心地よい。',
        choices: [
            {
                text: '夜食を食べる',
                nextScene: 'late-night-meal',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '夜も続けてプレイする',
                nextScene: 'game-all-night',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', -5);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '寝る',
                nextScene: 'wake-up',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 短時間ゲーム
    'game-short': {
        image: 'images/scene-gaming.jpg',
        text: '適度な時間でゲームを切り上げた。程よい達成感と満足感がある。',
        choices: [
            {
                text: '外出する',
                nextScene: 'go-outside',
                effect: () => {
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '別の趣味に時間を使う',
                nextScene: 'other-hobby',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 昼下がりの起床
    'wake-up-afternoon': {
        image: 'images/scene-room.jpg',
        text: '短い昼寝から目覚めた。少し元気が出てきた気がする。まだ日は高い。',
        choices: [
            {
                text: '外出する',
                nextScene: 'go-outside',
                effect: () => {
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '部屋で過ごす',
                nextScene: 'stay-room',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 部屋で過ごす
    'stay-room': {
        image: 'images/scene-room.jpg',
        text: '部屋で過ごすことにした。静かな時間が流れる。',
        choices: [
            {
                text: 'アニメを見る',
                nextScene: 'watch-anime',
                effect: () => {
                    updateStat('otaku', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'ネットサーフィンする',
                nextScene: 'internet-surfing',
                effect: () => {
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'ガジェットをいじる',
                nextScene: 'play-with-gadgets',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // カフェ読書
    'cafe-reading': {
        image: 'images/scene-cafe.jpg',
        text: 'カフェでゆっくりと読書する。周りには様々な人がいるが、皆それぞれの時間を過ごしている。',
        choices: [
            {
                text: '長居して読書を続ける',
                nextScene: 'long-reading',
                effect: () => {
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            },
            {
                text: '少し読んだら帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '隣の席の人と会話してみる',
                nextScene: 'talk-to-stranger',
                effect: () => {
                    updateStat('social', +10);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 衝動買い
    'impulse-buy': {
        image: 'images/scene-online-shopping.jpg',
        text: 'オンラインショップで新作アニメグッズを衝動買いしてしまった。来月の生活費が心配だが、推しキャラのグッズを手に入れる喜びの方が大きい。',
        choices: [
            {
                text: '寝る',
                nextScene: 'wake-up',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'さらに別のグッズも買う',
                nextScene: 'more-shopping',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 投稿削除
    'delete-post': {
        image: 'images/scene-deleted-post.jpg',
        text: '何も言わず黙って投稿を削除した。心の傷が少し癒える気がするが、時間の無駄だった気もする。',
        choices: [
            {
                text: '部屋に引きこもる',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '外出する',
                nextScene: 'go-outside',
                effect: () => {
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 現実逃避
    'escape-reality': {
        image: 'images/scene-room.jpg',
        text: 'ネットでの嫌な出来事から逃れるため、スマホを置いて現実逃避することにした。しばらく何も考えずに過ごす。',
        choices: [
            {
                text: '昼寝する',
                nextScene: 'nap',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'フィギュアコレクションを眺める',
                nextScene: 'look-at-figures',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // カップ麺
    'cup-noodle': {
        image: 'images/scene-cup-noodle.jpg',
        text: 'カップ麺をレンジでチンして食べる。簡単だが、栄養バランスは最悪だ。これで何日目だろう？',
        choices: [
            {
                text: '食べ終わってゲームをする',
                nextScene: 'play-game',
                effect: () => {
                    updateStat('mental', -5);
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '食べ終わってアニメを見る',
                nextScene: 'watch-anime',
                effect: () => {
                    updateStat('otaku', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 外食
    'go-dinner': {
        image: 'images/scene-dinner.jpg',
        text: '近所の定食屋に夕食を食べに出かけた。一人でも入りやすい店だが、周りはサラリーマンのグループばかりだ。',
        choices: [
            {
                text: '黙々と食事する',
                nextScene: 'silent-dinner',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'スマホでSNSを見ながら食べる',
                nextScene: 'dinner-sns',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 静かな夕食
    'silent-dinner': {
        image: 'images/scene-silent-dinner.jpg',
        text: '一人で黙々と夕食を食べる。周りの会話の声が耳に入るが、自分は参加できない。',
        choices: [
            {
                text: '食べ終わって帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '食後に少し散歩する',
                nextScene: 'night-walk',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // フィギュア配送
    'delivery-figure': {
        image: 'images/scene-figure-delivery.jpg',
        text: 'フィギュアの配送を頼んだ。「明日の午後には届きますよ」と店員に言われる。待ち遠しい気持ちと「何をしてるんだろう」という自己嫌悪が入り混じる。',
        choices: [
            {
                text: '他の店を見て回る',
                nextScene: 'go-akiba',
                effect: () => {
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '家に帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // フィギュア自力運搬
    'carry-figure': {
        image: 'images/scene-carry-figure.jpg',
        text: '大きな箱を抱えて電車に乗り込む。周囲の視線が痛い。「中身はきっとバレてる...」',
        choices: [
            {
                text: 'なんとか家まで運ぶ',
                nextScene: 'home-with-figure',
                effect: () => {
                    updateStat('mental', -10);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 夜の散歩
    'night-walk': {
        image: 'images/scene-night-walk.jpg',
        text: '夜の街を一人で歩く。人々の楽しげな声が聞こえる中、自分だけが浮いている気がする。',
        choices: [
            {
                text: '公園のベンチで休む',
                nextScene: 'night-park',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: '家に帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 夜の公園
    'night-park': {
        image: 'images/scene-night-park.jpg',
        text: '夜の公園のベンチに座る。静かな環境で少し心が落ち着く。星空を見上げると、なぜか少し寂しさが和らぐ。',
        choices: [
            {
                text: '深呼吸して帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            },
            {
                text: 'もう少し座っている',
                nextScene: 'long-night-park',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 追加買い物
    'more-shopping': {
        image: 'images/scene-more-shopping.jpg',
        text: '勢いに任せて、さらに別のグッズも購入してしまった。クレジットカードの請求が怖いが、今は幸せな気分だ。',
        choices: [
            {
                text: '満足して寝る',
                nextScene: 'wake-up',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'さらに別のサイトも見る',
                nextScene: 'shopping-addict',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('mental', -15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 買い物依存
    'shopping-addict': {
        image: 'images/scene-shopping-addict.jpg',
        text: '気づけば朝になっていた。一晩中オタクグッズを買い漁ってしまった。部屋にはもう置く場所がない。',
        choices: [
            {
                text: '後悔して眠る',
                nextScene: 'sleep-depressed',
                effect: () => {
                    updateStat('mental', -20);
                    updateStat('otaku', +20);
                    advanceTimePeriod();
                }
            },
            {
                text: '満足感に浸る',
                nextScene: 'satisfied-otaku',
                effect: () => {
                    updateStat('otaku', +25);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 満足したオタク
    'satisfied-otaku': {
        image: 'images/scene-satisfied-otaku.jpg',
        text: '新しいグッズに囲まれて幸福感に浸る。これが自分の生きる意味なのかもしれない。',
        choices: [
            {
                text: 'SNSにコレクション写真を投稿する',
                nextScene: 'post-collection',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '眠る',
                nextScene: 'wake-up',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 夜の動画
    'night-videos': {
        image: 'images/scene-night-videos.jpg',
        text: '夜更かしして動画を見続ける。次から次へと自動再生される動画に時間を奪われる。',
        choices: [
            {
                text: '朝まで見続ける',
                nextScene: 'all-night-videos',
                effect: () => {
                    updateStat('mental', -15);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '限界になって寝る',
                nextScene: 'wake-up',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 徹夜で動画視聴
    'all-night-videos': {
        image: 'images/scene-all-night-videos.jpg',
        text: '気づけば朝日が昇っていた。一晩中動画を見ていたせいで、目は充血し、頭はぼんやりしている。',
        choices: [
            {
                text: '昼まで寝る',
                nextScene: 'wake-up-noon',
                effect: () => {
                    updateStat('mental', -10);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '眠気を我慢して起きる',
                nextScene: 'stay-awake',
                effect: () => {
                    updateStat('mental', -20);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // フィギュアを見る
    'look-at-figures': {
        image: 'images/scene-figure-collection.jpg',
        text: '自慢のフィギュアコレクションを眺める。埃を拭き、少し配置を変えてみる。これだけは自信を持てる趣味だ。',
        choices: [
            {
                text: '満足して休む',
                nextScene: 'nap',
                effect: () => {
                    updateStat('mental', +15);
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'さらに新しいフィギュアを物色する',
                nextScene: 'search-new-figures',
                effect: () => {
                    updateStat('otaku', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 無限ゲーム
    'game-all-night': {
        image: 'images/scene-game-all-night.jpg',
        text: '夜通しゲームを続けた。ギルドメンバーからは「無職？」とからかわれるが、気にしない。朝日が昇り始めている。',
        choices: [
            {
                text: '疲れ果てて寝る',
                nextScene: 'sleep-depressed',
                effect: () => {
                    updateStat('mental', -15);
                    updateStat('otaku', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'さらにゲームを続ける',
                nextScene: 'game-addiction',
                effect: () => {
                    updateStat('otaku', +20);
                    updateStat('mental', -10);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // ゲーム依存
    'game-addiction': {
        image: 'images/scene-game-addiction.jpg',
        text: '気づけば丸一日ゲームをしていた。食事も取らず、トイレ以外は席を立っていない。しかし、ゲーム内では英雄として崇められている。',
        choices: [
            {
                text: '現実に戻る',
                nextScene: 'back-to-reality',
                effect: () => {
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'さらにランクを上げるため続ける',
                nextScene: 'rank-up',
                effect: () => {
                    updateStat('otaku', +25);
                    updateStat('mental', -15);
                    updateStat('social', -15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 長い読書
    'long-reading': {
        image: 'images/scene-long-reading.jpg',
        text: 'カフェで何時間も読書を続けた。静かな環境と適度な騒音が心地よい。久しぶりに落ち着いた時間を過ごせた。',
        choices: [
            {
                text: '満足して帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            },
            {
                text: '閉店まで粘る',
                nextScene: 'stay-until-close',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 見知らぬ人と会話
    'talk-to-stranger': {
        image: 'images/scene-cafe-talk.jpg',
        text: '勇気を出して隣の席の人に話しかけてみた。「その本、面白いですか？」相手は少し驚いた様子だが、丁寧に応えてくれる。',
        choices: [
            {
                text: '会話を続ける',
                nextScene: 'continue-talk',
                effect: () => {
                    updateStat('social', +15);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '短い会話で終える',
                nextScene: 'end-talk',
                effect: () => {
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 短い会話で終える
    'end-talk': {
        image: 'images/scene-cafe.jpg',
        text: '短い会話を終え、自分の飲み物に戻る。少しだけ社交的になれた気がする。',
        choices: [
            {
                text: '読書を続ける',
                nextScene: 'long-reading',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'カフェを出る',
                nextScene: 'leave-cafe',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // カフェを出る
    'leave-cafe': {
        image: 'images/scene-outside.jpg',
        text: 'カフェを出て外の空気を吸う。少しの時間だが、人と話せたことに小さな満足感がある。',
        choices: [
            {
                text: '家に帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '公園を散歩する',
                nextScene: 'park-walking',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 会話を続ける
    'continue-talk': {
        image: 'images/scene-cafe-talk-long.jpg',
        text: '意外にも会話が続いた。相手は話しやすい人で、本の話題から映画、音楽と話は広がっていく。',
        choices: [
            {
                text: 'アニメの話題を出してみる',
                nextScene: 'mention-anime',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '連絡先を交換する',
                nextScene: 'exchange-contact-stranger',
                effect: () => {
                    updateStat('social', +15);
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: '会話を終える',
                nextScene: 'end-long-talk',
                effect: () => {
                    updateStat('social', +10);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // メイドサービス
    'maid-photo': {
        image: 'images/scene-maid-photo.jpg',
        text: 'メイドさんとの写真撮影を頼んだ。「ご主人様、チーズですよ〜♪」とポーズをとってくれる。なんだかむず痒い気持ちになる。',
        choices: [
            {
                text: '写真を撮って満足する',
                nextScene: 'satisfied-photo',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '恥ずかしくなって中止する',
                nextScene: 'cancel-photo',
                effect: () => {
                    updateStat('mental', -10);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // スマホでSNSを見ながら食事
    'dinner-sns': {
        image: 'images/scene-dinner-sns.jpg',
        text: '夕食を食べながらSNSをチェックする。周りは会話を楽しむ人たちだが、自分は画面の中の世界に浸る。',
        choices: [
            {
                text: '食べ終わって帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '少し散歩してから帰る',
                nextScene: 'night-walk',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 新しいフィギュアを探す
    'search-new-figures': {
        image: 'images/scene-online-shopping.jpg',
        text: 'オンラインショップで新しいフィギュアを探す。限定版の予約が始まったばかりのものを見つけた。',
        choices: [
            {
                text: '予約する',
                nextScene: 'preorder-figure',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '我慢する',
                nextScene: 'resist-figure',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // フィギュアを家まで運ぶ
    'home-with-figure': {
        image: 'images/scene-figure-room.jpg',
        text: 'なんとか等身大フィギュアを家まで運び込んだ。汗だくになりながら箱を開け、フィギュアを部屋の一等地に設置する。',
        choices: [
            {
                text: '完成した部屋を眺める',
                nextScene: 'admire-room',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: '疲れて横になる',
                nextScene: 'rest-tired',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 部屋を眺める
    'admire-room': {
        image: 'images/scene-room-figure.jpg',
        text: '等身大フィギュアが加わって完璧になった部屋を満足気に眺める。これぞ理想の空間だ。',
        choices: [
            {
                text: 'SNSにコレクション写真を投稿する',
                nextScene: 'post-collection',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '次の買い物を計画する',
                nextScene: 'plan-next-purchase',
                effect: () => {
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 静かな食事
    'silent-meal': {
        image: 'images/scene-maid-cafe-meal.jpg',
        text: '黙々と食事をする。メイドさんは時々「おいしいですか？」と声をかけてくれるが、最小限の返事だけで済ませる。',
        choices: [
            {
                text: '食べ終わって店を出る',
                nextScene: 'leave-maid-cafe',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'デザートも頼む',
                nextScene: 'order-dessert',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 恥ずかしい思い
    'leave-embarrassed': {
        image: 'images/scene-leave-embarrassed.jpg',
        text: '「すみません、失礼しました」と小さな声で謝り、急いで店を出る。顔が熱い。二度とこの店には来れない。',
        choices: [
            {
                text: '部屋に帰って引きこもる',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', -10);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: '気を取り直して秋葉原を歩く',
                nextScene: 'go-akiba',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // メイド喫茶での注文追加
    'order-more': {
        image: 'images/scene-maid-cafe-order.jpg',
        text: '気まずい雰囲気を紛らわすため、勢いでケーキセットを追加注文する。「かしこまりました、ご主人様♪」',
        choices: [
            {
                text: '黙って食べる',
                nextScene: 'silent-meal',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '店を出る',
                nextScene: 'leave-maid-cafe',
                effect: () => {
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // ガチャガチャを引く
    'play-gacha': {
        image: 'images/scene-gacha.jpg',
        text: '秋葉原の路上でガチャガチャを発見。限定フィギュアが出るらしい。一回500円。',
        choices: [
            {
                text: '一回だけ引く',
                nextScene: 'gacha-once',
                effect: () => {
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '全種類揃えるまで引く',
                nextScene: 'gacha-complete',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '無視して通り過ぎる',
                nextScene: 'ignore-gacha',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // メイド喫茶を出る
    'leave-maid-cafe': {
        image: 'images/scene-outside.jpg',
        text: 'メイド喫茶から出る。「いってらっしゃいませ、ご主人様♪」という声を背に、現実世界に戻る感覚。',
        choices: [
            {
                text: '秋葉原で買い物を続ける',
                nextScene: 'go-akiba',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '家に帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 無言注文
    'silent-order': {
        image: 'images/scene-maid-cafe-order.jpg',
        text: '言葉が出てこないので、メニューを指差して注文する。メイドさんは「かしこまりました〜♪」と明るく応えてくれるが、心の中では引いているだろう。',
        choices: [
            {
                text: '黙々と食事する',
                nextScene: 'silent-meal',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '早めに店を出る',
                nextScene: 'leave-maid-cafe',
                effect: () => {
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // メイド写真満足
    'satisfied-photo': {
        image: 'images/scene-maid-photo-done.jpg',
        text: 'メイドさんとの写真撮影を終え、ちょっと恥ずかしいがまんざらでもない気持ち。この写真は家宝になるだろう。',
        choices: [
            {
                text: '食事を注文する',
                nextScene: 'order-maid-food',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '満足して店を出る',
                nextScene: 'leave-maid-cafe',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // メイド写真中止
    'cancel-photo': {
        image: 'images/scene-maid-cafe.jpg',
        text: '途中で恥ずかしくなって写真撮影を中止した。メイドさんは「大丈夫ですよ〜」と言ってくれるが、顔から火が出そうな気分。',
        choices: [
            {
                text: '黙々と食事だけする',
                nextScene: 'silent-meal',
                effect: () => {
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: '早めに店を出る',
                nextScene: 'leave-maid-cafe',
                effect: () => {
                    updateStat('mental', -15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 疲れて横になる
    'rest-tired': {
        image: 'images/scene-sleep-again.jpg',
        text: 'フィギュアを運ぶのに疲れ果てて、ベッドに横になる。隣には新しい同居人。「これからよろしくね」と思わず話しかける。',
        choices: [
            {
                text: '昼寝する',
                nextScene: 'nap',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'SNSに写真を投稿する',
                nextScene: 'post-collection',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // オタク差別
    'otaku-discrimination': {
        image: 'images/scene-otaku-discrimination.jpg',
        text: '「オタクを差別するのか！俺たちにだって権利がある！」と声を上げてしまった。店内が静まり返る。メイドさんは困惑し、店長が近づいてくる。',
        choices: [
            {
                text: '謝って店を出る',
                nextScene: 'apologize-leave',
                effect: () => {
                    updateStat('mental', -20);
                    updateStat('social', -20);
                    advanceTimePeriod();
                }
            },
            {
                text: '逃げるように店を出る',
                nextScene: 'escape-maid-cafe',
                effect: () => {
                    updateStat('mental', -25);
                    updateStat('social', -25);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // メイドにリンク聞く
    'ask-contact': {
        image: 'images/scene-ask-maid-contact.jpg',
        text: '勇気を振り絞って「もし良ければ、連絡先を...」と言ってしまった。メイドさんは困った表情で「申し訳ありませんが、それはお店のルールで...」',
        choices: [
            {
                text: '「ごめんなさい」と謝る',
                nextScene: 'apologize-contact',
                effect: () => {
                    updateStat('mental', -15);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: '黙って会計を済ませる',
                nextScene: 'leave-maid-cafe',
                effect: () => {
                    updateStat('mental', -20);
                    updateStat('social', -15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // メイド料理注文
    'order-maid-food': {
        image: 'images/scene-maid-cafe-food.jpg',
        text: 'オムライスを注文した。メイドさんがケチャップでかわいいイラストを描いてくれる。こういうサービスのために来るんだよな...',
        choices: [
            {
                text: '写真を撮ってから食べる',
                nextScene: 'food-photo',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '黙々と食べる',
                nextScene: 'silent-meal',
                effect: () => {
                    updateStat('mental', +3);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 逃げるように店を出る
    'escape-maid-cafe': {
        image: 'images/scene-run-away.jpg',
        text: '恥ずかしさのあまり、会計も済ませずに逃げるように店を出てしまった。後ろから「お客様！」と呼ぶ声が聞こえる。二度とこの街には来れない。',
        choices: [
            {
                text: '家に帰って引きこもる',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', -30);
                    updateStat('social', -30);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 謝って店を出る
    'apologize-leave': {
        image: 'images/scene-apologize.jpg',
        text: '「すみませんでした...」と小さな声で謝り、会計を済ませて店を出る。恥ずかしさで地面に穴があれば入りたい気分。',
        choices: [
            {
                text: '家に帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', -20);
                    updateStat('social', -15);
                    advanceTimePeriod();
                }
            },
            {
                text: '気を取り直して秋葉原を歩く',
                nextScene: 'go-akiba',
                effect: () => {
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // その他の趣味
    'other-hobby': {
        image: 'images/scene-room.jpg',
        text: 'ゲーム以外の趣味に時間を使うことにした。何をしよう？',
        choices: [
            {
                text: 'フィギュアの手入れをする',
                nextScene: 'clean-figures',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '漫画を読む',
                nextScene: 'read-manga',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'プログラミングの勉強をする',
                nextScene: 'study-programming',
                effect: () => {
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // フィギュアの手入れ
    'clean-figures': {
        image: 'images/scene-figure-collection.jpg',
        text: '丁寧にフィギュアのホコリを払い、配置を調整する。これらの美少女たちだけは大切にしている。',
        choices: [
            {
                text: '満足して休む',
                nextScene: 'nap',
                effect: () => {
                    updateStat('mental', +10);
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'SNSにコレクション写真を投稿する',
                nextScene: 'post-collection',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // コレクション投稿
    'post-collection': {
        image: 'images/scene-sns.jpg',
        text: 'コレクションの写真をSNSに投稿した。「推し」とのツーショット写真も思い切って載せてみる。数分後、いいねが一つついた。',
        choices: [
            {
                text: '喜ぶ',
                nextScene: 'happy-with-like',
                effect: () => {
                    updateStat('mental', +10);
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'さらに写真を追加する',
                nextScene: 'post-more-photos',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // いいねに喜ぶ
    'happy-with-like': {
        image: 'images/scene-happy.jpg',
        text: 'たった一つのいいねでも嬉しい。誰かが自分の趣味を認めてくれたようで、少し心が温かくなる。',
        choices: [
            {
                text: '他の投稿も見る',
                nextScene: 'check-sns',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '満足して寝る',
                nextScene: 'sleep-satisfied',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // さらに写真を投稿
    'post-more-photos': {
        image: 'images/scene-sns.jpg',
        text: 'いいねが付いた勢いに乗って、さらに何枚もコレクション写真を投稿した。レアなフィギュアや特別なポーズの写真まで...',
        choices: [
            {
                text: '反応を待つ',
                nextScene: 'wait-for-reactions',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '疲れて寝る',
                nextScene: 'sleep-satisfied',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 反応待ち
    'wait-for-reactions': {
        image: 'images/scene-waiting.jpg',
        text: '写真への反応を待つ。1時間経っても特に反応はない。いつものことだが、少し寂しい気持ちになる。',
        choices: [
            {
                text: 'もっと目立つ写真を投稿する',
                nextScene: 'post-extreme-photo',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('social', -10);
                    advanceTimePeriod();
                }
            },
            {
                text: '諦めて寝る',
                nextScene: 'sleep-depressed',
                effect: () => {
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 満足して眠る
    'sleep-satisfied': {
        image: 'images/scene-sleep-again.jpg',
        text: '今日は悪くない一日だった。そんな気持ちで布団に入る。心地よい疲れと共に、すんなりと眠りにつくことができた。',
        choices: [
            {
                text: '次の日の朝を迎える',
                nextScene: 'wake-up',
                effect: () => {
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 漫画を読む
    'read-manga': {
        image: 'images/scene-reading.jpg',
        text: 'ベッドで横になりながら漫画を読む。現実世界の憂鬱を忘れて、物語の世界に没頭する。あっという間に数時間が過ぎていった。',
        choices: [
            {
                text: '続きを読む',
                nextScene: 'read-more-manga',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '感想をSNSに投稿する',
                nextScene: 'post-manga-review',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '寝る',
                nextScene: 'sleep-satisfied',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // プログラミング勉強
    'study-programming': {
        image: 'images/scene-programming.jpg',
        text: 'プログラミングの勉強をすることにした。オンライン講座を見ながらコードを書いてみる。思ったより楽しい。何か作れるようになれば、生活が変わるかもしれない。',
        choices: [
            {
                text: '真剣に取り組む',
                nextScene: 'serious-programming',
                effect: () => {
                    updateStat('mental', +15);
                    updateStat('otaku', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '飽きてゲームに切り替える',
                nextScene: 'play-game',
                effect: () => {
                    updateStat('otaku', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 真剣なプログラミング
    'serious-programming': {
        image: 'images/scene-programming.jpg',
        text: '集中してプログラミングに取り組んだ。簡単なゲームが作れるようになってきた。これが仕事になれば人生が変わるかもしれない。',
        choices: [
            {
                text: '毎日続けることを決意する',
                nextScene: 'programming-commitment',
                effect: () => {
                    updateStat('mental', +20);
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '疲れて休憩する',
                nextScene: 'programming-break',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // オタク告白
    'confess-otaku': {
        image: 'images/scene-confess-otaku.jpg',
        text: '勇気を出してオタク趣味を打ち明けた。「実は、アニメとか、その...ゲームとか好きで...」彼女は少し驚いた様子だが、優しく微笑んでくれる。',
        choices: [
            {
                text: '詳しく趣味を語る',
                nextScene: 'explain-hobby',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '彼女の反応を待つ',
                nextScene: 'wait-reaction',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 趣味の詳細説明
    'explain-hobby': {
        image: 'images/scene-honest-otaku.jpg',
        text: '熱く自分の趣味について語った。推しの作品やキャラについて、収集しているグッズやフィギュアについて。言葉が止まらなくなる。',
        choices: [
            {
                text: '彼女の反応を見る',
                nextScene: 'wait-reaction',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 彼女の反応を待つ
    'wait-reaction': {
        image: 'images/scene-honest-otaku.jpg',
        text: '彼女は少し考え込んだ後、「私もアニメは好きです。あなたが好きなのと少し違うかもしれないけど...でも、好きなことに情熱を持つのは素敵だと思います」と言ってくれた。',
        choices: [
            {
                text: '共通の趣味を探る',
                nextScene: 'find-common-interests',
                effect: () => {
                    updateStat('mental', +15);
                    updateStat('social', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: '彼女の趣味を聞く',
                nextScene: 'ask-her-hobbies',
                effect: () => {
                    updateStat('social', +15);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 共通の趣味を探る
    'find-common-interests': {
        image: 'images/scene-honest-otaku.jpg',
        text: '互いに好きな作品について話し合った。いくつか共通の好みがあることがわかり、会話が弾む。こんな経験は初めてだ。',
        choices: [
            {
                text: '次のデートに誘う',
                nextScene: 'next-date',
                effect: () => {
                    updateStat('social', +20);
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 彼女の趣味を聞く
    'ask-her-hobbies': {
        image: 'images/scene-normal-talk.jpg',
        text: '彼女の趣味について聞いてみた。読書と映画鑑賞が好きで、たまにライブにも行くという。異なる趣味だが、お互いの世界を尊重できそうだ。',
        choices: [
            {
                text: '次のデートに誘う',
                nextScene: 'next-date',
                effect: () => {
                    updateStat('social', +15);
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 無理な会話継続
    'forced-conversation': {
        image: 'images/scene-hide-otaku.jpg',
        text: '無理して世間話を続けようとするが、すぐに話題が尽きてしまう。天気や時事ニュースについて表面的な会話が続く。',
        choices: [
            {
                text: '早めに切り上げる',
                nextScene: 'end-date-early',
                effect: () => {
                    updateStat('mental', -10);
                    updateStat('social', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '思い切って趣味を打ち明ける',
                nextScene: 'confess-otaku',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 早めにデート終了
    'end-date-early': {
        image: 'images/scene-outside.jpg',
        text: '「急に思い出した用事があって...」と嘘をついて、デートを早めに切り上げた。彼女は少し残念そうだが、理解してくれた様子。',
        choices: [
            {
                text: '家に帰る',
                nextScene: 'back-to-room',
                effect: () => {
                    updateStat('mental', -15);
                    advanceTimePeriod();
                }
            },
            {
                text: 'メッセージを送る',
                nextScene: 'send-apology',
                effect: () => {
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 謝罪メッセージ
    'send-apology': {
        image: 'images/scene-message.jpg',
        text: '帰宅後、「今日は急に失礼してごめんなさい。また会えたら嬉しいです」とメッセージを送った。',
        choices: [
            {
                text: '返信を待つ',
                nextScene: 'wait-apology-response',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 謝罪への返信待ち
    'wait-apology-response': {
        image: 'images/scene-waiting.jpg',
        text: '翌日、彼女から返信が来た。「大丈夫ですよ。また会いましょう」シンプルなメッセージだが、チャンスはまだあるようだ。',
        choices: [
            {
                text: '次は正直に接する決意をする',
                nextScene: 'honest-next-time',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 次回への決意
    'honest-next-time': {
        image: 'images/scene-room.jpg',
        text: '次のデートでは素直に自分の趣味を話そうと決意する。無理して取り繕うより、正直な方がいいに決まっている。',
        choices: [
            {
                text: '再デートに誘う',
                nextScene: 'ask-second-date',
                effect: () => {
                    updateStat('mental', +10);
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 再デートへの誘い
    'ask-second-date': {
        image: 'images/scene-message.jpg',
        text: '数日後、「今度の週末、もしよければ◯◯に行きませんか？」と誘いのメッセージを送った。',
        choices: [
            {
                text: '返信を待つ',
                nextScene: 'wait-second-date',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 再デートの返事待ち
    'wait-second-date': {
        image: 'images/scene-waiting.jpg',
        text: '「はい、喜んで」との返事が来た。前回よりも自然体でいこう。',
        choices: [
            {
                text: '準備する',
                nextScene: 'prepare-second-date',
                effect: () => {
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 再デートの準備
    'prepare-second-date': {
        image: 'images/scene-room.jpg',
        text: 'デートの前に少し部屋を片付け、身だしなみを整える。今回は自信を持って自分らしくいられる気がする。',
        choices: [
            {
                text: 'デートに出かける',
                nextScene: 'honest-otaku',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // マニアックな話しすぎ
    'too-maniac': {
        image: 'images/scene-anime-lecture.jpg',
        text: '調子に乗ってマニアックな話をし過ぎてしまった。作品の細かい設定や裏話、声優の詳細情報...彼女は笑顔で聞いているが、少し引いている様子も見える。',
        choices: [
            {
                text: '話題を変える',
                nextScene: 'change-topic',
                effect: () => {
                    updateStat('social', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'さらに熱く語る',
                nextScene: 'more-maniac',
                effect: () => {
                    updateStat('otaku', +15);
                    updateStat('social', -15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 話題転換
    'change-topic': {
        image: 'images/scene-normal-talk.jpg',
        text: '「あ、すみません、熱くなりすぎました」と謝って話題を変えた。彼女はホッとした表情を見せる。',
        choices: [
            {
                text: '彼女の趣味を聞く',
                nextScene: 'ask-her-hobbies',
                effect: () => {
                    updateStat('social', +15);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // さらにマニアックな話
    'more-maniac': {
        image: 'images/scene-anime-lecture.jpg',
        text: 'さらに熱く語り続けた。二期の展開予想からグッズのレア度、海外での評価まで...気づけば一時間以上経っていた。',
        choices: [
            {
                text: '彼女の反応を確認する',
                nextScene: 'check-reaction',
                effect: () => {
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 反応確認
    'check-reaction': {
        image: 'images/scene-awkward.jpg',
        text: '彼女は微笑みながらも「すごい詳しいんですね...」と言うのがやっとの様子。気まずい空気が流れる。',
        choices: [
            {
                text: '謝る',
                nextScene: 'apologize-maniac',
                effect: () => {
                    updateStat('social', -5);
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: 'デートを切り上げる',
                nextScene: 'end-date-awkward',
                effect: () => {
                    updateStat('social', -10);
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 次回を待つ
    'wait-more': {
        image: 'images/scene-waiting.jpg',
        text: 'もう少し関係を深めてから告白しようと決めた。焦らず着実に進もう。',
        choices: [
            {
                text: '次のデートを計画する',
                nextScene: 'plan-next-date',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 連絡先交換（見知らぬ人）
    'exchange-contact-stranger': {
        image: 'images/scene-exchange-contact.jpg',
        text: 'いい雰囲気になったので連絡先を交換した。「また本の話をしましょう」と言われ、思わず顔がほころぶ。',
        choices: [
            {
                text: '別れの挨拶をする',
                nextScene: 'say-goodbye-stranger',
                effect: () => {
                    updateStat('social', +10);
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 別れの挨拶（見知らぬ人）
    'say-goodbye-stranger': {
        image: 'images/scene-cafe.jpg',
        text: '「今日はありがとうございました。また連絡します」と言って別れた。カフェを出るとき、胸の中に小さな希望が灯る。',
        choices: [
            {
                text: '家に帰る',
                nextScene: 'back-to-room-happy',
                effect: () => {
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 幸せな気分で帰宅
    'back-to-room-happy': {
        image: 'images/scene-room.jpg',
        text: '久しぶりに誰かと良い会話ができた。もしかしたら友達になれるかもしれない。その考えだけで心が軽くなる。',
        choices: [
            {
                text: '連絡するか考える',
                nextScene: 'consider-contacting',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: 'その日は趣味に没頭する',
                nextScene: 'enjoy-hobby',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 長い会話を終える
    'end-long-talk': {
        image: 'images/scene-cafe.jpg',
        text: '「そろそろ行かないと...」と言って会話を終えた。思いがけず楽しい時間だった。別れ際、互いに笑顔で挨拶を交わす。',
        choices: [
            {
                text: '家に帰る',
                nextScene: 'back-to-room-happy',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // メイドへの謝罪
    'apologize-contact': {
        image: 'images/scene-maid-cafe.jpg',
        text: '「すみません、ルールを知らなくて...」と小さな声で謝る。メイドさんは「大丈夫ですよ〜お気になさらず♪」と笑顔で応えてくれるが、恥ずかしさで顔から火が出そう。',
        choices: [
            {
                text: '黙って食事を続ける',
                nextScene: 'silent-meal',
                effect: () => {
                    updateStat('mental', -5);
                    advanceTimePeriod();
                }
            },
            {
                text: '店を出る',
                nextScene: 'leave-maid-cafe',
                effect: () => {
                    updateStat('mental', -10);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // デザートを追加注文
    'order-dessert': {
        image: 'images/scene-maid-cafe-food.jpg',
        text: 'デザートも注文した。甘いものを食べると少し気分が落ち着く。メイドさんの「おいしいですか？」という問いかけにうなずく。',
        choices: [
            {
                text: '食べ終わって店を出る',
                nextScene: 'leave-maid-cafe',
                effect: () => {
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 食事写真撮影
    'food-photo': {
        image: 'images/scene-maid-cafe-food.jpg',
        text: '料理の写真を何枚も撮影する。完璧なアングルを求めて様々な角度から撮る。メイドさんは「お気に入りいただけましたか？」と嬉しそう。',
        choices: [
            {
                text: '「とても可愛いです」と答える',
                nextScene: 'compliment-food',
                effect: () => {
                    updateStat('otaku', +5);
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '黙って食べ始める',
                nextScene: 'silent-meal',
                effect: () => {
                    updateStat('mental', +3);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 料理の褒め言葉
    'compliment-food': {
        image: 'images/scene-maid-cafe-food.jpg',
        text: '「とても可愛いです。ありがとうございます」と言うと、メイドさんは満面の笑顔で「嬉しいです〜！ご主人様に喜んでいただけて光栄です♪」と応える。',
        choices: [
            {
                text: '食事を楽しむ',
                nextScene: 'enjoy-maid-food',
                effect: () => {
                    updateStat('mental', +10);
                    updateStat('social', +5);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 料理を楽しむ
    'enjoy-maid-food': {
        image: 'images/scene-maid-cafe-food.jpg',
        text: 'メイドカフェの料理を楽しむ。思ったより美味しい。この空間での非日常的な体験は悪くない。',
        choices: [
            {
                text: '満足して店を出る',
                nextScene: 'leave-maid-cafe-happy',
                effect: () => {
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 満足してメイド喫茶を出る
    'leave-maid-cafe-happy': {
        image: 'images/scene-outside.jpg',
        text: '「ごちそうさまでした」と言って会計を済ませる。「またのお越しをお待ちしております、ご主人様♪」という見送りの言葉に少し照れる。',
        choices: [
            {
                text: '秋葉原で買い物を続ける',
                nextScene: 'go-akiba',
                effect: () => {
                    updateStat('mental', +10);
                    advanceTimePeriod();
                }
            },
            {
                text: '満足して家に帰る',
                nextScene: 'back-to-room-satisfied',
                effect: () => {
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            }
        ]
    },

    // 満足して帰宅
    'back-to-room-satisfied': {
        image: 'images/scene-room.jpg',
        text: '珍しく充実した一日だった。たまにはこういう経験も悪くない。自分の趣味を満喫できる場所があるというのは幸せなことだ。',
        choices: [
            {
                text: '今日の写真を整理する',
                nextScene: 'organize-photos',
                effect: () => {
                    updateStat('otaku', +10);
                    updateStat('mental', +5);
                    advanceTimePeriod();
                }
            },
            {
                text: '早めに寝る',
                nextScene: 'sleep-satisfied',
                effect: () => {
                    updateStat('mental', +15);
                    advanceTimePeriod();
                }
            }
        ]
    }
};

// ゲーム関数
function startGame() {
    // 初期シーンを設定
    gameState.currentScene = 'wake-up';
    
    // スタート画面のボタン設定
    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('title-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        
        // 初期シーンを表示
        displayScene();
    });
    
    // インベントリ画面の表示設定
    document.getElementById('inventory-button').addEventListener('click', () => {
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('inventory-screen').classList.add('active');
        displayInventory();
    });
    
    // インベントリ画面を閉じる
    document.getElementById('close-inventory').addEventListener('click', () => {
        document.getElementById('inventory-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
    });
    
    // リスタートボタン
    document.getElementById('restart-button').addEventListener('click', () => {
        resetGame();
        document.getElementById('game-over-screen').classList.remove('active');
        document.getElementById('title-screen').classList.add('active');
    });

    // Twitterシェア
    document.getElementById('share-twitter').addEventListener('click', (event) => {
        event.preventDefault(); // デフォルトのリンク挙動をキャンセル
        shareGameResult('twitter');
    });
    
    // Instagramシェア
    document.getElementById('share-instagram').addEventListener('click', (event) => {
        event.preventDefault();
        shareGameResult('instagram');
    });
}

// シーンを表示する関数
function displayScene() {
    const scene = scenes[gameState.currentScene];
    
    // デバッグ - 現在のシーンを表示
    console.log("Current Scene:", gameState.currentScene);
    console.log("Scene Object:", scene);
    
    // シーン画像の設定
    const sceneImage = document.getElementById('scene-image');
    if (scene && scene.image) {
        sceneImage.style.backgroundImage = `url(${scene.image})`;
    } else {
        console.error("Scene or image not found:", gameState.currentScene);
        sceneImage.style.backgroundImage = 'none';
    }

    // エラー処理: シーンが見つからない場合は初期シーンに戻す
    if (!scene) {
        console.error(`シーンが見つかりません: ${gameState.currentScene}`);
        gameState.currentScene = 'wake-up';
        displayScene();
        return;
    }
    
    // 日付表示
    const timeDisplay = document.createElement('div');
    timeDisplay.style.position = 'absolute';
    timeDisplay.style.top = '10px';
    timeDisplay.style.right = '10px';
    timeDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    timeDisplay.style.padding = '5px 10px';
    timeDisplay.style.borderRadius = '5px';
    timeDisplay.style.fontSize = '0.9rem';
    timeDisplay.style.color = '#0f0';
    timeDisplay.style.fontWeight = 'bold';
    timeDisplay.style.textShadow = '0 0 5px #0f0';
    timeDisplay.style.zIndex = '100';
    
    // 時間帯の決定（0:朝, 1:昼, 2:夕方, 3:夜）
    const timeOfDay = gameState.flags.daysPassed % 4;
    let timeText = '';
    switch(timeOfDay) {
        case 0: timeText = '朝'; break;
        case 1: timeText = '昼'; break;
        case 2: timeText = '夕方'; break;
        case 3: timeText = '夜'; break;
    }
    
    // 経過日数計算（4つの時間帯で1日）
    const dayCount = Math.floor(gameState.flags.daysPassed / 4) + 1;
    timeDisplay.textContent = `${dayCount}日目 ${timeText}`;
    
    // シーン画像の親要素に時間表示を追加
    document.getElementById('scene-container').appendChild(timeDisplay);
    
    // ダイアログテキストの設定
    const dialogueText = document.getElementById('dialogue-text');
    dialogueText.textContent = scene.text;
    
    // 選択肢を表示
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';
    
    scene.choices.forEach(choice => {
        // 選択肢の条件確認
        if (choice.condition && !choice.condition()) {
            return;
        }
        
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.classList.add('choice-button');
        
        button.addEventListener('click', () => {
            // エフェクトの適用
            if (choice.effect) {
                choice.effect();
            }
            
            // 次のシーンへ
            gameState.currentScene = choice.nextScene;
            
            // エンディングか確認
            if (isEnding(choice.nextScene)) {
                showEnding(choice.nextScene);
            } else {
                displayScene();
            }
        });
        
        choicesContainer.appendChild(button);
    });
    
    // ステータスバーの更新
    updateStatusBars();
}









// ステータスバーを更新
function updateStatusBars() {
    document.getElementById('mental-bar').style.width = `${gameState.stats.mental}%`;
    document.getElementById('social-bar').style.width = `${gameState.stats.social}%`;
    document.getElementById('otaku-bar').style.width = `${gameState.stats.otaku}%`;
    document.getElementById('gadget-count').textContent = gameState.stats.gadgets.length;
    
    // ステータスによるエンディング判定
    checkStatusEndings();
}

// ステータス更新
function updateStat(stat, value) {
    gameState.stats[stat] = Math.max(0, Math.min(100, gameState.stats[stat] + value));
}

// ガジェット追加
function addGadget(gadgetId) {
    const gadget = gadgets.find(g => g.id === gadgetId);
    if (gadget && !gameState.stats.gadgets.some(g => g.id === gadgetId)) {
        gameState.stats.gadgets.push(gadget);
    }
}

// インベントリ表示
function displayInventory() {
    const gadgetGrid = document.getElementById('gadget-grid');
    gadgetGrid.innerHTML = '';
    
    if (gameState.stats.gadgets.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = 'ガジェットを持っていません。';
        emptyMessage.style.gridColumn = '1 / -1';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        gadgetGrid.appendChild(emptyMessage);
        return;
    }
    
    gameState.stats.gadgets.forEach(gadget => {
        const gadgetItem = document.createElement('div');
        gadgetItem.classList.add('gadget-item');
        
        const gadgetImage = document.createElement('div');
        gadgetImage.classList.add('gadget-image');
        gadgetImage.textContent = gadget.name.substring(0, 2);
        gadgetImage.style.backgroundColor = '#333';
        gadgetImage.style.display = 'flex';
        gadgetImage.style.justifyContent = 'center';
        gadgetImage.style.alignItems = 'center';
        gadgetImage.style.color = '#0f0';
        
        const gadgetName = document.createElement('div');
        gadgetName.classList.add('gadget-name');
        gadgetName.textContent = gadget.name;
        
        const gadgetDesc = document.createElement('div');
        gadgetDesc.classList.add('gadget-description');
        gadgetDesc.textContent = gadget.description;
        
        gadgetItem.appendChild(gadgetImage);
        gadgetItem.appendChild(gadgetName);
        gadgetItem.appendChild(gadgetDesc);
        
        gadgetGrid.appendChild(gadgetItem);
    });
}

// エンディングかどうか
function isEnding(sceneId) {
    return sceneId === 'happy-ending' || 
           sceneId === 'bad-ending' || 
           sceneId === 'normal-ending' || 
           sceneId === 'otaku-ending';
}

// エンディング表示
function showEnding(endingId) {
    // エンディングタイプを決定
    let endingType;
    switch(endingId) {
        case 'happy-ending':
            endingType = 'happy';
            break;
        case 'bad-ending':
            endingType = 'bad';
            break;
        case 'normal-ending':
            endingType = 'normal';
            break;
        case 'otaku-ending':
            endingType = 'otaku';
            break;
    }

    // URLパラメータを構築
    const params = new URLSearchParams({
        ending: endingType,
        mental: gameState.stats.mental,
        social: gameState.stats.social,
        otaku: gameState.stats.otaku,
        gadgets: gameState.stats.gadgets.length,
        days: gameState.flags.daysPassed
    });

    // エンディングページに遷移
    window.location.href = `endings.html?${params.toString()}`;
}

// ステータスによるエンディング判定
function checkStatusEndings() {
    if (gameState.stats.mental <= 0) {
        gameState.currentScene = 'bad-ending';
        showEnding('bad-ending');
    }
    else if (gameState.stats.otaku >= 100 && gameState.stats.social <= 10) {
        gameState.currentScene = 'otaku-ending';
        showEnding('otaku-ending');
    }
}

// ゲームリセット
function resetGame() {
    gameState.stats.mental = 50;
    gameState.stats.social = 20;
    gameState.stats.otaku = 80;
    gameState.stats.gadgets = [];
    
    gameState.currentScene = 'wake-up';
    
    gameState.flags = {
        metGirl: false,
        boughtFigure: false,
        visitedAkiba: false,
        triedDating: false,
        rejectedCount: 0,
        daysPassed: 0
    };
}

// 時間経過処理
function advanceTimePeriod() {
    gameState.flags.daysPassed++;
}

// ゲーム結果をシェアする関数 (プラットフォームを受け取るように変更)
function shareGameResult(platform) {
    // 現在のエンディングタイトルと説明を取得
    const endingTitle = document.getElementById('ending-title').textContent;
    const endingDesc = document.getElementById('ending-description').textContent;

    // ステータス情報を取得
    const mentalStat = gameState.stats.mental;
    const socialStat = gameState.stats.social;
    const otakuStat = gameState.stats.otaku;
    const gadgetCount = gameState.stats.gadgets.length;
    const daysPassed = gameState.flags.daysPassed;

    // シェアするテキストを作成
    let shareText = encodeURIComponent(
        `キモオタ人生シミュレーター結果:\n` +
        `${endingTitle}\n` +
        `精神力: ${mentalStat}% | 社会性: ${socialStat}% | オタク度: ${otakuStat}%\n` +
        `ガジェット数: ${gadgetCount} | 経過日数: ${daysPassed}日\n` +
        `#キモオタ人生シミュレーター`
    );

    let shareUrl = '';

    // プラットフォームに応じた共有URLを生成
    if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
    } else if (platform === 'instagram') {
        // Instagramは直接共有できないので、クリップボードにコピーするなどの代替手段
        navigator.clipboard.writeText(shareText)
            .then(() => {
                alert('結果をクリップボードにコピーしました。Instagramに貼り付けて共有してください。');
            })
            .catch(err => {
                console.error('クリップボードへのコピーに失敗しました', err);
                alert('結果のコピーに失敗しました。手動でコピーしてください。');
            });
        return; // クリップボードコピー後は処理を終了
    }

    // 新しいウィンドウで共有画面を開く
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', startGame);
