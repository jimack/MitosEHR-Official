/**
 * @class Ext.resizer.ResizeTracker
 * @extends Ext.dd.DragTracker
 */
Ext.define('Ext.resizer.ResizeTracker', {
    extend: 'Ext.dd.DragTracker',
    dynamic: true,
    preserveRatio: false,

    // Default to no constraint
    constrainTo: null,

    constructor: function(config) {
        var me = this;

        if (!config.el) {
            if (config.target.isComponent) {
                me.el = config.target.getEl();
            } else {
                me.el = config.target;
            }
        }
        Ext.resizer.ResizeTracker.superclass.constructor.apply(me, arguments);

        // Ensure that if we are preserving aspect ratio, the largest minimum is honoured
        if (me.preserveRatio && me.minWidth && me.minHeight) {
            var widthRatio = me.minWidth / me.el.getWidth(),
                heightRatio = me.minHeight / me.el.getHeight();

            // largest ratio of minimum:size must be preserved.
            // So if a 400x200 pixel image has
            // minWidth: 50, maxWidth: 50, the maxWidth will be 400 * (50/200)... that is 100
            if (heightRatio > widthRatio) {
                me.minWidth = me.el.getWidth() * heightRatio;
            } else {
                me.minHeight = me.el.getHeight() * widthRatio;
            }
        }

        // If configured as throttled, create an instance version of resize which calls
        // a throttled function to perform the resize operation.
        if (me.throttle) {
            var throttledResizeFn = Ext.Function.createThrottled(function() {
                    Ext.resizer.ResizeTracker.prototype.resize.apply(me, arguments);
                }, me.throttle);

            me.resize = function(box, direction, atEnd) {
                if (atEnd) {
                    Ext.resizer.ResizeTracker.prototype.resize.apply(me, arguments);
                } else {
                    throttledResizeFn.apply(null, arguments);
                }
            };
        }
    },

    onBeforeStart: function(e) {
        // record the startBox
        this.startBox = this.el.getBox();
    },

    /**
     * @private
     * Returns the object that will be resized on every mousemove event.
     * If dynamic is false, this will be a proxy, otherwise it will be our actual target.
     */
    getDynamicTarget: function() {
        var d = this.target;
        if (this.dynamic) {
            return d;
        } else if (!this.proxy) {
            this.proxy = d.isComponent ? d.getProxy().addCls(Ext.baseCSSPrefix + 'resizable-proxy') : d.createProxy({tag: 'div', cls: Ext.baseCSSPrefix + 'resizable-proxy', id: d.id + '-rzproxy'}, Ext.getBody());
            this.proxy.removeCls(Ext.baseCSSPrefix + 'proxy-el');
        }
        this.proxy.show();
        return this.proxy;
    },

    onStart: function(e) {
        // returns the Ext.ResizeHandle that the user started dragging
        this.activeResizeHandle = Ext.getCmp(this.getDragTarget().id);

        // If we are using a proxy, ensure it is sized.
        if (!this.dynamic) {
            this.resize(this.startBox, {
                horizontal: 'none',
                vertical: 'none'
            });
        }
    },

    onDrag: function(e) {
        // dynamic resizing, update dimensions during resize
        if (this.dynamic || this.proxy) {
            this.updateDimensions(e);
        }
    },

    updateDimensions: function(e, atEnd) {
        var me = this,
            region = me.activeResizeHandle.region,
            offset = me.getOffset(me.constrainTo ? 'dragTarget' : null),
            box = me.startBox,
            ratio,
            widthAdjust = 0,
            heightAdjust = 0,
            adjustX = 0,
            adjustY = 0,
            dragRatio,
            horizDir = offset[0] < 0 ? 'right' : 'left',
            vertDir = offset[1] < 0 ? 'down' : 'up',
            oppositeCorner,
            axis; // 1 = x, 2 = y, 3 = x and y.

        switch (region) {
            case 'south':
                heightAdjust = offset[1];
                axis = 2;
                break;
            case 'north':
                heightAdjust = -offset[1];
                adjustY = -heightAdjust;
                axis = 2;
                break;
            case 'east':
                widthAdjust = offset[0];
                axis = 1;
                break;
            case 'west':
                widthAdjust = -offset[0];
                adjustX = -widthAdjust;
                axis = 1;
                break;
            case 'northeast':
                heightAdjust = -offset[1];
                adjustY = -heightAdjust;
                widthAdjust = offset[0];
                oppositeCorner = [box.x, box.y + box.height];
                axis = 3;
                break;
            case 'southeast':
                heightAdjust = offset[1];
                widthAdjust = offset[0];
                oppositeCorner = [box.x, box.y];
                axis = 3;
                break;
            case 'southwest':
                widthAdjust = -offset[0];
                adjustX = -widthAdjust;
                heightAdjust = offset[1];
                oppositeCorner = [box.x + box.width, box.y];
                axis = 3;
                break;
            case 'northwest':
                heightAdjust = -offset[1];
                adjustY = -heightAdjust;
                widthAdjust = -offset[0];
                adjustX = -widthAdjust;
                oppositeCorner = [box.x + box.width, box.y + box.height];
                axis = 3;
                break;
        }

        var newBox = {
            width: box.width + widthAdjust,
            height: box.height + heightAdjust,
            x: box.x + adjustX,
            y: box.y + adjustY
        };

        // out of bounds
        if (newBox.width < me.minWidth || newBox.width > me.maxWidth) {
            newBox.width = Ext.Number.constrain(newBox.width, me.minWidth, me.maxWidth);
            newBox.x = me.lastX || newBox.x;
        } else {
            me.lastX = newBox.x;
        }
        if (newBox.height < me.minHeight || newBox.height > me.maxHeight) {
            newBox.height = Ext.Number.constrain(newBox.height, me.minHeight, me.maxHeight);
            newBox.y = me.lastY || newBox.y;
        } else {
            me.lastY = newBox.y;
        }

        // If this is configured to preserve the aspect ratio, or they are dragging using the shift key
        if (me.preserveRatio || e.shiftKey) {
            var newHeight,
                newWidth;

            ratio = me.startBox.width / me.startBox.height;

            // Calculate aspect ratio constrained values.
            newHeight = Math.min(Math.max(me.minHeight, newBox.width / ratio), me.maxHeight);
            newWidth = Math.min(Math.max(me.minWidth, newBox.height * ratio), me.maxWidth);

            // X axis: width-only change, height must obey
            if (axis == 1) {
                newBox.height = newHeight;
            }

            // Y axis: height-only change, width must obey
            else if (axis == 2) {
                newBox.width = newWidth;
            }

            // Corner drag.
            else {
                // Drag ratio is the ratio of the mouse point from the opposite corner.
                // Basically what edge we are dragging, a horizontal edge or a vertical edge.
                dragRatio = Math.abs(oppositeCorner[0] - this.lastXY[0]) / Math.abs(oppositeCorner[1] - this.lastXY[1]);

                // If drag ratio > aspect ratio then width is dominant and height must obey
                if (dragRatio > ratio) {
                    newBox.height = newHeight;
                } else {
                    newBox.width = newWidth;
                }

                // Handle dragging start coordinates
                if (region == 'northeast') {
                    newBox.y = box.y - (newBox.height - box.height);
                } else if (region == 'northwest') {
                    newBox.y = box.y - (newBox.height - box.height);
                    newBox.x = box.x - (newBox.width - box.width);
                } else if (region == 'southwest') {
                    newBox.x = box.x - (newBox.width - box.width);
                }
            }
        }

        if (heightAdjust === 0) {
            vertDir = 'none';
        }
        if (widthAdjust === 0) {
            horizDir = 'none';
        }
        me.resize(newBox, {
            horizontal: horizDir,
            vertical: vertDir
        }, atEnd);
    },

    getResizeTarget: function(atEnd) {
        return atEnd ? this.target : this.getDynamicTarget();
    },

    resize: function(box, direction, atEnd) {
        var target = this.getResizeTarget(atEnd);
        if (target.isComponent) {
            if (target.floating) {
                target.setPagePosition(box.x, box.y);
            }
            target.setSize(box.width, box.height);
        } else {
            target.setBox(box);
            // update the originalTarget if this was wrapped.
            if (this.originalTarget) {
                this.originalTarget.setBox(box);
            }
        }
    },

    onEnd: function(e) {
        this.updateDimensions(e, true);
        if (this.proxy) {
            this.proxy.hide();
        }
    }
});