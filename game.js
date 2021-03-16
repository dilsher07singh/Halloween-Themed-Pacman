
var backgroundSound = new Audio("creepy-background-daniel_simon.wav");
backgroundSound.loop=1;

var gameoversound= new Audio("zapsplat_human_male_voice_says_game_over_001_15726.mp3");
var playershootsound= new Audio("zapsplat_warfare_bullet_hit_metal_001_43600.mp3");
var monsterdiessound=new Audio("smartsound_HUMAN_VOCAL_Male_Scream_Deep_Pain_05.mp3");
var exitsound=new Audio("little_robot_sound_factory_Jingle_Win_Synth_00.mp3");


// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}
//size used in program
function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}



//function to actually change opacity and return based on the following formula
function changeOpacity(disappearplatform){
    var newopacity=parseFloat(disappearplatform.getAttribute("opacity")) - disappearinterval;
    //set attribute after subtracting from disappearinterval
    disappearplatform.setAttribute("opacity",newopacity);
}

//player on disappearing platform on not. Check later on and used for various things
function objectondp(pos, mot, size) {
    
    //initialize and run a loop for the 3 disappearing platforms. This is helpful.
    var j=0;
    while(j<3){
        //go through 3 times and get using the following equation
        var disappearplatform = document.getElementById("platdisappear" + j);

        if (disappearplatform != null){

        var x = parseFloat(disappearplatform.getAttribute("x"));
        var y = parseFloat(disappearplatform.getAttribute("y"));
        var width = parseFloat(disappearplatform.getAttribute("width"));
        var height = parseFloat(disappearplatform.getAttribute("height"));

        if (((pos.x + size.w > x && pos.x < x + width) ||
             ((pos.x + size.w) == x && mot == motionType.RIGHT) ||
             (pos.x == (x + width) && mot == motionType.LEFT)) &&
            (pos.y + size.h == y)) {
            //changeopacity if on platform based on time interval of 0.6s
            changeOpacity(disappearplatform);
        }
    }

    ++j;

    }  

}

//check if object is on the vertical platform and do the following
function objectonVertPlatform(pos, mot, size) {
    //get vert from platvertical
    var vert = document.getElementById("platvertical");

    var x = parseFloat(vert.getAttribute("x"));
    var y = parseFloat(vert.getAttribute("y"));
    var width = parseFloat(vert.getAttribute("width"));
    var height = parseFloat(vert.getAttribute("height"));

    //last condition based on trial and error of my particular game
    var lastcondition=pos.y <= y+ 2.5- size.h && pos.y >= y - 1.1 * size.h;
    //return value is a bool
    return (((pos.x + size.w > x && pos.x < x + width) ||
         ((pos.x + size.w) == x && mot == motionType.RIGHT) ||
         (pos.x == (x + width) && mot == motionType.LEFT)) && 
         (lastcondition));

}



//check if objectonplatform or not. Really essential for distinguishing
function objectonp(position, size) {
    //get platforms
    var platforms = document.getElementById("platforms");

    //initialize and check if not rect continue and update
    var j=0;
    while(j <platforms.childNodes.length){
       
        if (platforms.childNodes.item(j).nodeName != "rect") {
            ++j;
            continue;
        }
        //get different attributes as they are and check 
        var x = parseFloat(platforms.childNodes.item(j).getAttribute("x"));
        var y = parseFloat(platforms.childNodes.item(j).getAttribute("y"));
        var width = parseFloat(platforms.childNodes.item(j).getAttribute("width"));
        var height = parseFloat(platforms.childNodes.item(j).getAttribute("height"));
        //collision statement for intersection. Match means return false or zero
        var point=new Point(x,y);
        var size1=new Size(width,height);

        var intersection=intersect(position, size, point, size1);

        if (intersection==1)
            return 0;


        ++j;
    }

        return 1;
}





// The player class used in this program
function Player() {
    this.node = document.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
}


function checkOpacity(node){
    if (parseFloat(node.getAttribute("opacity")) < 0 || parseFloat(node.getAttribute("opacity")) == 0 )
        return 1;

    else
        return 0;
}


