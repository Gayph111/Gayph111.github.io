// Основная игра "Безопасный город"
window.MainGame = {
    isRunning: false,
    score: 0,
    coins: 0,
    level: 1,
    lives: 3,
    carSpeed: 3,
    characterX: 50,
    characterY: 20,
    lightState: 'red',
    gameInterval: null,
    cars: [],
    coins: [],
    obstacles: [],
    keys: {},

    init() {
        this.bindGameEvents();
        this.bindKeyboardEvents();
    },

    bindGameEvents() {
        document.getElementById('start-game').addEventListener('click', () => this.start());
        document.getElementById('pause-game').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-game').addEventListener('click', () => this.start());
        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('active');
        });
        document.getElementById('continue-game').addEventListener('click', () => {
            document.getElementById('level-up-modal').classList.remove('active');
        });

        // Обработчики кнопок управления
        document.getElementById('btn-up').addEventListener('click', () => this.moveCharacter(0, 10));
        document.getElementById('btn-down').addEventListener('click', () => this.moveCharacter(0, -10));
        document.getElementById('btn-left').addEventListener('click', () => this.moveCharacter(-10, 0));
        document.getElementById('btn-right').addEventListener('click', () => this.moveCharacter(10, 0));
    },

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            if (!this.isRunning) return;

            // Управление WASD и стрелками
            if (e.key === 'w' || e.key === 'ArrowUp') this.moveCharacter(0, 10);
            if (e.key === 's' || e.key === 'ArrowDown') this.moveCharacter(0, -10);
            if (e.key === 'a' || e.key === 'ArrowLeft') this.moveCharacter(-10, 0);
            if (e.key === 'd' || e.key === 'ArrowRight') this.moveCharacter(10, 0);
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    },

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.resetGame();
        this.setupGame();

        document.getElementById('start-game').style.display = 'none';
        document.getElementById('pause-game').style.display = 'inline-block';

        // Скрываем модальные окна
        document.getElementById('game-over-modal').classList.remove('active');
        document.getElementById('level-up-modal').classList.remove('active');
    },

    resetGame() {
        this.score = 0;
        this.coins = 0;
        this.level = 1;
        this.lives = 3;
        this.carSpeed = 3;
        this.characterX = 50;
        this.characterY = 20;
        this.cars = [];
        this.coins = [];
        this.obstacles = [];

        this.updateStats();

        const character = document.getElementById('character');
        character.style.left = `${this.characterX}px`;
        character.style.bottom = `${this.characterY}px`;
    },

    setupGame() {
        // Устанавливаем красный свет
        this.setLight('red');

        // Запускаем игру
        this.gameInterval = setInterval(() => this.updateGame(), 50);

        // Меняем светофор каждые 5 секунд
        setInterval(() => this.changeTrafficLight(), 5000);

        // Создаем объекты
        this.createCars();
        this.createCoins();
        this.createObstacles();
    },

    createCars() {
        // Очищаем существующие машины
        document.querySelectorAll('.car').forEach(car => car.remove());
        this.cars = [];

        // Создаем 3 машины с разными начальными позициями
        for (let i = 0; i < 3; i++) {
            const car = document.createElement('div');
            car.className = `car car${i+1}`;
            car.style.right = `${-60 - i*200}px`;
            document.getElementById('game-board').appendChild(car);

            this.cars.push({
                element: car,
                position: -60 - i*200,
                speed: this.carSpeed + Math.random() * 2
            });
        }
    },

    createCoins() {
        // Очищаем существующие монеты
        document.querySelectorAll('.coin').forEach(coin => coin.remove());
        this.coins = [];

        // Создаем 5 монет в случайных местах
        for (let i = 0; i < 5; i++) {
            const coin = document.createElement('div');
            coin.className = 'coin';
            const x = Math.random() * 700 + 50;
            const y = Math.random() * 300 + 100;
            coin.style.left = `${x}px`;
            coin.style.bottom = `${y}px`;
            document.getElementById('game-board').appendChild(coin);

            this.coins.push({
                element: coin,
                x: x,
                y: y,
                collected: false
            });
        }
    },

    createObstacles() {
        // Очищаем существующие препятствия
        document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
        this.obstacles = [];

        // Создаем 3 препятствия
        for (let i = 0; i < 3; i++) {
            const obstacle = document.createElement('div');
            obstacle.className = 'obstacle';
            const x = Math.random() * 700 + 50;
            const y = Math.random() * 300 + 100;
            obstacle.style.left = `${x}px`;
            obstacle.style.bottom = `${y}px`;
            document.getElementById('game-board').appendChild(obstacle);

            this.obstacles.push({
                element: obstacle,
                x: x,
                y: y
            });
        }
    },

    moveCharacter(deltaX, deltaY) {
        if (!this.isRunning) return;

        const gameBoard = document.getElementById('game-board');
        const character = document.getElementById('character');

        this.characterX = Math.max(0, Math.min(gameBoard.offsetWidth - 40, this.characterX + deltaX));
        this.characterY = Math.max(20, Math.min(460, this.characterY + deltaY));

        character.style.left = `${this.characterX}px`;
        character.style.bottom = `${this.characterY}px`;

        this.checkCoinCollision();
        this.checkObstacleCollision();
    },

    checkCoinCollision() {
        this.coins.forEach(coin => {
            if (!coin.collected) {
                const coinLeft = coin.x;
                const coinRight = coin.x + 20;
                const coinBottom = coin.y;
                const coinTop = coin.y + 20;

                const charLeft = this.characterX;
                const charRight = this.characterX + 40;
                const charBottom = this.characterY;
                const charTop = this.characterY + 40;

                if (charRight > coinLeft && charLeft < coinRight &&
                    charTop > coinBottom && charBottom < coinTop) {

                    coin.collected = true;
                    coin.element.remove();
                    this.coins++;
                    window.UserData.addCoins(1);
                    document.getElementById('game-coins').textContent = this.coins;

                    // Создаем новую монету
                    setTimeout(() => {
                        this.createCoins();
                    }, 1000);
                }
            }
        });
    },

    checkObstacleCollision() {
        this.obstacles.forEach(obstacle => {
            const obsLeft = obstacle.x;
            const obsRight = obstacle.x + 40;
            const obsBottom = obstacle.y;
            const obsTop = obstacle.y + 40;

            const charLeft = this.characterX;
            const charRight = this.characterX + 40;
            const charBottom = this.characterY;
            const charTop = this.characterY + 40;

            if (charRight > obsLeft && charLeft < obsRight &&
                charTop > obsBottom && charBottom < obsTop) {

                // Столкновение с препятствием
                this.lives--;
                document.getElementById('lives').textContent = this.lives;

                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    // Возвращаем персонажа в начало
                    this.characterX = 50;
                    this.characterY = 20;
                    const character = document.getElementById('character');
                    character.style.left = `${this.characterX}px`;
                    character.style.bottom = `${this.characterY}px`;
                }
            }
        });
    },

    updateGame() {
        if (!this.isRunning) return;

        const gameBoard = document.getElementById('game-board');

        // Движение машин
        this.cars.forEach(car => {
            car.position += car.speed;

            if (car.position > gameBoard.offsetWidth) {
                car.position = -60;
                this.score++;
                document.getElementById('score').textContent = this.score;

                // Повышаем уровень каждые 10 очков
                if (this.score % 10 === 0) {
                    this.levelUp();
                }
            }

            car.element.style.right = `${car.position}px`;
        });

        // Проверка столкновения с машинами
        const charRight = this.characterX + 40;
        const charTop = this.characterY + 40;

        let collision = false;

        this.cars.forEach(car => {
            const carLeft = gameBoard.offsetWidth - car.position - 60;
            const carBottom = 20;
            const carRight = carLeft + 60;
            const carTop = carBottom + 40;

            // Если персонаж на дороге и машина рядом
            if (this.characterY <= 100 &&
                charRight > carLeft && this.characterX < carRight &&
                charTop > carBottom && this.characterY < carTop) {

                // Если свет красный или желтый - столкновение
                if (this.lightState !== 'green') {
                    collision = true;
                }
            }
        });

        if (collision) {
            this.lives--;
            document.getElementById('lives').textContent = this.lives;

            if (this.lives <= 0) {
                this.gameOver();
            } else {
                // Возвращаем персонажа в начало
                this.characterX = 50;
                this.characterY = 20;
                const character = document.getElementById('character');
                character.style.left = `${this.characterX}px`;
                character.style.bottom = `${this.characterY}px`;
            }
        }

        // Проверка достижения другой стороны
        if (this.characterX > gameBoard.offsetWidth - 100) {
            this.score += 5;
            document.getElementById('score').textContent = this.score;
            this.characterX = 50;
            this.characterY = 20;
            const character = document.getElementById('character');
            character.style.left = `${this.characterX}px`;
            character.style.bottom = `${this.characterY}px`;
        }
    },

    levelUp() {
        this.level++;
        this.carSpeed += 0.5;
        document.getElementById('game-level').textContent = this.level;

        // Показываем окно повышения уровня
        document.getElementById('level-up-text').textContent = `Ты достиг ${this.level} уровня! Машины теперь едут быстрее!`;
        document.getElementById('level-up-modal').classList.add('active');

        // Проверяем достижения
        window.UserData.checkGameAchievements();
    },

    changeTrafficLight() {
        if (!this.isRunning) return;

        if (this.lightState === 'red') {
            this.setLight('yellow');
        } else if (this.lightState === 'yellow') {
            this.setLight('green');
        } else {
            this.setLight('red');
        }
    },

    setLight(color) {
        this.lightState = color;

        // Сбрасываем все огни
        document.getElementById('red-light').classList.remove('active');
        document.getElementById('yellow-light').classList.remove('active');
        document.getElementById('green-light').classList.remove('active');

        // Включаем нужный свет
        if (color === 'red') {
            document.getElementById('red-light').classList.add('active');
        } else if (color === 'yellow') {
            document.getElementById('yellow-light').classList.add('active');
        } else {
            document.getElementById('green-light').classList.add('active');
        }
    },

    togglePause() {
        if (this.isRunning) {
            clearInterval(this.gameInterval);
            this.isRunning = false;
            document.getElementById('pause-game').textContent = 'Продолжить';
        } else {
            this.gameInterval = setInterval(() => this.updateGame(), 50);
            this.isRunning = true;
            document.getElementById('pause-game').textContent = 'Пауза';
        }
    },

    gameOver() {
        clearInterval(this.gameInterval);
        this.isRunning = false;
        this.carSpeed = 3;

        // Сохраняем лучший результат
        if (this.score > window.UserData.data.gameScore) {
            window.UserData.data.gameScore = this.score;
        }

        window.UserData.data.gameLevel = Math.max(window.UserData.data.gameLevel, this.level);
        window.UserData.data.totalTime += 5;

        // Проверяем достижения
        window.UserData.checkGameAchievements();

        // Показываем окно окончания игры
        document.getElementById('game-over-text').textContent =
            `Ты набрал ${this.score} очков и собрал ${this.coins} монет.`;
        document.getElementById('game-over-modal').classList.add('active');

        document.getElementById('start-game').style.display = 'inline-block';
        document.getElementById('pause-game').style.display = 'none';

        window.UserData.save();
    },

    updateStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('game-level').textContent = this.level;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('game-coins').textContent = this.coins;
    }
};