// Модуль для работы с данными пользователя
window.UserData = {
    data: {
        coins: 0,
        level: 1,
        lessonsWatched: 0,
        quizzesPassed: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        achievements: 0,
        gameScore: 0,
        gameLevel: 1,
        totalCoins: 0,
        totalTime: 0,
        purchasedItems: [],
        watchedVideos: [],
        violationsFound: 0,
        bicyclesEquipped: 0,
        signsPlaced: 0,
        questsCompleted: 0,
        activeBackground: 'default',
        activeStickers: [],
        activeFrame: 'default',
        activeQuests: [],
        completedQuests: [],
        leaderboardScore: 0
    },

    load() {
        const savedData = localStorage.getItem('pddUserData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                this.data = { ...this.data, ...parsedData };
            } catch (e) {
                console.error('Ошибка загрузки данных:', e);
            }
        }
        this.updateUI();
        return this.data;
    },

    save() {
        try {
            localStorage.setItem('pddUserData', JSON.stringify(this.data));
            this.updateUI();
        } catch (e) {
            console.error('Ошибка сохранения данных:', e);
        }
        return this.data;
    },

    updateUI() {
        const elements = {
            'coin-count': this.data.coins,
            'user-level': this.data.level,
            'home-lessons-watched': this.data.lessonsWatched,
            'home-quizzes-passed': this.data.quizzesPassed,
            'home-achievements': this.data.achievements,
            'home-game-score': this.data.gameScore,
            'stats-lessons-watched': this.data.lessonsWatched,
            'stats-quizzes-passed': this.data.quizzesPassed,
            'stats-correct-answers': this.data.totalAnswers > 0 ?
                Math.round((this.data.correctAnswers / this.data.totalAnswers) * 100) + '%' : '0%',
            'stats-achievements': this.data.achievements + '/12',
            'stats-game-score': this.data.gameScore,
            'stats-total-coins': this.data.totalCoins,
            'stats-game-level': this.data.gameLevel,
            'stats-total-time': Math.floor(this.data.totalTime / 60) + 'ч',
            'stats-violations-found': this.data.violationsFound,
            'stats-bicycles-equipped': this.data.bicyclesEquipped,
            'stats-signs-placed': this.data.signsPlaced,
            'stats-quests-completed': this.data.questsCompleted,
            'parent-lessons': this.data.lessonsWatched,
            'parent-quizzes': this.data.quizzesPassed,
            'parent-achievements': this.data.achievements
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }

        this.updateShop();
        this.updateLeaderboardScore();
    },

    updateLeaderboardScore() {
        this.data.leaderboardScore = this.data.gameScore +
                                   this.data.quizzesPassed * 10 +
                                   this.data.achievements * 5;
    },

    updateShop() {
        this.data.purchasedItems.forEach(item => {
            const shopItem = document.getElementById(`item-${item}`);
            if (shopItem) {
                shopItem.classList.add('purchased');
                const button = shopItem.querySelector('.buy-btn');
                if (button) {
                    button.textContent = 'Куплено';
                    button.disabled = true;
                }
            }
        });
    },

    addCoins(amount) {
        this.data.coins += amount;
        this.data.totalCoins += amount;
        this.save();
        return this.data.coins;
    },

    spendCoins(amount) {
        if (this.data.coins >= amount) {
            this.data.coins -= amount;
            this.save();
            return true;
        }
        return false;
    },

    unlockAchievement(achievementId, coins) {
        const achievement = document.getElementById(achievementId);
        if (achievement && achievement.classList.contains('locked')) {
            achievement.classList.remove('locked');
            this.data.achievements++;
            this.addCoins(coins);

            // Показываем уведомление
            const achievementName = achievement.querySelector('h3').textContent;
            this.showNotification(`Достижение разблокировано: ${achievementName}! +${coins}🪙`);

            return true;
        }
        return false;
    },

    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    watchVideo(videoId) {
        if (!this.data.watchedVideos.includes(videoId)) {
            this.data.watchedVideos.push(videoId);
            this.data.lessonsWatched++;
            this.data.totalTime += 5;
            this.addCoins(5);
            this.save();
            return true;
        }
        return false;
    },

    completeQuiz(score, totalQuestions) {
        this.data.quizzesPassed++;
        this.data.totalAnswers += totalQuestions;
        this.data.correctAnswers += score;
        this.data.totalTime += 10;

        let coinsEarned = 5;
        if (score === totalQuestions) coinsEarned = 20;
        else if (score >= totalQuestions * 0.7) coinsEarned = 10;

        this.addCoins(coinsEarned);
        this.save();

        return coinsEarned;
    },

    // Методы для мини-игр
    foundViolation() {
        this.data.violationsFound++;
        this.addCoins(5);
        this.checkViolationAchievements();
        return this.data.violationsFound;
    },

    equippedBicycle() {
        this.data.bicyclesEquipped++;
        this.addCoins(5);
        this.checkBicycleAchievements();
        return this.data.bicyclesEquipped;
    },

    placedSign() {
        this.data.signsPlaced++;
        this.addCoins(5);
        this.checkSignsAchievements();
        return this.data.signsPlaced;
    },

    completeQuest() {
        this.data.questsCompleted++;
        this.save();
        return this.data.questsCompleted;
    },

    // Проверка достижений
    checkViolationAchievements() {
        if (this.data.violationsFound >= 10) {
            this.unlockAchievement('violation-finder', 25);
        }
    },

    checkBicycleAchievements() {
        if (this.data.bicyclesEquipped >= 5) {
            this.unlockAchievement('bicycle-expert', 30);
        }
    },

    checkSignsAchievements() {
        if (this.data.signsPlaced >= 3) {
            this.unlockAchievement('signs-master', 35);
        }
    },

    checkVideoAchievements() {
        if (this.data.lessonsWatched >= 1) {
            this.unlockAchievement('first-video', 10);
        }
        if (this.data.watchedVideos.length >= 6) {
            this.unlockAchievement('video-expert', 50);
        }
    },

    checkQuizAchievements() {
        if (this.data.quizzesPassed >= 3 && this.data.correctAnswers / this.data.totalAnswers >= 0.9) {
            this.unlockAchievement('quiz-master', 30);
        }
    },

    checkGameAchievements() {
        if (this.data.gameScore >= 100) {
            this.unlockAchievement('game-champion', 25);
        }
    }
};