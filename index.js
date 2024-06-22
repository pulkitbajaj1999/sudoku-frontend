// common functions
function getRandBetween(i1, i2) {
    return Math.floor(Math.random() * (i2 - i1)) + i1
}
function getNode(table, r, c) {
    if (r >= 1 && r <= 9 && c >= 1 && c <= 9) {
        const row = table.querySelectorAll('tr')[r - 1]
        const col = row.querySelectorAll('td')[c - 1]
        return col.querySelector('input')
    }
}
function setNode(node, val) {
    node.value = val
    node.textContent = val
}

// define sudoku handler class
class Sudoku {
    arr = []
    rows = []
    cols = []
    boxes = []
    constructor(table) {
        this.table = table
        this.arr = new Array(9)
        this.rows = new Array(9)
        this.cols = new Array(9)
        this.boxes = new Array(9)
        for (let i = 0; i < 9; i++) {
            this.arr[i] = new Array(9).fill('')
            this.rows[i] = new Array()
            this.cols[i] = new Array()
            this.boxes[i] = new Array()
        }

        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                let node = getNode(table, i, j)
                this.set(i, j, node.value)
                node.addEventListener('input', (event) => {
                    let parsedValue = Number(event.target.value)
                    if (
                        !isNaN(parsedValue) &&
                        parsedValue >= 0 &&
                        parsedValue <= 9
                    ) {
                        node.textContent = event.target.value
                        this.set(i, j, event.target.value)
                        this.print()
                    } else {
                        node.value = event.target.textContent
                    }
                })
            }
        }
    }

    get(i, j) {
        return this.arr[i - 1][j - 1]
    }

    set(i, j, val) {
        this.arr[i - 1][j - 1] = val
    }

    clear() {
        this.clearFormatting()
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                const node = getNode(this.table, i, j)
                setNode(node, '')
                this.set(i, j, '')
            }
        }
        for (let i = 0; i < 9; i++) {
            this.rows[i].length = 0
            this.cols[i].length = 0
            this.boxes[i].length = 0
        }
    }

    clearFormatting() {
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                const node = getNode(this.table, i, j)
                node.style = `width: 50px;
                height: 50px;
                font-size: 20px;
                text-align: center;`
            }
        }
    }

    print() {
        console.log('----------sudoku-----------')
        for (let row of this.arr) {
            console.log(row.map((col) => (col === '' ? '-' : col)).join('\t'))
        }
    }

    getBox(i, j) {
        return Math.floor((i - 1) / 3) * 3 + Math.floor((j - 1) / 3) + 1
    }

    convertBoxPos(i, j) {
        let row = Math.floor((i - 1) / 3) * 3 + Math.floor((j - 1) / 3) + 1
        let col = ((i - 1) % 3) * 3 + ((j - 1) % 3) + 1
        return [row, col]
    }

    fillCell(i, j, val) {
        let row = i
        let col = j
        let box = this.getBox(i, j)
        this.rows[row - 1].push(val)
        this.cols[col - 1].push(val)
        this.boxes[box - 1].push(val)
        this.set(i, j, val)
        let node = getNode(this.table, i, j)
        setNode(node, val)
    }

    clearCell(i, j) {
        let curr = this.get(i, j)
        let b = this.getBox(i, j)
        if (curr) {
            this.set(i, j, '')
            this.rows[i - 1] = this.rows[i - 1].filter((el) => el === curr)
            this.cols[j - 1] = this.cols[j - 1].filter((el) => el === curr)
            this.boxes[b - 1] = this.boxes[b - 1].filter((el) => el === curr)
        }
    }

    getOptions(i, j) {
        let box = this.getBox(i, j)
        console.log(
            `get-options-for(${i},${j}) -> rows:${this.rows[i - 1]} -> cols${
                this.cols[j - 1]
            } ->box:${this.boxes[box - 1]}`
        )
        let res = []
        for (let n = 1; n <= 9; n++) {
            if (
                !this.rows[i - 1].includes(n) &&
                !this.cols[j - 1].includes(n) &&
                !this.boxes[box - 1].includes(n)
            )
                res.push(n)
        }
        return {
            arr: res,
            length: res.length,
            unique: res.length === 1,
            invalid: res.length === 0,
        }
    }

    createRandom() {
        this.clear()
        for (let b = 1; b <= 9; b++) {
            for (let i = 0; i < 2; i++) {
                let n1 = getRandBetween(1, 9)
                let [r1, c1] = this.convertBoxPos(b, n1)
                let options = this.getOptions(r1, c1)
                console.log(options)
                let choosenValue =
                    options.arr[getRandBetween(0, options.length - 1)]
                let cell1 = getNode(this.table, r1, c1)
                this.fillCell(r1, c1, choosenValue)
            }
        }
        while (this.findUnique().length === 0) {
            let b = getRandBetween(1, 9)
            let n = getRandBetween(1, 9)
            let [r, c] = this.convertBoxPos(b, n)
            if (!this.get(r, c)) {
                let options = this.getOptions(r, c)
                let choosenValue =
                    options.arr[getRandBetween(0, options.length - 1)]
                this.fillCell(r, c, choosenValue)
            }
        }
    }

    fill() {
        // fill random
        let uniqueArr = this.findUnique()
        if (uniqueArr.length > 0) {
            let curr = uniqueArr[0]
            this.fillCell(curr.row, curr.col, curr.val)
        }
        console.log('invalid=================>')
        while (this.findUnique().length === 0) {
            let b = getRandBetween(1, 9)
            let n = getRandBetween(1, 9)
            let [r, c] = this.convertBoxPos(b, n)
            if (!this.get(r, c)) {
                let options = this.getOptions(r, c)
                let choosenValue =
                    options.arr[getRandBetween(0, options.length - 1)]
                this.fillCell(r, c, choosenValue)
            }
        }
    }
    findUnique() {
        let res = []
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                if (this.get(i, j)) continue
                let options = this.getOptions(i, j)
                if (options.unique) {
                    res.push({
                        row: i,
                        col: j,
                        val: options.arr[0],
                    })
                }
            }
        }
        return res
    }
}

// define a sudoku table and
let table1 = document.querySelector('.sudoku > table')
let sudoku1 = new Sudoku(table1)
// assigning buttons to sudoku
sudoku1.createRandom()
document
    .querySelector('.sudoku .controls__clear')
    .addEventListener('click', (event) => {
        sudoku1.clear()
    })

document
    .querySelector('.sudoku .controls__random')
    .addEventListener('click', (event) => {
        sudoku1.createRandom()
    })

document
    .querySelector('.sudoku .controls__fill')
    .addEventListener('click', (event) => {
        sudoku1.fill()
    })

document
    .querySelector('button.controls__hint')
    .addEventListener('click', (event) => {
        sudoku1.clearFormatting()
        let arr = sudoku1.findUnique()
        console.log('unique======>', arr)
        for (let unique of arr) {
            let [r, c] = [unique.row, unique.col]
            let val = unique.val
            let node = getNode(table1, r, c)
            console.log('node======>', node)
            console.log('node.style======>', node.style)
            node.style['border'] = '3px solid green'
        }
    })
