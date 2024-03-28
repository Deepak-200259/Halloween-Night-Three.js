import * as dat from "lil-gui";

export const Folders = {
	playerSettings: "Player Settings",
	orbitControlSettings: "Orbit Control Settings",
	lightsSettings: "Light Settings",
	enviornmentMapSettings: "Enviornment Map Settings",
};

export default class Debug {
	constructor() {
		this.active = window.location.hash === "#debug";

		if (this.active) {
			this.ui = new dat.GUI();
			this.ui.close();
		}
	}
}
