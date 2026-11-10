// Global Error Boundary (logs to console without intrusive alerts on mobile/iOS)
window.onerror = function (message, source, lineno, colno, error) {
    console.warn(`[Error] ${message} at ${source}:${lineno}:${colno}`, error);
    return false;
};

window.onunhandledrejection = function (event) {
    console.warn("[Unhandled Promise Rejection]", event.reason);
};

// Global State
let state = {
    videos: [],
    categories: [],
    settings: {
        mode: 'local', // 'local' or 'supabase' or 'static'
        supabaseUrl: '',
        supabaseKey: ''
    },
    activeCategoryFilter: 'all',
    searchQuery: '',
    sortBy: 'date-desc'
};

// Default Seed Data
const SEED_VERSION = '2026-11-11-midorifc-v1';

const defaultCategories = [
    { id: 'cat-1', name: 'ダイワハウスカップ', color: 'rose' },
    { id: 'cat-2', name: '練習試合', color: 'blue' },
    { id: 'cat-3', name: '清瀬市サッカー連盟少年部', color: 'emerald' },
    { id: 'cat-4', name: '富士住建CUP御殿場ジュニア大会', color: 'amber' },
    { id: 'cat-5', name: 'JA東京カップ', color: 'purple' },
    { id: 'cat-6', name: 'グロースリーグ', color: 'emerald' },
    { id: 'cat-7', name: '市民祭', color: 'rose' },
    { id: 'cat-8', name: 'その他', color: 'slate' }
];

