var Answers = require("./puzzleWordsOut.json").words
var issues = [
	{ word: "shame", scorePos: 1 },
	{ word: "shape", scorePos: 1 },
	{ word: "swore", scorePos: 1 },
	{ word: "sneer", scorePos: 1 },
	{ word: "grave", scorePos: 1 },
	{ word: "sweet", scorePos: 1 },
	{ word: "steer", scorePos: 1 },
	{ word: "graze", scorePos: 1 },
	{ word: "sleep", scorePos: 1 },
	{ word: "fried", scorePos: 1 },
	{ word: "grove", scorePos: 1 },
	{ word: "drove", scorePos: 1 },
	{ word: "fable", scorePos: 1 },
	{ word: "erode", scorePos: 1 },
	{ word: "folly", scorePos: 1 },
	{ word: "waste", scorePos: 1 },
	{ word: "eagle", scorePos: 1 },
	{ word: "water", scorePos: 1 },
	{ word: "eater", scorePos: 1 },
	{ word: "hater", scorePos: 1 },
	{ word: "spout", scorePos: 1 },
	{ word: "joist", scorePos: 1 },
	{ word: "holly", scorePos: 1 },
	{ word: "gayer", scorePos: 1 },
	{ word: "foyer", scorePos: 1 },
	{ word: "eager", scorePos: 1 },
	{ word: "waver", scorePos: 1 },
	{ word: "mover", scorePos: 1 },
	{ word: "rover", scorePos: 1 },
	{ word: "sweep", scorePos: 1 },
	{ word: "skill", scorePos: 1 },
	{ word: "gazer", scorePos: 1 },
	{ word: "fever", scorePos: 1 },
	{ word: "vaunt", scorePos: 1 },
	{ word: "wafer", scorePos: 1 },
	{ word: "mower", scorePos: 1 },
	{ word: "rower", scorePos: 1 },
	{ word: "homer", scorePos: 1 },
	{ word: "jolly", scorePos: 1 },
	{ word: "hover", scorePos: 1 },
	{ word: "jaunt", scorePos: 1 },
	{ word: "willy", scorePos: 1 },
	{ word: "spell", scorePos: 1 },
	{ word: "hilly", scorePos: 1 },
	{ word: "swell", scorePos: 1 },
	{ word: "refer", scorePos: 1 },
	{ word: "smell", scorePos: 1 },
	{ word: "fixer", scorePos: 1 },
	{ word: "hazel", scorePos: 1 },
	{ word: "joker", scorePos: 1 },
	{ word: "kitty", scorePos: 1 },
	{ word: "wound", scorePos: 1 },
	{ word: "steam", scorePos: 1 },
	{ word: "hound", scorePos: 1 },
	{ word: "oaken", scorePos: 1 },
	{ word: "awash", scorePos: 1 },
	{ word: "puppy", scorePos: 1 },
	{ word: "watch", scorePos: 1 },
	{ word: "grown", scorePos: 1 },
	{ word: "hatch", scorePos: 1 },
	{ word: "husky", scorePos: 1 },
	{ word: "puffy", scorePos: 1 },
	{ word: "lunch", scorePos: 1 },
	{ word: "witch", scorePos: 1 },
	{ word: "hunch", scorePos: 1 },
	{ word: "hitch", scorePos: 1 },
	{ word: "udder", scorePos: 1 },
	{ word: "wight", scorePos: 1 },
	{ word: "gamma", scorePos: 1 },
	{ word: "magma", scorePos: 1 },
	{ word: "offer", scorePos: 1 },
	{ word: "night", scorePos: 1 },
]
var GuessWords = require("./goodWords3.json").words
const logging = false
function log(string) {
	if (logging) console.log(string)
}
//input is the guess and puzzle is the answer
const check = (input, puzzle) => {
	let results = []

    if (input == puzzle) return 4
	try {
		input.split("").forEach((letter, index) => {
			if (puzzle[index] === letter) {
				results.push(2)
			} else if (puzzle.includes(letter)) {
				results.push(1)
			} else {
				results.push(0)
			}
        })
        log(`${input}\n${results}\n${Wordle}`)
	} catch (e) {
		log("puzzle: " + puzzle + " input: " + input + " error: " + e.message)
		log(input)
		process.exit(1)
	}
	return results
}

function filterWords(goodSet, badSet, words) {
	var secondTier = []
	var thirdTier = []
	var fourthTier = []
	var fifthTier = []
	words.forEach((word) => {
		var i = 0
		if (goodSet.size == 0) {
			secondTier.push(word)
		} else {
			goodSet.forEach((letter) => {
				if (word.word.split("").includes(letter)) {
					i++
					if (i == goodSet.size) {
						secondTier.push(word)
					}
				}
			})
		}
	})
	secondTier.forEach((word) => {
		var j = 0
		var wArray = word.word.split("")

		wArray.forEach((value, index) => {
			if (!badSet.has(value)) {
				j++

				if (j == 5) {
					thirdTier.push(word.word)
				}
			} else if (Wordle[index] == value) {
				j++
				if (j == 5) {
					thirdTier.push(word.word)
				}
			}
		})
	})
	thirdTier.forEach((word) => {
		var k = 0
		word.split("").forEach((letter, index) => {
			if (letter == Wordle[index]) {
				k++
			} else if (Wordle[index] == "") {
				k++
			}
			if (k == 5) {
				fourthTier.push(word)
			}
		})
    })
    log({goodSet, badSet})
	fourthTier.forEach((word) => {
		var l = 0
		word.split("").forEach((letter, index) => {
			if (unSet[index].has(letter)) {
				l++
			}
		})
		if (l == 0) {
			fifthTier.push(word)
		}
	})

	return fifthTier
}

