// Система кастомизации
window.Customization = {
    backgrounds: [
        { id: 'default', name: 'Стандартный', icon: '🎨', price: 0, color: '#e6f7ff' },
        { id: 'blue', name: 'Голубой', icon: '🔵', price: 20, color: '#d6f0ff' },
        { id: 'green', name: 'Зеленый', icon: '🟢', price: 25, color: '#e6ffe6' },
        { id: 'purple', name: 'Фиолетовый', icon: '🟣', price: 30, color: '#f0e6ff' },
        { id: 'sunset', name: 'Закат', icon: '🌅', price: 40, color: '#ffe6cc' },
        { id: 'rainbow', name: 'Радуга', icon: '🌈', price: 50, color: 'linear-gradient(135deg, #ff6b6b, #ffa726, #ffee58, #66bb6a, #42a5f5, #5c6bc0)' }
    ],

    stickers: [
        { id: 'star', name: 'Звезда', icon: '⭐', price: 15 },
        { id: 'heart', name: 'Сердце', icon: '❤️', price: 15 },
        { id: 'fire', name: 'Огонь', icon: '🔥', price: 20 },
        { id: 'trophy', name: 'Кубок', icon: '🏆', price: 30 },
        { id: 'rocket', name: 'Ракета', icon: '🚀', price: 25 },
        { id: 'crown', name: 'Корона', icon: '👑', price: 35 }
    ],

    frames: [
        { id: 'default', name: 'Стандартная', icon: '📱', price: 0 },
        { id: 'silver', name: 'Серебряная', icon: '⚪', price: 25 },
        { id: 'gold', name: 'Золотая', icon: '🟡', price: 35 },
        { id: 'colorful', name: 'Разноцветная', icon: '🎭', price: 30 },
        { id: 'champion', name: 'Чемпионская', icon: '🏅', price: 45 }
    ],

    init() {
        this.load();
    },

    load() {
        this.loadBackgrounds();
        this.loadStickers();
        this.loadFrames();
    },

    loadBackgrounds() {
        const grid = document.getElementById('backgrounds-grid');
        if (!grid) return;

        grid.innerHTML = '';

        this.backgrounds.forEach(bg => {
            const bgEl = this.createBackgroundElement(bg);
            grid.appendChild(bgEl);
        });
    },

    createBackgroundElement(background) {
        const userData = window.UserData.data;
        const isPurchased = background.price === 0 || userData.purchasedItems.includes(`bg-${background.id}`);
        const isActive = userData.activeBackground === background.id;

        const bgEl = document.createElement('div');
        bgEl.className = `customization-item ${isActive ? 'selected' : ''} ${!isPurchased ? 'locked' : ''}`;

        if (background.id === 'rainbow') {
            bgEl.style.background = background.color;
        } else {
            bgEl.style.backgroundColor = background.color;
        }

        bgEl.innerHTML = `
            <div class="customization-icon">${background.icon}</div>
            <div>${background.name}</div>
            ${!isPurchased ? `<div class="customization-price">🪙 ${background.price}</div>` : ''}
        `;

        if (isPurchased) {
            bgEl.addEventListener('click', () => {
                this.selectBackground(background.id);
            });
        } else {
            bgEl.addEventListener('click', () => {
                this.purchaseBackground(background);
            });
        }

        return bgEl;
    },

    loadStickers() {
        const grid = document.getElementById('stickers-grid');
        if (!grid) return;

        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666;">Скоро появятся новые стикеры! 🎨</p>';

        // Показываем только первые 3 стикера как пример
        this.stickers.slice(0, 3).forEach(sticker => {
            const stickerEl = this.createStickerElement(sticker);
            grid.appendChild(stickerEl);
        });
    },

    createStickerElement(sticker) {
        const userData = window.UserData.data;
        const isPurchased = userData.purchasedItems.includes(`sticker-${sticker.id}`);
        const isActive = userData.activeStickers.includes(sticker.id);

        const stickerEl = document.createElement('div');
        stickerEl.className = `customization-item ${isActive ? 'selected' : ''} ${!isPurchased ? 'locked' : ''}`;
        stickerEl.innerHTML = `
            <div class="customization-icon">${sticker.icon}</div>
            <div>${sticker.name}</div>
            ${!isPurchased ? `<div class="customization-price">🪙 ${sticker.price}</div>` : ''}
        `;

        if (isPurchased) {
            stickerEl.addEventListener('click', () => {
                this.toggleSticker(sticker.id);
            });
        } else {
            stickerEl.addEventListener('click', () => {
                this.purchaseSticker(sticker);
            });
        }

        return stickerEl;
    },

    loadFrames() {
        const grid = document.getElementById('frames-grid');
        if (!grid) return;

        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666;">Скоро появятся новые рамки! 🖼️</p>';

        // Показываем только первые 3 рамки как пример
        this.frames.slice(0, 3).forEach(frame => {
            const frameEl = this.createFrameElement(frame);
            grid.appendChild(frameEl);
        });
    },

    createFrameElement(frame) {
        const userData = window.UserData.data;
        const isPurchased = frame.price === 0 || userData.purchasedItems.includes(`frame-${frame.id}`);
        const isActive = userData.activeFrame === frame.id;

        const frameEl = document.createElement('div');
        frameEl.className = `customization-item ${isActive ? 'selected' : ''} ${!isPurchased ? 'locked' : ''}`;
        frameEl.innerHTML = `
            <div class="customization-icon">${frame.icon}</div>
            <div>${frame.name}</div>
            ${!isPurchased ? `<div class="customization-price">🪙 ${frame.price}</div>` : ''}
        `;

        if (isPurchased) {
            frameEl.addEventListener('click', () => {
                this.selectFrame(frame.id);
            });
        } else {
            frameEl.addEventListener('click', () => {
                this.purchaseFrame(frame);
            });
        }

        return frameEl;
    },

    selectBackground(backgroundId) {
        window.UserData.data.activeBackground = backgroundId;
        window.UserData.save();
        this.loadBackgrounds();
        this.applyCustomization();
    },

    toggleSticker(stickerId) {
        const userData = window.UserData.data;
        const index = userData.activeStickers.indexOf(stickerId);

        if (index > -1) {
            userData.activeStickers.splice(index, 1);
        } else {
            userData.activeStickers.push(stickerId);
        }

        window.UserData.save();
        this.loadStickers();
        this.applyCustomization();
    },

    selectFrame(frameId) {
        window.UserData.data.activeFrame = frameId;
        window.UserData.save();
        this.loadFrames();
        this.applyCustomization();
    },

    purchaseBackground(background) {
        if (window.UserData.spendCoins(background.price)) {
            window.UserData.data.purchasedItems.push(`bg-${background.id}`);
            window.UserData.data.activeBackground = background.id;
            window.UserData.save();

            this.loadBackgrounds();
            this.applyCustomization();

            window.UserData.showNotification(`Фон "${background.name}" куплен!`);
        } else {
            alert(`Недостаточно монет! Нужно еще ${background.price - window.UserData.data.coins} монет.`);
        }
    },

    purchaseSticker(sticker) {
        if (window.UserData.spendCoins(sticker.price)) {
            window.UserData.data.purchasedItems.push(`sticker-${sticker.id}`);
            window.UserData.data.activeStickers.push(sticker.id);
            window.UserData.save();

            this.loadStickers();
            this.applyCustomization();

            window.UserData.showNotification(`Стикер "${sticker.name}" куплен!`);
        } else {
            alert(`Недостаточно монет! Нужно еще ${sticker.price - window.UserData.data.coins} монет.`);
        }
    },

    purchaseFrame(frame) {
        if (window.UserData.spendCoins(frame.price)) {
            window.UserData.data.purchasedItems.push(`frame-${frame.id}`);
            window.UserData.data.activeFrame = frame.id;
            window.UserData.save();

            this.loadFrames();
            this.applyCustomization();

            window.UserData.showNotification(`Рамка "${frame.name}" куплена!`);
        } else {
            alert(`Недостаточно монет! Нужно еще ${frame.price - window.UserData.data.coins} монет.`);
        }
    },

    applyCustomization() {
        const userData = window.UserData.data;

        // Применяем выбранный фон
        const selectedBg = this.backgrounds.find(bg => bg.id === userData.activeBackground);
        if (selectedBg) {
            if (selectedBg.id === 'rainbow') {
                document.body.style.background = selectedBg.color;
            } else {
                document.body.style.background = selectedBg.color;
            }
        }

        // Применяем стикеры к маскоту (упрощенная версия)
        this.applyStickersToMascot();

        // Можно добавить применение рамок к аватару и т.д.
    },

    applyStickersToMascot() {
        const mascot = document.getElementById('mascot');
        if (!mascot) return;

        // Удаляем старые стикеры
        const oldStickers = mascot.querySelectorAll('.mascot-sticker');
        oldStickers.forEach(sticker => sticker.remove());

        // Добавляем новые стикеры
        const userData = window.UserData.data;
        userData.activeStickers.forEach((stickerId, index) => {
            const sticker = this.stickers.find(s => s.id === stickerId);
            if (sticker) {
                const stickerEl = document.createElement('div');
                stickerEl.className = 'mascot-sticker';
                stickerEl.textContent = sticker.icon;
                stickerEl.style.position = 'absolute';
                stickerEl.style.fontSize = '1.2rem';

                // Размещаем стикеры в разных местах на маскоте
                switch(index % 4) {
                    case 0:
                        stickerEl.style.top = '20px';
                        stickerEl.style.left = '20px';
                        break;
                    case 1:
                        stickerEl.style.top = '20px';
                        stickerEl.style.right = '20px';
                        break;
                    case 2:
                        stickerEl.style.bottom = '40px';
                        stickerEl.style.left = '20px';
                        break;
                    case 3:
                        stickerEl.style.bottom = '40px';
                        stickerEl.style.right = '20px';
                        break;
                }

                mascot.appendChild(stickerEl);
            }
        });
    }
};

// Добавляем CSS для кастомизации
const customizationStyles = `
    .customization-price {
        font-size: 0.8rem;
        color: #d69e2e;
        font-weight: bold;
        margin-top: 5px;
    }

    .customization-item.locked {
        position: relative;
        opacity: 0.7;
    }

    .customization-item.locked::after {
        content: '🔒';
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 0.8rem;
    }

    .mascot-sticker {
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
`;

// Добавляем стили в документ
const customizationStyleSheet = document.createElement('style');
customizationStyleSheet.textContent = customizationStyles;
document.head.appendChild(customizationStyleSheet);