<?
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");
formHeader('Habits form submitted');

$id = formSubmit('habits', $_POST);

formJump("./print.php?id=$id");


formFooter();
?>