const defaultVideos = [
    { id: 'vid-83', title: '対FC前原ブルー後半', url: 'https://youtu.be/PmAhob4GIqQ?si=O5SRqQT3Si8atqYY', youtubeId: 'PmAhob4GIqQ', thumbnail: 'https://img.youtube.com/vi/PmAhob4GIqQ/hqdefault.jpg', date: '2026-11-07', opponent: 'FC前原ブルー', location: '学芸大小グラウンド', notes: '', categoryId: 'cat-7' },
    { id: 'vid-82', title: '対FC前原ブルー前半', url: 'https://youtu.be/NfW68T3pbUQ?si=mlMpomuk6-TJQFQD', youtubeId: 'NfW68T3pbUQ', thumbnail: 'https://img.youtube.com/vi/NfW68T3pbUQ/hqdefault.jpg', date: '2026-11-07', opponent: 'FC前原ブルー', location: '学芸大小グラウンド', notes: '', categoryId: 'cat-7' },
    { id: 'vid-81', title: '対境南SC', url: 'https://youtu.be/M4XSwbrjxIY?si=9ujFQRekQHcv7-rf', youtubeId: 'M4XSwbrjxIY', thumbnail: 'https://img.youtube.com/vi/M4XSwbrjxIY/hqdefault.jpg', date: '2026-11-03', opponent: '境南SC', location: '瑞穂町営少年サッカー場', notes: '', categoryId: 'cat-2' },
    { id: 'vid-80', title: '対瑞穂三小後半', url: 'https://youtu.be/UBSKP1umEnY?si=BKPKpwbiN3kl5pkR', youtubeId: 'UBSKP1umEnY', thumbnail: 'https://img.youtube.com/vi/UBSKP1umEnY/hqdefault.jpg', date: '2026-11-03', opponent: '瑞穂三小', location: '瑞穂町営少年サッカー場', notes: '', categoryId: 'cat-2' },
    { id: 'vid-79', title: '対瑞穂三小前半', url: 'https://youtu.be/xm2k-YsM9ds?si=1c8NVtdIdGtZNylK', youtubeId: 'xm2k-YsM9ds', thumbnail: 'https://img.youtube.com/vi/xm2k-YsM9ds/hqdefault.jpg', date: '2026-11-03', opponent: '瑞穂三小', location: '瑞穂町営少年サッカー場', notes: '', categoryId: 'cat-2' },
    { id: 'vid-78', title: '対境南SC後半', url: 'https://youtu.be/R0iHg7QeSWA?si=OZXaKAgCH2Ip2YZO', youtubeId: 'R0iHg7QeSWA', thumbnail: 'https://img.youtube.com/vi/R0iHg7QeSWA/hqdefault.jpg', date: '2026-11-03', opponent: '境南SC', location: '瑞穂町営少年サッカー場', notes: '', categoryId: 'cat-6' },
    { id: 'vid-77', title: '対境南SC前半', url: 'https://youtu.be/4inWZwPrfZ8?si=q9TsHXpg-C1Hbwlm', youtubeId: '4inWZwPrfZ8', thumbnail: 'https://img.youtube.com/vi/4inWZwPrfZ8/hqdefault.jpg', date: '2026-11-03', opponent: '境南SC', location: '瑞穂町営少年サッカー場', notes: '', categoryId: 'cat-6' },
    { id: 'vid-76', title: '対瑞穂三小後半', url: 'https://youtu.be/uw1JtIm-icc?si=7_Ub4hiSqFqLd3Qu', youtubeId: 'uw1JtIm-icc', thumbnail: 'https://img.youtube.com/vi/uw1JtIm-icc/hqdefault.jpg', date: '2026-11-03', opponent: '瑞穂三小', location: '瑞穂町営少年サッカー場', notes: '', categoryId: 'cat-6' },
    { id: 'vid-75', title: '対瑞穂三小前半', url: 'https://youtu.be/hpm3haWl6W8?si=W3LljqMJbp7RoP_S', youtubeId: 'hpm3haWl6W8', thumbnail: 'https://img.youtube.com/vi/hpm3haWl6W8/hqdefault.jpg', date: '2026-11-03', opponent: '瑞穂三小', location: '瑞穂町営少年サッカー場', notes: '', categoryId: 'cat-6' },
    { id: 'vid-74', title: '対西原Jr.後半②', url: 'https://youtu.be/Asj1TASbQhc?si=0SnYfijrOi610Rus', youtubeId: 'Asj1TASbQhc', thumbnail: 'https://img.youtube.com/vi/Asj1TASbQhc/hqdefault.jpg', date: '2026-09-22', opponent: '西原Jr.', location: '清瀬市内山運動公園サッカー場', notes: '', categoryId: 'cat-5' },
    { id: 'vid-73', title: '対西原Jr.後半①', url: 'https://youtu.be/105ilFTnaGA?si=vUKjl4gTihdJ_1Qi', youtubeId: '105ilFTnaGA', thumbnail: 'https://img.youtube.com/vi/105ilFTnaGA/hqdefault.jpg', date: '2026-09-22', opponent: '西原Jr.', location: '清瀬市内山運動公園サッカー場', notes: '', categoryId: 'cat-5' },
    { id: 'vid-72', title: '対西原Jr.前半②', url: 'https://youtu.be/BXFkkrcSDpY?si=rHBHbXyLymPv1AmM', youtubeId: 'BXFkkrcSDpY', thumbnail: 'https://img.youtube.com/vi/BXFkkrcSDpY/hqdefault.jpg', date: '2026-09-22', opponent: '西原Jr.', location: '清瀬市内山運動公園サッカー場', notes: '', categoryId: 'cat-5' },
    { id: 'vid-71', title: '対西原Jr.前半①', url: 'https://youtu.be/024Su1R2xqk?si=_e6RnLXjPcWZyb45', youtubeId: '024Su1R2xqk', thumbnail: 'https://img.youtube.com/vi/024Su1R2xqk/hqdefault.jpg', date: '2026-09-22', opponent: '西原Jr.', location: '清瀬市内山運動公園サッカー場', notes: '', categoryId: 'cat-5' },
    { id: 'vid-70', title: '対Refino後半', url: 'https://youtu.be/l4IcfGn-Pyg?si=c0ZqJQ2OKib9jXxP', youtubeId: 'l4IcfGn-Pyg', thumbnail: 'https://img.youtube.com/vi/l4IcfGn-Pyg/hqdefault.jpg', date: '2026-09-13', opponent: 'Refino', location: '清瀬市コミュニティプラザひまわり', notes: '', categoryId: 'cat-5' },
    { id: 'vid-69', title: '対Refino前半', url: 'https://youtu.be/HTg6vQd8aTQ?si=Y5MdIWpjfDdQUFHJ', youtubeId: 'HTg6vQd8aTQ', thumbnail: 'https://img.youtube.com/vi/HTg6vQd8aTQ/hqdefault.jpg', date: '2026-09-13', opponent: 'Refino', location: '清瀬市コミュニティプラザひまわり', notes: '', categoryId: 'cat-5' },
    { id: 'vid-68', title: '対蹴楽後半', url: 'https://youtu.be/APGBYTQQRh4?si=2EsoAp_pRI12HCPT', youtubeId: 'APGBYTQQRh4', thumbnail: 'https://img.youtube.com/vi/APGBYTQQRh4/hqdefault.jpg', date: '2026-09-13', opponent: '蹴楽', location: '清瀬市コミュニティプラザひまわり', notes: '', categoryId: 'cat-5' },
    { id: 'vid-67', title: '対蹴楽前半', url: 'https://youtu.be/_kZvRj4jpsE?si=vFKY8FNm4acio42g', youtubeId: '_kZvRj4jpsE', thumbnail: 'https://img.youtube.com/vi/_kZvRj4jpsE/hqdefault.jpg', date: '2026-09-13', opponent: '蹴楽', location: '清瀬市コミュニティプラザひまわり', notes: '', categoryId: 'cat-5' },
    { id: 'vid-66', title: '対VALIANT後半', url: 'https://youtu.be/gzf3agfxwMg?si=pXSvjnwyA1e2ufkO', youtubeId: 'gzf3agfxwMg', thumbnail: 'https://img.youtube.com/vi/gzf3agfxwMg/hqdefault.jpg', date: '2026-09-13', opponent: 'VALIANT', location: '清瀬市コミュニティプラザひまわり', notes: '', categoryId: 'cat-5' },
    { id: 'vid-65', title: '対VALIANT前半', url: 'https://youtu.be/6uPcgD_F_h4?si=zbB0JUGoTOVymoGi', youtubeId: '6uPcgD_F_h4', thumbnail: 'https://img.youtube.com/vi/6uPcgD_F_h4/hqdefault.jpg', date: '2026-09-13', opponent: 'VALIANT', location: '清瀬市コミュニティプラザひまわり', notes: '', categoryId: 'cat-5' },
    { id: 'vid-64', title: '対FCLESTE後半②', url: 'https://youtu.be/Upt3LDlya3Y?si=lMsEInJwe2eGkWGZ', youtubeId: 'Upt3LDlya3Y', thumbnail: 'https://img.youtube.com/vi/Upt3LDlya3Y/hqdefault.jpg', date: '2026-08-16', opponent: 'FCLESTE', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-63', title: '対FCLESTE後半①', url: 'https://youtu.be/8sj0HPqwCd8?si=rcM79NAMmWU0CivA', youtubeId: '8sj0HPqwCd8', thumbnail: 'https://img.youtube.com/vi/8sj0HPqwCd8/hqdefault.jpg', date: '2026-08-16', opponent: 'FCLESTE', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-62', title: '対FCLESTE前半②', url: 'https://youtu.be/r3aIBR5YnY8?si=4BMTHazjlENQhRgG', youtubeId: 'r3aIBR5YnY8', thumbnail: 'https://img.youtube.com/vi/r3aIBR5YnY8/hqdefault.jpg', date: '2026-08-16', opponent: 'FCLESTE', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-61', title: '対FCLESTE前半①', url: 'https://youtu.be/4FSuMr08CEY?si=sGA0-JWrN4p7UExs', youtubeId: '4FSuMr08CEY', thumbnail: 'https://img.youtube.com/vi/4FSuMr08CEY/hqdefault.jpg', date: '2026-08-16', opponent: 'FCLESTE', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-60', title: '対相模原みどりスポーツクラブ後半②', url: 'https://youtu.be/dCWHpF9AF2Y?si=dSe8uEK9tldU51Na', youtubeId: 'dCWHpF9AF2Y', thumbnail: 'https://img.youtube.com/vi/dCWHpF9AF2Y/hqdefault.jpg', date: '2026-08-16', opponent: '相模原みどりスポーツクラブ', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-59', title: '対相模原みどりスポーツクラブ後半①', url: 'https://youtu.be/tjB3b6U9FuY?si=zsVRNTKIt_U5vVkJ', youtubeId: 'tjB3b6U9FuY', thumbnail: 'https://img.youtube.com/vi/tjB3b6U9FuY/hqdefault.jpg', date: '2026-08-16', opponent: '相模原みどりスポーツクラブ', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-58', title: '対相模原みどりスポーツクラブ前半②', url: 'https://youtu.be/qMJ3GS_p78U?si=kb8jMg8gJE4kvY2b', youtubeId: 'qMJ3GS_p78U', thumbnail: 'https://img.youtube.com/vi/qMJ3GS_p78U/hqdefault.jpg', date: '2026-08-16', opponent: '相模原みどりスポーツクラブ', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-57', title: '対相模原みどりスポーツクラブ前半①', url: 'https://youtu.be/PLxiwGx2TJY?si=CFAZeeu0gI1jJAMe', youtubeId: 'PLxiwGx2TJY', thumbnail: 'https://img.youtube.com/vi/PLxiwGx2TJY/hqdefault.jpg', date: '2026-08-16', opponent: '相模原みどりスポーツクラブ', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-56', title: 'フレンドリーマッチ後半', url: 'https://youtu.be/BOXhK2hLo8k?si=CV1vqoERnugmCeiV', youtubeId: 'BOXhK2hLo8k', thumbnail: 'https://img.youtube.com/vi/BOXhK2hLo8k/hqdefault.jpg', date: '2026-08-15', opponent: '山梨ジュニアSSS', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-55', title: 'フレンドリーマッチ前半', url: 'https://youtu.be/TWRI94k-IZM?si=xa4SyNyvzN7sHDYQ', youtubeId: 'TWRI94k-IZM', thumbnail: 'https://img.youtube.com/vi/TWRI94k-IZM/hqdefault.jpg', date: '2026-08-15', opponent: '山梨ジュニアSSS', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-54', title: '対FCバンビーノ', url: 'https://youtu.be/0lJ_NcyRo0U?si=xCuYVo316JYoju0l', youtubeId: '0lJ_NcyRo0U', thumbnail: 'https://img.youtube.com/vi/0lJ_NcyRo0U/hqdefault.jpg', date: '2026-08-15', opponent: 'FCバンビーノ', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-53', title: '対FCバンビーノ', url: 'https://youtu.be/x2R8hlOkA7I?si=CAAGKiJempj_Iooq', youtubeId: 'x2R8hlOkA7I', thumbnail: 'https://img.youtube.com/vi/x2R8hlOkA7I/hqdefault.jpg', date: '2026-08-15', opponent: 'FCバンビーノ', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-52', title: '対FCバンビーノ', url: 'https://youtu.be/x2R8hlOkA7I?si=CAAGKiJempj_Iooq', youtubeId: 'x2R8hlOkA7I', thumbnail: 'https://img.youtube.com/vi/x2R8hlOkA7I/hqdefault.jpg', date: '2026-08-15', opponent: 'FCバンビーノ', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-51', title: '対FCバンビーノ', url: 'https://youtu.be/Qe2MqNhXOdg?si=XV15QbkzP5xvSfdf', youtubeId: 'Qe2MqNhXOdg', thumbnail: 'https://img.youtube.com/vi/Qe2MqNhXOdg/hqdefault.jpg', date: '2026-08-15', opponent: 'FCバンビーノ', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-50', title: '対花水FC', url: 'https://youtu.be/KX4mYQyNXUY?si=0bm13i-PoIM2aV8J', youtubeId: 'KX4mYQyNXUY', thumbnail: 'https://img.youtube.com/vi/KX4mYQyNXUY/hqdefault.jpg', date: '2026-08-15', opponent: '花水FC', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-49', title: '対花水FC', url: 'https://youtu.be/1ypvOZu7e0k?si=Q0W1xyegMjvoL61z', youtubeId: '1ypvOZu7e0k', thumbnail: 'https://img.youtube.com/vi/1ypvOZu7e0k/hqdefault.jpg', date: '2026-08-15', opponent: '花水FC', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-48', title: '対花水FC', url: 'https://youtu.be/x6N5LhdhtGM?si=4O_cDE3aB1Sw9pl8', youtubeId: 'x6N5LhdhtGM', thumbnail: 'https://img.youtube.com/vi/x6N5LhdhtGM/hqdefault.jpg', date: '2026-08-15', opponent: '花水FC', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-47', title: '対花水FC', url: 'https://youtu.be/j9t1-T4TkM8?si=qD2kUjUWK08lvn9G', youtubeId: 'j9t1-T4TkM8', thumbnail: 'https://img.youtube.com/vi/j9t1-T4TkM8/hqdefault.jpg', date: '2026-08-15', opponent: '花水FC', location: '時之栖うさぎ島グラウンド', notes: '', categoryId: 'cat-4' },
    { id: 'vid-46', title: '対田無富士見③', url: 'https://youtu.be/O8Us1yBNJTY?si=cKuu2GosdF5yCBOd', youtubeId: 'O8Us1yBNJTY', thumbnail: 'https://img.youtube.com/vi/O8Us1yBNJTY/hqdefault.jpg', date: '2026-08-02', opponent: '田無富士見', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-45', title: '対田無富士見②後半', url: 'https://youtu.be/oVVKcE8mcHc?si=G_0bn3lR1BZVlvo7', youtubeId: 'oVVKcE8mcHc', thumbnail: 'https://img.youtube.com/vi/oVVKcE8mcHc/hqdefault.jpg', date: '2026-08-02', opponent: '田無富士見', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-44', title: '対田無富士見②前半', url: 'https://youtu.be/bPgQCkXk8vM?si=yIWYEmuI4RpggWwP', youtubeId: 'bPgQCkXk8vM', thumbnail: 'https://img.youtube.com/vi/bPgQCkXk8vM/hqdefault.jpg', date: '2026-08-02', opponent: '田無富士見', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-43', title: '対田無富士見①後半', url: 'https://youtu.be/-r9G_sYgNhk?si=CFdUqed96CQTMhlI', youtubeId: '-r9G_sYgNhk', thumbnail: 'https://img.youtube.com/vi/-r9G_sYgNhk/hqdefault.jpg', date: '2026-08-02', opponent: '田無富士見', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-42', title: '対田無富士見①前半', url: 'https://youtu.be/V5WftYPjmcU?si=JRyvDQp00F4jb5HW', youtubeId: 'V5WftYPjmcU', thumbnail: 'https://img.youtube.com/vi/V5WftYPjmcU/hqdefault.jpg', date: '2026-08-02', opponent: '田無富士見', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-41', title: '対花小金井シューターズ③', url: 'https://youtu.be/ed9_GZdycjs?si=wuKJlpp6e9ghEAPs', youtubeId: 'ed9_GZdycjs', thumbnail: 'https://img.youtube.com/vi/ed9_GZdycjs/hqdefault.jpg', date: '2026-08-02', opponent: '花小金井シューターズ', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-40', title: '対花小金井シューターズ②後半', url: 'https://youtu.be/5yZdukvlkNk?si=28jllzRTNBVYi6iA', youtubeId: '5yZdukvlkNk', thumbnail: 'https://img.youtube.com/vi/5yZdukvlkNk/hqdefault.jpg', date: '2026-08-02', opponent: '花小金井シューターズ', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-39', title: '対花小金井シューターズ②前半', url: 'https://youtu.be/zj0UJmzvvQc?si=_BN_PBuWDWYDUjv8', youtubeId: 'zj0UJmzvvQc', thumbnail: 'https://img.youtube.com/vi/zj0UJmzvvQc/hqdefault.jpg', date: '2026-08-02', opponent: '花小金井シューターズ', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-38', title: '対花小金井シューターズ①後半', url: 'https://youtu.be/guvPJJGw0Ec?si=Woy5HRVfv8I5azJ1', youtubeId: 'guvPJJGw0Ec', thumbnail: 'https://img.youtube.com/vi/guvPJJGw0Ec/hqdefault.jpg', date: '2026-08-02', opponent: '花小金井シューターズ', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-37', title: '対花小金井シューターズ①前半', url: 'https://youtu.be/bzcq9W-h0ls?si=vtgmXMVCAXa6yfzI', youtubeId: 'bzcq9W-h0ls', thumbnail: 'https://img.youtube.com/vi/bzcq9W-h0ls/hqdefault.jpg', date: '2026-08-02', opponent: '花小金井シューターズ', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-36', title: '四試合目', url: 'https://youtu.be/fHgHnzwA5Pc?si=324pk0il7STx1Hds', youtubeId: 'fHgHnzwA5Pc', thumbnail: 'https://img.youtube.com/vi/fHgHnzwA5Pc/hqdefault.jpg', date: '2026-07-26', opponent: '3KSC', location: '小金井市立第三小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-35', title: '三試合目', url: 'https://youtu.be/3Dk5NsdBAPk?si=_lKlkc6fGtSOdrt_', youtubeId: '3Dk5NsdBAPk', thumbnail: 'https://img.youtube.com/vi/3Dk5NsdBAPk/hqdefault.jpg', date: '2026-07-26', opponent: '3KSC', location: '小金井市立第三小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-34', title: '二試合目', url: 'https://youtu.be/t94jHBFHuRA?si=GUW_z8yn2y_AR14l', youtubeId: 't94jHBFHuRA', thumbnail: 'https://img.youtube.com/vi/t94jHBFHuRA/hqdefault.jpg', date: '2026-07-26', opponent: '3KSC', location: '小金井市立第三小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-33', title: '一試合目', url: 'https://youtu.be/10joFE32l30?si=VdAorLdtCT_ffRiK', youtubeId: '10joFE32l30', thumbnail: 'https://img.youtube.com/vi/10joFE32l30/hqdefault.jpg', date: '2026-07-26', opponent: '3KSC', location: '小金井市立第三小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-32', title: '対Plaisir', url: 'https://youtu.be/bvc2FjwjYGk?si=VoY4gnCDwh_ulBBF', youtubeId: 'bvc2FjwjYGk', thumbnail: 'https://img.youtube.com/vi/bvc2FjwjYGk/hqdefault.jpg', date: '2026-07-20', opponent: 'Plaisir', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-31', title: '対Plaisir', url: 'https://youtu.be/a61RiQv0a6U?si=EgXpmmRh2VkY8_no', youtubeId: 'a61RiQv0a6U', thumbnail: 'https://img.youtube.com/vi/a61RiQv0a6U/hqdefault.jpg', date: '2026-07-20', opponent: 'Plaisir', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-30', title: '対Plaisir', url: 'https://youtu.be/jeJrgcPGYV8?si=U3XnwT6UClCMq_4O', youtubeId: 'jeJrgcPGYV8', thumbnail: 'https://img.youtube.com/vi/jeJrgcPGYV8/hqdefault.jpg', date: '2026-07-20', opponent: 'Plaisir', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-29', title: '対Plaisir', url: 'https://youtu.be/516bBH0xIm4?si=tXE988pGGsNDMhWE', youtubeId: '516bBH0xIm4', thumbnail: 'https://img.youtube.com/vi/516bBH0xIm4/hqdefault.jpg', date: '2026-07-20', opponent: 'Plaisir', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-28', title: '対サンデーSC', url: 'https://youtu.be/VXLgySfBJYY?si=BCUVqw79atUt7Niz', youtubeId: 'VXLgySfBJYY', thumbnail: 'https://img.youtube.com/vi/VXLgySfBJYY/hqdefault.jpg', date: '2026-07-20', opponent: 'サンデーSC', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-27', title: '対サンデーSC', url: 'https://youtu.be/0aLSgpEXGAM?si=UNV8enbP_l6AQVtL', youtubeId: '0aLSgpEXGAM', thumbnail: 'https://img.youtube.com/vi/0aLSgpEXGAM/hqdefault.jpg', date: '2026-07-20', opponent: 'サンデーSC', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-26', title: '対サンデーSC', url: 'https://youtu.be/rPcI0P17AJQ?si=BL6p80nNN5Q4X57H', youtubeId: 'rPcI0P17AJQ', thumbnail: 'https://img.youtube.com/vi/rPcI0P17AJQ/hqdefault.jpg', date: '2026-07-20', opponent: 'サンデーSC', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-25', title: '対Refino', url: 'https://youtu.be/G5cJjHQ8hn4?si=p5Zmt9qwf5Mx8TDL', youtubeId: 'G5cJjHQ8hn4', thumbnail: 'https://img.youtube.com/vi/G5cJjHQ8hn4/hqdefault.jpg', date: '2026-07-20', opponent: 'Refino', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-24', title: '対Refino', url: 'https://youtu.be/4kzJgc6JC9U?si=naCcLeNlAdPdfz3G', youtubeId: '4kzJgc6JC9U', thumbnail: 'https://img.youtube.com/vi/4kzJgc6JC9U/hqdefault.jpg', date: '2026-07-20', opponent: 'Refino', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-23', title: '対清瀬FC', url: 'https://youtu.be/_gHkB1H7cfE?si=6LvSns-qVdEcuJmO', youtubeId: '_gHkB1H7cfE', thumbnail: 'https://img.youtube.com/vi/_gHkB1H7cfE/hqdefault.jpg', date: '2026-07-20', opponent: '清瀬FC', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-22', title: '対清瀬FC', url: 'https://youtu.be/-M7GN-0sJ5g?si=br-XWf7JR-IjhDeA', youtubeId: '-M7GN-0sJ5g', thumbnail: 'https://img.youtube.com/vi/-M7GN-0sJ5g/hqdefault.jpg', date: '2026-07-20', opponent: '清瀬FC', location: '清瀬内山運動公園', notes: '', categoryId: 'cat-3' },
    { id: 'vid-21', title: '対南大沢FC②', url: 'https://youtu.be/xVOa2yNwnG0?si=AmKVS-ovKmTCblM-', youtubeId: 'xVOa2yNwnG0', thumbnail: 'https://img.youtube.com/vi/xVOa2yNwnG0/hqdefault.jpg', date: '2026-07-18', opponent: '南大沢FC', location: '八王子市立宮上小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-20', title: '対若葉台FC②', url: 'https://youtu.be/XckQ9T3KLPg?si=SjStd8jaz5l6PM4S', youtubeId: 'XckQ9T3KLPg', thumbnail: 'https://img.youtube.com/vi/XckQ9T3KLPg/hqdefault.jpg', date: '2026-07-18', opponent: '若葉台FC', location: '八王子市立宮上小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-19', title: '対南大沢FC①後半②', url: 'https://youtu.be/ZWJG2zsxK5c?si=Z007p_JDbYadZpDZ', youtubeId: 'ZWJG2zsxK5c', thumbnail: 'https://img.youtube.com/vi/ZWJG2zsxK5c/hqdefault.jpg', date: '2026-07-18', opponent: '南大沢FC', location: '八王子市立宮上小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-18', title: '対南大沢FC①後半①', url: 'https://youtu.be/lY__-EZqCpM?si=4RF_nCxGd6qAbsK4', youtubeId: 'lY__-EZqCpM', thumbnail: 'https://img.youtube.com/vi/lY__-EZqCpM/hqdefault.jpg', date: '2026-07-18', opponent: '南大沢FC', location: '八王子市立宮上小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-17', title: '対南大沢FC①前半②', url: 'https://youtu.be/UONk9JKjsqc?si=U2ccD3gZI9HvX0Tj', youtubeId: 'UONk9JKjsqc', thumbnail: 'https://img.youtube.com/vi/UONk9JKjsqc/hqdefault.jpg', date: '2026-07-18', opponent: '南大沢FC', location: '八王子市立宮上小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-16', title: '対南大沢FC①前半①', url: 'https://youtu.be/hdte2d7JykI?si=jfmMnabyO8mYTX8m', youtubeId: 'hdte2d7JykI', thumbnail: 'https://img.youtube.com/vi/hdte2d7JykI/hqdefault.jpg', date: '2026-07-18', opponent: '南大沢FC', location: '八王子市立宮上小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-15', title: '対若葉台FC①後半', url: 'https://youtu.be/olZmu5HOHZo?si=TF4aqlzQ2o-OaE9g', youtubeId: 'olZmu5HOHZo', thumbnail: 'https://img.youtube.com/vi/olZmu5HOHZo/hqdefault.jpg', date: '2026-07-18', opponent: '若葉台FC', location: '八王子市立宮上小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-14', title: '対若葉台FC①前半', url: 'https://youtu.be/_kDp11JGpCU?si=4ybM0-Yddb2fZMJo', youtubeId: '_kDp11JGpCU', thumbnail: 'https://img.youtube.com/vi/_kDp11JGpCU/hqdefault.jpg', date: '2026-07-18', opponent: '若葉台FC', location: '八王子市立宮上小学校', notes: '', categoryId: 'cat-2' },
    { id: 'vid-13', title: '6試合目', url: 'https://youtu.be/Q5AB_UhZIuw?si=tQrt9WDeWzoxxmWJ', youtubeId: 'Q5AB_UhZIuw', thumbnail: 'https://img.youtube.com/vi/Q5AB_UhZIuw/hqdefault.jpg', date: '2026-06-28', opponent: '田無富士見', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-12', title: '5試合目', url: 'https://youtu.be/yHGIVrHfkIg?si=F6N0Xu3WcjErvFeG', youtubeId: 'yHGIVrHfkIg', thumbnail: 'https://img.youtube.com/vi/yHGIVrHfkIg/hqdefault.jpg', date: '2026-06-28', opponent: '田無富士見', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-11', title: '4試合目', url: 'https://youtu.be/KHAWpF8KUb8?si=m3e9yXF7p0aSDF38', youtubeId: 'KHAWpF8KUb8', thumbnail: 'https://img.youtube.com/vi/KHAWpF8KUb8/hqdefault.jpg', date: '2026-06-28', opponent: '田無富士見', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-10', title: '3試合目', url: 'https://youtu.be/1AAf6F9Og_Y?si=Ox8xD9tJ0Y5NdibJ', youtubeId: '1AAf6F9Og_Y', thumbnail: 'https://img.youtube.com/vi/1AAf6F9Og_Y/hqdefault.jpg', date: '2026-06-28', opponent: '田無富士見', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-9', title: '2試合目', url: 'https://youtu.be/e2AUhDdlGzE?si=w_ZhU6TaxmgwWnfY', youtubeId: 'e2AUhDdlGzE', thumbnail: 'https://img.youtube.com/vi/e2AUhDdlGzE/hqdefault.jpg', date: '2026-06-28', opponent: '田無富士見', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-8', title: 'フレンドリーマッチ③', url: 'https://youtu.be/iiusGleYchs?si=pG4cR7pCG2rQzbal', youtubeId: 'iiusGleYchs', thumbnail: 'https://img.youtube.com/vi/iiusGleYchs/hqdefault.jpg', date: '2026-05-30', opponent: 'ロケッツ・ファルべ', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-7', title: 'フレンドリーマッチ②', url: 'https://youtu.be/N8KSh_NTqOI?si=vX_W_cjXtDaPY5m3', youtubeId: 'N8KSh_NTqOI', thumbnail: 'https://img.youtube.com/vi/N8KSh_NTqOI/hqdefault.jpg', date: '2026-05-30', opponent: 'ロケッツ・ファルべ', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-6', title: 'フレンドリーマッチ①', url: 'https://youtu.be/WQ7KJNEka9g?si=wzmrzJU_A7FmDAco', youtubeId: 'WQ7KJNEka9g', thumbnail: 'https://img.youtube.com/vi/WQ7KJNEka9g/hqdefault.jpg', date: '2026-05-30', opponent: 'ロケッツ・ファルべ', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-5', title: '対3KSC後半', url: 'https://youtu.be/XJ1DmxqRumQ?si=RBWB7THMz5IYx5-m', youtubeId: 'XJ1DmxqRumQ', thumbnail: 'https://img.youtube.com/vi/XJ1DmxqRumQ/hqdefault.jpg', date: '2026-05-30', opponent: '3KSC', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-4', title: '対3KSC前半', url: 'https://youtu.be/dzgtkW7EEvQ?si=DfjE1dpmUvZSptQs', youtubeId: 'dzgtkW7EEvQ', thumbnail: 'https://img.youtube.com/vi/dzgtkW7EEvQ/hqdefault.jpg', date: '2026-05-30', opponent: '3KSC', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-3', title: '対ロケッツ・ファルべPK', url: 'https://youtu.be/KlRvlXpVXxw?si=6bBi0Uek-_u5OhUG', youtubeId: 'KlRvlXpVXxw', thumbnail: 'https://img.youtube.com/vi/KlRvlXpVXxw/hqdefault.jpg', date: '2026-05-30', opponent: 'ロケッツ・ファルべ', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-2', title: '対ロケッツ・ファルべ後半', url: 'https://youtu.be/SfdmknTGvnk?si=igac9Zn6fjgacSmd', youtubeId: 'SfdmknTGvnk', thumbnail: 'https://img.youtube.com/vi/SfdmknTGvnk/hqdefault.jpg', date: '2026-05-30', opponent: 'ロケッツ・ファルべ', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-1', title: '対ロケッツ・ファルべ前半', url: 'https://youtu.be/2rDIc9JlwV8?si=m2ufM9E0lrBo9f_Z', youtubeId: '2rDIc9JlwV8', thumbnail: 'https://img.youtube.com/vi/2rDIc9JlwV8/hqdefault.jpg', date: '2026-05-30', opponent: 'ロケッツ・ファルべ', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-09', title: '対Nadeshiko⑤', url: 'https://youtu.be/TLxXFsnUBqk?si=QqGnZzEpzdJFkuun', youtubeId: 'TLxXFsnUBqk', thumbnail: 'https://img.youtube.com/vi/TLxXFsnUBqk/hqdefault.jpg', date: '2026-05-17', opponent: 'Nadeshiko', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-08', title: '対Nadeshiko④', url: 'https://youtu.be/l-gUNhHCKd4?si=1-wYHAAsJEN7i3n4', youtubeId: 'l-gUNhHCKd4', thumbnail: 'https://img.youtube.com/vi/l-gUNhHCKd4/hqdefault.jpg', date: '2026-05-17', opponent: 'Nadeshiko', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-07', title: '対Nadeshiko③', url: 'https://youtu.be/eCFQXIjfZT4?si=h-xxgLCu9j_lsn4Q', youtubeId: 'eCFQXIjfZT4', thumbnail: 'https://img.youtube.com/vi/eCFQXIjfZT4/hqdefault.jpg', date: '2026-05-17', opponent: 'Nadeshiko', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-06', title: '対Nadeshiko②', url: 'https://youtu.be/hiWzIN-25Oc?si=TVi_1OZ6JMbSY741', youtubeId: 'hiWzIN-25Oc', thumbnail: 'https://img.youtube.com/vi/hiWzIN-25Oc/hqdefault.jpg', date: '2026-05-17', opponent: 'Nadeshiko', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-05', title: '対Nadeshiko①', url: 'https://youtu.be/9hQpIMZ4g8I?si=dfWe6HFRrlb3TZCh', youtubeId: '9hQpIMZ4g8I', thumbnail: 'https://img.youtube.com/vi/9hQpIMZ4g8I/hqdefault.jpg', date: '2026-05-17', opponent: 'Nadeshiko', location: '小金井公園', notes: '', categoryId: 'cat-2' },
    { id: 'vid-04', title: '対4SC後半', url: 'https://youtu.be/wNWM3oSq8HE?si=09BDWBFiOX7RvCyT', youtubeId: 'wNWM3oSq8HE', thumbnail: 'https://img.youtube.com/vi/wNWM3oSq8HE/hqdefault.jpg', date: '2026-05-02', opponent: '4SC', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-03', title: '対4SC前半', url: 'https://youtu.be/OLLF10Dnz8I?si=Dn-hjUewwfaWBafI', youtubeId: 'OLLF10Dnz8I', thumbnail: 'https://img.youtube.com/vi/OLLF10Dnz8I/hqdefault.jpg', date: '2026-05-02', opponent: '4SC', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-02', title: '対Nadeshiko後半', url: 'https://youtu.be/fg1c6ungs_w?si=_IAzVfJZwbW0HymE', youtubeId: 'fg1c6ungs_w', thumbnail: 'https://img.youtube.com/vi/fg1c6ungs_w/hqdefault.jpg', date: '2026-05-02', opponent: 'Nadeshiko', location: '上水公園', notes: '', categoryId: 'cat-1' },
    { id: 'vid-01', title: '対Nadeshiko前半', url: 'https://youtu.be/tiIWN-MK1zg?si=PvoLLaapoP66yG78', youtubeId: 'tiIWN-MK1zg', thumbnail: 'https://img.youtube.com/vi/tiIWN-MK1zg/hqdefault.jpg', date: '2026-05-02', opponent: 'Nadeshiko', location: '上水公園', notes: '', categoryId: 'cat-1' }
];



// Helper: YouTube URL parser
function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Helper: oEmbed Fetch
async function fetchYouTubeInfo(url) {
    const id = getYouTubeId(url);
    if (!id) return null;
    
    const defaultThumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    const defaultTitle = `YouTube動画 (${id})`;
    
    try {
        // Try official oEmbed first
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        if (res.ok) {
            const data = await res.json();
            return {
                title: data.title || defaultTitle,
                thumbnail: data.thumbnail_url || defaultThumb
            };
        }
        
        // Try noembed.com fallback (CORS friendly)
        const res2 = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`);
        if (res2.ok) {
            const data2 = await res2.json();
            return {
                title: data2.title || defaultTitle,
                thumbnail: data2.thumbnail_url || defaultThumb
            };
        }
    } catch (error) {
        console.warn("oEmbed metadata fetch failed, using fallback:", error);
    }
    
    // Fallback if APIs are offline
    return {
        title: defaultTitle,
        thumbnail: defaultThumb
    };
}

// Helper: Mobile YouTube App Redirection (Deep Link)
function playYouTubeVideo(url) {
    const id = getYouTubeId(url);
    if (!id) {
        window.open(url, '_blank');
        return;
    }
    
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isIOS) {
        // Force native YouTube app launch using ios url scheme
        const appUrl = `youtube://watch?v=${id}`;
        window.location.href = appUrl;
        
        // Fallback to web link if app isn't installed (user is redirected to AppStore or stays, we fall back after delay)
        setTimeout(() => {
            window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
        }, 1200);
    } else if (isAndroid) {
        // Use android intent to invoke the app directly
        const appUrl = `intent://www.youtube.com/watch?v=${id}#Intent;package=com.google.android.youtube;scheme=https;end`;
        window.location.href = appUrl;
        
        // Fallback to browser tab
        setTimeout(() => {
            window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
        }, 1200);
    } else {
        // Desktop: open in a new tab
        window.open(url, '_blank');
    }
}

// Supabase REST Client helper
const supabase = {
    getHeaders() {
        return {
            'apikey': state.settings.supabaseKey,
            'Authorization': `Bearer ${state.settings.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    },
    isActive() {
        return state.settings.mode === 'supabase' && state.settings.supabaseUrl && state.settings.supabaseKey;
    },
    async checkConnection(url, key) {
        try {
            const res = await fetch(`${url}/rest/v1/categories?select=*`, {
                headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
            });
            return res.ok;
        } catch (e) {
            console.error("Connection check failed:", e);
            return false;
        }
    },
    async fetchData() {
        const headers = this.getHeaders();
        const url = state.settings.supabaseUrl;
        
        try {
            // Fetch categories
            const catRes = await fetch(`${url}/rest/v1/categories?select=*&order=id.asc`, { headers });
            if (!catRes.ok) throw new Error("Failed to fetch categories");
            const categories = await catRes.json();
            
            // Fetch videos
            const vidRes = await fetch(`${url}/rest/v1/videos?select=*&order=date.desc`, { headers });
            if (!vidRes.ok) throw new Error("Failed to fetch videos");
            const videos = await vidRes.json();
            
            return { categories, videos };
        } catch (e) {
            console.error("Supabase load failed, falling back to local:", e);
            throw e;
        }
    },
    async saveCategory(category, isEdit = false) {
        if (!this.isActive()) return;
        const headers = this.getHeaders();
        const url = state.settings.supabaseUrl;
        
        const method = isEdit ? 'PATCH' : 'POST';
        const endpoint = isEdit ? `${url}/rest/v1/categories?id=eq.${category.id}` : `${url}/rest/v1/categories`;
        
        const res = await fetch(endpoint, {
            method,
            headers,
            body: JSON.stringify(category)
        });
        if (!res.ok) throw new Error("Failed to save category to Supabase");
    },
    async deleteCategory(id) {
        if (!this.isActive()) return;
        const headers = this.getHeaders();
        const url = state.settings.supabaseUrl;
        
        const res = await fetch(`${url}/rest/v1/categories?id=eq.${id}`, {
            method: 'DELETE',
            headers
        });
        if (!res.ok) throw new Error("Failed to delete category from Supabase");
    },
    async saveVideo(video, isEdit = false) {
        if (!this.isActive()) return;
        const headers = this.getHeaders();
        const url = state.settings.supabaseUrl;
        
        const method = isEdit ? 'PATCH' : 'POST';
        const endpoint = isEdit ? `${url}/rest/v1/videos?id=eq.${video.id}` : `${url}/rest/v1/videos`;
        
        const res = await fetch(endpoint, {
            method,
            headers,
            body: JSON.stringify(video)
        });
        if (!res.ok) throw new Error("Failed to save video to Supabase");
    },
    async deleteVideo(id) {
        if (!this.isActive()) return;
        const headers = this.getHeaders();
        const url = state.settings.supabaseUrl;
        
        const res = await fetch(`${url}/rest/v1/videos?id=eq.${id}`, {
            method: 'DELETE',
            headers
        });
        if (!res.ok) throw new Error("Failed to delete video from Supabase");
    }
};

// Environment Helper: Returns true only on local machine (localhost / 127.0.0.1 / file://)
// Add ?public=1 to URL on localhost to preview how the public site looks
function isLocalAdminEnv() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('public') === '1') return false;
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:';
}

// Data Storage & Loader Logic
const dataStore = {
    async init() {
        // Load Settings
        try {
            const savedSettings = localStorage.getItem('yt_archive_settings');
            if (savedSettings) {
                state.settings = JSON.parse(savedSettings) || { mode: 'local', supabaseUrl: '', supabaseKey: '' };
            }
        } catch (e) {
            console.warn("Failed to parse settings:", e);
        }
        if (!state.settings) {
            state.settings = { mode: 'local', supabaseUrl: '', supabaseKey: '' };
        }
        
        // 1. Try loading from Supabase if configured
        if (supabase.isActive()) {
            this.updateStatusBadge('connecting', '接続中...');
            try {
                const data = await supabase.fetchData();
                if (data && Array.isArray(data.videos) && Array.isArray(data.categories)) {
                    state.videos = data.videos;
                    state.categories = data.categories;
                    this.updateStatusBadge('online', 'クラウド連携中');
                    this.sanitizeState();
                    return;
                }
            } catch (e) {
                this.updateStatusBadge('error', '接続エラー');
                // fallback to local storage
            }
        }

        // 2. Public URL (GitHub Pages etc.): Always prioritize latest ./data.json so updates reflect immediately for all viewers
        if (!isLocalAdminEnv()) {
            try {
                const staticRes = await fetch(`./data.json?t=${Date.now()}`);
                if (staticRes.ok) {
                    const staticData = await staticRes.json();
                    if (staticData && Array.isArray(staticData.videos) && Array.isArray(staticData.categories)) {
                        state.videos = staticData.videos;
                        state.categories = staticData.categories;
                        this.sanitizeState();
                        return;
                    }
                }
            } catch (e) {
                console.warn("Failed to fetch data.json on public site, falling back to seeds:", e);
            }
        }

        // 3. Local Admin Mode: Load from LocalStorage if user has already edited or imported data (and seed version matches)
        try {
            const savedSeedVer = localStorage.getItem('yt_archive_seed_version');
            const localCats = localStorage.getItem('yt_archive_categories');
            const localVids = localStorage.getItem('yt_archive_videos');
            
            if (savedSeedVer === SEED_VERSION && localCats && localVids) {
                state.categories = JSON.parse(localCats) || [];
                state.videos = JSON.parse(localVids) || [];
                this.sanitizeState();
                this.updateStatusBadge('offline', 'ローカルモード');
                return;
            }
        } catch (e) {
            console.error("Local storage load failed:", e);
        }

        // 4. Try loading static deployment data.json if no local storage exists
        try {
            const staticRes = await fetch('./data.json');
            if (staticRes.ok) {
                const staticData = await staticRes.json();
                if (staticData && Array.isArray(staticData.videos) && Array.isArray(staticData.categories)) {
                    state.videos = staticData.videos;
                    state.categories = staticData.categories;
                    this.sanitizeState();
                    this.saveLocal();
                    this.updateStatusBadge('static', 'ローカルモード (初期データ読込)');
                    return;
                }
            }
        } catch (e) {
            // No static data.json file found or fetch blocked, continue to defaults
        }

        // 5. Fallback to default seeds
        state.categories = [...defaultCategories];
        state.videos = [...defaultVideos];
        this.sanitizeState();
        this.saveLocal();
        this.updateStatusBadge('offline', 'ローカルモード');
    },

    sanitizeState() {
        if (!Array.isArray(state.categories)) state.categories = [...defaultCategories];
        if (!Array.isArray(state.videos)) state.videos = [...defaultVideos];
        
        // Remove nulls, undefineds, or invalid objects from videos
        state.videos = state.videos.filter(v => v && typeof v === 'object' && v.id && v.title && v.url);
        // Remove nulls/undefineds from categories
        state.categories = state.categories.filter(c => c && typeof c === 'object' && c.id && c.name);
    },
    
    saveLocal() {
        try {
            this.sanitizeState();
            localStorage.setItem('yt_archive_seed_version', SEED_VERSION);
            localStorage.setItem('yt_archive_categories', JSON.stringify(state.categories));
            localStorage.setItem('yt_archive_videos', JSON.stringify(state.videos));
            localStorage.setItem('yt_archive_settings', JSON.stringify(state.settings));
        } catch (e) {
            console.error("Failed to save to local storage:", e);
        }
    },
    
    updateStatusBadge(status, text) {
        const badge = document.getElementById('db-status-badge');
        const badgeText = document.getElementById('db-status-text');
        if (!badge || !badgeText) return;
        
        badge.className = 'db-status-badge ' + status;
        badgeText.textContent = text;
    }
};

// UI Rendering Engine
const ui = {
    init() {
        this.applyEnvironmentVisibility();
        this.bindNavigation();
        this.bindAdminTabs();
        this.bindPortalFilters();
        this.bindForms();
        this.bindBulkImport();
        this.bindModals();
        
        // Initial Draw
        this.renderAll();
    },

    applyEnvironmentVisibility() {
        if (!isLocalAdminEnv()) {
            document.body.classList.add('public-mode');
            const adminNavItem = document.querySelector('.nav-item[data-view="admin"]');
            if (adminNavItem) adminNavItem.style.display = 'none';
            const navFooter = document.querySelector('.nav-footer');
            if (navFooter) navFooter.style.display = 'none';
            const adminView = document.getElementById('admin-view');
            if (adminView) adminView.style.display = 'none';
            const editModal = document.getElementById('video-edit-modal');
            if (editModal) editModal.style.display = 'none';
        }
    },
    
    renderAll() {
        this.renderPortalCategories();
        this.renderPortalVideos();
        this.renderAdminVideoTable();
        this.renderAdminCategoryTable();
        this.populateCategoryDropdowns();
        this.renderHeroSection();
        this.populateSettingsForm();
    },
    
    bindNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                
                // Toggle active nav
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Toggle view section
                document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                document.getElementById(`${view}-view`).classList.add('active');
                
                // Title update
                const pageTitle = document.getElementById('page-title');
                const pageSubtitle = document.getElementById('page-subtitle');
                if (view === 'portal') {
                    pageTitle.textContent = '緑FC 49期 5年';
                    pageSubtitle.textContent = 'アーカイブ動画の一覧';
                } else {
                    pageTitle.textContent = '管理画面';
                    pageSubtitle.textContent = '動画・カテゴリ・データベースの管理';
                }
                
                // Re-render admin content if switching to admin
                if (view === 'admin') {
                    this.renderAdminVideoTable();
                    this.renderAdminCategoryTable();
                    this.populateCategoryDropdowns();
                } else {
                    this.renderPortalVideos();
                    this.renderHeroSection();
                }
                
                window.scrollTo(0, 0);
            });
        });
        
        // Clock helper
        setInterval(() => {
            const now = new Date();
            const clock = document.getElementById('clock-display');
            if (clock) {
                clock.textContent = now.toLocaleDateString('ja-JP') + ' ' + now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            }
        }, 1000);
    },
    
    bindAdminTabs() {
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const target = btn.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });
    },
    
    bindPortalFilters() {
        // Search
        const searchInput = document.getElementById('video-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                this.renderPortalVideos();
            });
        }
        
        // Sorting
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                state.sortBy = e.target.value;
                this.renderPortalVideos();
            });
        }
    },
    
    bindForms() {
        // --- Add Video Metadata Auto-Fetch ---
        const btnFetch = document.getElementById('btn-fetch-meta');
        const urlInput = document.getElementById('video-url');
        
        if (btnFetch && urlInput) {
            btnFetch.addEventListener('click', async () => {
                const url = urlInput.value.trim();
                const id = getYouTubeId(url);
                
                if (!id) {
                    alert('正しいYouTubeの動画URLを入力してください。');
                    return;
                }
                
                btnFetch.disabled = true;
                btnFetch.innerHTML = `<span class="spinner" style="width: 14px; height: 14px; border-width: 2px;"></span> 取得中...`;
                
                const meta = await fetchYouTubeInfo(url);
                btnFetch.disabled = false;
                btnFetch.innerHTML = `<i class="ph ph-download-simple"></i> 情報取得`;
                
                if (meta) {
                    document.getElementById('video-title').value = meta.title;
                    document.getElementById('video-thumbnail-url').value = meta.thumbnail;
                    
                    // Show preview image
                    const previewImg = document.getElementById('add-video-thumb-preview');
                    previewImg.src = meta.thumbnail;
                    previewImg.style.display = 'block';
                } else {
                    alert('YouTubeから動画情報を取得できませんでした。手動で設定してください。');
                }
            });
            
            // Auto fetch on paste/blur if URL is entered
            urlInput.addEventListener('blur', () => {
                const titleVal = document.getElementById('video-title').value;
                // Only auto-trigger if title is empty to prevent overwriting user edits
                if (urlInput.value && !titleVal) {
                    btnFetch.click();
                }
            });
        }
        
        // --- Add Video Submission ---
        const addVideoForm = document.getElementById('add-video-form');
        if (addVideoForm) {
            addVideoForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const url = document.getElementById('video-url').value.trim();
                const ytId = getYouTubeId(url);
                
                if (!ytId) {
                    alert('動画URLが正しくありません。');
                    return;
                }
                
                const newVideo = {
                    id: 'vid-' + Date.now(),
                    title: document.getElementById('video-title').value,
                    url: url,
                    youtubeId: ytId,
                    thumbnail: document.getElementById('video-thumbnail-url').value || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
                    date: document.getElementById('video-date').value,
                    opponent: document.getElementById('video-opponent').value || '設定なし',
                    location: document.getElementById('video-location').value || '設定なし',
                    notes: document.getElementById('video-notes').value || '',
                    categoryId: document.getElementById('video-category').value
                };
                
                try {
                    if (supabase.isActive()) {
                        await supabase.saveVideo(newVideo, false);
                    }
                    
                    state.videos.unshift(newVideo);
                    dataStore.saveLocal();
                    
                    addVideoForm.reset();
                    document.getElementById('add-video-thumb-preview').style.display = 'none';
                    alert('新しい動画をアーカイブに登録しました！');
                    
                    // Switch back to List View
                    document.querySelector('.admin-tab-btn[data-target="admin-videos"]').click();
                    this.renderAdminVideoTable();
                } catch (err) {
                    alert('データベースへの保存に失敗しました。: ' + err.message);
                }
            });
            
            // Reset handler
            document.getElementById('add-form-reset').addEventListener('click', () => {
                document.getElementById('add-video-thumb-preview').style.display = 'none';
            });
        }
        
        // --- Category Management Form Submit (Add / Edit) ---
        const addCategoryForm = document.getElementById('add-category-form');
        if (addCategoryForm) {
            addCategoryForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const editId = document.getElementById('edit-category-id').value;
                const name = document.getElementById('category-name').value.trim();
                const color = document.querySelector('input[name="category-color"]:checked').value;
                
                const isEdit = !!editId;
                const categoryData = {
                    id: isEdit ? editId : 'cat-' + Date.now(),
                    name,
                    color
                };
                
                try {
                    if (supabase.isActive()) {
                        await supabase.saveCategory(categoryData, isEdit);
                    }
                    
                    if (isEdit) {
                        const index = state.categories.findIndex(c => c.id === editId);
                        if (index !== -1) state.categories[index] = categoryData;
                    } else {
                        state.categories.push(categoryData);
                    }
                    
                    dataStore.saveLocal();
                    
                    // Reset category form state
                    document.getElementById('edit-category-id').value = '';
                    document.getElementById('category-name').value = '';
                    document.querySelector('input[name="category-color"][value="emerald"]').checked = true;
                    document.getElementById('category-form-title').textContent = '新規カテゴリの追加';
                    document.getElementById('btn-cancel-category-edit').style.display = 'none';
                    
                    this.renderAdminCategoryTable();
                    this.renderPortalCategories();
                    this.populateCategoryDropdowns();
                    alert(isEdit ? 'カテゴリを更新しました。' : 'カテゴリを追加しました！');
                } catch (err) {
                    alert('データベースへの保存に失敗しました。: ' + err.message);
                }
            });
            
            document.getElementById('btn-cancel-category-edit').addEventListener('click', () => {
                document.getElementById('edit-category-id').value = '';
                document.getElementById('category-name').value = '';
                document.querySelector('input[name="category-color"][value="emerald"]').checked = true;
                document.getElementById('category-form-title').textContent = '新規カテゴリの追加';
                document.getElementById('btn-cancel-category-edit').style.display = 'none';
            });
        }
        
        // --- Edit Video Form (Modal) ---
        const editVideoForm = document.getElementById('edit-video-form');
        if (editVideoForm) {
            // Edit Video oEmbed Auto fetch
            const btnEditFetch = document.getElementById('edit-btn-fetch-meta');
            btnEditFetch.addEventListener('click', async () => {
                const url = document.getElementById('edit-video-url').value.trim();
                const id = getYouTubeId(url);
                if (!id) {
                    alert('URLが正しくありません。');
                    return;
                }
                
                btnEditFetch.disabled = true;
                const meta = await fetchYouTubeInfo(url);
                btnEditFetch.disabled = false;
                
                if (meta) {
                    document.getElementById('edit-video-title').value = meta.title;
                    document.getElementById('edit-video-thumbnail-url').value = meta.thumbnail;
                }
            });
            
            editVideoForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('edit-video-id').value;
                const url = document.getElementById('edit-video-url').value.trim();
                const ytId = getYouTubeId(url);
                
                if (!ytId) {
                    alert('URLが正しくありません。');
                    return;
                }
                
                const updatedVideo = {
                    id,
                    title: document.getElementById('edit-video-title').value,
                    url: url,
                    youtubeId: ytId,
                    thumbnail: document.getElementById('edit-video-thumbnail-url').value || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
                    date: document.getElementById('edit-video-date').value,
                    opponent: document.getElementById('edit-video-opponent').value || '設定なし',
                    location: document.getElementById('edit-video-location').value || '設定なし',
                    notes: document.getElementById('edit-video-notes').value || '',
                    categoryId: document.getElementById('edit-video-category').value
                };
                
                try {
                    if (supabase.isActive()) {
                        await supabase.saveVideo(updatedVideo, true);
                    }
                    
                    const index = state.videos.findIndex(v => v.id === id);
                    if (index !== -1) {
                        state.videos[index] = updatedVideo;
                    }
                    
                    dataStore.saveLocal();
                    
                    document.getElementById('video-edit-modal').classList.remove('active');
                    this.renderAdminVideoTable();
                    alert('動画情報を更新しました！');
                } catch (err) {
                    alert('データベースへの保存に失敗しました。: ' + err.message);
                }
            });
        }
        
        // --- Database Settings / Connections ---
        const settingsForm = document.getElementById('supabase-config-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const url = document.getElementById('supabase-url').value.trim();
                const key = document.getElementById('supabase-key').value.trim();
                
                if (!url || !key) {
                    alert('接続用のURLとAnonキーを入力してください。');
                    return;
                }
                
                const btnSave = document.getElementById('btn-save-supabase');
                btnSave.disabled = true;
                btnSave.innerHTML = `<span class="spinner" style="width: 14px; height: 14px; border-width: 2px;"></span> 接続確認中...`;
                
                const isOk = await supabase.checkConnection(url, key);
                btnSave.disabled = false;
                btnSave.innerHTML = `<i class="ph ph-plugs"></i> 接続設定を保存して有効化`;
                
                if (isOk) {
                    state.settings.mode = 'supabase';
                    state.settings.supabaseUrl = url;
                    state.settings.supabaseKey = key;
                    dataStore.saveLocal();
                    
                    alert('Supabaseとの接続確認に成功し、設定を有効にしました！ページをリロードしてデータを同期します。');
                    window.location.reload();
                } else {
                    alert('Supabaseへの接続に失敗しました。URLまたはAPIキーが間違っているか、テーブル（categories, videos）が存在しない可能性があります。設定は保存されませんでした。');
                }
            });
            
            document.getElementById('btn-disconnect-supabase').addEventListener('click', () => {
                if (confirm('Supabaseとの連携を解除し、ローカルモードに戻しますか？')) {
                    state.settings.mode = 'local';
                    state.settings.supabaseUrl = '';
                    state.settings.supabaseKey = '';
                    dataStore.saveLocal();
                    window.location.reload();
                }
            });
        }
        
        // --- Download Data.json Button ---
        const btnDownload = document.getElementById('btn-download-db');
        if (btnDownload) {
            btnDownload.addEventListener('click', () => {
                const dbExport = {
                    categories: state.categories,
                    videos: state.videos
                };
                
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbExport, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href",     dataStr);
                downloadAnchor.setAttribute("download", "data.json");
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
            });
        }
        
        // --- Import Data.json Button ---
        const btnImport = document.getElementById('btn-import-db');
        const fileInput = document.getElementById('import-db-file');
        if (btnImport && fileInput) {
            btnImport.addEventListener('click', () => {
                const file = fileInput.files[0];
                if (!file) {
                    alert('インポートするJSONファイルを選択してください。');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        if (!importedData.videos || !importedData.categories) {
                            throw new Error('動画またはカテゴリのデータ配列が含まれていません。');
                        }
                        
                        if (confirm('本当に現在の全データを上書きしてインポートしますか？')) {
                            // If Supabase is active, sync items one by one (destructive)
                            if (supabase.isActive()) {
                                alert('現在クラウド連携モードです。インポートはローカルストレージにのみ上書きされます。Supabaseへの同期には対応していません。');
                            }
                            
                            state.categories = importedData.categories;
                            state.videos = importedData.videos;
                            dataStore.saveLocal();
                            
                            alert('データのインポートが完了しました！');
                            this.renderAll();
                            fileInput.value = '';
                        }
                    } catch (err) {
                        alert('インポートファイルの解析に失敗しました。: ' + err.message);
                    }
                };
                reader.readAsText(file);
            });
        }
        
        // --- Admin Videos Search ---
        const adminSearch = document.getElementById('admin-video-search');
        if (adminSearch) {
            adminSearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.renderAdminVideoTable(query);
            });
        }
    },
    
    bindModals() {
        // Handle closing modals on Close buttons or overlays
        document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
            });
        });
        
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        });
    },
    
    populateSettingsForm() {
        const urlInput = document.getElementById('supabase-url');
        const keyInput = document.getElementById('supabase-key');
        const disconnectBtn = document.getElementById('btn-disconnect-supabase');
        
        if (urlInput && keyInput) {
            urlInput.value = state.settings.supabaseUrl || '';
            keyInput.value = state.settings.supabaseKey || '';
            
            if (state.settings.mode === 'supabase') {
                disconnectBtn.style.display = 'inline-flex';
            } else {
                disconnectBtn.style.display = 'none';
            }
        }
    },
    
    populateCategoryDropdowns() {
        const addDropdown = document.getElementById('video-category');
        const editDropdown = document.getElementById('edit-video-category');
        
        if (addDropdown && editDropdown) {
            const optionsHtml = state.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            addDropdown.innerHTML = optionsHtml;
            editDropdown.innerHTML = optionsHtml;
        }
    },
    
    renderPortalCategories() {
        const tabsContainer = document.getElementById('portal-category-tabs');
        if (!tabsContainer) return;
        
        const allTabHtml = `<div class="category-tab ${state.activeCategoryFilter === 'all' ? 'active' : ''}" data-cat-id="all">すべて</div>`;
        const restTabsHtml = state.categories.map(c => {
            const isActive = state.activeCategoryFilter === c.id;
            return `<div class="category-tab ${isActive ? 'active badge-' + c.color : ''}" data-cat-id="${c.id}">${c.name}</div>`;
        }).join('');
        
        tabsContainer.innerHTML = allTabHtml + restTabsHtml;
        
        // Bind click events on dynamic tabs
        tabsContainer.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                state.activeCategoryFilter = tab.getAttribute('data-cat-id');
                this.renderPortalCategories();
                this.renderPortalVideos();
            });
        });
    },
    
    getFilteredVideos() {
        let list = [...state.videos];
        
        // 1. Filter by category
        if (state.activeCategoryFilter !== 'all') {
            list = list.filter(v => v.categoryId === state.activeCategoryFilter);
        }
        
        // 2. Filter by search query
        if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase();
            list = list.filter(v => 
                v.title.toLowerCase().includes(q) ||
                (v.opponent && v.opponent.toLowerCase().includes(q)) ||
                (v.location && v.location.toLowerCase().includes(q)) ||
                (v.notes && v.notes.toLowerCase().includes(q))
            );
        }
        
        // 3. Sort
        list.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            if (state.sortBy === 'date-desc') return dateB - dateA;
            if (state.sortBy === 'date-asc') return dateA - dateB;
            if (state.sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '', 'ja');
            return 0;
        });
        
        return list;
    },
    
    renderHeroSection() {
        const heroSection = document.getElementById('hero-section');
        if (!heroSection) return;
        
        if (state.videos.length === 0) {
            heroSection.style.display = 'none';
            return;
        }
        
        heroSection.style.display = 'block';
        const latestVideo = state.videos[0]; // First video is always the highlight
        const cat = state.categories.find(c => c.id === latestVideo.categoryId) || { name: 'その他', color: 'slate' };
        
        heroSection.innerHTML = `
            <div class="hero-bg-blur" style="background-image: url('${latestVideo.thumbnail}')"></div>
            <div class="hero-content">
                <div class="hero-info">
                    <span class="hero-badge"><i class="ph-fill ph-sparkle animate-pulse"></i> 最新のアーカイブ</span>
                    <h2 class="hero-title">${latestVideo.title}</h2>
                    <div class="hero-meta">
                        <span class="hero-meta-item"><i class="ph ph-calendar"></i> ${latestVideo.date}</span>
                        <span class="hero-meta-item"><i class="ph ph-users"></i> ${latestVideo.opponent}</span>
                        <span class="hero-meta-item"><i class="ph ph-map-pin"></i> ${latestVideo.location}</span>
                        <span class="category-badge badge-${cat.color}">${cat.name}</span>
                    </div>
                    <button class="btn btn-primary btn-lg" onclick="playYouTubeVideo('${latestVideo.url}')">
                        <i class="ph-fill ph-play"></i> YouTubeで再生する
                    </button>
                    <button class="btn btn-secondary btn-lg" style="margin-left: 12px;" onclick="ui.openDetailModal('${latestVideo.id}')">
                        <i class="ph ph-info"></i> 詳細を見る
                    </button>
                </div>
                <div class="hero-thumbnail-wrapper" onclick="playYouTubeVideo('${latestVideo.url}')">
                    <img src="${latestVideo.thumbnail}" alt="${latestVideo.title}">
                    <div class="hero-play-overlay">
                        <div class="hero-play-btn"><i class="ph-fill ph-play" style="margin-left: 5px;"></i></div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderPortalVideos() {
        const container = document.getElementById('all-videos-grid');
        if (!container) return;
        
        const filtered = this.getFilteredVideos();
        
        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-video-slash"></i>
                    <p class="text-secondary">表示するアーカイブ動画がありません。</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filtered.map(v => {
            const cat = state.categories.find(c => c.id === v.categoryId) || { name: 'その他', color: 'slate' };
            return `
                <div class="video-card">
                    <div class="video-card-thumb" onclick="playYouTubeVideo('${v.url}')">
                        <img src="${v.thumbnail}" alt="${v.title}" loading="lazy">
                        <div class="video-card-play">
                            <i class="ph-fill ph-play" style="margin-left: 4px;"></i>
                        </div>
                    </div>
                    <div class="video-card-body">
                        <div class="card-top-meta">
                            <span class="category-badge badge-${cat.color}">${cat.name}</span>
                        </div>
                        <h4 class="video-card-title" onclick="playYouTubeVideo('${v.url}')">${v.title}</h4>
                        <div class="card-meta-list">
                            <span class="card-meta-item"><i class="ph ph-calendar"></i> ${v.date}</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-secondary btn-sm" onclick="ui.openDetailModal('${v.id}')">
                            <i class="ph ph-info"></i> 詳細
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    renderAdminVideoTable(query = '') {
        const tbody = document.getElementById('admin-videos-table-body');
        if (!tbody) return;
        
        let filtered = [...state.videos];
        if (query) {
            filtered = filtered.filter(v => 
                v.title.toLowerCase().includes(query) ||
                (v.opponent && v.opponent.toLowerCase().includes(query))
            );
        }
        
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary">動画が登録されていません。</td></tr>`;
            return;
        }
        
        tbody.innerHTML = filtered.map(v => {
            const cat = state.categories.find(c => c.id === v.categoryId) || { name: 'その他', color: 'slate' };
            return `
                <tr>
                    <td class="td-thumb">
                        <img src="${v.thumbnail}" alt="Thumbnail">
                    </td>
                    <td>
                        <div style="font-weight: 600; color: white;">${v.title}</div>
                        <a href="${v.url}" target="_blank" class="text-xs text-secondary" style="display:inline-flex; align-items:center; gap:4px; margin-top:4px;">
                            <i class="ph ph-youtube-logo text-primary"></i> リンクを開く <i class="ph ph-arrow-square-out text-xs"></i>
                        </a>
                    </td>
                    <td>
                        <span class="category-badge badge-${cat.color}">${cat.name}</span>
                    </td>
                    <td>
                        <div class="text-sm"><i class="ph ph-calendar text-xs"></i> ${v.date}</div>
                        ${v.opponent ? `<div class="text-xs text-secondary"><i class="ph ph-users text-xs"></i> ${v.opponent}</div>` : ''}
                        ${v.location ? `<div class="text-xs text-secondary"><i class="ph ph-map-pin text-xs"></i> ${v.location}</div>` : ''}
                    </td>
                    <td>
                        <div class="form-actions" style="gap: 6px;">
                            <button class="btn btn-secondary btn-sm" onclick="ui.openEditVideoModal('${v.id}')">
                                <i class="ph ph-pencil"></i> 編集
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="ui.deleteVideo('${v.id}')">
                                <i class="ph ph-trash"></i> 削除
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },
    
    renderAdminCategoryTable() {
        const tbody = document.getElementById('admin-categories-table-body');
        if (!tbody) return;
        
        if (state.categories.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-secondary">カテゴリがありません。</td></tr>`;
            return;
        }
        
        tbody.innerHTML = state.categories.map((c, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === state.categories.length - 1;
            return `
                <tr draggable="true" data-cat-index="${idx}" style="cursor: grab;">
                    <td>
                        <div style="display: inline-flex; align-items: center; gap: 4px;">
                            <i class="ph ph-dots-six-vertical text-secondary" style="font-size: 1.1rem; margin-right: 2px;" title="ドラッグして移動"></i>
                            <button type="button" class="btn btn-secondary btn-sm" style="padding: 4px 7px;" onclick="ui.moveCategory(${idx}, -1)" ${isFirst ? 'disabled style="padding: 4px 7px; opacity: 0.35; cursor: not-allowed;"' : ''} title="上へ移動">
                                <i class="ph ph-caret-up"></i>
                            </button>
                            <button type="button" class="btn btn-secondary btn-sm" style="padding: 4px 7px;" onclick="ui.moveCategory(${idx}, 1)" ${isLast ? 'disabled style="padding: 4px 7px; opacity: 0.35; cursor: not-allowed;"' : ''} title="下へ移動">
                                <i class="ph ph-caret-down"></i>
                            </button>
                        </div>
                    </td>
                    <td style="font-weight: 600; color: white;">${c.name}</td>
                    <td>
                        <span class="color-badge bg-${c.color}">${c.color}</span>
                    </td>
                    <td>
                        <div class="form-actions" style="gap: 6px;">
                            <button class="btn btn-secondary btn-sm" onclick="ui.startCategoryEdit('${c.id}')">
                                <i class="ph ph-pencil"></i> 編集
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="ui.deleteCategory('${c.id}')">
                                <i class="ph ph-trash"></i> 削除
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Bind drag-and-drop reordering on category rows
        let draggedIndex = null;
        tbody.querySelectorAll('tr[draggable="true"]').forEach(row => {
            row.addEventListener('dragstart', (e) => {
                draggedIndex = parseInt(row.getAttribute('data-cat-index'), 10);
                row.style.opacity = '0.4';
                e.dataTransfer.effectAllowed = 'move';
            });
            row.addEventListener('dragend', () => {
                row.style.opacity = '1';
                tbody.querySelectorAll('tr').forEach(r => r.style.borderTop = '');
            });
            row.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                tbody.querySelectorAll('tr').forEach(r => r.style.borderTop = '');
                row.style.borderTop = '2px solid var(--primary-color)';
            });
            row.addEventListener('dragleave', () => {
                row.style.borderTop = '';
            });
            row.addEventListener('drop', (e) => {
                e.preventDefault();
                row.style.borderTop = '';
                const targetIndex = parseInt(row.getAttribute('data-cat-index'), 10);
                if (draggedIndex !== null && draggedIndex !== targetIndex) {
                    this.reorderCategory(draggedIndex, targetIndex);
                }
                draggedIndex = null;
            });
        });
    },

    moveCategory(index, direction) {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= state.categories.length) return;
        this.reorderCategory(index, targetIndex);
    },

    reorderCategory(fromIndex, toIndex) {
        const [movedItem] = state.categories.splice(fromIndex, 1);
        state.categories.splice(toIndex, 0, movedItem);
        dataStore.saveLocal();
        this.renderAdminCategoryTable();
        this.renderPortalCategories();
        this.populateCategoryDropdowns();
    },
    
    openDetailModal(id) {
        const v = state.videos.find(item => item.id === id);
        if (!v) return;
        
        const cat = state.categories.find(c => c.id === v.categoryId) || { name: 'その他', color: 'slate' };
        
        document.getElementById('modal-banner-img').style.backgroundImage = `url('${v.thumbnail}')`;
        document.getElementById('modal-video-title').textContent = v.title;
        document.getElementById('modal-video-category').className = `category-badge badge-${cat.color}`;
        document.getElementById('modal-video-category').textContent = cat.name;
        document.getElementById('modal-video-date').textContent = v.date;
        document.getElementById('modal-video-opponent').textContent = v.opponent || '設定なし';
        document.getElementById('modal-video-location').textContent = v.location || '設定なし';
        
        const urlLink = document.getElementById('modal-video-url');
        urlLink.href = v.url;
        urlLink.textContent = v.url;
        
        document.getElementById('modal-video-notes').innerHTML = v.notes ? v.notes.replace(/\n/g, '<br>') : '<span class="text-muted">メモ・備考はありません。</span>';
        
        // Play button inside modal redirection
        const playBtn = document.getElementById('modal-play-btn');
        // Clear previous event listener
        const newPlayBtn = playBtn.cloneNode(true);
        playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
        newPlayBtn.addEventListener('click', () => {
            playYouTubeVideo(v.url);
        });
        
        document.getElementById('video-detail-modal').classList.add('active');
    },

    openEditVideoModal(id) {
        const v = state.videos.find(item => item.id === id);
        if (!v) return;
        
        this.populateCategoryDropdowns();
        
        document.getElementById('edit-video-id').value = v.id;
        document.getElementById('edit-video-url').value = v.url;
        document.getElementById('edit-video-title').value = v.title;
        document.getElementById('edit-video-category').value = v.categoryId;
        document.getElementById('edit-video-date').value = v.date;
        document.getElementById('edit-video-opponent').value = v.opponent || '';
        document.getElementById('edit-video-location').value = v.location || '';
        document.getElementById('edit-video-thumbnail-url').value = v.thumbnail;
        document.getElementById('edit-video-notes').value = v.notes || '';
        
        document.getElementById('video-edit-modal').classList.add('active');
    },
    
    async deleteVideo(id) {
        if (confirm('この動画をアーカイブから削除しますか？')) {
            try {
                if (supabase.isActive()) {
                    await supabase.deleteVideo(id);
                }
                
                state.videos = state.videos.filter(v => v.id !== id);
                dataStore.saveLocal();
                this.renderAdminVideoTable();
                alert('動画を削除しました。');
            } catch (err) {
                alert('削除に失敗しました。: ' + err.message);
            }
        }
    },
    
    startCategoryEdit(id) {
        const c = state.categories.find(item => item.id === id);
        if (!c) return;
        
        document.getElementById('edit-category-id').value = c.id;
        document.getElementById('category-name').value = c.name;
        document.querySelector(`input[name="category-color"][value="${c.color}"]`).checked = true;
        document.getElementById('category-form-title').textContent = 'カテゴリ情報の編集';
        document.getElementById('btn-cancel-category-edit').style.display = 'inline-flex';
        
        // Scroll to category form
        document.getElementById('add-category-form').scrollIntoView({ behavior: 'smooth' });
    },
    
    async deleteCategory(id) {
        const targetCat = state.categories.find(c => c.id === id);
        if (targetCat && targetCat.name === 'その他') {
            alert('この標準カテゴリは削除できません。');
            return;
        }
        
        if (confirm('このカテゴリを削除しますか？\n※このカテゴリに属する動画は「その他」カテゴリに自動的に変更されます。')) {
            try {
                if (supabase.isActive()) {
                    await supabase.deleteCategory(id);
                }
                
                state.categories = state.categories.filter(c => c.id !== id);
                const othersCat = state.categories.find(c => c.name === 'その他') || state.categories[state.categories.length - 1];
                const fallbackId = othersCat ? othersCat.id : 'cat-8';
                
                // Re-assign videos in deleted category to Others
                state.videos = state.videos.map(v => {
                    if (v.categoryId === id) {
                        return { ...v, categoryId: fallbackId };
                    }
                    return v;
                });
                
                dataStore.saveLocal();
                this.renderAdminCategoryTable();
                this.renderPortalCategories();
                this.renderPortalVideos();
                this.populateCategoryDropdowns();
                alert('カテゴリを削除しました。');
            } catch (err) {
                alert('削除に失敗しました。: ' + err.message);
            }
        }
    },

    bindBulkImport() {
        const fileInput = document.getElementById('bulk-file-input');
        const btnTemplate = document.getElementById('btn-download-template');
        const btnExecute = document.getElementById('btn-execute-bulk-import');
        const btnCancel = document.getElementById('btn-cancel-bulk-import');
        let bulkParsedVideos = [];
        let pendingNewCategories = [];
        const categoryColors = ['emerald', 'blue', 'purple', 'amber', 'rose', 'slate'];

        // 1. Download Template Excel
        if (btnTemplate) {
            btnTemplate.addEventListener('click', () => {
                const templateData = [
                    {
                        "URL": "https://www.youtube.com/watch?v=M7lc1UVf-VE",
                        "タイトル": "2026年夏季地区予選 決勝戦 (空欄なら自動取得)",
                        "日付": "2026-07-15",
                        "カテゴリ": "公式戦",
                        "対戦相手": "西海高校",
                        "場所": "市民スポーツセンター",
                        "備考": "延長戦の末に3-2で勝利！"
                    },
                    {
                        "URL": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "タイトル": "Aチーム 練習試合 (タイトル指定例)",
                        "日付": "2026-07-10",
                        "カテゴリ": "練習試合",
                        "対戦相手": "南陵クラブ",
                        "場所": "本校第1グラウンド",
                        "備考": "新メンバーの連携テスト。"
                    }
                ];
                const worksheet = XLSX.utils.json_to_sheet(templateData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "一括登録テンプレート");
                XLSX.writeFile(workbook, "youtube_import_template.xlsx");
            });
        }

        // 2. Parse uploaded Excel/CSV
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (typeof XLSX === 'undefined') {
                    alert('エラー: Excelファイルを解析するライブラリ(SheetJS)が正しく読み込まれていません。ページを再読み込みするか、ネットワーク接続を確認してください。');
                    fileInput.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const rawBytes = new Uint8Array(event.target.result);
                        let workbook;
                        
                        // Handle CSV character encoding (UTF-8 vs Shift-JIS on Windows Excel)
                        if (file.name.toLowerCase().endsWith('.csv')) {
                            let text = new TextDecoder('utf-8').decode(rawBytes);
                            if (text.includes('\uFFFD')) {
                                text = new TextDecoder('shift-jis').decode(rawBytes);
                            }
                            workbook = XLSX.read(text, { type: 'string' });
                        } else {
                            workbook = XLSX.read(rawBytes, { type: 'array' });
                        }

                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];
                        
                        const rawRows = XLSX.utils.sheet_to_json(worksheet);
                        if (rawRows.length === 0) {
                            alert('ファイル内に有効なデータが見つかりませんでした。');
                            fileInput.value = '';
                            return;
                        }

                        // Helper to find header key ignoring BOM, spaces, and case
                        const cleanKey = (k) => k.replace(/^[\uFEFF\s]+|[\s]+$/g, '');
                        const getUrlKey = (row) => {
                            return Object.keys(row).find(key => cleanKey(key).toUpperCase() === 'URL');
                        };

                        const validRows = rawRows.filter(row => {
                            const urlKey = getUrlKey(row);
                            return urlKey && row[urlKey] && row[urlKey].toString().trim().length > 0;
                        });

                        if (validRows.length === 0) {
                            alert('有効なYouTube URLを含む行が見つかりませんでした。「URL」という見出しの列が必要です。');
                            fileInput.value = '';
                            return;
                        }

                        const progressContainer = document.getElementById('bulk-progress-container');
                        const progressBarFill = document.getElementById('bulk-progress-bar-fill');
                        const progressStatus = document.getElementById('bulk-progress-status');
                        const progressPercent = document.getElementById('bulk-progress-percentage');
                        
                        progressContainer.style.display = 'block';
                        document.getElementById('bulk-preview-section').style.display = 'none';
                        bulkParsedVideos = [];
                        pendingNewCategories = [];

                        const total = validRows.length;
                        progressBarFill.style.width = '0%';
                        progressPercent.textContent = '0%';
                        progressStatus.textContent = `YouTube情報取得開始... (0/${total})`;

                        // Process rows sequentially to avoid hitting oEmbed API rate limits
                        for (let i = 0; i < total; i++) {
                            const row = validRows[i];
                            const urlKey = getUrlKey(row);
                            const url = row[urlKey].toString().trim();
                            const ytId = getYouTubeId(url);

                            if (!ytId) {
                                console.warn(`無効なYouTube URLがスキップされました: ${url}`);
                                continue;
                            }

                            // Match category by name, or create a new category if not found
                            const catKey = Object.keys(row).find(k => cleanKey(k) === 'カテゴリ');
                            const catName = (catKey && row[catKey]) ? row[catKey].toString().trim() : 'その他';
                            let matchedCat = state.categories.find(c => c.name === catName)
                                || state.categories.find(c => c.name.toLowerCase() === catName.toLowerCase())
                                || pendingNewCategories.find(c => c.name === catName)
                                || pendingNewCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());

                            if (!matchedCat) {
                                const colorIndex = (state.categories.length + pendingNewCategories.length) % categoryColors.length;
                                matchedCat = {
                                    id: 'cat-bulk-' + Date.now() + '-' + pendingNewCategories.length,
                                    name: catName,
                                    color: categoryColors[colorIndex]
                                };
                                pendingNewCategories.push(matchedCat);
                            }
                            const categoryId = matchedCat.id;

                            // Determine Title (use explicit cell title, or auto fetch)
                            const titleKey = Object.keys(row).find(k => cleanKey(k) === 'タイトル');
                            let title = (titleKey && row[titleKey]) ? row[titleKey].toString().trim() : '';
                            let thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

                            if (!title) {
                                progressStatus.textContent = `メタデータ取得中... [${i + 1}/${total}]`;
                                const meta = await fetchYouTubeInfo(url);
                                if (meta) {
                                    title = meta.title;
                                    thumbnail = meta.thumbnail;
                                } else {
                                    title = `YouTube動画 (${ytId})`;
                                }
                            }

                            // Handle Date
                            const dateKey = Object.keys(row).find(k => cleanKey(k) === '日付');
                            let dateVal = dateKey && row[dateKey] ? row[dateKey] : '';
                            let date = '';
                            
                            if (!dateVal) {
                                const today = new Date();
                                date = today.toISOString().split('T')[0];
                            } else if (typeof dateVal === 'number') {
                                // Parse Excel serial date number
                                const parsedDate = new Date((dateVal - 25569) * 86400 * 1000);
                                date = parsedDate.toISOString().split('T')[0];
                            } else {
                                const parsedDate = new Date(dateVal.toString());
                                if (isNaN(parsedDate.getTime())) {
                                    const today = new Date();
                                    date = today.toISOString().split('T')[0];
                                } else {
                                    date = parsedDate.toISOString().split('T')[0];
                                }
                            }

                            // Rest metadata
                            const opponentKey = Object.keys(row).find(k => cleanKey(k) === '対戦相手');
                            const opponent = (opponentKey && row[opponentKey]) ? row[opponentKey].toString().trim() : '';

                            const locationKey = Object.keys(row).find(k => cleanKey(k) === '場所');
                            const location = (locationKey && row[locationKey]) ? row[locationKey].toString().trim() : '';

                            const notesKey = Object.keys(row).find(k => cleanKey(k) === '備考');
                            const notes = (notesKey && row[notesKey]) ? row[notesKey].toString().trim() : '';

                            bulkParsedVideos.push({
                                id: 'vid-bulk-' + Date.now() + '-' + i,
                                title,
                                url,
                                youtubeId: ytId,
                                thumbnail,
                                date,
                                opponent,
                                location,
                                notes,
                                categoryId
                            });

                            const pct = Math.round(((i + 1) / total) * 100);
                            progressBarFill.style.width = `${pct}%`;
                            progressPercent.textContent = `${pct}%`;
                            progressStatus.textContent = `YouTube情報取得中... (${i + 1}/${total})`;
                        }

                        // Complete, draw table
                        progressContainer.style.display = 'none';
                        if (bulkParsedVideos.length === 0) {
                            alert('インポート可能な動画が見つかりませんでした。');
                            fileInput.value = '';
                            return;
                        }

                        ui.renderBulkPreviewTable(bulkParsedVideos, pendingNewCategories);
                        document.getElementById('bulk-preview-section').style.display = 'block';

                    } catch (err) {
                        alert('インポート処理に失敗しました。ファイル形式を確認してください。: ' + err.message);
                        console.error(err);
                        fileInput.value = '';
                        document.getElementById('bulk-progress-container').style.display = 'none';
                    }
                };
                reader.readAsArrayBuffer(file);
            });
        }

        // 3. Save import items
        if (btnExecute) {
            btnExecute.addEventListener('click', async () => {
                if (bulkParsedVideos.length === 0) return;

                const textSpan = document.getElementById('btn-execute-bulk-text');
                btnExecute.disabled = true;
                textSpan.textContent = 'インポート処理中...';

                // Save edited titles, dates, categories from DOM inputs
                const tableRows = document.querySelectorAll('#bulk-preview-table-body tr');
                tableRows.forEach((rowEl, i) => {
                    const titleInput = rowEl.querySelector('.preview-title-input');
                    const categorySelect = rowEl.querySelector('.preview-cat-select');
                    const dateInput = rowEl.querySelector('.preview-date-input');
                    
                    if (titleInput && bulkParsedVideos[i]) {
                        bulkParsedVideos[i].title = titleInput.value.trim() || bulkParsedVideos[i].title;
                    }
                    if (categorySelect && bulkParsedVideos[i]) {
                        bulkParsedVideos[i].categoryId = categorySelect.value;
                    }
                    if (dateInput && bulkParsedVideos[i]) {
                        bulkParsedVideos[i].date = dateInput.value;
                    }
                });

                let countSuccess = 0;
                let countNewCategories = 0;
                try {
                    // Save only newly discovered categories that are actually used in the final import
                    const usedCategoryIds = new Set(bulkParsedVideos.map(v => v.categoryId));
                    for (const newCat of pendingNewCategories) {
                        if (!usedCategoryIds.has(newCat.id)) continue;
                        if (state.categories.some(c => c.id === newCat.id || c.name === newCat.name)) continue;

                        if (supabase.isActive()) {
                            await supabase.saveCategory(newCat, false);
                        }
                        state.categories.push(newCat);
                        countNewCategories++;
                    }

                    for (const video of bulkParsedVideos) {
                        if (supabase.isActive()) {
                            await supabase.saveVideo(video, false);
                        }
                        state.videos.unshift(video);
                        countSuccess++;
                    }

                    dataStore.saveLocal();
                    
                    const catMsg = countNewCategories > 0 ? `\n（新規カテゴリ ${countNewCategories}件も自動追加しました）` : '';
                    alert(`${countSuccess}件の動画の一括登録に成功しました！${catMsg}`);
                    
                    // Reset elements
                    bulkParsedVideos = [];
                    pendingNewCategories = [];
                    fileInput.value = '';
                    document.getElementById('bulk-preview-section').style.display = 'none';
                    
                    // Switch back to video list and redraw
                    document.querySelector('.admin-tab-btn[data-target="admin-videos"]').click();
                    ui.populateCategoryDropdowns();
                    ui.renderAdminCategoryTable();
                    ui.renderPortalCategories();
                    ui.renderAdminVideoTable();
                    ui.renderPortalVideos();
                    ui.renderHeroSection();
                } catch (err) {
                    alert(`一括登録中にエラーが発生しました（一部のみ登録された可能性があります）: ${err.message}`);
                } finally {
                    btnExecute.disabled = false;
                    textSpan.textContent = 'インポートを実行する';
                }
            });
        }

        // 4. Cancel import items
        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                if (confirm('アップロードされたデータを破棄し、インポートを中止しますか？')) {
                    bulkParsedVideos = [];
                    pendingNewCategories = [];
                    fileInput.value = '';
                    document.getElementById('bulk-preview-section').style.display = 'none';
                    document.getElementById('bulk-progress-container').style.display = 'none';
                }
            });
        }
    },

    renderBulkPreviewTable(videos, newCategories = []) {
        const tbody = document.getElementById('bulk-preview-table-body');
        if (!tbody) return;

        const allCategories = [...state.categories, ...newCategories];

        tbody.innerHTML = videos.map((v, index) => {
            const catOptions = allCategories.map(c => {
                const isNew = newCategories.some(nc => nc.id === c.id);
                const label = isNew ? `${c.name} (新規追加)` : c.name;
                return `<option value="${c.id}" ${c.id === v.categoryId ? 'selected' : ''}>${label}</option>`;
            }).join('');

            return `
                <tr>
                    <td class="td-thumb" style="width:100px;">
                        <img src="${v.thumbnail}" alt="Thumbnail" style="width:80px; border-radius:4px;">
                    </td>
                    <td>
                        <input type="text" class="form-control preview-title-input" value="${v.title}" style="padding: 6px 8px; font-size: 0.85rem; width:100%;" required>
                        <div class="text-xs text-secondary truncate mt-1" style="max-width: 250px;">${v.url}</div>
                    </td>
                    <td style="width:130px;">
                        <input type="date" class="form-control preview-date-input" value="${v.date}" style="padding: 6px 8px; font-size: 0.85rem; width:100%;">
                    </td>
                    <td style="width:120px;">
                        <select class="form-control preview-cat-select" style="padding: 6px 8px; font-size: 0.85rem; width:100%;">
                            ${catOptions}
                        </select>
                    </td>
                    <td style="font-size:0.8rem; color:var(--text-secondary); max-width:100px;" class="truncate">${v.opponent || '<span class="text-muted">なし</span>'}</td>
                    <td style="font-size:0.8rem; color:var(--text-secondary); max-width:100px;" class="truncate">${v.location || '<span class="text-muted">なし</span>'}</td>
                </tr>
            `;
        }).join('');
    }
};

// Initializer with visual crash reporter
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Initialize data from storage / files
        await dataStore.init();
        
        // 2. Initialize UI layout & binds
        ui.init();
    } catch (error) {
        console.error("Application crash during initialization:", error);
        
        // Render a highly visible crash reporter banner at the top of the viewport
        const crashBanner = document.createElement('div');
        crashBanner.id = "app-crash-banner";
        crashBanner.style.position = 'fixed';
        crashBanner.style.top = '0';
        crashBanner.style.left = '0';
        crashBanner.style.right = '0';
        crashBanner.style.background = '#f43f5e';
        crashBanner.style.color = '#ffffff';
        crashBanner.style.padding = '20px';
        crashBanner.style.zIndex = '999999';
        crashBanner.style.fontWeight = 'bold';
        crashBanner.style.fontFamily = 'monospace';
        crashBanner.style.fontSize = '13px';
        crashBanner.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
        crashBanner.style.lineHeight = '1.5';
        crashBanner.style.maxHeight = '80vh';
        crashBanner.style.overflowY = 'auto';
        
        crashBanner.innerHTML = `
            <div style="max-width:1200px; margin:0 auto; display:flex; flex-direction:column; gap:10px;">
                <div style="font-size:16px; display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">⚠️</span> <span>システム起動エラー (Crash Reporter)</span>
                </div>
                <div style="font-size:12px; background:rgba(0,0,0,0.25); padding:12px; border-radius:6px; overflow-x:auto; border:1px solid rgba(255,255,255,0.15); white-space:pre-wrap;">
                    <strong>Error:</strong> ${error.message}
                    
                    <strong>Stack Trace:</strong>
                    ${error.stack || 'No stack trace available.'}
                </div>
                <div style="display:flex; gap:10px; margin-top:8px;">
                    <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();" style="padding:8px 16px; background:#ffffff; color:#f43f5e; border:none; border-radius:4px; font-weight:bold; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
                        Local Storageをリセットして再起動
                    </button>
                    <button onclick="document.getElementById('app-crash-banner').remove();" style="padding:8px 16px; background:rgba(255,255,255,0.2); color:#ffffff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">
                        閉じる
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(crashBanner);
    }
});
