// loop protection
let __LOOP_OFFSET__ = 10000
function __LOOP_PROTECTION__() {
    __LOOP_OFFSET__ = __LOOP_OFFSET__ - 1
    if (__LOOP_OFFSET__ === 0)
        throw new Error(
            '[LOOP_PROTECTION]: __LOOP_OFFSET__ crossed-------------'
        )
}

// common functions
function getRandBetween(l, r) {
    return Math.floor(Math.random() * (r - l + 1)) + l
}

// define sudoku handler class
class Sudoku {
    matrix = []
    rows = []
    cols = []
    boxes = []
    operations = []
    stateMatrix = []
    constructor(matrix) {
        this.matrix = Array.from(Array(9), (el) => new Array(9).fill(''))
        this.rows = Array.from(Array(9), (el) => new Array())
        this.cols = Array.from(Array(9), (el) => new Array())
        this.boxes = Array.from(Array(9), (el) => new Array())
        this.operations = []
        if (matrix) this.setMatrix(matrix)
    }

    get matrix() {
        return this.matrix
    }

    get stateMatrix() {
        return this.stateMatrix
    }

    getRandBetween(l, r) {
        return Math.floor(Math.random() * (r - l + 1)) + l
    }
    setMatrix(matrix) {
        for (let i = 0; i < 9; i++) {
            this.rows[i].length = 0
            this.cols[i].length = 0
            this.boxes[i].length = 0
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (matrix[i][j]) {
                    this.matrix[i][j] = matrix[i][j]
                    this.rows[i].push(matrix[i][j])
                    this.cols[j].push(matrix[i][j])
                    let box = this.convertToBoxPos(i + 1, j + 1)[0]
                    this.boxes[box - 1].push(matrix[i][j])
                } else {
                    this.matrix[i][j] = ''
                }
            }
        }
    }

    setStateMatrix(BASE_MATRIX, CURR_MATRIX) {
        this.stateMatrix = Array.from(Array(9), (el) => new Array(9).fill({}))
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.stateMatrix[i][j] = {
                    value: BASE_MATRIX[i][j],
                    isStatic: CURR_MATRIX[i][j] ? true : false,
                    input: '',
                }
            }
        }
    }

    getCellState(row, col) {
        if (this.stateMatrix.length === 0) return null
        return this.stateMatrix[row - 1][col - 1]
    }

    setCellInput(row, col, input) {
        return (this.stateMatrix[row - 1][col - 1] = input)
    }

    clear() {
        // clearing all cell data
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.matrix[i][j] = ''
            }
        }
        // clearing row/col/box data
        for (let k = 0; k < 9; k++) {
            this.rows[k].length = 0
            this.cols[k].length = 0
            this.boxes[k].length = 0
        }
    }

    getUnfilled() {
        let unfilled = []
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.matrix[i][j] === '') unfilled.push([i + 1, j + 1])
            }
        }
        return unfilled
    }

    getCell(row, col) {
        return this.matrix[row - 1][col - 1]
    }

    setCell(row, col, val) {
        this.matrix[row - 1][col - 1] = val
    }

    isFilled(row, col) {
        return this.getCell(row, col) !== ''
    }

    convertToBoxPos(row, col) {
        // i / 3   i%3
        // j / 3   j%3
        // box no => (j/3)*3 + (i/3)
        // box pos => (j%3)*3  + (i%3)
        let box = Math.floor((row - 1) / 3) * 3 + Math.floor((col - 1) / 3) + 1
        let pos = ((row - 1) % 3) * 3 + ((col - 1) % 3) + 1
        return [box, pos]
    }

    convertToCellPos(box, pos) {
        let row = Math.floor((box - 1) / 3) * 3 + Math.floor((pos - 1) / 3) + 1
        let col = ((box - 1) % 3) * 3 + ((pos - 1) % 3) + 1
        return [row, col]
    }

    fillPos(row, col, val) {
        let options = this.getOptions(row, col)
        if (options.filled)
            throw new Error('[fillpos]: position already filled')
        else if (!options.values.includes(val))
            throw new Error(
                '[fillpos]: value is not included in available options'
            )
        else {
            this.rows[row - 1].push(val)
            this.cols[col - 1].push(val)
            let box = this.convertToBoxPos(row, col)[0]
            this.boxes[box - 1].push(val)
            this.matrix[row - 1][col - 1] = val
            this.operations.push({
                type: 'PUSH',
                row: row,
                col: col,
                val: val,
            })
        }
    }

    clearPos(row, col) {
        if (this.matrix[row - 1][col - 1] === '') return null
        else {
            let val = this.matrix[row - 1][col - 1]
            this.matrix[row - 1][col - 1] = ''
            this.rows[row - 1] = this.rows[row - 1].filter((el) => el !== val)
            this.cols[col - 1] = this.rows[col - 1].filter((el) => el !== val)
            let box = this.convertToBoxPos(row, col)[0]
            this.boxes[box - 1] = this.rows[box - 1].filter((el) => el !== val)
            this.operations.push({
                type: 'POP',
                row: row,
                col: col,
                val: val,
            })
        }
    }

    undoOperation(n = 1) {
        while (n--) {
            if (this.operations.length > 0) {
                let last = this.operations.pop()
                switch (last.type) {
                    case 'POP': {
                        this.fillPos(last.row, last.col, last.value)
                        break
                    }
                    case 'PUSH': {
                        this.clearPos(last.row, last.col)
                        break
                    }
                }
            }
            this.print()
        }
    }

    getOptions(row, col) {
        if (this.getCell(row, col))
            throw new Error('getting options for filled cell')
        else {
            let box = this.convertToBoxPos(row, col)[0]
            let res = []
            for (let n = 1; n <= 9; n++) {
                if (
                    !this.rows[row - 1].includes(n) &&
                    !this.cols[col - 1].includes(n) &&
                    !this.boxes[box - 1].includes(n)
                )
                    res.push(n)
            }
            return {
                values: res,
                unique: res.length === 1,
                invalid: res.length === 0,
                length: res.length,
            }
        }
    }

    getUniqueCells() {
        let res = []
        for (let row = 1; row <= 9; row++) {
            for (let col = 1; col <= 9; col++) {
                if (!this.isFilled(row, col)) {
                    let options = this.getOptions(row, col)
                    if (options.invalid) {
                        throw new Error('invalid cell found=======> ', [
                            row,
                            col,
                        ])
                    }
                    if (options.unique)
                        res.push({ row, col, val: options.values[0] })
                }
            }
        }
        return res
    }

    checkValidity() {
        for (let row = 1; row <= 9; row++) {
            for (let col = 1; col <= 9; col++) {
                if (!this.isFilled(row, col)) {
                    if (this.getUniqueCells(row, col).invalid) return false
                }
            }
        }
        return true
    }

    getBaseMatrix() {
        let swaps = 1000
        const VALID_MATRIX = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],

            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],

            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8],
        ]
        const POSSIBLE_SWAPS = [
            [0, 1],
            [0, 2],
            [1, 2],
            [3, 4],
            [3, 5],
            [4, 5],
            [6, 7],
            [6, 8],
            [7, 8],
        ]
        const swapRow = (matrix, r1, r2) => {
            for (let c = 0; c < 9; c++) {
                ;[matrix[r1][c], matrix[r2][c]] = [matrix[r2][c], matrix[r1][c]]
            }
        }
        const swapCol = (matrix, c1, c2) => {
            for (let r = 0; r < 9; r++) {
                ;[matrix[r][c1], matrix[r][c2]] = [matrix[r][c2], matrix[r][c1]]
            }
        }
        while (swaps--) {
            let [r1, r2] = POSSIBLE_SWAPS[this.getRandBetween(0, 8)]
            let [c1, c2] = POSSIBLE_SWAPS[this.getRandBetween(0, 8)]
            swapRow(VALID_MATRIX, r1, r2)
            swapCol(VALID_MATRIX, c1, c2)
        }
        return VALID_MATRIX
    }

    isSolvable(matrix) {
        let sudoku2 = new Sudoku(matrix)
        sudoku2.solve()
        return sudoku2.getUnfilled().length === 0 ? true : false
    }

    createRandom() {
        let BASE_MATRIX = this.getBaseMatrix()
        console.log('base-matrix=============>')
        new Sudoku(BASE_MATRIX).print()

        let CURR_MATRIX = BASE_MATRIX.map((row) => [...row])
        // creating empty values
        while (true) {
            __LOOP_PROTECTION__()
            let [row, col] = [
                this.getRandBetween(1, 9),
                this.getRandBetween(1, 9),
            ]
            let currVal = CURR_MATRIX[row - 1][col - 1]
            CURR_MATRIX[row - 1][col - 1] = ''
            if (!this.isSolvable(CURR_MATRIX)) {
                CURR_MATRIX[row - 1][col - 1] = currVal
                break
            }
        }
        this.setMatrix(CURR_MATRIX)
        this.setStateMatrix(BASE_MATRIX, CURR_MATRIX)
        console.log('state-matrix=====>', this.stateMatrix)
    }

    solve() {
        while (true) {
            __LOOP_PROTECTION__()
            let uniqueArr = this.getUniqueCells()
            if (uniqueArr.length === 0) break
            for (let unique of uniqueArr) {
                this.fillPos(unique.row, unique.col, unique.val)
            }
        }
    }

    print() {
        console.log('----------sudoku-----------')
        for (let row of this.matrix) {
            console.log(row.map((col) => (col === '' ? '-' : col)).join('\t'))
        }
        console.log('rows========>', this.rows)
        console.log('cols========>', this.cols)
        console.log('boxes========>', this.boxes)
    }
}

