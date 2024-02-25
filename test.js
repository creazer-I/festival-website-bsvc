if (distance1 < 20 || distance2 < 20) { // Adjust as needed
    [context1, context2].forEach(function(context) {
        context.beginPath();
        context.arc(difference.x, difference.y, 20, 0, 2 * Math.PI, false);
        context.lineWidth = 3;
        context.strokeStyle = 'green';
        context.stroke();
    });

    // Increment score and differenceCount
    score += 100;
    differenceCount++;

    // Log the current score and difference count
    console.log("Score: " + score);
    console.log("Differences found: " + differenceCount);
}
