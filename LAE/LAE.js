/*	Author: ntoombs19, Ash
 *	Name: LA Enhancer 2
 *	Version: 2.0
 *	Client script: javascript:window.top.$.getScript('https://dl.dropboxusercontent.com/u/26362756/laEnhancer/test.js');void(0); */

/**********************************************************************
 *	Global variables
 */
var version = "2.10 Unofficial";
var quickChangedLog= "<ul><li>Introducing auto farming for A, B, C keys</li><li>Minor Bug fixes</li></ul>";
var scriptName = "LA Enhancer";
var scriptURL = "https://cdn.jsdelivr.net/gh/RazorBlue/RazorScripts/LAE/";
var updateNotesURL = "http://forum.tribalwars.net/showthread.php?266604-ntoombs19-s-FA-Filter&p=6785655&viewfull=1#post6785655";
var working = true;
var resourcesLoaded = false;
var scriptLoaded = false;
var pagesLoaded = false;
var filtersApplied = false;
var cansend = true;
var keySetMode = false;
var hideRow = false;
var editingKey = false;
var troubleshoot = false;
var clearProfiles = false;
var autorun = false;
var reason = [];
var keyToEdit;
var current_units;
var currentGameTime = getCurrentGameTime();
var sitter = "";
if (window.top.game_data.player.sitter != "0") {
	sitter = "t=" + window.top.game_data.player.id + "&";
}

var link = ["https://" + window.location.host + "/game.php?" + sitter + "village=", "&screen=am_farm"];
var userset;
var s = {
	start_page: 0,
	end_page: 1,
	order_by: 2,
	direction: 3,
	all_none: 4,
	blue: 5,
	green: 6,
	yellow: 7,
	red_yellow: 8,
	red_blue: 9,
	red: 10,
	hide_recent_farms: 11,
	sent_time_filter: 12,
	hide_recent_time: 13,
	enable_hauls: 14,
	full: 15,
	partial: 16,
	enable_attacks: 17,
	attack_operator: 18,
	attack_value: 19,
	enable_walls: 20,
	wall_operator: 21,
	wall_value: 22,
	enable_distances: 23,
	distance_operator: 24,
	distance_value: 25,
	enable_scout: 26,
	scout_report_operator: 27,
	haul_value: 28,
	continent_display: 29,
	continents_list: 30,
	enable_time: 31,
	attack_time_filter: 32,
	time_value: 33,
	enable_auto_run: 34,
	next_village_no_farms: 35,
	next_village_scouts: 36,
	scouts_left: 37,
	next_village_farming_troops: 38,
	farming_troops_left: 39,
	next_village_units: 40
};
var keycodes = {
	"a": 65,
	"b": 66,
	"c": 67,
	"skip": 83,
	"right": 39,
	"left": 37,
	"master": 77
};
var keyPressSettings = {
	"a_code": 65,
	"a_char": "A",
	"b_code": 66,
	"b_char": "B",
	"c_code": 67,
	"c_char": "C",
	"master_code": 77,
	"master_char": "M",
	"skip_code": 83,
	"skip_char": "S",
	"left_code": 37,
	"left_char": "â†",
	"right_code": 39,
	"right_char": "â†’",
	"priorityOneEnabled": true,
	"priorityOneProfile": "Default",
	"priorityOneButton": "Skip",
	"priorityTwoEnabled": true,
	"priorityTwoProfile": "Default",
	"priorityTwoButton": "Skip",
	"priorityThreeEnabled": true,
	"priorityThreeProfile": "Default",
	"priorityThreeButton": "Skip",
	"defaultButton": "Skip"
};
var availableLangs = ["en", "es", "el", "ar", "it"];

/**********************************************************************
 *	Init script
 */
// Enables caching of loaded javascript before loading resources

window.top.$.getScript(scriptURL + 'lib/jstorage.js',
	function() {
		window.top.$.getScript(scriptURL + "resources.js",

					function() {
						if (window.top.$.jStorage.get("language") == null) {
							setDefaultLanguage();
						}
						
						window.top.$.getScript(scriptURL + "lang/" + window.top.$.jStorage.get("language") + '.js', function() {
										checkPage();
									});
					}
		);
		
		window.top.$.getScript(scriptURL + 'notify.js');
	}
);


function run(){
	checkVersion();
	checkWorking();
	setVersion();
	makeItPretty();
	showSettings();
	turnOnHotkeys();
	hotkeysOnOff();
	if(userset[s.enable_auto_run] != false){
		applySettings();
	}
}

function checkVersion(){
	if (getVersion() != version) {
		buttons = [{
			text: 'OK',
			callback: null,
			confirm: true
		}];
		if(clearProfiles){
			var profileList = window.top.$.jStorage.get("profileList");
			window.top.$.each(profileList, function(i, val) {
				window.top.$.jStorage.deleteKey("profile:" + val);
			});
			window.top.$.jStorage.set("keyPressSettings",keyPressSettings);
			Dialog.show("update_dialog", "This script has recently been updated to version <span style='font-weight:bold;'>" + version + "</span> and in order for the new version to work, all profiles and settings must be reset. Sorry for any inconvenience.<br /><br/><a href='"+updateNotesURL+"' target='_blank'>See what's new</a>");
		}
		else{
			Dialog.show("update_dialog", "This script has recently been updated to version <span style='font-weight:bold;'>" + version + "</span><br/><br/>Unofficial Patches Channel Log:<br/>" + quickChangedLog + "<br/><br/><a href='"+updateNotesURL+"' target='_blank'>See what's new in official release changes</a>");
		}

	} else {
		//window.top.UI.SuccessMessage("Welcome to LA Enhancer", 1000);
	}
}

function checkWorking(){
	var acknowledged = window.top.$.jStorage.get("working");
	if(acknowledged == null){
		window.top.$.jStorage.set("working", false);
	}
	if (getVersion() != version) {
		window.top.$.jStorage.set("working", false);
	}
	if (working == false && acknowledged == false) {
		buttons = [{
			text: 'OK',
			callback: null,
			confirm: true
		}];
		window.top.UI.ConfirmationBox("An error has been discovered in this version. You may continue testing the script if you haven't noticed the error.", buttons, false, []);
		window.top.$.jStorage.set("working", true);
	}
}

function setVersion(){
	window.top.$.jStorage.set("version", version);
}

function getVersion(){
	var ver = window.top.$.jStorage.get("version");
	if(ver == undefined){
		setVersion();
		return version;
	}
	return ver;
}

/**********************************************************************
 *	 Auto page loading and settings creation
 */
function showAllRows() {
	var pages = window.top.$.trim(window.top.$('#plunder_list_nav tr:first td:last').children().last().html().replace(/\D+/g, ''));
	if (window.top.$('#end_page').val() == "max") {
		window.top.$('#end_page').text(pages);
	}
	window.top.$('#am_widget_Farm tr:last').remove();
	if (pages > parseInt(window.top.$('#end_page').val(), 10)) {
		pages = parseInt(window.top.$('#end_page').val(), 10);
	}
	setTimeout(function() {
		getPage((parseInt(window.top.$('#start_page').val(), 10) - 1), pages);
	}, 1);
}

function getPage(i, pages) {
	if (i < pages) {
		changeHeader(filter_41 + " " + (i + 1) + "/" + pages + " <img src='graphic/throbber.gif' height='24' width='24'></img>");
		var url = link[0] + window.top.game_data.village.id + "&order=" + userset[s.order_by] + "&dir=" + userset[s.direction] + "&Farm_page=" + i + "&screen=am_farm";
		window.top.$.ajax({
			type: 'GET',
			url: url,
			dataType: "html",
			error: function(xhr, statusText, error){
				console.log("Get page failed with error: " + error);
			},
			success: function(data){
				/*console.log(window.top.$(data));*/
				window.top.$('#plunder_list tr', data).slice(1).each(function() {
					window.top.$('#plunder_list tr:last').after("<tr>" + window.top.$(this).html() + "</tr>");
				});
				setTimeout(function(){
					getPage(i + 1, pages);
				}, 1);
			}
		});
	} else {
		setTimeout(function() {
			addTableInfo();
			applyFilters();
			changeHeader(filter_40);
			highlightRows();
		}, 1);
		window.top.$('#plunder_list').show();
		window.top.Accountmanager.initTooltips();
		pagesLoaded = true;
		cansend = true;
	}
}

function changeHeader(string) {
	window.top.$("h3:first").html(string);
}

function highlightRows() {
	window.top.$('#am_widget_Farm table').each(function() {
		window.top.$('tr:even:gt(0) td', this).not("table:first").css("backgroundColor", "#FFF5DA");
		window.top.$('tr:odd:gt(0) td', this).not("table:first").css("backgroundColor", "#F0E2BE");
	});
}

function getNewVillage(way) {
	if(way == "n")
		window.top.UI.InfoMessage('Switching to next village...', 500);
	else
		window.top.UI.InfoMessage('Switching to previous village...', 500);
	window.onkeydown = function(){};
	cansend = false;
	filtersApplied = false;
	Timing.pause();
	fadeThanksToCheese();
	openLoader();
	var vlink = link[0] + way + window.top.game_data.village.id + link[1];
	window.top.$.ajax({
		type: "GET",
		url: vlink,
		dataType: "html",
		error: function(xhr, statusText) {
			alert("Error: " + statusText);
			window.top.$('#fader').remove();
			window.top.$('#loaders').remove();
		},
		success: function(data) {
			var v = window.top.$(data);
			var titlePat = /<\s*title\s*>([^<]+)<\/title\s*>/g;
			var titleMatch = titlePat.exec(data);
			var title = titleMatch[1];
			var newGameData = window.top.$.parseJSON(data.split("TribalWars.updateGameData(")[1].split(");")[0]); /* parse out the new game data */
			/* TribalWars.updateGameData(newGameData); */ /* update the data - using a different method for now because Inno's funct errors */
			window.top.game_data = newGameData;
			if(typeof history !== 'undefined' && typeof history.pushState === 'function'){ history.pushState({}, window.top.game_data.village.name + " - Loot Assistant","https://"+window.top.location.host+game_data.link_base_pure+'am_farm'); }
			window.top.$('#header_info').html(window.top.$('#header_info', v).html());
			window.top.$('#topContainer').html(window.top.$('#topContainer', v).html());
			window.top.$('#contentContainer').html(window.top.$('#contentContainer', v).html());
			window.top.$('#quickbar_inner').html(window.top.$('#quickbar_inner', v).html());
			window.top.$('head').find('title').html(title);
			window.top.$('#fader').remove();
			window.top.$('#loaders').remove();
			Timing.resetTickHandlers();
			Timing.pause();
			pagesLoaded = false;
			cansend = false;
			run();
		}
	});
}
/*
 function getNewVillage(way){
 if(way == "n")
 window.top.UI.InfoMessage('Switching to next village...', 500);
 else
 window.top.UI.InfoMessage('Switching to previous village...', 500);
 window.onkeydown = function(){};
 cansend = false;
 filtersApplied = false;
 Timing.pause();
 var vlink = link[0] + way + window.top.game_data.village.id + link[1];
 window.location = vlink;
 }
 */

