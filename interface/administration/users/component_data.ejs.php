<?php
//--------------------------------------------------------------------------------------------------------------------------
// component_data.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Gi Technologies. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();

include_once("library/dbHelper/dbHelper.inc.php");
include_once("library/I18n/I18n.inc.php");
require_once("repository/dataExchange/dataExchange.inc.php");

// Count records variable
$count = 0;
// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {
	// *************************************************************************************
	// Data for for storeTitles
	// *************************************************************************************
	case "titles":
	    $sql = "SELECT option_id, title FROM list_options WHERE list_id = 'titles' ";
	  
	  foreach (sqlStatement($sql) as $urow) {
	    $count++;
	    $buff .= "{";
	    $buff .= " option_id: '" . dataEncode( $urow['option_id'] ) . "',";
	    $buff .= " title: '" . dataEncode( $urow['title'] ) . "'}," . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo $_GET['callback'] . '({';
	  echo "results: " . $count . ", " . chr(13);
	  echo "row: [" . chr(13);
	  echo $buff;
	  echo "]})" . chr(13);   
  	break;
	// *************************************************************************************
	// Data for for storeTypes
	// *************************************************************************************
	case "types":
	  $sql = "SELECT option_id, title FROM list_options WHERE list_id = 'abook_type' ";
	  
	  foreach (sqlStatement($sql) as $urow) {
	    $count++;
	    $buff .= "{";
	    $buff .= " option_id: '" . dataEncode( $urow['option_id'] ) . "',";
	    $buff .= " title: '" . dataEncode( $urow['title'] ) . "'}," . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo $_GET['callback'] . '({';
	  echo "results: " . $count . ", " . chr(13);
	  echo "row: [" . chr(13);
	  echo $buff;
	  echo "]})" . chr(13);   
	break;
	// *************************************************************************************
	// Data for for Facilities
	// *************************************************************************************
	case "facilities":
	  $sql = "SELECT * FROM facility WHERE service_location != 0 ORDER BY name";
	  
	  foreach (sqlStatement($sql) as $urow) {
	    $count++;
	    $buff .= "{";
	    $buff .= " id: '" . dataEncode( $urow['id'] ) . "',";
	    $buff .= " name: '" . dataEncode( $urow['name'] ) . "'}," . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo $_GET['callback'] . '({';
	  echo "totals: " . $count . ", " . chr(13);
	  echo "row: [" . chr(13);
	  echo $buff;
	  echo "]})" . chr(13);   
	break;
	// *************************************************************************************
	// Data for for See Authorizations
	// *************************************************************************************
	case "seeAuthorizations":

	  echo "({totals: 3, row: [ { id: '1', name: 'None'}, { id: '2', name: 'Only Mine'}, { id: '3', name: 'All'}]})";
   
	break;
		// *************************************************************************************
	// Data for for AccessControl
	// *************************************************************************************
	case "accessControls":
	  $sql = "SELECT id, value, name FROM gacl_aco_sections ORDER BY name";
	  
	  foreach (sqlStatement($sql) as $urow) {
	    $count++;
	    $buff .= "{";
	    $buff .= " id: '" . dataEncode( $urow['id'] ) . "',";
	    $buff .= " value: '" . dataEncode( $urow['value'] ) . "',";
	    $buff .= " name: '" . dataEncode( $urow['name'] ) . "'}," . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo $_GET['callback'] . '({';
	  echo "totals: " . $count . ", " . chr(13);
	  echo "row: [" . chr(13);
	  echo $buff;
	  echo "]})" . chr(13);   
	break;
}
?>