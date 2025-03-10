// エンディングの定義
const endings = {
    happy: {
        title: 'ハッピーエンド：リア充への道',
        description: '恋愛に成功し、オタク趣味も理解してもらえる関係を築けました。32年間の孤独を経て、ついに人生の春が訪れました。',
        background: 'images/scene-happy-end.jpg'
    },
    bad: {
        title: 'バッドエンド：底なし沼',
        description: '社会との接点を完全に失い、部屋に引きこもって二次元だけの生活を送るようになりました。このままあと数十年...',
        background: 'images/scene-room.jpg'
    },
    normal: {
        title: 'ノーマルエンド：このまま一生',
        description: '特に大きな変化はないまま、日々をなんとなく過ごしています。たまに外出し、たまに趣味を楽しむ。悪くはないけど、良くもない人生。',
        background: 'images/scene-outside.jpg'
    },
    otaku: {
        title: 'オタクエンド：極めし者',
        description: 'オタク趣味に全てを捧げ、コレクションは部屋に収まりきらなくなりました。SNSではオタク界隈での知名度も上がり、仲間もできました。社会性は皆無ですが、独自の世界では充実しています。',
        background: 'images/scene-figure-shop.jpg'
    }
};

// URLパラメータを取得する関数
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        ending: params.get('ending') || 'normal',
        mental: parseInt(params.get('mental')) || 50,
        social: parseInt(params.get('social')) || 20,
        otaku: parseInt(params.get('otaku')) || 80,
        gadgets: parseInt(params.get('gadgets')) || 0,
        days: parseInt(params.get('days')) || 1
    };
}

// エンディング情報を表示する関数
function displayEnding() {
    const params = getUrlParams();
    const ending = endings[params.ending];

    // タイトルと説明を設定
    document.getElementById('ending-title').textContent = ending.title;
    document.getElementById('ending-description').textContent = ending.description;

    // 背景画像を設定
    const endingScreen = document.getElementById('ending-screen');
    endingScreen.style.backgroundImage = `url(${ending.background})`;

    // ステータスを設定
    document.getElementById('mental-stat').textContent = params.mental;
    document.getElementById('social-stat').textContent = params.social;
    document.getElementById('otaku-stat').textContent = params.otaku;
    document.getElementById('gadget-stat').textContent = params.gadgets;
    document.getElementById('days-stat').textContent = params.days;

    // シェアボタンのイベントリスナーを設定
    document.getElementById('share-twitter').addEventListener('click', () => shareResult('twitter'));
    document.getElementById('download-screenshot').addEventListener('click', downloadScreenshot);
}

// 結果をシェアする関数
function shareResult(platform) {
    const params = getUrlParams();
    const ending = endings[params.ending];
    
    // シェアするテキストを作成
    const shareText = `キモオタ人生シミュレーター結果:\n` +
        `${ending.title}\n` +
        `精神力: ${params.mental}% | 社会性: ${params.social}% | オタク度: ${params.otaku}%\n` +
        `ガジェット数: ${params.gadgets} | 経過日数: ${params.days}日\n` +
        `#キモオタ人生シミュレーター`;

    const encodedText = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank', 'width=600,height=400');
}

// スクリーンショットを保存する関数
async function downloadScreenshot() {
    try {
        // エンディング画面をキャプチャ
        const element = document.getElementById('ending-screen');
        // 一時的に要素のスタイルを固定サイズに設定
        const originalStyle = element.style.cssText;
        element.style.width = '900px';
        element.style.height = '600px';
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';

        const canvas = await html2canvas(element, {
            backgroundColor: '#000',
            scale: 2, // 高解像度で出力
            width: 900,
            height: 600,
            logging: true, // デバッグ用にログを有効化
            allowTaint: true,
            useCORS: true,
            foreignObjectRendering: true,
            imageTimeout: 0, // 画像読み込みのタイムアウトを無効化
            onclone: function(clonedDoc) {
                const clonedElement = clonedDoc.getElementById('ending-screen');
                const bgImage = window.getComputedStyle(element).backgroundImage;
                clonedElement.style.backgroundImage = bgImage;
                clonedElement.style.width = '900px';
                clonedElement.style.height = '600px';
            }
        });

        // 元のスタイルを復元
        element.style.cssText = originalStyle;

        // キャプチャした画像をダウンロード
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `kimoi-game-ending-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('スクリーンショットの保存に失敗しました', err);
        alert('スクリーンショットの保存に失敗しました。');
    }
}

// ページ読み込み時にエンディングを表示
document.addEventListener('DOMContentLoaded', displayEnding);
