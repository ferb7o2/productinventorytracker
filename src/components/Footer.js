import React, { Component } from "react";

export class Footer extends Component {
	render() {
		return (
			<div>
				<div className="footer-spacing" />

				<footer className="bg-dark text-center text-white">
					<div className="text-center p-3">
						© 2022 Copyright: <a href="./"> </a>
						<a className="text-white" href="/">
							{" "}
							Fernando Jaramillo
						</a>
					</div>
				</footer>
			</div>
		);
	}
}
