window.addEventListener('DOMContentLoaded', function() {

  if (document.body.classList.contains('index')) {
    let is_scrolling = false;
  
    new fullpage('#fullpage', {
    licenseKey: '930B3D8E-64114A48-BE58EB40-E2698A87',
    autoScrolling: true,
    scrollHorizontally: true,
    scrollHorizontallyKey: '930B3D8E-64114A48-BE58EB40-E2698A87',
    scrollingSpeed: 1500,
    loopHorizontal: false,
    controlArrows: false,
    });
  
    fullpage_api.setAllowScrolling(true, 'left, right');
  
    function scrollHandler(e) {
      if (is_scrolling === false) {
        is_scrolling = true;

        if (Math.sign(e.wheelDelta) === -1) {
          fullpage_api.moveSlideRight();
    
        }
        if (Math.sign(e.wheelDelta) === 1) {
          fullpage_api.moveSlideLeft();
        }
        setTimeout(() => {
          is_scrolling = false;
        }, 1500);
      }
    }
  
    window.addEventListener('mousewheel', scrollHandler);
  }
})
