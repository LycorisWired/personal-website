(function() {
    var z = 10,
        saved = {},
        mq = matchMedia('(max-width:700px)');
    try {
        saved = JSON.parse(localStorage.getItem('card-pos') || '{}') || {}
    } catch (e) {}
    document.querySelectorAll('.card').forEach(function(c) {
        var id = c.dataset.id,
            bar = c.querySelector('.bar');
        if (saved[id] && !mq.matches) {
            c.style.left = saved[id].x + 'px';
            c.style.top = saved[id].y + 'px'
        }
        c.addEventListener('pointerdown', function() {
            c.style.zIndex = ++z
        });
        bar.addEventListener('pointerdown', function(e) {
            if (mq.matches) return;
            var r = c.getBoundingClientRect(),
                dx = e.clientX - r.left,
                dy = e.clientY - r.top;
            bar.setPointerCapture(e.pointerId);
            c.classList.add('drag');

            function mv(ev) {
                c.style.left = Math.max(0, Math.min(innerWidth - c.offsetWidth, ev.clientX - dx)) + 'px';
                c.style.top = Math.max(0, Math.min(innerHeight - 60, ev.clientY - dy)) + 'px';
            }

            function end() {
                bar.removeEventListener('pointermove', mv);
                bar.removeEventListener('pointerup', end);
                c.classList.remove('drag');
                saved[id] = {
                    x: parseInt(c.style.left, 10),
                    y: parseInt(c.style.top, 10)
                };
                try {
                    localStorage.setItem('card-pos', JSON.stringify(saved))
                } catch (e) {}
            }
            bar.addEventListener('pointermove', mv);
            bar.addEventListener('pointerup', end);
        });
    });

    // Function to keep cards within the viewport bounds
    function keepCardsOnScreen() {
        if (window.innerWidth <= 700) return;

        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            // Get current inline position (from drag script)
            let currentLeft = parseInt(card.style.left, 10);
            let currentTop = parseInt(card.style.top, 10);

            // If the drag script hasn't set a position yet, skip
            if (isNaN(currentLeft) || isNaN(currentTop)) return;

            const cardWidth = card.offsetWidth;
            const cardHeight = card.offsetHeight;

            // Add a 20px padding so they don't touch the very edge
            const padding = 20;

            // Calculate maximum allowed X and Y
            const maxLeft = window.innerWidth - cardWidth - padding;
            const maxTop = window.innerHeight - cardHeight - padding;

            // Clamp the values so they can't go below 0 or above the max
            let newLeft = Math.max(padding, Math.min(currentLeft, maxLeft));
            let newTop = Math.max(padding, Math.min(currentTop, maxTop));

            // Apply the clamped values
            card.style.left = `${newLeft}px`;
            card.style.top = `${newTop}px`;
        });
    }

    window.addEventListener('resize', keepCardsOnScreen);

    document.addEventListener('DOMContentLoaded', keepCardsOnScreen);
})();
