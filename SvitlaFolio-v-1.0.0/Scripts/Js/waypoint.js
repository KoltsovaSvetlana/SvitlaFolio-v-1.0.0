/*
 * jQuery Waypoints - v1.1.7
 *
 * Waypoints is a small jQuery plugin that makes it easy to execute a function
 * whenever you scroll to an element.
 */
(function($, wp, wps, window, undefined){
    '$:nomunge';

    var $w = $(window),

    // Keeping common strings as variables = better minification
        eventName = 'waypoint.reached',

        triggerWaypoint = function(way, dir) {
            way.element.trigger(eventName, dir);
            if (way.options.triggerOnce) {
                way.element[wp]('destroy');
            }
        },

    /*
     Given a jQuery element and Context, returns the index of that element in the waypoints
     array.  Returns the index, or -1 if the element is not a waypoint.
     */
        waypointIndex = function(el, context) {
            if (!context) return -1;
            var i = context.waypoints.length - 1;
            while (i >= 0 && context.waypoints[i].element[0] !== el[0]) {
                i -= 1;
            }
            return i;
        },

    // Private list of all elements used as scrolling contexts for waypoints.
        contexts = [],
        Context = function(context) {
            $.extend(this, {
                element: $(context),
                oldScroll: 0,
                'waypoints': [],
                didScroll: false,
                didResize: false,
                doScroll: $.proxy(function() {
                    var newScroll = this.element.scrollTop(),

                    // Are we scrolling up or down? Used for direction argument in callback.
                        isDown = newScroll > this.oldScroll,
                        that = this,

                    // Get a list of all waypoints that were crossed since last scroll move.
                        pointsHit = $.grep(this.waypoints, function(el, i) {
                            return isDown ?
                                (el.offset > that.oldScroll && el.offset <= newScroll) :
                                (el.offset <= that.oldScroll && el.offset > newScroll);
                        }),
                        len = pointsHit.length;

                    // iOS adjustment
                    if (!this.oldScroll || !newScroll) {
                        $[wps]('refresh');
                    }

                    // Done with scroll comparisons, store new scroll before ejection
                    this.oldScroll = newScroll;

                    // No waypoints crossed? Eject.
                    if (!len) return;

                    // If several waypoints triggered, need to do so in reverse order going up
                    if (!isDown) pointsHit.reverse();

                    $.each(pointsHit, function(i, point) {
                        if (point.options.continuous || i === len - 1) {
                            triggerWaypoint(point, [isDown ? 'down' : 'up']);
                        }
                    });
                }, this)
            });

            // Setup scroll and resize handlers.  Throttled at the settings-defined rate limits.
            $(context).bind('scroll.waypoints', $.proxy(function() {
                if (!this.didScroll) {
                    this.didScroll = true;
                    window.setTimeout($.proxy(function() {
                        this.doScroll();
                        this.didScroll = false;
                    }, this), $[wps].settings.scrollThrottle);
                }
            }, this)).bind('resize.waypoints', $.proxy(function() {
                if (!this.didResize) {
                    this.didResize = true;
                    window.setTimeout($.proxy(function() {
                        $[wps]('refresh');
                        this.didResize = false;
                    }, this), $[wps].settings.resizeThrottle);
                }
            }, this));

            $w.load($.proxy(function() {
                /*
                 Fire a scroll check, should the page be loaded at a non-zero scroll value,
                 as with a fragment id link or a page refresh.
                 */
                this.doScroll();
            }, this));
        },

    /* Returns a Context object from the contexts array, given the raw HTML element
     for that context. */
        getContextByElement = function(element) {
            var found = null;

            $.each(contexts, function(i, c) {
                if (c.element[0] === element) {
                    found = c;
                    return false;
                }
            });

            return found;
        },

    // Methods exposed to the effin' object
        methods = {

            init: function(f, options) {
                // Register each element as a waypoint, add to array.
                this.each(function() {
                    var cElement = $.fn[wp].defaults.context,
                        context,
                        $this = $(this);

                    // Default window context or a specific element?
                    if (options && options.context) {
                        cElement = options.context;
                    }

                    // Find the closest element that matches the context
                    if (!$.isWindow(cElement)) {
                        cElement = $this.closest(cElement)[0];
                    }
                    context = getContextByElement(cElement);

                    // Not a context yet? Create and push.
                    if (!context) {
                        context = new Context(cElement);
                        contexts.push(context);
                    }

                    // Extend default and preexisting options
                    var ndx = waypointIndex($this, context),
                        base = ndx < 0 ? $.fn[wp].defaults : context.waypoints[ndx].options,
                        opts = $.extend({}, base, options);

                    // Offset aliases
                    opts.offset = opts.offset === "bottom-in-view" ?
                        function() {
                            var cHeight = $.isWindow(cElement) ? $[wps]('viewportHeight')
                                : $(cElement).height();
                            return cHeight - $(this).outerHeight();
                        } : opts.offset;

                    // Update, or create new waypoint
                    if (ndx < 0) {
                        context.waypoints.push({
                            'element': $this,
                            'offset': null,
                            'options': opts
                        });
                    }
                    else {
                        context.waypoints[ndx].options = opts;
                    }

                    // Bind the function if it was passed in.
                    if (f) {
                        $this.bind(eventName, f);
                    }
                    // Bind the function in the handler option if it exists.
                    if (options && options.handler) {
                        $this.bind(eventName, options.handler);
                    }
                });

                // Need to re-sort+refresh the waypoints array after new elements are added.
                $[wps]('refresh');

                return this;
            },

            remove: function() {
                return this.each(function(i, el) {
                    var $el = $(el);

                    $.each(contexts, function(i, c) {
                        var ndx = waypointIndex($el, c);

                        if (ndx >= 0) {
                            c.waypoints.splice(ndx, 1);

                            if (!c.waypoints.length) {
                                c.element.unbind('scroll.waypoints resize.waypoints');
                                contexts.splice(i, 1);
                            }
                        }
                    });
                });
            },

            destroy: function() {
                return this.unbind(eventName)[wp]('remove');
            }
        },

    /*
     Methods used by the jQuery object extension.
     */
        jQMethods = {

            refresh: function() {
                $.each(contexts, function(i, c) {
                    var isWin = $.isWindow(c.element[0]),
                        contextOffset = isWin ? 0 : c.element.offset().top,
                        contextHeight = isWin ? $[wps]('viewportHeight') : c.element.height(),
                        contextScroll = isWin ? 0 : c.element.scrollTop();

                    $.each(c.waypoints, function(j, o) {
                        /* $.each isn't safe from element removal due to triggerOnce.
                         Should rewrite the loop but this is way easier. */
                        if (!o) return;

                        // Adjustment is just the offset if it's a px value
                        var adjustment = o.options.offset,
                            oldOffset = o.offset;

                        // Set adjustment to the return value if offset is a function.
                        if (typeof o.options.offset === "function") {
                            adjustment = o.options.offset.apply(o.element);
                        }
                        // Calculate the adjustment if offset is a percentage.
                        else if (typeof o.options.offset === "string") {
                            var amount = parseFloat(o.options.offset);
                            adjustment = o.options.offset.indexOf("%") ?
                                Math.ceil(contextHeight * (amount / 100)) : amount;
                        }

                        /*
                         Set the element offset to the window scroll offset, less
                         all our adjustments.
                         */
                        o.offset = o.element.offset().top - contextOffset
                        + contextScroll - adjustment;

                        /*
                         An element offset change across the current scroll point triggers
                         the event, just as if we scrolled past it unless prevented by an
                         optional flag.
                         */
                        if (o.options.onlyOnScroll) return;

                        if (oldOffset !== null && c.oldScroll > oldOffset && c.oldScroll <= o.offset) {
                            triggerWaypoint(o, ['up']);
                        }
                        else if (oldOffset !== null && c.oldScroll < oldOffset && c.oldScroll >= o.offset) {
                            triggerWaypoint(o, ['down']);
                        }
                        /* For new waypoints added after load, check that down should have
                         already been triggered */
                        else if (!oldOffset && c.element.scrollTop() > o.offset) {
                            triggerWaypoint(o, ['down']);
                        }
                    });

                    // Keep waypoints sorted by offset value.
                    c.waypoints.sort(function(a, b) {
                        return a.offset - b.offset;
                    });
                });
            },

            viewportHeight: function() {
                return (window.innerHeight ? window.innerHeight : $w.height());
            },

            aggregate: function() {
                var points = $();
                $.each(contexts, function(i, c) {
                    $.each(c.waypoints, function(i, e) {
                        points = points.add(e.element);
                    });
                });
                return points;
            }
        };


    /*
     fn extension.  Delegates to appropriate method.
     */
    $.fn[wp] = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === "function" || !method) {
            return methods.init.apply(this, arguments);
        }
        else if (typeof method === "object") {
            return methods.init.apply(this, [null, method]);
        }
        else {
            $.error( 'Method ' + method + ' does not exist on jQuery ' + wp );
        }
    };

    $.fn[wp].defaults = {
        continuous: true,
        offset: 0,
        triggerOnce: false,
        context: window
    };

    $[wps] = function(method) {
        if (jQMethods[method]) {
            return jQMethods[method].apply(this);
        }
        else {
            return jQMethods['aggregate']();
        }
    };

    $[wps].settings = {
        resizeThrottle: 200,
        scrollThrottle: 100
    };

    $w.load(function() {
        // Calculate everything once on load.
        $[wps]('refresh');
    });
})(jQuery, 'waypoint', 'waypoints', window);