Player.prototype.isOnPlatform = function() {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);

        if (node.nodeName != "rect") continue;

        if (checkOpacity(node)==1) continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            (this.position.y + PLAYER_SIZE.h == y) || objectonVertPlatform(this.position, this.motion, PLAYER_SIZE)) return 1;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return 1;

    return 0;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = document.getElementById("platforms");
    for (var j = 0; j < platforms.childNodes.length; ++j) {
        var node = platforms.childNodes.item(j);
        if (node.nodeName != "rect") continue;

        if (checkOpacity(node)==1) continue;

        if (objectonVertPlatform(this.position, this.motion,PLAYER_SIZE)==1) continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}



function begin() {
        backgroundSound.play();


        gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
        //every second change it
        timeInterval = setInterval(function(){
        timeleft =timeleft- 1;}, 1000);


        document.documentElement.addEventListener("keydown", keydown, false);
        document.documentElement.addEventListener("keyup", keyup, false);

        //initial page hidden initially only when clicked 
        document.getElementById("initialpageshown").style.setProperty("visibility", "hidden", null);
            
        //initial maxscores display set at the right way to make sure initially not shown until game is over
        document.getElementById("maxscoresdisplay").style.setProperty("visibility", "hidden", null);


      if(currentLevel==1)
        resetHighScoreTable();


      }




function startagain() {


    //increase level for insurance
        levelup();


        document.getElementById("maxscoresdisplay").style.setProperty("visibility", "hidden", null);

        document.getElementById("initialpageshown").style.setProperty("visibility", "visible", null);

        //change textContent to Start the battle from next level
        document.getElementById("battlesign").firstChild.textContent="Start the battle";


      }



//Constants used in game extremely essential for further functions

var PLAYER_SIZE = new Size(40, 40);         
var SCREEN_SIZE = new Size(600, 560);       
var PLAYER_INIT_POS  = new Point(0, 0);     


var MOVE_DISPLACEMENT = 5;                  
var upspeed = 15;                        
var VERTICAL_DISPLACEMENT = 1;              


var GAME_INTERVAL = 25;                     

var sizeofbullet = new Size(5, 5);         
var speedofbullet = 10.0;                   

var SHOOT_INTERVAL = 1000.0;                 //delay after shooting by player
var canShootP = true;                       //can player shoot is a bool used later

var MONSTER_SIZE = new Size(40, 40);            //monster size is defined from lab

var score = 0;                                  //Initial start page score is zero


var motionType = {NONE:0, LEFT:1, RIGHT:2};     //different motion types

var player = null;                              //player val
var gameInterval = null;                        //game interv


var playerfaceR = true;                         //isPlayerface right or left


var numofbullets = 8;                           //number of bullets or ammo                         

var goodthingsize = new Size(40, 40);          //candy size
var goodthingnum = 10;                          //10 candies to collect    

var sizeofexit = new Size(40, 40);                          //exit size
var exitpos = new Point(560, 520 - sizeofexit.h / 2);       //exit position at the right bottom of the page

var portalsize = new Size(40, 40);                  //portal size
var firstportal = new Point(0, 510);                //firstport point 
var secondportal = new Point(550, 10);               //secondport point
var teleport = true;                                //teleport is a bool value
var teleportINT = 1100                              //teleport interval is 1.1s

var verticalplatformup = 1;                      //isplat going up or down
var disappearinterval = 0.06;                       //disappear int is defined as left

var numofmonsters = 6;                              //number of monsters in level 1
var speedofmonster = 1;                             //speedof monster same as bullet

var monsterlocationlist = [];                       //array for location of monsters
var monsterdirectionlist = [];                      //array for location of monsters

var canshootM = 1;                               //can spec shoot
var isalivespec = 1;                             //is special monst alive

var name = "";                                      //name anonymous


var timeleft = 120;                                 //timeofgame


var currentLevel = 1;                               //currentlevel of game
var cheatonoroff = 0;                               //cheatmode is on or off check carefully

var monsterpoints = 20;      
                       //kill monster 20
var goodpoints = 15;                                // get candy 15
var SCORE_currentLevel = 100;                       //if level passed add 100*level
var timepoints = 1;                                 //timepoints after each level cleared


var timeInterval = null;                        //timeinterval set like game interval


//askname from user and accordingly place the following rules
function askname(){
    if (currentLevel == 1 && currentLevel!=2) {

        this.name = prompt("Please enter your name", this.name);
        if (this.name == "null")   
        this.name = "Anonymous";
        if (this.name == "") 
        this.name = "Anonymous";


    }

}


