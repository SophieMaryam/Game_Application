var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser_game', { preload: preload, create: create, update: update, render:render});
					   // game dimensions (640, 360)
	
	function preload(){ 
		game.load.image('background', 'assets/images/background.png'); 
		game.load.image('star', 'assets/images/star.png');
		game.load.atlasJSONHash('bot', 'assets/sprites/s.png', 'assets/sprites/sprites.json');	
		game.load.image('bullet', 'assets/images/bullet.png');
		game.load.image('ground', 'assets/images/platform.png');
		game.load.image('tile', 'assets/images/tile.png');
		game.load.image('tilepiece', 'assets/images/tile_00.png');
		game.load.image('tilepieces', 'assets/images/tile_02.png');
		game.load.image('tileground', 'assets/images/tileground.png');	
		game.load.image('enemy', 'assets/images/enemy.png');
	}

	var background;
	var player;
	var stars;
	var jumpButton;
 	var platforms;
 	var ground;
 	var tile;
 	var cursors;
 	var score = 0;
 	var scoreText;
 	var bullets;
 	var fireButton;
 	var fireRate = 200;
    var nextFire = 0; 
    var enemies;
    var jumpButton;
    var jumpTimer;


	function create(){
		game.physics.startSystem(Phaser.Physics.ARCADE); 
	 	
	 	background = game.add.sprite(0, 0, 'background'); 
		background.fixedToCamera = true;

		
		platforms = game.add.group();
		platforms.enableBody = true;
	 	
	 	ground = platforms.create(0, game.world.height - 64, 'tileground')
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;
		
		tile = platforms.create(400, 400, 'tile');
		tile.body.immovable = true;
		
		tile = platforms.create(200, 300, 'tilepiece');
		tile.body.immovable = true;
		
		tile = platforms.create(50, 50, 'tile');
		tile.body.immovable = true;


		tile = platforms.create(100, 200, 'tilepiece');
		tile.body.immovable = true;

		tile = platforms.create(300, 100, 'tilepieces');
		tile.body.immovable = true;
		
	
	  // player
		player = game.add.sprite(32, game.world.height - 150, 'bot');
	  

	    player.anchor.setTo(0.5, 0.5);
	    player.scale.setTo(1, 1);
	    game.physics.enable(player, Phaser.Physics.ARCADE);

	    player.body.bounce.y = 0.2;
	    player.body.gravity.y = 300;
	    player.body.collideWorldBounds = true;

	    player.animations.add('left', [0, 1, 2, 3], 10, true);
    	player.animations.add('right', [5, 6, 7, 8], 10, true);

		game.camera.follow(player);

		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// bad guys
		enemies = game.add.group();
	    enemies.enableBody = true;
	   	enemies.physicsBodyType = Phaser.Physics.ARCADE;
	    enemies.createMultiple(5, 'enemy');
	  	enemies.setAll('anchor.x', 0.5);
	    enemies.setAll('anchor.y', 0.5);
	    enemies.setAll('scale.x', 0.5);
	    enemies.setAll('scale.y', 0.5);
	    enemies.setAll('angle', 180);
	    enemies.setAll('outOfBoundsKill', true);
	    enemies.setAll('checkWorldBounds', true);

		// stars
		stars = game.add.group();
		stars.enableBody = true;

		for (var i = 0; i < 12; i++) {
		        var star = stars.create(i * 70, 0, 'star');
		        star.body.gravity.y = 300;
		        star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
		//score 
		scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

		//bullets
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(50, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	}


	function update() {

		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(stars, platforms);
		game.physics.arcade.overlap(player, stars, collectStar, null, this);
		player.body.velocity.x = 0;


	    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
		    {
		        player.body.velocity.x = -150;
				player.animations.play('left');
		    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
		    {
		        player.body.velocity.x = 150;
				player.animations.play('right');
		    }
		else 
			{
			player.animations.stop();
			player.frame = 4;

			}

	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
	    {
	       player.y += 4;	
	    }
	if (fireButton.isDown || game.input.activePointer.isDown) 
		{
      	  fireBullet();
    	}
  	
  	if (jumpButton.isDown && player.body.touching.down && game.time.now > jumpTimer)
    	{
	        player.body.velocity.y = -200;
	        jumpTimer = game.time.now + 750
        	// s.frame = 9;
    	}
	
	}

	function render(){

	}

	function collectStar (player, star) {
	    star.kill();

	    score += 10;
	    scoreText.text = 'Score: ' + score;
	}

	function fireBullet() {
		  
		  var bullet = bullets.getFirstExists(false);

    if (bullet)
    {
        //  And fire it
        bullet.reset(player.x+5, player.y-45);
        // nextFire = game.time.now + fireRate;
        bullet.body.velocity.x = 500;
        game.physics.arcade.moveToPointer(bullet, 400);
    }
    	
	}