import Experience from "../Experience.js";
import HUD from "../Hud.js";
import { GHOST_TYPE } from "./Constants.js";
import Environment from "./Environment.js";
import GateArch from "./GateArch.js";
import Ghost from "./Ghost.js";
import Grave from "./Graves.js";
import Ground from "./Ground.js";
import Player from "./Player.js";

export default class World {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		// Wait for resources
		this.resources.on("ready", () => {
			// Setup
			this.environment = new Environment();
			this.gateArch = new GateArch();
			this.ground = new Ground();
			setTimeout(() => {
				document.getElementById("bike").style.display = "none";
			}, 1000);
		});
	}

	startGame() {
		this.graves = new Grave();
		this.player = new Player();
		this.ghost = new Ghost(GHOST_TYPE.WHITE_GHOST);
	}

	update() {}
}
