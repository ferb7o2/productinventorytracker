import React from 'react'

function ItemInfo(){

    function addNewDataRow(){
        console.log("ADD new Data Row");
    }

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
                        <h1>Nombre del Producto</h1>
                        <h4>[Peso]</h4>
                    </div>
                    <div className='row'>
                        <div className='col-9'>

                        </div>
                        <div className='col'>
                            <h5>Cantidad disponible: [cantidad]</h5>
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
                                <tr className='table-row'>
                                    <th scope="row">26</th>
                                    <td>Chile Guajillo</td>
                                    <td>6682.36</td>
                                    <td>12/12/2021</td>
                                    <td>data</td>
                                    <td>data</td>
                                    <td>data</td>
                                    <td>
                                        data
                                        <img src='https://www.pngrepo.com/download/122147/rounded-delete-button-with-minus.png' className='delete-btn'/>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Hoja p/Tamal Chisemex</td>
                                    <td>3,024</td>
                                    <td>09/28/2021</td>
                                    <td>data</td>
                                    <td>data</td>
                                    <td>data</td>
                                    <td>data</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Alpistle Bulto 25kg</td>
                                    <td>0</td>
                                    <td>12/24/2021</td>
                                    <td>data</td>
                                    <td>data</td>
                                    <td>data</td>
                                    <td>data</td>
                                </tr>
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
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> 
        </div>
    );
}

export default ItemInfo;