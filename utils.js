// globals
// loop protection
window.__LOOP_OFFSET__ = 10000
window.__LOOP_PROTECTION__ = function () {
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

function addInputListenerToTableCells(table, callbackFn) {
    // assigning input listener // restricted to only table entity and no change on the underlying sudoku
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            const node = getNode(table, row, col)
            node.addEventListener('input', callbackFn.bind(this, row, col))
        }
    }
}

// setting html sudoku table according to sudoku instance
function setTable(table, sudoku) {
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            const node = getNode(table, row, col)
            const cellState = sudoku.getCellState(row, col)
            const strValue = cellState.faceValue
                ? String(cellState.faceValue)
                : ''
            setNode(node, strValue)
            if (cellState.isLocked) {
                // node.style = 'text-shadow: 0 0 0 black;'
                node.style['text-shadow'] = '0 0 0 black'
                node.disabled = true
            } else {
                // node.style = 'text-shadow: 0 0 0 blue;'
                node.style['text-shadow'] = '0 0 0 blue'
                node.disabled = false
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

function checkTable(table, sudoku) {
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            const node = getNode(table, row, col)
            let isValid = sudoku.isCellValid(row, col)
            if (!isValid) {
                node.style.border = '2px solid red'
            }
        }
    }
}

async function uploadFile(url, file) {
    const formData = new FormData()
    formData.append('file', file)
    let result
    try {
        let response = await fetch(url, {
            method: 'POST',
            body: formData,
        })
        result = await response.json()
    } catch (err) {
        result = {
            status: err.response.status,
            error: err,
        }
    }
    return result
}

function showNotification(type, message) {
    const notificationContainer = document.getElementById(
        'notificationContainer'
    )

    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.innerHTML = `
        <div class="notification-content">${message}</div>
        <div class="notification-close" >x</div>
    `

    // Append notification to container
    notificationContainer.appendChild(notification)

    document
        .querySelector('.notification .notification-close')
        .addEventListener('click', (event) => {
            closeNotification(event.target.parentElement)
        })

    // Show notification with delay for animation
    setTimeout(() => {
        notification.classList.add('show')
    }, 100)

    // Automatically remove notification after 5 seconds
    setTimeout(() => {
        closeNotification(notification)
    }, 5000)
}

function closeNotification(notification) {
    notification.classList.remove('show')

    // Remove notification from DOM after transition ends
    notification.addEventListener('transitionend', () => {
        notification.remove()
    })
}
export {
    getRandBetween,
    getNode,
    setNode,
    setTable,
    checkTable,
    clearFormatting,
    addInputListenerToTableCells,
    uploadFile,
    showNotification,
    closeNotification,
}
