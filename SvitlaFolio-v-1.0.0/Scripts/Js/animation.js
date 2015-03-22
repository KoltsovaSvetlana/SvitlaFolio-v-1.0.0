/*
* hoverFlow - A Solution to Animation Queue Buildup in jQuery
*/
(function( $ ){

    $.fn.hoverFlow = function(type, prop, speed, easing, callback) {
        // only allow hover events
        if ($.inArray(type, ['mouseover', 'mouseenter', 'mouseout', 'mouseleave']) == -1) {
            return this;
        }

        // build animation options object from arguments
        // based on internal speed function from jQuery core
        var opt = typeof speed === 'object' ? speed : {
            complete: callback || !callback && easing || $.isFunction(speed) && speed,
            duration: speed,
            easing: callback && easing || easing && !$.isFunction(easing) && easing
        };

        // run immediately
        opt.queue = false;

        // wrap original callback and add dequeue
        var origCallback = opt.complete;
        opt.complete = function() {
            // execute next function in queue
            $(this).dequeue();
            // execute original callback
            if ($.isFunction(origCallback)) {
                origCallback.call(this);
            }
        };

        // keep the chain intact
        return this.each(function() {
            var $this = $(this);

            // set flag when mouse is over element
            if (type == 'mouseover' || type == 'mouseenter') {
                $this.data('jQuery.hoverFlow', true);
            } else {
                $this.removeData('jQuery.hoverFlow');
            }

            // enqueue function
            $this.queue(function() {
                // check mouse position at runtime
                var condition = (type == 'mouseover' || type == 'mouseenter') ?
                    // read: true if mouse is over element
                $this.data('jQuery.hoverFlow') !== undefined :
                    // read: true if mouse is _not_ over element
                $this.data('jQuery.hoverFlow') === undefined;

                // only execute animation if condition is met, which is:
                // - only run mouseover animation if mouse _is_ currently over the element
                // - only run mouseout animation if the mouse is currently _not_ over the element
                if (condition) {
                    $this.animate(prop, opt);
                    // else, clear queue, since there's nothing more to do
                } else {
                    $this.queue([]);
                }
            });
        });
    };
})( jQuery );


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
    {
        def: 'easeOutQuad',
        swing: function (x, t, b, c, d) {
            //alert(jQuery.easing.default);
            return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
        },
        easeOutQuad: function (x, t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        }
    });

/*
 * Function to switch face on browser resize
 */
$.fn.resizeFace = function() {
    $(window).resize(function() {
        // Show large face
        if ($(window).width() >= 1140) {
            $('#designer-img').css({'opacity':'1'});
            $('#coder-img').css({'opacity':'1'});
            $('#designer-bg').css({'opacity':'1'});
            $('#coder-bg').css({'opacity':'1'});
            $('#designer').css({'opacity':'1'});
            $('#coder').css({'opacity':'1'});

        } else { // Show smaller face image
            $('#face-img').css({'opacity':'1'});
            $('#designer').css({'opacity':'1'});
            $('#coder').css({'opacity':'1'});
        }
    });
};

/*
 * Function to animate home page
 */
$.fn.animateHome = function() {

    // only animate for large desktop browsers
    if ($(window).width() >= 1140) {
        $('#content').animate({'opacity':'1'}, 500, 'easeOutExpo');
        $('#designer-img').css({'left':'-500px'}).stop().animate({'opacity':'1', 'left':'100px'}, 1000, 'easeOutExpo');
        $('#coder-img').css({'right':'-500px'}).stop().animate({'opacity':'1', 'right':'100px'}, 1000, 'easeOutExpo');
        $('#designer-bg').css({'left':'-500px'}).stop().animate({'opacity':'1', 'left':'100px'}, 1500, 'easeOutBack');
        $('#coder-bg').css({'right':'-500px'}).stop().animate({'opacity':'1', 'right':'100px'}, 1500, 'easeOutBack');
        $('#designer').delay(1500).animate({'opacity':'1'}, 500, 'easeOutExpo');
        $('#coder').delay(1500).animate({'opacity':'1'}, 500, 'easeOutExpo', function(){ animateFace(); });
    } else {
        $('#content').animate({'opacity':'1'}, 500, 'easeOutExpo');
        $('#face-img').animate({'opacity':'1'}, 2000, 'easeOutExpo');
        $('#designer').delay(1000).animate({'opacity':'1'}, 500, 'easeOutExpo');
        $('#coder').delay(1000).animate({'opacity':'1'}, 500, 'easeOutExpo');
    }
};

