const readline = require("readline")

var outWords = require("./goodWords2.json")
var firstWord = []
for (let i = 0; i < outWords.length; i++) {
	if (new Set(outWords[i].word.split("")).size == 5) {
		firstWord.push(outWords[i])
	}
}
console.log("use: " + firstWord[0].word)
var usedWords = []
var Wordle = new Array(5).fill("")
var unSet = new Array(5).fill("")
unSet.forEach((v, index) => {
	unSet[index] = new Set()
})
function wordleCrack(goodSet, badSet, lastWord) {
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})
	var g
	var b
	var z
	var currentIndexes = []
	rl.question("what indexes were green?", (answer) => {
		z = answer.split("")
		z.forEach((x) => {
			var temp = parseInt(x)
			Wordle[temp] = lastWord.split("")[temp]
			currentIndexes.push(temp)
		})
		rl.question("what indexes were yellow?", (answer) => {
			g = answer.split("")
			g.forEach((x) => {
				var temp = parseInt(x)
				unSet[temp].add(lastWord.split("")[temp])
				goodSet.add(lastWord.split("")[temp])
				currentIndexes.push(temp)
			})
			for (let uI = 0; uI < 5; uI++) {
				if (!currentIndexes.includes(uI)) {
					badSet.add(lastWord.split("")[uI])
				}
			}
			var secondTier = []
			var thirdTier = []
			var fourthTier = []
			var fifthTier = []
			console.log({ goodSet: goodSet, badSet: badSet })
			outWords.forEach((word) => {
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
                        //console.log("\n\n\n\n\n\n\n\nnnn")
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
			if (fifthTier.length == 0) {
				console.log("no words found")
			}
			if (usedWords.includes(fifthTier[0])) {
				while (usedWords.includes(fifthTier[0])) {
					fifthTier.shift()
				}
				console.log("use: " + fifthTier[0])
				rl.close()
				usedWords.push(fifthTier[0])
				wordleCrack(goodSet, badSet, fifthTier[0])
			} else {
				usedWords.push(fifthTier[0])
                console.log("use: " + fifthTier[0])
                rl.close()
                
				wordleCrack(goodSet, badSet, fifthTier[0])
			}
		})
	})
}
wordleCrack(new Set(), new Set(), firstWord[0].word)
