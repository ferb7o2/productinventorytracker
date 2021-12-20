import React, {useState} from 'react'
import { useParams } from 'react-router-dom';    //Helps us redirect to other pages

import { useStateContext } from './contexts/dataContext';

function ItemInfo(props){

    

    //console.log(TransactionData);

    let {pId} = useParams();
    const[ProductData, setProductData]= useStateContext()[0];
    const [transaction_data, settData]= useStateContext()[1];

    function addNewDataRow(){
        console.log("ADD new Data Row");
    }

    //let product_data=props.location.state.pData[(pId-1)];
    //let transaction_data=props.location.state.tData;

    

    return (
        <div className="Application">
            <header>
                <nav className="navbar navbar-dark bg-dark">
                    <div className="container-fluid">
                    <a className="navbar-brand" href="#">Facturacion Mexico [2021 Año]</a>
                    <a> HEY</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Pricing</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled">Disabled</a>
                        </li>
                        </ul>
                    </div>
                    </div>
                </nav> 
                <div className='row'>
                    <div className='col'>
                        <a href='/'>
                            <img src='https://cdn3.iconfinder.com/data/icons/user-interface-731/32/Left_Chevron-512.png' id='left-back-btn'></img>
                        </a>
                    </div>
                    <div className='col'>
                        <a href='/'>
                            <img src='https://icons-for-free.com/iconfiles/png/512/arrow+right+chevron+chevronrightcircle+circle+right+right-1320185732004907921.png' id='right-back-btn'></img>
                        </a>
                    </div>
                </div>
            </header>
            <div className="container">
                    <div className='row'>
                        <div className='col'>
                            <h1>{ProductData[pId].pName}</h1>
                            <h4>{ProductData[pId].pWeightType}</h4>
                        </div>
                        <div className='col-3' id='right-align' >
                            <h4>Product Id: {ProductData[pId].pId}</h4>
                        </div>
                        
                    </div>
                    <div className='row'>
                        <div className='col-9'>

                        </div>
                        <div className='col' id='right-align'>
                            <h5>Cantidad disponible: {ProductData[pId].pQuantity}</h5>
                        </div>
                    </div>
                    <div className='fair-spacing'/>
                    <div className='row'>
                        <div className='col'>
                            <h4 className='item-table-label'>Compra</h4>
                        </div>
                        <div className='col'>
                            <h4 className='item-table-label'>Venta</h4>
                        </div>
                    </div>
                    <div className='row'>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                <th scope="col">tId</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Proveedor</th>
                                <th scope="col"># Factura</th>
                                <th scope="col">Peso <bold>(Kg)</bold></th>
                                <th scope="col">Precio <bold>(MXN)</bold></th>
                                <th scope="col"># Invoice</th>
                                <th scope="col">Peso <bold>(Kg)</bold></th>
                                <th scope="col">Precio <bold>(MXN)</bold></th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction_data.map(({tId,tpId, date,vId,purchaseInvoiceId, purchaseWeight, purchasePrice,saleInvoiceId,saleWeight, salePrice} ) => //Data driven display of rows in data 
                                     ProductData[pId].pId==({tpId}.tpId).toString() ?
                                    
                                    
                                    <tr className='table-row'>
                                        <th scope="row">{tId}</th>
                                        <td>{date}</td>
                                        <td>{vId}</td>
                                        <td>{purchaseInvoiceId}</td>
                                        <td>{purchaseWeight}</td>
                                        <td>{purchasePrice}</td>
                                        <td>{saleInvoiceId}</td>
                                        <td>{saleWeight}</td>
                                        <td>
                                            {salePrice}
                                            {/*<img src='https://www.pngrepo.com/download/122147/rounded-delete-button-with-minus.png' className='delete-btn'/>*/}
                                        </td>
                                    </tr>
                                    :
                                    
                                    <></>
                                    
                                )}
                                <tr onClick={addNewDataRow}>
                                    <th scope="row">
                                        <img src='https://static.thenounproject.com/png/1649999-200.png' id='add-data-btn'/>
                                    </th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> 
        </div>
    );
}

export default ItemInfo;