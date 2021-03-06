/**
 * @class Ext.form.Label
 * @extends Ext.Component

Produces a standalone `<label />` element which can be inserted into a form and be associated with a field
in that form using the {@link #forId} property.

**NOTE:** in most cases it will be more appropriate to use the {@link Ext.form.Labelable#fieldLabel fieldLabel}
and associated config properties ({@link Ext.form.Labelable#labelAlign}, {@link Ext.form.Labelable#labelWidth},
etc.) in field components themselves, as that allows labels to be uniformly sized throughout the form.
Ext.form.Label should only be used when your layout can not be achieved with the standard
{@link Ext.form.Labelable field layout}.

You will likely be associating the label with a field component that extends {@link Ext.form.BaseField}, so
you should make sure the {@link #forId} is set to the same value as the {@link Ext.form.BaseField#inputId inputId}
of that field.

The label's text can be set using either the {@link #text} or {@link #html} configuration properties; the
difference between the two is that the former will automatically escape HTML characters when rendering, while
the latter will not.

#Example usage:#

This example creates a Label after its associated Text field, an arrangement that cannot currently
be achieved using the standard Field layout's labelAlign.

    new Ext.form.FormPanel({
        renderTo: Ext.getBody(),
        width: 400,
        bodyPadding: 10,
        title: 'Field with Label',
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        items: [{
            xtype: 'textfield',
            hideLabel: true,
            flex: 1
        }, {
            xtype: 'label',
            forId: 'myFieldId',
            text: 'My Awesome Field',
            margins: '0 0 0 10'
        }]
    });

 * @constructor
 * Creates a new Label component.
 * @param {Ext.core.Element/String/Object} config The configuration options.
 * 
 * @xtype label
 * @markdown
 * @docauthor Jason Johnston <jason@sencha.com>
 */
Ext.define('Ext.form.Label', {
    extend:'Ext.Component',
    alias: 'widget.label',
    requires: ['Ext.util.Format'],

    /**
     * @cfg {String} text The plain text to display within the label (defaults to ''). If you need to include HTML
     * tags within the label's innerHTML, use the {@link #html} config instead.
     */
    /**
     * @cfg {String} forId The id of the input element to which this label will be bound via the standard HTML 'for'
     * attribute. If not specified, the attribute will not be added to the label. In most cases you will be
     * associating the label with a {@link Ext.form.BaseField} component, so you should make sure this matches
     * the {@link Ext.form.BaseField#inputId inputId} of that field.
     */
    /**
     * @cfg {String} html An HTML fragment that will be used as the label's innerHTML (defaults to '').
     * Note that if {@link #text} is specified it will take precedence and this value will be ignored.
     */
    
    getElConfig: function(){
        var me = this;
        return {
            tag: 'label', 
            id: me.id, 
            htmlFor: me.forId || '',
            html: me.text ? Ext.util.Format.htmlEncode(me.text) : (me.html || '') 
        };
    },

    /**
     * Updates the label's innerHTML with the specified string.
     * @param {String} text The new label text
     * @param {Boolean} encode (optional) False to skip HTML-encoding the text when rendering it
     * to the label (defaults to true which encodes the value). This might be useful if you want to include
     * tags in the label's innerHTML rather than rendering them as string literals per the default logic.
     * @return {Label} this
     */
    setText : function(text, encode){
        var me = this;
        
        encode = encode !== false;
        if(encode) {
            me.text = text;
            delete me.html;
        } else {
            me.html = text;
            delete me.text;
        }
        
        if(me.rendered){
            me.el.dom.innerHTML = encode !== false ? Ext.util.Format.htmlEncode(text) : text;
        }
        return this;
    }
});

