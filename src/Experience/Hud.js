import Experience from "./Experience";

export default class HUD {
	constructor() {
		this.experience = new Experience();
		this.resources = this.experience.resources;
		this.audioManager = this.experience.audioManager;
		document.getElementById("startGameBtn").addEventListener("click", () => {
			this.experience.soundEnabled
				? this.audioManager.playAudio(this.resources.items.clickSound)
				: null;
			this.startGame();
		});
	}

	startGame() {
		document.getElementById("startGameScreen").style.display = "none";
		this.experience.world.startGame();
		this.createInGameHudUI();
		const scoreInterval = setInterval(() => {
			if (!this.experience.gameEnded) {
				this.experience.score += 30;
				this.updateScore();
			} else {
				clearInterval(scoreInterval);
			}
		}, 1000);
	}

	createInGameHudUI() {
		const gameHUD = document.createElement("div");
		gameHUD.className = "gameHUD";

		const soundIconDiv = document.createElement("div");
		soundIconDiv.className = "soundIconDiv";

		const soundImg = document.createElement("img");
		soundImg.className = "sound-Image";
		soundImg.src = this.experience.soundEnabled
			? "./textures/HudImages/sound-icon.png"
			: "./textures/HudImages/sound-icon-mute.png";

		soundIconDiv.appendChild(soundImg);

		soundIconDiv.addEventListener("click", (e) => {
			e.preventDefault();
			if (this.experience.soundEnabled === false) {
				this.experience.soundEnabled = true;
				this.audioManager.playAudio(this.resources.items.clickSound);
				soundImg.src = "./textures/HudImages/sound-icon.png";
			} else {
				this.experience.soundEnabled = false;
				soundImg.src = "./textures/HudImages/sound-icon-mute.png";
			}
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