function showSettings(){
	//window.top.$('#plunder_list').hide();
	//window.top.$('#plunder_list_nav').hide();
	window.top.$('head').append("<link type='text/css' rel='stylesheet' href='" + scriptURL +"css/style.css' />");
	window.top.$("#contentContainer h3").eq(0).after(window.top.$("<div class='vis'id='settingsDiv'><table class='settingsTable'><thead><tr><th colspan='5'class='vis'style='padding:0px;'><h4>" + filter_01 + " " + version + " - <a href='http://forum.tribalwars.net/showthread.php?266604-ntoombs19-s-FA-Filter'target='_blank'>" + filter_02 + "</a> - " + filter_42 + ": <select id='language'style='margin:0px;'onchange='loadLanguage(window.top.$(&quot;#language&quot;).val())'></select><span style='font-size:10px;float:right;font-weight:normal;font-style:normal'>" + filter_03 + " <a href='http://forum.tribalwars.net/member.php?22739-ntoombs19'target='_blank'>ntoombs19</a>&nbsp;<div class='vis'style='float:right;text-align:center;line-height:100%;width:12px;height:12px;margin:0px 0px 0px 0px;position:relative;background-color:tan;opacity:.7'><a href='#'num='2'onclick='uglyHider(window.top.$(this));return false;'>-</a></div></span></h4></th></tr></thead><tbody id='settingsBody'><tr><td class='col1'style='min-width:200px'><span>" + filter_04 + "</span>&nbsp;<input type='text'value=''size='2'maxlength='3'id='start_page'>&nbsp;<span>" + filter_05 + "</span>&nbsp;<input type='text'value=''size='2'maxlength='3'id='end_page'></td><td colspan='3'><span style='font-weight:bold'>" + filter_06 + "</span>&nbsp;<img src='graphic/questionmark.png'width='13'height='13'id='enable_help'></td><td rowspan='5'valign='top'><form><input type='checkbox'id='all_none'>&nbsp;<label for='all_none'style='font-weight:bold'>" + filter_07 + "</label>&nbsp;<img src='graphic/questionmark.png'width='13'height='13'id='report_help'><br><input type='checkbox'id='blue'><label for='blue'><img src='graphic/dots/blue.png'>&nbsp;" + filter_08 + "</label><br><input type='checkbox'id='green'><label for='green'><img src='graphic/dots/green.png'>&nbsp;" + filter_09 + "</label><br><input type='checkbox'id='yellow'><label for='yellow'><img src='graphic/dots/yellow.png'>&nbsp;" + filter_10 + "</label><br><input type='checkbox'id='red_yellow'><label for='red_yellow'><img src='graphic/dots/red_yellow.png'>&nbsp;" + filter_11 + "</label><br><input type='checkbox'id='red_blue'><label for='red_blue'><img src='graphic/dots/red_blue.png'>&nbsp;" + filter_12 + "</label><br><input type='checkbox'id='red'><label for='red'><img src='graphic/dots/red.png'>&nbsp;" + filter_13 + "</label></form></td></tr><tr><td rowspan='2'><label for='order_by'>" + filter_14 + ":</label>&nbsp;<select id='order_by'val='distance'><option value='distance'>" + filter_15 + "</option><option value='date'>" + filter_16 + "</option></select><br><label for='direction'>" + filter_17 + ":</label>&nbsp;<select id='direction'val='desc'><option value='asc'>" + filter_18 + "</option><option value='desc'>" + filter_19 + "</option></select></td><td style='width:26px'><input type='checkbox'id='enable_hauls'></td><td style='width:110px'><label for='enable_hauls'>" + filter_20 + "</label></td><td><input type='radio'name='hauls'id='full'><label for='full'><img src='graphic/max_loot/1.png'>" + filter_21 + "</label>&nbsp;<input type='radio'name='hauls'id='partial'><label for='partial'><img src='graphic/max_loot/0.png'>" + filter_22 + "</label></td></tr><tr><td><input type='checkbox'id='enable_attacks'></td><td><label for='enable_attacks'>" + filter_23 + "</label></td><td><select id='attack_operator'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='attack_value'size='2'maxlength='2'value=''></td></tr><tr><td rowspan='1'><span style='font-weight:bold;'>" + filter_43 + "</span></td><td><input type='checkbox'id='enable_walls'></td><td><label for='enable_walls'>" + filter_30 + "</label></td><td><select id='wall_operator'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='wall_value'size='2'maxlength='2'value=''></td></tr><tr><td><input type='checkbox'id='next_village_no_farms'><label for='next_village_no_farms'>" + filter_39 + "</label></td><td><input type='checkbox'id='enable_distances'></td><td><label for='enable_distances'>" + filter_31 + "</label></td><td><select id='distance_operator'val='greater_than'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='distance_value'size='2'maxlength='2'value=''></td></tr><tr><td><input type='checkbox' id='next_village_units' />" + filter_44 + "</td><td><input type='checkbox' id='enable_continents' /><td colspan='3'><select id='continent_display'><option value='hide'>" + filter_32 + "</option><option value='show'>" + filter_33 + "</option></select>&nbsp;<label for='continents_list'>" + filter_34 + "</label>&nbsp;<input type='text'size='2'maxlength='150'id='continents_list'value=''>&nbsp;<img src='graphic/questionmark.png'height='13'id='continent_help'></td></tr><tr><td><input type='checkbox' id='next_village_scouts' /><input type='text' size='2' id='scouts_left' /> " + filter_45 + "</td><td><input type='checkbox'id='enable_scout'></td><td colspan='3'><label for='enable_scout'>" + filter_35 + "</label>&nbsp;<select id='scout_report_operator'val='greater_than'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='haul_value'size='9'maxlength='7'value=''></td></tr><tr><td><input type='checkbox' id='next_village_farming_troops' /><input type='text' size='2' id='farming_troops_left' /> " + filter_46 + "</td><td><input type='checkbox'id='enable_time'></td><td colspan='3'><select id='attack_time_filter'val='hide'><option value='hide'>" + filter_32 + "</option><option value='show'>" + filter_33 + "</option></select>&nbsp;<label for='enable_time'>" + filter_36 + "</label>&nbsp;<input type='text'id='time_value'size='2'maxlength='4'value=''><span>" + filter_37 + "</span></td></tr><tr><td><input type='checkbox'id='enable_auto_run'><label for='enable_autoRun'>" + filter_38 + "</label></td><td><input type='checkbox' id='hide_recent_farms' /></td><td colspan='3'><select id='sent_time_filter'val='hide'><option value='hide'>" + filter_32 + "</option><option value='show'>" + filter_33 + "</option></select>&nbsp;" + filter_47 + " <input type='text' size='2' id='hide_recent_time' /> " + filter_48 + "</td></tr><tr><th>" + filter_49 + "</th><th colspan='4'>" + filter_50 + "</th></tr><tr><td rowspan='4'><table><tr class='hotkey_values'><td><a href='#'onclick='return setKeyEditMode(\"A\")'id='button_a'class='farm_icon farm_icon_a'></a></td><td><a href='#'onclick='return setKeyEditMode(\"B\")'id='button_b'class='farm_icon farm_icon_b'></a></td><td><a href='#'onclick='return setKeyEditMode(\"C\")'id='button_c'class='farm_icon farm_icon_c'></a></td><td><a href='#'onclick='return setKeyEditMode(\"Master\")'id='button_master'class='farm_icon farm_icon_m'></a></td></tr><tr class='hotkey_values'><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_a'value='A'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_b'value='B'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_c'value='C'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_master'value='M'></td></tr><tr class='hotkey_values'><td colspan='2'><input class='btn tooltip'onclick='return setKeyEditMode(\"Skip\")'type='button'value='Skip'style='margin:0px 0px 0px 0px'title='" + filter_51 + "'></td><td><input class='btn tooltip'onclick='return setKeyEditMode(\"Left\")'type='button'value='â‡š'style='margin:0px 0px 0px 0px'title='" + filter_52 + "'></td><td><input class='btn tooltip'type='button'onclick='return setKeyEditMode(\"Right\")'value='â‡›'style='margin:0px 0px 0px 0px'title='" + filter_53 + "'></td></tr><tr class='hotkey_values'><td colspan='2'><input type='text'class='hotkey_value' READONLY id='hotkey_value_skip'value='S'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_left'value='&#8592;'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_right'value='&#8594;'></td></tr></table></td><td><input type='checkbox' onchange='return updateKeypressSettings();' id='priorityOneEnabled'/></td><td colspan='3'>" + filter_54 + " <select id='priorityOneProfile' onchange='return updateKeypressSettings();'></select> " + filter_55 + " <select id='priorityOneButton' onchange='return updateKeypressSettings();'><option val='" + filter_56 + "'>" + filter_56 + "</option><option val='" + filter_57 + "'>" + filter_57 + "</option><option val='" + filter_58 + "'>" + filter_58 + "</option><option val='" + filter_59 + "'>" + filter_59 + "</option></select></td></tr><tr><td><input type='checkbox' onchange='return updateKeypressSettings();' id='priorityTwoEnabled'/></td><td colspan='3'>" + filter_54 + " <select id='priorityTwoProfile' onchange='return updateKeypressSettings();'></select> " + filter_55 + " <select id='priorityTwoButton' onchange='return updateKeypressSettings();'><option val='" + filter_56 + "'>" + filter_56 + "</option><option val='" + filter_57 + "'>" + filter_57 + "</option><option val='" + filter_58 + "'>" + filter_58 + "</option><option val='" + filter_59 + "'>" + filter_59 + "</option></select></td></tr><tr><td><input type='checkbox' onchange='return updateKeypressSettings();' id='priorityThreeEnabled'/></td><td colspan='3'>" + filter_54 + " <select id='priorityThreeProfile' onchange='return updateKeypressSettings();'></select> " + filter_55 + " <select id='priorityThreeButton' onchange='return updateKeypressSettings();'><option val='" + filter_56 + "'>" + filter_56 + "</option><option val='" + filter_57 + "'>" + filter_57 + "</option><option val='" + filter_58 + "'>" + filter_58 + "</option><option val='" + filter_59 + "'>" + filter_59 + "</option></select></td></tr><tr><td colspan='4'>" + filter_60 + " <select id='defaultButton' onchange='return updateKeypressSettings();'><option val='" + filter_56 + "'>" + filter_56 + "</option><option val='" + filter_57 + "'>" + filter_57 + "</option><option val='" + filter_58 + "'>" + filter_58 + "</option><option val='" + filter_59 + "'>" + filter_59 + "</option></select></td></tr><tr><td colspan='5'><div style='float:left'><input type='submit'value='" + profile_02 + "'onclick='applySettings()'>&nbsp;<input type='submit'value='" + profile_03 + "'onclick='resetTable()'></div><div style='float:right'><img src='graphic/questionmark.png'width='13'height='13'id='profile_help'>&nbsp;<label for='settingsProfile'>" + profile_01 + ":</label>&nbsp;<select id='settingsProfile'onchange='changeProfile(window.top.$(&quot;#settingsProfile&quot;).val())'></select>&nbsp;<input type='submit'value='" + profile_04 + "'onclick='createProfile()'>&nbsp;<input type='submit'value='" + profile_05 + "'onclick='setDefaultProfile()'>&nbsp;<input type='submit'value='" + profile_06 + "'onclick='deleteProfile()'>&nbsp;<input type='submit'value='" + profile_07 + "'onclick='updateProfile()'>&nbsp;<input type='submit'value='" + profile_08 + "'onclick='exportProfile()'>&nbsp;<input type='submit'value='" + profile_09 + "'onclick='importProfile()'></div></td></tr><tr> <td colspan='5'> <div style='float:left'><input type='submit' value='AutoA' onclick='autoFarm(keyPressSettings.a_code)'> <input type='submit'value='AutoB' onclick='autoFarm(keyPressSettings.b_code)'> <input type='submit'value='AutoC' onclick='autoFarm(keyPressSettings.c_code)'> <input type='submit'value='Stop' onclick='autoStop()'></div> </td> </tr></tbody></table></div>"));
	formatSettings();
	addLanguages();
	window.top.$("#language option[value='" + window.top.$.jStorage.get("language") + "']").attr("selected", "selected");
}

