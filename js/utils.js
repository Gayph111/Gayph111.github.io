// Вспомогательные функции
window.Utils = {
    // Генерация случайного числа в диапазоне
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Форматирование времени
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // Проверка столкновения двух объектов
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    },

    // Локализованные сообщения
    messages: {
        correct: 'Правильно! 🎉',
        incorrect: 'Попробуй еще раз! 💪',
        completed: 'Задание выполнено! ✅',
        reward: (coins) => `Ты получаешь ${coins} монет! 🪙`
    },

    // Анимация появления элемента
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';

        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            element.style.opacity = opacity;

            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },

    // Анимация исчезновения элемента
    fadeOut(element, duration = 300) {
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(1 - progress / duration, 0);
            element.style.opacity = opacity;

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        requestAnimationFrame(animate);
    }
};