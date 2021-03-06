/**
 * @class Ext.AbstractDataView
 * @extends Ext.Component
 * This is an abstract superclass and should not be used directly. Please see {@link Ext.DataView}.
 */
Ext.define('Ext.AbstractDataView', {
    extend: 'Ext.Component',
    requires: [
        'Ext.LoadMask',
        'Ext.data.StoreMgr',
        'Ext.CompositeElementLite',
        'Ext.DomQuery',
        'Ext.selection.DataViewModel'
    ],
    
    inheritableStatics: {
        getRecord: function(node) {
            return this.getBoundView(node).getRecord(node);
        },
        
        getBoundView: function(node) {
            return Ext.getCmp(node.boundView);
        }
    },
    
    /**
     * @cfg {String/Array/Ext.XTemplate} tpl
     * @required
     * The HTML fragment or an array of fragments that will make up the template used by this DataView.  This should
     * be specified in the same format expected by the constructor of {@link Ext.XTemplate}.
     */
    /**
     * @cfg {Ext.data.Store} store
     * @required
     * The {@link Ext.data.Store} to bind this DataView to.
     */

    /**
     * @cfg {String} itemSelector
     * @required
     * <b>This is a required setting</b>. A simple CSS selector (e.g. <tt>div.some-class</tt> or
     * <tt>span:first-child</tt>) that will be used to determine what nodes this DataView will be
     * working with.
     */
    
    /**
     * @cfg {String} itemCls
     * Specifies the class to be assigned to each element in the view when used in conjunction with the
     * {@link #itemTpl} configuration.
     */
    itemCls: Ext.baseCSSPrefix + 'dataview-item',
    
    /**
     * @cfg {String/Array/Ext.XTemplate} itemTpl
     * The inner portion of the item template to be rendered. Follows an XTemplate
     * structure and will be placed inside of a tpl.
     */

    /**
     * @cfg {String} overItemCls
     * A CSS class to apply to each item in the view on mouseover (defaults to undefined).
     */

    /**
     * @cfg {String} loadingText
     * A string to display during data load operations (defaults to undefined).  If specified, this text will be
     * displayed in a loading div and the view's contents will be cleared while loading, otherwise the view's
     * contents will continue to display normally until the new data is loaded and the contents are replaced.
     */
    loadingText: 'Loading...',

    /**
     * @cfg {Number} loadingHeight
     * If specified, gives an explicit height for the data view when it is showing the {@link #loadingText},
     * if that is specified. This is useful to prevent the view's height from collapsing to zero when the
     * loading mask is applied and there are no other contents in the data view. Defaults to undefined.
     */

    /**
     * @cfg {String} selectedItemCls
     * A CSS class to apply to each selected item in the view (defaults to 'x-view-selected').
     */
    selectedItemCls: Ext.baseCSSPrefix + 'item-selected',

    /**
     * @cfg {String} emptyText
     * The text to display in the view when there is no data to display (defaults to '').
     * Note that when using local data the emptyText will not be displayed unless you set
     * the {@link #deferEmptyText} option to false.
     */
    emptyText: "",

    /**
     * @cfg {Boolean} deferEmptyText True to defer emptyText being applied until the store's first load
     */
    deferEmptyText: true,

    /**
     * @cfg {Boolean} trackOver True to enable mouseenter and mouseleave events
     */
    trackOver: false,

    /**
     * @cfg {Boolean} blockRefresh Set this to true to ignore datachanged events on the bound store. This is useful if
     * you wish to provide custom transition animations via a plugin (defaults to false)
     */
    blockRefresh: false,

    /**
     * @cfg {Boolean} disableSelection <p><tt>true</tt> to disable selection within the DataView. Defaults to <tt>false</tt>.
     * This configuration will lock the selection model that the DataView uses.</p>
     */


    //private
    last: false,
    
    triggerEvent: 'itemclick',
    triggerCtEvent: 'containerclick',
    
    addCmpEvents: function() {
        
    },

    // private
    initComponent : function(){
        var me = this,
            isDef = Ext.isDefined,
            itemTpl = me.itemTpl,
            memberFn = {};
            
        if (itemTpl) {
            if (Ext.isArray(itemTpl)) {
                // string array
                itemTpl = itemTpl.join('');
            } else if (Ext.isObject(itemTpl)) {
                // tpl instance
                memberFn = Ext.apply(memberFn, itemTpl.initialConfig);
                itemTpl = itemTpl.html;
            }
            
            if (!me.itemSelector) {
                me.itemSelector = '.' + me.itemCls;
            }
            
            itemTpl = Ext.String.format('<tpl for="."><div class="{0}">{1}</div></tpl>', me.itemCls, itemTpl);
            me.tpl = new Ext.XTemplate(itemTpl, memberFn);
        }

        //<debug>
        if (!isDef(me.tpl) || !isDef(me.store) || !isDef(me.itemSelector)) {
            throw "DataView requires tpl, store and itemSelector configurations to be defined.";
        }
        //</debug>

        me.callParent();
        if(Ext.isString(me.tpl) || Ext.isArray(me.tpl)){
            me.tpl = new Ext.XTemplate(me.tpl);
        }

        // backwards compat alias for overClass/selectedClass
        // TODO: Consider support for overCls generation Ext.Component config
        if (isDef(me.overCls) || isDef(me.overClass)) {
            me.overItemCls = me.overCls || me.overClass;
            delete me.overCls;
            delete me.overClass;
            //<debug>
            throw "Using the deprecated overCls or overClass configuration. Use overItemCls.";
            //</debug>
        }

        if (isDef(me.selectedCls) || isDef(me.selectedClass)) {
            me.selectedItemCls = me.selectedCls || me.selectedClass;
            delete me.selectedCls;
            delete me.selectedClass;
            //<debug>
            throw "Using the deprecated selectedCls or selectedClass configuration. Use selectedItemCls.";
            //</debug>
        }
        
        me.addEvents(
            /**
             * @event beforerefresh
             * Fires before the view is refreshed
             * @param {Ext.DataView} this The DataView object
             */
            'beforerefresh',
            /**
             * @event refresh
             * Fires when the view is refreshed
             * @param {Ext.DataView} this The DataView object
             */
            'refresh',
            /**
             * @event itemupdate
             * Fires when the node associated with an individual record is updated
             * @param {Ext.data.Model} record The model instance
             * @param {Number} index The index of the record/node
             * @param {HTMLElement} node The node that has just been updated
             */
            'itemupdate',
            /**
             * @event itemadd
             * Fires when the nodes associated with an recordset have been added to the underlying store
             * @param {Array[Ext.data.Model]} records The model instance
             * @param {Number} index The index at which the set of record/nodes starts
             * @param {Array[HTMLElement]} node The node that has just been updated
             */
            'itemadd',
            /**
             * @event itemremove
             * Fires when the node associated with an individual record is removed
             * @param {Ext.data.Model} record The model instance
             * @param {Number} index The index of the record/node
             */
            'itemremove'
        );

        me.addCmpEvents();

        me.store = Ext.data.StoreMgr.lookup(me.store);
        me.all = new Ext.CompositeElementLite();
        me.getSelectionModel().bindComponent(me);
    },

    onRender: function() {
        var me = this;

        me.callParent(arguments);
        if (me.loadingText) {
            // Attach the LoadMask to a *Component* so that it can be sensitive to resizing during long loads.
            // If this DataView is floating, then mask this DataView.
            // Otherwise, mask its owning Container (or this, if there *is* no owning Container).
            // LoadMask captures the element upon render.
            me.loadMask = new Ext.LoadMask(me.floating ? me : me.ownerCt||me, {
                msg: me.loadingText,
                listeners: {
                    beforeshow: function() {
                        me.getTargetEl().update('');
                        me.getSelectionModel().deselectAll();
                        me.all.clear();
                    }
                }
            });
        }
    },

    getSelectionModel: function(){
        var me = this,
            mode = 'SINGLE';

        if (!me.selModel) {
            me.selModel = {};
        }

        if (me.simpleSelect) {
            mode = 'SIMPLE';
        } else if (me.multiSelect) {
            mode = 'MULTI';
        }

        Ext.applyIf(me.selModel, {
            allowDeselect: me.allowDeselect,
            mode: mode
        });

        if (!me.selModel.events) {
            me.selModel = new Ext.selection.DataViewModel(me.selModel);
        }

        if (!me.selModel.hasRelaySetup) {
            me.relayEvents(me.selModel, ['selectionchange', 'beforeselect', 'select', 'deselect']);
            me.selModel.hasRelaySetup = true;
        }

        // lock the selection model if user
        // has disabled selection
        if (me.disableSelection) {
            me.selModel.locked = true;
        }

        return me.selModel;
    },

    /**
     * Refreshes the view by reloading the data from the store and re-rendering the template.
     */
    refresh: function() {
        var me = this,
            el,
            records;
            
        if (!me.rendered) {
            return;
        }
        
        me.fireEvent('beforerefresh', me);
        el = me.getTargetEl();
        records = me.store.getRange();

        el.update('');
        if (records.length < 1) {
            if (!me.deferEmptyText || me.hasSkippedEmptyText) {
                el.update(me.emptyText);
            }
            me.all.clear();
        } else {
            me.tpl.overwrite(el, me.collectData(records, 0));
            me.all.fill(Ext.query(me.getItemSelector(), el.dom));
            me.updateIndexes(0);
        }
        
        me.selModel.refresh();
        me.hasSkippedEmptyText = true;
        me.fireEvent('refresh', me);
    },

    /**
     * Function which can be overridden to provide custom formatting for each Record that is used by this
     * DataView's {@link #tpl template} to render each node.
     * @param {Array/Object} data The raw data object that was used to create the Record.
     * @param {Number} recordIndex the index number of the Record being prepared for rendering.
     * @param {Record} record The Record being prepared for rendering.
     * @return {Array/Object} The formatted data in a format expected by the internal {@link #tpl template}'s overwrite() method.
     * (either an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'}))
     */
    prepareData: function(data, index, record) {
        if (record) {    
            Ext.apply(data, record.getAssociatedData());            
        }
        return data;
    },
    
    /**
     * <p>Function which can be overridden which returns the data object passed to this
     * DataView's {@link #tpl template} to render the whole DataView.</p>
     * <p>This is usually an Array of data objects, each element of which is processed by an
     * {@link Ext.XTemplate XTemplate} which uses <tt>'&lt;tpl for="."&gt;'</tt> to iterate over its supplied
     * data object as an Array. However, <i>named</i> properties may be placed into the data object to
     * provide non-repeating data such as headings, totals etc.</p>
     * @param {Array} records An Array of {@link Ext.data.Model}s to be rendered into the DataView.
     * @param {Number} startIndex the index number of the Record being prepared for rendering.
     * @return {Array} An Array of data objects to be processed by a repeating XTemplate. May also
     * contain <i>named</i> properties.
     */
    collectData : function(records, startIndex){
        var r = [],
            i = 0,
            len = records.length;

        for(; i < len; i++){
            r[r.length] = this.prepareData(records[i].data, startIndex + i, records[i]);
        }

        return r;
    },

    // private
    bufferRender : function(records, index){
        var div = document.createElement('div');
        this.tpl.overwrite(div, this.collectData(records, index));
        return Ext.query(this.getItemSelector(), div);
    },

    // private
    onUpdate : function(ds, record){
        var me = this,
            index = me.store.indexOf(record),
            original,
            node;

        if (index > -1){
            original = me.all.elements[index];
            node = me.bufferRender([record], index)[0];

            me.all.replaceElement(index, node, true);
            me.updateIndexes(index, index);

            // Maintain selection after update
            // TODO: Move to approriate event handler.
            me.selModel.refresh();
            me.fireEvent('itemupdate', record, index, node);
        }

    },

    // private
    onAdd : function(ds, records, index) {
        var me = this,
            nodes;
            
        if (me.all.getCount() === 0) {
            me.refresh();
            return;
        }
        
        nodes = me.bufferRender(records, index);
        me.doAdd(nodes, records, index);

        me.selModel.refresh();
        me.updateIndexes(index);
        me.fireEvent('itemadd', records, index, nodes);
    },

    doAdd: function(nodes, records, index) {
        var n, a = this.all.elements;
        if (index < this.all.getCount()) {
            n = this.all.item(index).insertSibling(nodes, 'before', true);
            a.splice.apply(a, [index, 0].concat(nodes));
        } 
        else {
            n = this.all.last().insertSibling(nodes, 'after', true);
            a.push.apply(a, nodes);
        }    
    },
    
    // private
    onRemove : function(ds, record, index) {
        var me = this;
        
        me.doRemove(record, index);
        me.updateIndexes(index);
        if (me.store.getCount() === 0){
            me.refresh();
        }
        me.fireEvent('itemremove', record, index);
    },
    
    doRemove: function(record, index) {
        this.all.removeElement(index, true);
    },

    /**
     * Refreshes an individual node's data from the store.
     * @param {Number} index The item's data index in the store
     */
    refreshNode : function(index){
        this.onUpdate(this.store, this.store.getAt(index));
    },

    // private
    updateIndexes : function(startIndex, endIndex) {
        var ns = this.all.elements,
            records = this.store.getRange();
        startIndex = startIndex || 0;
        endIndex = endIndex || ((endIndex === 0) ? 0 : (ns.length - 1));
        for(var i = startIndex; i <= endIndex; i++){
            ns[i].viewIndex = i;
            ns[i].viewRecordId = records[i].internalId;
            if (!ns[i].boundView) {
                ns[i].boundView = this.id;
            }
        }
    },

    /**
     * Returns the store associated with this DataView.
     * @return {Ext.data.Store} The store
     */
    getStore : function(){
        return this.store;
    },

    /**
     * Changes the data store bound to this view and refreshes it.
     * @param {Store} store The store to bind to this view
     */
    bindStore : function(store, initial) {
        var me = this;
        
        if (!initial && me.store) {
            if (store !== me.store && me.store.autoDestroy) {
                me.store.destroy();
            } 
            else {
                me.mun(me.store, {
                    scope: me,
                    datachanged: me.onDataChanged,
                    add: me.onAdd,
                    remove: me.onRemove,
                    update: me.onUpdate,
                    clear: me.refresh
                });
            }
            if (!store) {
                if (me.loadMask) {
                    me.loadMask.bindStore(null);
                }
                me.store = null;
            }
        }
        if (store) {
            store = Ext.data.StoreMgr.lookup(store);
            me.mon(store, {
                scope: me,
                datachanged: me.onDataChanged,
                add: me.onAdd,
                remove: me.onRemove,
                update: me.onUpdate,
                clear: me.refresh
            });
            if (me.loadMask) {
                me.loadMask.bindStore(store);
            }
        }
        
        me.store = store;
        // Bind the store to our selection model
        me.getSelectionModel().bind(store);
        
        if (store) {
            me.refresh(true);
        }
    },

    /**
     * @private
     * Calls this.refresh if this.blockRefresh is not true
     */
    onDataChanged: function() {
        if (this.blockRefresh !== true) {
            this.refresh.apply(this, arguments);
        }
    },

    /**
     * Returns the template node the passed child belongs to, or null if it doesn't belong to one.
     * @param {HTMLElement} node
     * @return {HTMLElement} The template node
     */
    findItemByChild: function(node){
        return Ext.fly(node).findParent(this.getItemSelector(), this.getTargetEl());
    },
    
    /**
     * Returns the template node by the Ext.EventObject or null if it is not found.
     * @param {Ext.EventObject} e
     */
    findTargetByEvent: function(e) {
        return e.getTarget(this.getItemSelector(), this.getTargetEl());
    },


    /**
     * Gets the currently selected nodes.
     * @return {Array} An array of HTMLElements
     */
    getSelectedNodes: function(){
        var nodes   = [],
            records = this.selModel.getSelection(),
            ln = records.length,
            i  = 0;

        for (; i < ln; i++) {
            nodes.push(this.getNode(records[i]));
        }

        return nodes;
    },

    /**
     * Gets an array of the records from an array of nodes
     * @param {Array} nodes The nodes to evaluate
     * @return {Array} records The {@link Ext.data.Model} objects
     */
    getRecords: function(nodes) {
        var records = [],
            i = 0,
            len = nodes.length;

        for (; i < len; i++) {
            records[records.length] = this.store.data.getByKey(nodes[i].viewRecordId);
        }

        return r;
    },

    /**
     * Gets a record from a node
     * @param {Element/HTMLElement} node The node to evaluate
     * 
     * @return {Record} record The {@link Ext.data.Model} object
     */
    getRecord: function(node){
        return this.store.data.getByKey(Ext.getDom(node).viewRecordId);
    },
    

    /**
     * Returns true if the passed node is selected, else false.
     * @param {HTMLElement/Number/Ext.data.Model} node The node, node index or record to check
     * @return {Boolean} True if selected, else false
     */
    isSelected : function(node) {
        // TODO: El/Idx/Record
        var r = this.getRecord(node);
        return this.selModel.isSelected(r);
    },
    
    /**
     * Selects a record instance by record instance or index.
     * @param {Ext.data.Model/Index} records An array of records or an index
     * @param {Boolean} keepExisting
     * @param {Boolean} suppressEvent Set to false to not fire a select event
     */
    select: function(records, keepExisting, suppressEvent) {
        this.selModel.select(records, keepExisting, suppressEvent);
    },

    /**
     * Deselects a record instance by record instance or index.
     * @param {Ext.data.Model/Index} records An array of records or an index
     * @param {Boolean} suppressEvent Set to false to not fire a deselect event
     */
    deselect: function(records, suppressEvent) {
        this.selModel.deselect(records, suppressEvent);
    },

    /**
     * Gets a template node.
     * @param {HTMLElement/String/Number/Ext.data.Model} nodeInfo An HTMLElement template node, index of a template node,
     * the id of a template node or the record associated with the node.
     * @return {HTMLElement} The node or null if it wasn't found
     */
    getNode : function(nodeInfo) {
        if (Ext.isString(nodeInfo)) {
            return document.getElementById(nodeInfo);
        } else if (Ext.isNumber(nodeInfo)) {
            return this.all.elements[nodeInfo];
        } else if (nodeInfo instanceof Ext.data.Model) {
            return this.getNodeByRecord(nodeInfo);
        }
        return nodeInfo;
    },
    
    /**
     * @private
     */
    getNodeByRecord: function(record) {
        var ns = this.all.elements,
            ln = ns.length,
            i = 0;
        
        for (; i < ln; i++) {
            if (ns[i].viewRecordId === record.internalId) {
                return ns[i];
            }
        }
        
        return null;
    },
    
    /**
     * Gets a range nodes.
     * @param {Number} start (optional) The index of the first node in the range
     * @param {Number} end (optional) The index of the last node in the range
     * @return {Array} An array of nodes
     */
    getNodes: function(start, end) {
        var ns = this.all.elements,
            nodes = [],
            i;

        start = start || 0;
        end = !Ext.isDefined(end) ? Math.max(ns.length - 1, 0) : end;
        if (start <= end) {
            for (i = start; i <= end && ns[i]; i++) {
                nodes.push(ns[i]);
            }
        } else {
            for (i = start; i >= end && ns[i]; i--) {
                nodes.push(ns[i]);
            }
        }
        return nodes;
    },

    /**
     * Finds the index of the passed node.
     * @param {HTMLElement/String/Number/Record} nodeInfo An HTMLElement template node, index of a template node, the id of a template node
     * or a record associated with a node.
     * @return {Number} The index of the node or -1
     */
    indexOf: function(node) {
        node = this.getNode(node);
        if (Ext.isNumber(node.viewIndex)) {
            return node.viewIndex;
        }
        return this.all.indexOf(node);
    },

    onDestroy : function() {
        var me = this;
        
        me.all.clear();
        me.callParent();
        me.bindStore(null);
        me.selModel.destroy();
    },

    // invoked by the selection model to maintain visual UI cues
    onItemSelect: function(record) {
        var node = this.getNode(record);
        Ext.fly(node).addCls(this.selectedItemCls);
    },

    // invoked by the selection model to maintain visual UI cues
    onItemDeselect: function(record) {
        var node = this.getNode(record);
        Ext.fly(node).removeCls(this.selectedItemCls);
    },
    
    getItemSelector: function() {
        return this.itemSelector;
    }
}, function() {
    // all of this information is available directly
    // from the SelectionModel itself, the only added methods
    // to DataView regarding selection will perform some transformation/lookup
    // between HTMLElement/Nodes to records and vice versa.
    Ext.deprecate('extjs', '4.0', function() {
        Ext.AbstractDataView.override({
            /**
             * @cfg {Boolean} multiSelect
             * True to allow selection of more than one item at a time, false to allow selection of only a single item
             * at a time or no selection at all, depending on the value of {@link #singleSelect} (defaults to false).
             */
            /**
             * @cfg {Boolean} singleSelect
             * True to allow selection of exactly one item at a time, false to allow no selection at all (defaults to false).
             * Note that if {@link #multiSelect} = true, this value will be ignored.
             */
            /**
             * @cfg {Boolean} simpleSelect
             * True to enable multiselection by clicking on multiple items without requiring the user to hold Shift or Ctrl,
             * false to force the user to hold Ctrl or Shift to select more than on item (defaults to false).
             */
            
            /**
             * Gets the number of selected nodes.
             * @return {Number} The node count
             */
            getSelectionCount : function(){
                console.warn("DataView: getSelectionCount will be removed, please interact with the Ext.selection.DataViewModel");
                return this.selModel.getSelection().length;
            },
        
            /**
             * Gets an array of the selected records
             * @return {Array} An array of {@link Ext.data.Model} objects
             */
            getSelectedRecords : function(){
                console.warn("DataView: getSelectedRecords will be removed, please interact with the Ext.selection.DataViewModel");
                return this.selModel.getSelection();
            },
    
            select: function(records, keepExisting, supressEvents) {
                console.warn("DataView: select will be removed, please access select through a DataView's SelectionModel, ie: view.getSelectionModel().select()");
                var sm = this.getSelectionModel();
                return sm.select.apply(sm, arguments);
            },
            
            clearSelections: function() {
                console.warn("DataView: clearSelections will be removed, please access deselectAll through DataView's SelectionModel, ie: view.getSelectionModel().deselectAll()");
                var sm = this.getSelectionModel();
                return sm.deselectAll();
            }
        });    
    });
});
