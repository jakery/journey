/* 

Congratulations, you found the Password array.

Fun fact: I was going to make a web service to securely authenticate
these passwords on the server-side, but then thought to myself, "It's just a
video game."

Therefore, here's your reward for delving into the source code.

*/



var password = [

    "title",        //  00
    "level1",       //  01
    "level2",       //  02
    "level3",       //  03
    "level4",       //  04
    "level5",       //  05
    "keyhole",      //  06
    "chip",         //  07
    "brown",        //  08
    "swimtime",     // 09
    "buttontime",//10
    "bounce",   // 11
           
    "balltrap",         //  1
    "fat",        //  1
    "diamond",         //  1
    "trimaze",    //  1
                    //  1
    "pushandgo",      //  1

    "cockney",       //  1
    "normal",     //  1
    "whiskey",      //  1
    "tango",        // 
    "foxtrot",      // 
    "trapdoors",     // 
    "macho",     // 
    "yellow",      // 
    "throwaway",   // 
    "brownies",        // 
    "what",      // 
    "thinkpush",    // 
    "lamancha",        // 
    "cutbacks",      // 
    "buttonwalk",         // 
    "capsule",   // 
    "japan",        // 
    "hardcore",      // 
    "wave",        // 
    "guard",         // 
    "guide",
    "asthma",
    "queue",
    "maybeloop",
    "conan",
    "slant",
    "swearwords",
    "machine",
    "serious",
    "gameover",
    "enhance",
    "roidstrong",
    "cardio",
    "mine",
    "exiting",
    "island",
    "level1",
    "what",

    "waitjack"      // titanic
// 

];

function processPassword() {


    enteredPassword = enteredPassword.toLowerCase();


    // Begins with "level" & is not "level1 - level5"
    // TODO: There's probably a good way to refactor this into a single Regex statement, but I've got bigger fish to fry.
    if (enteredPassword != "level" && enteredPassword.indexOf("level") == 0 && enteredPassword.match(/^level[1-5]\s*$/g) == null) {

            // CHEATER!

        game.level = -10000;
        loadMap(game.level);


    } else {

        // Derp. Stay in school, kids.
        if (enteredPassword == "athsma") {
            enteredPassword = "asthma";
        }

        var passwordLevel = password.indexOf(enteredPassword);

        if (passwordLevel == -1) {
            // Bad password.
            game.passwordHudMessage = "That ain't no password.";

        } else {

            // Good password.
            game.level = passwordLevel;
            loadMap(game.level);
            game.passwordHudMessage = "";
            
        }
    }

    // Clear entered password.
    enteredPassword = "";
    
}           

      