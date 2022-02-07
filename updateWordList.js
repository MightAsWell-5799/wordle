const { writeFileSync } = require("fs")
var apple = require("./old/puzzleWords.json").words.concat(require("./old/validWords.json").words)

var totalWords = apple.length
var alphabetMap = new Map()
//list of all letters in the alphabet
var alphabet = "abcdefghijklmnopqrstuvwxyz"
alphabet.split("").forEach(function (letter) {
    alphabetMap.set(letter, new Array(5).fill(0))
})
apple.forEach(function (word) {
    word.split("").forEach(function (letter, index) {
        var temp = alphabetMap.get(letter)
        temp[index]++
        alphabetMap.set(letter, temp)
    })
})

alphabetMap.forEach((value, key) => {
    var temp = value.map(function (num) {
        return (num / totalWords) * 100
    })
    alphabetMap.set(key, temp)
})


var dummy = []
apple.forEach((word) => {
    var i = 0
    word.split("").forEach((letter, index) => {
        i += alphabetMap.get(letter)[index]
    })
    dummy.push({word: word, scorePos: i})

})


console.log(dummy)

dummy.sort(function (a, b) {
    return b.scorePos - a.scorePos
})


writeFileSync("./goodWords3.json", JSON.stringify(dummy, null, 2))
