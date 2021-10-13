window.addEventListener('DOMContentLoaded', function() {
  const toggleBookingBlock = () => {
    const booking = document.querySelector('.booking');

    if (!booking) {
      return;
    }

    booking.addEventListener('click', e => {
      const target = e.target;

      const bookingOpenBtn =  target.closest('.booking__open');
      const bookingCloseBtn =  target.closest('.booking__close');
      const params = target.closest('.params-item__value');

      if (bookingCloseBtn && booking.classList.contains('show')
          || params && booking.classList.contains('show')) {
        booking.classList.remove('show');
      }

      if (bookingOpenBtn && !booking.classList.contains('show')
          || params && !booking.classList.contains('show')) {
        booking.classList.add('show');
      }
    })

  }

  toggleBookingBlock();

})