function formatSettings() {
	window.top.$("#all_none").bind("click", function() {
		window.top.$(this).closest('form').find(':checkbox').prop('checked', this.checked);
	});
	// report instructions
	var reportHelp = window.top.$('#report_help');
	reportHelp.attr('title', instructions_01);
	window.top.UI.ToolTip(reportHelp);
	// enable instrunctions
	var enableHelp = window.top.$('#enable_help');
	enableHelp.attr('title', instructions_02);
	window.top.UI.ToolTip(enableHelp);
	// continent instrunctions
	var continentHelp = window.top.$('#continent_help');
	continentHelp.attr('title', instructions_03);
	window.top.UI.ToolTip(continentHelp);
	// recent instrunctions
	var recentHelp = window.top.$('#recent_help');
	recentHelp.attr('title', instructions_04);
	window.top.UI.ToolTip(recentHelp);
	// profile instrunctions
	var profileHelp = window.top.$('#profile_help');
	profileHelp.attr('title', instructions_05);
	window.top.UI.ToolTip(profileHelp);
	loadDefaultProfile();
	fillProfileList();
	fillMasterSettings();
	fillKeypressSettings();
}

function autoFarm(code) {
	var i = 0;
	autorun = true;

	function f() {
		$('#am_widget_Farm').trigger(jQuery.Event('keydown', {
			keyCode: code,
			which: code
		}));
		i++;
		if (i > -1 && autorun == 1) {
			setTimeout(f, 200);
		}
	}
	f();
}

function autoStop() {
	autorun = false;
	return
}

function removeFirstPage() {
	window.top.$('#plunder_list tr:gt(0)').remove();
	window.top.$('#plunder_list_nav').hide();
}

/**********************************************************************
 *	 Table formatting
 */
function customSendUnits(link, target_village, template_id, button) {
	if(!checkIfNextVillage()){
		button.closest("tr").hide();
		link = window.top.$(link);
		if (link.hasClass('farm_icon_disabled')) return false;

		var data = {
			target: target_village,
			template_id: template_id,
			source: window.top.game_data.village.id
		};
		window.top.$.post(window.top.Accountmanager.send_units_link, data, function (data) {
			if (data.error) {
				if(userset[s.next_village_units] && data.error === "Not enough units available"){
					if(cansend && filtersApplied)
						getNewVillage("n");
					return false;
				} else {
					window.top.UI.ErrorMessage(data.error);
					button.closest("tr").show();
				}
			} else {
				setLocalStorageRow(target_village);
				//window.top.$('.farm_village_' + target_village).addClass('farm_icon_disabled');
				if (typeof window.top.$(button).prop('tooltipText') != 'undefined') {
					var buttext = window.top.$(button).prop('tooltipText');
				}
				var yolo = window.top.$('<div></div>').append(window.top.$(buttext));
				var bolo = window.top.$(yolo).find('img[src*="res.png"]').eq(0).attr('src');
				var sep1 = buttext.split(/<br\s*?\/?>/ig);
				sep1.splice(sep1.length - 2, 1);
				window.top.UI.SuccessMessage(sep1.join(" "), 100);
				window.top.Accountmanager.farm.updateOwnUnitsAvailable(data.current_units);
			}
		}, 'json');
		return false
	}
}

function customSendUnitsFromReport(link, target_village, report_id, button) {
	if(!checkIfNextVillage()){
		button.closest("tr").hide();
		link = window.top.$(link);
		if (link.hasClass('farm_icon_disabled')) return false;
		var data = {
			report_id: report_id
		};
		window.top.$.post(window.top.Accountmanager.send_units_link_from_report, data, function (data) {
			if (data.error) {
				if(userset[s.next_village_units] && data.error === "Not enough units available"){
					if(cansend && filtersApplied)
						getNewVillage("n");
					return false;
				} else {
					window.top.UI.ErrorMessage(data.error);
					button.closest("tr").show();
				}
			} else {
				setLocalStorageRow(target_village);
				if (typeof data.success === 'string') {
					if (typeof window.top.$(button).prop('tooltipText') != 'undefined') {
						var buttext = window.top.$(button).prop('tooltipText');
					}
					var yolo = window.top.$('<div></div>').append(window.top.$(buttext));
					var bolo = window.top.$(yolo).find('img[src*="res.png"]').eq(0).attr('src');
					var sep1 = buttext.split(/<br\s*?\/?>/ig);
					sep1.splice(sep1.length - 2, 1);
					window.top.UI.SuccessMessage(sep1.join(" "), 100);
					window.top.Accountmanager.farm.updateOwnUnitsAvailable(data.current_units);
				};
				//window.top.$('.report_' + target_village + ' .farm_icon').addClass('farm_icon_disabled')
			}
		}, 'json');
		return false
	}
}

function setOnclick(button){
	var clickFunction = button.find('a').attr('onclick');
	if(typeof clickFunction != 'undefined'){
		var parameters = clickFunction.slice(clickFunction.indexOf("(")+1,clickFunction.indexOf(")"));
		var eachParameter = parameters.split(",");
		if(clickFunction.indexOf("FromReport") == -1){
			button.find('a').attr('onclick', 'return customSendUnits('+parameters+', window.top.$(this))');
		}
		else{
			button.find('a').attr('onclick', 'return customSendUnitsFromReport('+parameters+'))');
		}
		button.closest('tr').attr('name', window.top.$.trim(eachParameter[1]));
	}
}

function addTableInfo(){
	window.top.$('#am_widget_Farm tr th').slice(0,1).after("<th></th>");
	window.top.$('#am_widget_Farm tr:not(:first-child)').each(function(i){
		window.top.$(this).children("td").each(function(j) {
			switch(j){
				case 1:
					window.top.$(this).filter(":first").before("<td style='width:10px;font-weight:bold;' id='rowNum'>"+(i+1)+"</td>")
					break;
				case 3:
					var attackImg = window.top.$(this).find('img');
					var tooltip= window.top.$(this).find('img').prop('tooltipText');
					if(typeof tooltip != 'undefined'){
						var numAttacks = tooltip.replace(/\D/g, '');
						attackImg.after("<span style='font-weight:bold;'> ("+numAttacks+")</span>");
					}
					break;
				case 8:
					setOnclick(window.top.$(this));
					break;
				case 9:
					setOnclick(window.top.$(this));
					break;
				case 10:
					setOnclick(window.top.$(this));
					break;
			}
		});
	});
}

