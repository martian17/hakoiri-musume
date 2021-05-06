/*
22
22 ... daughter

3
4  ... 2 high block

55 ... horizontal

6  ... atomic block

0  ... blank space
*/


var state = "3223_4224_3553_4664_6016"

var rules = [
    //daughter move left
    //global flag because there could be multiple mathes for smaller blocks
    //daughter left shift
    [/022(..)022/g,"220${0}220"]
    //daughter right shift
    [/220(..)220/g,"022${0}022"]
    //daughter down shift
    [/22(...)22(...)00/g,"00${0}"]
    
    [/022(._)022/g,"220${0}220"]
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
        if(itr > 1000){
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
                for(var j = 1; j < v.length; j++){
                    replacementString = replacementString.replaceAll("${"+(j-1)+"}",v[j]);
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
                    return solution.reverse();//very functional indeed
                }
                var currentMatch = matches.next();
            }
        }
    }
    console.log("found no solution;へ;");
    return [];
}


while(true){
    var mutations = [];
    
}

