window.addEventListener('DOMContentLoaded', function() {
    const datePicker = () => {
        const calendar = document.querySelector('.calendar');
        if (!calendar) {
            return
        }

        const checkIn = document.querySelector('.params-item__check-in');
        const checkOut = document.querySelector('.params-item__check-out');
        const periodOutput = document.querySelector('.term__count')

        const clearDatePicker = () => {
            const daysOutput = calendar.querySelector('.calendar__days');
            daysOutput.innerHTML = '';
        }

        const createDayElem = (dayObj) => {
            const {num, isCurrentMonth, isCurrentDay, date, time} = dayObj;
            const dayElem = document.createElement('div');
            const isDisabled = isDisabledDate(date);


            if (isCurrentMonth) {
                dayElem.classList.add('calendar__day', 'current-month')
            } else {
                dayElem.classList.add('calendar__day')
            }

            if (isDisabled && typeof isDisabled === "boolean") {
                dayElem.classList.add('calendar__day--disabled');
            }

            if (isDisabled === 'today') {
                dayElem.classList.add('current-day')
            }

            dayElem.dataset.date = date;

            dayElem.textContent = num;

            return dayElem;
        }

        const getCurrentDate = () => {
            const date = new Date();
            const year = date.getFullYear()
            const dayOfWeek = date.getDay()
            const month = date.getMonth()
            const day = date.getDate();

            return {date, year, month, day, dayOfWeek};
        }

        const getDate = (targetMonth, targetYear) => {
            const {year, month, day} = getCurrentDate();
            let monthVar = 0;

            if (targetMonth === undefined) {
                monthVar = month;
            } else {
                monthVar = targetMonth;
            }

            const yearVar = targetYear || year;
            const daysInPrevMonth = new Date(yearVar, monthVar, 0).getDate()
            const startDayOfWeek = new Date(yearVar, monthVar, 1).getDay() === 0 ? 7 : new Date(yearVar, monthVar, 1).getDay();
            const prevDaysOffset = 7 - (7 - (startDayOfWeek - 2)) ;
            const prevDayOffsetStart = new Date(yearVar, monthVar, -prevDaysOffset).getDate()
            const lastDayOfWeekInCurrentMonth = new Date(yearVar, monthVar + 1, 0).getDay()
            const daysInCurrentMonth = new Date(yearVar, monthVar + 1, 0).getDate()
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
            const monthName = monthNames[monthVar]

            return {day, monthVar, yearVar, monthName, daysInPrevMonth, prevDayOffsetStart, daysInCurrentMonth, nextMonthDaysOffset}
        }

        function isDisabledDate(targetDate) {
            const {year, month, day} = getCurrentDate()
            const currentDate = `${year},${month},${day}`;
            const date = new Date(currentDate).getTime();
            const target = new Date(targetDate).getTime();

            if (date === target) {
                return 'today';
            }

            return target < date;
        }

        const createDatePicker = (targetMonth, targetYear) => {
            const monthOutput = calendar.querySelector('.calendar__month');
            const daysOutput = calendar.querySelector('.calendar__days');
            const {day, monthVar, yearVar, monthName, daysInPrevMonth, prevDayOffsetStart, daysInCurrentMonth, nextMonthDaysOffset} = getDate(targetMonth, targetYear);
            const daysArr = []

            monthOutput.textContent = `${monthName}, ${yearVar}`;
            monthOutput.dataset.monthIndex = `${monthVar}`;
            monthOutput.dataset.year = `${yearVar}`;

            for (let d = prevDayOffsetStart; d <= daysInPrevMonth && prevDayOffsetStart > 1; d++) {
                const dayObj = {
                    num: d,
                    isCurrentMonth: false,
                    date: `${yearVar},${monthVar - 1},${d}`,
                }

                daysArr.push(dayObj)
            }

            for (let d = 1; d <= daysInCurrentMonth; d++) {
                const dayObj = {
                    num: d,
                    isCurrentMonth: true,
                    date: `${yearVar},${monthVar},${d}`,
                }

                daysArr.push(dayObj)
            }

            for (let d = 1; d <= nextMonthDaysOffset; d++) {
                const dayObj = {
                    num: d,
                    isCurrentMonth: false,
                    date: `${yearVar},${monthVar + 1},${d}`,
                }

                daysArr.push(dayObj)
            }

            daysArr.forEach(d => {
                const dayElem = createDayElem(d);

                daysOutput.append(dayElem);
            })
        }

        createDatePicker()

        const checkDates = ( targetMonth, targetYear ) => {
            const prevMonthBtn = calendar.querySelector('.calendar__button-prev')
            const {year, month} = getCurrentDate();

            if (targetMonth === month && targetYear === year) {
                prevMonthBtn.setAttribute('disabled', 'true');
                prevMonthBtn.classList.add('disabled')
            } else {
                if (prevMonthBtn.getAttribute('disabled')) {
                    prevMonthBtn.removeAttribute('disabled');
                    prevMonthBtn.classList.remove('disabled')
                }
            }
        }

        checkDates(new Date().getMonth(), new Date().getFullYear())

        function getFormattedDate(day) {
            const dateArr = day.dataset.date.split(',').reverse();
            return dateArr.map(item => item.length < 2 ? `0${item}` : `${item}`).join('.')
        }

        checkIn.textContent = getFormattedDate(document.querySelector('.calendar__day.current-day'))
        checkOut.textContent = getFormattedDate(document.querySelector('.calendar__day.current-day').nextElementSibling)

        function calculatePeriod() {
            const checkInDay = document.querySelector('.check-in').dataset.date;
            const checkOutDay = document.querySelector('.check-out').dataset.date;
            const checkInDate = new Date(checkInDay).getTime();
            const checkOutDate = new Date(checkOutDay).getTime();

            return (checkOutDate - checkInDate) / 1000 / 60 / 60 / 24;
        }

        let startDate = null,
            endDate = null;

        const clickHandler = (e) => {
            const target = e.target;
            const monthOutput = document.querySelector('.calendar__month');
            const nextMonth = target.closest('.calendar__button-next');
            const prevMonth = target.closest('.calendar__button-prev');
            const day = target.closest('.calendar__day:not(.calendar__day--disabled)');

            if (nextMonth || prevMonth) {
                const curMonth = Number(monthOutput.dataset.monthIndex);
                const curYear = Number(monthOutput.dataset.year);

                let targetMonth = curMonth;
                let targetYear = curYear;

                if (nextMonth && targetMonth >= 0 && targetMonth < 12) {
                    targetMonth = curMonth + 1;
                }
                if (prevMonth && targetMonth >= 0) {
                    targetMonth = curMonth - 1;
                }
                if (nextMonth && targetMonth >= 12) {
                    targetMonth = 0;
                    targetYear = curYear + 1;
                }

                if (prevMonth && targetMonth < 0) {
                    targetMonth = 11;
                    if (curYear > new Date().getFullYear()) {
                        targetYear = curYear - 1
                    }
                }

                checkDates(targetMonth, targetYear)
                clearDatePicker();
                createDatePicker(targetMonth, targetYear)
            }

            if (day) {
                const formattedDate = getFormattedDate(day)
                const days = document.querySelectorAll('.calendar__day')
                const arr = Array.from(days);

                if (day.classList.contains('check-in') || day.classList.contains('check-out')) {
                    return
                }

                if (startDate !== null && endDate === null) {
                    const checkInDay = document.querySelector('.check-in');
                    const checkInDayIndex = arr.indexOf(checkInDay);
                    const dayIndex = arr.indexOf(day);

                    if (dayIndex < checkInDayIndex) {
                        checkInDay.classList.remove('check-in');
                        startDate = null;
                        periodOutput.textContent = '1'
                        return
                    }
                }

                if (endDate !== null && startDate !== null) {
                    startDate = null;
                    endDate = null;
                    checkIn.textContent = getFormattedDate(document.querySelector('.calendar__day.current-day'))
                    checkOut.textContent = getFormattedDate(document.querySelector('.calendar__day.current-day').nextElementSibling)
                    document.querySelector('.check-in').classList.remove('check-in')
                    document.querySelector('.check-out').classList.remove('check-out')
                    document.querySelectorAll('.day-between').forEach(item => item.classList.remove('day-between'))

                }

                if (startDate !== null) {
                    if (!day.classList.contains('check-out')) {
                        day.classList.add('check-out');
                        checkOut.textContent = formattedDate;
                        endDate = day.dataset.date;
                        periodOutput.textContent = calculatePeriod()

                        const checkInDay = document.querySelector('.check-in');
                        const checkInDayIndex = arr.indexOf(checkInDay);
                        const checkOutDayIndex = arr.indexOf(day);

                        for (let i = checkInDayIndex + 1; i < checkOutDayIndex; i++) {
                            days[i].classList.add('day-between');
                        }

                    }
                }
                if (startDate === null) {
                    if (!day.classList.contains('check-in')) {
                        day.classList.add('check-in');
                        checkIn.textContent = formattedDate;
                        checkOut.textContent = getFormattedDate(day.nextElementSibling)
                        startDate = day.dataset.date;
                    }
                }
            }
        }

        calendar.addEventListener('click', clickHandler)

    }

    datePicker();
})