window.addEventListener('DOMContentLoaded', function() {
    const configureSliderV1 = () => {
        const slider = new Swiper('.slider-v1', {
            slidesPerView: 'auto',
            slidesPerGroupAuto: true,
            loop: true,
            speed: 800,

            navigation: {
                prevEl: '.slider-v1-navigation-prev',
                nextEl: '.slider-v1-navigation-next',
            }
        });

        const addActiveClasses = () => {
            slider.slides[slider.activeIndex].classList.add('is-active');
            slider.navigation.$nextEl[0].style.opacity = "1";
            slider.navigation.$prevEl[0].style.opacity = "1";
        }

        const removeActiveClasses = () => {
            slider.slides[slider.previousIndex].classList.remove('is-active');
            slider.navigation.$nextEl[0].style.opacity = "0";
            slider.navigation.$prevEl[0].style.opacity = "0";
        }

        slider.on('slideChangeTransitionEnd', addActiveClasses);
        slider.on('activeIndexChange', removeActiveClasses);

        addActiveClasses();
    }
    configureSliderV1();

    const configureSliderV2 = () => {
        let fadeSlider, noFadeSlider;

        const fadeSliderOptions = {
            slidesPerView: 1,
            effect: 'fade',
            speed: '1200',
            // autoplay: {
            //     delay: 3000
            // },
            pagination: {
                el: '.slider-v2-pagination',
                bulletElement: 'div',
                bulletClass: 'slider-v2-bullet',
                bulletActiveClass: 'active',
                clickable: true,
            }
        }

        const noFadeSliderOptions = {
            slidesPerView: 'auto',
        }

        const sliderAdaptive = (breakpoint) => {
            if (breakpoint.matches && !noFadeSlider) {
                noFadeSlider = new Swiper('.slider-v2-container', noFadeSliderOptions);

                if (fadeSlider) {
                    fadeSlider.destroy(true);
                    fadeSlider = null;
                }
            }

            if (!breakpoint.matches && !fadeSlider) {
                fadeSlider = new Swiper('.slider-v2-container', fadeSliderOptions);
                fadeSlider.on('activeIndexChange', () => {
                    const counter = document.getElementById('pageCounter');

                    counter.textContent = `0${fadeSlider.activeIndex + 1}`;
                })

                if (noFadeSlider) {
                    noFadeSlider.destroy(true);
                    noFadeSlider = null;
                }
            }
        }

        const checkBreakpoint = () => {
            const breakpoint = window.matchMedia('(max-width: 576px)');

            sliderAdaptive(breakpoint)

            breakpoint.addEventListener('change', sliderAdaptive);
        }

        checkBreakpoint();
    }
    configureSliderV2();
})