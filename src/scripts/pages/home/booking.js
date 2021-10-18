window.addEventListener('DOMContentLoaded', function() {
  const toggleBookingBlock = () => {
    const booking = document.querySelector('.booking');

    if (!booking) {
      return;
    }

    booking.addEventListener('click', function(e) {
      const target = e.target;

      const bookingOpenBtn =  target.closest('.booking__open');
      const bookingCloseBtn =  target.closest('.booking__close');
      const params = target.closest('.params-item__value');
      const setPeopleCountBtn = target.closest('.params-dropdown__close');
      const peopleCountText = this.querySelector('.params-item__value-people');
      const peopleCountDropdown = this.querySelector('.params-dropdown');

      if (bookingCloseBtn && booking.classList.contains('show')) {
        booking.classList.remove('show');
      }

      if (bookingOpenBtn && !booking.classList.contains('show')
          || params && !booking.classList.contains('show')) {
        booking.classList.add('show');
      }

      if (params && params.querySelector('.params-item__value-people') && !peopleCountDropdown.classList.contains('is-open')) {
        peopleCountDropdown.classList.add('is-open')
      }

      if (setPeopleCountBtn) {
        const peopleCount = Array.from(peopleCountDropdown.querySelectorAll('input')).reduce((acc, cur) => Number(acc.value) + Number(cur.value))
        peopleCountText.textContent = peopleCount.toString();

        if (peopleCountDropdown.classList.contains('is-open')) {
          peopleCountDropdown.classList.remove('is-open')
        }
      }
    })

  }

  toggleBookingBlock();

})