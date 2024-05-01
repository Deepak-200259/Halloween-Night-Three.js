import { POSITIVE_X_ARRAY, POSITIVE_Z_ARRAY } from "../World/Constants";

export const getRandomPosition = (positions) => {
	const positionXArray = POSITIVE_X_ARRAY;
	const positionZArray = POSITIVE_Z_ARRAY;
	let randomXValue, randomZValue;
	do {
		randomXValue = Math.floor(Math.random() * positionXArray.length);
		randomZValue = Math.floor(Math.random() * positionZArray.length);
	} while (
		positions.some(
			(coord) =>
				coord.x === positionXArray[randomXValue] &&
				coord.z === positionZArray[randomZValue],
		) ||
		(randomXValue === 0 && randomZValue === 0)
	);

	return { x: positionXArray[randomXValue], z: positionZArray[randomZValue] };
};