// getting node from html sudoku table class
function getNode(table, r, c) {
    if (r >= 1 && r <= 9 && c >= 1 && c <= 9) {
        const row = table.querySelectorAll('tr')[r - 1]
        const col = row.querySelectorAll('td')[c - 1]
        return col.querySelector('input')
    }
    return null
}

function setNode(node, val) {
    node.value = val
}

// setting html sudoku table according to sudoku instance
function setTable(table, sudoku, fillblank = false) {
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            const node = getNode(table, row, col)
            const val = sudoku.getCell(row, col)
            setNode(node, val)
            if (val) {
                // node.style = 'text-shadow: 0 0 0 black;'
                node.style['text-shadow'] = '0 0 0 black'
                node.disabled = true
            } else {
                // node.style = 'text-shadow: 0 0 0 blue;'
                node.style['text-shadow'] = '0 0 0 blue'
                node.disabled = false
            }
            if (
                fillblank &&
                sudoku.stateMatrix &&
                sudoku.stateMatrix.length > 0
            ) {
                let [i, j] = [row - 1, col - 1]
                if (sudoku.getCellState(row, col).isStatic === false) {
                    setNode(node, sudoku.stateMatrix[i][j].value)
                }
            }
        }
    }
}

function checkTable(table, sudoku) {
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            const node = getNode(table, row, col)
            const { isStatic, value, input } = sudoku.getCellState(row, col)
            if (
                node.value &&
                !isStatic &&
                String(node.value) !== String(value)
            ) {
                node.style.border = '2px solid red'
            }
        }
    }
}

