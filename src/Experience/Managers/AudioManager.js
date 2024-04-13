import Experience from "../Experience";
import * as THREE from "three";

export default class AudioManager {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.camera = this.experience.camera.instance;
		this.addAudioListener();
	}

	addAudioListener() {
		// instantiate a listener
		console.log("THIS IS AUDIO MANAGER");
		this.audioListener = new THREE.AudioListener();
		this.camera.add(this.audioListener);
	}

	playAudio(sound) {
		const audio = new THREE.Audio(this.audioListener);
		this.scene.add(audio);
		audio.setVolume(0.5);
		audio.setBuffer(sound);
		audio.play();
	}
}