function load() {
    askname();

    //player creation
    player = new Player();
    
    //monster and special monster creation
    monstercreation();
    //portal creation
    portalcreation();
    //candy or good thing creation
    goodthingcreation();
    
    //append name to tagname and store for later display
    var newnode=document.createTextNode(this.name);
    document.getElementById("tagname").appendChild(newnode);
}


//create both monsters special and normal
function monstercreation() {
    //define variable
    var j=0;
    while(j<numofmonsters){
        //randomize
        var randx=Math.floor(Math.random() * 450)+100 ;
        var randy=Math.floor(Math.random() * 410)+100 ;
        //choose new point
    var area = new Point(randx, randy);
    
       
    var monster = document.createElementNS("http://www.w3.org/2000/svg", "use");

    monster.setAttribute("y", area.y);

    monster.setAttribute("x", area.x);

    //defined in lab
    document.getElementById("monsters").appendChild(monster);

    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
    //location update to array to be used further in the program
    monsterlocationlist.push(area);
    //direction update
    monsterdirectionlist.push(1);

        ++j;
    }

// create specialMonster again using same rand
    var newrandx=Math.floor(Math.random() * 450)+100;
    var newrandy=Math.floor(Math.random() * 410)+100;

    //specplace location again randomized
    var specplace = new Point(newrandx,newrandy);

    //specialmonster
    var special_monster = document.createElementNS("http://www.w3.org/2000/svg", "use");
    //set both attributes
    special_monster.setAttribute("x", specplace.x);
    special_monster.setAttribute("y", specplace.y);


    //monsters appen
    document.getElementById("monsters").appendChild(special_monster);

    special_monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#special_monster");

    //same push as prev
    monsterlocationlist.push(specplace)

    monsterdirectionlist.push(1);


   
}


//create all good things-10
function goodthingcreation() {
    //variable initialization
    var j=0;
    //while loop run quick
     while(j<10) {
        //checker creates a new point
    var checker = new Point(Math.floor(Math.random() * 550) + 10, Math.floor(Math.random() * 500)+ 10);
        
    if (objectonp(checker, goodthingsize)==0)
        j=j+0;

    else{        

    var goodthing = document.createElementNS("http://www.w3.org/2000/svg", "use");

    goodthing.setAttribute("x", checker.x);
    goodthing.setAttribute("y", checker.y);
    //same as lab
    document.getElementById("goodthings").appendChild(goodthing);


    goodthing.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#goodthing");

    ++j;
    }

    }

}


//portal as 2
function portalcreation() {

    var j=0;
    var a=firstportal;
    

    while(j<2){

    var portal = document.createElementNS("http://www.w3.org/2000/svg", "use");

    var portalposition=new Point(a.x,a.y);

    portal.setAttribute("x", portalposition.x);
    portal.setAttribute("y", portalposition.y);

    document.getElementById("portals").appendChild(portal);
    //same as lab
    portal.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#portal"); 

    a=secondportal;
    ++j;
    
    }

  }

//create exit using a and b when all goodthings are intersected collected
function endcreation(a, b) {
    //same as lab familiarity
    var exitdoor = document.createElementNS("http://www.w3.org/2000/svg", "use");
    //a as x
    exitdoor.setAttribute("x", a);

    //b as y
    exitdoor.setAttribute("y", b);

    //move exit based on this
    document.getElementById("exitdoor").appendChild(exitdoor);
    exitdoor.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#exit"); 

}


//shoot normal bullet or basically player shoot
function normbullet() {

    //set player can shoot to false
    canShootP = 0;
    setTimeout("canShootP = true", SHOOT_INTERVAL);
    //set a timeout and play sound when shooting
    playershootsound.play();


    //decrease by 1
    numofbullets = numofbullets- 1;

    document.getElementById("numofbullet").firstChild.textContent = numofbullets;


    var bullet = document.createElementNS("http://www.w3.org/2000/svg", "use");
    document.getElementById("bullets").appendChild(bullet);
    //use for later to check direction and playerfaceR
    if (playerfaceR==1)
        bullet.setAttribute("direction", "right");
    else 
        bullet.setAttribute("direction", "left");

    bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w/2 - sizeofbullet.w/2);
    bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h/2 - sizeofbullet.h/2);

    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
}

