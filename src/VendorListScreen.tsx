import "./App.css";

import { useHistory } from "react-router-dom"; //Helps us redirect to other pages

import "bootstrap/dist/css/bootstrap.min.css"; //Boostrap Import 1/2
import "bootstrap/dist/js/bootstrap.bundle.min"; //Boostrap Import 2/2
import "./css/homePageStyle.css";

import { useEffect, useState } from "react";
import $ from "jquery";

//Import external pages in folder (Screens)
import AddVendor from "./components/AddVendor";

//Database- AMPLIFY
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

//Components
import "@aws-amplify/ui-react/styles.css";

//Types
import { toDeleteVendorType, VendorDataType } from "./types";
import { DeleteVendor } from "./components/DeleteVendor";
import { getAccessToken } from "./Cognito";
import InfiniteScroll from "react-infinite-scroll-component";

Amplify.configure(awsconfig);

function VendorListScreen() {
	//essential display data
	const [vData, setvData] = useState<VendorDataType[]>([]);
	const [vendorCount, setVendorCount] = useState(0);
	let isMounted = true;

	//auxiliary variables - for search actions
	const [searchTermVendor, setSearchTermVendor] = useState("");
	const [preSearch, setPreSearch] = useState("");

	//auxiliary variables - for pagination
	const [lastRowNum, setLastRow] = useState(0);
	const [hasMore, setHasMore] = useState(false);

	//auxiliary - for delete action
	const [toDelete, setToDelete] = useState<toDeleteVendorType[]>([]);
	const [showDelete, setShowDelete] = useState<boolean>(false);

	const fetchVendorCount = async () => {
		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/vendors/count`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			if (data.length > 0) {
				setVendorCount(data[0].COUNT);
			}
		} catch (error) {
			console.log("Error retrieving COUNT data (fetchVendorCount) ", error);
			window.alert("Error retrieving COUNT data (fetchVendorCount) " + error);
		}
	};

	const fetchVendorDataByTransactions = async (
		searchTxt: string,
		entered = false
	) => {
		//we use local rowIndex variable to prevent delays on global
		//if we triggered search, start searching from index 0 else, keep pagination from last variable's index
		var rowIndex = entered ? 0 : lastRowNum;

		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/vendors/mostTransactions?rowNum=${rowIndex}&searchBy=${searchTxt}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			console.log(data);

			if (isMounted) {
				//if statement
				entered
					? setvData(data) //if entered, forget all previous data and query new one (with search)
					: setvData((prevData) => [...prevData, ...data]); //if not, keep on adding new data to existing one

				if (data.length > 0 && data[data.length - 1].rowNum !== null) {
					setLastRow(data[data.length - 1].rowNum);

					//for pagination, remember which index was the last one queried so new query can start from there
				}
				setHasMore(data.length > 0);
			}
		} catch (error) {
			console.error(
				"Error retrieving Product data (fetchVendorDataByTransactionsData) ",
				error
			);
			window.alert(
				"Error retrieving Product data (fetchVendorDataByTransactionsData) " +
					error
			);
		}
	};

	useEffect(() => {
		fetchVendorDataByTransactions(searchTermVendor);
		fetchVendorCount();
		$("#vendorTabBtn").addClass("nav-selected");
		$("#productTabBtn").removeClass("nav-selected");
		// Cleanup function
		return () => {
			isMounted = false; // Set the flag to false when the component is unmounting
		};
	}, []);

	useEffect(() => {}, []);

	const history = useHistory();

	function vendorTableRowClicked(e: any) {
		console.log(e.target.id);
		let path = `/vendor/${e.target.id}`;
		history.push(path);
	}

	function addVendorBtn() {
		$("#vendor-modal").removeAttr("hidden");
	}

	function deleteVendorBtnTrigger() {
		if (toDelete.length > 0) {
			setShowDelete(true);
		}
	}

	function addToDeleteArray(vIdInput: string, vNameInput: string) {
		const currentChecked = document.getElementById(
			"vId-" + vIdInput
		) as HTMLInputElement;

		if (currentChecked.checked) {
			const hasOccurrences = toDelete.some(({ id, vname }) => id === vIdInput);

			if (!hasOccurrences) {
				setToDelete((toDelete) => [
					...toDelete,
					{ id: vIdInput, vname: vNameInput },
				]);
			} else {
				// If the item is already in the toDelete array, no action is needed
				return;
			}
		} else {
			setToDelete((toDelete) =>
				toDelete.filter(({ id, vname }) => !(id === vIdInput))
			);
		}
	}

	return (
		<div className="Application">
			<header>
				<AddVendor setVData={setvData} setVendorCount={setVendorCount} />
				{showDelete && (
					<DeleteVendor
						vendors={toDelete}
						setvData={setvData}
						setVendorCount={setVendorCount}
						setShowDelete={setShowDelete}
					/>
				)}
			</header>

			<title>Facturación PJL 2022 - Distribuidores </title>

			<div className="container" id="container">
				<div className="container-top-section">
					<div className="container-top-first-row">
						<div className="container-title-section">
							<p className="container-title">Distribuidores</p>
							<p className="container-title-count">({vendorCount})</p>
						</div>
						<div className="title-button-container">
							<button
								type="button"
								className="btn secondary-btn deleteVendorBtn"
								data-bs-toggle="button"
								id="deleteVendorBtn"
								onClick={deleteVendorBtnTrigger}
							>
								Borrar
							</button>
							<button
								type="button"
								className="btn addVendorBtn"
								data-bs-toggle="button"
								id="btn"
								onClick={addVendorBtn}
							>
								Registrar nuevo
							</button>
						</div>
					</div>

					<div className="sub-section-container">
						<div className="left-pad"></div>
						<div className="selected-under">
							<p className="sub-section-title sub-section-selected">See all</p>
						</div>
						<p className="sub-section-title ">Saved</p>
						<p className="sub-section-title">Ongoing</p>
						<p className="sub-section-title">Archived</p>
					</div>
				</div>

				<div className="container-top-third-row">
					<div className="dropdown-section">
						<button
							className="dropdown-btn dropdown-toggle"
							type="button"
							id="dropdownMenuButton1"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Sort by
						</button>
						<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
							<li>
								<a className="dropdown-item" href="#">
									Action
								</a>
							</li>
							<li>
								<a className="dropdown-item" href="#">
									Another action
								</a>
							</li>
							<li>
								<a className="dropdown-item" href="#">
									Something else here
								</a>
							</li>
						</ul>
					</div>

					<div className="search-container">
						<button className="search-btn">
							<img
								className="search-icon"
								src={require("./assets/icons/search-attributed.png")}
							></img>
						</button>
						<input
							className="search-bar"
							type="search"
							placeholder=" Buscar Distribuidor"
							aria-label="Search"
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									fetchVendorDataByTransactions(preSearch, true);
									setSearchTermVendor(preSearch);
								}
							}}
							onChange={(event) => {
								setPreSearch(event.target.value);
								if (event.target.value.length == 0) {
									setSearchTermVendor("");
								}
							}}
						/>
						{/*<button className="btn btn-outline-success" id='search-btn' type="submit">Buscar</button>*/}
					</div>
				</div>

				<InfiniteScroll
					dataLength={vData.length}
					next={() => {
						fetchVendorDataByTransactions(searchTermVendor);
					}}
					hasMore={hasMore}
					loader={<h4>Loading...</h4>}
					className="row"
				>
					<table className="tble">
						<thead>
							<tr className="thead-row">
								<th scope="col" className="select-col">
									{/*<input type="checkbox" className="checkbox-table"></input>*/}
								</th>
								<th scope="col" className="vName-col">
									Nombre
								</th>
								<th scope="col" className="vId-col">
									Id
								</th>
							</tr>
						</thead>
						<tbody>
							{vData.map(
								(
									{ id, name } //Data driven display of rows in data
								) => (
									<tr key={"v-" + id} /*onClick={vendorTableRowClicked}*/>
										<td className="select-col">
											<input
												type="checkbox"
												className="checkbox-table"
												name={id}
												onChange={() => addToDeleteArray(id, name)}
												id={"vId-" + id}
											></input>
										</td>
										<td
											id={id}
											className="vName-col"
											onClick={(e) => vendorTableRowClicked(e)}
										>
											{name}
										</td>
										<td
											scope="row"
											id={id}
											className="id-col-data vId-col"
											onClick={(e) => vendorTableRowClicked(e)}
										>
											{id}
										</td>
									</tr>
								)
							)}
						</tbody>
					</table>
				</InfiniteScroll>
			</div>
		</div>
	);
}

export default VendorListScreen;
