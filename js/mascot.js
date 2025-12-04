// Модуль маскота
window.Mascot = {
    tips: {
        'home': 'Привет! Начни с видеоуроков - они самые интересные! 🎬',
        'lessons': 'Смотри уроки внимательно - за каждый получишь монетки! 🪙',
        'games': 'Попробуй мини-игры! Они помогут закрепить знания в увлекательной форме! 🎯',
        'quiz': 'Проверь свои знания! Не волнуйся, если ошибёшься - это нормально! 📝',
        'game': 'В игре будь внимателен! Переходи только на зелёный свет! 🎮',
        'comics': 'Читай комиксы и принимай решения за героев! Это весело и познавательно! 📚',
        'quests': 'Выполняй квесты каждый день и получай награды! 🎁',
        'leaderboard': 'Соревнуйся с другими игроками! Стань лучшим знатоком ПДД! 🏆',
        'chat': 'Привет! Давай поговорим о ПДД! Я задам тебе интересные вопросы! 💬',
        'achievements': 'Собирай достижения - за них дают много монет! 🏆',
        'shop': 'Трать монеты с умом! Дополнительная жизнь может пригодиться! 🛍️',
        'customization': 'Настрой свой профиль! Сделай его уникальным! 🎨',
        'parent': 'Родители могут отслеживать твой прогресс здесь! 👨‍👩‍👧‍👦',
        'stats': 'Следи за прогрессом! Видишь, как много ты уже узнал? 📊'
    },

    randomTips: [
        'Знаешь ли ты, что первое правило пешехода - остановиться у края дороги! 🛑',
        'Велосипедистам до 14 лет нельзя ездить по проезжей части! 🚴',
        'В темноте носи светоотражатели - они делают тебя заметным! 🌃',
        'Никогда не выбегай на дорогу из-за препятствия! 🚗',
        'Переходи дорогу только по зебре или на зелёный свет! 🚦',
        'В автобусе крепко держись за поручни! 🚌',
        'Играть рядом с дорогой опасно! Выбирай безопасные места! 🏀',
        'Слушайся регулировщика, даже если светофор зелёный! 👮',
        'При переходе дороги с велосипедом нужно спешиться! 🚲',
        'Желтый сигнал светофора означает "приготовиться", а не "успеть перебежать"! ⚠️',
        'Всегда иди по тротуару, а если его нет - по обочине навстречу движению! 🚶',
        'В машине всегда пристегивай ремень безопасности! 🚗',
        'Не отвлекайся на телефон при переходе дороги! 📵',
        'Самый безопасный путь - самый длинный, если он по правилам! 🛣️'
    ],

    init() {
        this.bindMascotEvents();
        this.bindChatEvents();
    },

    bindMascotEvents() {
        const mascot = document.getElementById('mascot');
        if (mascot) {
            mascot.addEventListener('click', () => this.showRandomTip());
        }
    },

    bindChatEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('chat-option')) {
                const topic = e.target.getAttribute('data-topic');
                this.startChat(topic);
            }
        });
    },

    showSectionTip(sectionId) {
        const message = document.getElementById('mascot-message');
        const text = document.getElementById('mascot-text');

        if (message && text) {
            text.textContent = this.tips[sectionId] || 'Рад видеть тебя здесь! Учи ПДД - это важно и интересно! 😊';
            message.classList.add('show');

            setTimeout(() => {
                message.classList.remove('show');
            }, 5000);
        }
    },

    showRandomTip() {
        const message = document.getElementById('mascot-message');
        const text = document.getElementById('mascot-text');
        const mouth = document.getElementById('mascot-mouth');

        if (!message || !text || !mouth) return;

        // Меняем выражение лица
        mouth.style.height = '5px';
        mouth.style.borderRadius = '10px';

        const randomTip = this.randomTips[Math.floor(Math.random() * this.randomTips.length)];
        text.textContent = randomTip;

        message.classList.add('show');

        setTimeout(() => {
            mouth.style.height = '10px';
            mouth.style.borderRadius = '5px';
        }, 1000);

        setTimeout(() => {
            message.classList.remove('show');
        }, 5000);
    },

    startChat(topic) {
        const chatMessages = document.getElementById('chat-messages');
        const chatOptions = document.getElementById('chat-options');

        if (!chatMessages || !chatOptions) return;

        const topics = {
            crossing: {
                question: "Как ты думаешь, что нужно сделать ПЕРВЫМ делом перед переходом дороги?",
                options: [
                    "Посмотреть налево, потом направо",
                    "Убедиться, что все машины остановились",
                    "Поднять руку, чтобы водители заметили",
                    "Быстро перебежать дорогу"
                ],
                correct: 1,
                explanation: "Правильно! Первое правило - УБЕДИТЬСЯ, что все машины остановились! Даже на зелёный свет нужно быть внимательным. Молодец! 🎉"
            },
            bicycle: {
                question: "Где можно кататься на велосипеде детям до 14 лет?",
                options: [
                    "По тротуару",
                    "По проезжей части",
                    "По велодорожке",
                    "И по тротуару, и по велодорожке"
                ],
                correct: 3,
                explanation: "Верно! Детям до 14 лет можно кататься по тротуарам и велодорожкам, но нельзя выезжать на проезжую часть. Отличное знание правил! 🚴"
            },
            signs: {
                question: "Что означает этот знак? 🚸",
                options: [
                    "Пешеходный переход",
                    "Осторожно, дети",
                    "Велосипедная дорожка",
                    "Остановка автобуса"
                ],
                correct: 1,
                explanation: "Правильно! Это знак 'Осторожно, дети'. Он предупреждает водителей, что рядом могут быть дети. Ты отлично разбираешься в знаках! 🛑"
            },
            safety: {
                question: "Как сделать себя заметным на дороге в темноте?",
                options: [
                    "Надеть светлую одежду",
                    "Использовать светоотражатели",
                    "Взять с собой фонарик",
                    "Все варианты правильные"
                ],
                correct: 3,
                explanation: "Верно! Все эти способы помогают быть заметным в темноте. Особенно важны светоотражатели - они видны за 150 метров! Будь всегда заметен! 🌟"
            }
        };

        const topicData = topics[topic];
        if (!topicData) return;

        // Очищаем чат
        chatOptions.innerHTML = '';

        // Добавляем вопрос маскота
        this.addChatMessage(topicData.question, 'mascot');

        // Добавляем варианты ответов
        topicData.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'chat-option';
            optionBtn.textContent = option;
            optionBtn.addEventListener('click', () => this.checkChatAnswer(topicData, index));
            chatOptions.appendChild(optionBtn);
        });
    },

    addChatMessage(text, sender) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    checkChatAnswer(topicData, selectedIndex) {
        const chatOptions = document.getElementById('chat-options');
        if (!chatOptions) return;

        // Очищаем варианты ответов
        chatOptions.innerHTML = '';

        // Показываем правильный ответ
        this.addChatMessage(topicData.explanation, 'mascot');

        // Награждаем пользователя
        if (selectedIndex === topicData.correct) {
            window.UserData.addCoins(5);
            this.addChatMessage(`Правильно! Ты получаешь 5 монет! 🪙 Теперь у тебя ${window.UserData.data.coins} монет.`, 'mascot');
        } else {
            this.addChatMessage("Не совсем верно, но ты молодец, что пытаешься! Попробуй ещё раз! 💪", 'mascot');
        }

        // Добавляем кнопку для нового разговора
        setTimeout(() => {
            const newChatBtn = document.createElement('button');
            newChatBtn.className = 'chat-option';
            newChatBtn.textContent = 'Поговорить на другую тему';
            newChatBtn.addEventListener('click', () => this.resetChat());
            chatOptions.appendChild(newChatBtn);
        }, 1000);
    },

    resetChat() {
        const chatMessages = document.getElementById('chat-messages');
        const chatOptions = document.getElementById('chat-options');

        if (!chatMessages || !chatOptions) return;

        chatMessages.innerHTML = '<div class="message mascot">Привет! Выбери новую тему для разговора! 😊</div>';
        chatOptions.innerHTML = `
            <button class="chat-option" data-topic="crossing">Как правильно переходить дорогу?</button>
            <button class="chat-option" data-topic="bicycle">Правила для велосипедистов</button>
            <button class="chat-option" data-topic="signs">Дорожные знаки</button>
            <button class="chat-option" data-topic="safety">Безопасность в темноте</button>
        `;
    }
};