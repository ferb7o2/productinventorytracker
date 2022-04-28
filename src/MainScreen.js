import React from "react";
import $ from "jquery";
import { useHistory } from "react-router-dom";
import "./homePageStyle.css";

//Components
import { NavBar } from "./components/NavBar";

function MainScreen() {
	const history = useHistory();

	const employeePortal = () => {
		history.push("/main");
	};

	return (
		<div className="Application">
			<div className="container">
				<div className="row">
					<div className="col">
						<iframe
							src="https://embed.lottiefiles.com/animation/98495"
							className="underConstruction"
						/>
					</div>
					<div className="col">
						<h1 id="underDevTitle">We're Under Development</h1>
						<div className="row">
							<p id="underDevDescription">Please Come Back later!</p>
						</div>
						<div className="row">
							<button
								type="button"
								class="btn btn-outline-primary"
								id="underDevBtn"
								onClick={employeePortal}
							>
								Employee Portal
							</button>
						</div>
					</div>
				</div>
				<div className="row">
					<p id="salesInfo">
						For sales please call the office number{" "}
						<a href="tel:956-992-8831">(956)992-8831</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default MainScreen;
