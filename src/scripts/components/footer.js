document.addEventListener('DOMContentLoaded', () => {
    const toggleInputsLabel = () => {
        const inputGroups = document.querySelectorAll('.input-group');

        inputGroups.forEach(group => {

            const input = group.querySelector('input');

            input.addEventListener('focus', (e) => {
                group.classList.add('active');
            })

            input.addEventListener('blur', () => {
                const value = input.value;

                if (value === '') {
                    group.classList.remove('active')
                }
            })
        })
    }

    toggleInputsLabel();
})