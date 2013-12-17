var Snake = Class({
	game 			: null,
	snake 			: new Array(),
	applePosition 	: new Array(),

	getThis : function(){
		return this;
	},

    initialize : function() {
    	console.log('SNAKE - initialize');
    	var that = this;
    	config.db 			= new DataBaseManager();
		config.snakeScreen 	= new Screen();
		this._initFirstSnake();
    	this._createAvailablePommePosition();
    	config.snakeScreen._createApple();
    	this.game = setInterval( function(){
    		that.play();
    	}, config.SPEED );
		config.user = prompt("Nom utilisateur");
		config.db.addUser( config.listUserKey, config.user);
		
		this._setApple();
    },

    _initFirstSnake : function(){
    	console.log('SNAKE - _initFirstSnake');
    	for (var i = 0; i < config.NB_CUBE; i++) {
			var cube  = new THREE.CubeGeometry( config.CUBE_SIZE, config.CUBE_SIZE, config.CUBE_SIZE);
			var mesh  = new THREE.Mesh( cube, config.snakeScreen.colors[ config.snakeScreen.coul ] );
			mesh.position.x += i*config.CUBE_SIZE;
			this.snake.push(mesh);
			config.snakeScreen._addMeshToScene(mesh);
		}
    },

    play : function(){
    	console.log('SNAKE - play');
    	document.body.removeEventListener( "keydown", this.turn, false);
    	document.body.addEventListener( "keydown", this.turn, false);

		this._tailToHead();
		this._move();
		this._checkLimits();
		config.snakeScreen.refresh();
		this._checkBittenTail(); 

		console.log( config.snakeScreen)
		if ( this._checkCollision( 
				this.snake[ this.snake.length-1].position, 
				config.snakeScreen.apple.position) ) 
			{ config.points++; this._grownUp(); }
    },

    _tailToHead : function(){
    	console.log('SNAKE - _tailToHead');
    	console.log(this.snake)
		var head = this.snake[ this.snake.length-1];
		this.snake[0].position.x = head.position.x;
		this.snake[0].position.y = head.position.y;
		this.snake[0].position.z = head.position.z;
	},

	_grownUp : function(){
		console.log('SNAKE - _grownUp');
		config.snakeScreen.scene.remove(config.snakeScreen.apple);
		var cube     = new THREE.CubeGeometry( config.CUBE_SIZE, config.CUBE_SIZE, config.CUBE_SIZE);
		var mesh     = new THREE.Mesh( cube, config.snakeScreen.colors[ config.snakeScreen.coul ] );
		var lastCube = this.snake[ this.snake.length-1];
		mesh.position.x = lastCube.position.x;
		mesh.position.y = lastCube.position.y;
		mesh.position.z = lastCube.position.z;
		this.snake.push(mesh);
		config.snakeScreen.scene.add(mesh);
		config.snakeScreen._createApple( true);
		this._setApple();
	},
	_move : function(){
		console.log('SNAKE - _move');
		this.snake[0].position[config.XYZ] += config.signe * config.CUBE_SIZE;
		this.snake.push( this.snake[0]);
		this.snake.shift();	
	},

	_checkLimits : function(){ 
		console.log('SNAKE - _checkLimits');
		var head = this.snake[ this.snake.length-1].position;
		var limit  = config.LIMIT / 2;

		if 		( head.x > limit ) 	    head.x = limit * -1;
		else if ( head.x < limit * -1 ) head.x = limit;

		else if ( head.y > limit ) 	    head.y = limit * -1;
		else if ( head.y < limit * -1 ) head.y = limit;

		else if ( head.z > limit ) 	    head.z = limit * -1;
		else if ( head.z < limit  * -1) head.z = limit;
		else return;
	},

	_checkBittenTail : function(){
		console.log('SNAKE - _checkBittenTail');
		var head = this.snake[ this.snake.length-1].position;
		for (var i = 0; i < this.snake.length-1; i++){
			var body = this.snake[i].position;
			if ( this._checkCollision( head, body) ) this.gameOver(); //// gameover
		}
	},

	gameOver : function(){
		console.log('SNAKE - gameOver');
		audio_perdu.play();
		config.db.stockScore();
		config.snakeScreen.displayScores();
		window.clearInterval(this.game);
		var textPoints = config.points < 1 ? " point" : " points";	
		if (confirm( "---------- GAME OVER ----------\n" + config.points +  textPoints + "\nDo you wanna play a game ? Ha ha ha !")) {
			document.location.reload(true);
		} 
	},

	

	_checkCollision : function( cubeP1, cubeP2){ 
		console.log('SNAKE - _checkCollision');
		return ( cubeP1.x == cubeP2.x && cubeP1.y == cubeP2.y && cubeP1.z == cubeP2.z ); 
	},

	_createAvailablePommePosition : function(){
		console.log('SNAKE - _createAvailablePommePosition');
		var pos = 0;
		while (pos < config.LIMIT){
			this.applePosition.push(pos);
			pos += config.CUBE_SIZE;
		}
	},

	_setApple : function(){
		console.log('SNAKE - _setApple');
		config.snakeScreen.apple.position.set(
			( this.applePosition[ Math.floor( Math.random() * this.applePosition.length  ) ] ) - ( config.LIMIT / 2 ), 
			( this.applePosition[ Math.floor( Math.random() * this.applePosition.length  ) ] ) - ( config.LIMIT / 2 ), 
			( this.applePosition[ Math.floor( Math.random() * this.applePosition.length  ) ] ) - ( config.LIMIT / 2 ));
		config.snakeScreen._addAppleToScene();
	},

	turn : function( event){
		console.log('SNAKE - turn');
		var touche = event.keyCode;
		switch ( touche){
			case config.LEFT :
				if ( config.XYZ == "x" && config.signe == 1) return;
				config.XYZ   = "x";
				config.signe = -1;
				break;

			case config.RIGHT :
				if ( config.XYZ == "x" && config.signe == -1) return;
				config.XYZ   = "x";
				config.signe = 1;
				break;

			case config.UP :
				if ( config.XYZ == "y" && config.signe == -1) return;
				config.XYZ   = "y";
				config.signe = 1;
				break;

			case config.DOWN :
				if ( config.XYZ == "y" && config.signe == 1) return;
				config.XYZ   = "y";
				config.signe = -1;
				break;

			case config.IN :
				if ( config.XYZ == "z" && config.signe == 1) return;
				config.XYZ   = "z";
				config.signe = -1;
				break;

			case config.OUT :
				if ( config.XYZ == "z" && config.signe == -1) return;
				config.XYZ   = "z";
				config.signe = 1;
				break;
		}
		document.body.removeEventListener( "keydown", this.turn, false);
	}
});

