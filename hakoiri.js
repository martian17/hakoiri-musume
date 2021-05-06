/*
22
22 ... daughter

3
4  ... 2 high block

56 ... 2 wide block

7  ... atomic block

0  ... blank space
*/



var rules = [
    //global flag is set because there could be multiple mathes for smaller blocks (atomic blocks for example)
    
    //daughter moves
    //daughter left shift
    [/022(..)022/g,"220${0}220"],
    //daughter right shift
    [/220(..)220/g,"022${0}022"],
    //daughter down shift
    [/22(...)22(...)00/g,"00${0}22${1}22"],
    //daughter up shift
    [/00(...)22(...)22/g,"22${0}22${1}00"],
    
    //2 high moves
    //2 high left shift
    [/03(...)04/g,"30${0}40"],
    //2 high right shift
    [/30(...)40/g,"03${0}04"],
    //2 high down shift
    [/3(....)4(....)0/g,"0${0}3${1}4"],
    //2 high up shift
    [/0(....)3(....)4/g,"3${0}4${1}0"],
    
    //2 wide moves
    //2 wide left shift
    [/056/g,"560"],
    //2 wide right shift
    [/560/g,"056"],
    //2 high down shift
    [/56(...)00/g,"00${0}56"],
    //2 high up shift
    [/00(...)56/g,"56${0}00"],
    
    //atomic moves
    //atomic left shift
    [/07/g,"70"],
    //atomic right shift
    [/70/g,"07"],
    //atomic down shift
    [/7(....)0/g,"0${0}7"],
    //atomic up shift
    [/0(....)7/g,"7${0}0"],
    
    
    
    
    
    
    //double moves
    //daughter moves
    //daughter left shift
    [/0022(.)0022/g,"2200${0}2200"],
    //daughter right shift
    [/2200(.)2200/g,"0022${0}0022"],
    //daughter down shift
    [/22(...)22(...)00(...)00/g,"00${0}00${1}22${2}22"],
    //daughter up shift
    [/00(...)00(...)22(...)22/g,"22${0}22${1}00${2}00"],
    
    //2 high moves
    //2 high left shift
    [/003(..)004/g,"300${0}400"],
    //2 high right shift
    [/300(..)400/g,"003${0}004"],
    //2 high down shift
    [/3(....)4(....)0(....)0/g,"0${0}0${1}3${2}4"],
    //2 high up shift
    [/0(....)0(....)3(....)4/g,"3${0}4${1}0${2}0"],
    
    //2 wide moves
    //2 wide left shift
    [/0056/g,"5600"],
    //2 wide right shift
    [/5600/g,"0056"],
    //2 high down shift
    [/56(...)00(...)00/g,"00${0}00${1}56"],
    //2 high up shift
    [/00(...)00(...)56/g,"56${0}00${1}00"],
    
    //atomic moves
    //atomic left shift
    [/007/g,"700"],
    //atomic right shift
    [/700/g,"007"],
    //atomic down shift
    [/7(....)0(....)0/g,"0${0}0${1}7"],
    //atomic up shift
    [/0(....)0(....)7/g,"7${0}0${1}0"]
];




var solve = function(state){
    //equivalent to breadth-first recursive search
    var states = [state];
    var previousStates = {};//bread crumbs when it's all done
    previousStates[state] = null;//root of everything
    var itr = 0;
    while(itr < states.length){
        state = states[itr];
        itr++;
        if(itr > 1000000){
            console.log("infinite loop detected!");
            return false;
        }
        //could have done state = states[itr++]; but it's harder to read
        //for every rules in existence
        for(var i = 0; i < rules.length; i++){
            var rule = rules[i];
            var matches = state.matchAll(rule[0]);
            var currentMatch = matches.next();
            //iterating through every possible matches of a particular rule
            while(!currentMatch.done){
                var v = currentMatch.value;
                //constructing the replacement string
                var replacementString = rule[1];
                //console.log("matched:    "+v[0]);
                //console.log("replstring: "+replacementString);
                for(var j = 1; j < v.length; j++){
                    //console.log(replacementString);
                    replacementString = replacementString.replace("${"+(j-1)+"}",v[j]);
                    //console.log(replacementString);
                    //because javascript string is immutable
                }
                //creating a new state
                var newState = 
                state.substr(0,v.index)+
                replacementString+
                state.substr(v.index+replacementString.length,state.length);
                if(!(newState in previousStates)){
                    previousStates[newState] = state;
                    states.push(newState);
                }
                //check if the newly created string is the solution
                if(newState.match(/22._.22.$/)){
                    //yes! found a solution!
                    state = newState;
                    var solution = [];
                    while(previousStates[state] !== null){
                        solution.push(state);
                        state = previousStates[state]
                    }
                    //don't forget the first state:) Wish there were do..while() loops in JavaScript
                    solution.push(state);
                    console.log("iterations taken: "+itr);
                    console.log("number of steps: "+solution.length);
                    return solution.reverse()/*.map(a=>a.replace("_","\n"))*/;//very functional indeed
                }
                var currentMatch = matches.next();
            }
        }
        //console.log(states);
    }
    console.log("found no solution;へ;");
    return [];
}


var state = 
"\
3223_\
4224_\
3563_\
4774_\
7007";
/*"\
0220_\
7220_\
7560";*/

var result = solve(state);
console.log(
    (result.map(a=>a.split("_").map(b=>b.split("").join("")).join("\n")).join("\n V\n"))
    .split("").map(
        a=>{
            switch(a){
                case "2":
                return "\u001b[41m2";
                case "3":
                return "\u001b[42m3";
                case "4":
                return "\u001b[42m4";
                case "5":
                return "\u001b[44m5";
                case "6":
                return "\u001b[44m6";
                case "7":
                return "\u001b[43m7";
                default:
                return "\u001b[0m"+a;
            }
        }
    ).join("")+"\u001b[0m"
    /*replace(/2/g,"\u001b[41m2").
    replace(/3/g,"\u001b[42m2").
    replace(/4/g,"\u001b[42m2").
    replace(/5/g,"\u001b[44m2").
    replace(/6/g,"\u001b[44m2").
    replace(/7/g,"\u001b[43m7").
    replace(/0/g,"\u001b[0m0").
    replace(/_/g,"\u001b[0m_").
    replace(/\n/g,"\u001b[0m\n")*/
);
