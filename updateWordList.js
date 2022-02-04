const { writeFileSync } = require("fs")
var words = require("./goodWords.json")


var totalWords = words.length
var alphabetMap = new Map()
//list of all letters in the alphabet
var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase()
alphabet.split("").forEach(function (letter) {
    alphabetMap.set(letter, new Array(5).fill(0))
})

words.forEach(function (word) {
    word.word.split("").forEach(function (letter, index) {
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



words.forEach((word) => {
    var i = 0
    word.word.split("").forEach((letter, index) => {
        i += alphabetMap.get(letter)[index]
    })
    word.scorePos = i

})


console.log(words)

words.sort(function (a, b) {
    return b.scorePos - a.scorePos
})


writeFileSync("./goodWords2.json", JSON.stringify(words, null, 2))
