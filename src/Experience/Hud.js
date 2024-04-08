import Experience from "./Experience";

export default class HUD {
	constructor() {
		this.experience = new Experience();
		document
			.getElementById("startGameBtn")
			.addEventListener("click", this.startGame.bind(this));
	}

	startGame() {
		document.getElementById("startGameScreen").style.display = "none";
		this.experience.world.startGame();
		this.createInGameHudUI();
		setInterval(() => {
			this.experience.score += 30;
			this.updateScore();
		}, 1000);
	}

	createInGameHudUI() {
		const gameHUD = document.createElement("div");
		gameHUD.className = "gameHUD";

		const soundIconDiv = document.createElement("div");
		soundIconDiv.className = "soundIconDiv";

		const soundImg = document.createElement("img");
		soundImg.className = "sound-Image";
		soundImg.src = "./textures/HudImages/sound-icon.png";

		soundIconDiv.appendChild(soundImg);

		soundIconDiv.addEventListener("click", (e) => {
			e.preventDefault();
			if (this.experience.soundEnabled === true) {
				console.log("Called");
				soundImg.src = "./textures/HudImages/sound-icon.png";
			} else {
				soundImg.src = "./textures/HudImages/sound-icon-mute.png";
			}
			this.experience.soundEnabled = !this.experience.soundEnabled;
		});
		gameHUD.appendChild(soundIconDiv);

		document.body.appendChild(gameHUD);

		this.livesLabel = document.createElement("div");
		this.livesLabel.className = "livesLabel";
		this.livesLabel.textContent = "Lives : " + this.experience.lives;

		this.roundsLabel = document.createElement("div");
		this.roundsLabel.className = "roundsLabel";
		this.roundsLabel.textContent = "Round : " + this.experience.round;

		this.scoreLabel = document.createElement("div");
		this.scoreLabel.className = "scoreLabel";
		this.scoreLabel.textContent = "Score : " + this.experience.score;

		gameHUD.appendChild(this.livesLabel);
		gameHUD.appendChild(this.roundsLabel);
		gameHUD.appendChild(this.scoreLabel);
	}

	updateLives() {
		this.livesLabel.textContent = "Lives : " + this.experience.lives;
	}

	updateRounds() {
		this.roundsLabel.textContent = "Round : " + this.experience.round;
	}

	updateScore() {
		this.scoreLabel.textContent = "Score : " + this.experience.score;
	}
}
