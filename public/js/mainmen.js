Game.mainmenu = function(game){

}

Game.mainmenu.prototype = {
	function create(game){
		this.createButton(game, "Play", game.world,centerX, game.world.centerY + 32, 300, 100, 
			function() (this.state.start('Level1'));
		});

		this.createButton(game, "About", game.world,centerX, game.world.centerY + 32, 300, 100, function() (this.state.start('Level1'));
		});
	},

	function update(game){

	},

	function createButton(game, string, x, y, width, height, callback){
		var button1 = game.add.button(x,y, 'button', callback, this, 2,1,0);

		button1.anchor.setTo(0.5,0.5);
		button1.width = width;
		button1.height = height;

		var txt = game.add.text(button1.x, button1.y, string, (font:"14px Arial", fill:"#fff", align:"center"));

		txt.anchor.setTo(0.5,0.5);
	}
}