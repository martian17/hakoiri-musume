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
    //global flag is set because there could be multiple matches for smaller blocks (atomic blocks for example)
    
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
    [/0(....)7/g,"7${0}0"]
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
                    console.log("number of steps: "+(solution.length-1));//-1 because it also includes the first state
                    return solution.reverse()/*.map(a=>a.replace("_","\n"))*/;//very functional indeed
                }
                var currentMatch = matches.next();
            }
        }
        //console.log(states);
    }
    console.log("found no solution;へ;");
    return [];
};








var diffStr = function(a,b){
    var diff = [];
    for(var i = 0; i < a.length; i++){
        if(a[i] === b[i]){
            diff[i] = "0";
        }else{
            diff[i] = "1";
        }
    }
    return diff.join("");
};


var simplifyMoves = function(moves){
    var newMoves = [moves[0]];
    var diff = diffStr(moves[0],moves[0]);
    for(var i = 0; i < moves.length-1; i++){
        //if you find an overlap in the diff, the move can be simplified
        var move = moves[i];
        var move1 = moves[i+1];
        var diff1 = diffStr(move,move1);
        var diff0 = diff;
        diff = diff1;
        console.log(diff);
        //now we can deal with diff and diff0
        var flag = false;
        for(var j = 0; j < diff.length; j++){
            if(diff[j] === "1" && diff0[j] === "1"){
                //found double diff! continuing without pushing to newMoves
                flag = true;
                break;
            }
        }
        if(!flag){
            newMoves.push(move1);
        }
    }
    return newMoves;
};

var cleanInput = function(input){
    return input.split("\n").map(a=>a.replace(/\#.*$/,"").trim());
};

var absorbWhiteLines = function(input,i){
    //consume all the white lines
    for(i; i < input.length; i++){
        if(input[i] !== ""){
            break;
        }
    }
    return i;
};

var parseInput = function(input){
    //getting rid of comments
    //and cleaning the input
    input = cleanInput(input);
    var state = "";
    var stateWidth = 0;
    var types = [];
    var wincond = "";
    var i = 0;
    
    //consume all the white lines
    i = absorbWhiteLines(input,i);
    for(i; i < input.length; i++){
        if(input[i] === ""){
            //if line break go to the next section
            break;
        }
        //adding onto the state
        stateWidth = input[i].length;
        state += input[i]+"_"
    }
    state = state.slice(0,-1);
    
    
    
    //the type section
    //consume all the white lines
    i = absorbWhiteLines(input,i);
    //set the default values
    if(i === input.length){
        //add on the default value
        input = cleanInput(`
            娘娘_娘娘
            家_族
            番頭
            子`);
        i = 0;
    }
    for(i; i < input.length; i++){
        if(input[i] === ""){
            //if line break go to the next section
            break;
        }
        types.push(input[i]);
    }
    
    
    //the winning condition (terminator) section
    //consume all the white lines
    i = absorbWhiteLines(input,i);
    //set the default values
    if(i === input.length){
        //add on the default value
        //might generalize this part as well in production
        input = cleanInput("娘娘._.娘娘.");
        i = 0;
    }
    for(i; i < input.length; i++){
        if(input[i] === ""){
            //if line break go to the next section
            break;
        }
        terminator = input[i];//the winning condigion
    }
    
    
    return [state,stateWidth,types,terminator];
};

var assignLetters = function(state,stateWidth,types,terminator){
    //creating the letter set that's going to be used
    var letterSet = [];
    for(var i = 0; i < 26; i++){
        letterSet.push(String.fromCharCode(65+i));
        letterSet.push(String.fromCharCode(97+i));
    }
    for(var i = 0; i < types.length; i++){
        var type = types[i];
        var regstring = "";
        //gonna generate up down left right regex string
        for(var j = 0; j < type.length; j++){
            if(type[j] === "_"){
                
            }else if(type[j] === "."){
                
            }
        }
    }
}


var solveHakoiri = function(input){
    var [state,stateWidth,types,wincond] = parseInput(input);
    console.log([state,stateWidth,types,wincond]);
    /*
    //assigning unicode letters to each types
    //and creating the rule table
    var rules = [];
    for(var i = 0; i < types.length; i++){
        var type = types[i];
        type
    }
    */
};





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

//because we are doing a text based approach, we do it in style!
solveHakoiri(`
    # 元のステート図
    家娘娘家
    族娘娘族
    家番頭家
    族子子族
    子・・子
    
    # 空行の後はカスタムブロックの定義ができる（オプショナル）
    娘娘_娘娘
    家_族
    番頭
    子
    
    # 最後に勝利コンディション！
    娘娘._.娘娘.
`);





/*
var result = solve(state);
var result1 = simplifyMoves(result);
console.log(result1.length-1);
console.log(
    (result.map(a=>a.split("_").map(b=>b.split("").join("")).join("\n")).join("\n   V\n"))
    .split("").map(
        a=>{
            switch(a){
                case "2":
                return "\u001b[41m娘";
                case "3":
                return "\u001b[42m家";
                case "4":
                return "\u001b[42m族";
                case "5":
                return "\u001b[44m番";
                case "6":
                return "\u001b[44m頭";
                case "7":
                return "\u001b[43m子";
                case "0":
                return "\u001b[0m　";
                default:
                return "\u001b[0m"+a;
            }
        }
    ).join("")+"\u001b[0m"
);*/

