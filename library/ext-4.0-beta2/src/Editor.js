/**
 * @class Ext.Editor
 * @extends Ext.Component
 * 
 * <p>
 * The Editor class is used to provide inline editing for elements on the page. The editor
 * is backed by a {@link Ext.form.Field} that will be displayed to edit the underlying content.
 * The editor is a floating Component, when the editor is shown it is automatically aligned to 
 * display over the top of the bound element it is editing. The Editor contains several options 
 * for how to handle key presses:
 * <ul>
 * <li>{@link #completeOnEnter}</li>
 * <li>{@link #cancelOnEsc}</li>
 * <li>{@link #swallowKeys}</li>
 * </ul>
 * It also has options for how to use the value once the editor has been activated:
 * <ul>
 * <li>{@link #revertInvalid}</li>
 * <li>{@link #ignoreNoChange}</li>
 * <li>{@link #updateEl}</li>
 * </ul>
 * Sample usage:
 * </p>
 * <pre><code>
var editor = new Ext.Editor({
    updateEl: true, // update the innerHTML of the bound element when editing completes
    field: {
        xtype: 'textfield'
    }
});
var el = Ext.get('my-text'); // The element to 'edit'
editor.startEdit(el); // The value of the field will be taken as the innerHTML of the element.
 * </code></pre>
 * 
 * @constructor
 * Create a new Editor
 * @param {Object} config The config object
 * @xtype editor
 */
