// Система рейтинга
window.Leaderboard = {
    players: [
        { name: 'Тимофей', score: 0, avatar: '👦' },
        { name: 'Анна', score: 145, avatar: '👧' },
        { name: 'Максим', score: 132, avatar: '👦' },
        { name: 'София', score: 128, avatar: '👧' },
        { name: 'Артем', score: 115, avatar: '👦' },
        { name: 'Мария', score: 104, avatar: '👧' },
        { name: 'Денис', score: 98, avatar: '👦' },
        { name: 'Алиса', score: 87, avatar: '👧' },
        { name: 'Михаил', score: 76, avatar: '👦' },
        { name: 'Елена', score: 65, avatar: '👧' }
    ],

    init() {
        this.bindLeaderboardEvents();
        this.update();
    },

    bindLeaderboardEvents() {
        document.getElementById('refresh-leaderboard').addEventListener('click', () => this.update());
        document.getElementById('share-result').addEventListener('click', () => this.shareResult());
        document.getElementById('copy-challenge').addEventListener('click', () => this.copyChallengeLink());
        document.getElementById('close-challenge').addEventListener('click', () => {
            document.getElementById('challenge-modal').classList.remove('active');
        });
    },

    update() {
        this.updatePlayerScore();
        this.sortPlayers();
        this.renderLeaderboard();
    },

    updatePlayerScore() {
        const userData = window.UserData.data;
        const userScore = userData.gameScore + userData.quizzesPassed * 10 + userData.achievements * 5;

        // Обновляем счет текущего пользователя
        this.players[0].score = userScore;
        userData.leaderboardScore = userScore;
    },

    sortPlayers() {
        // Сортируем игроков по убыванию очков
        this.players.sort((a, b) => b.score - a.score);
    },

    renderLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;

        leaderboardList.innerHTML = '';

        this.players.forEach((player, index) => {
            const playerEl = this.createPlayerElement(player, index);
            leaderboardList.appendChild(playerEl);
        });
    },

    createPlayerElement(player, rank) {
        const isCurrentUser = rank === 0;
        const rankClass = this.getRankClass(rank);

        const playerEl = document.createElement('div');
        playerEl.className = `leaderboard-item ${isCurrentUser ? 'current-user' : ''}`;
        playerEl.innerHTML = `
            <div class="leaderboard-rank ${rankClass}">${rank + 1}</div>
            <div class="leaderboard-avatar">${player.avatar}</div>
            <div class="leaderboard-user">
                <div class="leaderboard-name">${player.name}</div>
                <div class="leaderboard-badges">
                    ${this.generateBadges(player.score)}
                </div>
            </div>
            <div class="leaderboard-score">${player.score}</div>
        `;

        // Стили для текущего пользователя
        if (isCurrentUser) {
            playerEl.style.backgroundColor = '#e6f7ff';
            playerEl.style.borderLeft = '4px solid #4a90e2';
        }

        return playerEl;
    },

    getRankClass(rank) {
        switch(rank) {
            case 0: return 'rank-gold';
            case 1: return 'rank-silver';
            case 2: return 'rank-bronze';
            default: return '';
        }
    },

    generateBadges(score) {
        let badges = '';

        if (score >= 200) {
            badges += '<span class="badge gold">🏆</span>';
        } else if (score >= 150) {
            badges += '<span class="badge silver">🥈</span>';
        } else if (score >= 100) {
            badges += '<span class="badge bronze">🥉</span>';
        }

        if (score >= 50) {
            badges += '<span class="badge star">⭐</span>';
        }

        return badges;
    },

    shareResult() {
        const userData = window.UserData.data;
        const score = userData.leaderboardScore;
        const rank = this.players.findIndex(p => p.name === 'Тимофей') + 1;

        // Показываем модальное окно с ссылкой для вызова
        document.getElementById('challenge-modal').classList.add('active');

        const challengeText = `Я набрал ${score} очков в игре "ПДД для детей" и занял ${rank} место! Сможешь побить мой результат? 🚦`;
        const challengeLink = `${window.location.origin}${window.location.pathname}?challenge=${score}`;

        document.getElementById('challenge-link').value = challengeLink;

        // Сохраняем текст для копирования
        this.currentChallenge = { text: challengeText, link: challengeLink };
    },

    copyChallengeLink() {
        const linkInput = document.getElementById('challenge-link');
        linkInput.select();
        linkInput.setSelectionRange(0, 99999); // Для мобильных устройств

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                // Показываем подтверждение
                const copyBtn = document.getElementById('copy-challenge');
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Скопировано! ✓';
                copyBtn.style.backgroundColor = '#48bb78';

                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.backgroundColor = '';
                }, 2000);

                // Можно также поделиться через Web Share API если доступно
                if (navigator.share) {
                    navigator.share({
                        title: 'ПДД для детей - Вызов',
                        text: this.currentChallenge.text,
                        url: this.currentChallenge.link
                    });
                }
            }
        } catch (err) {
            console.error('Ошибка при копировании:', err);
            alert('Не удалось скопировать ссылку. Скопируйте ее вручную.');
        }
    },

    // Метод для обработки вызовов от друзей
    handleChallenge(challengeScore) {
        if (challengeScore) {
            alert(`Твой друг бросил тебе вызов набрать больше ${challengeScore} очков! Удачи! 🎯`);
        }
    }
};

// Добавляем CSS для рангов и бейджей
const leaderboardStyles = `
    .rank-gold {
        background: linear-gradient(135deg, #FFD700, #FFA500) !important;
        color: white !important;
    }

    .rank-silver {
        background: linear-gradient(135deg, #C0C0C0, #808080) !important;
        color: white !important;
    }

    .rank-bronze {
        background: linear-gradient(135deg, #CD7F32, #8B4513) !important;
        color: white !important;
    }

    .leaderboard-avatar {
        font-size: 1.5rem;
        margin-right: 10px;
    }

    .leaderboard-name {
        font-weight: bold;
        margin-bottom: 2px;
    }

    .leaderboard-badges {
        display: flex;
        gap: 2px;
    }

    .badge {
        font-size: 0.8rem;
        padding: 1px 3px;
        border-radius: 3px;
    }

    .current-user {
        background-color: #e6f7ff;
        border-left: 4px solid #4a90e2;
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = leaderboardStyles;
document.head.appendChild(styleSheet);