//special bullet of monster shoot and check
function specbullet(face, pos) {
    //monster shoot to zero
    canshootM = 0;
    //bullet get
    var bullet = document.createElementNS("http://www.w3.org/2000/svg", "use");
    //set attributes for comparison
    if (!face){
        bullet.setAttribute("direction", "right");
        document.getElementById("special_bullet").setAttribute("direction","right");
    }

    else {
        bullet.setAttribute("direction", "left");
        document.getElementById("special_bullet").setAttribute("direction","left");
    }
    //To distinguish between normal and special bullet. Define stroke width as 1. Used later better distingusingn.
    bullet.setAttribute("stroke-width", 1);


    bullet.setAttribute("x", pos.x + MONSTER_SIZE.w/2 - sizeofbullet.w/2);
    bullet.setAttribute("y", pos.y + MONSTER_SIZE.h/2 - sizeofbullet.h/2);

    document.getElementById("bullets").appendChild(bullet);


    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#special_bullet");
}


//bullet motion as follows
function motionofbullet() {
    //get the bullet extremely imp
    var bullet = document.getElementById("bullets");
    //run a loop and var j
    for (var j = 0; j < bullet.childNodes.length; j++) {
        var node = bullet.childNodes.item(j);
        //if statement to check whether monster can shoot based on the following conditions
        if (parseInt(node.getAttribute("x")) + speedofbullet > SCREEN_SIZE.w || parseInt(node.getAttribute("x")) - speedofbullet < 0) {
            if (node.getAttribute("stroke-width") == 1 && isalivespec==1)
                            canshootM = 1;

                        //remove child node
            bullet.removeChild(node);
            //decrease by 1 or decrment otherwise check for how bullet moves normally

            j--;
        }
        else 
            if (node.getAttribute("direction") == "left")
                                node.setAttribute("x", parseInt(node.getAttribute("x")) - speedofbullet);

            else 
                                node.setAttribute("x", parseInt(node.getAttribute("x")) + speedofbullet);

    }
}

//motion of the monsters is also essential in the game
function motionofmonsters() {
    //get monster
    var monster = document.getElementById("monsters");
    //declare variables
    var j=0;
    //while loop to calculate
    while (j<monster.childNodes.length){

        var node = monster.childNodes.item(j);
        //set further variables
        var changenice=0;
        var changeit=1;
        //conditions stored in variables
        var firstcheck=parseInt(node.getAttribute("x")) == monsterlocationlist[j].x;
        var secondcheck=parseInt(node.getAttribute("y")) == monsterlocationlist[j].y;


        //if both conditions true assign new values based on this


        if (firstcheck&&secondcheck==true) {
            var reached=true;
            var nice=true;
            //assign x values
            monsterlocationlist[j].x = Math.floor(Math.random() * 500);
            //assign new y val
            monsterlocationlist[j].y = Math.floor(Math.random() * 500);
        }
        //similiar check used for other conditions as well
        var newcheck=parseInt(node.getAttribute("x"));
        //usedas is a tracker variable
        var usedas=1;
        //newcheck greater than collection of lists
         if (newcheck > monsterlocationlist[j].x) {
            node.setAttribute("transform", "");
            //no transform
            node.setAttribute("x", parseInt(node.getAttribute("x")) - speedofmonster);
            //left and therefore direction is zero or left
            monsterdirectionlist[j] = 0;
        }

        //other condition for lower than
         else if (monsterlocationlist[j].x> newcheck  ) {
            node.setAttribute("transform", "scale(-1, 1) translate(-" + 2 * (parseInt(node.getAttribute("x")) + 20) + ",0)");
                //scale based on the above 
            node.setAttribute("x", parseInt(node.getAttribute("x")) + speedofmonster);

            //move right and therefore true or 1
            monsterdirectionlist[j] = 1;

        }
        //set further conditions
        var newnewcheck=parseInt(node.getAttribute("y"));

        //newcheck over 
        if (newnewcheck > monsterlocationlist[j].y)
            node.setAttribute("y", parseInt(node.getAttribute("y")) - speedofmonster);
        //set attribute for left or right based on simple condition
        else if ( monsterlocationlist[j].y>newnewcheck ){
            node.setAttribute("y", parseInt(node.getAttribute("y")) + speedofmonster);
        }

        //last condition for special monster
        
        if (j == monster.childNodes.length - 1)
            break;

        //break and increment
     ++j;
    }

    //if can shoot and is alive move special bullet like this which is essential..
    if (canshootM==1 && isalivespec==1){
    var z=new Point(parseInt(node.getAttribute("x")),parseInt(node.getAttribute("y")));
    specbullet(monsterdirectionlist[j], z);

    }


}


