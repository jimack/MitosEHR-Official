<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');

/* Logon Screen Window
 * Description: Obviously the Logon Window. I think every WebApp has one.
 * 
 * author: Gino Rivera Falu
 * Version 0.0.3
 * Revision: N/A
 */

?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>MitosEHR Logon Screen</title>

<script type="text/javascript" src="library/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>

<link rel="stylesheet" type="text/css" href="library/<?php echo $_SESSION['dir']['ext']; ?>/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >

<script type="text/javascript">
Ext.require([
	'Ext.Msg.*',
	'Ext.JSON.*',
	'Ext.form.*',
    'Ext.window.*',
    'Ext.data.*',
    'Ext.tip.QuickTips'
]);
Ext.onReady(function(){

Ext.tip.QuickTips.init();

// *************************************************************************************
// Structure, data for storeLang
// AJAX -> component_data.ejs.php
// *************************************************************************************
Ext.regModel('Sites', { fields: 
	[
	{ type: 'int', name: 'site_id'},
	{ type: 'string', name: 'site'}
	] 
});
var storeSites = new Ext.data.Store({
	model: 'Sites',
	proxy: new Ext.data.AjaxProxy({
		url: 'interface/login/component_data.ejs.php?task=sites',
		reader: {
			type: 'json',
			idProperty: 'site_id',
			totalProperty: 'results',
			root: 'row'
		}
	}),
	autoLoad: true
}); // End storeLang

// *************************************************************************************
// The Copyright Notice Window
// *************************************************************************************
var winCopyright = Ext.create('widget.window', {
	id				: 'winCopyright',
	width			: 600,
	height			: 500,
	closeAction		: 'hide',
	bodyStyle		: 'padding: 5px;',
	modal			: false,
	resizable		: true,
	title			: 'MitosEHR Copyright Notice',
	draggable		: true,
	closable		: true,
	autoLoad		: 'interface/login/copyright_notice.html',
	autoScroll		: true
}); // End winCopyright

// *************************************************************************************
// Form Layout [Login]
// *************************************************************************************
var formLogin = Ext.create('Ext.form.FormPanel', {
	id				: 'formLogin',
    url				: 'library/authProcedures/auth.inc.php',
    baseParams		: {auth: 'true'},
    bodyStyle		:'padding:5px 5px 0',
    waitMsgTarget	: true,
	frame			: false,
	border			: false,
    fieldDefaults	: { msgTarget: 'side', labelWidth: 300 },
    defaultType		: 'textfield',
    defaults		: { anchor: '100%' },
    items: [{ 
    	xtype: 'textfield',
        minLength: 3,
		maxLength: 25, 
		allowBlank: false, 
		blankText:'Enter your username', 
		ref: '../authUser', 
		id: 'authUser', 
		name: 'authUser', 
		validationEvent: false,
		fieldLabel: 'Username',
		minLengthText: 'Username must be at least 3 characters long.' 
	},{
		xtype: 'textfield',
        minLength: 4,
		maxLength: 10, 
		allowBlank: false,
		blankText:'Enter your password', 
		ref: '../authPass', 
		inputType: 'password', 
		id: 'authPass', 
		name: 'authPass', 
		validationEvent: false,
		fieldLabel: 'Password',
		minLengthText: 'Password must be at least 4 characters long.'
    },{ 
    	xtype: 'combobox', 
    	id: 'choiseSite', 
    	name: 'choiseSite', 
    	forceSelect: true,
    	store: storeSites,
    	fieldLabel: 'Site', 
    	editable: false, 
    	triggerAction: 'all', 
    	displayField: 'site',
    	queryMode: 'local'
    }],
    buttons: [{
        text: 'Reset',
        id: 'btn_reset',
		name: 'btn_reset',
		handler: function() {
            formLogin.getForm().reset();
		}
	},{
		text: 'Login',
        id: 'btn_login',
		name: 'btn_login',
		handler: function() {
			formLogin.getForm().submit({
				method:'POST', 
				waitTitle:'Connecting', 
				waitMsg:'Sending credentials...',
				// Logon Success
				success:function(){ 
					var redirect = 'index.php'; 
					window.location = redirect;
				},
				// Failed to logon
				failure:function(form, action){ 
					if(action.failureType == 'server'){ 
						obj = Ext.JSON.decode(action.response.responseText); 
						Ext.Msg.alert('Login Failed!', obj.errors.reason); 
					}else{ 
						Ext.Msg.alert('Warning!', 'Authentication server is unreachable : ' + action.response.responseText); 
					}
					formLogin.getForm().reset(); 
				}
			})
		}
    }],
    keys: [{
		key: [Ext.EventObject.ENTER], handler: function() {
			formLogin.getForm().submit({
				method:'POST', 
				waitTitle:'Connecting', 
				waitMsg:'Sending data...',
				// Logon Success
				success:function(){ 
					var redirect = 'index.php'; 
					window.location = redirect;
				},
				// Failed to logon
				failure:function(form, action){ 
					if(action.failureType == 'server'){ 
						obj = Ext.JSON.decode(action.response.responseText); 
						Ext.Msg.alert('Login Failed!', obj.errors.reason); 
					}else{ 
						Ext.Msg.alert('Warning!', 'Authentication server is unreachable : ' + action.response.responseText); 
					}
					formLogin.getForm().reset(); 
				}
			})
		}
	}],
	listeners:{
		render: function(){
			Ext.getCmp('authUser').focus(true, 10);
		}
	}
}); // End formLogin

// *************************************************************************************
// The Logon Window
// *************************************************************************************
var winLogon = new Ext.create('widget.window', {
    title			: 'MitosEHR Logon',
    closable		: true,
    width			: 499,
	height			: 315,
	bodyPadding		: 2,  		//new 4.0 
	closeAction		: 'hide',
    plain			: true,
	modal			: false,
	resizable		: false,
	draggable		: false,
	closable		: false,
    bodyStyle		: 'padding: 5px;',
    items			: [{ xtype: 'box', width: 483, height: 135, autoEl: {tag: 'img', src: 'ui_app/logon_header.png'}}, formLogin ]
}); // End winLogon

winLogon.show();

}); // End App

</script>
</head>
<body id="login">
<div id="copyright">MitosEHR<?php echo $_SESSION['ver']['major'] . "." . $_SESSION['ver']['rev'] . "." . $_SESSION['ver']['minor'] . " " . $_SESSION['ver']['codeName']; ?> | <a href="javascript:void()" onClick="Ext.getCmp('winCopyright').show();" >Copyright Notice</a></div>
</body>
</html>