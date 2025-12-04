// Модуль навигации
window.Navigation = {
    currentSection: 'home',

    init() {
        this.bindNavLinks();
        this.bindVideoButtons();
        this.bindShopButtons();
        this.bindDeveloperButton();
    },

    bindNavLinks() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                this.switchSection(sectionId);
            });
        });
    },

    bindVideoButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('watch-video')) {
                e.preventDefault();
                const videoId = e.target.getAttribute('data-video');
                this.watchVideo(videoId);
            }
        });
    },

    bindShopButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-btn')) {
                e.preventDefault();
                const itemId = e.target.getAttribute('data-item');
                this.buyItem(itemId);
            }
        });
    },

    bindDeveloperButton() {
        document.getElementById('developer-btn').addEventListener('click', function() {
            const info = document.getElementById('developer-info');
            if (info.style.display === 'none') {
                info.style.display = 'block';
                this.textContent = 'Скрыть информацию';
            } else {
                info.style.display = 'none';
                this.textContent = 'О разработчике';
            }
        });
    },

    switchSection(sectionId) {
        // Убираем активный класс у всех ссылок
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        // Добавляем активный класс к текущей ссылке
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Скрываем все разделы
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Показываем выбранный раздел
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;

        // Загружаем контент для определенных разделов
        this.loadSectionContent(sectionId);

        // Показываем подсказку от маскота
        if (window.Mascot) {
            window.Mascot.showSectionTip(sectionId);
        }
    },

    loadSectionContent(sectionId) {
        switch(sectionId) {
            case 'games':
                if (window.MiniGames) window.MiniGames.init();
                break;
            case 'comics':
                if (window.Comics) window.Comics.load();
                break;
            case 'leaderboard':
                if (window.Leaderboard) window.Leaderboard.update();
                break;
            case 'quests':
                if (window.Quests) window.Quests.update();
                break;
            case 'customization':
                if (window.Customization) window.Customization.load();
                break;
            case 'quiz':
                if (window.Quiz) window.Quiz.init();
                break;
        }
    },

    watchVideo(videoId) {
        if (window.UserData.watchVideo(videoId)) {
            alert(`Сейчас бы началось видео №${videoId} о правилах дорожного движения! Ты получил 5 монет.`);

            // Проверяем достижения
            window.UserData.checkVideoAchievements();

            // Обновляем квесты
            if (window.Quests) {
                window.Quests.update();
            }
        } else {
            alert('Ты уже смотрел это видео!');
        }
    },

    buyItem(itemId) {
        const itemElement = document.getElementById(`item-${itemId}`);
        if (!itemElement) return;

        const priceElement = itemElement.querySelector('.shop-item-price span:last-child');
        const price = parseInt(priceElement.textContent);

        if (window.UserData.spendCoins(price)) {
            window.UserData.data.purchasedItems.push(itemId);
            window.UserData.save();

            itemElement.classList.add('purchased');
            const button = itemElement.querySelector('.buy-btn');
            button.textContent = 'Куплено';
            button.disabled = true;

            alert('Поздравляем с покупкой!');
        } else {
            alert(`Недостаточно монет! Нужно еще ${price - window.UserData.data.coins} монет.`);
        }
    }
};