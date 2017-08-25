var game = new Phaser.Game(640, 360, Phaser.AUTO, 'phaser_game', { preload: preload, create: create, update: update, render:render});
					   // game dimensions (640, 360)
	
	function preload(){ 
	// all o the images/files/game files are loaded
	// once everything is loaded the create method is called
	// loading an image from a disk takes time, so thats why you preload 
		this.load.image('background', 'assets/images/background.png') // first just a name, then the path
		// this refers to the current object we are in
		// load refers to a loader object that phaser has 
	}

	var background;

	function create(){
	 	game.physics.startSystem(Phaser.Physics.ARCADE);
	 	background = this.background = this.game.add.sprite(0, 0, 'background'); 
		// add the background to the object - this way you can refer to it in other methods of your code
		// this.game gives us access to the main object
		// then write the coordinates - starts at top left corner
		// then refer to the key of the object



	}

	function update() {
	}

	function render(){

	}
