const shapeFreezeAudio = new Audio("./audio/audios_audios_tetraminoFreeze.wav")
const completedLineAudio = new Audio("./audio/audios_audios_completedLine.wav")
const gameOverAudio = new Audio("./audio/audios_audios_gameOver.wav")
const sonoroAudio = new Audio("./audio/efeito_audio.mp3")
const fundoAudio = document.getElementById("audio")
fundoAudio.volume = 0.5;



//Shapes
const gridWidth = 10;

const lShape = [
    [1, 2, gridWidth + 1, gridWidth * 2 + 1], //começa da posição 0 e vai até o 9
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 2],
    [1, gridWidth + 1, gridWidth * 2, gridWidth * 2 + 1],
    [gridWidth, gridWidth * 2, gridWidth * 2 + 1, gridWidth * 2 + 2]
]

const zShape = [
    [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
    [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
    [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
    [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1]
]

const tShape = [
    [1, gridWidth, gridWidth + 1, gridWidth + 2],
    [1, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
    [1, gridWidth, gridWidth + 1, gridWidth * 2 + 1]
]

const oShape = [
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1]
]

const iShape = [
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3]
]

const allShapes = [lShape, zShape, tShape, oShape, iShape]
const colors = ["orange", "pink", "blue", "red", "yellow"]
let currentColor = Math.floor(Math.random() * allShapes.length)
let nextColor = [currentColor]
let $completedLine = 0
let currentPosition = 3
let currentRotation = 0
let playerName = " "
let randomShape = Math.floor(Math.random() * allShapes.length)

let currentShape = allShapes[randomShape][currentRotation]
let $gridSquares = Array.from(document.querySelectorAll(".grid div"))//transformamos em array para usar a função splice


function playAudio() {
    fundoAudio.play()
}

window.onload = function () {
    playAudio()
}


function draw() {
    currentShape.forEach(squareIndex => {
        $gridSquares[squareIndex + currentPosition].classList.add("shapePainted", `${colors[currentColor]}`)
    })
}
draw()

function undraw() {
    currentShape.forEach(squareIndex => {
        $gridSquares[squareIndex + currentPosition].classList.remove("shapePainted", `${colors[currentColor]}`)
    })
}

//funcionalidade botão restart
const $restartButton = document.getElementById("restart-button")
$restartButton.addEventListener("click", () => {
    window.location.reload()
})

//começar o jogo com a peça parada
let timeMoveDown = 1000
let timerId = null
const $startStopButton = document.getElementById("start-button")
$startStopButton.addEventListener("click", () => {
    if (timerId) {
        clearInterval(timerId) //pausar o jogo quando clicar no botão
        timerId = null
    } else {
        timerId = setInterval(moveDown, timeMoveDown)
    }
})

function moveDown() {

    freeze()
    undraw()
    currentPosition += 10
    draw()
}

function freeze() {
    if (currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition + gridWidth].classList.contains("filled")//verifica se a proxima linha está preenchida
    )) {
        currentShape.forEach(squareIndex => $gridSquares[squareIndex + currentPosition].classList.add("filled"))//impedir que a proxima peça entre dentro
        //gerar um novo shape
        currentPosition = 3
        currentRotation = 0
        randomShape = nextRandomShape

        currentShape = allShapes[randomShape][currentRotation]
        currentColor = nextColor
        draw()

        checkIfRowIsFilled()
        updateScore(20)
        shapeFreezeAudio.play()
        displayNextShape()
        gameOver()
    }
}

function moveLeft() {
    //limite de borda
    const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0)
    if (isEdgeLimit) return


    const isFilled = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition - 1].classList.contains("filled")
    )
    if (isFilled) return

    undraw()
    currentPosition--
    draw()


}

function moveRight() {

    const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === gridWidth - 1)
    if (isEdgeLimit) return

    const isFilled = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition + 1].classList.contains("filled")
    )
    if (isFilled) return


    undraw()
    currentPosition++
    draw()

}


function previousRotate() {
    if (currentRotation === 0) {
        currentRotation === currentShape.length - 1
    } else {
        currentRotation--
    }

    currentShape = allShapes[randomShape][currentRotation]
}

