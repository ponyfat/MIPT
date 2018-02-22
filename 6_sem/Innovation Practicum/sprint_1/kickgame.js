let n;
function startGame() {
	alert(document.getElementById('input').value);
	n = Number(document.getElementById('input').value)
	myGameArea.start();
	scoreBoard.create();
}

const line_width = 6;
const rounds = 10;
const size = 300;
const border_size = 5 + 2 * 3;
var myBall;

var myGameArea = {
    start : function() {
    	this.canvas = document.createElement("canvas");
    	this.cell_size = 100;
        this.canvas.width = n * 100 + (n + 1) * line_width;
        this.canvas.height = n * 100 + (n + 1) * line_width;
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener('click', onCanvasClick, false);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.drawLines();
        this.frameNo = 0;
        this.circle = new gameCircleComponent();
        this.circle.relocate();
        this.roundsDone = 0;
    },
    drawLines: function() {
        /* drawing cells on a game field */
        let y = 0, x = 0;
        this.context.setLineDash([5]);
    	for(let i = 0; i <= n; i++) {
    		this.drawHorizontalLine(y);
    		this.drawVerticalLine(y);
    		//this.drawVerticalLine(x);
    		/*this.context.moveTo(0, y);
    		this.context.lineTo(this.canvas.width, y);
    		this.context.stroke();
    		this.context.moveTo(0, y + line_width);
    		this.context.lineTo(this.canvas.width, y + line_width);
    		this.context.stroke();
    		this.context.moveTo(x, 0);
    		this.context.lineTo(x, this.canvas.height);
    		this.context.stroke();
    		this.context.moveTo(x + line_width, 0);
    		this.context.lineTo(x + line_width, this.canvas.height);
    		this.context.stroke(); */
    		y += 100 + 6;
    	}
    	this.context.setLineDash([]);
    	this.context.strokeStyle = "black";
    },
    drawHorizontalLine: function(y) {
    	console.log('I am drawing');
    	/* inside part */
    	this.context.lineWidth = line_width;
    	this.context.moveTo(0, y + line_width / 2);
    	this.context.lineTo(this.canvas.width, y + line_width / 2);
    	this.context.strokeStyle = '#ffdc33';
      	this.context.stroke();
      	/* inside dashed line 
      	this.context.setLineDash([5]);
      	this.context.lineWidth = 3;
    	this.context.moveTo(0, y + 6);
    	this.context.lineTo(this.canvas.width, y + 6);
    	this.context.strokeStyle = '#151719';
      	this.context.stroke(); */
    },
    drawVerticalLine: function(y) {
    	this.context.lineWidth = line_width;
    	this.context.moveTo(y + line_width / 2, 0);
    	this.context.lineTo(y + line_width / 2, this.canvas.height);
    	this.context.strokeStyle = '#ffdc33';
      	this.context.stroke();
    },
    checkSuccessClick : function(x, y) {
    	return (x > this.circle.x) && (x < this.circle.x + this.cell_size) &&
    	       (y < this.circle.y + this.cell_size) && (y > this.circle.y);
    },
    gameOverScreen : function() {
    	this.context.fillStyle = "#FF0000";
    	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    	this.context.font = "30px Arial";
		this.context.strokeText("You lose",10,50);
    },
    gameWinnerScreen : function() {
    	this.context.fillStyle = "#90EE90";
    	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    	this.context.font = "30px Arial";
		this.context.strokeText("Your Score " + points,10,50);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

var points = 1000;
var current_coin_image = 1;

var scoreBoard = {
	create : function() {
		this.scoreDisplay = document.createElement("div");
		var insertedScoreDisplay = document.body.insertBefore(this.scoreDisplay, document.body.childNodes[0]);
		this.interval = setInterval(this.update, 1);
	},
	update : function() {
		var insertedScoreDisplay = document.body.firstChild;
		if (--points <= 0) {
			clearInterval(this.interval);
			myGameArea.circle.deleteCircle();
			myGameArea.gameOverScreen();
		}
		else {
			insertedScoreDisplay.innerHTML = "SCORE : " + --points;
		}
	}
}
function onCanvasClick(event) {
	if (!myGameArea.checkSuccessClick(event.pageX - myGameArea.canvas.offsetLeft,
		                              event.pageY - myGameArea.canvas.offsetTop)) {
		return;
	}
	if (++myGameArea.roundsDone === rounds) {
		clearInterval(scoreBoard.interval);
		myGameArea.circle.deleteCircle();
		myGameArea.gameWinnerScreen();
	}
	else {
		myGameArea.circle.relocate();
	}
}
var coin_x, coin_y;

function gameCircleComponent() {
	this.deleteCircle = function() {
		if (this.x >= 0 && this.y >= 0) {
			clearInterval(this.rotateInterval);
			myGameArea.context.fillStyle = "white";
			myGameArea.context.fillRect(this.x + border_size, this.y + border_size, myGameArea.cell_size - border_size,
				myGameArea.cell_size - border_size);
		}
	}
	this.newLocation = function(){
		this.x = Math.floor(Math.random() * n) * (100 + 6) + 6;
		this.y = Math.floor(Math.random() * n) * (100 + 6) + 6;
	}
	this.appear = function() {
		this.newLocation();
		var ctx = myGameArea.context;
		coin_x = this.x;
		coin_y = this.y;
		this.rotateInterval = setInterval(this.rotate, 100)
		/*ctx.beginPath();
		ctx.arc(this.x, this.y, myGameArea.cell_size * 0.25, 0, Math.PI*2);
		ctx.fillStyle = 'FFF000';
		ctx.fill();
		ctx.closePath();*/
	}
	this.rotate = function() {
		console.log(coin_x, coin_y);
		let coin_image = new Image();
		current_coin_image = (current_coin_image + 1) % 6;
		coin_image.src = "coin/" + current_coin_image + ".jpg";
		coin_image.onload = function () {
			myGameArea.context.drawImage(coin_image, coin_x + border_size, coin_y + border_size,
				myGameArea.cell_size - border_size, myGameArea.cell_size - border_size);
		}

	}
	this.relocate = function() {
		this.deleteCircle();
		this.appear();
	}
}








