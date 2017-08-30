var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser_game', { preload: preload, create: create, update: update, render:render});
					   // game dimensions (640, 360)
	
	function preload(){ 
		game.load.image('background', 'assets/images/background.png'); 
		game.load.image('star', 'assets/images/star.png');
		game.load.atlasJSONHash('bot', 'assets/sprites/s.png', 'assets/sprites/sprites.json');	
		game.load.image('bullet', 'assets/images/bullet.png');
		game.load.image('tile', 'assets/images/tile_00.png');
		game.load.image('threetile', 'assets/images/tile_02.png');
		game.load.image('fourtile', 'assets/images/tile_03.png');
		game.load.image('fivetile', 'assets/images/tile.png');
		game.load.image('tileground', 'assets/images/tileground.png');	
		game.load.image('droid', 'assets/images/ufo.png');
		game.load.image('droidbullet', 'assets/images/bullet.png');
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
    var jumpButton;
    var jumpTimer = 0;
    var enemyBullets;
    var enemies;
    var fireEnemyButton;
    var firingTimer = 0;
    var lives;
    var moving;
    var stateText;
    var livingEnemies = [];


	function create(){
		game.physics.startSystem(Phaser.Physics.ARCADE); 
		var background = this;	
	 	background.fixedToCamera = true;
	 	background.game.stage.backgroundColor = '479cde';

	 	// playforms	
		platforms = game.add.group();
		platforms.enableBody = true;
	 	
	 	ground = platforms.create(0, game.world.height - 64, 'tileground')
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;
		
		tile = platforms.create(400, 350, 'fivetile');
		tile.body.immovable = true;
		
		tile = platforms.create(200, 300, 'tile');
		tile.body.immovable = true;
		
		tile = platforms.create(50, 50, 'fivetile');
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
		enemies.scale.setTo(1, 1);
		enemies.physicsBodyType = Phaser.Physics.ARCADE;
		
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
		game.add.text(game.world.width - 130, 10, 'Lives: 3',  { font: '34px Arial', fill: '#fff' });

		//
		stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: 'black' });
   		stateText.anchor.setTo(0.5, 0.5);
    	stateText.visible = false;

		// Stars
		stars = game.add.group();
		stars.enableBody = true;

		for (var i = 0; i < 12; i++) {
		        var star = stars.create(i * 70, 0, 'star');
		        star.body.gravity.y = 300;
		        star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
		
		// Score 
		scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

	}


	function update() {

		var hitPlatform = game.physics.arcade.collide(player, platforms);
		hitPlatform = game.physics.arcade.collide(stars, platforms);
		hitPlatform = game.physics.arcade.overlap(player, stars, collectStar, null, this);
		hitPlatform = player.body.velocity.x = 0;


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

		if(game.input.keyboard.isDown(Phaser.Keyboard.UP))
	  		{
	  			player.y -= 4;	
	  		}
	  	else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
		    {
		       player.y += 4;	
		    }
		
		if (fireButton.isDown) 
			{
	      	  fireBullet();
	    	}
	  	
	  	if (jumpButton.isDown && player.body.touching.down && game.time.now > jumpTimer)
	    	{
		        player.body.velocity.y = -250;
		        jumpTimer = game.time.now + 75;
    	}

    	 if (game.time.now > firingTimer)
        	{
           	 enemyFires();
        	}

	    game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);
	    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
	
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
	        nextFire = game.time.no  + fireRate;
	        bullet.body.velocity.x = 500;
	        // game.physics.arcade(bullet, 400);
	    } 	 
	}


	function createEnemies(){
		for(var i = 0; i < 5; i++){
			for(var j = 0; j < 1; j++){
				var badguy = enemies.create(i * 50, 0, 'droid', game.rnd.integerInRange(0,game.world.width +10));
				badguy.anchor.setTo(0.5, 0.5);
	            badguy.scale.setTo(1);
                badguy.animations.add('fly', [0,1], 20, true);
	            badguy.body.moves = true;
        	}
		}

		enemies.x = 300;
    	enemies.y = 50;

    	var moving = game.add.tween(enemies).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		moving.onLoop.add(descend, this);
	}


	function collisionHandler (bullet, enemies) {
	    bullet.kill();
	    enemies.kill();

	    if (enemies.countLiving() == 0)
    	{
	        score += 1000;
	        scoreText.text = scoreString + score;

	        enemyBullets.callAll('kill',this);
	        stateText.text = " You Won, \n Click to restart";
	        stateText.visible = true;

	        //the "click to restart" handler
	        game.input.onTap.addOnce(restart,this);
  		}	    
	}

	function enemyHitsPlayer(bullets, enemies) {
	    bullets.kill();

	    live = lives.getFirstAlive();
		if (live)
		    {
		        live.kill();
		    }
		if (lives.countLiving() < 1)
   			 {
		        player.kill();
		        enemyBullets.callAll('kill');

		        stateText.text=" GAME OVER \n Click to restart";
		        stateText.visible = true;

        		//the "click to restart" handler
        		game.input.onTap.addOnce(restart,this);
        	}	
	}

	function enemyFires () {

    //  Grab the first bullet we can from the pool
    	enemyBullet = enemyBullets.getFirstExists(false);

   		livingEnemies.length=0;

    	enemies.forEachAlive(function(enemies){
    		
    	livingEnemies.push(enemies);

    	});


   	 	if (enemyBullet && livingEnemies.length > 0)
    	{
        
        	var random = game.rnd.integerInRange(0, livingEnemies.length-1);

        // randomly select one of them
        	var shooter = livingEnemies[random];
        // And fire the bullet from this enemy
        	enemyBullet.reset(shooter.body.x+10, shooter.body.y-10);

        	game.physics.arcade.moveToObject(enemyBullet,player,120);
        	firingTimer = game.time.now + 2000;
    }

}

	function descend() {
   		enemies.y += 10
	}

	function restart () {
	   
	    lives.callAll('revive');
	    enemies.removeAll();

	    createEnemies();

	    player.revive();
	    stateText.visible = false;
	}

	
	function render() {

	}