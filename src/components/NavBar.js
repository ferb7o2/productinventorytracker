import React, { Component } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import awsExports from "../aws-exports";
Amplify.configure(awsExports);

export class NavBar extends Component {
	render() {
		return (
			<Authenticator>
				{({ signOut }) => (
					<div>
						<nav className="navbar navbar-dark bg-dark">
							<div className="container-fluid">
								<a className="navbar-brand" href="/">
									Facturacion Mexico 2022
								</a>
								<button
									className="navbar-toggler"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#navbarNav"
									aria-controls="navbarNav"
									aria-expanded="false"
									aria-label="Toggle navigation"
								>
									<span className="navbar-toggler-icon"></span>
								</button>
								<div className="collapse navbar-collapse" id="navbarNav">
									<ul className="navbar-nav">
										<li className="nav-item">
											<a
												className="nav-link active"
												aria-current="page"
												href="/"
											>
												Home
											</a>
										</li>

										<li className="nav-item">
											<p
												className="nav-link"
												onClick={() => {
													signOut();
												}}
											>
												Sign Out
											</p>
										</li>
									</ul>
								</div>
							</div>
						</nav>
						<div className="fair-spacing"></div>
					</div>
				)}
			</Authenticator>
		);
	}
}
