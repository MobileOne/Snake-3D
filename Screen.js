var Screen = Class({
	
	renderer  : null,
	scene     : null,
	camera    : null,
	light     : null,
	colors : null,
	coul : null,
	mat : null,
	apple : null,

    initialize : function() {
    	console.log('SCREEN - initialize');
    	this.renderer = new THREE.WebGLRenderer( { canvas : document.getElementById("3d") } );
    	this.scene 	  = new THREE.Scene();
		this.camera   = new THREE.PerspectiveCamera( 50, 4/3, 1, 10000);
		this.light 	  = new THREE.PointLight( 0xffffff);
		this.mat      = THREE.MeshLambertMaterial;	

		this.camera.position.set( 200, 1000, 1000);
		this.camera.lookAt( new THREE.Vector3(0, 0, 0) );
		this.light.position.set( 0, 1000, 1000);
		
		this._initColors();
		this._drawGameZone();
		//this._drawFirstSnake();

		this.scene.add( new THREE.AmbientLight( 0x222222))
		this.scene.add( this.light);	

		this.renderer.setSize(config.X, config.Y);
		this.refresh();
    },

    refresh : function() {
    	console.log('SCREEN - refresh');
        this.renderer.render( this.scene, this.camera);
    },

    _initColors : function() {
    	console.log('SCREEN - _initColors');
        this.colors    = [ 	new this.mat( { color : 0xff0000, wireframe : false } ), 
							new this.mat( { color : 0x0000ff, wireframe : false } ), 
							new this.mat( { color : 0x00ff00, wireframe : false } ), 
							new this.mat( { color : 0x000000, wireframe : false } ) ];
		this.coul      = Math.floor( Math.random() * this.colors.length )

    },

    _drawGameZone : function(){
    	console.log('SCREEN - _drawGameZone');
		var zone   = new THREE.CubeGeometry( config.LIMIT, config.LIMIT, config.LIMIT);
		var mesh   = new THREE.Mesh( zone, new THREE.MeshLambertMaterial( { color : 0x000000, wireframe : true } ));
		this.scene.add( mesh);
	},

	_drawFirstSnake : function(){
		console.log('SCREEN - _drawFirstSnake');
		for (var i = 0; i < config.NB_CUBE; i++) {
			var cube  = new THREE.CubeGeometry( config.CUBE_SIZE, config.CUBE_SIZE, config.CUBE_SIZE);
			var mesh  = new THREE.Mesh( cube, this.colors[ this.coul ] );
			mesh.position.x += i*config.CUBE_SIZE;
			this.Snake.snake.push(mesh);
			this.scene.add(mesh);
		}
	},

	_createApple : function( sound){
		console.log('SCREEN - _createApple');
		if (sound) audio_pomme.play();
		var cubeP  = new THREE.CubeGeometry( config.CUBE_SIZE, config.CUBE_SIZE, config.CUBE_SIZE);
		this.apple = new THREE.Mesh( cubeP, this.colors[ Math.floor( Math.random() * this.colors.length  ) ] );
	},

	_addAppleToScene : function(){
		console.log('SCREEN - _addAppleToScene');
		this.scene.add(this.apple);
	},

	_addMeshToScene : function( mesh){
		console.log('SCREEN - _addMeshToScene');
		this.scene.add( mesh);
	},

	displayScores : function(){
		var userListJson = localStorage.getItem( config.listUserKey);
		var userListArray = JSON.parse( userListJson);
		var text = "<table><tr ><td>Users</td><td>Best</td></tr>";
		for ( var i = 0; i < userListArray.length; i++){
			text += "<tr><td> " + userListArray[i] + " </td><td> " + localStorage.getItem( userListArray[i]) + "</td></tr>";
		}
		text += "</table>";
		scoreDisplayer.innerHTML = text;
		console.log( userListArray)
	}
});