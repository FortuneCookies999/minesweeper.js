let count_x = 0;
let count_y = 0;
let tile = [];
let count_boom = 0;
let boom_loc = [];
let game_over = false;
let left = 0;

function flag(){
    const id = event.target.id;
    const tile_here = tile.filter(function(tile){return tile.id==id})[0];
    if(tile_here.flag == false){
        tile_here.flag = true;
        event.target.innerText = "?";
    }else if(tile_here.flag == true){
        tile_here.flag = false;
        event.target.innerText = "";
    }
}

function search(tile_here){
    let count_boom_around = 0;
    const tile_around_array = [`(${tile_here.x+1},${tile_here.y+1})`,
                        `(${tile_here.x+1},${tile_here.y})`,
                        `(${tile_here.x+1},${tile_here.y-1})`,
                        `(${tile_here.x},${tile_here.y+1})`,
                        `(${tile_here.x},${tile_here.y-1})`,
                        `(${tile_here.x-1},${tile_here.y+1})`,
                        `(${tile_here.x-1},${tile_here.y})`,
                        `(${tile_here.x-1},${tile_here.y-1})`];
    tile_around_array.forEach(function(tile_around_id){
        const tile_around = tile.filter(function(tile){return tile.id==tile_around_id})[0];
        if(typeof(tile_around) !=='undefined'){
            if(tile_around.boom == true){
                count_boom_around = count_boom_around + 1;
            }
        }
    });
    return count_boom_around;
}

function open(tile_here){
    if(tile_here.flag == false){
        if(tile_here.open == false){
            tile_here.open = true;
            if(tile_here.boom == true){
                game_over = true;
                document.getElementById(tile_here.id).innerText = "붐!";
                alert("게임 오버!");
            }else{
                left = left - 1;
                if(left == 0){
                    alert("성공!");
                }
                document.getElementById(tile_here.id).classList.add("green");
                const count_boom_around = search(tile_here);
                if(count_boom_around == 0){
                    const tile_around_array = [`(${tile_here.x+1},${tile_here.y+1})`,
                                                `(${tile_here.x+1},${tile_here.y})`,
                                                `(${tile_here.x+1},${tile_here.y-1})`,
                                                `(${tile_here.x},${tile_here.y+1})`,
                                                `(${tile_here.x},${tile_here.y-1})`,
                                                `(${tile_here.x-1},${tile_here.y+1})`,
                                                `(${tile_here.x-1},${tile_here.y})`,
                                                `(${tile_here.x-1},${tile_here.y-1})`];
                    tile_around_array.forEach(function(tile_around_id){
                        const tile_around = tile.filter(function(tile){return tile.id==tile_around_id})[0];
                        if(typeof(tile_around) !=='undefined'){
                            open(tile_around);
                        }
                    });
                }else{
                    document.getElementById(tile_here.id).innerText = count_boom_around;
                }
            }
        }
    }
}

function click(){
    if(game_over == false){
        const id = event.target.id;
        const tile_here = tile.filter(function(tile){return tile.id==id})[0];
        open(tile_here);
    }
}

function start(){
    const table = document.getElementById("table");
    count_x = parseInt(document.getElementById("input_x").value);
    count_y = parseInt(document.getElementById("input_y").value);
    rate = parseInt(document.getElementById("rate").value);
    count_boom = parseInt(count_x*count_y*rate/100);
    let left_boom = count_boom;
    while(left_boom >0){
        const loc_number = Math.floor(Math.random()*count_x*count_y);
        const loc = `(${loc_number-count_x*parseInt(loc_number/count_x)+1},${parseInt(loc_number/count_x)+1})`;
        if(!boom_loc.includes(loc)){
            boom_loc.push(loc);
            left_boom = left_boom - 1;
        }
    }
    for(var i = 0; i<count_y; i++){
        const tr = document.createElement("tr");
        table.appendChild(tr);
        for(var j = 0; j<count_x; j++){
            const td = document.createElement("td");
            tr.appendChild(td);
            td.id=`(${j+1},${i+1})`;
            const tile_here = {
                x : j+1,
                y : i+1,
                id : td.id,
                boom : false,
                open : false,
                flag : false
            }
            if(boom_loc.includes(td.id)){
                tile_here.boom = true;
            }
            tile.push(tile_here);
            td.addEventListener("contextmenu", flag);
            td.addEventListener("click", click);
        }
    }
    left = count_x*count_y-count_boom;
    document.getElementById("input").remove();
}