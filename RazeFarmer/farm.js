javascript:

var keycodes = {
  "a": 65,
  "b": 66,
  "c": 67,
  "skip": 83,
  "right": 39,
  "left": 37,
  "master": 77
};
var count = 1;
function turnOnHotkeys() {
  count = getRndInteger(1, 10);
  console.log('Preparing to send attack-->' + new Date().getTime());
  setTimeout(() => doSendAttack(), count * 250)
}

function doSendAttack() {
  var row = window.top.$("#plunder_list tr").filter(":visible").filter(function () { let accessiblePiece = typeof (this['textContent']) != 'undefined' ? 'textContent' : 'innerText'; var txt = this[accessiblePiece].trim(); return txt.replace(/[^\w]+/gmi, '').length > 0; }).eq(1);
  var aButton = row.children("td").eq(8).children("a");
  var bButton = row.children("td").eq(9).children("a");
  var cButton = row.children("td").eq(10).children("a");
  let keyToPress = row.children("td").eq(6).html() > 0 ? 66 : 65;// Use template A for no walls and template B for all other
  switch (keyToPress) {
    case keycodes.a: // a
      tryClick(aButton);
      row.hide();
      count = getRndInteger(1, 10);
      console.log('wall = 0, so sending A');
      setTimeout(turnOnHotkeys(), count * 1000);
      break;
    case keycodes.b: // b
      tryClick(bButton);
      row.hide();
      count = getRndInteger(1, 10);
      console.log('wall >0, so sending B');
      setTimeout(turnOnHotkeys(), count * 1000);
      break;
    case keycodes.c: // c
      tryClick(cButton);
      row.hide();
      break;
    default: return; // exit this handler for other keys
  }
  //e.preventDefault();
  //count++;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tryClick(button) {
  button.click();
  //doTime(250 + getRndInteger(0, 100));
}

// function doTime(millsec) {
//   cansend = false;
//   setTimeout(function () {
//     cansend = true;
//   }, millsec);
// }

turnOnHotkeys();