function checkIfNextVillage(){
	current_units = window.top.Accountmanager.farm.current_units;
	if(userset[s.next_village_scouts]){
		var scouts = current_units.spy;
		if(scouts <= parseInt(userset[s.scouts_left])){
			getNewVillage("n");
			return true;
		}
	}
	if(userset[s.next_village_farming_troops]){
		var totalTroops = 0;
		window.top.$('.fm_unit input:checked').each(function(i){
			var unitName = window.top.$(this).attr('name');
			totalTroops += parseInt(current_units[unitName]);
		});
		if(totalTroops <= parseInt(userset[s.farming_troops_left])){
			getNewVillage("n");
			return true;
		}
	}
	if(userset[s.next_village_no_farms]){
		//if(window.top.$('#plunder_list tr:not(:first-child):visible').length == 0){
		//	getNewVillage("n");
		//	return true;
		//}
		//
		if($("#plunder_list tr").filter(":visible").filter(function(){return this.innerHTML.indexOf('td')>-1}).length == 0){
			getNewVillage('n');
			return !0;
		}
	}
}

/**********************************************************************
 *	Filtering table with settings
 */
function applySettings(){
	if(!pagesLoaded){
		setTimeout(showAllRows(), 1);
		removeFirstPage();
	}
	else{
		applyFilters();
	}
}

function applyFilters(){
	window.top.$('#am_widget_Farm tr:gt(0)').each(function(i) {
		hideRow = checkRowToHide(window.top.$(this), userset);
		if(hideRow){
			window.top.$(this).hide();
		}
	});
	changeHeader(filter_40);
	var topContainer = 0;
	if(window.top.$('#topContainer').css('position') == "fixed"){
		topContainer = window.top.$('#topContainer').height();
	}
	if(window.top.$('*:contains("Bot Protection")').length){
		window.top.$('html, body').animate({ scrollTop: (window.top.$('*:contains("Bot Protection")').offset().top - topContainer)},500);
		if(typeof showNotification === 'function') {showNotification('custom', ['LA Enhancer has encountered bot protection. Please respond to captcha to continue farming.'], null, 'Bot Protection');}
		cansend = false;
	}else{
		window.top.$('html, body').animate({ scrollTop: (window.top.$('#farm_units').offset().top - topContainer)},500);
	}
	filtersApplied = true;
}

function checkRowToHide(row, profileArray){
	hideRow = false;
	row.children("td").each(function(cell){
		switch (cell) {
			case 2:
				reportSettings(window.top.$(this), profileArray);
				break;
			case 3:
				haulSettings(window.top.$(this), profileArray);
				break;
			case 4:
				hideRecentlyFarmed(window.top.$(this), profileArray);
				attackSettings(window.top.$(this), profileArray);
				continentSettings(window.top.$(this), profileArray);
				break;
			case 5:
				hideTime(window.top.$(this), profileArray);
				break;
			case 6:
				scoutReportSettings(window.top.$(this), profileArray);
				break;
			case 7:
				wallSettings(window.top.$(this), profileArray);
				break;
			case 8:
				distanceSettings(window.top.$(this), profileArray);
				break;
		}
	});
	if(hideRow){
		if(troubleshoot)
			console.log(row.find("#rowNum").html() + ": (" + reason.join(',') + ")");
		reason = [];
		return true;
	}
	return false;
}

function resetTable(){
	window.top.$('#plunder_list tr').each(function(i) {
		window.top.$(this).show()
	});
}

function setLocalStorageRow(village){
	var localTitle = "sitter:"+sitter+", village:"+village+", world:"+getURL()[0];
	window.top.$.jStorage.set(localTitle, getCurrentGameTime());
}

/**********************************************************************
 *	Settings logic
 */
function reportSettings(cell, profileArray){
	if (cell.html().indexOf("blue") >= 0 && profileArray[s.blue]){
		reason.push("Report is blue");
		hideRow = true;
		return;
	}
	if (cell.html().indexOf("green") >= 0 && profileArray[s.green]){
		reason.push("Report is green");
		hideRow = true;
		return;
	}
	if (cell.html().indexOf("yellow") >= 0 && profileArray[s.yellow]){
		reason.push("Report is yellow");
		hideRow = true;
		return;
	}
	if (cell.html().indexOf("red_yellow") >= 0 && profileArray[s.red_yellow]){
		reason.push("Report is red_yellow");
		hideRow = true;
		return;
	}
	if (cell.html().indexOf("red_blue") >= 0 && profileArray[s.red_blue]){
		reason.push("Report is red_blue");
		hideRow = true;
		return;
	}
	if (cell.html().indexOf("red") >= 0 && profileArray[s.red]){
		reason.push("Report is red");
		hideRow = true;
		return;
	}
}

function haulSettings(cell, profileArray){
	if(profileArray[s.enable_hauls]){
		// Hides full hauls
		if (cell.html().indexOf("max_loot/1") >= 0 && profileArray[s.full]){
			reason.push("Haul is full");
			hideRow = true;
			return;
		}
		// Hides partial hauls
		if (cell.html().indexOf("max_loot/0") >= 0 && profileArray[s.partial]){
			reason.push("Haul is partial");
			hideRow = true;
			return;
		}
		// Hides scout reports
		if (cell.html().indexOf("max_loot") == -1 && (profileArray[s.full])){
			reason.push("No haul graphic");
			hideRow = true;
			return;
		}
	}
}

function hideRecentlyFarmed(cell, profileArray){
	if(profileArray[s.hide_recent_farms]){
		var village = cell.closest('tr').attr('name');
		localTitle = "sitter:"+sitter+", village:"+village+", world:"+getURL()[0];
		var sentTime = new Date(window.top.$.jStorage.get(localTitle));
		var t1 = currentGameTime;
		var t2 = sentTime;
		var dif = t1.getTime() - t2.getTime();
		var minutesBetween = Math.abs(parseInt(dif/1000/60));
		switch(profileArray[s.sent_time_filter]){
			case "hide":
				if(minutesBetween < parseInt(profileArray[s.hide_recent_time])){
					reason.push("Village was recently sent to " + minutesBetween + " minutes ago");
					hideRow = true;
					return;
				}
				break;
			case "show":
				if(minutesBetween > parseInt(profileArray[s.hide_recent_time])){
					reason.push("Village was not recently sent to");
					hideRow = true;
					return;
				}
				break;
		}
	}
}

function attackSettings(cell, profileArray){
	var numAttacks;
	var attackImg = cell.find('img');
	if(typeof attackImg.prop('tooltipText') != 'undefined'){
		numAttacks = parseInt(attackImg.prop('tooltipText').replace(/\D/g, ''));
	}
	else{
		numAttacks = 0;
	}
	if(profileArray[s.enable_attacks]){
		switch (profileArray[s.attack_operator]) {
			case "greater_than":
				if(numAttacks > parseInt(profileArray[s.attack_value])){
					reason.push("Outgoing attacks is too many");
					hideRow = true;
					return;
				}
				break;
			case "less_than":
				if(numAttacks < parseInt(profileArray[s.attack_value])){
					reason.push("Outgoing attacks is too few");
					hideRow = true;
					return;
				}
				break;
			case "equal_to":
				if(numAttacks == parseInt(profileArray[s.attack_value])){
					reason.push("Outgoing attacks is equal");
					hideRow = true;
					return;
				}
				break;
		}
	}
}

function continentSettings(cell, profileArray){
	var continent = cell.find('a').html();
	if(typeof continent != 'undefined'){
		continent = continent.substr(continent.length - 2);
		var filteredContinents = profileArray[s.continents_list].split('.');
		if(window.top.$.inArray(continent, filteredContinents) >= 0 && profileArray[s.continent_display] == "hide"){
			reason.push("Continent is set to hide");
			hideRow = true;
			return;
		}
		if(window.top.$.inArray(continent, filteredContinents) == -1 && profileArray[s.continent_display] == "show"){
			reason.push("Continent is not set to show");
			hideRow = true;
			return;
		}
	}
}

function hideTime(cell, profileArray){
	if(profileArray[s.enable_time]){
		var t1 = currentGameTime;
		var t2 = getVillageAttackedTime(cell);
		var dif = t1.getTime() - t2.getTime();
		var minutesBetween = Math.abs(parseInt(dif/1000/60));
		switch (profileArray[s.attack_time_filter]) {
			case "hide":
				if(minutesBetween < parseInt(profileArray[s.time_value])){
					reason.push("Village attacked "+ minutesBetween +" minutes ago.");
					hideRow = true;
					return;
				}
				break;
			case "show":
				if(minutesBetween > parseInt(profileArray[s.time_value])){
					reason.push("Village attacked "+ minutesBetween +" minutes ago.");
					hideRow = true;
					return;
				}
				break;
		}
	}
}

function scoutReportSettings(cell, profileArray){
	var total;
	if(profileArray[s.enable_scout]){
		if(window.top.$.trim(cell.find('span').html()) == "?"){
			total = 0;
		}
		else{
			var wood = parseInt(cell.children('span').eq(0).html().replace(/\D+/g, ''));
			var clay = parseInt(cell.children('span').eq(1).html().replace(/\D+/g, ''));
			var iron = parseInt(cell.children('span').eq(2).html().replace(/\D+/g, ''));
			total = wood+clay+iron;
		}

		switch (profileArray[s.scout_report_operator]) {
			case "greater_than":
				if(total > parseInt(profileArray[s.haul_value])){
					reason.push("Too many resources");
					hideRow = true;
					return;
				}
				break;
			case "less_than":
				if(total < parseInt(profileArray[s.haul_value])){
					reason.push("Not enough resources");
					hideRow = true;
					return;
				}
				break;
			case "equal_to":
				if(total == parseInt(profileArray[s.haul_value])){
					reason.push("Exact resources");
					hideRow = true;
					return;
				}
				break;
		}
	}
}

function wallSettings(cell, profileArray){
	if(profileArray[s.enable_walls]){
		var wallLvl = parseInt(cell.html());
		if(wallLvl == '?'){
			wallLvl = 0;
		}
		switch (window.top.$.trim(profileArray[s.wall_operator])) {
			case "greater_than":
				if(wallLvl > parseInt(profileArray[s.wall_value])){
					reason.push("Wall too high");
					hideRow = true;
					return;
				}
				break;
			case "less_than":
				if(wallLvl < parseInt(profileArray[s.wall_value])){
					reason.push("Wall too low");
					hideRow = true;
					return;
				}
				break;
			case "equal_to":
				if(wallLvl == parseInt(profileArray[s.wall_value])){
					reason.push("Wall is exact");
					hideRow = true;
					return;
				}
				break;
		}
	}
}

