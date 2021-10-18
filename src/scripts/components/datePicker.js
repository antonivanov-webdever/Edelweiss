window.addEventListener('DOMContentLoaded', function() {
    function getWeekNumber(date) {
        const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfTheYear) / 86400000;

        return Math.ceil((pastDaysOfYear + firstDayOfTheYear.getDay() + 1) / 7)
    }

    function isLeapYear(year) {
        return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
    }

    class Day {
        constructor(date = null, lang = 'default') {
            date = date ?? new Date();

            this.Date = date;
            this.date = date.getDate();
            this.day = date.toLocaleString(lang, {weekday: 'long'});
            this.dayNumber = date.getDay() + 1;
            this.dayShort = date.toLocaleString(lang, {weekday: 'short'});
            this.year = date.getFullYear();
            this.yearShort = date.toLocaleString(lang, {year: '2-digit'});
            this.month = date.toLocaleString(lang, {month: 'long'});
            this.monthShort = date.toLocaleString(lang, {month: 'short'});
            this.monthNumber = date.getMonth() + 1;
            this.timestamp = date.getTime();
            this.week = getWeekNumber(date);
        }

        get isToday() {
            return this.isEqualTo(new Date());
        }

        isEqualTo(date) {
            date = date instanceof Day ? date.Date : date;

            return date.getDate() === this.date &&
                date.getMonth() === this.monthNumber - 1 &&
                date.getFullYear() === this.year;
        }

        format(formatStr) {
            return formatStr
                .replace(/\bYYYY\b/, this.year)
                .replace(/\bYYY\b/, this.yearShort)
                .replace(/\bWW\b/, this.week.toString().padStart(2, '0'))
                .replace(/\bW\b/, this.week)
                .replace(/\bDDDD\b/, this.day)
                .replace(/\bDDD\b/, this.dayShort)
                .replace(/\bDD\b/, this.date.toString().padStart(2, '0'))
                .replace(/\bD\b/, this.date)
                .replace(/\bMMMM\b/, this.month)
                .replace(/\bMMM\b/, this.monthShort)
                .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, '0'))
                .replace(/\bM\b/, this.monthNumber)
        }
    }

    class Month {
        constructor(date = null, lang = 'default') {
            const day = new Day(date, lang);
            const monthsSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            this.lang = lang;

            this.name = day.month;
            this.number = day.monthNumber;
            this.year = day.year;
            this.numberOfDays = monthsSize[this.number - 1];

            if (this.number === 2) {
                this.numberOfDays += isLeapYear(day.year) ? 1 : 0;
            }

            this[Symbol.iterator] = function* () {
                let number = 1;
                yield this.getDay(number);
                while (number < this.numberOfDays) {
                    ++number;
                    yield this.getDay(number);
                }
            }
        }

        getDay(date) {
            return new Day(new Date(this.year, this.number - 1, date), this.lang);
        }
    }

    class Calendar {
        weekDays = Array.from({length: 7});

        constructor(year = null, monthNumber = null, lang = 'default') {
            this.today = new Day(null, lang);
            this.year = year ?? this.today.year;
            this.month = new Month(new Date(this.year, (monthNumber || this.today.monthNumber) - 1), lang);
            this.lang = lang;

            this[Symbol.iterator] = function* () {
                let number = 1;
                yield this.getMonth(number);
                while (number < 12) {
                    ++number;
                    yield this.getMonth(number);
                }
            }

            this.weekDays.forEach((_, i) => {
                const day = this.month.getDay(i + 1);
                if (!this.weekDays.includes(day.day)) {
                    this.weekDays[day.dayNumber - 1] = day.day
                }
            })
        }

        get isLeapYear() {
            return isLeapYear(this.year);
        }

        getMonth(monthNumber) {
            return new Month(new Date(this.year, monthNumber - 1), this.lang);
        }

        getPreviousMonth() {
            if (this.month.number === 1) {
                return new Month(new Date(this.year - 1, 11), this.lang);
            }

            return new Month(new Date(this.year, this.month.number - 2), this.lang);
        }

        getNextMonth() {
            if (this.month.number === 12) {
                return new Month(new Date(this.year + 1, 0), this.lang);
            }

            return new Month(new Date(this.year, this.month.number + 2), this.lang);
        }

        goToDate(monthNumber, year) {
            this.month = new Month(new Date(year, monthNumber - 1), this.lang);
            this.year = year;
        }

        goToNextYear() {
            this.year += 1;
            this.month = new Month(new Date(this.year, 0), this.lang);
        }

        goToPreviousYear() {
            this.year -= 1;
            this.month = new Month(new Date(this.year, 11), this.lang);
        }

        goToNextMonth() {
            if (this.month.number === 12) {
                return this.goToNextYear();
            }

            this.month = new Month(new Date(this.year, (this.month.number + 1) - 1), this.lang);
        }

        goToPreviousMonth() {
            if (this.month.number === 1) {
                return this.goToPreviousYear();
            }

            this.month = new Month(new Date(this.year, (this.month.number - 1) - 1), this.lang);
        }
    }

    class DatePicker {
        elementsArr = [];
        checkIn = null;
        checkOut = null;
        checkInEl = null;
        checkOutEl = null;
        checkInDay = null;
        checkOutDay = null;
        prevBtn = null;
        nextBtn = null;
        monthElement = null;

        constructor(container, control, daysContainer) {
            this.container = document.querySelector(container);
            this.control = this.container.querySelector(control);
            this.daysContainer = this.container.querySelector(daysContainer);
            this.checkInTextEl = document.querySelector('.params-item__check-in');
            this.checkOutTextEl = document.querySelector('.params-item__check-out');
            this.daysCountEl = document.querySelector('.term__count');
            const lang = window.navigator.language;
            const date = new Date(this.date ?? Date.now());
            this.date = new Day(date, lang);
            this.calendar = new Calendar(this.date.year, this.date.monthNumber, lang);

            this.render();
        }

        init() {
            const [prevBtn, calendarDateElement, nextButton] = this.control.children;
            const d = new Day()
            const nextDayStr = this.getNextDay(d)

            this.prevBtn = this.control.children[0]
            this.monthElement = this.control.children[1]
            this.nextBtn = this.control.children[2]
            this.calendarDateElement = calendarDateElement;

            this.checkPrevMonth()

            prevBtn.addEventListener('click', () => this.prevMonth());
            nextButton.addEventListener('click', () => this.nextMonth());

            this.checkInTextEl.textContent = `${this.date.date}.${this.date.monthNumber}.${this.date.year}`;
            this.checkOutTextEl.textContent = nextDayStr;

            this.renderCalendarDays();
        }

        checkPrevMonth() {
            if (this.calendar.getPreviousMonth().number < this.date.monthNumber && this.calendar.year <= this.date.year) {
                this.prevBtn.setAttribute('disabled', 'true')
                this.prevBtn.classList.add('disabled')
            } else {
                this.prevBtn.removeAttribute('disabled');
                this.prevBtn.classList.remove('disabled')
            }
        }

        getNextDay(d) {
            const day = d ?? new Day();
            const nextDay = new Date(day.year,day.monthNumber - 1, day.date + 1);
            const nextDayNumber = nextDay.getDate().toString().padStart(2, '0');
            const nextDayMonthNumber = (nextDay.getMonth() + 1).toString().padStart(2, '0');
            const nextDayYear = nextDay.getFullYear();
            return `${nextDayNumber}.${nextDayMonthNumber}.${nextDayYear}`
        }

        prevMonth() {
            this.calendar.goToPreviousMonth();
            this.renderCalendarDays();
            this.checkPrevMonth()
        }

        nextMonth() {
            this.calendar.goToNextMonth();
            this.renderCalendarDays();
            this.checkPrevMonth()
        }

        updateHeaderText() {
            this.calendarDateElement.textContent =
                `${this.calendar.month.name}, ${this.calendar.year}`;
            const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`
            this.calendarDateElement
                .setAttribute('aria-label', `current month ${monthYear}`);
        }


        isSelectedDate(date) {
            return date.date === this.date.date &&
                date.monthNumber === this.date.monthNumber &&
                date.year === this.date.year;
        }

        isCurrentCalendarMonth() {
            return this.calendar.month.number === this.date.monthNumber &&
                this.calendar.year === this.date.year;
        }

        selectDay(el, day) {
            if (this.checkIn !== null && this.checkOut === null) {
                if (!el.classList.contains('check-in') && !el.classList.contains('check-out')) {
                    if (el.dataset.date < this.checkIn) {
                        this.checkIn = el.dataset.date;
                        this.checkInEl = el;
                        this.checkInDay = day;
                        const nextDay = this.getNextDay(this.checkInDay)
                        this.updateText(nextDay);
                        this.updateMonthDays()
                        return
                    }
                    if (el.dataset.date === this.checkIn) {
                        return;
                    }
                }
            }

            if (!el.classList.contains('check-in') && this.checkIn === null) {
                el.classList.add('check-in')
                this.checkIn = el.dataset.date;
                this.checkInEl = el;
                this.checkInDay = day;
            }

            if (!el.classList.contains('check-in') && !el.classList.contains('check-out') && this.checkIn !== null && this.checkOut === null) {
                el.classList.add('check-out')
                this.checkOut = el.dataset.date;
                this.checkOutEl = el;
                this.checkOutDay = day;
                this.setPeriod()
            }

            if (this.checkIn !== null && this.checkOut !== null && !el.classList.contains('check-in') && !el.classList.contains('check-out')) {
                this.checkIn = el.dataset.date;
                this.checkInEl = el;
                this.checkInDay = day;
                this.checkOut = null;
                this.checkOutEl = null;
                this.checkOutDay = null;
                this.updateMonthDays()
            }

            const nextDay = this.getNextDay(this.checkInDay)
            this.updateText(nextDay);
        }

        setPeriod() {
            this.elementsArr.forEach(el => {
                const dateStr = el.dataset.date.replace('-', ',');

                if (new Date(dateStr) > new Date(this.checkIn.replace('-', ',')) && new Date(dateStr) < new Date(this.checkOut.replace('-', ','))) {
                    el.classList.add('day-between')
                }
            })
        }

        calculateDays() {

        }

        getWeekDaysElementStrings() {
            return this.calendar.weekDays
                .map(weekDay => `<span>${weekDay.substring(0, 3)}</span>`)
                .join('');
        }

        getMonthDaysGrid() {
            const firstDayOfTheMonth = this.calendar.month.getDay(1);
            const prevMonth = this.calendar.getPreviousMonth();
            const totalLastMonthFinalDays = firstDayOfTheMonth.dayNumber - 2;
            const totalDays = this.calendar.month.numberOfDays + totalLastMonthFinalDays;
            const monthList = Array.from({length: totalDays});

            for(let i = totalLastMonthFinalDays; i < totalDays; i++) {
                monthList[i] = this.calendar.month.getDay(i + 1 - totalLastMonthFinalDays)
            }

            for(let i = 0; i < totalLastMonthFinalDays; i++) {
                const inverted = totalLastMonthFinalDays - (i + 1);
                monthList[i] = prevMonth.getDay(prevMonth.numberOfDays - inverted);
            }

            return monthList;
        }

        updateText(nextDay) {
            this.checkInTextEl.textContent = this.checkIn.split('-').reverse().map(str => str.padStart(2, '0')).join('.').padStart(2, '0');
            this.checkOutTextEl.textContent = this.checkOut
                ? this.checkOut.split('-').reverse().map(str => str.padStart(2, '0')).join('.')
                : nextDay;
            this.daysCountEl.textContent = `${this.daysContainer.querySelectorAll('.day-between').length + 1}`
        }

        updateMonthDays() {
            this.daysContainer.innerHTML = '';

            this.getMonthDaysGrid().forEach(day => {
                const el = document.createElement('button');
                el.className = 'calendar__day';
                el.textContent = day.date;
                el.addEventListener('click', (e) => this.selectDay(el, day));
                el.dataset.date = `${day.year}-${day.monthNumber}-${day.date}`

                if (this.checkInEl && this.checkInEl.dataset.date === el.dataset.date) {
                    el.classList.add('check-in')
                }

                if(day.monthNumber === this.calendar.month.number) {
                    el.classList.add('current-month');
                }

                if(this.isSelectedDate(day)) {
                    el.classList.add('current-day');
                    this.selectedDayElement = el;
                }

                if (day.timestamp < new Day().timestamp && !el.classList.contains('current-day')) {
                    el.classList.add('disabled')
                    el.setAttribute('disabled', 'disabled')
                }

                this.elementsArr.push(el)
                this.daysContainer.appendChild(el);
            })
        }

        renderCalendarDays() {
            this.updateHeaderText();
            this.updateMonthDays();
        }

        render() {
            const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`;


            this.control.innerHTML = `
                <button type="button" class="calendar__button calendar__button-prev" aria-label="previous month">
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 9L1 5L5 1"/>
                    </svg>
                </button>
                <h4 class="calendar__month" tabindex="0" aria-label="current month ${monthYear}">
                  ${monthYear}
                </h4>
                <button type="button" class="calendar__button calendar__button-next" aria-label="next month">
                    <svg width="6" height="10" viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 9L5 5L1 1"/>
                    </svg>
                </button>
            `

            this.init()
        }
    }
    if (document.querySelector('.calendar')) {
        const dp = new DatePicker('.calendar', '.calendar__control', '.calendar__days')
    }

})