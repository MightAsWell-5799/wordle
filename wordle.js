var Answers = require("./puzzleWordsOut.json").words
var GuessWords = require("./goodWords3.json").words
const logging = false
function log(string) {
	if (logging) console.log(string)
}
//input is the guess and puzzle is the answer
const check = async (input, puzzle) => {
	let results = []
	if (input == puzzle) return 4

	input.split("").forEach((letter, index) => {
		if (puzzle[index] === letter) {
			log(letter + " is correct")
			results.push(2)
		} else if (puzzle.includes(letter)) {
			results.push(1)
			log(letter + " is close")
		} else {
			results.push(0)
			log(letter + " is wrong")
		}
	})
	return results
}

const sleep = (ms = 1500) => new Promise((r) => setTimeout(r, ms))

async function filterWords(goodSet, badSet, words) {
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

async function updateLists(response, guess) {
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
async function game(NewWord, wordIn) {
	//console.log({wins})
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
			console.log({ wins })
		}
		var word = Answers[wins + loses].word

		//console.log("new word: " + word)
		var guess1 = await filterWords(goodSet, badSet, GuessWords)
		var firstWord
		for (let i = 0; i < guess1.length; i++) {
			if (new Set(guess1[i].split("")).size == 5) {
				firstWord = guess1[i]
				break
			}
		}
		var response = await check(firstWord, word)
		if (response == 4) {
			//console.log("win " + guess)
			wins++
			turn = 0
			await game(true, "")
		} else {
			await updateLists(response, firstWord)
			turn++
			await game(false, word)
		}
	} else {
		var guess1 = await filterWords(goodSet, badSet, GuessWords)
		var guess
		var possibilities = await filterWords(goodSet, badSet, Answers)

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
		if (possibilities.length < 3) guess = possibilities[0]
		log({ guess: guess, word: word })
		var response = await check(guess, wordIn)
		await updateLists(response, guess)
		turn++
		if (response == 4) {
			//console.log("win " + guess)
			wins++
			turn = 0
			await game(true, "")
		} else {
			await game(false, wordIn)
		}
	}
}

game(true, "")
