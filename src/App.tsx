import {
	BrowserRouter as /*Router,*/ HashRouter,
	Route,
	Switch,
} from "react-router-dom";
import { useHistory } from "react-router-dom"; //Helps us redirect to other pages
import { useEffect, useState } from "react";

//Import CSS styling
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"; //Boostrap Import 1/2
import "bootstrap/dist/js/bootstrap.bundle.min"; //Boostrap Import 2/2
import "./css/homePageStyle.css";
import "@aws-amplify/ui-react/styles.css";

//Import external pages in folder (Screens)
import ItemInfo from "./ItemInfo";
import VendorInfo from "./VendorInfo";
import VendorListScreen from "./VendorListScreen";

//Database- AMPLIFY
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";

//Components
import { NavBar } from "./components/NavBar";
import Footer from "./components/Footer";
import { AddProduct } from "./components/AddProduct";
import { DeleteProduct } from "./components/DeleteProduct";
import { MobileSignOutOption } from "./components/MobileSignOutOption";
import { getAccessToken } from "./Cognito";
import InfiniteScroll from "react-infinite-scroll-component";

//Types
import { ProductDataType, toDeleteType } from "./types";

import $ from "jquery";

Amplify.configure(awsconfig);

function Home(this: any) {
	//essential display data
	const [productData, setProductData] = useState<ProductDataType[]>([]);
	const [productCount, setProductCount] = useState<any>(-1);

	//auxiliary variables - for search actions
	const [searchTermProduct, setSearchTermProduct] = useState("");
	const [preSearch, setPreSearch] = useState("");

	//auxiliary variables - for pagination
	const [lastRowNum, SetLastRow] = useState(-1);
	const [hasMore, setHasMore] = useState(false);

	//auxiliary - for delete action
	const [toDelete, setToDelete] = useState<toDeleteType[]>([]);

	const fetchProductCount = async () => {
		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/products/count`,
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
				setProductCount(data[0].COUNT);
			}
		} catch (error) {
			console.log("Error retrieving COUNT data (fetchCountData) ", error);
		}
	};

	const fetchProductByTransactions = async (
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
				`${
					process.env.REACT_APP_API_URL
				}/products/mostTransactions?rowNum=${rowIndex}&searchBy=${encodeURI(
					searchTxt
				)}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			//if statement
			entered
				? setProductData(data) //if entered, forget all previous data and query new one (with search)
				: setProductData((prevData) => [...prevData, ...data]); //if not, keep on adding new data to existing one

			if (data.length > 0) {
				//for pagination, remember which index was the last one queried so new query can start from there
				SetLastRow(data[data.length - 1].rowNum);
			}
			setHasMore(data.length > 0);
		} catch (error) {
			console.error(
				"Error retrieving Product data (fetchProductByTransactionsData) ",
				error
			);
			window.alert(
				"Error retrieving Product data (fetchProductByTransactionsData) " +
					error
			);
		}
	};

	//Initialize all of this when first rendered
	useEffect(() => {
		$("#vendorTabBtn").removeClass("nav-selected");
		$("#productTabBtn").addClass("nav-selected");
		fetchProductCount();
		fetchProductByTransactions(searchTermProduct);
	}, []);

	const history = useHistory();

	function itemTableRowClicked(id: string) {
		let path = `/item/${id}`;
		history.push(path);
	}

	function addProductBtnTrigger() {
		$("#product-modal").removeAttr("hidden");
	}

	function deleteProductBtnTrigger() {
		if (toDelete.length > 0) {
			$("#product-modal-delete").removeAttr("hidden");
		}
	}

	// function toggleAllCheckboxes() {
	// 	const checkM = document.getElementById("main-checkbox") as HTMLInputElement;
	// 	var checkboxes = document.getElementsByTagName("input");
	// 	if (checkM.checked) {
	// 		for (var i = 0; i < checkboxes.length; i++) {
	// 			if (checkboxes[i].type == "checkbox") {
	// 				checkboxes[i].checked = true;
	// 				let toDeleteId = checkboxes[i].name;
	// 				let toDeleteName = checkboxes[i].id;

	// 				var numberOfOcurrences = toDelete.filter(
	// 					({ pId }) => pId == toDeleteId
	// 				);

	// 				if (toDeleteId != "") {
	// 					if (numberOfOcurrences.length == 0) {
	// 						setToDelete((toDelete) => [
	// 							...toDelete,
	// 							{ pId: toDeleteId, pName: toDeleteName },
	// 						]);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	} else {
	// 		for (var i = 0; i < checkboxes.length; i++) {
	// 			if (checkboxes[i].type == "checkbox") {
	// 				checkboxes[i].checked = false;
	// 				let toDeleteId = checkboxes[i].name;
	// 				let filtered_array = toDelete.filter(({ pId }) => pId != toDeleteId);
	// 				setToDelete(filtered_array);
	// 			}
	// 		}
	// 	}
	// }

	function addToDeleteArray(pIdInput: string, pNameInput: string) {
		const checkboxId = `checkbox_${pIdInput}`;

		const currentChecked = document.getElementById(
			checkboxId
		) as HTMLInputElement;

		if (currentChecked.checked) {
			const hasOccurrences = toDelete.some(({ pId }) =>
				compareIds(pId, pIdInput)
			);

			if (!hasOccurrences) {
				setToDelete((toDelete) => [
					...toDelete,
					{ pId: pIdInput, pName: pNameInput },
				]);
			}
		} else {
			const filteredArray = toDelete.filter(
				({ pId }) => !compareIds(pId, pIdInput)
			);
			setToDelete(filteredArray);
		}
	}

	function compareIds(id1: string, id2: string): boolean {
		// Remove special characters from both IDs
		const cleanId1 = id1.replace(/[^a-zA-Z0-9]/g, "");
		const cleanId2 = id2.replace(/[^a-zA-Z0-9]/g, "");

		// Compare the cleaned IDs
		return cleanId1 === cleanId2;
	}

	const removeProductsByIds = (
		productsToRemove: { pName: string; pId: string }[]
	) => {
		setProductData((prevData) => {
			// Create a set of product IDs to remove
			const idsToRemove = new Set(
				productsToRemove.map((product) => product.pId)
			);

			// Filter out products whose IDs are present in the idsToRemove set
			const updatedData = prevData.filter(
				(product) => !idsToRemove.has(product.id)
			);

			return updatedData;
		});

		setProductCount(productCount - productsToRemove.length);
	};

	const addProductTrigger = (product: ProductDataType) => {
		setProductCount(productCount + 1);
		setProductData((prev) => [product, ...prev]);
	};

	return (
		<div className="Application">
			<title>Facturación PJL 2022 - Productos </title>

			<div className="container" id="container">
				<AddProduct addProductTrigger={addProductTrigger} />
				<DeleteProduct
					products={toDelete}
					setToDelete={setToDelete}
					removeProductsByIds={removeProductsByIds}
				/>
				<div className="container-top-section">
					<div className="container-top-first-row">
						<div className="container-title-section">
							<p className="container-title">Productos</p>
							<p className="container-title-count">({productCount})</p>
						</div>
						<div className="title-button-container">
							<button
								type="button"
								className="btn secondary-btn deleteProductBtn"
								data-bs-toggle="button"
								id="btn"
								onClick={deleteProductBtnTrigger}
								//disabled
							>
								Borrar
							</button>
							<button
								type="button"
								className="btn addProductBtn"
								data-bs-toggle="button"
								id="addProductBtn"
								onClick={addProductBtnTrigger}
							>
								Agregar producto
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
							placeholder=" Buscar producto"
							aria-label="Search"
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									fetchProductByTransactions(preSearch, true);
									setSearchTermProduct(preSearch);
								}
							}}
							onChange={(event) => {
								setPreSearch(event.target.value);
								if (event.target.value.length == 0) {
									setSearchTermProduct("");
								}
							}}
						/>
						{/*<button className="btn btn-outline-success" id='search-btn' type="submit">Buscar</button>*/}
					</div>
				</div>

				<InfiniteScroll
					dataLength={productData.length}
					next={() => {
						fetchProductByTransactions(searchTermProduct);
					}}
					hasMore={hasMore}
					loader={<h4>Loading...</h4>}
					className="row"
				>
					<table className="tble">
						<thead>
							<tr className="thead-row">
								<th scope="col" className="select-col">
									{/*<input
										type="checkbox"
										id="main-checkbox"
										onChange={(e) => toggleAllCheckboxes()}
										className="checkbox-table"
						></input>*/}
								</th>
								<th scope="col" className="name-col">
									Nombre del producto
								</th>
								<th scope="col" className="type-col">
									Tipo
								</th>
								<th scope="col" className="tax-col">
									Impuesto
								</th>
								<th scope="col" className="id-col">
									Id
								</th>
							</tr>
						</thead>
						<tbody>
							{productData.map(({ id, name, weightType }) => (
								<tr key={id}>
									<td className="select-col">
										<input
											type="checkbox"
											className="checkbox-table"
											name={id}
											onChange={() => addToDeleteArray(id, name)}
											id={`checkbox_${id}`}
										/>
									</td>
									<td
										id={id}
										className="name-col name-col-data"
										onClick={() => itemTableRowClicked(id)}
									>
										{name}
									</td>
									<td
										id={id}
										className="type-col"
										onClick={() => itemTableRowClicked(id)}
									>
										{weightType}
									</td>
									<td
										className="tax-col"
										onClick={() => itemTableRowClicked(id)}
									></td>
									<td
										scope="row"
										id={id}
										className="id-col id-col-data"
										onClick={() => itemTableRowClicked(id)}
									>
										{id}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</InfiniteScroll>
			</div>
		</div>
	);
}

function App() {
	return (
		<HashRouter basename={process.env.PUBLIC_URL}>
			<div className="Application">
				<NavBar />

				<Switch>
					{" "}
					{/*Makes sure we are only on one route at a time*/}
					<Route exact path="/" component={withAuthenticator(Home)} />
					<Route
						exact
						path="/item/:pId"
						component={withAuthenticator(ItemInfo)}
					/>
					<Route
						exact
						path="/vendor/:vId_global"
						component={withAuthenticator(VendorInfo)}
					/>
					<Route
						exact
						path="/vendor"
						component={withAuthenticator(VendorListScreen)}
					/>
				</Switch>
				<MobileSignOutOption />
				<Footer />
			</div>
		</HashRouter>
	);
}

export default withAuthenticator(App);
