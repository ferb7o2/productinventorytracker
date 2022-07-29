import { Amplify } from "aws-amplify";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import awsExports from "../aws-exports";

Amplify.configure(awsExports);

export function MobileSignOutOption() {
	return (
		<Authenticator>
			{({ signOut }) => (
				<div className="mobile-signout-btn">
					<div className="btn ">
						{/*<p id="account-name">username</p>*/}

						<a className="signout-btn" onClick={signOut}>
							Cerrar sesión
						</a>
					</div>
				</div>
			)}
		</Authenticator>
	);
}