function distanceSettings(cell, profileArray){
	if(profileArray[s.enable_distances]){
		var distanceLvl = cell.html();
		switch (window.top.$.trim(profileArray[s.distance_operator])) {
			case "greater_than":
				if(parseFloat(distanceLvl) > parseFloat(profileArray[s.distance_value])){
					reason.push("Village too far");
					hideRow = true;
					return;
				}
				break;
			case "less_than":
				if(parseFloat(distanceLvl) < parseFloat(profileArray[s.distance_value])){
					reason.push("Village too close");
					hideRow = true;
					return;
				}
				break;
			case "equal_to":
				if(parseFloat(distanceLvl) == parseFloat(profileArray[s.distance_value])){
					reason.push("Village exact distance");
					hideRow = true;
					return;
				}
				break;
		}
	}
}

//deletes local storage for recently farmed rows
function deleteRecentlyFarmed(){
	window.top.$('#am_widget_Farm tr:gt(0)').each(function(i) {
		window.top.$(this).children("td").each(function(j){
			if(j == 4){
				reportLinkText = window.top.$.trim(window.top.$(this).children("a").html());
				localTitle = "sitter:"+sitter+", village:"+reportLinkText+", world:"+getURL()[0];
				if(window.top.$.jStorage.get(localTitle) != null){
					window.top.$.jStorage.deleteKey(localTitle);
				}
			}
		});
	});
}

//gets game time to compare to reports
function getCurrentGameTime(){
	var serverTime = window.top.$('#serverTime').html().split(':');
	var serverDate = window.top.$('#serverDate').html().split('/');
	return new Date(serverDate[2], serverDate[1]-1, serverDate[0], serverTime[0], serverTime[1], serverTime[2], 0);
}

//helper function for time filters
function getVillageAttackedTime(cell){
	var time = cell.html();
	var cellTime = time.split(' ');
	var attackDay;
	var attackTime;
	var cell;
	for (var i = 0; i < cellTime.length; i++){
		cell = window.top.$.trim(cellTime[i]);
		if(cell.indexOf('.') > -1){
			attackDay = cell;
		} else if (cell == filter_61){
			attackDay = filter_61;
		} else if (cell == filter_62){
			attackDay = filter_62;
		}
		if(cell.indexOf(':') > -1){
			attackTime = cell;
		}
	}
	if(attackDay == filter_61 || attackDay == filter_62){
		var day = currentGameTime.getDate();
		if(attackDay == filter_62)
			day--;
		var month = currentGameTime.getMonth();
		var year = currentGameTime.getFullYear();
		var time = attackTime.split(':');
		var hours = time[0];
		var minutes = time[1];
		var seconds = time[2];
		return new Date(year, month, day, hours, minutes, seconds, 0);
	}
	else{
		var cellDay = attackDay.split('.');
		var day = cellDay[0];
		var month = cellDay[1]-1;
		if(currentGameTime.getMonth() == 0 && month == 11)
			var year = currentGameTime.getFullYear()-1;
		else
			var year = currentGameTime.getFullYear();
		var time = attackTime.split(':');
		var hours = time[0];
		var minutes = time[1];
		var seconds = time[2];
		return new Date(year, month, day, hours, minutes, seconds, 0);
	}
}

/**********************************************************************
 *	Settings profiles functionality
 */
function loadDefaultProfile() {
	if (window.top.$.jStorage.get("profile:" + profile_10) == null) {
		window.top.$.jStorage.set("profile:" + profile_10, ["1", "1", "distance", "asc", false, false, false, false, false, false, false, false, "hide", "", false, false, false, false, "greater_than", "", false, "greater_than", "", false, "greater_than", "", false, "greater_than", "", "hide", "", false, "hide", "", false, false, false, "", false, "", false]);
		window.top.$.jStorage.deleteKey("profileList");
		window.top.$.jStorage.set("profileList", [profile_10]);
	}
	userset = window.top.$.jStorage.get("profile:" + profile_10);
	loadProfile(profile_10);
	window.top.$('#settingsProfile').val(profile_10);
}

function setDefaultProfile() {
	if (window.top.$('#settingsProfile').val() == profile_10) {
		var newProfile = confirm(dialog_02);
		if (newProfile) {
			createProfile();
			setDefaultProfile();
		} else {
			return false;
		}
	} else {
		var profile = window.top.$.jStorage.get("profile:" + window.top.$('#settingsProfile').val());
		window.top.$.jStorage.set("profile:" + profile_10, profile);
	}
}

function fillProfileList() {
	var profileList = window.top.$.jStorage.get("profileList");
	window.top.$.each(profileList, function(i, val) {
		window.top.$('#settingsProfile').append("<option value='" + val + "'>" + val + "</option>")
	});
	window.top.$('#settingsProfile').val(window.top.$.jStorage.get("DefaultProfile"));
}

function createProfile() {
	var profileName = prompt(dialog_03 + ":");
	if (window.top.$.inArray(profileName, window.top.$.jStorage.get("profileList")) != -1) {
		alert(dialog_04);
		createProfile();
		return false;
	}
	if (profileName == "") {
		alert(dialog_05);
		createProfile();
		return false;
	}
	var profiles;
	if (profileName != null && profileName != "") {
		var settings = [];
		settings.push(window.top.$('#start_page').val()); //0
		settings.push(window.top.$('#end_page').val()); //1
		settings.push(window.top.$('#order_by').val()); //2
		settings.push(window.top.$('#direction').val()); //3
		settings.push(window.top.$('#all_none').prop('checked')); //4
		settings.push(window.top.$('#blue').prop('checked')); //5
		settings.push(window.top.$('#green').prop('checked')); //6
		settings.push(window.top.$('#yellow').prop('checked')); //7
		settings.push(window.top.$('#red_yellow').prop('checked')); //8
		settings.push(window.top.$('#red_blue').prop('checked')); //9
		settings.push(window.top.$('#red').prop('checked')); //10
		settings.push(window.top.$('#hide_recent_farms').prop('checked')); //11
		settings.push(window.top.$('#sent_time_filter').val()); //12
		settings.push(window.top.$('#hide_recent_time').val()); //13
		settings.push(window.top.$('#enable_hauls').prop('checked')); //14
		settings.push(window.top.$('#full').prop('checked')); //15
		settings.push(window.top.$('#partial').prop('checked')); //16
		settings.push(window.top.$('#enable_attacks').prop('checked')); //17
		settings.push(window.top.$('#attack_operator').val());
		settings.push(window.top.$('#attack_value').val());
		settings.push(window.top.$('#enable_walls').prop('checked'));
		settings.push(window.top.$('#wall_operator').val());
		settings.push(window.top.$('#wall_value').val());
		settings.push(window.top.$('#enable_distances').prop('checked'));
		settings.push(window.top.$('#distance_operator').val());
		settings.push(window.top.$('#distance_value').val());
		settings.push(window.top.$('#enable_scout').prop('checked'));
		settings.push(window.top.$('#scout_report_operator').val());
		settings.push(window.top.$('#haul_value').val());
		settings.push(window.top.$('#continent_display').val());
		settings.push(window.top.$('#continents_list').val());
		settings.push(window.top.$('#enable_time').prop('checked'));
		settings.push(window.top.$('#attack_time_filter').val());
		settings.push(window.top.$('#time_value').val());
		settings.push(window.top.$('#enable_auto_run').prop('checked'));
		settings.push(window.top.$('#next_village_no_farms').prop('checked'));
		settings.push(window.top.$('#next_village_scouts').prop('checked'));
		settings.push(window.top.$('#scouts_left').val());
		settings.push(window.top.$('#next_village_farming_troops').prop('checked'));
		settings.push(window.top.$('#farming_troops_left').val());
		settings.push(window.top.$('#next_village_units').prop('checked'));
		window.top.$.jStorage.set("profile:" + profileName, settings);
		var profileList = window.top.$.jStorage.get("profileList");
		profileList.push(profileName);
		window.top.$.jStorage.set("profileList", profileList)
		window.top.$('#settingsProfile').append("<option value='" + profileName + "'>" + profileName + "</option>");

		window.top.$('#priorityOneProfile').append("<option value='" + profileName + "'>" + profileName + "</option>");
		window.top.$('#priorityTwoProfile').append("<option value='" + profileName + "'>" + profileName + "</option>");
		window.top.$('#priorityThreeProfile').append("<option value='" + profileName + "'>" + profileName + "</option>");

		window.top.$('#settingsProfile').val(profileName);
	}
}

function loadProfile(profile) {
	var settings = window.top.$.jStorage.get("profile:" + profile);
	userset = settings;
	window.top.$('#start_page').val(settings[0]);
	window.top.$('#end_page').val(settings[1]);
	window.top.$('#order_by').val(settings[2]);
	window.top.$('#direction').val(settings[3]);
	window.top.$('#all_none').prop('checked', settings[4]);
	window.top.$('#blue').prop('checked', settings[5]);
	window.top.$('#green').prop('checked', settings[6]);
	window.top.$('#yellow').prop('checked', settings[7]);
	window.top.$('#red_yellow').prop('checked', settings[8]);
	window.top.$('#red_blue').prop('checked', settings[9]);
	window.top.$('#red').prop('checked', settings[10]);
	window.top.$('#hide_recent_farms').prop('checked', settings[11]);
	window.top.$('#sent_time_filter').val(settings[12]);
	window.top.$('#hide_recent_time').val(settings[13]);
	window.top.$('#enable_hauls').prop('checked', settings[14]);
	window.top.$('#full').prop('checked', settings[15]);
	window.top.$('#partial').prop('checked', settings[16]);
	window.top.$('#enable_attacks').prop('checked', settings[17]);
	window.top.$('#attack_operator').val(settings[18]);
	window.top.$('#attack_value').val(settings[19]);
	window.top.$('#enable_walls').prop('checked', settings[20]);
	window.top.$('#wall_operator').val(settings[21]);
	window.top.$('#wall_value').val(settings[22]);
	window.top.$('#enable_distances').prop('checked', settings[23]);
	window.top.$('#distance_operator').val(settings[24]);
	window.top.$('#distance_value').val(settings[25]);
	window.top.$('#enable_scout').prop('checked', settings[26]);
	window.top.$('#scout_report_operator').val(settings[27]);
	window.top.$('#haul_value').val(settings[28]);
	window.top.$('#continent_display').val(settings[29]);
	window.top.$('#continents_list').val(settings[30]);
	window.top.$('#enable_time').prop('checked', settings[31]);
	window.top.$('#attack_time_filter').val(settings[32]);
	window.top.$('#time_value').val(settings[33]);
	window.top.$('#enable_auto_run').prop('checked', settings[34]);
	window.top.$('#next_village_no_farms').prop('checked', settings[35]);
	window.top.$('#next_village_scouts').prop('checked', settings[36]);
	window.top.$('#scouts_left').val(settings[37]);
	window.top.$('#next_village_farming_troops').prop('checked', settings[38]);
	window.top.$('#farming_troops_left').val(settings[39]);
	window.top.$('#next_village_units').prop('checked', settings[40]);
}

