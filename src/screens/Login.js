import React from "react";
import $ from "jquery";

//component
import { Footer } from "../components/Footer";
import Logo from "../Images/logo-final.png";

//css
import {} from "../css/Login.css";

function Login() {
	return (
		<div className="login-container">
			<div className="centered">
				<form className="box-container">
					<div className="row">
						<img className="logo" src={Logo} />
					</div>
					<div className="row">
						<h3 className="title-label">Iniciar sesión</h3>
						<hr />
					</div>
					<div className="row">
						<label className="unameLabel" for="uname">
							Usuario
						</label>
					</div>
					<div className="row">
						<input
							className="unameInput"
							type="text"
							placeholder="Enter Username"
							name="uname"
							required
						/>
					</div>
					<div className="row">
						<label for="psw" className="pswLabel">
							Contraseña
						</label>
					</div>
					<div className="row">
						<input
							className="pswInput"
							type="password"
							placeholder="Enter Password"
							name="pwd"
							required
						/>
					</div>
					<div className="row spacing">
						<button type="submit" className="btn btn-outline-dark loginBtn">
							Login
						</button>
					</div>
					<div className="row">
						<label>
							<input type="checkbox" name="remember" /> Remember me
						</label>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
