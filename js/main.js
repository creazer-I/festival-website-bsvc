var canvas1, canvas2, context1, context2;
var score = 0;
var differenceCount = 0;
var missCount = 0;
var lives = 2; // Initial lives
var timeLimit = 120; // 2 minutes in seconds
var timerInterval;
var threshold = 40; 
var decision; // Threshold for detecting differences
//var form = document.getElementById('participationForm');


var differences = [
    // {x1: 309, y1: 188.125, x2: 909, y2: 188.125, found: false},
    // {x1: 451, y1: 201.125, x2: -149, y2: 205.125, found: false},
    // {x1: 277, y1: 71.125, x2: 877, y2: 71.125, found: false},
    // {x1: 143, y1: 323.125, x2: 743, y2: 323.125, found: false},
    // {x1: 542, y1: 210.125, x2: 1142, y2: 210.125, found: false}
    // Add more coordinates as needed

    //week 1 image coordinates
    {x1: 146, y1: 198, x2: 143, y2: 192, found: false},
    {x1: 387, y1: 67, x2: 391, y2: 63, found: false},
    {x1: 136, y1: 111, x2: 133, y2: 109, found: false},
    {x1: 19, y1: 209, x2: 23, y2: 201, found: false},
    {x1:364, y1:209, x2: 364, y2: 211, found: false},
];

window.onload = function() {
    form = document.querySelector('#participationForm');  // Select the form when the window loads

    if (form) {  // If the form exists, we're on the index.html page
        //console.log(form);  // Log the form to the console

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from being submitted normally

            var reader = new FileReader();

            reader.onload = function(e) {
            // Get form data
            var formData = {
                fullName: document.getElementById('fullName').value,
                icNumber: document.getElementById('icNumber').value,
                emailAddress: document.getElementById('emailAddress').value,
                photoUpload:  e.target.result,
                mobileNumber: document.getElementById('mobileNumber').value,
                purchaseDate: document.getElementById('purchaseDate').value,
                storeName: document.getElementById('storeName').value,
                state: document.getElementById('state').value,
            };

            // Store form data in local storage
            localStorage.setItem('formData', JSON.stringify(formData));

            // Redirect to game page
            window.location.href = './game.html';
        };
         reader.readAsDataURL(document.getElementById('photoUpload').files[0]);
        });
    }

    // Get canvas and context
    canvas1 = document.getElementById('imageCanvas1');
    context1 = canvas1.getContext('2d');

    canvas2 = document.getElementById('imageCanvas2');
    context2 = canvas2.getContext('2d');

    if (canvas1 && canvas2) { 

    // Add event listeners for both canvases
    canvas1.addEventListener('click', function(event) {
        checkDifference(event, 'imageCanvas1');
        logCoordinates(event, 'imageCanvas1');
    });

    canvas2.addEventListener('click', function(event) {
        checkDifference(event, 'imageCanvas2');
        logCoordinates(event, 'imageCanvas2');
    });


    // Load images
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

    img1.src = 'images/different-Image-collection1/Original_1.png';
    img2.src = 'images/different-Image-collection1/Duplicate_2.png';
    // img1.src = './images/different-Image-collection1/OfficePuzzle--2.png';
    // img2.src = './images/different-Image-collection1/OfficePuzzle--1.png';
    // Start the timer
    startTimer();

    }
};

function logCoordinates(event, canvasId) {
    var canvas = document.getElementById(canvasId);
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
}

// Timer function
function startTimer() {
    var timerDisplay = document.getElementById('timer');

    timerInterval = setInterval(function() {
        var minutes = Math.floor(timeLimit / 60);
        var seconds = timeLimit % 60;

        // Display the timer
        timerDisplay.textContent = 'Time: ' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

        if (timeLimit <= 0) {
            clearInterval(timerInterval);
            decision = "lost";
            endGame("Time's up! Thank you for participating.");
        }

        timeLimit--;
    }, 1000);
}

function getCanvasCoordinates(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    var x = (event.clientX - rect.left) * scaleX;
    var y = (event.clientY - rect.top) * scaleY;
    return { x: x, y: y };
}

