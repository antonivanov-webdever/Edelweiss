window.addEventListener('DOMContentLoaded', function() {
    const datePicker = () => {
        const calendar = document.querySelector('.calendar');
        if (!calendar) {
            return
        }

        const setDate = (date) => {

        }

        const createDayElem = (dayObj) => {
            const {num, isCurrentMonth, isCurrentDay} = dayObj;
            const dayElem = document.createElement('div');

            if (isCurrentMonth) {
                dayElem.classList.add('calendar__day', 'current-month')
            } else {
                dayElem.classList.add('calendar__day')
            }

            if (isCurrentDay) {
                dayElem.classList.add('current-day')
            }

            dayElem.textContent = num;

            return dayElem;
        }

        const getCurrentDate = () => {
            const date = new Date();
            const year = date.getFullYear()
            const dayOfWeek = date.getDay()
            const month = date.getMonth()
            const day = date.getDate()

            return {date, year, month, day, dayOfWeek};
        }

        const getDate = () => {
            const {date, year, month, day, dayOfWeek} = getCurrentDate();
            const daysInPrevMonth = new Date(year, month, 0).getDate()
            const dayOfWeekInPrevMonth = new Date(year, month, 0).getDay()
            const startDayOfWeek = new Date(year, month, 1).getDay()
            const prevDaysOffset = Math.abs((startDayOfWeek - 7) + 6);
            const prevDayOffsetStart = new Date(year, month, -prevDaysOffset).getDate() + 1
            const lastDayOfWeekInCurrentMonth = new Date(year, month + 1, 0).getDay()

            const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
            const nextMonthDaysOffset = Math.abs(lastDayOfWeekInCurrentMonth - 7);



            const monthNames = {
                0: 'Январь',
                1: 'Февраль',
                2: 'Март',
                3: 'Апрель',
                4: 'Май',
                5: 'Июнь',
                6: 'Июль',
                7: 'Август',
                8: 'Сентябрь',
                9: 'Октябрь',
                10: 'Ноябрь',
                11: 'Декабрь'
            }

            const monthName = monthNames[month]

            return {day, year, monthName, daysInPrevMonth, prevDayOffsetStart, daysInCurrentMonth, nextMonthDaysOffset}
        }

        const isAvailableDate = (targetDate) => {
            const targetTime = new Date(targetDate).getTime()
            const currentTime = new Date().getTime()

            return targetTime > currentTime;
        }

        const createDatePicker = () => {
            const monthOutput = calendar.querySelector('.calendar__month');
            const daysOutput = calendar.querySelector('.calendar__days');

            const {day, year, monthName, daysInPrevMonth, prevDayOffsetStart, daysInCurrentMonth, nextMonthDaysOffset} = getDate();

            monthOutput.textContent = `${monthName}, ${year}`;

            const daysArr = []

            for (let d = prevDayOffsetStart; d <= daysInPrevMonth; d++) {
                const dayObj = {
                    num: d,
                    isCurrentMonth: false,
                    isCurrentDay: false,
                    isDisabled: true,
                }

                daysArr.push(dayObj)
            }

            for (let d = 1; d <= daysInCurrentMonth; d++) {
                const dayObj = {
                    num: d,
                    isCurrentMonth: true,
                    isCurrentDay: d === day,
                    isDisabled: true
                }

                daysArr.push(dayObj)
            }

            for (let d = 1; d <= nextMonthDaysOffset; d++) {
                const dayObj = {
                    num: d,
                    isCurrentMonth: false,
                    isCurrentDay: false,
                    isDisabled: true
                }

                daysArr.push(dayObj)
            }

            daysArr.forEach(d => {
                const dayElem = createDayElem(d);

                daysOutput.append(dayElem);
            })
        }

        createDatePicker()

        const setMonth = () => {

        }

        const appendDays = () => {

        }


        const clickHandler = (e) => {
            const target = e.target;

        }
        calendar.addEventListener('click', clickHandler)

    }

    datePicker();
})