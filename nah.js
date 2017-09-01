		game.load.image('bossbullet', 'assets/images/bullet.png');
		var boss;
  	    var livingBoss = [];
		var bossBullets;
		var tweentwo;
  
		// Bad boss bullets
		bossBullets = game.add.group();
		bossBullets.enableBody = true;
		bossBullets.physicsBodyType = Phaser.Physics.ARCADE;
		bossBullets.createMultiple(50, 'bossbullet');
		bossBullets.setAll('anchor.x', 0.5);
		bossBullets.setAll('anchor.y', 1);
		bossBullets.setAll('outOfBoundsKill', true);
		bossBullets.setAll('checkWorldBounds', true);

		// Boss
		boss = game.add.group();
		boss.enableBody = true; // allow enemies be affected by physics
		boss.physicsBodyType = Phaser.Physics.ARCADE; // define the phsyics
		boss.scale.setTo(1, 1);

	    game.physics.arcade.overlap(bullets, boss, collisionBossHandler, null, this);
		game.physics.arcade.overlap(bossBullets, player, bossHitsPlayer, null, this);
	

	// Firing time - enemy
    	if (game.time.now > firingTimer){
           	bossFires();
        }

        if(score === 160){
	    	createBoss();
	    }


	function createBoss(){
		for(var i = 0; i < 1; i++){
			for(var j = 0; j < 1; j++){
				var bigBoss = boss.create(i * 70, 0, 'boss'); // spacing them
				bigBoss.anchor.setTo(0.5, 0.5); // positioning them correctly
	            bigBoss.animations.add('fly', [0,1], 20, true);
	        }	
		}

		boss.x = 300; // places them in the map x-axis
		boss.y = 200; // places them in the map y-axis

		tweentwo = game.add.tween(boss).to({ x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		tween.onLoop.add(descend, this);
	}


	function bossFires () {
    	var bossBullet = bossBullets.getFirstExists(false);
   		bossBullet.animations.add('fire', [0, 1], 12, true);
    	bossBullet.scale.setTo(1.5)
   		
   		livingBoss.length=0;
    	
    	boss.forEachAlive(function(bigBoss){   
    		livingBoss.push(bigBoss);
    		var e_shoot = game.add.audio('e_shoot');
			e_shoot.play(); 
    	});

   	 	if (livingBoss.length > 0) {
        	var rnd2 = game.rnd.integerInRange(0, livingBoss.length-1);
        	var shooterBoss = livingBoss[rnd2];
        	
        	bossBullet.reset(shooterBoss.body.x, shooterBoss.body.y);

        	game.physics.arcade.moveToObject(bossBullet, player, 120);
        	firingTimer = game.time.now + 2000;
    	}
	}

	function collisionBossHandler (bossBullet, bigBoss) {
	    bossBullet.kill(); 
	    bigBoss.kill(); 
	    score += 10;
	    scoreText.text = 'Score: ' + score;
	}

	function bossHitsPlayer(bullets, boss) {
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
		        bossBullets.callAll('kill');
		        var pdeath = game.add.audio('pdeath');
		    	pdeath.play(); 

		        gameOver.text=" GAME OVER! \n Click to restart";
		        gameOver.visible = true;

        		//the "click to restart" handler
        		game.input.onTap.addOnce(restart,this);
        	}	
	}
	