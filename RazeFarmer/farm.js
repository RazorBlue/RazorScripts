javascript:

/*	Author: RazorBlue
 *	Name: AutoFarmer
 *	Version: 1.10
 *	Client script: javascript:$.get('https://cdn.jsdelivr.net/gh/RazorBlue/RazorScripts/RazeFarmer/farm.min.js');void(0); */

/**********************************************************************
 *	Global variables
 */

var wallCodes = {
    "a": '?',
    "b": "0",
    "c": "1"
};

var count = 1;
var pageIndex = 0;
var pagesLoaded = false;
var doc = (window.frames.length > 0) ? window.main.document : document;
var url = doc.URL;
var isUnitAvailable = false;


function checkForBotProtection() {
    console.log('Checking for BotProtection');
    var botProtectionDiv = document.getElementsByClassName('recaptcha-checkbox-checkmark');
    if (botProtectionDiv.length > 0) {
        console.log('BotProtection Active');
        var botCheckBox = botProtectionDiv[0];
        console.log('Clicking bot protection checkbox');
        botCheckBox.click();
    }
}


function prepareToFarm() {
    checkForBotProtection();
    checkUnitsAvailability();
    count = getRndInteger(1, 10);

    if (pagesLoaded === true) {
        console.log('Preparing to send attack-->' + new Date().getTime());
        setTimeout(() => doSendAttack(), count * 250);
    } else {
        setTimeout(() => prepareToFarm(), count * 250)
    }

}

function doSendAttack() {
    var row = window.top.$("#plunder_list tr").filter(":visible").filter(function () { let accessiblePiece = typeof (this['textContent']) != 'undefined' ? 'textContent' : 'innerText'; var txt = this[accessiblePiece].trim(); return txt.replace(/[^\w]+/gmi, '').length > 0; }).eq(1);

    // End AutoFarm if all troops are launched out successfully.
    if (row.length === 0 || isUnitAvailable === false) {
        UI.InfoMessage('All troops sent successfully', 5000, 'success');
        return 0;
    }

    var aButton = row.children("td").eq(8).children("a");
    var bButton = row.children("td").eq(9).children("a");
    
    let wallLevel = row.children("td").eq(6).html();
    switch (wallLevel) {
        case wallCodes.a: // a
            tryClick(aButton);
            row.hide();
            count = getRndInteger(1, 10);
            console.log('Wall = ? so sending A');
            setTimeout(prepareToFarm(), count * 1000);
            break;
        case wallCodes.b: // a
            tryClick(aButton);
            row.hide();
            count = getRndInteger(1, 10);
            console.log('Wall = 0 so sending A');
            setTimeout(prepareToFarm(), count * 1000);
            break;
        case wallCodes.c: // b
            tryClick(bButton);
            row.hide();
            count = getRndInteger(1, 10);
            console.log('Wall = 1 so sending B');
            setTimeout(prepareToFarm(), count * 1000);
            break;
        default: 
            row.hide();
            console.log('Wall > 1 so skipping target');
            setTimeout(prepareToFarm(), count * 1000);
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tryClick(button) {
    button.click();
}

//Automatically load a concantenated list of farms
function showAllRows() {
    var pages = window.top.$.trim(window.top.$('#plunder_list_nav tr:first td:last').children().last().html().replace(/\D+/g, ''));
    if (window.top.$('#end_page').val() == "max") {
        window.top.$('#end_page').text(pages);
    }
    window.top.$('#am_widget_Farm tr:last').remove();
    if (pages > parseInt(window.top.$('#end_page').val(), 10)) {
        pages = parseInt(window.top.$('#end_page').val(), 10);
    }
    pageIndex++;
    setTimeout(function () {
        getPage(pageIndex, pages);
    }, 1);
}

function getPage(i, pages) {
    if (i < pages) {
        var pageUrl = url + "&order=distance&dir=asc&Farm_page=" + i;
        window.top.$.ajax({
            type: 'GET',
            url: pageUrl,
            dataType: "html",
            error: function (xhr, statusText, error) {
                console.log("Get page failed with error: " + error);
            },
            success: function (data) {
                window.top.$('#plunder_list tr', data).slice(1).each(function () {
                    window.top.$('#plunder_list tr:last').after("<tr>" + window.top.$(this).html() + "</tr>");
                });
                setTimeout(function () {
                    getPage(i + 1, pages);
                }, 1);
            }
        });
    } else {
        window.top.$('#plunder_list').show();
        window.top.Accountmanager.initTooltips();
        pagesLoaded = true;
    }
}
function checkUnitsAvailability() {
    isUnitAvailable = false;
    window.top.$('.fm_unit input:checked').each(function (i) {
        var unitName = window.top.$(this).attr('name');
        var currentTroopCount = document.getElementById(unitName).innerText;
        if (currentTroopCount > 0) {
            isUnitAvailable = true;
        }
    });
}

setTimeout(showAllRows(), 1);

prepareToFarm();
