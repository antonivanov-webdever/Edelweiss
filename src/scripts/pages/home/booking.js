window.addEventListener('DOMContentLoaded', function() {
  const toggleBookingBlock = () => {
    const booking = document.querySelector('.booking');

    if (!booking) {
      return;
    }

    const bookingOpenBtn = booking.querySelector('button.booking__open');
    const bookingCloseBtn = booking.querySelector('button.booking__close');

    booking.addEventListener('click', e => {
      const target = e.target;

      if (target.closest('.booking__open') && !booking.classList.contains('show')) {
        booking.classList.add('show');
      }

      if (target.closest('.booking__close') && booking.classList.contains('show')) {
        booking.classList.remove('show');
      }
    })

  }

  toggleBookingBlock();

})