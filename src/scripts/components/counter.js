window.addEventListener('DOMContentLoaded', function() {
    const toggleCounter = () => {
        const counters = document.querySelectorAll('.counter');

        if (counters.length < 1) return;

        function clickHandler (e) {
            const target = e.target;
            const incrementBtn = target.closest('.increment-btn');
            const decrementBtn = target.closest('.decrement-btn');
            const result = this.querySelector('.counter__result');
            const resultInput = this.querySelector('input');
            let count = Number(result.textContent);

            if (incrementBtn) {
                count++
            }

            if (decrementBtn && count >= 1) {
                count--;
            }

            result.textContent = count;
            resultInput.value = count;
        }

        counters.forEach(counter => counter.addEventListener('click', clickHandler))
    }
    toggleCounter()
})