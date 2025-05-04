document.addEventListener('DOMContentLoaded', () => {
    const skullContainer = document.getElementById('skull-container');
    const skullCount = 5;
    const skulls = [];
    const colors = ['white', 'red', 'blue'];

    for (let i = 0; i < skullCount; i++) {
        const skull = document.createElement('div');
        skull.classList.add('skull');
        skull.style.backgroundColor = 'black';
        skull.style.border = '2px solid ' + colors[i % colors.length];
        skull.style.position = 'absolute';
        skull.style.width = '60px';
        skull.style.height = '60px';
        skull.style.borderRadius = '50%';
        skull.style.top = Math.random() * (window.innerHeight - 60) + 'px';
        skull.style.left = Math.random() * (window.innerWidth - 60) + 'px';
        skull.style.zIndex = '10';
        skullContainer.appendChild(skull);

        skulls.push({
            element: skull,
            x: parseFloat(skull.style.left),
            y: parseFloat(skull.style.top),
            vx: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
            vy: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
            exploded: false
        });
    }

    const container = document.querySelector('.container');

    function explode(skull) {
        if (skull.exploded) return;
        skull.exploded = true;

        const explosion = document.createElement('div');
        explosion.classList.add('explosion');
        explosion.style.position = 'absolute';
        explosion.style.width = '150px';
        explosion.style.height = '150px';
        explosion.style.borderRadius = '50%';
        explosion.style.top = (skull.y + 30 - 75) + 'px';
        explosion.style.left = (skull.x + 30 - 75) + 'px';
        explosion.style.zIndex = '20';
        explosion.style.pointerEvents = 'none';

        container.appendChild(explosion);

        explosion.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        });

        setTimeout(() => {
            container.removeChild(explosion);
            skull.exploded = false;
        }, 800);
    }

    function update() {
        skulls.forEach(skull => {
            if (skull.exploded) return;

            skull.x += skull.vx;
            skull.y += skull.vy;

            if (skull.x <= 0 || skull.x >= window.innerWidth - 60) {
                skull.vx *= -1;
                explode(skull);
            }
            if (skull.y <= 0 || skull.y >= window.innerHeight - 60) {
                skull.vy *= -1;
                explode(skull);
            }

            skull.element.style.left = skull.x + 'px';
            skull.element.style.top = skull.y + 'px';
        });

        requestAnimationFrame(update);
    }

    update();
});
