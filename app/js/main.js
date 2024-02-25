// 

var canvas1, canvas2, context1, context2;
var score = 0;
var differenceCount = 0;
var clickProcessed = false;
var missCount = 0;
var lives = 2; // Initial lives
var timeLimit = 120; // 2 minutes in seconds
var timerInterval;

var differences = [
    {x1: 309, y1: 188.125, x2: 909, y2: 188.125, found: false},
    {x1: 451, y1: 201.125, x2: -149, y2: 205.125, found: false},
    {x1: 277, y1: 71.125, x2: 877, y2: 71.125, found: false},
    {x1: 143, y1: 323.125, x2: 743, y2: 323.125, found: false},
    {x1: 542, y1: 210.125, x2: 1142, y2: 210.125, found: false},
    // Add more coordinates as needed
];

window.onload = function() {
    canvas1 = document.getElementById('imageCanvas1');
    context1 = canvas1.getContext('2d');

    canvas2 = document.getElementById('imageCanvas2');
    context2 = canvas2.getContext('2d');

    canvas1.addEventListener('click', checkDifference);
    canvas2.addEventListener('click', checkDifference);

    canvas1.addEventListener('click', function() { clickProcessed = false; });
    canvas2.addEventListener('click', function() { clickProcessed = false; });

    canvas1.addEventListener('click', logCoordinates);
    canvas2.addEventListener('click', logCoordinates);

    var img1 = new Image();
    var img2 = new Image();

    img1.onload = function() {
        canvas1.width = img1.width;
        canvas1.height = img1.height;
        context1.drawImage(img1, 0, 0, img1.width, img1.height);
    };

    img2.onload = function() {
        canvas2.width = img2.width;
        canvas2.height = img2.height;
        context2.drawImage(img2, 0, 0, img2.width, img2.height);
    };

    img1.src = '/app/images/different-Image-collection1/OfficePuzzle--2.png';
    img2.src = './images/different-Image-collection1/OfficePuzzle--1.png';

    // Start the timer
    startTimer();
};

function startTimer() {
    var timerDisplay = document.getElementById('timer');
    var minutes, seconds;

    timerInterval = setInterval(function() {
        minutes = Math.floor(timeLimit / 60);
        seconds = timeLimit % 60;

        // Display the timer
        timerDisplay.textContent = 'Time: ' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

        if (timeLimit <= 0) {
            clearInterval(timerInterval);
            endGame("Time's up! Thank you for participating.");
        }

        timeLimit--;
    }, 1000);
}

function checkDifference(event, canvasId) {
    var x, y;
    if (canvasId === 'imageCanvas1') {
        x = event.clientX - canvas1.getBoundingClientRect().left;
        y = event.clientY - canvas1.getBoundingClientRect().top;
    } else if (canvasId === 'imageCanvas2') {
        x = event.clientX - canvas2.getBoundingClientRect().left;
        y = event.clientY - canvas2.getBoundingClientRect().top;
    }

    var found = false;

    differences.forEach(function(difference, index) {
        var dx1 = difference.x1 - x;
        var dy1 = difference.y1 - y;
        var distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

        var dx2 = difference.x2 - x;
        var dy2 = difference.y2 - y;
        var distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if ((distance1 < 20 || distance2 < 20) && !difference.found && !found) {
            // Draw circle on first canvas
            context1.beginPath();
            context1.arc(difference.x1, difference.y1, 20, 0, 2 * Math.PI, false);
            context1.lineWidth = 3;
            context1.strokeStyle = 'green';
            context1.stroke();

            // Draw circle on second canvas
            context2.beginPath();
            context2.arc(x, y, 20, 0, 2 * Math.PI, false); // Use x and y instead of difference.x2 and difference.y2
            context2.lineWidth = 3;
            context2.strokeStyle = 'green';
            context2.stroke();

            score += 100;
            differenceCount++;
            difference.found = true;
            found = true;
        }
    });

    if (!found) {
        // Reduce one life if the difference was not found
        lives--;
        if (lives <= 0) {
            // No lives left, end the game
            endGame("You ran out of lives! Thank you for participating.");
            return; // Exit the function to prevent further execution
        }
    }

    if (differenceCount === differences.length) {
        // All differences found, end the game
        endGame("Congratulations! You found all the differences. Thank you for participating.");
        return; // Exit the function to prevent further execution
    }

    console.log("Score: " + score);
    console.log("Differences found: " + differenceCount);
    console.log("Lives: " + lives);

    document.getElementById('score').textContent = "Score: " + score;
    document.getElementById('differenceCount').textContent = "Differences found: " + differenceCount;
    document.getElementById('lives').textContent = "Lives: " + lives;
}

function endGame(message) {
    clearInterval(timerInterval);

    // Create a modal
    var modal = document.createElement("div");
    modal.setAttribute("id", "myModal");
    modal.setAttribute("class", "modal");

    // Create a modal content
    var modalContent = document.createElement("div");
    modalContent.setAttribute("class", "modal-content");
    modal.appendChild(modalContent);

    // Create a close button
    var close = document.createElement("span");
    close.setAttribute("class", "close");
    close.innerHTML = "×";
    modalContent.appendChild(close);

    // Create a text node with the end message
    var text = document.createTextNode(message);
    modalContent.appendChild(text);

    // Create a button
    var btn = document.createElement("button");
    btn.innerHTML = "Return to Home";
    btn.onclick = function () {
        window.location.href = './index.html'; // Replace with your home page URL
    };
    modalContent.appendChild(btn);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Show the modal
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    close.onclick = function() {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function logCoordinates(event) {
    var x1 = event.clientX - canvas1.getBoundingClientRect().left;
    var y1 = event.clientY - canvas1.getBoundingClientRect().top;

    var x2 = event.clientX - canvas2.getBoundingClientRect().left;
    var y2 = event.clientY - canvas2.getBoundingClientRect().top;

    console.log("Clicked coordinates on Image 1: X = " + x1 + ", Y = " + y1);
    console.log("Clicked coordinates on Image 2: X = " + x2 + ", Y = " + y2);
}