function changeProfile(profile) {
	loadProfile(profile);
	resetTable();
	applyFilters();
}

function deleteProfile() {
	var profileName = window.top.$('#settingsProfile').val();
	if (profileName == profile_10) {
		alert(dialog_06);
	} else {
		var profilesList = window.top.$.jStorage.get("profileList");
		profilesList.splice(profilesList.indexOf(profileName), 1);
		window.top.$.jStorage.set("profileList", profilesList);
		window.top.$.jStorage.deleteKey("profile:" + profileName);
		window.top.$("#settingsProfile option[value='" + profileName + "']").remove();
		window.top.$("#priorityOneProfile option[value='" + profileName + "']").remove();
		window.top.$("#priorityTwoProfile option[value='" + profileName + "']").remove();
		window.top.$("#priorityThreeProfile option[value='" + profileName + "']").remove();
		loadDefaultProfile(profile_10);
	}
}

function updateProfile() {
	var profileName = window.top.$('#settingsProfile').val();
	var settings = [];
	settings.push(window.top.$('#start_page').val());
	settings.push(window.top.$('#end_page').val());
	settings.push(window.top.$('#order_by').val());
	settings.push(window.top.$('#direction').val());
	settings.push(window.top.$('#all_none').prop('checked'));
	settings.push(window.top.$('#blue').prop('checked'));
	settings.push(window.top.$('#green').prop('checked'));
	settings.push(window.top.$('#yellow').prop('checked'));
	settings.push(window.top.$('#red_yellow').prop('checked'));
	settings.push(window.top.$('#red_blue').prop('checked'));
	settings.push(window.top.$('#red').prop('checked'));
	settings.push(window.top.$('#hide_recent_farms').prop('checked'));
	settings.push(window.top.$('#sent_time_filter').val());
	settings.push(window.top.$('#hide_recent_time').val());
	settings.push(window.top.$('#enable_hauls').prop('checked'));
	settings.push(window.top.$('#full').prop('checked'));
	settings.push(window.top.$('#partial').prop('checked'));
	settings.push(window.top.$('#enable_attacks').prop('checked'));
	settings.push(window.top.$('#attack_operator').val());
	settings.push(window.top.$('#attack_value').val());
	settings.push(window.top.$('#enable_walls').prop('checked'));
	settings.push(window.top.$('#wall_operator').val());
	settings.push(window.top.$('#wall_value').val());
	settings.push(window.top.$('#enable_distances').prop('checked'));
	settings.push(window.top.$('#distance_operator').val());
	settings.push(window.top.$('#distance_value').val());
	settings.push(window.top.$('#enable_scout').prop('checked'));
	settings.push(window.top.$('#scout_report_operator').val());
	settings.push(window.top.$('#haul_value').val());
	settings.push(window.top.$('#continent_display').val());
	settings.push(window.top.$('#continents_list').val());
	settings.push(window.top.$('#enable_time').prop('checked'));
	settings.push(window.top.$('#attack_time_filter').val());
	settings.push(window.top.$('#time_value').val());
	settings.push(window.top.$('#enable_auto_run').prop('checked'));
	settings.push(window.top.$('#next_village_no_farms').prop('checked'));
	settings.push(window.top.$('#next_village_scouts').prop('checked'));
	settings.push(window.top.$('#scouts_left').val());
	settings.push(window.top.$('#next_village_farming_troops').prop('checked'));
	settings.push(window.top.$('#farming_troops_left').val());
	settings.push(window.top.$('#next_village_units').prop('checked'));
	window.top.$.jStorage.set("profile:" + profileName, settings);
	userset = settings;
}

function exportProfile() {
	var profileName = window.top.$('#settingsProfile').val();
	var settings = window.top.$.jStorage.get("profile:" + profileName);
	if (profileName == profile_10) {
		alert(dialog_07);
	} else {
		var profileSettings = prompt(dialog_08, dialog_09A + "" + profileName + "" + dialog_09B + "" + profileName + "," + settings + "" + dialog_09C);
	}
}

function importProfile() {
	var profileSettings = prompt(dialog_10 + ":", dialog_11);
	profileSettings = profileSettings.split(",");
	var profileName = profileSettings[0];
	profileSettings.shift();
	var profileList = window.top.$.jStorage.get("profileList");
	if (window.top.$.inArray(profileName, profileList) != -1) {
		alert(dialog_12);
		return false;
	} else {
		for (i = 0; i <= profileSettings.length; i++) {
			if (profileSettings[i] === "false" || profileSettings[i] === "true") {
				profileSettings[i] = parseBool(profileSettings[i]);
			}
		}
		window.top.$.jStorage.set("profile:" + profileName, profileSettings);
		profileList.push(profileName);
		window.top.$.jStorage.set("profileList", profileList);
		window.top.$('#settingsProfile').append("<option value='" + profileName + "'>" + profileName + "</option>");
		window.top.$('#settingsProfile').val(profileName);
		loadProfile(profileName);
	}
}

/**********************************************************************
 *	Key Commands
 */
window.top.$(document).off();
function hotkeysOnOff(){
	window.top.$('#settingsBody tr:lt(9) input,#settingsBody tr:lt(9) select').focusin(function(){
		window.onkeydown = function(){};
	});
	window.top.$('#settingsBody tr:lt(9) input,#settingsBody tr:lt(9) select').focusout(function(){
		turnOnHotkeys();
	});
}

