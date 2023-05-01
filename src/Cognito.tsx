import { Auth } from "aws-amplify";
import { CognitoUserSession } from "amazon-cognito-identity-js";

// call this function wherever you need to access the user session
export async function getUserSession() {
	try {
		const userSession = await Auth.currentSession();
		return userSession;
	} catch (error) {
		console.log("Error getting user session", error);
	}
}
