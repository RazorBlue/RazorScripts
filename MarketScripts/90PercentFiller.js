javascript: if(location.href.includes("screen=market")){var pId=TribalWars.getGameData().player.id,wId=TribalWars.getGameData().world,pList=["647002-us41","727966-us41","754880-us41"];if(pList.includes(pId+"-"+wId)){var flag1,flag2,currentWood=document.getElementById("wood").innerHTML,currentStone=document.getElementById("stone").innerHTML,currentIron=document.getElementById("iron").innerHTML,maxCap=document.getElementById("storage").innerHTML,flag=!1;const e=$("input[type=submit][value='Request resources']")[0],n={maxWood:.9*maxCap,maxStone:.9*maxCap,maxIron:.9*maxCap};$("#village_list").find(".supply_location").each((a,t)=>{const o=$(t);o.find("td:last-of-type").css({whiteSpace:"nowrap"}).append($("<img/>").css({cursor:"pointer"}).attr("src",$('img[src*="/graphic/"]').attr("src").replace(/\/graphic\/.*$/,"/graphic/buildings/storage.png")).on("click",()=>{o.find("input[name*=select-village]").click();const a=currentWood,t=currentStone,r=currentIron,i=+(0|document.getElementById("total_wood").innerHTML.replace(/[^0-9]/g,""))+ +a,l=+(0|document.getElementById("total_stone").innerHTML.replace(/[^0-9]/g,""))+ +t,d=+(0|document.getElementById("total_iron").innerHTML.replace(/[^0-9]/g,""))+ +r;+i+1>n.maxWood?(o.find("input[name*=wood]").val(Math.floor(0)),flag1=!0):+i+ +o.find("input[name*=wood]").val()>n.maxWood&&o.find("input[name*=wood]").val(Math.floor(n.maxWood-i)),+l+1>n.maxStone?(flag2=!0,o.find("input[name*=stone]").val(Math.floor(0))):+l+ +o.find("input[name*=stone]").val()>n.maxStone&&o.find("input[name*=stone]").val(Math.floor(n.maxStone-l)),+d+1>n.maxIron?(flag3=!0,o.find("input[name*=iron]").val(Math.floor(0))):+d+ +o.find("input[name*=iron]").val()>n.maxIron&&o.find("input[name*=iron]").val(Math.floor(n.maxIron-d)),flag1&&flag2&&flag3?UI.InfoMessage("90% Warehouse Capacity Reached",5e3,"success"):e.click(),o.hide()}))})}}
