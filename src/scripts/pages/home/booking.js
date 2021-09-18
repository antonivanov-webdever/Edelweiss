window.addEventListener('DOMContentLoaded', function() {
  const toggleBookingBlock = () => {
    const booking = document.querySelector('.booking');

    if (!booking) {
      return;
    }

    booking.addEventListener('click', e => {
      const target = e.target;

      const bookingOpenBtn =  target.closest('.booking__open');

      if (bookingOpenBtn && !booking.classList.contains('show')) {
        booking.classList.add('show');
      }

      const bookingCloseBtn =  target.closest('.booking__close');
      console.log(booking);
      console.log(booking.classList);
      if (bookingCloseBtn && booking.classList.contains('show')) {
        booking.classList.remove('show');
      }
    })

  }

  toggleBookingBlock();

})