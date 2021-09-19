window.addEventListener('DOMContentLoaded', function() {
    const servicesSlider = () => {
        const sliderContainer = document.getElementById("servicesSlider");
        const sliderWrapper = document.getElementById("servicesSliderWrapper");
        const sliderSlide = sliderWrapper.querySelectorAll(".slider-slide");
        const slideBackground = sliderContainer.querySelector(
            ".services-slider__background"
        );
        const sliderBtnPrev = sliderContainer.querySelector(
            ".services-slider__button_prev"
        );
        const sliderBtnNext = sliderContainer.querySelector(
            ".services-slider__button_next"
        );
        const slideCount = sliderSlide.length;

        let distance = 770;
        let position = -distance;
        let count = 1;

        sliderSlide[count].classList.add("slider-slide_active");

        const sliderAdaptive = (...mediaQuery) => {
            mediaQuery.forEach(query => {
                if (query.media === "(max-width: 320px)" && query.matches) {
                    console.log(query.media);
                    distance = 535;
                    position = -distance;
                } else if (query.media === "(max-width: 440px)" && query.matches) {
                    console.log(query.media);
                    distance = 645;
                    position = -distance;
                } else if (query.media === "(min-width: 441px)" && query.matches) {
                    console.log(query.media);
                    distance = 770;
                    position = -distance;
                }
            });

            sliderWrapper.style.transform = `translateX(${position}px)`;
            slideBackground.classList.add("active");
        };

        const checkWidth = () => {
            const media440 = window.matchMedia("(max-width: 440px)");
            const media320 = window.matchMedia("(max-width: 320px)");
            const media = window.matchMedia("min-width: 441px");

            sliderAdaptive(media440, media320, media);

            media440.addEventListener("change", sliderAdaptive);
            media320.addEventListener("change", sliderAdaptive);
            media.addEventListener("change", sliderAdaptive);
        };

        checkWidth();

        sliderContainer.addEventListener("click", event => {
            const target = event.target;

            if (
                target.matches(".services-slider__button_prev") ||
                target.matches(".services-slider__button_next")
            ) {
                slideBackground.classList.remove("active");
                sliderSlide[count].classList.remove("slider-slide_active");

                setTimeout(() => {
                    slideBackground.classList.add("active");
                    sliderSlide[count].classList.add("slider-slide_active");
                }, 1000);
            }

            if (target.matches(".services-slider__button_prev") && count > 0) {
                position += distance;
                count--;
            }
            if (
                target.matches(".services-slider__button_next") &&
                count < slideCount - 1
            ) {
                position -= distance;
                count++;
            }

            sliderWrapper.style.transform = `translateX(${position}px)`;

            sliderBtnNext.style.display =
                count === slideCount - 1 ? "none" : "inline-block";
            sliderBtnPrev.style.display = count === 0 ? "none" : "inline-block";
        });
    };

    servicesSlider();

})