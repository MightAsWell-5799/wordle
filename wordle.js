var Answers = require("./puzzleWordsOut.json")
var GuessWords = require("./goodWords3.json")



//input is the guess and puzzle is the answer 
const check = (input, puzzle) => {
    let results = []
    input.split('').forEach((letter, index) => {
        if (puzzle[index] === letter) {
            results.push(2)
        } else if (puzzle.includes(letter)) {
            results.push(1)
        } else {
            results.push(0)
        }
    })
    return results
}

var goodSet = new Set()
var badSet = new Set()
var Wordle = new Array(5).fill("")
var unSet = new Array(5).fill("")
unSet.forEach((v, index) => {
	unSet[index] = new Set()
})


var word = "apple"
var guess = "tests"
var test = check(guess, word)
console.log(test)


guess.split("").forEach((letter, index) => { 
    if(test[index] == 2) {
        Wordle[index] = letter
    } else if (test[index] == 1) {
        goodSet.add(letter)
        unSet[index].add(letter)
    } else {
        badSet.add(letter)
    }
})


console.log({goodSet, badSet, Wordle, unSet})