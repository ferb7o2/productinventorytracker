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

export async function getAccessToken(): Promise<string | undefined> {
	try {
		let currentSession: CognitoUserSession | null = await Auth.currentSession();
		if (!currentSession || !currentSession.isValid()) {
			currentSession = await (Auth as any).refreshSession(
				currentSession?.getRefreshToken()?.getToken()
			);
		} else {
			const expiresIn = currentSession.getAccessToken()?.getExpiration() || 0;
			const currentTime = Math.floor(Date.now() / 1000);
			if (expiresIn < currentTime) {
				currentSession = await (Auth as any).refreshSession(
					currentSession.getRefreshToken().getToken()
				);
			}
		}
		const token = (
			(await currentSession?.getAccessToken()?.getJwtToken()) || ""
		).toString();
		return token;
	} catch (error) {
		console.log("Error getting user session", error);
		return undefined;
	}
}
