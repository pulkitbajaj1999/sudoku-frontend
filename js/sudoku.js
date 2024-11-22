// TODO: use lodash for deep cloning operations
let solve_call = 0
const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9]
class SudokuSolution {
    matrix = []
    rows = []
    cols = []
    boxes = []
    optionMatrix = []
    count = 0

    get isSolved() {
        return this.count === 81
    }

    constructor(matrix = null) {
        this.matrix = Array.from(Array(9), (el) => new Array(9).fill(0))
        this.rows = Array.from(Array(9), (el) => new Array())
        this.cols = Array.from(Array(9), (el) => new Array())
        this.boxes = Array.from(Array(9), (el) => new Array())
        this.optionMatrix = Array.from(Array(9), (el) =>
            new Array(9).fill([...VALUES])
        )
        if (matrix && matrix.length === 9 && matrix[0].length === 9) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (matrix[i][j]) {
                        this.fillCell(i + 1, j + 1, matrix[i][j])
                        this.optionMatrix[i][j] = null
                    } else
                        this.optionMatrix[i].push(this.getOptions(i + 1, j + 1))
                }
            }
        }
    }

<<<<<<< Updated upstream
    getClonedMatrix() {
        let clonedMatrix = []
        for (let i = 0; i < 9; i++) {
            clonedMatrix.push(...matrix[i])
=======
    isMatrixComplete() {
        return this.count === 81
    }
    getClonedMatrix() {
        let clonedMatrix = new Array(9).fill(0)
        for (let i = 0; i < 9; i++) {
            clonedMatrix[i] = [...this.matrix[i]]
>>>>>>> Stashed changes
        }
        return clonedMatrix
    }
    setMatrix(matrix) {
        if (!matrix || !matrix.length === 9 || !matrix[0].length === 9)
            throw Error('invalid matrix passed to SudokuSolution:setMatrix')
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {}
        }
    }

    convertToBoxPos(row, col) {
        let box = Math.floor((row - 1) / 3) * 3 + Math.floor((col - 1) / 3) + 1
        let pos = ((row - 1) % 3) * 3 + ((col - 1) % 3) + 1
        return [box, pos]
    }

    convertToCellPos(box, pos) {
        let row = Math.floor((box - 1) / 3) * 3 + Math.floor((pos - 1) / 3) + 1
        let col = ((box - 1) % 3) * 3 + ((pos - 1) % 3) + 1
        return [row, col]
    }

    parseValue(value) {
        const VALID_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        switch (typeof value) {
            case 'string': {
                return value.trim().match(/^[1-9]$/)
                    ? parseInt(value.trim())
                    : 0
            }
            case 'number': {
                return VALID_VALUES.includes(value) ? value : 0
            }
            default: {
                return 0
            }
        }
    }

    getInterSection(...args) {
        let res = null
        for (let arr of args) {
            if (!res) res = [...arr]
            else {
                res = res.filter((el) => arr.includes(el))
            }
        }
        return res
    }

    substractOptions(arr1, arr2) {
        return arr1.filter((el) => !arr2.includes(el))
    }

    getCell(row, col) {
        return this.matrix[row - 1][col - 1]
    }

    isEmpty(row, col) {
        return this.matrix[row - 1][col - 1] === 0 ? true : false
    }

    fillCell(row, col, value) {
        let [i, j, b] = [
            row - 1,
            col - 1,
            this.convertToBoxPos(row, col)[0] - 1,
        ]
        if (this.matrix[i][j]) throw Error('cell already contains value')
        // else
        this.matrix[i][j] = this.parseValue(value)
        this.rows[i].push(value)
        this.cols[j].push(value)
        this.boxes[b].push(value)
        this.optionMatrix[i][j] = null
        this.count += 1
    }

    clearCell(row, col) {
        let [i, j, b] = [
            row - 1,
            col - 1,
            this.convertToBoxPos(row, col)[0] - 1,
        ]
        let currValue = this.getCell(row, col)
        this.rows[i] = this.rows[i].filter((d) => d !== currValue)
        this.cols[j] = this.cols[i].filter((d) => d !== currValue)
        this.boxes[b] = this.boxes.filter((d) => d !== currValue)
        this.count -= 1
    }

    getOptions(row, col) {
        let [i, j, b] = [
            row - 1,
            col - 1,
            this.convertToBoxPos(row, col)[0] - 1,
        ]
        let SET = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        if (this.getCell(row, col))
            throw Error('getting options for a  filled cell')
        let possibleValues = SET.filter(
            (d) =>
                !this.rows[i].includes(d) &&
                !this.cols[j].includes(d) &&
                !this.boxes[b].includes(d)
        )
        return possibleValues
    }

    getOptimizedOptionItem() {
        let optionItem = null
        for (let row = 1; row <= 9; row++) {
            for (let col = 1; col <= 9; col++) {
                if (this.isEmpty(row, col)) {
                    let options = this.getOptions(row, col)
<<<<<<< Updated upstream
                    if (optionItem === null || options.length < optionItem.length) optionItem = {row, col, options, len: options.length}
=======
                    if (
                        optionItem === null ||
                        options.length < optionItem.length
                    )
                        optionItem = { row, col, options, len: options.length }
>>>>>>> Stashed changes
                }
            }
        }
        return optionItem
    }

<<<<<<< Updated upstream
    solve() {
        while (this.count < 81) {
            __LOOP_PROTECTION__()
            let isDirty = false
            for (let row = 1; row <= 9; row++) {
                for (let col = 1; col <= 9; col++) {
                    if (this.isEmpty(row, col)) {
                        let options = this.getOptions(row, col)
                        if (options.length === 0) {
                            // invalid sudoku hence returning null
                            return false
                        } else if (options.length === 1) {
                            // unique option hence filling sudoku
                            this.fillCell(row, col, options[0])
                            isDirty = true
                        } else {
                            // continue since multiple possible values for cell
                        }
=======
    fillAllSingular() {
        let isDirty = false
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (
                    matrix[i][j] === 0 &&
                    this.optionMatrix[i][j] &&
                    this.optionMatrix[i][j].length === 1
                ) {
                    this.fillCell(row, col)
                    isDirty = true
                }
            }
        }
        return isDirty
    }

    updateOptionMatrix() {
        let k2 = [] // {i, j, b, options}
        let k3 = []
        // intersection of row + col + box
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.isEmpty(i + 1, j + 1)) {
                    if (!this.optionMatrix[i][j])
                        throw Error(
                            '[updateOptionMatrix]: option matrix is null for unfilled cell'
                        )
                    let options = this.getInterSection(
                        this.optionMatrix,
                        this.getOptions(i + 1, j + 1)
                    )
                    options.sort()
                    this.optionMatrix[i][j] = options
                    let b = this.convertToBoxPos(i + 1, j + 1)[0]
                    if (options.length === 0)
                        return false // the matrix is invalid
                    else if (options.length === 2)
                        k2.push({ i, j, k, key: JSON.stringify(options) })
                    else if (options.length === 3)
                        k3.push({ i, j, b, key: JSON.stringify(options) })
                }
            }
        }
        // duality of cell in row
        for (let i = 0; i < 9; i++) {
            let rowFilteredCells = k2.filter((el) => el.i === i)
            let dict = []
            for (let el of rowFilteredCells) {
                dict[el.key].push(el.j)
            }
            for (let [key, group] of Object.entries(dict)) {
                if (group.length > 2) return false // this is invalid occurence hence invalidating the matrix
                let options = JSON.parse(key)
                for (let j = 0; j < 9; j++) {
                    if (!group.includes(j) && this.optionMatrix[i][j]) {
                        this.optionMatrix[i][j] = this.substractOptions(
                            this.optionMatrix[i][j],
                            options
                        )
                    }
                }
            }
        }
        for (let j = 0; j < 9; j++) {
            let colFilteredCells = k2.filter((el) => el.j === j)
            let dict = colFilteredCells.reduce((res, el) => {
                res[el.key].push(el.i)
                return res
            }, [])
            for (let [key, group] of Object.entries(dict)) {
                if (group.length > 2) return false
                let options = JSON.parse(key)
                for (let i = 0; i < 9; i++) {
                    if (!group.includes(i) && this.optionMatrix[i][j]) {
                        this.optionMatrix[i][j] = this.substractOptions(
                            this.optionMatrix[i][j],
                            options
                        )
>>>>>>> Stashed changes
                    }
                }
            }
        }
<<<<<<< Updated upstream
        if (this.isSolved) return true;

        debugger
        //else loop to backtrack
        let optionItem = this.getOptimizedOptionItem()
        if (!optionItem) throw Error('[solve]: getting null option item where matrix is not solved')
        let {row, col, options} = optionItem
=======
        for (let b = 0; b < 9; b++) {
            let boxFilteredCells = k2.filter((el) => el.b === b)
            let dict = boxFilteredCells.reduce((res, el) => {
                let { i, j } = el
                res[el.key].push({ i, j })
                return res
            }, [])
            for (let [key, group] of dict) {
                if (group.length > 2) return false
                let options = JSON.parse(key)
                for (let p = 0; p < 9; p++) {
                    let [i, j] = this.convertToCellPos(b + 1, p + 1)
                    if (
                        !group.find((el) => el.i === i && el.j === j) &&
                        this.optionMatrix[i][j]
                    ) {
                        this.optionMatrix[i][j] = this.substractOptions(
                            this.optionMatrix[i][j],
                            options
                        )
                    }
                }
            }
        }
        return true
    }

    solveUnique() {
        while (this.count < 81) {
            __LOOP_PROTECTION__()
            let flag = this.updateOptionMatrix()
            if (flag === false) return false
            let isDirty = this.fillAllSingular()
            if (!isDirty) break
        }
    }
    solve(tree = 1) {
        debugger
        __LOOP_PROTECTION__()
        // solve all cells which can be uniquely filled
        let flag = this.solveUnique()
        if (flag === false) return false
        if (this.isMatrixComplete()) return true

        //else loop to backtrack
        console.log(
            `matrix-count------>${this.count}\trecursive@tree---->${tree}`
        )
        let optionItem = this.getOptimizedOptionItem()
        if (!optionItem)
            throw Error(
                '[solve]: getting null option item where matrix is not solved'
            )
        let { row, col, options } = optionItem
>>>>>>> Stashed changes
        let tempSolution = null
        let count = 0 //count of possible solutions for optionItem<option at cell[row][col]>
        let clonedMatrix = this.getClonedMatrix()
        for (let option of options) {
<<<<<<< Updated upstream
            clonedMatrix[row-1][col-1] = option
            let newSolution = new SudokuSolution(clonedMatrix)
            let flag = newSolution.solve()
=======
            clonedMatrix[row - 1][col - 1] = option
            let newSolution = new SudokuSolution(clonedMatrix)
            let flag = newSolution.solve(tree + 1)
>>>>>>> Stashed changes
            if (flag) {
                if (!tempSolution) tempSolution = newSolution.matrix
                count++
            }
<<<<<<< Updated upstream
            clonedMatrix[row-1][col-1] = 0
            if (count > 1) break;
=======
            clonedMatrix[row - 1][col - 1] = 0
            if (count > 1) break
>>>>>>> Stashed changes
        }
        if (count === 1) {
            // if only 1 solution exist for the item then this is the required solution and return the solution
            this.setMatrix(tempSolution)
            return true
<<<<<<< Updated upstream
        }
        else {
=======
        } else {
>>>>>>> Stashed changes
            return false
        }
    }

    print() {
        console.info('----------sudoku-----------')
        for (let row of this.matrix) {
            console.info(row.map((col) => (col === '' ? '-' : col)).join('\t'))
        }
        console.info('rows========>', this.rows)
        console.info('cols========>', this.cols)
        console.info('boxes========>', this.boxes)
    }
}

