/**
 * @class Ext.form.Number
 * @extends Ext.form.Text
 * <p>Numeric text field that provides automatic keystroke filtering and numeric validation. The
 * range of acceptable number values can be controlled by setting the {@link #minValue} and/or
 * {@link #maxValue} configs.</p>
 * <p>By default, the number field is also rendered with a set of up/down spinner buttons for incrementing
 * the value by the {@link #step} value. To hide the spinner buttons, set <code>hideTrigger:true</code>.</p>
 * <p>Example:</p>
 * <pre><code>new Ext.form.FormPanel({
    renderTo: Ext.getBody(),
    title: 'Personal Info',
    width: 300,
    bodyPadding: 10,
    items: [{
        xtype: 'textfield',
        name: 'name',
        fieldLabel: 'Full Name',
        anchor: '100%'
    }, {
        xtype: 'numberfield',
        name: 'age',
        fieldLabel: 'Age',
        minValue: 0,
        anchor: '100%'
    }]
});</code></pre>

 * @constructor
 * Creates a new Number field
 * @param {Object} config Configuration options
 * 
 * @xtype numberfield
 */
Ext.define('Ext.form.Number', {
    extend:'Ext.form.Spinner',
    alias: 'widget.numberfield',
    alternateClassName: 'Ext.form.NumberField',

    /**
     * @cfg {RegExp} stripCharsRe @hide
     */
    /**
     * @cfg {RegExp} maskRe @hide
     */

    /**
     * @cfg {Boolean} allowDecimals False to disallow decimal values (defaults to true)
     */
    allowDecimals : true,
    
    /**
     * @cfg {String} decimalSeparator Character(s) to allow as the decimal separator (defaults to '.')
     */
    decimalSeparator : '.',
    
    /**
     * @cfg {Number} decimalPrecision The maximum precision to display after the decimal separator (defaults to 2)
     */
    decimalPrecision : 2,
    
    /**
     * @cfg {Number} minValue The minimum allowed value (defaults to Number.NEGATIVE_INFINITY). Will be used by
     * the field's validation logic, and for
     * {@link Ext.form.Spinner#setSpinUpEnabled enabling/disabling the down spinner button}.
     */
    minValue: Number.NEGATIVE_INFINITY,

    /**
     * @cfg {Number} maxValue The maximum allowed value (defaults to Number.MAX_VALUE). Will be used by
     * the field's validation logic, and for
     * {@link Ext.form.Spinner#setSpinUpEnabled enabling/disabling the up spinner button}.
     */
    maxValue: Number.MAX_VALUE,

    /**
     * @cfg {Number} step Specifies a numeric interval by which the field's value will be incremented or
     * decremented when the user invokes the spinner. Defaults to <tt>1</tt>.
     */
    step: 1,

    /**
     * @cfg {String} minText Error text to display if the minimum value validation fails (defaults to 'The minimum
     * value for this field is {minValue}')
     */
    minText : 'The minimum value for this field is {0}',
    
    /**
     * @cfg {String} maxText Error text to display if the maximum value validation fails (defaults to 'The maximum
     * value for this field is {maxValue}')
     */
    maxText : 'The maximum value for this field is {0}',
    
    /**
     * @cfg {String} nanText Error text to display if the value is not a valid number.  For example, this can happen
     * if a valid character like '.' or '-' is left in the field with no number (defaults to '{value} is not a valid number')
     */
    nanText : '{0} is not a valid number',
    
    /**
     * @cfg {String} negativeText Error text to display if the value is negative and {@link #minValue} is set to
     * <tt>0</tt>. This is used instead of the {@link #minText} in that circumstance only.
     */
    negativeText : 'The value cannot be negative',
    
    /**
     * @cfg {String} baseChars The base set of characters to evaluate as valid numbers (defaults to '0123456789').
     */
    baseChars : '0123456789',
    
    /**
     * @cfg {Boolean} autoStripChars True to automatically strip not allowed characters from the field. Defaults to <tt>false</tt>
     */
    autoStripChars: false,

    initComponent: function() {
        var me = this,
            allowed;

        Ext.form.Number.superclass.initComponent.call(me);

        me.setMinValue(me.minValue);
        me.setMaxValue(me.maxValue);

        // Build regexes for masking and stripping based on the configured options
        allowed = me.baseChars + '';
        if (me.allowDecimals) {
            allowed += me.decimalSeparator;
        }
        if (me.minValue < 0) {
            allowed += '-';
        }
        allowed = Ext.String.escapeRegex(allowed);
        me.maskRe = new RegExp('[' + allowed + ']');
        if (me.autoStripChars) {
            me.stripCharsRe = new RegExp('[^' + allowed + ']', 'gi');
        }
    },

    /**
     * Runs all of Number's validations and returns an array of any errors. Note that this first
     * runs Text's validations, so the returned array is an amalgamation of all field errors.
     * The additional validations run test that the value is a number, and that it is within the
     * configured min and max values.
     * @param {Mixed} value The value to get errors for (defaults to the current field value)
     * @return {Array} All validation errors for this field
     */
    getErrors: function(value) {
        var me = this,
            errors = Ext.form.Number.superclass.getErrors.apply(me, arguments),
            format = Ext.String.format,
            num;
        
        value = Ext.isDefined(value) ? value : this.processRawValue(this.getRawValue());
        
        if (value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
             return errors;
        }
        
        value = String(value).replace(me.decimalSeparator, '.');
        
        if(isNaN(value)){
            errors.push(format(me.nanText, value));
        }
        
        num = me.parseValue(value);
        
        if (me.minValue === 0 && num < 0) {
            errors.push(this.negativeText);
        }
        else if (num < me.minValue) {
            errors.push(format(me.minText, me.minValue));
        }
        
        if (num > me.maxValue) {
            errors.push(format(me.maxText, me.maxValue));
        }
        

        return errors;
    },

    rawToValue: function(str) {
        return this.fixPrecision(this.parseValue(str));
    },

    valueToRaw: function(value) {
        var me = this,
            decimalSeparator = me.decimalSeparator;
        value = me.parseValue(value);
        value = me.fixPrecision(value);
        value = Ext.isNumber(value) ? value : parseFloat(String(value).replace(decimalSeparator, '.'));
        value = isNaN(value) ? '' : String(value).replace('.', decimalSeparator);
        return value;
    },

    onChange: function() {
        var me = this,
            value = me.getValue(),
            valueIsNull = value === null;

        me.callParent(arguments);

        // Update the spinner buttons
        me.setSpinUpEnabled(valueIsNull || value < me.maxValue);
        me.setSpinDownEnabled(valueIsNull || value > me.minValue);
    },
    
    /**
     * Replaces any existing {@link #minValue} with the new value.
     * @param {Number} value The minimum value
     */
    setMinValue : function(value) {
        this.minValue = Ext.num(value, Number.NEGATIVE_INFINITY);
    },
    
    /**
     * Replaces any existing {@link #maxValue} with the new value.
     * @param {Number} value The maximum value
     */
    setMaxValue: function(value) {
        this.maxValue = Ext.num(value, Number.MAX_VALUE);
    },

    // private
    parseValue : function(value) {
        value = parseFloat(String(value).replace(this.decimalSeparator, '.'));
        return isNaN(value) ? null : value;
    },

    /**
     * @private
     * 
     */
    fixPrecision : function(value) {
        var me = this,
            nan = isNaN(value),
            precision = me.decimalPrecision;
        
        if (nan || !value) {
            return nan ? '' : value;
        } else if (!me.allowDecimals || precision <= 0) {
            precision = 0;
        }
        
        return parseFloat(Ext.Number.toFixed(parseFloat(value), precision));
    },

    beforeBlur : function() {
        var me = this,
            v = me.parseValue(me.getRawValue());
        
        if (!Ext.isEmpty(v)) {
            me.setValue(v);
        }
    },

    onSpinUp: function() {
        var me = this;
        me.setValue(Ext.Number.constrain(me.getValue() + me.step, me.minValue, me.maxValue));
    },

    onSpinDown: function() {
        var me = this;
        me.setValue(Ext.Number.constrain(me.getValue() - me.step, me.minValue, me.maxValue));
    }
});