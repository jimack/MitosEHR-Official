/**
 * @class Ext.layout.component.SliderField
 * @extends Ext.layout.component.form.Field
 * @private
 */

Ext.define('Ext.layout.component.SliderField', {

    /* Begin Definitions */

    alias: ['layout.sliderfield'],

    extend: 'Ext.layout.component.form.Field',

    /* End Definitions */

    type: 'sliderfield',

    sizeBodyContents: function(width, height) {
        var owner = this.owner,
            thumbs = owner.thumbs,
            length = thumbs.length,
            inputEl = owner.inputEl,
            innerEl = owner.innerEl,
            endEl = owner.endEl,
            i = 0;

        /*
         * If we happen to be animating during a resize, the position of the thumb will likely be off
         * when the animation stops. As such, just stop any animations before syncing the thumbs.
         */
        for(; i < length; ++i) {
            thumbs[i].el.stopFx();
        }
        
        if (owner.vertical) {
            inputEl.setHeight(height);
            innerEl.setHeight(Ext.isNumber(height) ? height - inputEl.getPadding('t') - endEl.getPadding('b') : height);
        }
        else {
            inputEl.setWidth(width);
            innerEl.setWidth(Ext.isNumber(width) ? width - inputEl.getPadding('l') - endEl.getPadding('r') : width);
        }
        owner.syncThumbs();
    }
});