function updateLists(response, guess) {
	guess.split("").forEach((letter, index) => {
		if (response[index] == 2) {
            Wordle[index] = letter
            goodSet.add(letter)
		} else if (response[index] == 1) {
			goodSet.add(letter)
			unSet[index].add(letter)
		} else {
			badSet.add(letter)
		}
	})
	usedWords.push(guess)
}
var usedWords = []
var goodSet = new Set()
var badSet = new Set()
var Wordle = new Array(5).fill("")
var unSet = new Array(5).fill("")
unSet.forEach((v, index) => {
	unSet[index] = new Set()
})

var turn = 0
var wins = 0
var winz = 0
var loses = 0
var badWords = []
function game(NewWord, wordIn) {
    
	if (turn == 7) {
        loses++
        console.log(winz)
        winz = 0
		badWords.push(wordIn)
		return
	}
	var word = wordIn.word
	if (NewWord) {
		var word = wordIn.word
		var guess1 = filterWords(goodSet, badSet, GuessWords)
		var firstWord
		for (let i = 0; i < guess1.length; i++) {
			if (new Set(guess1[i].split("")).size == 5) {
				firstWord = guess1[i]
				break
			}
        }
        
		var response = check(firstWord, word)
		if (response == 4) {
            wins++
            winz++
			turn = 0
		} else {
			updateLists(response, firstWord)
			turn++
			game(false, word)
		}
	} else {
		var guess
		var guess2 = []
		var guess1 = filterWords(goodSet, badSet, GuessWords)
		var possibilities = filterWords(goodSet, badSet, Answers)
        var filterGuesses = reduceGuess(goodSet, badSet, possibilities)
		if (turn == 1) {
			for (let i = 0; i < guess1.length; i++) {
				if (new Set(guess1[i].split("")).size == 5) {
					guess2.push(guess1[i])
				}
			}
			guess1 = guess2
        }
        
        if (possibilities.length <= 6 - turn) guess1 = possibilities

		if (filterGuesses[0].length >= 1 && Wordle.join("").length >= 3 && possibilities.length > 1) {
			log("extra")
			guess1.unshift(...filterGuesses[0])
		}
        if (turn == 2) {
            //guess1.unshift(...clearLetters(goodSet, badSet))
        }
		if (usedWords.includes(guess1[0])) {
			while (usedWords.includes(guess1[0])) {
				guess1.shift()
			}
			guess = guess1[0]
		} else {
			guess = guess1[0]
		}
		var response = check(guess, wordIn)
		updateLists(response, guess)
		turn++
		if (response == 4) {
			wins++
            winz++
			turn = 0
		} else {
			game(false, wordIn)
		}
	}
}
function clearLetters(badSet, goodSet) {
    var outList = []
    GuessWords.forEach((word) => {
        var fail = false
        badSet.forEach((key) => {
            if (word.word.includes(key)) {
                fail = true
            }
        })
        goodSet.forEach((key) => {
            if (word.word.includes(key)) {
                fail = true
            }
        })
        if (!fail) {
            outList.push(word.word)
        }
    })
    log(outList)
    return outList
}
function reduceGuess(badSet, goodSet, possibilities) {
	var guess = []
	var onE = []
	var openWords = possibilities
	var openWordle = []
	Wordle.forEach((letter, index) => {
		if (letter == "") {
			openWordle.push(index)
		}
    })
    
	var specialLetters = new Set()
	openWords.forEach((word) => {
		openWordle.forEach((index) => {
			specialLetters.add(word.split("")[index])
		})
	})
    
	GuessWords.forEach((word) => {
		var i = 0
        word.word.split("").forEach((letter, index) => {
			if (specialLetters.has(letter)) {
				i++
			}
			if (specialLetters.length == i || i ==5) {
				onE.push(word)
            }
            
		})
    })
	guess = [...new Set(onE)]
		.sort((a, b) => {
			return b.scorePos - a.scorePos
		})
		.map((word) => {
			return word.word
		})

	return [guess, onE, specialLetters, openWords]
}


var forTesting = [
    { word: "shame" }
    
]
for (let i = 0; i < Answers.length; i++) {
	var word = Answers[i]
	game(true, word)

	goodSet = new Set()
	badSet = new Set()
	Wordle = new Array(5).fill("")
	unSet = new Array(5).fill("")
	usedWords = []
	unSet.forEach((v, index) => {
		unSet[index] = new Set()
	})
	turn = 0
	if ((i + 1) % 100 == 0) {
		console.log({ wins, loses })
	}
}

console.log({ wins, loses, winz })
console.log(badWords)
