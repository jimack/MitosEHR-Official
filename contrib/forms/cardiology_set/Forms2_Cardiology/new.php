<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");
formHeader("Form: Forms2_Cardiology");
$returnurl = $GLOBALS['concurrent_layout'] ? 'encounter_top.php' : 'patient_encounter.php';
?>
<html><head>
<link rel=stylesheet href="<?echo $css_header;?>" type="text/css">
</head>
<body <?echo $top_bg_line;?> topmargin=0 rightmargin=0 leftmargin=2 bottommargin=0 marginwidth=2 marginheight=0>
<style type="text/css">@import url(../../../library/dynarch_calendar.css);</style>
<script type="text/javascript" src="../../../library/dialog.js"></script>
<script type="text/javascript" src="../../../library/textformat.js"></script>
<script type="text/javascript" src="../../../library/dynarch_calendar.js"></script>
<script type="text/javascript" src="../../../library/dynarch_calendar_en.js"></script>
<script type="text/javascript" src="../../../library/dynarch_calendar_setup.js"></script>
<script language='JavaScript'> var mypcc = '1'; </script>

<a href='<?php echo $GLOBALS['webroot']?>/interface/patient_file/encounter/<?php echo $returnurl?>' onclick='top.restoreSession()'> <? xl("[do not save]",'e') ?> </a>
<form method=post action="<?echo $rootdir;?>/forms/Forms2_Cardiology/save.php?mode=new" name="Forms2_Cardiology" onSubmit="return top.restoreSession()">
<hr>
<h1> <? xl("Forms2_Cardiology",'e') ?> </h1>
<hr>
<input type="submit" name="submit form" value="submit form" />

 <table width="100%">

            <tr>

                <td class="text">
                    <strong> <? xl("Recommended Subacute Bacterial Endocarditis Prophylaxis",'e') ?> </strong></td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> recommended subacute bacterial endocarditis prophylaxis</td> <td><label><input type="checkbox" name="_recommended_subacute_bacterial_endocarditis_prophylaxis[]" value="None" /> <? xl("None",'e') ?> </label> <label><input type="checkbox" name="_recommended_subacute_bacterial_endocarditis_prophylaxis[]" value="Standard" /> <? xl("Standard",'e') ?> </label></td></tr>

</table>

<table>


</table>

                    <br />

<table>

