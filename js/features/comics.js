// Система комиксов
window.Comics = {
    currentComic: 0,
    currentPanel: 0,
    comics: [
        {
            title: "Прогулка с другом",
            panels: [
                {
                    text: "Привет! Я Макс, а это мой друг Алекс. Мы идем в парк кататься на велосипедах!",
                    choices: [
                        "Пойти через дорогу по пешеходному переходу",
                        "Перебежать дорогу в неположенном месте"
                    ],
                    correct: 0
                },
                {
                    text: "Мы подошли к дороге. Машин много! Как нам лучше перейти?",
                    choices: [
                        "Подождать зеленого сигнала светофора",
                        "Перебежать, когда машин станет меньше"
                    ],
                    correct: 0
                },
                {
                    text: "Молодцы! Вы правильно перешли дорогу и теперь можете безопасно кататься в парке!",
                    choices: [
                        "Прочитать следующую историю",
                        "Прочитать эту историю еще раз"
                    ],
                    correct: 0
                }
            ]
        },
        {
            title: "Велосипедная прогулка",
            panels: [
                {
                    text: "Я так рад! Папа купил мне новый велосипед! Хочу сразу поехать кататься!",
                    choices: [
                        "Надеть защитную экипировку",
                        "Поехать сразу без подготовки"
                    ],
                    correct: 0
                },
                {
                    text: "Куда лучше поехать кататься на велосипеде?",
                    choices: [
                        "В парк или на велодорожку",
                        "По оживленной дороге с машинами"
                    ],
                    correct: 0
                },
                {
                    text: "Отлично! Ты выбрал безопасный маршрут и правильную экипировку. Приятной поездки!",
                    choices: [
                        "Прочитать следующую историю",
                        "Начать заново"
                    ],
                    correct: 0
                }
            ]
        },
        {
            title: "Возвращение домой",
            panels: [
                {
                    text: "Уже стемнело, а я еще не дома. Мама будет волноваться!",
                    choices: [
                        "Идти обычным маршрутом, но быстрее",
                        "Включить фонарик и надеть светоотражающий жилет"
                    ],
                    correct: 1
                },
                {
                    text: "На пути домой нужно перейти неосвещенный участок дороги. Что делать?",
                    choices: [
                        "Перебежать побыстрее",
                        "Дойти до освещенного пешеходного перехода"
                    ],
                    correct: 1
                },
                {
                    text: "Ты благополучно добрался домой! Помни: безопасность - самое главное!",
                    choices: [
                        "Прочитать первую историю",
                        "Посмотреть другие разделы"
                    ],
                    correct: 0
                }
            ]
        }
    ],

    init() {
        this.bindComicEvents();
        this.load();
    },

    bindComicEvents() {
        document.getElementById('next-comic').addEventListener('click', () => this.nextComic());
        document.getElementById('prev-comic').addEventListener('click', () => this.prevComic());
    },

    load() {
        const container = document.getElementById('comic-container');
        if (!container) return;

        container.innerHTML = '';

        const comic = this.comics[this.currentComic];
        if (!comic) return;

        // Добавляем заголовок комикса
        const titleEl = document.createElement('h3');
        titleEl.textContent = comic.title;
        titleEl.style.textAlign = 'center';
        titleEl.style.marginBottom = '20px';
        titleEl.style.color = '#2c5aa0';
        container.appendChild(titleEl);

        // Показываем только текущую панель
        const panel = comic.panels[this.currentPanel];
        if (panel) {
            const panelEl = this.createPanel(panel, this.currentPanel);
            container.appendChild(panelEl);
        }

        // Обновляем кнопки навигации
        this.updateNavigationButtons();
    },

    createPanel(panel, panelIndex) {
        const panelEl = document.createElement('div');
        panelEl.className = 'comic-panel';

        panelEl.innerHTML = `
            <div class="comic-text">${panel.text}</div>
            <div class="comic-choices">
                ${panel.choices.map((choice, choiceIndex) => `
                    <div class="comic-choice" data-panel="${panelIndex}" data-choice="${choiceIndex}">
                        ${choice}
                    </div>
                `).join('')}
            </div>
        `;

        // Добавляем обработчики для выбора
        panelEl.querySelectorAll('.comic-choice').forEach(choice => {
            choice.addEventListener('click', (e) => {
                this.handleChoice(e.target, panel, panelIndex);
            });
        });

        return panelEl;
    },

    handleChoice(choiceElement, panel, panelIndex) {
        const choiceIndex = parseInt(choiceElement.getAttribute('data-choice'));
        const isCorrect = choiceIndex === panel.correct;

        // Подсвечиваем выбор
        choiceElement.classList.add(isCorrect ? 'correct' : 'incorrect');

        // Награждаем за правильный ответ
        if (isCorrect) {
            window.UserData.addCoins(2);

            // Переходим к следующей панели через секунду
            setTimeout(() => {
                this.currentPanel++;

                // Если это последняя панель, переходим к следующему комиксу
                if (this.currentPanel >= this.comics[this.currentComic].panels.length) {
                    this.currentPanel = 0;
                    this.nextComic();
                } else {
                    this.load();
                }
            }, 1000);
        } else {
            // Показываем правильный ответ
            const correctChoice = choiceElement.parentElement.querySelector(`[data-choice="${panel.correct}"]`);
            correctChoice.classList.add('correct');

            // Через 2 секунды позволяем выбрать снова
            setTimeout(() => {
                choiceElement.classList.remove('incorrect');
                correctChoice.classList.remove('correct');
            }, 2000);
        }
    },

    nextComic() {
        this.currentComic = (this.currentComic + 1) % this.comics.length;
        this.currentPanel = 0;
        this.load();
    },

    prevComic() {
        this.currentComic = (this.currentComic - 1 + this.comics.length) % this.comics.length;
        this.currentPanel = 0;
        this.load();
    },

    updateNavigationButtons() {
        const prevButton = document.getElementById('prev-comic');
        const nextButton = document.getElementById('next-comic');

        if (prevButton) {
            prevButton.style.display = this.currentComic > 0 ? 'inline-block' : 'none';
        }

        if (nextButton) {
            nextButton.textContent = this.currentComic < this.comics.length - 1 ?
                'Следующая история' : 'Первая история';
        }
    }
};