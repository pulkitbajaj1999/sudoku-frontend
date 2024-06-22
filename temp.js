i = 9
j = 4

let row = Math.floor((i - 1) / 3) * 3 + Math.floor((j - 1) / 3) + 1
let col = ((i - 1) % 3) * 3 + ((j - 1) % 3) + 1

console.log(row, col)

function getBox(i, j) {
    return Math.floor((i - 1) / 3) * 3 + Math.floor((j - 1) / 3) + 1
}

let a = getBox(3, 6)
console.log(a)
