/**
 * @class Ext.container.Viewport
 * @extends Ext.container.Container

A specialized container representing the viewable application area (the browser viewport).

The Viewport renders itself to the document body, and automatically sizes itself to the size of
the browser viewport and manages window resizing. There may only be one Viewport created
in a page.

Like any {@link Ext.container.Container Container}, a Viewport will only perform sizing and positioning
on its child Components if you configure it with a {@link #layout}.

A Common layout used with Viewports is {@link Ext.layout.container.Border border layout}, but if the
required layout is simpler, a different layout should be chosen.

For example, to simply make a single child item occupy all available space, use {@link Ext.layout.container.Fit fit layout}.

To display one "active" item at full size from a choice of several child items, use {@link Ext.layout.container.Card card layout}.

Inner layouts are available by virtue of the fact that all {@link Ext.panel.Panel Panel}s
added to the Viewport, either through its {@link #items}, or through the items, or the {@link #add}
method of any of its child Panels may themselves have a layout.

The Viewport does not provide scrolling, so child Panels within the Viewport should provide
for scrolling if needed using the {@link #autoScroll} config.

An example showing a classic application border layout:

    new Ext.container.Viewport({
        layout: 'border',
        items: [{
            region: 'north',
            html: '&lt;h1 class="x-panel-header">Page Title&lt;/h1>',
            autoHeight: true,
            border: false,
            margins: '0 0 5 0'
        }, {
            region: 'west',
            collapsible: true,
            title: 'Navigation',
            width: 200
            // the west region might typically utilize a {@link Ext.tree.TreePanel TreePanel} or a Panel with {@link Ext.layout.container.Accordion Accordion layout}
        }, {
            region: 'south',
            title: 'Title for Panel',
            collapsible: true,
            html: 'Information goes here',
            split: true,
            height: 100,
            minHeight: 100
        }, {
            region: 'east',
            title: 'Title for the Grid Panel',
            collapsible: true,
            split: true,
            width: 200,
            xtype: 'grid',
            // remaining grid configuration not shown ...
            // notice that the GridPanel is added directly as the region
            // it is not "overnested" inside another Panel
        }, {
            region: 'center',
            xtype: 'tabpanel', // TabPanel itself has no title
            activeTab: 0,      // First tab active by default
            items: {
                title: 'Default Tab',
                html: 'The first tab\'s content. Others may be added dynamically'
            }
        }]
    });

 * @constructor
 * Create a new Viewport
 * @param {Object} config The config object
 * @markdown
 * @xtype viewport
 */
Ext.define('Ext.container.Viewport', {
    extend: 'Ext.container.Container',
    alias: 'widget.viewport',
    requires: ['Ext.EventManager'],
    alternateClassName: 'Ext.Viewport',
    
    /*
     * Privatize config options which, if used, would interfere with the
     * correct operation of the Viewport as the sole manager of the
     * layout of the document body.
     */
    /**
     * @cfg {Mixed} applyTo @hide
     */
    /**
     * @cfg {Boolean} allowDomMove @hide
     */
    /**
     * @cfg {Boolean} hideParent @hide
     */
    /**
     * @cfg {Mixed} renderTo @hide
     */
    /**
     * @cfg {Boolean} hideParent @hide
     */
    /**
     * @cfg {Number} height @hide
     */
    /**
     * @cfg {Number} width @hide
     */
    /**
     * @cfg {Boolean} autoHeight @hide
     */
    /**
     * @cfg {Boolean} autoWidth @hide
     */
    /**
     * @cfg {Boolean} deferHeight @hide
     */
    /**
     * @cfg {Boolean} monitorResize @hide
     */

    isViewPort: true,

    ariaRole: 'application',
    initComponent : function() {
        var me = this,
            el;
        me.callParent(arguments);
        Ext.fly(document.getElementsByTagName('html')[0]).addCls(Ext.baseCSSPrefix + 'viewport');
        me.el = el = Ext.getBody();
        el.setHeight = Ext.emptyFn;
        el.setWidth = Ext.emptyFn;
        el.setSize = Ext.emptyFn;
        el.dom.scroll = 'no';
        me.allowDomMove = false;
        //this.autoWidth = true;
        //this.autoHeight = true;
        Ext.EventManager.onWindowResize(me.fireResize, me);
        me.renderTo = me.el;
    },

    fireResize : function(w, h){
        // setSize is the single entry point to layouts
        this.setSize(w, h);
        //this.fireEvent('resize', this, w, h, w, h);
    }
});