<tr><td> other</td> <td><input type="text" name="_other"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

                    <strong> <? xl("Check the letter below describing the level of exercise tolerance in which the
                        applicant is able to participate.",'e') ?> </strong></td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> full active participation with no restrictions</td> <td><label><input type="checkbox" name="_full_active_participation_with_no_restrictions" value="yes" /></label></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> full active participation with moderate exercise</td> <td><label><input type="checkbox" name="_full_active_participation_with_moderate_exercise" value="yes" /></label></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> partial active participation with light exercise</td> <td><label><input type="checkbox" name="_partial_active_participation_with_light_exercise" value="yes" /></label></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> limited active participation with no exercise</td> <td><label><input type="checkbox" name="_limited_active_participation_with_no_exercise" value="yes" /></label></td></tr>

</table>
                </td>
            </tr>

        </table>

        <table width="100%">

            <tr>

                <td class='text' colspan="3">
                    <b> <? xl("Allergies:",'e') ?> </b></td>
            </tr>

            <tr>

                <td class='text'>

                    Medication/Trigger
                </td>

                <td class='text'>

                    Date of the last Reaction
                </td>

                <td class='text'>

                    Type of Reaction
                </td>
            </tr>

            <tr>

                <td class='text'>

                    Medication Trigger1:textfield
                </td>

                <td class='text'>

<table>

<tr><td> date of the last reaction1</td> <td><input type="text" name="_date_of_the_last_reaction1"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> type of reaction1</td> <td><input type="text" name="_type_of_reaction1"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> medication trigger2</td> <td><input type="text" name="_medication_trigger2"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> date of the last reaction2</td> <td><input type="text" name="_date_of_the_last_reaction2"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> type of reaction2</td> <td><input type="text" name="_type_of_reaction2"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> medication trigger3</td> <td><input type="text" name="_medication_trigger3"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> date of the last reaction3</td> <td><input type="text" name="_date_of_the_last_reaction3"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> type of reaction3</td> <td><input type="text" name="_type_of_reaction3"  /></td></tr>

</table>
                </td>
            </tr>

        </table>

        <table width="100%">

            <tr>

                <td class='text' colspan="2">
                    <strong> <? xl("Medications:",'e') ?> </strong></td>
            </tr>

            <tr>

                <td class='text'>

                    Medication / Strength / SIG:
                </td>

                <td class='text'>

                    Special Instructions:
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> medication strength  sig1</td> <td><input type="text" name="_medication_strength__sig1"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> special instructions1</td> <td><input type="text" name="_special_instructions1"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> medication strength  sig2</td> <td><input type="text" name="_medication_strength__sig2"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> special instructions2</td> <td><input type="text" name="_special_instructions2"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> medication strength  sig3</td> <td><input type="text" name="_medication_strength__sig3"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> special instructions3</td> <td><input type="text" name="_special_instructions3"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> medication strength  sig4</td> <td><input type="text" name="_medication_strength__sig4"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> special instructions4</td> <td><input type="text" name="_special_instructions4"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> medication strength  sig5</td> <td><input type="text" name="_medication_strength__sig5"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> special instructions5</td> <td><input type="text" name="_special_instructions5"  /></td></tr>

</table>
                </td>
            </tr>

        </table>

        <table>

            <tr>

                <td class='text' align="center">

                    <strong> <? xl("Non-prescription medications we stock in the camp infirmary are listed below:
                        Please check those which we SHOULD NOT administer",'e') ?> </strong></td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> non prescription medications</td> <td><label><input type="checkbox" name="_non_prescription_medications[]" value="Acetaminophen" /> <? xl("Acetaminophen",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Advil" /> <? xl("Advil",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Benadryl" /> <? xl("Benadryl",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Caladryl" /> <? xl("Caladryl",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Chloraseptic Spray" /> <? xl("Chloraseptic Spray",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Cough Medicine" /> <? xl("Cough Medicine",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Dramamine" /> <? xl("Dramamine",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Kaopectate" /> <? xl("Kaopectate",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Meclazine" /> <? xl("Meclazine",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Milk of Magnesia" /> <? xl("Milk of Magnesia",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Pepto Bismol" /> <? xl("Pepto Bismol",'e') ?> </label> <label><input type="checkbox" name="_non_prescription_medications[]" value="Sudafed" /> <? xl("Sudafed",'e') ?> </label></td></tr>

</table>
                </td>
            </tr>

        </table>

        <table width="100%">

            <tr>

                <td class='text'>

<table>

<tr><td> describe any recent operations or serious illness</td> <td><textarea name="_describe_any_recent_operations_or_serious_illness"  rows="4" cols="40"></textarea></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> describe any physical disability effecting camp activity</td> <td><textarea name="_describe_any_physical_disability_effecting_camp_activity"  rows="4" cols="40"></textarea></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> describe any pertinent findings on examination</td> <td><textarea name="_describe_any_pertinent_findings_on_examination"  rows="4" cols="40"></textarea></td></tr>

</table>
                </td>
            </tr>

        </table>

        <table width="100%">

            <tr>

                <td class='text' colspan="4">
                    <strong> <? xl("Cardiac Rhythm/Device History",'e') ?> </strong></td>
            </tr>

            <tr>

                <td class='text' style="width: 498px">

<table>

<tr><td> does applicant have a history of dysrhythmias</td> <td><label><input type="radio" name="_does_applicant_have_a_history_of_dysrhythmias" value="Yes" /> <? xl("Yes",'e') ?> </label> <label><input type="radio" name="_does_applicant_have_a_history_of_dysrhythmias" value="NO" /> <? xl("NO",'e') ?> </label></td></tr>

</table>
                </td>

                <td class='text'>

<table>


</table>
            </tr>

            <tr>

                <td class='text' colspan="24">

<table>


</table>
            </tr>

            <tr>

                <td class='text' colspan="4">

<table>


</table>
            </tr>

            <tr>

                <td class='text' style="width: 498px">

<table>

<tr><td> does applicant have a pacemaker or icd</td> <td><label><input type="radio" name="_does_applicant_have_a_pacemaker_or_icd" value="Yes" /> <? xl("Yes",'e') ?> </label> <label><input type="radio" name="_does_applicant_have_a_pacemaker_or_icd" value="NO" /> <? xl("NO",'e') ?> </label></td></tr>

</table>
                </td>

                <td class='text'>

<table>


</table>
            </tr>

            <tr>

                <td class='text' colspan="2">

<table>


</table>
            </tr>

        </table>

        <table width="100%">

            <tr>

                <td class='text' colspan="4">
                    <strong> <? xl("Pacemaker",'e') ?> </strong></td>
            </tr>

            <tr>

                <td class='text' style="width: 25%">

<table>

<tr><td> pacemaker brand</td> <td><input type="text" name="_pacemaker_brand"  /></td></tr>

</table>
                </td>

                <td class='text' style="width: 25%">

<table>

<tr><td> pacemaker model</td> <td><input type="text" name="_pacemaker_model"  /></td></tr>

</table>
                </td>

                <td class='text' colspan="2" style="width: 50%">

<table>


</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> pacemaker programmed to</td> <td><input type="text" name="_pacemaker_programmed_to"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> pacemaker mode</td> <td><input type="text" name="_pacemaker_mode"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> pacemaker lower rate</td> <td><input type="text" name="_pacemaker_lower_rate"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> pacemaker upper rate</td> <td><input type="text" name="_pacemaker_upper_rate"  /></td></tr>

</table>
                </td>
            </tr>

        </table>

        <table width="100%">

            <tr>

                <td class='text' colspan="6">
                    <strong> <? xl("ICD",'e') ?> </strong></td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> icd brand</td> <td><input type="text" name="_icd_brand"  /></td></tr>

</table>
                    </td>

                <td class='text'>

<table>

<tr><td> icd model</td> <td><input type="text" name="_icd_model"  /></td></tr>

</table>
                    </td>

                <td class='text'>

<table>

<tr><td>
<span class='text'><?php xl(' icd date of last interrogation (yyyy-mm-dd): ','e') ?></span>
</td><td>
<input type='text' size='10' name='_icd_date_of_last_interrogation' id='_icd_date_of_last_interrogation' onkeyup='datekeyup(this,mypcc)' onblur='dateblur(this,mypcc)' title='yyyy-mm-dd last date of this event' />
<img src='../../../interface/pic/show_calendar.gif' align='absbottom' width='24' height='22'
id='img__icd_date_of_last_interrogation' border='0' alt='[?]' style='cursor:pointer'
title='Click here to choose a date'>
<script>
Calendar.setup({inputField:'_icd_date_of_last_interrogation', ifFormat:'%Y-%m-%d', button:'img__icd_date_of_last_interrogation'});
</script>
</td></tr>

</table>
                    </td>
            </tr>

            <tr>

                <td class='text' colspan="3">

<table>

<tr><td> has icd discharged recently and how often</td> <td><input type="text" name="_has_icd_discharged_recently_and_how_often"  /></td></tr>

</table>
                </td>
            </tr>

        </table>

        <table width="100%">

            <tr>

                <td class='text' colspan="2">
                    <strong> <? xl("Cardiac Transplant Only",'e') ?> </strong></td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> date of transplant</td> <td><input type="text" name="_date_of_transplant"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> surgeon</td> <td><input type="text" name="_surgeon"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> name of center</td> <td><input type="text" name="_name_of_center"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> phone</td> <td><input type="text" name="_phone"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> evidence of rejection</td> <td><label><input type="radio" name="_evidence_of_rejection" value="Yes" /> <? xl("Yes",'e') ?> </label> <label><input type="radio" name="_evidence_of_rejection" value="NO" /> <? xl("NO",'e') ?> </label></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td>
<span class='text'><?php xl(' last cardiac biopsy date (yyyy-mm-dd): ','e') ?></span>
</td><td>
<input type='text' size='10' name='_last_cardiac_biopsy_date' id='_last_cardiac_biopsy_date' onkeyup='datekeyup(this,mypcc)' onblur='dateblur(this,mypcc)' title='yyyy-mm-dd last date of this event' />
<img src='../../../interface/pic/show_calendar.gif' align='absbottom' width='24' height='22'
id='img__last_cardiac_biopsy_date' border='0' alt='[?]' style='cursor:pointer'
title='Click here to choose a date'>
<script>
Calendar.setup({inputField:'_last_cardiac_biopsy_date', ifFormat:'%Y-%m-%d', button:'img__last_cardiac_biopsy_date'});
</script>
</td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text' colspan="2">

<table>

<tr><td> if evidence of rejection then type and grade</td> <td><textarea name="_if_evidence_of_rejection_then_type_and_grade"  rows="4" cols="40"></textarea></td></tr>

</table>
                </td>
            </tr>

        </table>

        <table width="100%">

            <tr>

                <td class='text' colspan="5">
                    <strong> <? xl("Physical Exam:",'e') ?> </strong></td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> height</td> <td><input type="text" name="_height"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> weight</td> <td><input type="text" name="_weight"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> heart rate</td> <td><input type="text" name="_heart_rate"  /></td></tr>

</table>
                </td>

                <td class='text' >

<table>

<tr><td> o2 saturation</td> <td><input type="text" name="_o2_saturation"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text' colspan="4">
                    Blood Pressures:</td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> bp ra</td> <td><input type="text" name="_bp_ra"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> bp la</td> <td><input type="text" name="_bp_la"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> bp rl</td> <td><input type="text" name="_bp_rl"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> bp ll</td> <td><input type="text" name="_bp_ll"  /></td></tr>

</table>
                </td>

               
            </tr>

            <tr>

                <td class='text' colspan="4">
                    Pulses:</td>
            </tr>

            <tr>

                <td class='text'>

<table>

<tr><td> pulses rue</td> <td><input type="text" name="_pulses_rue"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> pulses lue</td> <td><input type="text" name="_pulses_lue"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> pulses rle</td> <td><input type="text" name="_pulses_rle"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> pulses lle</td> <td><input type="text" name="_pulses_lle"  /></td></tr>

</table>
                </td>

                
            </tr>

            <tr>

                <td class='text' >

<table>

<tr><td> cardiovascular</td> <td><input type="text" name="_cardiovascular"  /></td></tr>

</table>
                </td>

                <td class='text' colspan="2">

<table>

<tr><td> precordial activity</td> <td><input type="text" name="_precordial_activity"  /></td></tr>

</table>
                </td>

                <td class='text'>

<table>

<tr><td> murmurs</td> <td><input type="text" name="_murmurs"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text' colspan="2">

<table>

<tr><td> neurological</td> <td><input type="text" name="_neurological"  /></td></tr>

</table>
                </td>

                <td class='text' colspan="2">

<table>

<tr><td> lungs</td> <td><input type="text" name="_lungs"  /></td></tr>

</table>
                </td>
            </tr>

            <tr>

                <td class='text' colspan="2" style="height: 21px">

<table>

<tr><td> abdomen</td> <td><input type="text" name="_abdomen"  /></td></tr>

</table>
                </td>

                <td class='text' colspan="2" style="height: 21px">

<table>

<tr><td> gi gu</td> <td><input type="text" name="_gi_gu"  /></td></tr>

</table>
                </td>
            </tr>

        </table>
<table></table><input type="submit" name="submit form" value="submit form" />
</form>
<a href='<?php echo $GLOBALS['webroot']?>/interface/patient_file/encounter/<?php echo $returnurl?>' onclick='top.restoreSession()'> <? xl("[do not save]",'e') ?> </a>
<?php
formFooter();
?>
