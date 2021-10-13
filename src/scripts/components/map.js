window.addEventListener('DOMContentLoaded', function() {
    const map = document.getElementById('map');

    const mapInit = () => {
        const API_KEY = 'ff4e5639-01bd-4005-9741-f3ea0ab6d1b5';
        let isFirstLoad = true;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {

                if (isFirstLoad) {
                    const script = document.createElement('script');
                    const URL = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=${API_KEY}`;
                    script.setAttribute('src', `${URL}`)
                    script.setAttribute('type', `text/javascript`)

                    document.body.append(script)

                    script.onload = () => {
                        ymaps.ready(init)
                    };
                }

                isFirstLoad = false;
            }
        })

        observer.observe(document.querySelector('.footer'));

        function init () {
            const myMap = new ymaps.Map('map', {
                center: [53.811103, 58.637],
                zoom: 17,
                controls: [],
            }, {
               preset: 'islands#blackStretchyIcon',
           });

            const myPlacemark1 = new ymaps.Placemark([53.811103, 58.636024], {
                   hintContent: 'Эдельвейс'
               }, {
                   preset: 'islands#brownHotelIcon'
               })

            myMap.geoObjects.add(myPlacemark1)
        }
    }

    if (map) {
        mapInit();
    }
})