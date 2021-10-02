window.addEventListener('DOMContentLoaded', function() {
    const calculateLinesWidth = () => {
        const container = document.querySelector('.single-left__container');
        const lines = document.querySelectorAll('.single-left__line');
        const subtitle = document.querySelector('.single-left__subtitle');

        const setWidth = line => {
            const subtitleWidth = subtitle.clientWidth;
            const containerWidth = container.clientWidth;

            line.style.width = `${(containerWidth - (subtitleWidth + 49)) / 2}px`
        }

        const _resizer = new ResizeObserver(resizeHandler)

        function resizeHandler() {
            lines.forEach(line => setWidth(line))
        }
        _resizer.observe(container);
    }

    if (document.querySelector('.single')) {
        calculateLinesWidth();
    }
})