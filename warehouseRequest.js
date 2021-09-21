javascript:
if (location.href.includes('screen=market')) {
    if (true) {
        var currentWood = document.getElementById('wood').innerHTML;
        var currentStone = document.getElementById('stone').innerHTML;
        var currentIron = document.getElementById('iron').innerHTML;
        var maxCap = document.getElementById('storage').innerHTML;
        var flag1, flag2, flag = false;
        const requestRes = $("input[type=submit][value='Request resources']")[0];

        const max = {
            maxWood: maxCap * 0.9,
            maxStone: maxCap * 0.9,
            maxIron: maxCap * 0.9
        };
        $('#village_list').find('.supply_location').each((b, c) => {
            const d = $(c);
            d.find('td:last-of-type').css({
                whiteSpace: 'nowrap'
            }).append($('<img/>').css({
                cursor: 'pointer'
            }).attr('src', $('img[src*="/graphic/"]').attr('src').replace(/\/graphic\/.*$/, '/graphic/buildings/storage.png')).on('click', () => {
                const e = d.find('input[name*=select-village]');
                e.click();
                const a = {
                    wood: currentWood,
                    stone: currentStone,
                    iron: currentIron,
                    maxCap: maxCap
                };
                const incomingWood = 0 | document.getElementById('total_wood').innerHTML.replace(/[^0-9]/g, ''),
                    incomingStone = 0 | document.getElementById('total_stone').innerHTML.replace(/[^0-9]/g, ''),
                    incomingIron = 0 | document.getElementById('total_iron').innerHTML.replace(/[^0-9]/g, ''),
                    totalRes = {
                        wood: +incomingWood + +a.wood,
                        stone: +incomingStone + +a.stone,
                        iron: +incomingIron + +a.iron
                    };
                if (+totalRes.wood + 1 > max.maxWood) {
                    d.find('input[name*=wood]').val(Math.floor(0));
                    flag1 = true;
                } else if (+totalRes.wood + +d.find('input[name*=wood]').val() > max.maxWood) {
                    d.find('input[name*=wood]').val(Math.floor(max.maxWood - totalRes.wood));
                }
                if (+totalRes.stone + 1 > max.maxStone) {

                    flag2 = true;
                    d.find('input[name*=stone]').val(Math.floor(0));
                } else if (+totalRes.stone + +d.find('input[name*=stone]').val() > max.maxStone) {
                    d.find('input[name*=wood]').val(Math.floor(max.maxStone - totalRes.stone));
                }
                if (+totalRes.iron + 1 > max.maxIron) {

                    flag3 = true;
                    d.find('input[name*=iron]').val(Math.floor(0));
                } else if (+totalRes.iron + +d.find('input[namea*=iron]').val() > max.maxIron) {
                    d.find('input[name*=iron]').val(Math.floor(max.maxIron - totalRes.iron));
                }
                if (flag1 && flag2 && flag3) {
                    UI.InfoMessage('90% Warehouse Capacity Reached', 5000, 'success');
                } else {
                    requestRes.click();
                }
                d.hide();

            }))
        })
    }

}
void 0;
