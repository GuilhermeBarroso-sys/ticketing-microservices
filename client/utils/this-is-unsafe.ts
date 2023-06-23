export function thisIsUnsafe() {
	if (process.env.NODE_ENV ==  "development"){ 
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		console.warn("NODE_TLS_REJECT_UNAUTHORIZED was disabled");
	} 
}