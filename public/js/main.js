var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser_game', { preload: preload, create: create, update: update, render:render});
					   // game dimensions (640, 360)
	
	function preload(){ 
		game.load.image('background', 'assets/images/background.png'); 
		game.load.image('star', 'assets/images/star.png');
		game.load.atlasJSONHash('bot', 'assets/images/s.png', 'assets/images/sprites.json');	
		game.load.image('bullet', 'assets/images/bullet.png');
		game.load.image('boss', 'assets/images/boss.png');
		game.load.image('tile', 'assets/images/tile_00.png');
		game.load.image('threetile', 'assets/images/tile_02.png');
		game.load.image('fourtile', 'assets/images/tile_03.png');
		game.load.image('fivetile', 'assets/images/tile.png');
		game.load.image('tileground', 'assets/images/tileground.png');	
		game.load.image('droid', 'assets/images/ufo.png');
		game.load.image('droidbullet', 'assets/images/bullet.png');
		game.load.audio('jump', ['assets/audio/phaseJump2.mp3']);
		game.load.audio('p_shoot', ['assets/audio/laser3.mp3']);
		game.load.audio('e_shoot', ['assets/audio/zap1.mp3']);
		game.load.audio('pdeath', ['assets/audio/lowDown.mp3']);
		game.load.audio('stargrab', ['assets/audio/powerUp5.mp3']);
		game.load.audio('backgroundsound', ['assets/audio/backgroundaudio.wav']);
	}

	var background;
	var platforms;
 	var ground;
 	var tile;
	var player;
	var jumpButton;
	var enemies;
	var bullets;
	var fireButton;
	var enemyBullets;
	var stars;
 	var score = 0;
 	var scoreText;
 	var healthCounter = 3;
    var winText;
    var gameOver;
    var hitPlatform;
    var jumpTimer = 0;
    var firingTimer = 0;
    var nextFire = 0; 
 	var fireRate = 200;
    var fireEnemyButton; 
    var livingEnemies = [];
    var tween;
    var tapRestart;
    var backgroundmusic;
    var health = 3;
    var lives;
    var livesText;
   


	function create(){
		game.physics.startSystem(Phaser.Physics.ARCADE); 
		
		//Music
		backgroundmusic = game.add.audio('backgroundsound');
		backgroundmusic.loopFull();
		backgroundmusic.play();

		//Background
		background = this;	
	 	background.fixedToCamera = true;
	 	background.game.stage.backgroundColor = '479cde';

	 	// Platforms & Tiles	
		platforms = game.add.group();
		platforms.enableBody = true;
	 	
	 	ground = platforms.create(0, game.world.height - 64, 'tileground')
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;
		
		tile = platforms.create(400, 350, 'fivetile');
		tile.body.immovable = true;
		
		tile = platforms.create(200, 300, 'tile');
		tile.body.immovable = true;
		
		tile = platforms.create(50, 100, 'fivetile');
		tile.body.immovable = true;


		tile = platforms.create(100, 200, 'tile');
		tile.body.immovable = true;

		tile = platforms.create(300, 100, 'fourtile');
		tile.body.immovable = true;
		

		tile = platforms.create(300, 450, 'fourtile');
		tile.body.immovable = true;

		tile = platforms.create(50, 430, 'threetile');
		tile.body.immovable = true;

		tile = platforms.create(700, 300, 'threetile');
		tile.body.immovable = true;


		tile = platforms.create(640, 100, 'tile');
		tile.body.immovable = true;


		tile = platforms.create(500, 200, 'threetile');
		tile.body.immovable = true;
	
	
	    // Player
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
		enemies.enableBody = true; // allow enemies be affected by physics
		enemies.physicsBodyType = Phaser.Physics.ARCADE; // define the phsyics
		enemies.scale.setTo(1, 1);

		createEnemies();	

		// Bullets
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(50, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	
		// Bad guy bullets
		enemyBullets = game.add.group();
		enemyBullets.enableBody = true;
		enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
		enemyBullets.createMultiple(50, 'droidbullet');
		enemyBullets.setAll('anchor.x', 0.5);
		enemyBullets.setAll('anchor.y', 1);
		enemyBullets.setAll('outOfBoundsKill', true);
		enemyBullets.setAll('checkWorldBounds', true);

		// Lives
		lives = game.add.group();
		livesText = game.add.text(game.world.width - 130, 10, 'Lives: ' + health,  { font: '34px Arial', fill: '#fff' });

		// Restart text
		winText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '84px Arial', fill: 'white' });
   		winText.anchor.setTo(0.5, 0.5);
    	winText.visible = false;

    	// Game Over
    	gameOver = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '84px Arial', fill: 'white' });
   		gameOver.anchor.setTo(0.5, 0.5);
    	gameOver.visible = false;

		// Stars
		stars = game.add.group();
		stars.enableBody = true;
		for (var i = 0; i < 12; i++) {
		        var star = stars.create(i * 70, 0, 'star');
		        star.body.gravity.y = 300;
		        star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
			
		// Score 
		scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

	}


	function update() {
		// Collision relationships
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(stars, platforms);
		game.physics.arcade.overlap(player, stars, collectStar, null, this);
		game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);
	    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);

	    hitPlatform = player.body.velocity.x = 0;

		// Player movement
	    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
		        player.body.velocity.x = -150;
				player.animations.play('left');
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
		        player.body.velocity.x = 150;
				player.animations.play('right');
		} else {
			player.animations.stop();
			player.frame = 4;
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
	  			player.y -= 4;	
	  	} else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
		       player.y += 4;	
		}
		
		// Fire player bullet
		if (fireButton.isDown){
	      	  fireBullet();
	    }
	  	
	  	// Player jumps
	  	if (jumpButton.isDown && player.body.touching.down && game.time.now > jumpTimer){
		        player.body.velocity.y = -250;
		        jumpTimer = game.time.now + 75;
		        var snd = game.add.audio('jump');
		        snd.play();
    	}

    	// Firing time - enemy
    	if (game.time.now > firingTimer){
           	enemyFires();
        }

	}

	function collectStar (player, star) {
	    star.kill();
	    
	    // star audio
	    var starcollect = game.add.audio('stargrab');
		starcollect.play(); 

		// Star score
	    score += 10;
	    scoreText.text = 'Score: ' + score;
	    
	    if(score === 160){
	    	winText.text = " You Won! \n Click to restart";
	        winText.visible = true;
	        var starcollect = game.add.audio('stargrab');
			starcollect.play(); 
	         //the "click to restart" handler
	        tapRestart = game.input.onTap.addOnce(restart,this);
	    }

	}

	function fireBullet() {	  
		// Checks if you can fire the bullet
		if(game.time.now > nextFire){
			// grabs first bullet available in the pool
			var bullet = bullets.getFirstExists(false);
		}

	    if (bullet){
	        //  And fire it
	        bullet.reset(player.x-10, player.y-20);
	        bullet.body.velocity.x = -400;
	        nextFire = game.time.now + fireRate; 
	        var shoot = game.add.audio('p_shoot');
		    shoot.play();   
	    } 	 
	}

	function descend() {
   		enemies.y += 10;
	}


	function collisionHandler (bullet, badguy) {
	    bullet.kill(); 
	    badguy.kill(); 
	    score += 10;
	    scoreText.text = 'Score: ' + score;
	}

	function createEnemies(){
		for(var i = 0; i < 4; i++){
			for(var j = 0; j < 1; j++){
				var badguy = enemies.create(i * 70, 0, 'droid'); // spacing them
				badguy.anchor.setTo(0.5, 0.5); // positioning them correctly
	            badguy.animations.add('fly', [0,1], 20, true);	
	    	}
		}

		enemies.x = 300; // places them in the map x-axis
		enemies.y = 200; // places them in the map y-axis

		tween = game.add.tween(enemies).to({ x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		tween.onLoop.add(descend, this);
		// tween allows enemies to move across map
	}

	function enemyHitsPlayer(bullets, enemies) {
	    bullets.kill();

	    health -= 1;
	    livesText.text = 'Lives: ' + health;

	    if(health === 2 || health === 1){
			player.reset(100,500)
		}

	    var live = lives.getFirstAlive();		
		if (live)
		    {
		        live.kill();
		    }
		
		if (health <= 0) {
		        player.kill();
		        enemyBullets.callAll('kill');
		        var pdeath = game.add.audio('pdeath');
		    	pdeath.play(); 

		        gameOver.text=" GAME OVER! \n Click to restart";
		        gameOver.visible = true;

        		//the "click to restart" handler
        		game.input.onTap.addOnce(restart,this);
        	}	
	}

	function enemyFires () {
    	var enemyBullet = enemyBullets.getFirstExists(false);
   		enemyBullet.animations.add('fire', [0, 1], 12, true);
    	enemyBullet.scale.setTo(1.5)
   		
   		livingEnemies.length=0;
    	
    	enemies.forEachAlive(function(badguy){   
    		livingEnemies.push(badguy);
    		var eshoot = game.add.audio('e_shoot');
			eshoot.play(); 
    	});

   	 	if (livingEnemies.length > 0) {
        	var rnd = game.rnd.integerInRange(0, livingEnemies.length-1);
        	var shooter = livingEnemies[rnd];
        	
        	enemyBullet.reset(shooter.body.x, shooter.body.y);

        	game.physics.arcade.moveToObject(enemyBullet, player, 120);
        	firingTimer = game.time.now + 4000;
    	}
	}


	function restart () {	    
	    // Resets enemies
	    enemies.removeAll();    
	    createEnemies();
	    

	    // Resets stars
	    stars.removeAll();
	    for (var i = 0; i < 12; i++) {
		        var star = stars.create(i * 70, 0, 'star');
		        star.body.gravity.y = 300;
		        star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}


		// Revive the player
	    player.revive();
	    player.reset(32, game.world.height - 150); // resets players position
	    
	    scoreText.visible = false;
 	   	score = 0;
	    scoreText = game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#fff' });

	    winText.visible = false;
	    gameOver.visible = false;

	    livesText.visible = false;
 	   	health = 3;
	    livesText = game.add.text(game.world.width - 130, 10, 'Lives: ' + health, { fontSize: '32px', fill: '#fff' });
	}

	function render() {

	}