function rotate() {
    undraw()

    if (currentRotation === currentShape.length - 1) {  //subtrai 1 pois a quantidade de rotações são 4 e o array vai de 0 a 3 
        currentRotation = 0 //voltar na primeira rotação se estiver na ultima
    } else {
        currentRotation++
    }
    currentShape = allShapes[randomShape][currentRotation]

    //verificações para a peça não entrar na outra ou cortar
    const isLeftEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0)
    const isRightEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === gridWidth - 1)

    //verificação para a peça não ocupar as duas bordas ao mesmo tempo quanto for girar
    if (isLeftEdgeLimit && isRightEdgeLimit) {
        previousRotate()
    }
    const isFilled = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition].classList.contains("filled")
    )

    if (isFilled) {
        previousRotate()
    }
    draw()
}

let $grid = document.querySelector(" .grid")


function checkIfRowIsFilled() {
    for (var row = 0; row < $gridSquares.length; row += gridWidth) {
        let currentRow = []

        for (var square = row; square < row + gridWidth; square++) {
            currentRow.push(square)
        }

        const isRowPainted = currentRow.every(square =>
            $gridSquares[square].classList.contains("shapePainted")
        )
        if (isRowPainted) {
            const squareRemoved = $gridSquares.splice(row, gridWidth)
            squareRemoved.forEach(square =>
                square.removeAttribute("class")
            )
            $gridSquares = squareRemoved.concat($gridSquares)
            $gridSquares.forEach(square => $grid.appendChild(square))//acrescentar square na nova linha

            updateScore(100)
            completedLineAudio.play()
            $completedLine++
        }
    }
}
const $miniGridSquares = document.querySelectorAll(".mini-grid div")
const miniGridWidth = 6
const nextPosition = 2
const possibleNextShapes = [
    [1, 2, miniGridWidth + 1, miniGridWidth * 2 + 1],
    [miniGridWidth + 1, miniGridWidth + 2, miniGridWidth * 2, miniGridWidth * 2 + 1],
    [1, miniGridWidth, miniGridWidth + 1, miniGridWidth + 2],
    [0, 1, miniGridWidth, miniGridWidth + 1],
    [1, miniGridWidth + 1, miniGridWidth * 2 + 1, miniGridWidth * 3 + 1]
]
let nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)

function displayNextShape() {
    $miniGridSquares.forEach(square => square.classList.remove("shapePainted", `${colors[nextColor]}`))//limpar a peça para a proxima peça
    nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)
    nextColor = Math.floor(Math.random() * colors.length)
    const nextShape = possibleNextShapes[nextRandomShape]
    nextShape.forEach(squareIndex =>
        $miniGridSquares[squareIndex + nextPosition + miniGridWidth].classList.add("shapePainted", `${colors[nextColor]}`)
    )
}
displayNextShape()



const $score = document.querySelector(" .score")
let score = 0
function updateScore(updateValue) {
    document.querySelector(".completedLine").textContent = $completedLine
    score += updateValue
    $score.textContent = score


    clearInterval(timerId)//limpar o setInterval para alterar de acordo com os score
    if (score <= 450) {
        timeMoveDown = 1000;
    }
    else if (450 < score && score <= 1000) {
        timeMoveDown = 900;
    }
    else if (1000 < score && score <= 1700) {
        timeMoveDown = 500;
    }
    else if (1700 < score && score <= 2700) {
        timeMoveDown = 200;
    }
    else if (2700 < score && score <= 3850) {
        timeMoveDown = 150;
    }
    else {
        timeMoveDown = 110;
    }
    timerId = setInterval(moveDown, timeMoveDown)
}

function getPlayerName() {

    playerName = prompt("Digite seu nome: ")
}
getPlayerName()

function gameOver() {
    if (currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition].classList.contains("filled")
    )) {
        updateScore(-15)
        clearInterval(timerId)
        timerId = null
        $startStopButton.disabled = true
        gameOverAudio.play()
        $score.innerHTML += "<br />" + "Gamer Over: " + ` jogador ${playerName}`
    }
}

document.addEventListener("keydown", controlKeyboard)

function controlKeyboard(event) {

    if (timerId) {
        if (event.key === "ArrowLeft") {
            moveLeft()
            sonoroAudio.play()
        } else if (event.key === "ArrowRight") {
            moveRight()
            sonoroAudio.play()

        } else if (event.key === "ArrowDown") {
            moveDown()
            sonoroAudio.play()

        } else if (event.key === "ArrowUp") {
            rotate()
            sonoroAudio.play()
        }
    }
}