//vertical platform function checker and motion collector
function motionofVERT_PLAT() {
    //get platvertical
    var platvertical = document.getElementById("platvertical");
    var y=parseInt(platvertical.getAttribute("y"));
    //if moving up set attribute to negative and change up to down
    if(verticalplatformup==1) {
        if(y > 80)
            platvertical.setAttribute("y", y - 1);
        else
            verticalplatformup=0;
    }
    //if moving down set attribute to positive and change down to up 
    else {
        if(y < 250)
            platvertical.setAttribute("y", y + 1);
        else
            verticalplatformup = 1;
    }
    //return statement for this. Moves from 80 to 250
    return;
}


//is it alive or not checker func
function isalivespec(){
    isalivespec=0;
}


//collision detection
function collisionDetection() {
    //monster collision detection check for cheatonoroff
    var monsters = document.getElementById("monsters");
    //if off cheat mode then chance for game over if intersection
        if(cheatonoroff==0){
    for (var j = 0; j < monsters.childNodes.length; ++j) {

        var monster = monsters.childNodes.item(j);
        //get monster and check if intersect between monster and player. essential check

        if (intersect(new Point(parseInt(monster.getAttribute("x")), parseInt(monster.getAttribute("y"))), MONSTER_SIZE, player.position, PLAYER_SIZE)) 
            gameover();

    
    }

}


    //bullet detection get the bullet
    var bullets = document.getElementById("bullets");
    //run a loop essentially....
    for (var j = 0; j < bullets.childNodes.length; ++j) {
        //get bullet and its attributes
        var bullet = bullets.childNodes.item(j);
        var x=parseInt(bullet.getAttribute("x"));
        var y=parseInt(bullet.getAttribute("y"));

        var bulletposition = new Point(x, y);
        //special bullet condition cheat mode check if false and intersect equals 1 game over
        if(cheatonoroff==0){

        if(bullet.getAttribute("stroke-width") == "1"){
            if (intersect(bulletposition, sizeofbullet, player.position, PLAYER_SIZE)==1)
            gameover();

         }

        }

        //go back until you reach another part to check all the monsters and bullets until spec
        var h=(bullet.getAttribute("stroke-width") == "1");
        if (h==1)
            continue;   

        //reset loop conditions and carry out the following based on this
        var z=0;
        while(z<monsters.childNodes.length){
            //get monster from nodes
            var monster = monsters.childNodes.item(z);

            var newposx=parseInt(monster.getAttribute("x"));
            var newposy=parseInt(monster.getAttribute("y"));
            //derive pos
            var monsterposition = new Point(newposx, newposy);    

                //if bullet and monster intersect play sound and delete a monster
            if (intersect(bulletposition, sizeofbullet, monsterposition, MONSTER_SIZE)){

                monsterdiessound.play();

                //killed special monster
                var wonderspecial=0;
                var wonderwhat=1;
                //check for special monster
                var lastval= monsters.childNodes.length +0-1;

                //remove monster

                monsters.removeChild(monster);
                monsterlocationlist.splice(z, 1);

                monsterdirectionlist.splice(z, 1);
                bullets.removeChild(bullet);
                j=j+0;
                j=j-1;
                z=z+0;
                z=z-1;
                //special monster condition
                if (z == lastval)
                    break;
                //addition of score
                score=score+monsterpoints+0;
                //get points and display
                document.getElementById("points").firstChild.textContent = score;
            }
            ++z;
        }
        isalivespec=0;
    }

    //get good things or candies
    var goodthings = document.getElementById("goodthings");
    //set variable x
    var x=0;
    //run while
    while(x<goodthings.childNodes.length){

        var goodthing = goodthings.childNodes.item(x);
        var posx=parseInt(goodthing.getAttribute("x"));
        var posy=parseInt(goodthing.getAttribute("y"));
        var goodthing_position = new Point(posx,posy);
        //does not intersect increment
        if (!intersect(goodthing_position, goodthingsize, player.position, PLAYER_SIZE)) {
                    x=x+1;
           
        }

        //if intersection get a new score by adding 
        else{
         score = score+ goodpoints;
            document.getElementById("points").firstChild.textContent = score;
            //removal will be this to get rid of one good thing intersected
            goodthings.removeChild(goodthing);
            x=x-1;
        }
    }


 
    //portal trasnfer from first to second
    if (intersect(firstportal, portalsize, player.position, PLAYER_SIZE)) {
        if(teleport==1){
        var newposx;
        var newdd;
        //set timeout and move to second portal if intersection occurs
        teleport = 0;
        player.position = secondportal;
        //this helps to keep a wait
        setTimeout("teleport = true", teleportINT);
    }
    }

    //vice versa for other check from second to first
    if (intersect(secondportal, portalsize, player.position, PLAYER_SIZE)) {
        if(teleport==1){
        var newposx;
        var newdd;
        //firstportal player position is nicely set
        player.position = firstportal;
                teleport = 0;
                //set timeout to be true based on such a condition
        setTimeout("teleport = true", teleportINT);
    }
    }



//exit door collection for level up and gameplay

    var exit = document.getElementById("exitdoor");
    if(intersect(exitpos, sizeofexit, player.position, PLAYER_SIZE)){

        var childexit=exit.childNodes.length;
        if (childexit <0 || childexit==0 )
            return;

        else{
            exitsound.play();
             levelup();
         }

}



//end
}

