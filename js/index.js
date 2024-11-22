import Sudoku from './sudoku.js'
import {
    getNode,
    setTable,
    checkTable,
    clearFormatting,
    addInputListenerToTableCells,
    uploadFile,
    showNotification,
    closeNotification,
} from './utils.js'

import { TEST_MAT } from './mockData.js'

function main() {
    // main sudoku ui table component
    const table1 = document.querySelector('.sudoku > table')

    // assigning buttons to sudoku
    const controls = {
        clear: document.querySelector('.sudoku .controls__clear'),
        random: document.querySelector('.sudoku .controls__random'),
        fill: document.querySelector('.sudoku .controls__fill'),
        hint: document.querySelector('.sudoku .controls__hint'),
        check: document.querySelector('.sudoku .controls__check'),
        reset: document.querySelector('.sudoku .controls__reset'),
    }

    const additionalControls = {
        lock: document.querySelector('.sudoku .controls__lock'),
        unlock: document.querySelector('.sudoku .controls__unlock'),
    }

    // defining image processing elments
    const fileInput = document.querySelector('.upload__container input')
    const processLoader = document.getElementById('load')
    const processedImageEl = document.querySelector(
        '.processed_image__container img'
    )
    const inputImage = document.querySelector('.input-image__container img')

    const sudoku1 = new Sudoku(TEST_MAT)
    // sudoku1.createRandom()
    // sudoku1.solve()
    setTable(table1, sudoku1)
    addInputListenerToTableCells(table1, (row, col, event) => {
        let currValue = event.data ? event.data : ''
        if (currValue.match(/^[1-9]$/)) {
            event.target.value = currValue
            sudoku1.setFaceValue(row, col, parseInt(currValue))
        } else {
            event.target.value = ''
            sudoku1.setFaceValue(row, col, 0)
        }
    })

    // adding event listeners to controls
    controls.clear.addEventListener('click', (event) => {
        clearFormatting(table1)
        sudoku1.clear()
        setTable(table1, sudoku1)
    })

    controls.random.addEventListener('click', (event) => {
        clearFormatting(table1)
        sudoku1.createRandom()
        setTable(table1, sudoku1)
    })

    controls.fill.addEventListener('click', (event) => {
        clearFormatting(table1)
        sudoku1.solve()
        setTable(table1, sudoku1)
    })

    controls.reset.addEventListener('click', (event) => {
        clearFormatting(table1)
        sudoku1.resetUnlocked()
        setTable(table1, sudoku1)
    })

    controls.hint.addEventListener('click', (event) => {
        clearFormatting(table1)
        let arr = sudoku1.getHints()
        if (!arr) {
            showNotification('error', 'Hints not available on invalid matrix!')
            return
        }
        for (let hint of arr) {
            let value = hint.value
            let node = getNode(table1, hint.row, hint.col)
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

    additionalControls.lock.addEventListener('click', () => {
        clearFormatting(table1)
        let isValid = sudoku1.lockAllFaceValues()
        if (!isValid)
            showNotification('error', "Sudoku is invalid hence can't be locked")
        setTable(table1, sudoku1)
    })

    additionalControls.unlock.addEventListener('click', () => {
        clearFormatting(table1)
        sudoku1.unlockAllFaceValues()
        setTable(table1, sudoku1)
    })

    fileInput.addEventListener('change', (event) => {
        const UPLOAD_ENDPOINT = 'http://localhost:8000/process/'
        const file = fileInput.files[0]

        // set image in input container
        const reader = new FileReader()
        reader.onload = (event) => {
            inputImage.style.display = 'block'
            inputImage.src = event.target.result
        }
        reader.readAsDataURL(file)

        // set spinner in processed container
        processLoader.style.display = 'block'
        processedImageEl.style.display = 'none'

        uploadFile(UPLOAD_ENDPOINT, file).then((data) => {
            if (data.success) {
                const { processedImage, matrix } = data.data
                if (processedImage)
                    processedImageEl.src = `data:image/jpg;base64,${processedImage}`
                if (matrix) {
                    sudoku1.setStateMatrix(matrix)
                    setTable(table1, sudoku1)
                }
            } else if (data.error) {
                console.error(
                    'error:[uploadFile]:' + JSON.stringify(data.error)
                )
            }
            processLoader.style.display = 'none'
            processedImageEl.style.display = 'block'
        })
    })
}

main()
