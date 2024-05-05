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
		this.audioListener = new THREE.AudioListener();
		this.camera.add(this.audioListener);
	}

	playAudio(sound, repeat) {
		const audio = new THREE.Audio(this.audioListener);
		audio.setVolume(0.5);
		audio.setBuffer(sound);
		audio.play();
	}
}
