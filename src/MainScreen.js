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
				<div className="row fair-spacing">
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
						<a href="https://www.google.com/search?q=sanangel+productos+mexicanos+llc&rlz=1C1ONGR_enUS962US962&oq=sana&aqs=chrome.1.69i60j69i59j69i57j69i59l2j0i271l2j69i60.2432j0j1&sourceid=chrome&ie=UTF-8">
							SanAngel Productos Mexicanos LLC
						</a>
					</p>
				</div>
				<div className="row">
					<p id="salesInfo">2501 W. Military Hwy</p>
				</div>
				<div className="row">
					<p id="salesInfo">Ste B-15, McAllen TX 78503</p>
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
