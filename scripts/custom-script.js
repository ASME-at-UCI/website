/*
Animates all .animate__animated elements with fadeInUp when visible in the
viewport
*/

function isElementInViewport(elem) {
    var $elem = $(elem);

    // Get the scroll position of the page.
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    // Get the position of the element on the page.
    var elemTop = Math.round( $elem.offset().top );
    var elemBottom = elemTop + $elem.height();

    return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
}

// Check if it's time to start the animation.
function checkAnimation() {
    var $elem = $('.animate__animated');

    // If the animation has already been started
    for(i = 0; i < $elem.length; i++)
    {
      if (!$elem.eq(i).hasClass('.animate__fadeInUp') && isElementInViewport($elem.eq(i))) {
          // Start the animation
          $elem.eq(i).addClass('animate__fadeInUp');
      }
    }
}

// Capture scroll events
/*$(window).scroll(function(){
    checkAnimation();
});*/

// Capture initial Loading
$(window).ready(function(){
    checkAnimation();
});

//Check animation status every 10ms
setInterval(function() {
    checkAnimation();
}, 10);


//https://stackoverflow.com/questions/16325679/activate-css3-animation-when-the-content-scrolls-into-view
