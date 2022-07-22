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
						<div className="navbar">
							<a className="nav-title" href="/">
								Facturacion PJL 2022
							</a>

							<div className="nav-section">
								<a className="nav-section-title nav-selected" href="/products">
									Productos
								</a>

								<a className="nav-section-title" href="/">
									Distribuidores
								</a>
							</div>

							<div className="account-info">
								<p id="account-name">username</p>
								<img
									className="dropdown-icon"
									src={require("../assets/icons/dropdown-white-attributed.png")}
									alt="dropdown icon"
								/>
							</div>
						</div>
						{/*<nav className="header">
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
													signOut?.();
												}}
											>
												Sign Out
											</p>
										</li>
									</ul>
								</div>
							</div>
						</nav>
											*/}
						<div className="fair-spacing"></div>
					</div>
				)}
			</Authenticator>
		);
	}
}
