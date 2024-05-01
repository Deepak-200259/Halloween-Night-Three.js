export const detectDevice = () => {
	if (
		navigator.userAgent.indexOf("Mozilla") !== -1 ||
		navigator.userAgent.indexOf("Chrome") !== -1 ||
		navigator.userAgent.indexOf("Safari") !== -1
	) {
		return "Web";
	}
	if (navigator.userAgent.indexOf("Android") !== -1) {
		return "Android";
	}
	if (navigator.userAgent.indexOf("IOS") !== -1) {
		return "IOS";
	}
};
