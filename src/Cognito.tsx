import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";

export async function getAccessToken(): Promise<string | undefined> {
	try {
		let currentSession = await fetchAuthSession();

		const token = (currentSession.tokens?.accessToken || "").toString();
		return token;
	} catch (error) {
		console.log("Error getting user session", error);
		return undefined;
	}
}

export async function getCurrentUserEmail(): Promise<string | undefined> {
	try {
		const email = (await fetchUserAttributes()).email;
		return email;
	} catch (error) {
		console.log("Error getting current user email", error);
		return undefined;
	}
}