function turnOnHotkeys(){
	window.onkeydown = function(e){
		if(editingKey){
			editKey(e);
		} else {
			var row = window.top.$("#plunder_list tr").filter(":visible").filter(function(){let accessiblePiece=typeof(this['textContent'])!='undefined'?'textContent':'innerText';var txt=this[accessiblePiece].trim();return txt.replace(/[^\w]+/gmi, '').length>0;}).eq(1);
			var aButton = row.children("td").eq(9).children("a");
			var bButton = row.children("td").eq(10).children("a");
			var cButton = row.children("td").eq(11).children("a");
			switch(e.which) {
				case keycodes.a: // a
					tryClick(aButton);
					break;
				case keycodes.b: // b
					tryClick(bButton);
					break;
				case keycodes.c: // c
					tryClick(cButton);
					break;
				case keycodes.skip: // s
					row.hide();
					break;
				case keycodes.master: // m
					if(cansend && filtersApplied)
						selectMasterButton(row);
					break;
				case keycodes.left: // left
					getNewVillage("p");
					break;
				case keycodes.right: // right
					getNewVillage("n");
					break;
				default: return; // exit this handler for other keys
			}
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	};
}

function tryClick(button){
	if(cansend && filtersApplied){
		if(!checkIfNextVillage()){
			if(button.hasClass("farm_icon_disabled") || button.html() == undefined ){
				window.top.UI.ErrorMessage("That button is not selectable. Skipping row...", 500);
				button.closest('tr').hide();
			}
			else{
				button.click();
				if(userset[s.next_village_scouts] || userset[s.next_village_farming_troops]){
					doTime(400);
				} else {
					doTime(250);
				}
			}
		}
	}
}

function doTime(millsec) {
	cansend = false;
	setTimeout(function() {
		cansend = true;
	}, millsec);
}

function editKey(e){
	if((e.keyCode <= 37 && e.keyCode >=40) || (e.keyCode <= 48 && e.keyCode >= 90)){
		window.top.UI.ErrorMessage("You can only enter letters, numbers, or arrows. Plese try another key.", 1500);
	} else {
		var keyToChar = String.fromCharCode(e.keyCode);
		if(e.keyCode == 37){keyToChar = "â†";}
		if(e.keyCode == 38){keyToChar = "â†‘";}
		if(e.keyCode == 39){keyToChar = "â†’";}
		if(e.keyCode == 40){keyToChar = "â†“";}

		switch(keyToEdit){
			case "A": //A
				keycodes.a = e.keyCode;
				window.top.$("#hotkey_value_a").val(keyToChar);
				break;
			case "B": //B
				keycodes.b = e.keyCode;
				window.top.$("#hotkey_value_b").val(keyToChar);
				break;
			case "C": //C
				keycodes.c = e.keyCode;
				window.top.$("#hotkey_value_c").val(keyToChar);
				break;
			case "Master": //Master
				keycodes.master = e.keyCode;
				window.top.$("#hotkey_value_master").val(keyToChar);
				break;
			case "Skip": //Skip
				keycodes.skip = e.keyCode;
				window.top.$("#hotkey_value_skip").val(keyToChar);
				break;
			case "Left": //Left
				keycodes.left = e.keyCode;
				window.top.$("#hotkey_value_left").val(keyToChar);
				break;
			case "Right": //Right
				keycodes.right = e.keyCode;
				window.top.$("#hotkey_value_right").val(keyToChar);
				break;
			default: return;
		}
		window.top.UI.SuccessMessage(keyToChar + " is now mapped to the " + keyToEdit + " button.");
		updateKeypressSettings();
		editingKey = false;
	}
}

function updateKeypressSettings(){
	keyPressSettings.a_code = keycodes.a;
	keyPressSettings.a_char = window.top.$("#hotkey_value_a").val();
	keyPressSettings.b_code = keycodes.b;
	keyPressSettings.b_char = window.top.$("#hotkey_value_b").val();
	keyPressSettings.c_code = keycodes.c;
	keyPressSettings.c_char = window.top.$("#hotkey_value_c").val();
	keyPressSettings.master_code = keycodes.master;
	keyPressSettings.master_char = window.top.$("#hotkey_value_master").val();
	keyPressSettings.skip_code = keycodes.skip;
	keyPressSettings.skip_char = window.top.$("#hotkey_value_skip").val();
	keyPressSettings.left_code = keycodes.left;
	keyPressSettings.left_char = window.top.$("#hotkey_value_left").val();
	keyPressSettings.right_code = keycodes.right;
	keyPressSettings.right_char = window.top.$("#hotkey_value_right").val();
	keyPressSettings.priorityOneEnabled = window.top.$('#priorityOneEnabled').prop('checked');
	keyPressSettings.priorityOneProfile = window.top.$('#priorityOneProfile').val();
	keyPressSettings.priorityOneButton = window.top.$('#priorityOneButton').val();
	keyPressSettings.priorityTwoEnabled = window.top.$('#priorityTwoEnabled').prop('checked');
	keyPressSettings.priorityTwoProfile = window.top.$('#priorityTwoProfile').val();
	keyPressSettings.priorityTwoButton = window.top.$('#priorityTwoButton').val();
	keyPressSettings.priorityThreeEnabled = window.top.$('#priorityThreeEnabled').prop('checked');
	keyPressSettings.priorityThreeProfile = window.top.$('#priorityThreeProfile').val();
	keyPressSettings.priorityThreeButton = window.top.$('#priorityThreeButton').val();
	keyPressSettings.defaultButton = window.top.$('#defaultButton').val();
	window.top.$.jStorage.set("keyPressSettings",keyPressSettings);
}

function fillKeypressSettings(){
	if(window.top.$.jStorage.get('keyPressSettings') == null){
		window.top.$.jStorage.set('keyPressSettings', keyPressSettings);
	}
	keyPressSettings = window.top.$.jStorage.get('keyPressSettings');
	keycodes.a = keyPressSettings.a_code;
	window.top.$("#hotkey_value_a").val(keyPressSettings.a_char);
	keycodes.b = keyPressSettings.b_code;
	window.top.$("#hotkey_value_b").val(keyPressSettings.b_char);
	keycodes.c = keyPressSettings.c_code;
	window.top.$("#hotkey_value_c").val(keyPressSettings.c_char);
	keycodes.master = keyPressSettings.master_code;
	window.top.$("#hotkey_value_master").val(keyPressSettings.master_char);
	keycodes.skip = keyPressSettings.skip_code;
	window.top.$("#hotkey_value_skip").val(keyPressSettings.skip_char);
	keycodes.left = keyPressSettings.left_code;
	window.top.$("#hotkey_value_left").val(keyPressSettings.left_char);
	keycodes.right = keyPressSettings.right_code;
	window.top.$("#hotkey_value_right").val(keyPressSettings.right_char);
	window.top.$('#priorityOneEnabled').prop('checked', keyPressSettings.priorityOneEnabled);
	window.top.$('#priorityOneProfile').val(keyPressSettings.priorityOneProfile);
	window.top.$('#priorityOneButton').val(keyPressSettings.priorityOneButton);
	window.top.$('#priorityTwoEnabled').prop('checked', keyPressSettings.priorityTwoEnabled);
	window.top.$('#priorityTwoProfile').val(keyPressSettings.priorityTwoProfile);
	window.top.$('#priorityTwoButton').val(keyPressSettings.priorityTwoButton);
	window.top.$('#priorityThreeEnabled').prop('checked', keyPressSettings.priorityThreeEnabled);
	window.top.$('#priorityThreeProfile').val(keyPressSettings.priorityThreeProfile);
	window.top.$('#priorityThreeButton').val(keyPressSettings.priorityThreeButton);
	window.top.$('#defaultButton').val(keyPressSettings.defaultButton);
}

function setKeyEditMode(n){
	editingKey = true;
	keyToEdit = n;
	window.top.UI.InfoMessage("Press any number, letter, or arrow key to set the hotkey for the <span style='font-weight:bold;'>" + n + "</span> button", 1500);
	return false;
}

function fillMasterSettings(){
	var profileList = window.top.$.jStorage.get("profileList");
	window.top.$.each(profileList, function(i, val) {
		window.top.$('#priorityOneProfile').append("<option value='" + val + "'>" + val + "</option>");
		window.top.$('#priorityTwoProfile').append("<option value='" + val + "'>" + val + "</option>");
		window.top.$('#priorityThreeProfile').append("<option value='" + val + "'>" + val + "</option>");
	});
}

function selectMasterButton(row){
	var buttonToClick;
	var p1 = window.top.$.jStorage.get("profile:" + keyPressSettings.priorityOneProfile);
	var p2 = window.top.$.jStorage.get("profile:" + keyPressSettings.priorityTwoProfile);
	var p3 = window.top.$.jStorage.get("profile:" + keyPressSettings.priorityThreeProfile);
	var aButton = row.children("td").eq(9).children("a");
	var bButton = row.children("td").eq(10).children("a");
	var cButton = row.children("td").eq(11).children("a");
	buttonToClick = keyPressSettings.defaultButton;
	if(keyPressSettings.priorityThreeEnabled && !checkRowToHide(row, p3)){
		buttonToClick = keyPressSettings.priorityThreeButton;
	}
	if(keyPressSettings.priorityTwoEnabled && !checkRowToHide(row, p2)){
		buttonToClick = keyPressSettings.priorityTwoButton;
	}
	if(keyPressSettings.priorityOneEnabled && !checkRowToHide(row, p1)){
		buttonToClick = keyPressSettings.priorityOneButton;
	}
	switch(buttonToClick){
		case "A":
			tryClick(aButton);
			break;
		case "B":
			tryClick(bButton);
			break;
		case "C":
			tryClick(cButton);
			break;
		default:
			row.hide();
			break;
	}
}

/**********************************************************************
 *	Language functions
 */
function setDefaultLanguage() {
	var url = getURL();
	if(url.length == 3)
		url.shift();
	var domain = url.join('.');
	switch (domain) {
		//case "die-staemme.de", "staemme.ch":
		//	window.top.$.jStorage.set("language", "de");//german
		//	break;
		//case "tribalwars.nl":
		//	window.top.$.jStorage.set("language", "nl");//dutch
		//	break;
		//case "plemiona.pl":
		//	window.top.$.jStorage.set("language", "pl");//polish
		//	break;
		//case "tribalwars.se":
		//	window.top.$.jStorage.set("language", "sv");//swedish
		//	break;
		//case "tribalwars.com.br", "tribalwars.com.pt":
		//	window.top.$.jStorage.set("language", "pt");//portuguese
		//	break;
		//case "divokekmeny.cz":
		//	window.top.$.jStorage.set("language", "cs");//czech
		//	break;
		//case "bujokjeonjaeng.org":
		//	window.top.$.jStorage.set("language", "ko");//korean
		//	break;
		//case "triburile.ro":
		//	window.top.$.jStorage.set("language", "ro");//romanian
		//	break;
		//case "voyna-plemyon.ru":
		//	window.top.$.jStorage.set("language", "ru");//russian
		//	break;
		case "fyletikesmaxes.gr":
			window.top.$.jStorage.set("language", "el");//greek
			break;
		//case "tribalwars.no.com":
		//	window.top.$.jStorage.set("language", "no");//norwegian
		//	break;
		//case "divoke-kmene.sk":
		//	window.top.$.jStorage.set("language", "sk");//slovak
		//	break;
		//case "klanhaboru.hu":
		//	window.top.$.jStorage.set("language", "hu");//hungarian
		//	break;
		//case "tribalwars.dk":
		//	window.top.$.jStorage.set("language", "da");//danish
		//	break;
		case "tribals.it":
			window.top.$.jStorage.set("language", "it");//italian
			break;
		//case "klanlar.org":
		//	window.top.$.jStorage.set("language", "tr");//turkish
		//	break;
		//case "guerretribale.fr":
		//	window.top.$.jStorage.set("language", "fr");//french
		//	break;
		case "guerrastribales.es":
			window.top.$.jStorage.set("language", "es");//spanish
			break;
		//case "tribalwars.fi":
		//	window.top.$.jStorage.set("language", "fi");//finnish
		//	break;
		case "tribalwars.ae":
			window.top.$.jStorage.set("language", "ar");//arabic
			break;
		//case "vojnaplemen.si":
		//	window.top.$.jStorage.set("language", "sl");//slovene
		//	break;
		//case "genciukarai.lt":
		//	window.top.$.jStorage.set("language", "lt");//lithuanian
		//	break;
		//case "plemena.com":
		//	window.top.$.jStorage.set("language", "hr");//croatian
		//	break;
		//case "perangkaum.net":
		//	window.top.$.jStorage.set("language", "id");//indonesian
		//	break;
		//case "tribalwars.asia":
		//	window.top.$.jStorage.set("language", "th");//thai
		//	break;
		default:
			window.top.$.jStorage.set("language", "en");//english
			break;
	}
}

function loadLanguage(lang) {
	window.top.$.jStorage.set("language", lang);
	var profileList = window.top.$.jStorage.get("profileList");
	var defaultProfile = window.top.$.jStorage.get("profile:" + profile_10);
	if(window.top.$.inArray(lang, availableLangs) < 0){
		lang = "en";
	}
	var langFile = scriptURL + "lang/" + lang + ".js";
	window.top.$.getScript(langFile, function() {
		window.top.$('#settingsDiv').remove();
		profileList[0] = profile_10;
		window.top.$.jStorage.set("profileList", profileList);
		window.top.$.jStorage.set("profile:" + profile_10, defaultProfile);
		changeHeader(filter_40);
		showSettings();
	});
}

function addLanguages() {
	window.top.$('#language').append("<option value='en'>English</option>");
	//window.top.$('#language').append("<option value='de'>Deutsch</option>");
	//window.top.$('#language').append("<option value='nl'>Nederlands</option>");
	//window.top.$('#language').append("<option value='pl'>polszczyzna</option>");
	//window.top.$('#language').append("<option value='sv'>Svensk</option>");
	//window.top.$('#language').append("<option value='pt'>PortuguÃªs</option>");
	//window.top.$('#language').append("<option value='cs'>ÄŒeÅ¡tina</option>");
	//window.top.$('#language').append("<option value='ko'>í•œêµ­ì–´</option>");
	//window.top.$('#language').append("<option value='ro'>Ð ÑƒÑÑÐºÐ¸Ð¹</option>");
	window.top.$('#language').append("<option value='el'>Î•Î»Î»Î·Î½Î¹ÎºÎ¬</option>");
	//window.top.$('#language').append("<option value='no'>Norsk</option>");
	//window.top.$('#language').append("<option value='sk'>SlovenÄina</option>");
	//window.top.$('#language').append("<option value='hu'>Magyar</option>");
	//window.top.$('#language').append("<option value='da'>Dansk</option>");
	window.top.$('#language').append("<option value='it'>Italiano</option>");
	//window.top.$('#language').append("<option value='tr'>TÃ¼rkÃ§e</option>");
	//window.top.$('#language').append("<option value='fr'>FranÃ§ais</option>");
	window.top.$('#language').append("<option value='es'>EspaÃ±ol</option>");
	//window.top.$('#language').append("<option value='fi'>finnish</option>");
	window.top.$('#language').append("<option value='ar'>Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©</option>");
	//window.top.$('#language').append("<option value='sl'>SlovenÅ¡Äina</option>");
	//window.top.$('#language').append("<option value='lt'>LietuviÅ³</option>");
	//window.top.$('#language').append("<option value='hr'>Hrvatski</option>");
	//window.top.$('#language').append("<option value='id'>Bahasa Indonesia</option>");
	//window.top.$('#language').append("<option value='th'>à¸ à¸²à¸©à¸²à¹„à¸—à¸¢</option>");
}

/**********************************************************************
 *	Helper functions
 */
function parseBool(value) {
	return (typeof value === "undefined") ?
		false :
		// trim using jQuery.trim()'s source
	value.replace(/^\s+|\s+window.top.$/g, "").toLowerCase() === "true";
}

function getURL() {
	var domain = window.location.hostname;
	domain = domain.split('.');
	return domain;
}

function checkPage() {
	if (!(window.top.game_data.screen === 'am_farm')) {
		 if(!isPreparedToStart()){
			window['_waiting_for_ogbobby']=window.setInterval(function(){if(isPreparedToStart()){window.clearInterval(window['_waiting_for_ogbobby']);getFA();}else{console.log("Waiting for OG Bobby");}}, 240);
		}else{console.log("Already prepared to start!");getFA();}
	} else{
		run();
	}
}
// start insert
function isPreparedToStart(){
	if(typeof(window['_ogbobbyjohnson']) == 'undefined'){
		var AccountManagerLocation = window.top.$.jStorage.get("AccountManagerLocation");
		//var sAMJSLoc=JSON.parse(AccountManagerLocation)['loc'];
		var jobjAcctMngrLoc = AccountManagerLocation!=null?JSON.parse(AccountManagerLocation):null;
		if(AccountManagerLocation==null||typeof(jobjAcctMngrLoc['fetched_at']) == 'undefined' || jobjAcctMngrLoc['fetched_at']<=((new Date()).getTime()-10800000)) {
			// If undefined or the file's stored location > 3 hrs old (in ms)
			window['_ogbobbyjohnson']=null;
			$.get("https://" + window.top.location.host + "/game.php?screen=am_farm" + (typeof(window.top.game_data.village.id) != 'undefined' ?"&village="+window.top.game_data.village.id:""), function(data){
				window['_ogbobbyjohnson']=data;
			});
		}else{
			return true;
		}
		return false;
	}else{
		if(window['_ogbobbyjohnson']!=null){
			aAccountManagerLocation=window['_ogbobbyjohnson'].match(/(?<=('|"))https?:\/\/[^'"]+?Accountmanager\.js[^'"]*/gmi);
			if(aAccountManagerLocation.length>0){
				sAccountManagerLocation=aAccountManagerLocation[0];
				iFetchedAt = (new Date()).getTime();
				AccountManagerLocation={'loc':sAccountManagerLocation,'fetched_at':iFetchedAt};
				window.top.$.jStorage.set('AccountManagerLocation', JSON.stringify(AccountManagerLocation));
			}else alert('Failed to find the location fo the AccountManager script!');
			return true;
		}else{
			// Continue waiting
		}
	}
	return false;
}
// end insert
function getFA() {
	fadeThanksToCheese();
	openLoader();
	var vlink = link[0] + window.top.game_data.village.id + link[1];
	var AccountManagerLocation = window.top.$.jStorage.get("AccountManagerLocation");
	var sAMJSLoc=JSON.parse(AccountManagerLocation)['loc'];
	window.top.$.getScript(sAMJSLoc, function() {
		window.top.$.ajax({
			type: "GET",
			url: vlink,
			dataType: "html",
			error: function(xhr, statusText, error) {
				alert("Get LA error: " + error);
				window.top.$('#fader').remove();
				window.top.$('#loaders').remove();
			},
			success: function(data) {
				var v = window.top.$(data);
				var titlePat = /<\s*title\s*>([^<]+)<\/title\s*>/g;
				var titleMatch = titlePat.exec(data);
				var title = titleMatch[1];
				var newGameData = window.top.$.parseJSON(data.split("TribalWars.updateGameData(")[1].split(");")[0]); /* parse out the new game data */
				/* TribalWars.updateGameData(newGameData); */ /* update the data - using a different method for now because Inno's funct errors */
				window.top.game_data = newGameData;
				if(typeof history !== 'undefined' && typeof history.pushState === 'function'){ history.pushState({}, window.top.game_data.village.name + " - Loot Assistant","https://"+window.top.location.host+game_data.link_base_pure+'am_farm'); }
				window.top.$('#header_info').html(window.top.$('#header_info', v).html());
				window.top.$('#topContainer').html(window.top.$('#topContainer', v).html());
				window.top.$('#contentContainer').html(window.top.$('#contentContainer', v).html());
				window.top.$('head').find('title').html(title);
				window.top.$('#fader').remove();
				window.top.$('#loaders').remove();
				run();
			}
		});
	});
}
/*
 function getFA(){
 fadeThanksToCheese();
 openLoader();
 var vlink = link[0] + window.top.game_data.village.id + link[1];
 window.location = vlink;
 }
 */

function fadeThanksToCheese() {
	var fader = window.top.document.createElement('div');
	fader.id = 'fader';
	fader.style.position = 'fixed';
	fader.style.height = '100%';
	fader.style.width = '100%';
	fader.style.backgroundColor = 'black';
	fader.style.top = '0px';
	fader.style.left = '0px';
	fader.style.opacity = '0.6';
	fader.style.zIndex = '12000';
	window.top.document.body.appendChild(fader);
}

function openLoader() {
	var widget = window.top.document.createElement('div');
	widget.id = 'loaders';
	widget.style.position = 'fixed';
	widget.style.width = '24px';
	widget.style.height = '24px';
	widget.style.top = '50%';
	widget.style.left = '50%';
	window.top.$(widget).css("margin-left", "-12px");
	window.top.$(widget).css("margin-top", "-12px");
	widget.style.zIndex = 13000;
	window.top.$(widget).append(window.top.$("<img src='graphic/throbber.gif' height='24' width='24'></img>"));
	window.top.$('#contentContainer').append(window.top.$(widget));
}

function makeItPretty() {
	window.top.$('.row_a').css("background-color", "rgb(216, 255, 216)");
	window.top.$('#plunder_list').find('tr:gt(0)').each(function(index) {
		window.top.$(this).removeClass('row_a');
		window.top.$(this).removeClass('row_b');
		if (index % 2 == 0) {
			window.top.$(this).addClass('row_a');
		} else {
			window.top.$(this).addClass('row_b');
		}
	});
	hideStuffs();
}

function hideStuffs() {
	window.top.$('#plunder_list').hide();
	window.top.$('#plunder_list_nav').hide();
	window.top.$('#contentContainer').find('div[class="vis"]').eq(0).children().eq(0).append(window.top.$("<div class='vis' style='float:right;text-align:center;line-height:100%;width:12px;height:12px;margin:0px 0px 0px 0px;position:relative;background-color:tan;opacity:.7'><a href='#' num='0' onclick='uglyHider(window.top.$(this));return false;'>+</a></div>"));
	window.top.$('#contentContainer').find('div[class="vis"]').eq(0).children().eq(1).hide();
	window.top.$('#am_widget_Farm').find('h4').eq(0).append(window.top.$("<div class='vis' style='float:right;text-align:center;line-height:100%;width:12px;height:12px;margin:0px 0px 0px 0px;position:relative;background-color:tan;opacity:.7'><a href='#' num='1' onclick='uglyHider(window.top.$(this));return false;'>+</a></div>"));
	window.top.$('#plunder_list_filters').hide();
}

function uglyHider(linker) {
	var basd;
	if (window.top.$('#settingsBody').length > 0) {
		basd = 2;
	} else {
		basd = 1;
	}
	if (window.top.$(linker).text() === "+") {
		window.top.$(linker).text("-");
	} else {
		window.top.$(linker).text("+");
	}
	if (parseInt(window.top.$(linker).attr('num')) == 0) {
		window.top.$('#contentContainer').find('div[class="vis"]').eq(basd).children().eq(1).toggle();
	} else if (parseInt(window.top.$(linker).attr('num')) == 1) {
		window.top.$('#plunder_list_filters').toggle();
	} else if (parseInt(window.top.$(linker).attr('num')) == 2){
		window.top.$('#settingsBody').toggle();
	}
}
