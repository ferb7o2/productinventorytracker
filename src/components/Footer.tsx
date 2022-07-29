import { Component } from "react";

class Footer extends Component {
	render() {
		return (
			<div>
				<div className="footer-spacing" />

				<footer className="footer text-center text-white">
					<div className="text-center p-3">
						© 2022 Copyright: <a href="./"> </a>
						<a className="text-white" href="https://github.com/JoseJaramillo04">
							Fernando Jaramillo
						</a>
					</div>
				</footer>
			</div>
		);
	}
}

export default Footer;
