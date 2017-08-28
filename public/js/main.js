var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser_game', { preload: preload, create: create, update: update, render:render});
					   // game dimensions (640, 360)
	
	function preload(){ 
		game.load.image('background', 'assets/images/background.png'); 
		game.load.image('star', 'assets/images/star.png');
		game.load.atlasJSONHash('bot', 'assets/sprites/s.png', 'assets/sprites/sprites.json');	
		game.load.image('ground', 'assets/images/platform.png');
		game.load.image('tile', 'assets/images/tile.png');
		game.load.image('tileground', 'assets/images/tileground.png');	
		game.load.image('bullets', 'assets/images/bullet.png');
	}

	var background;
	var player;
	var stars;
	var jumpButton;
 	var platforms;
 	var ground;
 	var ledge;
 	var tile;
 	var cursors;
 	var score = 0;
 	var scoreText;
 	var bullets;
 	var fireButton;
 	var fireRate = 200;
    var nextFire = 0; 


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
		tile = platforms.create(-150, 250, 'tile');
		tile.body.immovable = true;
		tile = platforms.create(400, 50, 'tile');
		tile.body.immovable = true;
		
	
	  // player
		player = game.add.sprite(32, game.world.height - 150, 'bot');
	  

	    player.anchor.setTo(0.5, 0.5);
	    player.scale.setTo(2, 2);
	    game.physics.enable(player, Phaser.Physics.ARCADE);

	    player.body.bounce.y = 0.2;
	    player.body.gravity.y = 300;
	    player.body.collideWorldBounds = true;

	    player.animations.add('left', [0, 1, 2, 3], 10, true);
    	player.animations.add('right', [5, 6, 7, 8], 10, true);

		game.camera.follow(player);

		
		stars = game.add.group();
		stars.enableBody = true;

		for (var i = 0; i < 12; i++) {
		        var star = stars.create(i * 70, 0, 'star');
		        star.body.gravity.y = 300;
		        star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
		scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

		bullets = game.add.group;
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(50, 'bullets');
		// bullets.setAll('anchor.x', 0.5);
		// bullets.setAll('anchor.y', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);
		bullets.setAll('body.gravity.y', 0);
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
		
		if (fireButton.isDown || game.input.activePointer.isDown)
	   			{
	        		fireBullet();
	        		player.animations.play('')
	    		}
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

	    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
		    {
		        player.body.velocity.y = -200;
		    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
		    {
		       player.y += 4;
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

	    if (game.time.now > nextFire && bullets.countDead() > 0)
	    {
	    	var bullet = bullets.getFirstExists(false);
				if (bullet)
					{

						bullet.reset(player.x, player.y + 8);
						bullet.body.velocity.y = -400;
					}    

		        // nextFire = game.time.now + fireRate;

	        // bullets = bullets.getFirstDead();

	        // bullets.reset(player.x+5, player.y -45);

	        // bullets.body.velocity.x = 500;

	        // game.physics.arcade.moveToPointer(bullets, 400);
	    }
	}