var Answers = require("./puzzleWordsOut.json").words
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
var loses = 0
var badWords = []
function game(NewWord, wordIn) {
	if (turn == 6) {
		loses++
		badWords.push(wordIn)
		NewWord = true
	}
	if (NewWord) {
		goodSet = new Set()
		badSet = new Set()
		Wordle = new Array(5).fill("")
		unSet = new Array(5).fill("")
		usedWords = []
		unSet.forEach((v, index) => {
			unSet[index] = new Set()
		})
		turn = 0
		if (wins + loses == Answers.length) {
			console.log({ wins, loses })
			console.log(badWords)
			process.exit()
		}
		if (wins % 100 == 0) {
			log({ wins, loses })
		}
		var word = Answers[wins + loses].word

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
			turn = 0
			game(true, "")
		} else {
			updateLists(response, firstWord)
			turn++
			game(false, word)
		}
	} else {
		var guess
		var guess1 = filterWords(goodSet, badSet, GuessWords)
		var possibilities = filterWords(goodSet, badSet, Answers)
		var filterGuesses = reduceGuess(goodSet, badSet)
		if (possibilities.length <= 6 - turn) guess1 = possibilities
		if (filterGuesses.length > 1 && Wordle.join("").length === 4 && possibilities.length > 6 - turn) guess1 = filterGuesses
        if (filterGuesses.length > 1 && Wordle.join("").length === 4 && possibilities.length > 6 - turn) {
            log(`one: ${(filterGuesses.length > 1).toString()} \ntwo: ${Wordle.join("").length === 4} \nthree: ${possibilities.length > 6 - turn}`)
            process.exit(1)
        }
		if (usedWords.includes(guess1[0])) {
			while (usedWords.includes(guess1[0])) {
				guess1.shift()
			}
			usedWords.push(guess1[0])
			guess = guess1[0]
		} else {
			usedWords.push(guess1[0])

			guess = guess1[0]
		}
		var response = check(guess, wordIn)
		updateLists(response, guess)
		turn++
		if (response == 4) {
			wins++
			turn = 0
			game(true, "")
		} else {
			game(false, wordIn)
		}
	}
}

game(true, "")

function reduceGuess(badSet, goodSet) {
	var guess = []
	var onE = []
	var openWords = filterWords(goodSet, badSet, Answers)
	var openWordle = []
	Wordle.forEach((letter, index) => {
		if (letter == "") {
			openWordle.push(index)
		}
	})
	var specialLetters = new Set()
	openWords.forEach((word) => {
		specialLetters.add(word.split("")[openWordle])
	})
	log({ Wordle, openWords })
	log(Wordle.join("").length)
	GuessWords.forEach((word) => {
		var i = 0
		;[...new Set(word.word.split(""))].forEach((letter, index) => {
			if (specialLetters.has(letter)) {
				i++
			}
			if (i == 5) {
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

	return guess
}
