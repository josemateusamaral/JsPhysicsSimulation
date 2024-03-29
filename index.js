window.innerHeight = 493;
window.innerWidth = 1252;
var objs = [];
var loopCount = 0;
var boxSize = 400;
var simulationSpeed = 64;
var objectsSize = 20;
var speed = [1,2,3,4,5,6];
var loopInterval = setInterval(loop,simulationSpeed);
var backgroundColor = '#000000';
var backgroundHistorico = backgroundColor;

function setup(){
    document.body.innerHTML += `
    <table id='table' align='center' style='width:${boxSize}'>
        <tr>
            <td align='center' width='100%'>
                <p id='speed' align='center'><font color='#000'>Testando</font></p>
            </td>
            <td align='center' width='100%'>
                <input type="range" min="1" max="1000" value="${simulationSpeed}" id="speedSlider" align='center'>
            </td>
        </tr>
        <tr>
            <td align='center' width='100%'>
                <p id='data' align='center'><font color='#000'>Testando</font></p>
            </td>
            <td align='center' width='100%'>
                <button align='center' onclick='addObj()'>Add object</button>
            </td>
        </tr>
        <tr>
            <td align='center' width='100%'>
                <p align='center'><font color='#000'>backgroud color</font></p>
            </td>
            <td align='center' width='100%'>
                <input type="color" id="colorPicker" name="background color" value="#000000">
            </td>
        </tr>
        <tr>
            <td align='center' width='100%' colspan=2>
                <button onclick='reiniciateSimulation()' align='center'>restart</button>
            </td>
        </tr>
    </table>`;
    var text = document.getElementById('table');
    text.style.position = 'fixed';
    text.style.top = (window.innerHeight / 2) + (boxSize /2);
    text.style.left = (window.innerWidth / 2) - (boxSize/2);
    text.style.color='#000';
    var box = document.getElementById('box');
    box.style.left = window.innerWidth / 2 - (boxSize/2);
    box.style.top = window.innerHeight / 2 - (boxSize/2);
    box.style.width = boxSize + 'px';
    box.style.height = boxSize + 'px';
    document.getElementById('speed').innerText = 'Simulation speed: ' + simulationSpeed.toString();
    document.getElementById('data').innerText = 'Objects amount: ' + objs.length.toString();
}
function loop(){
    toogleUpdate(true);						
    for( let obj = 0 ; obj < objs.length ; obj++ ){
        let divObj = document.getElementById(objs[obj]['id']);
        //update position
        let px = objs[obj]['px'];
        let py = objs[obj]['py'];
        let newPosX = px + objs[obj]['vx'];
        let newPosY = py + objs[obj]['vy'];
        if(newPosX > ((window.innerWidth/2)+(boxSize/2)-objectsSize)){
            newPosX = ((window.innerWidth/2)+(boxSize/2)-objectsSize)+1;
        }
        if(newPosX < ((window.innerWidth/2)-(boxSize/2))){
            newPosX = ((window.innerWidth/2)-(boxSize/2))-1;
        }
        if(newPosY > ((window.innerHeight/2)+(boxSize/2)-objectsSize)){
            newPosY = ((window.innerHeight/2)+(boxSize/2)-objectsSize)+1;
        }
        if(newPosY < ((window.innerHeight/2)-(boxSize/2))){
            newPosY = ((window.innerHeight/2)-(boxSize/2))-1;
        }
        if(objs[obj]['update']){
            objs[obj]['px'] = newPosX;
            if (detectColision(obj,'vx')){
                objs[obj]['vx'] *= -1;
                objs[obj]['px'] = px;
            }
            objs[obj]['py'] = newPosY;
            if (detectColision(obj,'vy')){
                objs[obj]['vy'] *= -1;
                objs[obj]['py'] = py;
            }
        }
        
        divObj.style.left = newPosX;
        divObj.style.top = newPosY;
        px = newPosX;
        py = newPosY;
        //check colisions on borders
        if( px > ((window.innerWidth/2)+(boxSize/2)-(objectsSize*1)) || px < ((window.innerWidth/2)-(boxSize/2))){
            objs[obj]['vx'] *= -1;
        }
        if( py > ((window.innerHeight/2)+(boxSize/2)-objectsSize) || py < ((window.innerHeight/2)-(boxSize/2))){
            objs[obj]['vy'] *= -1;
        }
    }
    loopCount++;
    if(document.getElementById('speedSlider').value != simulationSpeed){
        changeSpeed();
    }
    if(document.getElementById('colorPicker').value != backgroundColor){
        backgroundColor = document.getElementById('colorPicker').value;
        backgroundHistorico = backgroundColor;
        document.getElementById('box').style.backgroundColor = backgroundColor;
    }
}
function addObj(){
    let id = objs.length.toString();
    let color = [];
    for(let i = 0 ; i < 3; i++){
        let intensity = Math.floor(Math.random() * 255);
        color.push(intensity);
    }
    
    let vx = Math.floor(Math.random() * 14) + 1;
    if(Math.floor(Math.random() * 2)){
        vx *= -1;
    }
    let vy = Math.floor(Math.random() * 14) + 1;
    if(Math.floor(Math.random() * 2)){
        vy *= -1;
    }
    let px,py;
    while(true){
        px = ((window.innerWidth / 2)-(boxSize/2)) + Math.floor(Math.random() * (boxSize-100)) + 50;
        py = ((window.innerHeight / 2)-(boxSize/2)) + Math.floor(Math.random() * (boxSize-100)) + 50;
        if(detectColision(-1,'none',pos=[px,py])){
            continue;
        }
        break;                
    }
    let obj = `<div class='obj' style='width:${objectsSize}px;height:${objectsSize}px;background-color:rgba(${color[0]},${color[1]},${color[2]},255);position:fixed;left:${px};top:${py}' id='${id}'>`;
    document.body.innerHTML += obj;
    let newObj = {'id':id,'vx':vx,'vy':vy,'px':px,'py':py,'update':true,'lastColision':''};
    objs.push(newObj);
    document.getElementById('speed').innerText = 'Simulation speed: ' + simulationSpeed.toString();
    document.getElementById('data').innerText = 'Objects amount: ' + objs.length.toString();
    document.getElementById('speedSlider').value = simulationSpeed;
    backgroundColor = backgroundHistorico;
    document.getElementById('colorPicker').value = backgroundColor;
    document.getElementById('box').style.backgroundColor = backgroundColor;
}
function detectColision(obj,type,pos='nada'){
    //chech colision on objects
    let px,py;
    if(pos=='nada'){
        px = objs[obj]['px'];
        py = objs[obj]['py'];
    }
    else{
        px = pos[0];
        py = pos[1];
    }
    let colided = false;
    for( let bx = 0 ; bx < objs.length ; bx++ ){
        if(bx==obj){
            continue;
        }
        if(obj!=-1){
            if(objs[bx]['id'] == objs[obj]['lastColision']){
                continue;
            }
        }
        let colObj = objs[bx];
        let colX = false;
        let colY = false;
        let colXObj = false;
        let colYObj = false;
        if(py < colObj['py'] + objectsSize && py > colObj['py'] - objectsSize){
            if(colObj['vy'] < 0 && colObj['vy'] > 0 || colObj['vy'] > 0 && colObj['vy'] < 0){
                colYObj = true;
            }
            colY = true;
        }
        if(px < colObj['px'] + objectsSize && px > colObj['px'] - objectsSize){
            if(colObj['vx'] < 0 && colObj['vx'] > 0 || colObj['vx'] > 0 && colObj['vx'] < 0){
                colXObj = true;
            }
            colX = true;
        }
            
        if(type=='vx' && colX && colX && colXObj ){
            objs[bx][type] *= -1;
        }
        if(type=='vy' && colY && colY && colYObj ){
            objs[bx][type] *= -1;
        }
        if(colX&&colY){
            if(obj!=-1){
                objs[obj]['lastColision'] = objs[bx]['id'];
            }
            colided = true;
        }
    }
    if(colided){
        return true;
    }
    else{
        if(obj!=-1){
            objs[obj]['lastColision'] = '';
        }
        return false;
    }   
}
function toogleUpdate(status){
    for(let i = 0;i<objs.length;i++){
        objs[i]['update'] = status;
    }
}
function changeSpeed(){
    clearInterval(loopInterval);
    let speed = document.getElementById('speedSlider').value;
    simulationSpeed = speed;
    document.getElementById('speed').innerText = 'Simulation speed: ' + simulationSpeed.toString();
    console.log('changing speed');
    loopInterval = setInterval(loop,simulationSpeed);
}
function reiniciateSimulation(){
    document.body.innerHTML = `<div style='background-color:#000;position:fixed' id="box"></div>`;
    objs = [];
    setup();                
}