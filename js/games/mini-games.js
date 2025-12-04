// Мини-игры - УЛУЧШЕННАЯ ВЕРСИЯ
window.MiniGames = {
    currentGame: null,
    currentViolationIndex: 0,
    currentBicycleScore: 0,
    currentSignsScore: 0,

    init() {
        this.bindGameCards();
        this.bindGameButtons();
    },

    bindGameCards() {
        document.querySelectorAll('.mini-game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameType = card.getAttribute('data-game');
                this.loadGame(gameType);
            });
        });
    },

    bindGameButtons() {
        document.getElementById('next-violation').addEventListener('click', () => this.loadViolationGame());
        document.getElementById('next-bicycle').addEventListener('click', () => this.loadBicycleGame());
        document.getElementById('next-signs').addEventListener('click', () => this.loadSignsGame());
        document.getElementById('check-equipment').addEventListener('click', () => this.checkBicycleEquipment());
        document.getElementById('check-signs').addEventListener('click', () => this.checkSignsPlacement());
    },

    loadGame(gameType) {
        // Скрываем все игровые контейнеры
        document.querySelectorAll('.game-content').forEach(container => {
            container.style.display = 'none';
        });

        // Показываем выбранную игру
        const gameElement = document.getElementById(`${gameType}-game`);
        gameElement.style.display = 'block';
        this.currentGame = gameType;

        // Сбрасываем счетчики
        this.currentViolationIndex = 0;
        this.currentBicycleScore = 0;
        this.currentSignsScore = 0;

        // Загружаем игру
        switch(gameType) {
            case 'violation':
                this.loadViolationGame();
                break;
            case 'bicycle':
                this.loadBicycleGame();
                break;
            case 'signs':
                this.loadSignsGame();
                break;
        }

        // Показываем подсказку для игры
        this.showGameHint(gameType);
    },

    showGameHint(gameType) {
        const hints = {
            'violation': '💡 <strong>Подсказка:</strong> Внимательно посмотри на картинку. Нарушитель - это тот, кто делает что-то опасное на дороге!',
            'bicycle': '💡 <strong>Подсказка:</strong> Выбери ВСЕ обязательные элементы защиты (красные бейджи). Без них ездить на велосипеде опасно!',
            'signs': '💡 <strong>Подсказка:</strong> Перетащи знаки в синие зоны. Знак пешеходного перехода ставится у зебры, а знак "Стоп" - перед перекрестком.'
        };

        const hintElement = document.getElementById(`${gameType}-hint`);
        if (hintElement) {
            hintElement.innerHTML = hints[gameType] || '';
        }
    },

    // Игра "Найди нарушителя" - УЛУЧШЕННАЯ
    loadViolationGame() {
        const scene = document.getElementById('violation-scene');
        const options = document.getElementById('violation-options');
        const hint = document.getElementById('violation-hint');

        // Очищаем сцену и варианты
        scene.innerHTML = '';
        options.innerHTML = '';
        hint.innerHTML = '';

        // Массив нарушений
        const violations = [
            {
                description: "Пешеход переходит дорогу в неположенном месте",
                correct: true,
                hint: "Пешеход должен переходить дорогу только по пешеходному переходу!",
                elements: [
                    { type: 'person', x: 100, y: 50, emoji: '🚶', size: '2rem' },
                    { type: 'car', x: 300, y: 30, emoji: '🚗', size: '2.5rem' },
                    { type: 'zebra', x: 200, y: 0, width: 120, height: 80 }
                ]
            },
            {
                description: "Дети играют рядом с проезжей частью",
                correct: true,
                hint: "Играть рядом с дорогой опасно! Играть можно только в безопасных местах.",
                elements: [
                    { type: 'person', x: 100, y: 40, emoji: '🧒', size: '2rem' },
                    { type: 'person', x: 150, y: 60, emoji: '👦', size: '2rem' },
                    { type: 'car', x: 400, y: 30, emoji: '🚙', size: '2.5rem' },
                    { type: 'ball', x: 120, y: 30, emoji: '⚽', size: '1.5rem' }
                ]
            },
            {
                description: "Велосипедист едет по тротуару",
                correct: false,
                hint: "Велосипедистам до 14 лет можно ездить по тротуарам. Это не нарушение!",
                elements: [
                    { type: 'bicycle', x: 200, y: 100, emoji: '🚴', size: '2.5rem' },
                    { type: 'person', x: 150, y: 80, emoji: '🚶‍♀️', size: '2rem' },
                    { type: 'road', x: 0, y: 0, width: 800, height: 80 }
                ]
            },
            {
                description: "Пешеход переходит на зеленый свет",
                correct: false,
                hint: "Переходить на зеленый свет правильно! Это не нарушение.",
                elements: [
                    { type: 'person', x: 350, y: 50, emoji: '🚶‍♂️', size: '2rem' },
                    { type: 'traffic-light', x: 400, y: 100, emoji: '🟢', size: '1.5rem' },
                    { type: 'zebra', x: 300, y: 0, width: 150, height: 80 }
                ]
            }
        ];

        // Выбираем случайное нарушение
        const violation = violations[this.currentViolationIndex % violations.length];

        // Создаем элементы сцены
        violation.elements.forEach(element => {
            const el = document.createElement('div');
            el.className = `scene-character ${element.type}`;
            el.style.left = `${element.x}px`;
            el.style.bottom = `${element.y}px`;
            el.textContent = element.emoji;
            el.style.fontSize = element.size;

            if (element.type === 'road') {
                el.style.width = `${element.width}px`;
                el.style.height = `${element.height}px`;
                el.style.backgroundColor = '#4a5568';
                el.style.zIndex = '1';
                el.textContent = '';
            } else if (element.type === 'zebra') {
                el.style.width = `${element.width}px`;
                el.style.height = `${element.height}px`;
                el.style.background = 'repeating-linear-gradient(to bottom, white, white 10px, #4a5568 10px, #4a5568 20px)';
                el.style.zIndex = '2';
                el.textContent = '';
            }

            scene.appendChild(el);
        });

        // Создаем варианты ответов
        const option1 = document.createElement('div');
        option1.className = 'violation-option';
        option1.innerHTML = `
            <div>✅ Да, здесь есть нарушитель</div>
            <div class="option-subtext">Кто-то нарушает правила</div>
        `;
        option1.addEventListener('click', () => this.checkViolationAnswer(true, violation));

        const option2 = document.createElement('div');
        option2.className = 'violation-option';
        option2.innerHTML = `
            <div>❌ Нет, все соблюдают правила</div>
            <div class="option-subtext">Все делают правильно</div>
        `;
        option2.addEventListener('click', () => this.checkViolationAnswer(false, violation));

        options.appendChild(option1);
        options.appendChild(option2);

        // Сохраняем текущее нарушение для подсказки
        this.currentViolation = violation;
    },

    checkViolationAnswer(selected, violation) {
        const options = document.querySelectorAll('.violation-option');
        const hint = document.getElementById('violation-hint');
        const isCorrect = selected === violation.correct;

        // Блокируем кнопки
        options.forEach(option => {
            option.style.pointerEvents = 'none';
            option.style.opacity = '0.7';
        });

        // Подсвечиваем правильный ответ
        if (violation.correct) {
            options[0].classList.add('correct');
            options[1].classList.add('incorrect');
        } else {
            options[0].classList.add('incorrect');
            options[1].classList.add('correct');
        }

        // Показываем подсказку
        hint.innerHTML = isCorrect ?
            `🎉 <strong>Правильно!</strong> ${violation.hint}` :
            `🤔 <strong>Попробуй еще раз!</strong> ${violation.hint}`;

        // Награждаем за правильный ответ
        if (isCorrect) {
            window.UserData.foundViolation();

            // Анимация успеха
            const scene = document.getElementById('violation-scene');
            scene.classList.add('success-animation');

            setTimeout(() => {
                hint.innerHTML += '<br><br>🎁 Ты получаешь 5 монет! 🪙';

                // Автоматически переходим к следующей сцене через 3 секунды
                setTimeout(() => {
                    this.currentViolationIndex++;
                    this.loadViolationGame();
                    scene.classList.remove('success-animation');
                }, 3000);
            }, 1500);
        } else {
            // Даем возможность попробовать снова через 3 секунды
            setTimeout(() => {
                options.forEach(option => {
                    option.style.pointerEvents = 'auto';
                    option.style.opacity = '1';
                    option.classList.remove('correct', 'incorrect');
                });
                hint.innerHTML = '💡 Попробуй еще раз! Посмотри внимательнее на картинку.';
            }, 3000);
        }
    },

    // Игра "Собери велосипедиста" - УЛУЧШЕННАЯ
    loadBicycleGame() {
        const equipmentContainer = document.getElementById('bicycle-equipment');
        const hint = document.getElementById('bicycle-hint');

        equipmentContainer.innerHTML = '';
        hint.innerHTML = '';

        // Массив экипировки с четкими подсказками
        const equipment = [
            {
                name: 'Шлем',
                icon: '⛑️',
                required: true,
                hint: 'Защищает голову при падении. Без шлема кататься НЕЛЬЗЯ!'
            },
            {
                name: 'Наколенники',
                icon: '🦵',
                required: true,
                hint: 'Защищают колени от ссадин и ушибов. Обязательны!'
            },
            {
                name: 'Налокотники',
                icon: '💪',
                required: true,
                hint: 'Защищают локти. Падения на локти очень болезненны!'
            },
            {
                name: 'Светоотражатели',
                icon: '✨',
                required: true,
                hint: 'Делают тебя заметным в темноте. Без них опасно!'
            },
            {
                name: 'Фонарик',
                icon: '🔦',
                required: false,
                hint: 'Полезен для езды ночью, но не обязателен днем.'
            },
            {
                name: 'Перчатки',
                icon: '🧤',
                required: false,
                hint: 'Защищают руки, но можно кататься и без них.'
            },
            {
                name: 'Вода',
                icon: '💧',
                required: false,
                hint: 'Важно пить воду, но это не защитная экипировка.'
            },
            {
                name: 'Рюкзак',
                icon: '🎒',
                required: false,
                hint: 'Удобно для вещей, но не защищает от травм.'
            }
        ];

        // Перемешиваем и выбираем 6 элементов
        const shuffled = [...equipment].sort(() => Math.random() - 0.5).slice(0, 6);

        // Создаем элементы экипировки
        shuffled.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'equipment-item';
            itemEl.innerHTML = `
                <div class="equipment-icon">${item.icon}</div>
                <div class="equipment-name">${item.name}</div>
                ${item.required ?
                    '<div class="required-badge">ОБЯЗАТЕЛЬНО</div>' :
                    '<div class="optional-badge">не обязательно</div>'
                }
                <div class="equipment-hint">${item.hint}</div>
            `;

            itemEl.addEventListener('click', function() {
                this.classList.toggle('selected');
                this.style.transform = this.classList.contains('selected') ?
                    'translateY(-5px) scale(1.05)' : 'translateY(0) scale(1)';
            });

            equipmentContainer.appendChild(itemEl);
        });

        // Показываем подсказку
        hint.innerHTML = '💡 <strong>Выбери ВСЕ обязательные элементы защиты</strong> (с красными бейджами). Без них ездить на велосипеде опасно!';
    },

    checkBicycleEquipment() {
        const items = document.querySelectorAll('.equipment-item');
        const hint = document.getElementById('bicycle-hint');
        let correct = true;
        let requiredCount = 0;
        let selectedRequiredCount = 0;
        let selectedOptionalCount = 0;

        // Считаем обязательные элементы
        items.forEach(item => {
            const isRequired = item.querySelector('.required-badge') !== null;
            const isSelected = item.classList.contains('selected');

            if (isRequired) {
                requiredCount++;
                if (isSelected) selectedRequiredCount++;
            } else if (isSelected) {
                selectedOptionalCount++;
            }
        });

        // Проверяем правильность выбора
        items.forEach(item => {
            const isRequired = item.querySelector('.required-badge') !== null;
            const isSelected = item.classList.contains('selected');

            if (isRequired && !isSelected) {
                item.classList.add('incorrect');
                correct = false;
            } else if (!isRequired && isSelected) {
                item.classList.add('incorrect');
                correct = false;
            } else if (isRequired && isSelected) {
                item.classList.add('correct');
            }
        });

        if (correct) {
            // Все правильно
            window.UserData.equippedBicycle();
            this.currentBicycleScore++;

            hint.innerHTML = `
                🎉 <strong>Отлично!</strong> Ты правильно собрал велосипедиста!<br><br>
                ✅ Выбраны все обязательные элементы<br>
                ❌ Не выбраны лишние предметы<br><br>
                🎁 Ты получаешь 5 монет! 🪙<br>
                Правильно собрано: ${this.currentBicycleScore} раз
            `;

            // Анимация успеха
            items.forEach(item => {
                if (item.classList.contains('correct')) {
                    item.style.animation = 'celebrate 0.5s';
                }
            });

            // Автоматически загружаем новый набор через 3 секунды
            setTimeout(() => {
                this.loadBicycleGame();
            }, 3000);

        } else {
            // Есть ошибки
            const errorMessage = selectedRequiredCount < requiredCount ?
                `Не хватает ${requiredCount - selectedRequiredCount} обязательных элементов!` :
                'Выбраны лишние предметы!';

            hint.innerHTML = `
                🤔 <strong>Есть ошибки!</strong><br><br>
                ${errorMessage}<br><br>
                💡 Запомни: нужно выбрать ВСЕ обязательные элементы (красные бейджи)<br>
                и НИКАКИЕ лишние предметы!
            `;

            // Сбрасываем подсветку через 4 секунды
            setTimeout(() => {
                items.forEach(item => {
                    item.classList.remove('correct', 'incorrect');
                    item.style.animation = '';
                });
                hint.innerHTML = '💡 Попробуй еще раз! Выбери только обязательные элементы защиты.';
            }, 4000);
        }
    },

    // Игра "Расставь знаки" - УЛУЧШЕННАЯ
    loadSignsGame() {
        const map = document.getElementById('intersection-map');
        const availableSigns = document.getElementById('available-signs');
        const hint = document.getElementById('signs-hint');

        // Очищаем
        map.innerHTML = `
            <div class="road-horizontal"></div>
            <div class="road-vertical"></div>
            <div class="zebra-crossing" style="position: absolute; left: 350px; top: 160px; width: 100px; height: 80px; background: repeating-linear-gradient(to bottom, white, white 8px, #4a5568 8px, #4a5568 16px); z-index: 2; border: 2px dashed #fff;"></div>
        `;

        availableSigns.innerHTML = '<h4>Доступные знаки:</h4>';
        hint.innerHTML = '';

        // Массив знаков
        const signs = [
            {
                id: 'pedestrian-crossing',
                icon: '🚸',
                name: 'Пешеходный переход',
                hint: 'Ставится перед пешеходным переходом',
                correctZone: { x: 320, y: 120 }
            },
            {
                id: 'stop',
                icon: '🛑',
                name: 'Стоп',
                hint: 'Ставится перед перекрестком, где нужно остановиться',
                correctZone: { x: 520, y: 220 }
            }
        ];

        // Создаем зоны размещения
        signs.forEach(sign => {
            const zone = document.createElement('div');
            zone.className = 'placement-zone';
            zone.style.left = `${sign.correctZone.x}px`;
            zone.style.top = `${sign.correctZone.y}px`;
            zone.style.width = '100px';
            zone.style.height = '100px';
            zone.dataset.correctSign = sign.id;
            zone.dataset.placedSign = '';

            const zoneHint = document.createElement('div');
            zoneHint.className = 'zone-hint';
            zoneHint.textContent = '?';
            zoneHint.title = `Сюда нужно поставить знак "${sign.name}"`;
            zone.appendChild(zoneHint);

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const signId = e.dataTransfer.getData('text/plain');
                const signEl = document.querySelector(`[data-id="${signId}"]`);

                if (signEl && !zone.querySelector('.traffic-sign')) {
                    // Удаляем знак из предыдущей зоны
                    const prevZone = signEl.closest('.placement-zone');
                    if (prevZone) {
                        prevZone.dataset.placedSign = '';
                    }

                    // Добавляем в новую зону
                    zone.appendChild(signEl);
                    zone.dataset.placedSign = signId;
                    signEl.style.position = 'absolute';
                    signEl.style.left = '20px';
                    signEl.style.top = '20px';

                    // Показываем подсказку
                    hint.innerHTML = `Знак "${signEl.dataset.name}" размещен`;
                }
            });

            map.appendChild(zone);
        });

        // Создаем контейнер для доступных знаков
        const signsContainer = document.createElement('div');
        signsContainer.className = 'available-signs-container';

        signs.forEach(sign => {
            const signContainer = document.createElement('div');
            signContainer.className = 'sign-container';

            const signEl = document.createElement('div');
            signEl.className = 'traffic-sign';
            signEl.textContent = sign.icon;
            signEl.setAttribute('draggable', 'true');
            signEl.dataset.id = sign.id;
            signEl.dataset.name = sign.name;
            signEl.title = `${sign.name}\n${sign.hint}`;

            signEl.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', sign.id);
            });

            const signName = document.createElement('div');
            signName.className = 'sign-name';
            signName.textContent = sign.name;

            const signHint = document.createElement('div');
            signHint.className = 'sign-hint';
            signHint.textContent = sign.hint;

            signContainer.appendChild(signEl);
            signContainer.appendChild(signName);
            signContainer.appendChild(signHint);
            signsContainer.appendChild(signContainer);
        });

        availableSigns.appendChild(signsContainer);

        // Показываем подсказку
        hint.innerHTML = '💡 <strong>Подсказка:</strong> Перетащи знаки в синие зоны. Знак пешеходного перехода ставится у зебры, а знак "Стоп" - перед перекрестком.';
    },

    checkSignsPlacement() {
        const zones = document.querySelectorAll('.placement-zone');
        const hint = document.getElementById('signs-hint');
        let correctCount = 0;
        let totalZones = 0;

        zones.forEach(zone => {
            totalZones++;
            const correctSign = zone.dataset.correctSign;
            const placedSign = zone.dataset.placedSign;

            if (placedSign === correctSign) {
                zone.classList.add('correct');
                zone.classList.remove('incorrect');
                correctCount++;
            } else if (placedSign) {
                zone.classList.add('incorrect');
                zone.classList.remove('correct');
            } else {
                zone.classList.remove('correct', 'incorrect');
            }
        });

        if (correctCount === totalZones && totalZones > 0) {
            // Все правильно
            window.UserData.placedSign();
            this.currentSignsScore++;

            hint.innerHTML = `
                🎉 <strong>Отлично!</strong> Все знаки на своих местах!<br><br>
                ✅ Пешеходный переход у зебры<br>
                ✅ Стоп перед перекрестком<br><br>
                🎁 Ты получаешь 5 монет! 🪙<br>
                Правильно расставлено: ${this.currentSignsScore} раз
            `;

            // Анимация успеха
            zones.forEach(zone => {
                zone.style.animation = 'celebrate 0.5s';
            });

            // Автоматически загружаем новый перекресток через 3 секунды
            setTimeout(() => {
                this.loadSignsGame();
            }, 3000);

        } else {
            // Есть ошибки
            const percentage = Math.round((correctCount / totalZones) * 100);

            hint.innerHTML = `
                🤔 <strong>Есть ошибки!</strong> Правильно: ${correctCount} из ${totalZones} (${percentage}%)<br><br>
                💡 Подсказки:<br>
                • Знак 🚸 ставится у пешеходного перехода (зебры)<br>
                • Знак 🛑 ставится перед перекрестком<br><br>
                Попробуй еще раз!
            `;

            // Сбрасываем подсветку через 5 секунд
            setTimeout(() => {
                zones.forEach(zone => {
                    zone.classList.remove('correct', 'incorrect');
                    zone.style.animation = '';
                });
                hint.innerHTML = '💡 Перетащи знаки в правильные зоны. Посмотри на подсказки!';
            }, 5000);
        }
    }
};