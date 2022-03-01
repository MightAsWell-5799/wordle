//basic filter function for narrowing words
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
	log({ goodSet, badSet })
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
// updates good/bad sets, used words, wordle, and unSet
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

//tries to eliminate more letters from the available options
//need to update to make more generic and doesn't use answers list for the letters to remove but rather just a list of words and letter frequency
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

var usedWords = []
var goodSet = new Set()
var badSet = new Set()
var Wordle = new Array(5).fill("")
var unSet = new Array(5).fill("")
unSet.forEach((v, index) => {
	unSet[index] = new Set()
})
