pathWidth = 10       //Width of the Maze Path
wall = 2             //Width of the Walls between Paths
outerWall = 2        //Width of the Outer most wall
width = 25           //Number paths fitted horisontally
height = 25          //Number paths fitted vertically
delay = 1            //Delay between algorithm cycles
x = width/2|0        //Horisontal starting position
y = height/2|0       //Vertical starting position
seed = Math.random()*100000|0//Seed for random numbers
wallColor = 'Black'   //Color of the walls
pathColor = 'White'//Color of the path

//Function to generate random numbers based on a seed
randomGen = function(seed){
    if(seed===undefined)var seed=performance.now()
    return function(){
        seed = (seed * 9301 + 49297) % 233280
        return seed/233280
    }
}

//initialize the maze
init = function(){
    offset = pathWidth/2+outerWall
    map = []
    // canvas = document.querySelector('canvas')
    canvas = document.getElementById('maze')
    ctx = canvas.getContext('2d')
    canvas.width = outerWall*2+width*(pathWidth+wall)-wall
    canvas.height = outerWall*2+height*(pathWidth+wall)-wall
    ctx.fillStyle = wallColor
    ctx.fillRect(0,0,canvas.width,canvas.height)
    random = randomGen(seed)
    ctx.strokeStyle = pathColor
    ctx.lineCap = 'square'
    ctx.lineWidth = pathWidth
    ctx.beginPath()
    for(var i=0;i<height*2;i++){
        map[i] = []
        for(var j=0;j<width*2;j++){
            map[i][j] = false
        }
    }
    map[y*2][x*2] = true
    route = [[x,y]]
    ctx.moveTo(x*(pathWidth+wall)+offset,
        y*(pathWidth+wall)+offset)
}
init()

//Set up canvas and context
inputWidth = document.getElementById('width')
console.log(inputWidth)
inputHeight = document.getElementById('height')
inputPathWidth = document.getElementById('pathwidth')
inputWallWidth = document.getElementById('wallwidth')
inputOuterWidth = document.getElementById('outerwidth')
inputPathColor = document.getElementById('pathcolor')
inputWallColor = document.getElementById('wallcolor')
inputSeed = document.getElementById('seed')
buttonRandomSeed = document.getElementById('randomseed')

//define settings object with display, check, and update funtion
settings = {
    display: function(){
        inputWidth.value = width
        inputHeight.value = height
        inputPathWidth.value = pathWidth
        inputWallWidth.value = wall
        inputOuterWidth.value = outerWall
        inputPathColor.value = pathColor
        inputWallColor.value = wallColor
        inputSeed.value = seed
    },
    check: function(){
        if(inputWidth.value != width||
            inputHeight.value != height||
            inputPathWidth.value != pathWidth||
            inputWallWidth.value != wall||
            inputOuterWidth.value != outerWall||
            inputPathColor.value != pathColor||
            inputWallColor.value != wallColor||
            inputSeed.value != seed){
            settings.update()
        }
    },
    update: function(){
        clearTimeout(timer)
        width = parseFloat(inputWidth.value)
        height = parseFloat(inputHeight.value)
        pathWidth = parseFloat(inputPathWidth.value)
        wall = parseFloat(inputWallWidth.value)
        outerWall = parseFloat(inputOuterWidth.value)
        pathColor = inputPathColor.value
        wallColor = inputWallColor.value
        seed = parseFloat(inputSeed.value)
        x = width/2|0
        y = height/2|0
        init()
        loop()
    }
}

//Event listener for generating a random seed
buttonRandomSeed.addEventListener('click',function(){
    inputSeed.value = Math.random()*100000|0
})

//main loop for generating the maze
loop = function(){
    x = route[route.length-1][0]|0
    y = route[route.length-1][1]|0

    var directions = [[1,0],[-1,0],[0,1],[0,-1]],
        alternatives = []

    for(var i=0;i<directions.length;i++){
        if(map[(directions[i][1]+y)*2]!=undefined&&
            map[(directions[i][1]+y)*2][(directions[i][0]+x)*2]===false){
            alternatives.push(directions[i])
        }
    }

    if(alternatives.length===0){
        route.pop()
        if(route.length>0){
            ctx.moveTo(route[route.length-1][0]*(pathWidth+wall)+offset,
                route[route.length-1][1]*(pathWidth+wall)+offset)
            timer = setTimeout(loop,delay)
        }
        return;
    }
    direction = alternatives[random()*alternatives.length|0]
    route.push([direction[0]+x,direction[1]+y])
    ctx.lineTo((direction[0]+x)*(pathWidth+wall)+offset,
        (direction[1]+y)*(pathWidth+wall)+offset)
    map[(direction[1]+y)*2][(direction[0]+x)*2] = true
    map[direction[1]+y*2][direction[0]+x*2] = true
    ctx.stroke()
    timer = setTimeout(loop,delay)
}

//Display initial settings and start the loop
settings.display()
loop()
setInterval(settings.check,400)

// Downloading the maze as an image
const downloadButton = document.getElementById('downloadButton');

// Add a click event listener to the download button
downloadButton.addEventListener('click', function() {
    // Create a temporary canvas element for resizing the maze
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Set the temporary canvas dimensions to 650px by 650px
    tempCanvas.width = 650;
    tempCanvas.height = 650;

    // Scale and draw the maze onto the temporary canvas
    const scale = 650 / Math.max(canvas.width, canvas.height);
    tempCtx.drawImage(canvas, 0, 0, canvas.width * scale, canvas.height * scale);

    // Add "Start" text at the top left corner
    tempCtx.font = 'bold 16px Arial';
    tempCtx.fillStyle = 'red';
    tempCtx.textAlign = 'left';
    tempCtx.fillText('Start', 10, 20);

    // Add "Finish" text at the bottom right corner
    tempCtx.textAlign = 'right';
    tempCtx.fillText('Finish', tempCanvas.width - 10, tempCanvas.height - 10);

    // Create a temporary link element for downloading
    const downloadLink = document.createElement('a');

    // Set the link's href attribute to the resized maze canvas data URL
    downloadLink.href = tempCanvas.toDataURL();

    // Set the link's download attribute to the desired filename (e.g., "maze.png")
    downloadLink.download = 'maze.png';

    // Append the link, trigger the download and clean up
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
});