class Sudoku {
    rows = []
    cols = []
    boxes = []
    operations = []
    stateMatrix = []
    solution = null
    constructor(matrix) {
        // this.matrix = Array.from(Array(9), (el) => new Array(9).fill(0))
        this.rows = Array.from(Array(9), (el) => new Array())
        this.cols = Array.from(Array(9), (el) => new Array())
        this.boxes = Array.from(Array(9), (el) => new Array())
        this.operations = []
        this.stateMatrix = Array.from(Array(9), (el) =>
            new Array(9).fill({
                faceValue: 0,
                solutionValue: 0,
                isLocked: false,
                tempInput: '',
            })
        )
        if (matrix) {
            this.setStateMatrix(matrix)
        }
    }

    getRandBetween(l, r) {
        return Math.floor(Math.random() * (r - l + 1)) + l
    }

    parseValue(value) {
        const VALID_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        switch (typeof value) {
            case 'string': {
                return value.trim().match(/^[1-9]$/)
                    ? parseInt(value.trim())
                    : 0
            }
            case 'number': {
                return VALID_VALUES.includes(value) ? value : 0
            }
            default: {
                return 0
            }
        }
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

    setStateMatrix(FACE_MATRIX, SOLUTION_MATRIX = null) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                // value = 0 : represents it is not present
                let faceValue = this.parseValue(FACE_MATRIX[i][j])
                let solutionValue = SOLUTION_MATRIX
                    ? this.parseValue(SOLUTION_MATRIX[i][j])
                    : 0
                this.stateMatrix[i][j] = {
                    faceValue: faceValue,
                    solutionValue: solutionValue,
                    isLocked: false,
                    tempInput: '',
                }
            }
        }
    }

    // get current face matrix and update the solution and then solve it, if solved then proceed to lock all values
    // return true if matrix is solvable else return false
    lockAllFaceValues() {
        let faceMatrix = this.getFaceMatrix()
        this.solution = new SudokuSolution(faceMatrix)
        let isSolved = this.solution.solve()
        if (!isSolved) return false
        for (let row = 1; row <= 9; row++) {
            for (let col = 1; col <= 9; col++) {
                let faceValue = this.getFaceValue(row, col)
                this.setCellState(row, col, {
                    isLocked: faceValue !== 0 ? true : false,
                    solutionValue: this.solution.getCell(row, col),
                })
            }
        }
        return true
    }

    unlockAllFaceValues() {
        this.solution = null
        for (let row = 1; row <= 9; row++) {
            for (let col = 1; col <= 9; col++) {
                let faceValue = this.getFaceValue(row, col)
                this.setCellState(row, col, {
                    isLocked: false,
                })
            }
        }
        return true
    }

    // get and set on cells will be using 1 based index
    getCellState(row, col) {
        if (this.stateMatrix.length === 0) {
            throw Error('[getCellState]: stateMatrix is not defined')
        }
        // return deep cloned value using JSON stringify and parse methods
        return JSON.parse(JSON.stringify(this.stateMatrix[row - 1][col - 1]))
    }

    setCellState(row, col, state) {
        let currState = this.getCellState(row, col)
        this.stateMatrix[row - 1][col - 1] = {
            ...currState,
            ...state,
        }
        return JSON.parse(JSON.stringify(this.stateMatrix[row - 1][col - 1]))
    }

    // get face value of the row and col
    getFaceValue(row, col) {
        if (this.stateMatrix.length === 0) {
            throw Error('[getFaceValue]: stateMatrix is not defined')
        }
        return this.stateMatrix[row - 1][col - 1].faceValue
    }

    isCellValid(row, col) {
        let { faceValue, solutionValue } = this.getCellState(row, col)
        return !faceValue || (solutionValue && faceValue === solutionValue)
    }

    isCellLocked(row, col) {
        return this.stateMatrix[row - 1][col - 1].isLocked
    }

    //  setting face value will reset the locked value
    setFaceValue(row, col, faceValue) {
        let currState = this.getCellState(row, col)
        if (!currState) {
            throw Error('[setFaceValue]: currState is not defined')
        }
        let parsedValue = this.parseValue(faceValue)
        this.stateMatrix[row - 1][col - 1].faceValue = parsedValue
        return this.getCellState(row, col)
    }

    // setting solution value
    setSolutionValue(row, col, solutionValue) {
        let currState = this.getCellState(row, col)
        if (!currState) {
            throw Error('[setSolutionValue]: currState is not defined')
        }
        let parsedValue = this.parseValue(solutionValue)
        this.stateMatrix[row - 1][col - 1].solutionValue = parsedValue
        return this.getCellState(row, col)
    }

    setTempInput(row, col, strInput) {
        let currState = this.getCellState(row, col)
        if (!currState) {
            throw Error('[setSolutionValue]: currState is not defined')
        }
        let parsedInput = strInput ? String(strInput) : ''
        this.stateMatrix[row - 1][col - 1].tempInput = parsedInput
        return this.getCellState(row, col)
    }

    getFaceMatrix() {
        let matrix = Array.from(new Array(9), (el) => new Array(9).fill(0))
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                matrix[i][j] = this.getFaceValue(i + 1, j + 1)
            }
        }
        return matrix
    }

    getLockedMatrix() {
        let matrix = Array.from(new Array(9), (el) => new Array(9).fill(0))
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let currState = this.getCellState(i + 1, j + 1)
                if (currState.isLocked) matrix[i][j] = currState.faceValue
            }
        }
        return matrix
    }

    clear() {
        // clearing state_matrix data
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.stateMatrix[i][j].faceValue = 0
                this.stateMatrix[i][j].solutionValue = 0
                this.stateMatrix[i][j].isLocked = false
                this.stateMatrix[i][j].tempInput = ''
            }
        }
        // clearing row/col/box data
        for (let k = 0; k < 9; k++) {
            this.rows[k].length = 0
            this.cols[k].length = 0
            this.boxes[k].length = 0
        }
        this.solution = null
    }

    resetUnlocked() {
        for (let row = 1; row <= 9; row++) {
            for (let col = 1; col <= 9; col++) {
                if (!this.isCellLocked(row, col)) {
                    this.setFaceValue(row, col, 0)
                }
            }
        }
    }

    // solve the solution matrix and completely fill the face values keeping the isLocked state as it is
    solve() {
        if (!this.solution) return false
        // else solve the solution and check if issolved
        let isSolved = this.solution.solve()
        if (!isSolved) return false

        // else
        for (let row = 1; row <= 9; row++) {
            for (let col = 1; col <= 9; col++) {
                this.setFaceValue(row, col, this.solution.getCell(row, col))
                this.setSolutionValue(row, col, this.solution.getCell(row, col))
            }
        }
    }

    // get unique positions and their available values
    // returns hints : [{row, col, value}]
    getHints() {
        if (!this.solution || !this.solution.isSolved) return null
        else {
            let faceMatrix = this.getFaceMatrix()
            let tempSolutionMatrix = new SudokuSolution(faceMatrix)
            let hints = []
            for (let row = 1; row <= 9; row++) {
                for (let col = 1; col <= 9; col++) {
                    if (!faceMatrix[row - 1][col - 1]) {
                        let options = tempSolutionMatrix.getOptions(row, col)
                        if (options.length === 1) {
                            hints.push({
                                row: row,
                                col: col,
                                value: options[0],
                            })
                        }
                    }
                }
            }
            return hints
        }
    }

    // check validity of passed matrix
    checkValidityOfMatrix(matrix) {
        let tempSolutionMatrix = new SudokuSolution(matrix)
        tempSolutionMatrix.solve()
        return tempSolutionMatrix.isSolved
    }

    // check validity of locked matrix
    // checkLockedMatrixValidity() {
    //     let lockedMatrix = this.getLockedMatrix()
    //     return this.checkValidityOfMatrix(matrix)
    // }

    generateRandomSolutionMatrix() {
        let SWAPS_C = 1000
        const SEED_MATRIX = [
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
        while (SWAPS_C--) {
            let [r1, r2] = POSSIBLE_SWAPS[this.getRandBetween(0, 8)]
            let [c1, c2] = POSSIBLE_SWAPS[this.getRandBetween(0, 8)]
            swapRow(SEED_MATRIX, r1, r2)
            swapCol(SEED_MATRIX, c1, c2)
        }
        return SEED_MATRIX
    }

    generatePartialMatrix(inputMatrix, ratio) {
        const COUNT_THRESHOLD = 20
        let matrix = Array.from(new Array(9), (el) => new Array(9).fill(0))
        let count = 0
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let val = inputMatrix[i][j]
                matrix[i][j] = val
                if (val !== 0) {
                    count++
                }
            }
        }
        // returning null if count reaches below threshold
        if (count < COUNT_THRESHOLD) return null
        let iterations = Math.floor(count * ratio)
        while (iterations) {
            __LOOP_PROTECTION__()
            let [i, j] = [this.getRandBetween(0, 8), this.getRandBetween(0, 8)]
            if (matrix[i][j]) {
                matrix[i][j] = 0
                iterations--
            }
        }
        return matrix
    }

    createRandom() {
        const SOLUTION_MATRIX = this.generateRandomSolutionMatrix()
        const EMPTY_RATIO = 0.1
<<<<<<< Updated upstream
        const MAX_ATTEMPTS = 100
        let ITERATIONS = 7
=======
        const MAX_ATTEMPTS = 10
        let ITERATIONS = 5
>>>>>>> Stashed changes
        let partialMatrix = JSON.parse(JSON.stringify(SOLUTION_MATRIX))

        while (ITERATIONS--) {
            let newMatrix = JSON.parse(JSON.stringify(partialMatrix))
            let remAttempts = MAX_ATTEMPTS
            while (remAttempts--) {
                __LOOP_PROTECTION__()
                newMatrix = this.generatePartialMatrix(newMatrix, EMPTY_RATIO)
                // count reaches threshold return partialMatrix
                if (newMatrix === null) {
                    return partialMatrix
                }
                // if matrix is valid then breakout of loop
                if (this.checkValidityOfMatrix(newMatrix)) {
                    partialMatrix = newMatrix
                    break
                }
            }
        }
        this.setStateMatrix(partialMatrix)
        this.lockAllFaceValues()
    }
}

export default Sudoku