/*
 * Function to animate about page
 */
function animateAbout() {
    // Animate Chart
    $('.barChart').waypoint(function(event, direction) {
        $('#col1').css({ 'visibility': 'visible', 'height': '0%' }).stop().delay(200).animate({ 'opacity': '1', 'height': '95%' }, 1000, 'easeOutExpo');
        $('#col2').css({ 'visibility': 'visible', 'height': '0%' }).stop().delay(400).animate({ 'opacity': '1', 'height': '90%' }, 1000, 'easeOutExpo');
        $('#col3').css({'visibility':'visible', 'height': '0%'}).stop().delay(600).animate({'opacity':'1', 'height':'80%'}, 1000, 'easeOutExpo');
        $('#col4').css({'visibility':'visible', 'height': '0%'}).stop().delay(800).animate({'opacity':'1', 'height':'75%'}, 1000, 'easeOutExpo');
        $('#col5').css({'visibility':'visible', 'height': '0%'}).stop().delay(1000).animate({'opacity':'1', 'height':'40%'}, 1000, 'easeOutExpo');
    }, {
        offset: '80%',
        triggerOnce: true
    });
};

/*
 * Function to animate face
 */
function animateFace() {
    var designerImg 	= $('#designer-img');
    var coderImg 		= $('#coder-img');
    var designerHover	= $('#designer');
    var coderHover		= $('#coder');
    var designerDesc	= $('#designer-desc');
    var coderDesc		= $('#coder-desc');
    var designerArrow	= $('#designer-arrow');
    var coderArrow		= $('#coder-arrow');
    var designerBg		= $('#designer-bg');
    var coderBg			= $('#coder-bg');
    var face 			= $('#face');
    var section 		= $('#section');
    var duration = 500;
    var loop;

    var mouseX = 0;
    var relMouseX = 520;
    var xp = 520;
    frameRate =  30;
    timeInterval = Math.round( 1000 / frameRate );

    section.mouseenter(function(e){
        // Get mouse position
        section.mousemove(function(e){
            // raw mouse position
            mouseX = e.pageX;
            // mouse position relative to face div
            relMouseX = mouseX - face.offset().left;
        });

        // Animate the face based on mouse movement
        loop = setInterval(function(){

            // zeno's paradox dampens the movement
            xp += (relMouseX - xp) / 12;

            designerImg.css({width:420 + (520 - xp) * 0.5, left: 100 + (520 - xp) * 0.1});
            coderImg.css({width:420 + (xp - 520) * 0.5, right: 100 - (520 - xp) * 0.1});

            designerBg.css({left: 100 + (520 - xp) * 0.05, opacity: ((1040 - xp)/520)});
            coderBg.css({right:  100 + (xp - 520) * 0.05, opacity: (xp/520)});

            designerDesc.css({opacity: ((1040 - xp)/520)});
            coderDesc.css({opacity: (xp/520)});

        }, timeInterval );

    }).mouseleave(function(e){

        // reset the face to initial state
        if (loop) {
            window.clearInterval(loop);
        }
        
        xp 			= 520;
        mouseX 		= 0;
        relMouseX 	= 520;

        designerImg.hoverFlow(e.type, {width: 420, left: 100}, duration, 'easeOutQuad');
        coderImg.hoverFlow(e.type, {width: 420, right: 100}, duration, 'easeOutQuad');
        coderDesc.hoverFlow(e.type, {opacity: 1}, duration, 'easeOutQuad');
        designerDesc.hoverFlow(e.type, {opacity: 1}, duration, 'easeOutQuad');
        coderBg.hoverFlow(e.type, {right:100, opacity: 1}, duration, 'easeOutQuad');
        designerBg.hoverFlow(e.type, {left:100, opacity: 1}, duration, 'easeOutQuad');
    });
};

$( function () {
    $('#face').animateHome();
    $('#face').resizeFace();

    //Show the page once images are loaded
    animateAbout();
});