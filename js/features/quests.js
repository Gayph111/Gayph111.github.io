// Система квестов
window.Quests = {
    dailyQuests: [
        {
            id: 'watch-video',
            title: 'Посмотри видеоурок',
            description: 'Посмотри любой видеоурок о ПДД',
            icon: '🎬',
            progress: 0,
            target: 1,
            reward: 10,
            type: 'video'
        },
        {
            id: 'pass-quiz',
            title: 'Пройди тест',
            description: 'Пройди любой тест на знание ПДД',
            icon: '📝',
            progress: 0,
            target: 1,
            reward: 15,
            type: 'quiz'
        },
        {
            id: 'play-minigame',
            title: 'Сыграй в мини-игру',
            description: 'Сыграй в любую мини-игру',
            icon: '🎮',
            progress: 0,
            target: 1,
            reward: 12,
            type: 'minigame'
        },
        {
            id: 'find-violations',
            title: 'Найди нарушителей',
            description: 'Найди 3 нарушителя в мини-игре',
            icon: '🔍',
            progress: 0,
            target: 3,
            reward: 20,
            type: 'violation'
        },
        {
            id: 'equip-bicyclist',
            title: 'Собери велосипедиста',
            description: 'Правильно собери 2 велосипедиста',
            icon: '🚴',
            progress: 0,
            target: 2,
            reward: 18,
            type: 'bicycle'
        },
        {
            id: 'place-signs',
            title: 'Расставь знаки',
            description: 'Правильно расставь знаки на 2 перекрестках',
            icon: '🛑',
            progress: 0,
            target: 2,
            reward: 16,
            type: 'signs'
        }
    ],

    init() {
        this.update();
    },

    update() {
        this.updateQuestProgress();
        this.renderQuests();
        this.updateHomeQuests();
    },

    updateQuestProgress() {
        const userData = window.UserData.data;

        this.dailyQuests.forEach(quest => {
            switch(quest.type) {
                case 'video':
                    quest.progress = userData.lessonsWatched;
                    break;
                case 'quiz':
                    quest.progress = userData.quizzesPassed;
                    break;
                case 'minigame':
                    quest.progress = userData.violationsFound + userData.bicyclesEquipped + userData.signsPlaced;
                    break;
                case 'violation':
                    quest.progress = userData.violationsFound;
                    break;
                case 'bicycle':
                    quest.progress = userData.bicyclesEquipped;
                    break;
                case 'signs':
                    quest.progress = userData.signsPlaced;
                    break;
            }

            // Проверяем выполнение квеста
            if (quest.progress >= quest.target && !userData.completedQuests.includes(quest.id)) {
                this.completeQuest(quest);
            }
        });
    },

    completeQuest(quest) {
        const userData = window.UserData.data;

        if (!userData.completedQuests.includes(quest.id)) {
            userData.completedQuests.push(quest.id);
            window.UserData.addCoins(quest.reward);
            window.UserData.completeQuest();

            // Показываем уведомление
            window.UserData.showNotification(`Квест выполнен: ${quest.title}! +${quest.reward}🪙`);

            window.UserData.save();
        }
    },

    renderQuests() {
        const container = document.getElementById('quests-container');
        if (!container) return;

        container.innerHTML = '';

        this.dailyQuests.forEach(quest => {
            const questEl = this.createQuestElement(quest);
            container.appendChild(questEl);
        });
    },

    createQuestElement(quest) {
        const userData = window.UserData.data;
        const isCompleted = userData.completedQuests.includes(quest.id);
        const progressPercent = Math.min(100, (quest.progress / quest.target) * 100);

        const questEl = document.createElement('div');
        questEl.className = `quest-card ${isCompleted ? 'quest-completed' : ''}`;
        questEl.innerHTML = `
            <div class="quest-header">
                <div class="quest-icon">${quest.icon}</div>
                <div style="flex: 1;">
                    <h3>${quest.title}</h3>
                    <p>${quest.description}</p>
                    <div class="quest-progress">
                        <div class="quest-progress-bar" style="width: ${progressPercent}%"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span>${quest.progress}/${quest.target}</span>
                        <div class="quest-reward">
                            <span>🪙</span>
                            <span>${quest.reward}</span>
                            ${isCompleted ? ' ✅' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return questEl;
    },

    updateHomeQuests() {
        const homeContainer = document.getElementById('home-quests');
        if (!homeContainer) return;

        homeContainer.innerHTML = '';

        // Показываем только незавершенные квесты (максимум 3)
        const activeQuests = this.dailyQuests
            .filter(quest => !window.UserData.data.completedQuests.includes(quest.id))
            .slice(0, 3);

        if (activeQuests.length === 0) {
            const noQuestsEl = document.createElement('div');
            noQuestsEl.className = 'quest-card';
            noQuestsEl.innerHTML = `
                <div class="quest-header">
                    <div class="quest-icon">🎉</div>
                    <div>
                        <h3>Все квесты выполнены!</h3>
                        <p>Возвращайся завтра за новыми заданиями!</p>
                    </div>
                </div>
            `;
            homeContainer.appendChild(noQuestsEl);
            return;
        }

        activeQuests.forEach(quest => {
            const questEl = this.createQuestElement(quest);
            homeContainer.appendChild(questEl);
        });
    },

    // Методы для обновления прогресса из других модулей
    onVideoWatched() {
        this.update();
    },

    onQuizCompleted() {
        this.update();
    },

    onMinigamePlayed(type) {
        this.update();
    }
};