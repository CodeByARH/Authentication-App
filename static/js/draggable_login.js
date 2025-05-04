document.addEventListener('DOMContentLoaded', () => {
    const draggable = document.getElementById('draggable-container');
    let isDragging = false;
    let offsetX, offsetY;

    draggable.style.position = 'absolute';
    draggable.style.top = '50%';
    draggable.style.left = '50%';
    draggable.style.transform = 'translate(-50%, -50%)';

    draggable.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - draggable.offsetLeft;
        offsetY = e.clientY - draggable.offsetTop;
        draggable.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        draggable.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            const maxX = window.innerWidth - draggable.offsetWidth;
            const maxY = window.innerHeight - draggable.offsetHeight;
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            draggable.style.left = x + 'px';
            draggable.style.top = y + 'px';
            draggable.style.transform = 'none';
        }
    });

    draggable.style.cursor = 'grab';
});
