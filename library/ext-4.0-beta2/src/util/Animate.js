/**
 * @class Ext.util.Animate
 * This animation class is a mixin.

Ext.util.Animate provides an API for the creation of animated transitions of properties and styles.  
This class is used as a mixin and currently applied to {@link Ext.core.Element}, {@link Ext.CompositeElement}, 
{@link Ext.draw.Sprite}, {@link Ext.draw.SpriteGroup}, and {@link Ext.Component}.  Note that Components 
have a limited subset of what attributes can be animated such as top, left, x, y, height, width, and 
opacity (color, paddings, and margins can not be animated).

__Animation Basics__

All animations require three things - easing, duration, and to (the final end value for each property) you wish to animate.  Easing and duration are defaulted values specified below.

Easing describes how the intermediate values used during a transition will be calculated. {@link Ext.fx.Anim#easing Easing} allows for a transition to change speed over its duration.

You may use the defaults for easing and duration, but you must always set a {@link Ext.fx.Anim#to to} property which is the end value for all animations.  

Popular element 'to' configurations are:

 opacity, x, y, color, height, width 

Popular sprite 'to' configurations are:

 translation, path, scale, stroke, rotation

The default duration for animations is 250 (which is a 1/4 of a second).  Duration is denoted in milliseconds.  Therefore 1 second is 1000, 1 minute would be 60000, and so on. 

The default easing curve used for all animations is 'ease'.  Popular easing functions are included and can be found in {@link Ext.fx.Anim#easing Easing}.

For example, a simple animation to fade out an element with a default easing and duration:

    var p1 = Ext.get('myElementId');

    p1.animate({
        to: {
            opacity: 0
        }
    });

To make this animation fade out in a tenth of a second:

    var p1 = Ext.get('myElementId');

    p1.animate({
       duration: 100,
        to: {
            opacity: 0
        }
    });

__Animation Queues__

By default all animations are added to a queue which allows for animation via a chain-style API.  For example, the following code will queue 4 animations which occur sequentially (one right after the other):

    p1.animate({
        to: {
            x: 500
        }
    }).animate({
        to: {
            y: 150
        }
    }).animate({
        to: {
            backgroundColor: '#f00'  //red
        }
    }).animate({
        to: {
            opacity: 0
        }
    });

You can change this behavior by calling the {@link Ext.util.Animate#syncFx syncFx} method and all subsequent animations for the specified target will be run concurrently (at the same time).

    p1.syncFx();  //this will make all animations run at the same time

    p1.animate({
        to: {
            x: 500
        }
    }).animate({
        to: {
            y: 150
        }
    }).animate({
        to: {
            backgroundColor: '#f00'  //red
        }
    }).animate({
        to: {
            opacity: 0
        }
    });

This works the same as:

    p1.animate({
        to: {
            x: 500,
            y: 150,
            backgroundColor: '#f00'  //red
            opacity: 0
        }
    });

The {@link Ext.util.Animate#stopFx stopFx} method can be used to stop any currently running animations and clear any queued animations. 

__Animation Keyframes__
You can also set up complex animations with {@link Ext.fx.Anim#keyframe keyframe} which follows the CSS3 Animation configuration pattern. Note rotation, translation, and scaling can only be done for sprites. The previous example can be written with the following syntax:

    p1.animate({
        duration: 1000,  //one second total
        keyframes: {
            25: {     //from 0 to 250ms (25%)
                x: 0
            },
            50: {   //from 250ms to 500ms (50%)
                y: 0
            },
            75: {  //from 500ms to 750ms (75%)
                backgroundColor: '#f00'  //red
            },
            100: {  //from 750ms to 1sec
                opacity: 0
            }
        }
    });

__Animation Events__

Each animation you create has events for {@link Ext.fx.Anim#beforeanimation beforeanimation}, {@link Ext.fx.Anim#afteranimate afteranimate}, and {@link Ext.fx.Anim#lastframe lastframe}.  Keyframed animations adds an additional {@link Ext.fx.Animator#keyframe keyframe} event which fires for each keyframe in your animation.

All animations support the {@link Ext.util.Observable#listeners listeners} configuration to attact functions to these events.
   
    startAnimate: function() {
        var p1 = Ext.get('myElementId');
        p1.animate({
           duration: 100,
            to: {
                opacity: 0
            },
            listeners: {
                beforeanimate:  function() {
                    // Execute my custom method before the animation
                    this.myBeforeAnimateFn();
                },
                afteranimate: function() {
                    // Execute my custom method after the animation
                    this.myAfterAnimateFn();
                },
                scope: this
        });
    },
    myBeforeAnimateFn: function() {
      // My custom logic
    },
    myAfterAnimateFn: function() {
      // My custom logic
    }


Due to the fact that animations run asynchronously, you can determine if an animation is currently running on any target by using the {@link Ext.util.Animate#hasActiveFx hasActiveFx} method.  This method will return false if there are no active animations or return the currently running {@link Ext.fx.Anim} instance.

In this example, we're going to wait for the current animation to finish, then stop any other queued animations before we fade our element's opacity to 0:

    var curAnim = p1.hasActiveFx();
    if (curAnim) {
        curAnim.on('afteranimate', function() {
            p1.stopFx();
            p1.animate({
                to: {
                    opacity: 0
                }
            });
        });
    }

 *
 * @markdown
 * @docauthor Jamie Avins <jamie@sencha.com>
 */
Ext.define('Ext.util.Animate', {

    uses: ['Ext.fx.Manager', 'Ext.fx.Anim'],

    /**
     * Perform custom animation on this element.
     * @param {Ext.fx.Anim} animObj An Ext.fx Anim object
     * @return {Ext.core.Element} this
     */
    animate: function(animObj) {
        var me = this;
        if (Ext.fx.Manager.hasFxBlock(me.id)) {
            return me;
        }
        Ext.fx.Manager.queueFx(Ext.create('Ext.fx.Anim', me.anim(animObj)));
        return this;
    },

    // @private - process the passed fx configuration.
    anim: function(config) {
        if (!Ext.isObject(config)) {
            return (config) ? {} : false;
        }

        var me = this;

        if (config.stopFx) {
            me.stopFx();
        }

        Ext.applyIf(config, Ext.fx.Manager.getFxDefaults(me.id));

        return Ext.apply({
            target: me,
            paused: true
        }, config);
    },

    /**
     * Stops any running effects and clears the element's internal effects queue if it contains
     * any additional effects that haven't started yet.
     * @return {Ext.core.Element} The Element
     */
    stopFx: function() {
        Ext.fx.Manager.stopFx(this.id);
    },

    /**
     * Ensures that all effects queued after syncFx is called on the element are
     * run concurrently.  This is the opposite of {@link #sequenceFx}.
     * @return {Ext.core.Element} The Element
     */
    syncFx: function() {
        Ext.fx.Manager.setFxDefaults(this.id, {
            concurrent: true
        });
    },

    /**
     * Ensures that all effects queued after sequenceFx is called on the element are
     * run in sequence.  This is the opposite of {@link #syncFx}.
     * @return {Ext.core.Element} The Element
     */
    sequenceFx: function() {
        Ext.fx.Manager.setFxDefaults(this.id, {
            concurrent: false
        });
    },

    /**
     * Returns thq current animation if the element has any effects actively running or queued, else returns false.
     * @return {Mixed} anim if element has active effects, else false
     */
    hasActiveFx: function() {
        return Ext.fx.Manager.hasActiveFx(this.id);
    }
});

// Apply Animate mixin manually until Element is defined in the proper 4.x way
Ext.applyIf(Ext.core.Element.prototype, Ext.util.Animate.prototype);