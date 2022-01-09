import React, {useState} from 'react'
import { useParams } from 'react-router-dom';    //Helps us redirect to other pages

import { useStateContext } from './contexts/dataContext';
import { useHistory} from 'react-router-dom';
import $, { error } from 'jquery';

//get Date
import * as moment from 'moment';

function ItemInfo(props){

    
    const history=useHistory();
    const goBack=()=>{
        history.goBack();
    }
    //console.log(TransactionData);

    let {pId} = useParams();

   //Import data from Context API
    const[ProductData, setProductData]= useStateContext()[0];
    const [transaction_data, settData]= useStateContext()[1];
    const[VendorData, setVendorData]= useStateContext()[2];


    let realIndex=0;
    realIndex=ProductData.find((val,i) => pId==val.pId);    //go through JSON and list by pId and not by [index]
    console.log('yes' +pId);
    console.log('realIndex -> '+realIndex.pId);

    

    function displayInputFields(){
        $('#input-row-vId').val('');
        inputCheck();
        //Delete all data on fields just incase it is already filled
        $('#input-row-saleInvoiceId').val('');
        $('#input-row-saleWeight').val('');
        $('#input-row-salePrice').val('');
        $('#input-row-vId').val('');
        $('#input-row-purchaseInvoiceId').val('');
        $('#input-row-purchaseWeight').val('');
        $('#input-row-purchasePrice').val('');

        
        $('#btnUpdate').removeAttr('hidden');
        $('#input-new-data-row').removeAttr('hidden');
    }

    function inputCheck()
    {
        console.log($('#input-row-vId').val().length+' - '+$('#input-row-saleInvoiceId').val().length);
        //if vendor information is filled, then it will be a purchase transaction
            //hence, disable all Sale input fields to prevent user confusion
        if($('#input-row-vId').val().length>1)  //'>1' is to prevent completely empty input but no more change case
        {
            //delete any previous information on sale fields, if any
            $('#input-row-saleInvoiceId').val('');
            $('#input-row-saleWeight').val('');
            $('#input-row-salePrice').val('');
            //disable all sale fields
            $('#input-row-saleInvoiceId').attr('disabled',true);
            $('#input-row-saleWeight').attr('disabled',true);
            $('#input-row-salePrice').attr('disabled',true);

            return;


    
        }
        if($('#input-row-saleInvoiceId').val().length>1)  //if purchase Informationis filled,
                                                                //do same steps but with PURCHASE input fields
        {
            //delete any previous information on PURCHASE fields, if any
            $('#input-row-vId').val('');
            $('#input-row-purchaseInvoiceId').val('');
            $('#input-row-purchaseWeight').val('');
            $('#input-row-purchasePrice').val('');
            
            //disable all PURCHASE fields
            $('#input-row-vId').attr('disabled',true);
            $('#input-row-purchaseInvoiceId').attr('disabled',true);
            $('#input-row-purchaseWeight').attr('disabled',true);
            $('#input-row-purchasePrice').attr('disabled',true);

            return;
        }
        else    //if both fields are empty (may have erased and tries to fill opposite field)
        {
            //enable all input fields 
            $('#input-row-saleInvoiceId').attr('disabled',false);
            $('#input-row-saleWeight').attr('disabled',false);
            $('#input-row-salePrice').attr('disabled',false);
            $('#input-row-vId').attr('disabled',false);
            $('#input-row-purchaseInvoiceId').attr('disabled',false);
            $('#input-row-purchaseWeight').attr('disabled',false);
            $('#input-row-purchasePrice').attr('disabled',false);
        }
        
    }

    function addNewDataRow(){

        //Make a pointer of that Error Template HTML tag since we will be using it alot
        var errorTemplate=$('#error-template');
        errorTemplate.attr('hidden',true);  //keep it hidden

    
        //-------->Check for valid [non-empty] PURCHASE info data
        //------------->Display proper error messages if failed check
        if($('#input-row-vId').val()!=0)
        {
            let vendorId=$("[list='vendors']").val();   //get the vendor from the [datalist] dropdown
            vendorId=idForName(vendorId);   //Convert to proper db data

            //If non-empty
            if($('#input-row-purchaseInvoiceId').val()!=0)
            {
                if($('#input-row-purchaseWeight').val()!=0)
                {
                    if($('#input-row-purchasePrice').val()!=0)
                    {
                        //then all data is valid, we can add into array
                        settData([...transaction_data,{ tId:9, tpId:pId, date:$('#input-row-date').val(), vId:vendorId, purchaseInvoiceId:$('#input-row-purchaseInvoiceId').val(),
                        purchaseWeight:$('#input-row-purchaseWeight').val(), purchasePrice:$('#input-row-purchasePrice').val(), saleInvoiceId: null, saleWeight:null, salePrice:null},]);
        

                        $('#input-new-data-row').attr('hidden',true);
                        $('#btnUpdate').attr('hidden',true);
                    }
                    else{   //else, it is empty; Display correct error message to inform user
                        errorTemplate.text("Error - El precio de el producto no puede estar vacío");
                        errorTemplate.attr('hidden',false);
                    }
                }
                else
                {
                    errorTemplate.text("Error - El peso de el producto no puede estar vacío");
                    errorTemplate.attr('hidden',false);
                }
            }
            else
            {
                errorTemplate.text("Error - El numero de factura no puede estar vacío");
                errorTemplate.attr('hidden',false);
            }

        }
        else
        {
            //-------->Check for valid [non-empty] SALE info data
            //------------->Display proper error messages if failed check

            if($('#input-row-saleInvoiceId').val()!=0)
            {
                if($('#input-row-saleWeight').val()!=0)
                {
                    if($('#input-row-salePrice').val()!=0)
                    {
                        settData([...transaction_data,{ tId:9, tpId:pId, date:$('#input-row-date').val(), vId:null, purchaseInvoiceId:null,
                        purchaseWeight:null, purchasePrice:null, saleInvoiceId: $('#input-row-saleInvoiceId').val(),
                        saleWeight:$('#input-row-saleWeight').val(), salePrice:$('#input-row-salePrice').val()},]);

                        $('#input-new-data-row').attr('hidden',true);
                        $('#btnUpdate').attr('hidden',true);
                    }
                    else
                    {
                        errorTemplate.text("Error - El precio de venta de el producto no puede estar vacío");
                        errorTemplate.attr('hidden',false);
                    }
                }
                else{
                    errorTemplate.text("Error - El peso de venta de el producto no puede estar vacío");
                    errorTemplate.attr('hidden',false);
                }
            }
            else{
                errorTemplate.text("Error - El # de Invoice de el producto no puede estar vacío");
                errorTemplate.attr('hidden',false);
            }
        }
        //settData([...transaction_data,{ tId:9, tpId:1, date:'12/31/2021', vId:null, purchaseInvoiceId:null,
         //purchaseWeight:null, purchasePrice:null, saleInvoiceId: null, saleWeight:null, salePrice:null},]);
        
    }

    function nameForId(vIdPassed)
    {
        if(vIdPassed>0 && vIdPassed!=null)
            return ( VendorData.find(({vId},i) => vIdPassed===vId).vName);
    }

    function idForName(vNamePassed)
    {
        if( vNamePassed!=null)
            return ( VendorData.find(({vName},i) => vNamePassed===vName).vId);
    }

    function changeInvoiceId(e,lastValue,toChangeId)
    {   
        if(e.keyCode==13 || e.keyCode==9)   //if enter or tab is pressed
        {
            settData(
                transaction_data.map((val,i) => val.tId==toChangeId ? { tId:val.tId, tpId:val.tpId, date:val.date, vId:val.vId, purchaseInvoiceId: e.target.value,
                     purchaseWeight:val.purchaseWeight, purchasePrice:val.purchasePrice, saleInvoiceId: val.saleInvoiceId, saleWeight:val.saleWeight, salePrice:val.salePrice} : val));

            $('#'+e.target.getAttribute('id')).prop('disabled',true);
            $('#'+e.target.getAttribute('id')).prop('disabled',false);  //lose focus out of the textbox
        }
        

        $('#'+e.target.getAttribute('id')).focusout(() => { //if enter is not pressed, and user left textfield revert changes -> (reset value to default [original])
            e.target.value=lastValue;
        })
    }

    function changePurchaseWeight(e,lastValue,toChangeId)
    {
        
        if(e.keyCode==13 || e.keyCode==9)   //if enter or tab is pressed
        {
            console.log("entered");
            //console.log(e.target.value);
            settData(
                transaction_data.map((val,i) => val.tId==toChangeId ? { tId:val.tId, tpId:val.tpId, date:val.date, vId:val.vId, purchaseInvoiceId: val.purchaseInvoiceId,
                     purchaseWeight:parseInt(e.target.value), purchasePrice:val.purchasePrice, saleInvoiceId: val.saleInvoiceId, saleWeight:val.saleWeight, salePrice:val.salePrice} : val));

            $('#'+e.target.getAttribute('id')).prop('disabled',true);
            $('#'+e.target.getAttribute('id')).prop('disabled',false);  //lose focus out of the textbox
        }

        $('#'+e.target.getAttribute('id')).focusout(() => { //if enter is not pressed, and user left textfield revert changes -> (reset value to default [original])
            e.target.value=lastValue;
        })
        
        console.log(transaction_data);
        
    }


    

    

    return (
        <div className="Application">
            <header>
                <div class="alert alert-danger" role="alert" id='error-template' onClick={()=>{$('#error-vendor').attr('hidden',true)}} hidden>
                    This is a danger alert—check it out!
                </div>
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
                        
                            <img src='https://cdn3.iconfinder.com/data/icons/user-interface-731/32/Left_Chevron-512.png' id='left-back-btn' onClick={goBack}></img>
                        
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
                            <h1 >{realIndex.pName}</h1>
                            <h4>{realIndex.pDescription}</h4>
                            <h4>{realIndex.pWeightType}</h4>
                        </div>
                        <div className='col-3 d-flex justify-content-end'>
                            <h4>Product Id: {realIndex.pId}</h4>
                        </div>
                        
                    </div>
                    <div className='row'>
                        <div className='col-9'>

                        </div>
                        <div className='col d-flex justify-content-end'>
                            <h5>Cantidad disponible: {realIndex.pQuantity}</h5>
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
                                     realIndex.pId==({tpId}.tpId).toString() ?
                                    
                                    
                                    <tr className='table-row'>
                                        <th scope="row">{tId}</th>
                                        <td><input type='text' id={'row'+tId+'date'} className='tableInput tableDate' defaultValue={date}/></td>
                                        
                                        {
                                            purchaseInvoiceId!=null?    //if the row only uses Purchase Side, disable all actions on right side (Sale) of table
                                        <>
                                            <td><input type='text' id={'row'+tId+'vId'} className='tableInput' defaultValue={nameForId(vId)}></input></td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'purchaseInvoiceId'} className='tableInput' defaultValue={purchaseInvoiceId} onKeyDown={e =>{changeInvoiceId(e,purchaseInvoiceId,tId)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'purchaseWeight'} className='tableInput' defaultValue={purchaseWeight} onKeyDown={e =>{changePurchaseWeight(e,purchaseWeight,tId)}}  />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'purchasePrice'} className='tableInput' defaultValue={purchasePrice}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'saleInvoiceId'} className='tableInput' defaultValue={saleInvoiceId} disabled/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'saleWeight'} className='tableInput' defaultValue={saleWeight} disabled/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'salePrice'} className='tableInput' defaultValue={salePrice} disabled/>
                                                {/*<img src='https://www.pngrepo.com/download/122147/rounded-delete-button-with-minus.png' className='delete-btn'/>*/}
                                                </div>
                                            </td>
                                        </>
                                        :   //else if it only uses the right side (Sale) reverse
                                        <>
                                            <td><input type='text' id={'row'+tId+'vId'} className='tableInput' defaultValue={nameForId(vId)} disabled/></td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'purchaseInvoiceId'} className='tableInput' defaultValue={purchaseInvoiceId} onKeyDown={e =>{changeInvoiceId(e,purchaseInvoiceId,tId)}} disabled/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'purchaseWeight'} className='tableInput' defaultValue={purchaseWeight} onKeyDown={e =>{changePurchaseWeight(e,purchaseWeight,tId)}} disabled/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'purchasePrice'} className='tableInput' defaultValue={purchasePrice} disabled/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'saleInvoiceId'} className='tableInput' defaultValue={saleInvoiceId}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'saleWeight'} className='tableInput' defaultValue={saleWeight}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id={'row'+tId+'salePrice'} className='tableInput' defaultValue={salePrice}/>
                                                {/*<img src='https://www.pngrepo.com/download/122147/rounded-delete-button-with-minus.png' className='delete-btn'/>*/}
                                                </div>
                                            </td>
                                        </>
                                        }
                                    </tr>
                                    :
                                    
                                    <></>
                                    
                                )}


                                <tr className='table-row' id='input-new-data-row' hidden>
                                        <th scope="row">
                                            {'->'}
                                        </th>
                                            <td>
                                                <input type='text' id='input-row-date' className='tableInput tableDate' defaultValue={moment().format('MM/DD/YYYY')}/>
                                            </td>
                                            <td>
                                                <input list='vendors' type='text' id='input-row-vId' className='tableInput' onKeyDown={inputCheck}/>

                                                <datalist id='vendors'>
                                                    {VendorData.map(({vId, vName, vNumOfTransactions}) =>
                                                        <option value={vName} id={vId}/>
                                                    )}
                                                </datalist>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id='input-row-purchaseInvoiceId' className='tableInput'/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id='input-row-purchaseWeight' className='tableInput'/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id='input-row-purchasePrice' className='tableInput'/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id='input-row-saleInvoiceId' className='tableInput' onKeyDown={inputCheck}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id='input-row-saleWeight' className='tableInput'/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='tableData'>
                                                    <input type='text' id='input-row-salePrice' className='tableInput'/>
                                                </div>
                                            </td>
                                </tr>
                                <tr hidden></tr>   {/* just a hidden element to not break the color scheme on the next table row*/}

                                
                                <tr>
                                    <th scope="row">
                                        <img src='https://static.thenounproject.com/png/1649999-200.png' id='add-data-btn' onClick={displayInputFields}/>
                                    </th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><button type="button" className="btn btn-outline-dark" id='btnUpdate' onClick={addNewDataRow} hidden>Actualizar</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> 
        </div>
    );
}

export default ItemInfo;