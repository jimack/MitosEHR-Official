<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");

require ("C_FormWellChild.class.php");
$c = new C_FormWellChild();
echo $c->default_action_process($_POST);
@formJump();
?>
