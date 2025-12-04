// Система тестирования
window.Quiz = {
    currentQuestion: 0,
    score: 0,
    perfectStreak: 0,
    quizData: [
        {
            question: "Как правильно переходить дорогу по пешеходному переходу?",
            options: [
                "Бегом, чтобы быстрее",
                "Сначала посмотреть налево, потом направо",
                "Не смотреть по сторонам, водители сами остановятся",
                "Только когда горит красный свет"
            ],
            correct: 1
        },
        {
            question: "Что должен делать велосипедист перед поворотом?",
            options: [
                "Ничего, просто повернуть",
                "Подать сигнал рукой",
                "Кричать 'Поворачиваю!'",
                "Увеличить скорость"
            ],
            correct: 1
        },
        {
            question: "Что означает этот дорожный знак? 🚸",
            options: [
                "Осторожно, дети",
                "Пешеходный переход",
                "Велосипедная дорожка",
                "Остановка запрещена"
            ],
            correct: 0
        },
        {
            question: "Когда можно переходить дорогу на зеленый свет светофора?",
            options: [
                "Сразу, как загорелся зеленый",
                "Только если нет машин",
                "Убедившись, что все машины остановились",
                "Всегда, не глядя"
            ],
            correct: 2
        },
        {
            question: "Что означает мигающий зеленый сигнал светофора?",
            options: [
                "Можно переходить дорогу",
                "Скоро загорится желтый свет",
                "Светофор сломался",
                "Нужно ускорить шаг"
            ],
            correct: 1
        }
    ],

    init() {
        this.bindQuizEvents();
        this.loadQuestion();
    },

    bindQuizEvents() {
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
    },

    loadQuestion() {
        const quizContent = document.getElementById('quiz-content');
        const progressBar = document.getElementById('quiz-progress');
        const nextButton = document.getElementById('next-question');
        const restartButton = document.getElementById('restart-quiz');

        if (this.currentQuestion < this.quizData.length) {
            const question = this.quizData[this.currentQuestion];

            // Обновляем прогресс
            progressBar.style.width = `${(this.currentQuestion / this.quizData.length) * 100}%`;

            // Отображаем вопрос
            quizContent.innerHTML = `
                <div class="question">
                    <h3>Вопрос ${this.currentQuestion + 1} из ${this.quizData.length}</h3>
                    <p>${question.question}</p>
                    <div class="options">
                        ${question.options.map((option, index) => `
                            <div class="option" data-index="${index}">${option}</div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Добавляем обработчики для вариантов ответа
            document.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', (e) => {
                    this.handleAnswerSelection(e.target, question);
                });
            });

            nextButton.style.display = 'none';
            restartButton.style.display = 'none';
        } else {
            this.showResults();
        }
    },

    handleAnswerSelection(selectedOption, question) {
        // Снимаем выделение со всех вариантов
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Выделяем выбранный вариант
        selectedOption.classList.add('selected');

        // Проверяем ответ
        const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
        const correctIndex = question.correct;

        window.UserData.data.totalAnswers++;

        if (selectedIndex === correctIndex) {
            selectedOption.classList.add('correct');
            this.score++;
            window.UserData.data.correctAnswers++;
            this.perfectStreak++;
        } else {
            selectedOption.classList.add('incorrect');
            this.perfectStreak = 0;
            // Подсвечиваем правильный ответ
            document.querySelectorAll('.option')[correctIndex].classList.add('correct');
        }

        // Блокируем дальнейший выбор
        document.querySelectorAll('.option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });

        // Показываем кнопку "Следующий вопрос"
        document.getElementById('next-question').style.display = 'inline-block';
    },

    nextQuestion() {
        this.currentQuestion++;
        this.loadQuestion();
    },

    showResults() {
        const quizContent = document.getElementById('quiz-content');
        const progressBar = document.getElementById('quiz-progress');
        const nextButton = document.getElementById('next-question');
        const restartButton = document.getElementById('restart-quiz');

        progressBar.style.width = '100%';
        const correctPercentage = Math.round((this.score / this.quizData.length) * 100);

        let resultMessage = '';
        let coinsEarned = 0;

        if (correctPercentage === 100) {
            resultMessage = 'Отлично! Ты настоящий эксперт ПДД! 🏆';
            coinsEarned = 20;
        } else if (correctPercentage >= 70) {
            resultMessage = 'Хороший результат, но есть куда стремиться! 👍';
            coinsEarned = 10;
        } else {
            resultMessage = 'Нужно повторить правила дорожного движения! 📚';
            coinsEarned = 5;
        }

        // Сохраняем результаты
        const earnedCoins = window.UserData.completeQuiz(this.score, this.quizData.length);

        quizContent.innerHTML = `
            <div class="question">
                <h3>Тест завершен!</h3>
                <p>Твой результат: ${this.score} из ${this.quizData.length} (${correctPercentage}%)</p>
                <p>${resultMessage}</p>
                <p>Ты получил ${earnedCoins} монет! 🪙</p>
            </div>
        `;

        nextButton.style.display = 'none';
        restartButton.style.display = 'inline-block';

        // Проверяем достижения
        window.UserData.checkQuizAchievements();

        // Обновляем квесты
        if (window.Quests) {
            window.Quests.update();
        }
    },

    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.perfectStreak = 0;
        this.loadQuestion();
    }
};