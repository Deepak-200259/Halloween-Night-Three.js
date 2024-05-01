export const DEVICES = {
	Web: "Web",
	Android: "Android",
	IOS: "IOS",
};

export const GHOST_TYPE = {
	WHITE_GHOST: "WHITE_GHOST",
	FAT_PUMPKIN_GHOST: "FAT_PUMPKIN_GHOST",
};

export const POSITIVE_X_ARRAY = [-6, -4, -2, 0, 2, 4, 6, 8];
export const NEGATIVE_X_ARRAY = [8, 6, 4, 2, 0, -2, -4, -6];

export const POSITIVE_Z_ARRAY = [-8, -6, -4, -2, 0, 2, 4, 6];
export const NEGATIVE_Z_ARRAY = [6, 4, 2, 0, -2, -4, -6, -8];

export const KEYS = {
	ARROW_LEFT: "ArrowLeft",
	ARROW_RIGHT: "ArrowRight",
	ARROW_UP: "ArrowUp",
	ARROW_DOWN: "ArrowDown",
	SMALL_W: "w",
	CAPITAL_W: "W",
	SMALL_S: "s",
	CAPITAL_S: "S",
	SMALL_A: "a",
	CAPITAL_A: "A",
	SMALL_D: "d",
	CAPITAL_D: "D",
};

export const POWERUPS = {
	SPEED_UP: "SPEED_UP",
	SLOW_DOWN: "SLOW_DOWN",
	INVINCIBLE: "INVINCIBLE",
};

export const SCARE_CROW_INFO = [
	{
		position: { x: 8.5, y: -0.2, z: -10 },
		angle: -(Math.PI / 180) * 45,
	},
	{
		position: { x: -7.5, y: -0.2, z: -8 },
		angle: (Math.PI / 180) * 45,
	},
	{
		position: { x: 11.5, y: -0.2, z: 7.5 },
		angle: 0,
	},
];