// Function to check differences
function checkDifference(event, canvasId) {
    var canvas, context, otherCanvas, otherContext;
    if (canvasId === 'imageCanvas1') {
        canvas = canvas1;
        context = context1;
        otherCanvas = canvas2;
        otherContext = context2;
    } else if (canvasId === 'imageCanvas2') {
        canvas = canvas2;
        context = context2;
        otherCanvas = canvas1;
        otherContext = context1;
    } else {
        return;
    }

    var coordinates = getCanvasCoordinates(canvas, event);
    var x = coordinates.x;
    var y = coordinates.y;

    var found = false;

    differences.forEach(function(difference) {
        var dx1 = difference.x1 - x;
        var dy1 = difference.y1 - y;
        var distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

        var dx2 = difference.x2 - x;
        var dy2 = difference.y2 - y;
        var distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if ((distance1 < threshold || distance2 < threshold) && !difference.found && !found) {
            context.beginPath();
            context.arc(difference.x1, difference.y1, threshold, 0, 2 * Math.PI, false);
            context.lineWidth = 3;
            context.strokeStyle = 'green';
            context.stroke();

            // Draw circle on second canvas
            otherContext.beginPath();
            otherContext.arc(x, y, threshold, 0, 2 * Math.PI, false);
            otherContext.lineWidth = 3;
            otherContext.strokeStyle = 'green';
            otherContext.stroke();

            score += 100;
            differenceCount++;
            difference.found = true;
            found = true;

            // Update differences found counter in HTML
            document.getElementById('remainingDifferences').textContent = differences.length - differenceCount;
        }
    });

    if (!found) {
        // Increment miss count
        console.log("No difference found at this spot.");
        missCount++;
        // If miss count reaches 2, reduce one life
        if (missCount === 2) {
            lives--;
            document.getElementById('lives').textContent = "Lives: " + lives; // Update lives counter
            missCount = 0; // Reset miss count
            if (lives <= 0) {
                // No lives left, end the game
                decision = "lost";
                endGame("You ran out of lives! Thank you for participating.");
                return; // Exit the function to prevent further execution
            }
        }
    } else {
        // Reset miss count if a difference is found
        missCount = 0;
    }

    document.getElementById('score').textContent = "Score: " + score;

    console.log("Score: " + score);
    console.log("Differences found: " + differenceCount);
    console.log("Lives: " + lives);

    if (differenceCount === differences.length) {
        // All differences found, end the game
        decision = "won";
        endGame("Congratulations! You found all the differences. Thank you for participating.");
        return; // Exit the function to prevent further execution
    }

}

function getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

function saveData() {
    var formData = JSON.parse(localStorage.getItem('formData'));
    var currentTime = new Date();
    // Get game data
    var gameData = {
        score: score,
        time: currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds(),
        lives: lives, 
        entryid:  Math.floor(Math.random() * 9900) + 100,
        entrydate: getTodayDate(),
        result: decision,
        remaining_time: timeLimit,
    };

    // Combine form data and game data
    var data_log = {...formData, ...gameData};

    // Your fetch request here
    fetch('http://localhost:3000/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data_log),
    })
    .then(function(response) {
        if (response.ok) {
            return response.json(); // Parse response JSON if response is successful
        } else {
            throw new Error('Failed to save data in the database'); // Throw an error if response is not successful
        }
    })
    .then(function(data) {
        console.log(data.message); // Log success message
        // Optionally, you can display a success message to the user here
        // Add any additional client-side logic here without causing a page reload
    })
    .catch(function(error) {
        console.error(error); // Log any errors
        // Handle error condition here, e.g., display an error message to the user
    });
}

