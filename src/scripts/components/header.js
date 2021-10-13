window.addEventListener('DOMContentLoaded', function() {
    function applyHeaderLogic() {
        const header = document.querySelector('header');
        const menuBtn = document.querySelector('.menu-btn');
        const menu = document.querySelector('.menu');

        function toggleMenu() {
            header.classList.toggle('menu-active');
            menuBtn.classList.toggle('active');
            menu.classList.toggle('active');

            document.body.style.overflow = header.classList.contains('menu-active') ? 'hidden' : 'visible';
        }

        header.addEventListener('click', function(e) {
            const target = e.target;
            const menuBtn = target.closest('.menu-btn');
            const mobileMenu = target.matches('.menu');

            if (menuBtn || mobileMenu) {
                toggleMenu();
            }
        })

        window.addEventListener('keydown', function(e) {
            const key = e.key;

            if (key === 'Escape' && menu.classList.contains('active')) {
                toggleMenu();
            }
        })
    }

    applyHeaderLogic();

})