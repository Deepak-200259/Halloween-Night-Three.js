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
		this.gameStarted = true;
		this.experience.world.startGame();
	}
}
