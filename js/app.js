// Главный файл приложения
window.PDDApp = {
    init() {
        this.initializeModules();
        this.setupEventListeners();
        this.checkForChallenges();

        // Показываем приветственное сообщение
        setTimeout(() => {
            if (window.Mascot) {
                window.Mascot.showSectionTip('home');
            }
        }, 1500);
    },

    initializeModules() {
        // Загружаем данные пользователя
        if (window.UserData) {
            window.UserData.load();
        }

        // Инициализируем навигацию
        if (window.Navigation) {
            window.Navigation.init();
        }

        // Инициализируем маскота
        if (window.Mascot) {
            window.Mascot.init();
        }

        // Инициализируем мини-игры
        if (window.MiniGames) {
            window.MiniGames.init();
        }

        if (window.Quiz) {
            window.Quiz.init();
        }

        // Инициализируем дополнительные функции
        if (window.Comics) {
            window.Comics.init();
        }

        if (window.Quests) {
            window.Quests.init();
        }

        if (window.Leaderboard) {
            window.Leaderboard.init();
        }

        if (window.Customization) {
            window.Customization.init();
        }

        // Применяем кастомизацию
        if (window.Customization) {
            window.Customization.applyCustomization();
        }
    },

    setupEventListeners() {
        // Обработка изменения видимости страницы
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Сохраняем данные при сворачивании
                if (window.UserData) {
                    window.UserData.save();
                }
            }
        });

        // Сохраняем данные при закрытии страницы
        window.addEventListener('beforeunload', () => {
            if (window.UserData) {
                window.UserData.save();
            }
        });

        // Периодическое автосохранение
        setInterval(() => {
            if (window.UserData) {
                window.UserData.save();
            }
        }, 30000); // Каждые 30 секунд
    },

    checkForChallenges() {
        // Проверяем URL на наличие вызовов от друзей
        const urlParams = new URLSearchParams(window.location.search);
        const challengeScore = urlParams.get('challenge');

        if (challengeScore && window.Leaderboard) {
            window.Leaderboard.handleChallenge(parseInt(challengeScore));

            // Убираем параметр из URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    },

    // Глобальные методы для доступа из консоли (для отладки)
    debug: {
        resetData() {
            if (confirm('Вы уверены, что хотите сбросить все данные?')) {
                localStorage.removeItem('pddUserData');
                location.reload();
            }
        },

        addCoins(amount) {
            if (window.UserData) {
                window.UserData.addCoins(amount);
            }
        },

        unlockAll() {
            if (window.UserData) {
                const achievements = [
                    'first-video', 'video-expert', 'quiz-master',
                    'violation-finder', 'bicycle-expert', 'signs-master'
                ];

                achievements.forEach(achievement => {
                    window.UserData.unlockAchievement(achievement, 0);
                });

                window.UserData.data.lessonsWatched = 8;
                window.UserData.data.quizzesPassed = 5;
                window.UserData.data.violationsFound = 15;
                window.UserData.data.bicyclesEquipped = 8;
                window.UserData.data.signsPlaced = 5;

                window.UserData.save();
                location.reload();
            }
        },

        showStats() {
            if (window.UserData) {
                console.log('Статистика пользователя:', window.UserData.data);
            }
        }
    }
};

// Запуск приложения при полной загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    window.PDDApp.init();
});

// Добавляем глобальные методы отладки в window
window.PDDDebug = window.PDDApp.debug;