function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            player.motion = motionType.LEFT;

            playerfaceR = 0;
            break;

        case "D".charCodeAt(0):
            player.motion = motionType.RIGHT;

            playerfaceR = 1;
            break;


        case "W".charCodeAt(0):
            if (player.isOnPlatform()==1)
                player.verticalSpeed = upspeed;
            break;

        case "H".charCodeAt(0):
            if (canShootP==1  && (numofbullets > 0 || cheatonoroff)==1 )
                normbullet();
            break;
        
        case "C".charCodeAt(0):
            document.getElementById("cheat").firstChild.textContent = "On";

            cheatonoroff = 1;
            break;

        case "V".charCodeAt(0):
            document.getElementById("cheat").firstChild.textContent = "Off";

            cheatonoroff = 0;
            break;      


    }


    //end key functioning
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case "D".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}

//from lab



//level up or move to next level
function levelup() {
    //pause background

    backgroundSound.pause();
    //clear intervals
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    //reset interval values
    gameInterval = null;
    timeInterval = null;

    //same thing reset everything except scores
    document.removeEventListener("keydown", keydown, false);
    document.removeEventListener("keyup", keyup, false);

//object reset using while loops
    var monsters = document.getElementById("monsters");
    while(monsters.childNodes.length!=0)
        monsters.removeChild(monsters.childNodes.item(0));
    
        //bullet 
    var bullets = document.getElementById("bullets");
    while (bullets.childNodes.length != 0)
        bullets.removeChild(bullets.childNodes.item(0));
        //candy reset
    var goodthings = document.getElementById("goodthings");
    while (goodthings.childNodes.length != 0)
        goodthings.removeChild(goodthings.childNodes.item(0));

        //current level incremented and displayed
    currentLevel ++;
    document.getElementById("level").firstChild.textContent = currentLevel;


    //set g if length equals zero
    if (document.getElementById("exitdoor").childNodes.length == 0)
        var g=0;
    else
        document.getElementById("exitdoor").removeChild(document.getElementById("exitdoor").childNodes.item(0));

    if(currentLevel==1)
        var unchanged=true;
    //addition of scores if level greater than one
    else if (currentLevel > 1) {
        var timetotalpoint=timepoints*timeleft;
        var scoreofcurrlevel= SCORE_currentLevel*(currentLevel-1);
        score =score+ scoreofcurrlevel+timetotalpoint;
        document.getElementById("points").firstChild.textContent = score;
        //dislay new score
    }

//Normal mode or back to square one

    player.position = PLAYER_INIT_POS;

    document.getElementById("tagname").removeChild(document.getElementById("tagname").childNodes.item(0));

    playerfaceR = 1;
    canShootP = 1;
    numofbullets = 8;
    document.getElementById("numofbullet").firstChild.textContent = numofbullets;

    //1
    playerfaceR = 1;
    canShootP = 1;

    //candies to 10
    goodthingnum = 10;
    verticalplatformup = 1;

    //score using formulae
    var eachlevelmonster=4*(currentLevel-1);

    //monsters using formulae
    numofmonsters = 6 + eachlevelmonster;
    //new array
    monsterlocationlist = [];
    //similiar
    monsterdirectionlist = [];

    canshootM = 1;
    isalivespec = 1;

    //time back to 120 seconds
    timeleft = 120;
    document.getElementById("time").firstChild.textContent = timeleft;
    //back to no cheat mode since reset
    cheatonoroff = 0;
    document.getElementById("cheat").firstChild.textContent = "Off";

    //battle sign next level
   
    document.getElementById("battlesign").firstChild.textContent="Next Level";
    
    document.getElementById("platdisappear" + 0).setAttribute("opacity", 1);
    document.getElementById("platdisappear" + 1).setAttribute("opacity", 1);
    document.getElementById("platdisappear" + 2).setAttribute("opacity", 1);

        //visibile initial page
    document.getElementById("initialpageshown").style.setProperty("visibility", "visible", null);

        //reset and back apart from score
    load();



}


