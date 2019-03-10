javascript: var [sp, sw, ax, ar, scout, lc, mount, hv, cat, ra, pal, no] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var doc = (window.frames.length > 0) ? window.main.document : document;
var url = doc.URL;
var name = 'fakes';
if (url.match(/screen=info_player/)) {
	var table = doc.getElementById('villages_list');
	var links = table.getElementsByTagName('a');
	if (links[links.length - 1].innerHTML.match(/leftover/g)) {
		UI.InfoMessage('Displaying all leftover villages. ' + 'Click script again!', 5000, 'success');
		$(links[links.length - 1]).click();
	} else {
		var villas = ($('table[class="content-border"]').html().match(/\d+\|\d+/g) || []).filter(function (a, b, c) {
			return c.lastIndexOf(a) === b;
		});
		var coords = villas.join(' ');
		localStorage.setItem('Razor-' + name, villas);
		UI.InfoMessage('Grabbed and stored ' + villas.length + ' villages.<br>Go to rally point to send attacks!', 5000, 'success');
	}
} else if (url.match(/screen=place/)) {
	var coords = localStorage.getItem('Razor-' + name);
	if (coords == null) {
		coords = prompt("Please enter target coordinates", "XXX|YYY,XXX|YYY");
		localStorage.setItem('Razor-' + name, coords);
	}
	if (coords != null) {
		if (coords.includes(",")) {
			coords = coords.split(",");
		} else if (coords.includes(" ")) {
			coords = coords.split(" ");
		}
		var index = Math.round(Math.random() * (coords.length - 1));
		coords = coords[index];
		doc.forms[0].input.value = coords;
		selectAllUnits(false);
		insertUnit(doc.forms[0].spear, sp);
		insertUnit(doc.forms[0].sword, sw);
		insertUnit(doc.forms[0].axe, ax);
		insertUnit(doc.forms[0].archer, ar);
		insertUnit(doc.forms[0].spy, scout);
		insertUnit(doc.forms[0].light, lc);
		insertUnit(doc.forms[0].marcher, mount);
		insertUnit(doc.forms[0].heavy, hv);
		insertUnit(doc.forms[0].ram, ra);
		insertUnit(doc.forms[0].catapult, cat);
		insertUnit(doc.forms[0].snob, no);
		insertUnit(doc.forms[0].knight, pal);
	}
}
