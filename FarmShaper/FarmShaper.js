javascript: (() => {
	if (window.location.href.indexOf("am_farm") < 0) return;
	$('#inner-border tbody tr[id^="village_"]').filter((i, el) => $(el).find(":nth-child(7)").html() > 0).slice(0, 30).each((i, el) => {
		var cv = /village=(\d+)/.exec(window.location.href)[1];
		var bv = /village_(\d+)/.exec(el.id)[1];
		var rp = `/game.php?village=${cv}&screen=place&target=${bv}`;
		setTimeout(() => window.open(rp, '_blank'), i * 750)
	})
})()