//check time left. Same for normal or cheatMode
function checktime(){
    if (timeleft == 0 || timeleft<0 ){
            return 1;
}
return 0;
//this is used later for functioning
}



function gamePlay() {

    collisionDetection();

    document.getElementById("time").firstChild.textContent = timeleft;

    if (checktime()==1){
        gameover();
    }

    var goodthings = document.getElementById("goodthings");

    if (goodthings.childNodes.length == 0 ){
        if(document.getElementById("exitdoor").childNodes.length == 0)
                endcreation(exitpos.x, exitpos.y);
    }

    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();
    
    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT)
        displacement.x = -MOVE_DISPLACEMENT;
    if (player.motion == motionType.RIGHT)
        displacement.x = MOVE_DISPLACEMENT;

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT ;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;

    motionofmonsters(); //move monst

    motionofVERT_PLAT(); //calculate all

    motionofbullet(); //move my bullet

    objectondp(player.position, player.motion, PLAYER_SIZE); //check disappear

    updateScreen();         //update essential for direction change
}



//update position of player monsters and bullet crucial
function updateScreen() {
    // Transform the player
    player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
    //player face right shoot bullet to the right as well as player face right
    if (playerfaceR) {
        document.getElementById("playerpacman").setAttribute("transform", "");
        document.getElementById("bullet").setAttribute("transform", "scale(0.4,0.4)");

    }
    //otherwise transform both using formula in lab
    else {
        document.getElementById("playerpacman").setAttribute("transform", "scale(-1, 1) translate(-" + PLAYER_SIZE.w + ",0)");
        document.getElementById("bullet").setAttribute("transform", "scale(-0.4, 0.4) translate(-" + sizeofbullet.w + ",0)");

    }
    //special bullet direction when shot
    var specialbulletcheck=document.getElementById("special_bullet").getAttribute("direction");
    //if special bullet shot when special monster faces right will face right or vice versa
    if(specialbulletcheck=="right")
        document.getElementById("special_bullet").setAttribute("transform", "scale(0.6,0.6)");

    else 
    document.getElementById("special_bullet").setAttribute("transform", "scale(-0.6, 0.6) translate(-" + sizeofbullet.w + ",0)");
      


   
}


var display_number = 5;            //Max 5 users to show. Top Top
var is_name_added = 0;         // is name added =0 if not current added
var is_score_added = 0;        //similar for score