Ext.define('Ext.Editor', {
    
    /* Begin Definitions */
   
    extend: 'Ext.Component',
    
    alias: 'widget.editor',
    
    requires: ['Ext.layout.component.Editor'],
    
    /* End Definitions */
   
   componentLayout: 'editor',

    /**
    * @cfg {Ext.form.Field} field
    * The Field object (or descendant) or config object for field
    */

    /**
     * @cfg {Boolean} allowBlur
     * True to {@link #completeEdit complete the editing process} if in edit mode when the
     * field is blurred. Defaults to <tt>true</tt>.
     */
    allowBlur: true,
    
    /**
     * @cfg {Boolean/Object} autoSize
     * True for the editor to automatically adopt the size of the underlying field. Otherwise, an object
     * can be passed to indicate where to get each dimension. The available properties are 'boundEl' and
     * 'field'. If a dimension is not specified, it will use the underlying height/width specified on
     * the editor object.
     * Examples:
     * <pre><code>
autoSize: true // The editor will be sized to the height/width of the field

height: 21,
autoSize: {
    width: 'boundEl' // The width will be determined by the width of the boundEl, the height from the editor (21)
}

autoSize: {
    width: 'field', // Width from the field
    height: 'boundEl' // Height from the boundEl
}
     * </pre></code>
     */
    
    /**
     * @cfg {Boolean} revertInvalid
     * True to automatically revert the field value and cancel the edit when the user completes an edit and the field
     * validation fails (defaults to true)
     */
    
    /**
     * @cfg {Boolean} ignoreNoChange
     * True to skip the edit completion process (no save, no events fired) if the user completes an edit and
     * the value has not changed (defaults to false).  Applies only to string values - edits for other data types
     * will never be ignored.
     */
    
    /**
     * @cfg {Boolean} hideEl
     * False to keep the bound element visible while the editor is displayed (defaults to true)
     */
    
    /**
     * @cfg {Mixed} value
     * The data value of the underlying field (defaults to "")
     */
    value : '',
    
    /**
     * @cfg {String} alignment
     * The position to align to (see {@link Ext.core.Element#alignTo} for more details, defaults to "c-c?").
     */
    alignment: 'c-c?',
    
    /**
     * @cfg {Array} offsets
     * The offsets to use when aligning (see {@link Ext.core.Element#alignTo} for more details. Defaults to <tt>[0, 0]</tt>.
     */
    offsets: [0, 0],
    
    /**
     * @cfg {Boolean/String} shadow "sides" for sides/bottom only, "frame" for 4-way shadow, and "drop"
     * for bottom-right shadow (defaults to "frame")
     */
    shadow : 'frame',
    
    /**
     * @cfg {Boolean} constrain True to constrain the editor to the viewport
     */
    constrain : false,
    
    /**
     * @cfg {Boolean} swallowKeys Handle the keydown/keypress events so they don't propagate (defaults to true)
     */
    swallowKeys : true,
    
    /**
     * @cfg {Boolean} completeOnEnter True to complete the edit when the enter key is pressed. Defaults to <tt>true</tt>.
     */
    completeOnEnter : true,
    
    /**
     * @cfg {Boolean} cancelOnEsc True to cancel the edit when the escape key is pressed. Defaults to <tt>true</tt>.
     */
    cancelOnEsc : true,
    
    /**
     * @cfg {Boolean} updateEl True to update the innerHTML of the bound element when the update completes (defaults to false)
     */
    updateEl : false,
    
    /**
     * @cfg {Mixed} parentEl An element to render to. Defaults to the <tt>document.body</tt>.
     */

    // private overrides
    hidden: true,
    baseCls: Ext.baseCSSPrefix + 'editor',

    initComponent : function() {
        var me = this,
            field = me.field = Ext.ComponentMgr.create(me.field, 'textfield');

        Ext.apply(field, {
            inEditor: true,
            msgTarget: field.msgTarget == 'title' ? 'title' :  'qtip'
        });
        me.mon(field, {
            scope: me,
            blur: me.onBlur,
            specialkey: me.onSpecialKey
        });

        if (field.grow) {
            me.mon(field, 'autosize', me.doComponentLayout,  me, {delay: 1});
        }
        me.floating = {
            constrain: me.constrain
        };
        
        me.callParent(arguments);
        
        me.addEvents(
            /**
             * @event beforestartedit
             * Fires when editing is initiated, but before the value changes.  Editing can be canceled by returning
             * false from the handler of this event.
             * @param {Ext.Editor} this
             * @param {Ext.core.Element} boundEl The underlying element bound to this editor
             * @param {Mixed} value The field value being set
             */
            'beforestartedit',
            /**
             * @event startedit
             * Fires when this editor is displayed
             * @param {Ext.Editor} this
             * @param {Ext.core.Element} boundEl The underlying element bound to this editor
             * @param {Mixed} value The starting field value
             */
            'startedit',
            /**
             * @event beforecomplete
             * Fires after a change has been made to the field, but before the change is reflected in the underlying
             * field.  Saving the change to the field can be canceled by returning false from the handler of this event.
             * Note that if the value has not changed and ignoreNoChange = true, the editing will still end but this
             * event will not fire since no edit actually occurred.
             * @param {Editor} this
             * @param {Mixed} value The current field value
             * @param {Mixed} startValue The original field value
             */
            'beforecomplete',
            /**
             * @event complete
             * Fires after editing is complete and any changed value has been written to the underlying field.
             * @param {Ext.Editor} this
             * @param {Mixed} value The current field value
             * @param {Mixed} startValue The original field value
             */
            'complete',
            /**
             * @event canceledit
             * Fires after editing has been canceled and the editor's value has been reset.
             * @param {Ext.Editor} this
             * @param {Mixed} value The user-entered field value that was discarded
             * @param {Mixed} startValue The original field value that was set back into the editor after cancel
             */
            'canceledit',
            /**
             * @event specialkey
             * Fires when any key related to navigation (arrows, tab, enter, esc, etc.) is pressed.  You can check
             * {@link Ext.EventObject#getKey} to determine which key was pressed.
             * @param {Ext.Editor} this
             * @param {Ext.form.Field} The field attached to this editor
             * @param {Ext.EventObject} event The event object
             */
            'specialkey'
        );
    },

    // private
    onRender : function(ct, position) {
        var me = this,
            field = me.field;

        me.callParent(arguments);

        field.render(me.el);
        //field.hide();
        // Ensure the field doesn't get submitted as part of any form
        field.inputEl.dom.name = '';
        if (me.swallowKeys) {
            field.inputEl.swallowEvent([
                'keypress', // *** Opera
                'keydown'   // *** all other browsers
            ]);
        }
    },

    // private
    onSpecialKey : function(field, event) {
        var me = this,
            key = event.getKey(),
            complete = me.completeOnEnter && key == event.ENTER,
            cancel = me.cancelOnEsc && key == event.ESC;

        if (complete || cancel) {
            event.stopEvent();
            // Must defer this slightly to prevent exiting edit mode before the field's own
            // key nav can handle the enter key, e.g. selecting an item in a combobox list
            Ext.defer(function() {
                if (complete) {
                    me.completeEdit();
                } else {
                    me.cancelEdit();
                }
                if (field.triggerBlur) {
                    field.triggerBlur();
                }
            }, 10);
        }

        this.fireEvent('specialkey', this, field, event);
    },

    /**
     * Starts the editing process and shows the editor.
     * @param {Mixed} el The element to edit
     * @param {String} value (optional) A value to initialize the editor with. If a value is not provided, it defaults
      * to the innerHTML of el.
     */
    startEdit : function(el, value) {
        var me = this,
            field = me.field,
            rendered = me.rendered;
            
        me.completeEdit();
        me.boundEl = Ext.get(el);
        value = Ext.isDefined(value) ? value : me.boundEl.dom.innerHTML;
        
        if (!rendered) {
            me.render(me.parentEl || document.body);
        }
        
        if (me.fireEvent('beforestartedit', me, me.boundEl, value) !== false) {
            me.startValue = value;
            me.show();
            field.reset();
            field.setValue(value);
            me.realign(rendered); // only force a layout after first time
            field.show().focus(false, 10);
            if (field.autoSize) {
                field.autoSize();
            }
            me.editing = true;
        }
    },

    /**
     * Realigns the editor to the bound field based on the current alignment config value.
     * @param {Boolean} autoSize (optional) True to size the field to the dimensions of the bound element.
     */
    realign : function(autoSize) {
        var me = this;
        if (autoSize === true) {
            me.doComponentLayout();
        }
        me.alignTo(me.boundEl, me.alignment, me.offsets);
    },

    /**
     * Ends the editing process, persists the changed value to the underlying field, and hides the editor.
     * @param {Boolean} remainVisible Override the default behavior and keep the editor visible after edit (defaults to false)
     */
    completeEdit : function(remainVisible) {
        var me = this,
            field = me.field,
            value;
            
        if (!me.editing) {
            return;
        }

        // Assert combo values first
        if (field.assertValue) {
            field.assertValue();
        }

        value = me.getValue();
        if (!field.isValid()) {
            if (me.revertInvalid !== false) {
                me.cancelEdit(remainVisible);
            }
            return;
        }

        if (String(value) === String(me.startValue) && me.ignoreNoChange) {
            me.hideEdit(remainVisible);
            return;
        }

        if (me.fireEvent('beforecomplete', me, value, me.startValue) !== false) {
            // Grab the value again, may have changed in beforecomplete
            value = me.getValue();
            if (me.updateEl && me.boundEl) {
                me.boundEl.update(value);
            }
            me.hideEdit(remainVisible);
            me.fireEvent('complete', me, value, me.startValue);
        }
    },

    // private
    onShow : function() {
        var me = this;
        
        me.callParent(arguments);
        if (me.hideEl !== false) {
            me.boundEl.hide();
        }
        me.fireEvent("startedit", me.boundEl, me.startValue);
    },

    /**
     * Cancels the editing process and hides the editor without persisting any changes.  The field value will be
     * reverted to the original starting value.
     * @param {Boolean} remainVisible Override the default behavior and keep the editor visible after
     * cancel (defaults to false)
     */
    cancelEdit : function(remainVisible) {
        var me = this,
            startValue = me.startValue,
            value;
            
        if (me.editing) {
            value = me.getValue();
            me.setValue(startValue);
            me.hideEdit(remainVisible);
            me.fireEvent('canceledit', me, value, startValue);
        }
    },

    // private
    hideEdit: function(remainVisible) {
        if (remainVisible !== true) {
            this.editing = false;
            this.hide();
        }
    },

    // private
    onBlur : function() {
        var me = this;

        // selectSameEditor flag allows the same editor to be started without onBlur firing on itself
        if(me.allowBlur === true && me.editing && me.selectSameEditor !== true) {
            me.completeEdit();
        }
    },

    // private
    onHide : function() {
        var me = this,
            field = me.field;
        
        if (me.editing) {
            me.completeEdit();
            return;
        }
        field.blur();
        if (field.collapse) {
            field.collapse();
        }
        
        field.hide();
        if (me.hideEl !== false) {
            me.boundEl.show();
        }
    },

    /**
     * Sets the data value of the editor
     * @param {Mixed} value Any valid value supported by the underlying field
     */
    setValue : function(value) {
        this.field.setValue(value);
    },

    /**
     * Gets the data value of the editor
     * @return {Mixed} The data value
     */
    getValue : function() {
        return this.field.getValue();
    },

    beforeDestroy : function() {
        var me = this;
        
        Ext.destroy(me.field);
        delete me.field;
        delete me.parentEl;
        delete me.boundEl;
        
        me.callParent(arguments);
    }
});