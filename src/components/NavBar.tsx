import React, { Component } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import awsExports from "../aws-exports";
import { Link } from "react-router-dom";
import $ from "jquery";
Amplify.configure(awsExports);

export function NavBar() {
	return (
		<Authenticator>
			{({ signOut }) => (
				<div>
					<div className="navbar">
						<a className="nav-title" href="/">
							Facturacion PJL 2022
						</a>

						<div className="nav-section">
							<Link
								className="nav-section-title nav-selected"
								id="productTabBtn"
								to="/"
							>
								Productos
							</Link>

							<Link
								className="nav-section-title"
								to="/vendor"
								id="vendorTabBtn"
							>
								Distribuidores
							</Link>
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

					<div className="fair-spacing"></div>
				</div>
			)}
		</Authenticator>
	);
}