//game over based on above conditions
function gameover() {
    //back sound pause

    backgroundSound.pause();
    //play game over
    gameoversound.play();


    //set few conditions
    var gamehasended=1;
    var gamehasnotended=0;


    //reset conditions of start as simple as that
    clearInterval(gameInterval);
    clearInterval(timeInterval);




    document.removeEventListener("keydown", keydown, false);
    document.removeEventListener("keyup", keyup, false);



    //get high score
    var highscoretable1 = getHighScoreTable();

    var namehigh=this.name;
    var scorehigh=parseInt(this.score);
    //create record based on lab
    var record = new ScoreRecord(namehigh, scorehigh);

    //new on or off
    var isnewon=0;

    var position=highscoretable1.length;

    var j=0
    while(j<highscoretable1.length){
        if (record.score > highscoretable1[j].score) {
            //get the j position and splice based on that
            position = j;

            highscoretable1.splice(position, 0, record);

            isnewon=1;
            break;
        }
       ++j;
    }


    //display top 5 only by checking length and newon
    if (highscoretable1.length < 5){
            if(isnewon==0) 
             highscoretable1.splice(highscoretable1.length, 0, record);

    }

    //reset timefound 
    var timefound=false;
    var timelapse=true;
    //put current level as 0 to change later
    currentLevel = 0;
    document.getElementById("level").firstChild.textContent= currentLevel;
    //score back to zero
    score = 0;
    document.getElementById("points").firstChild.textContent = score;

        //zero
    is_score_added = 0;
        //zero
    is_name_added = 0;

        //set and show based on lab
    setHighScoreTable(highscoretable1);
    showHighScoreTable(highscoretable1, namehigh, scorehigh);

   



}






function ScoreRecord(name, score) {
    this.name = name;
    this.score = score;
}


function getHighScoreTable() {
    var table = new Array();

    for (var i = 0; i < display_number; ++i) {
        
        // Contruct the cookie name
        // Get the cookie value using the cookie name
        var value = getCookie("player" + i);

        if (value == null)
            break;
        else
            var record = value.split("~");

        // Add a new score record at the end of the array
        table.push(new ScoreRecord(record[0], parseInt(record[1])));
    }

    return table;
}

    

function setHighScoreTable(table) {
    for (var i = 0; i < display_number; ++i) {
        // If i is more than the length of the high score table exit
        // from the for loop
        if (i >= table.length) break;

        // Contruct the cookie name
        var name="player" + i;
        // Store the ith record as a cookie using the cookie name
        setCookie(name, table[i].name + "~" + table[i].score);
    }
}
  

function clearHighScoreTable() {
    var highScoreTable = getHighScoreTable();
    for (var i = 0; i < highScoreTable.length; ++i) {
        var name = "player" + i;
        deleteCookie(name);
    }
}



//add high score entry

function addHighScore(record, node, nameofplayer, scoreofplayer) {

    // Create the name text span
    var name = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

    // Set the attributes and create the text
    name.setAttribute("x", 100);
    name.setAttribute("dy", 40);
    var firstcondition= (nameofplayer == record.name );
    var secondcondition=(scoreofplayer==record.score);

    var thirdcondition= is_name_added;
    if (firstcondition && secondcondition && thirdcondition==0) {
        var changetheme=0;
        var changenow=1;
        //set propert of recent input to green
        name.style.setProperty("fill", "green", null);
        //name added changed to 1
        is_name_added = 1;
    }
    name.appendChild(document.createTextNode(record.name));

    // Add the name to the text node
    node.appendChild(name);

    // Create the score text span
    var score = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

    // Set the attributes and create the text

    var fourthcondition= is_score_added;

    score.setAttribute("x", 400);
    if (firstcondition && secondcondition && fourthcondition==0) {
        //same property as green
        score.style.setProperty("fill", "green", null);
        //score added set to 1 or true
        is_score_added = 1;
    }


    score.appendChild(document.createTextNode(record.score));

    // Add the score to the text node
    node.appendChild(score);
}


    

function showHighScoreTable(table, name, score) {
    // Show the table
    var node = document.getElementById("maxscoresdisplay");
    node.style.setProperty("visibility", "visible", null);

    // Get the high score text node
    var node = document.getElementById("texthighpoints");
    
    for (var i = 0; i < display_number; i++) {
        // If i is more than the length of the high score table exit
        // from the for loop
        if (i >= table.length) break;

        // Add the record at the end of the text node
        addHighScore(table[i], node, name, score);
    }
}


// Reset the high score tabel and use a loop in specific while
function resetHighScoreTable() {
    
    var removehigh = document.getElementById("texthighpoints");

    while (removehigh.childNodes.length > 0)
        removehigh.lastChild.remove();


}



function setCookie(name, value, expires, path, domain, secure) {
    var curCookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
    document.cookie = curCookie;
}



function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else
        begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
        end = dc.length;
    return unescape(dc.substring(begin + prefix.length, end));
}



function deleteCookie(name, path, domain) {
    if (get_cookie(name)) {
        document.cookie = name + "=" + 
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}






