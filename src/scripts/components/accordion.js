window.addEventListener('DOMContentLoaded', function() {
    const toggleAccordion = () => {
        const accordions = document.querySelectorAll('.accordion');

        accordions.forEach(accordion => {
            accordion.addEventListener('click', e => {
                const target = e.target;

                const accordionHeader = target.closest('.accordion__header');

                if (accordionHeader) {
                    accordion.classList.toggle('is-open')
                    const accordionBody = accordion.querySelector('.accordion__body');

                    accordionBody.style.maxHeight = accordion.classList.contains('is-open') ? accordionBody.scrollHeight + 'px' : '0';
                }
            })
        })
    }

    toggleAccordion();
})