function endGame() {
    clearInterval(timerInterval);

    var formData = JSON.parse(localStorage.getItem('formData'));
    var currentTime = new Date();
    // Get game data
    var gameData = {
        score: score,
        time: currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds(),
        lives: lives, 
        //entryid:  Math.floor(Math.random() * 9900) + 100,
        entrydate: getTodayDate(),
        result: decision,
        remaining_time: timeLimit,
    };

    // Combine form data and game data
    var data_log = {...formData, ...gameData};

    console.log(data_log)

    logMissingSpots();

    // Create a full-screen semi-transparent overlay
    var overlay = document.createElement("div");
    overlay.setAttribute("id", "overlay");
    overlay.style.position = "fixed";
    overlay.style.display = "block";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.right = "0";
    overlay.style.bottom = "0";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.zIndex = "2";
    overlay.style.cursor = "pointer";
    document.body.appendChild(overlay);

    // Create a modal
    var modal = document.createElement("div");
    modal.setAttribute("id", "myModal");
    modal.setAttribute("class", "modal");
    modal.style.position = "fixed"; // Stay in place
    modal.style.zIndex = "3"; // Sit on top
    modal.style.left = "50%"; // Center horizontally
    modal.style.top = "50%"; // Center vertically
    modal.style.transform = "translate(-50%, -50%)"; // Compensate for the modal's own dimensions
    modal.style.width = "80%"; // Set the width of the modal for mobile devices
    modal.style.maxWidth = "600px"; // Set the max-width of the modal for larger screens
    modal.style.maxHeight = "90%"; // Set the max-height of the modal
    modal.style.overflow = "auto"; // Add scrollbar if the content is too tall

    // Add this at the end of your CSS file
    var style = document.createElement('style');
    style.innerHTML = `
    @media (min-width: 768px) {
        #myModal {
        width: 70%; // Set the width of the modal for iPads
        }
    }
    @media (min-width: 992px) {
        #myModal {
        width: 50%; // Set the width of the modal for desktops
        }
    }
    `;
    document.head.appendChild(style);

    // Create a modal content
    var modalContent = document.createElement("div");
    modalContent.setAttribute("class", "modal-content");

    // Create a modal body
    var modalBody = document.createElement("div");
    modalBody.setAttribute("class", "modal-body");
    var img = document.createElement("img"); // Create an image element
    img.setAttribute("src", "./icons/confetti-one.png"); // Replace with your image source
    img.style.display = "block";
    img.style.width   = "110px"
    img.style.height  = "110px"
    img.style.margin  = "0 auto"; // Center the image
    modalBody.appendChild(img);

    var title = document.createElement("h4"); // Change from 'h5' to 'h2' for a larger title
    title.setAttribute("class", "modal-title");
    title.innerText = "Thanks for Participating in FFM 2024 Raya Beli+Main=Menang Contest!"; // Set the title text
    title.style.textAlign = "center"; // Center the title text
    modalBody.appendChild(title); // Append the title to the modal body

    // Add a quote
    var quote = document.createElement("p");
    quote.setAttribute("class", "modal-quote");
    quote.innerText = "You may have a higher chance of winning by making another purchase and submitting for an additional entry!"; // Set the quote text
    quote.style.textAlign = "center"; // Center the quote text
    modalBody.appendChild(quote); // Append the quote to the modal body

    // Create a modal footer
    var modalFooter = document.createElement("div");
    modalFooter.setAttribute("class", "modal-footer");
    var btn = document.createElement("button");
    btn.setAttribute("class", "btn btn-primary");
    btn.innerHTML = "Submit"; // Change from 'Claim Now!' to 'Return to Home'
    btn.style.display = "block"; // Make the button a block element
    btn.style.margin = "auto"; // Center the button
    btn.onclick = function () {
        // Call saveData() function here
        saveData();
        
        // Redirect to index.html after saveData() completes
        window.location.href = './index.html';
    };
    modalFooter.appendChild(btn);


    // Append the body, and footer to the modal content
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    // Append the modal content to the modal
    modal.appendChild(modalContent);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Show the modal
    modal.style.display = "block";
}


function logMissingSpots() {
    console.log("Missing spots for canvas 1:");
    differences.forEach(function(difference, index) {
        if (!difference.found && difference.x1 !== undefined && difference.y1 !== undefined) {
            console.log("X1:", difference.x1, "Y1:", difference.y1);
        }
    });

    console.log("Missing spots for canvas 2:");
    differences.forEach(function(difference, index) {
        if (!difference.found && difference.x2 !== undefined && difference.y2 !== undefined) {
            console.log("X2:", difference.x2, "Y2:", difference.y2);
        }
    });
}