// clear formatting of the table cells
function clearFormatting(table) {
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            const node = getNode(table, row, col)
            node.style['border'] = ''
        }
    }
}

function addInputListenerToTableCells(table, callbackFn) {
    // assigning input listener // restricted to only table entity and no change on the underlying sudoku
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            const node = getNode(table1, row, col)
            node.addEventListener('input', callbackFn)
        }
    }
}
// define a sudoku table and
const sudoku1 = new Sudoku()
const table1 = document.querySelector('.sudoku > table')
sudoku1.createRandom()
setTable(table1, sudoku1)
addInputListenerToTableCells(table1, (event) => {
    let value = event.data.trim()
    let isValid = value.match(/^\d$/) ? true : false
    if (!isValid) event.target.value = ''
    else event.target.value = value
})

// assigning buttons to sudoku
const controls = {
    clear: document.querySelector('.sudoku .controls__clear'),
    random: document.querySelector('.sudoku .controls__random'),
    fill: document.querySelector('.sudoku .controls__fill'),
    hint: document.querySelector('.sudoku .controls__hint'),
    check: document.querySelector('.sudoku .controls__check'),
}

controls.clear.addEventListener('click', (event) => {
    setTable(table1, sudoku1)
    clearFormatting(table1)
})

controls.random.addEventListener('click', (event) => {
    sudoku1.createRandom()
    clearFormatting(table1)
    setTable(table1, sudoku1)
})

controls.fill.addEventListener('click', (event) => {
    setTable(table1, sudoku1, true)
})

controls.hint.addEventListener('click', (event) => {
    clearFormatting(table1)
    let arr = sudoku1.getUniqueCells()
    console.log('unique====>', arr)
    for (let unique of arr) {
        let val = unique.val
        let node = getNode(table1, unique.row, unique.col)
        node.style['border'] = '2px solid green'
    }
    if (globalThis.__hintTimer__) clearTimeout(globalThis.__hintTimer__)
    globalThis.__hintTimer__ = setTimeout(() => {
        clearFormatting(table1)
    }, 5000)
})

controls.check.addEventListener('click', () => {
    clearFormatting(table1)
    checkTable(table1, sudoku1)
})
