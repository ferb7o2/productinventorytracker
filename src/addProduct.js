import React from "react";
import $ from 'jquery';
import {useStateContext} from './contexts/dataContext'
import{useHistory} from 'react-router-dom'

function AddProduct(){
    //Inherits the Product data associative array from the CONTEXT (context API)
    const[ProductData, setProductData]= useStateContext()[0];

    //Variables for keeping up with Page's Navigation
    const history=useHistory();
    const goBack=()=>{
        history.goBack();
    }

    //Enables the textbox for Bulk information Input
        //both of the next two functions make sure that no two checkboxes are checked at the same time
    function checkedBoxBULK(){
        if($('#gridCheckBulk').is(':checked'))  //if bulk checkbox is checked
        {
            $('#inputQuantityType').attr('disabled',false); //enable the textbox right next to it
            $('#gridCheckKg').prop('checked',false);        //disable the (kg) checkbox
        }
        else
        {
            $('#inputQuantityType').attr('disabled',true);  //if not checked, disable textbox next to it
            $('#gridCheckKg').prop('checked',true);         //enable the (kg) checkbox
        }
    }
    function checkedBoxKG(){
        if($('#gridCheckKg').is(':checked'))  //if Kg checkbox is checked
        {
            $('#inputQuantityType').attr('disabled',true); //disable Bulk textbox
            $('#gridCheckBulk').prop('checked',false);     //disable bulk checkbox
        }
        else
        {
            $('#inputQuantityType').attr('disabled',false);  //if not checked
            $('#gridCheckKg').prop('checked',false);        
        }
    }

    //Triggered when (register) product button is pressed
        //Checks that product name is non-NULL && non-empty
        //Checks that if Bulk checkbox option is pressed, there exists a non-empty numeric value on the textBox
    function registerProduct(e){
        e.preventDefault();
        //console.log(ProductData);

        //check if both (name and Bulk textbox, if applicable) fields have been entered
        if($('#productNameField').val().length===0) //if (product name) field is blank
        {
            $('#error-product').removeAttr('hidden');   //display warning banner
            $('#error-product').text("Error - el NOMBRE del producto no puede estar VACIO") //with custom (no empty name) message
        }
        else
        {
            if($('#gridCheckBulk').is(':checked'))  //if bulk checkbox is selected
            {
                if($('#inputQuantityType').val().length!=0) //check that it's textbox input is non-empty
                {
                    if(/^[0-9]+(?:\.[0-9]+)?$/.test($('#inputQuantityType').val())) //REGEX - check if value on (kg) field is a number
                    {
                        //if non-empty && a valid number, add the new product to our Product data (associative) array
                        setProductData([...ProductData,{pId: 101, pName:$('#productNameField').val(), pDescription:$('#productDescriptionField').val()+" Bulto/Caja de "+$('#inputQuantityType').val()+' Kg', pQuantity:0, pWeightType:'Bulto'}])
                        history.goBack();   //and return to the home screen
                    }
                    else    //if not a valid number
                    {
                        $('#error-product').removeAttr('hidden');   //display error banner - Not a valid number
                        $('#error-product').text("Error - Peso de el bulto/caja debe de ser NUMERO")
                    }
                   
                }
                else    //if (bulk) textbox is empty
                {
                    $('#error-product').removeAttr('hidden');   
                    $('#error-product').text("Error - PESO de el bulto/caja no puede estar VACIO")
                }
                    
            }
            else    //if (kg) checkbox is selected
            {
                //add Product to array
                setProductData([...ProductData,{pId: 101, pName:$('#productNameField').val(), pDescription:$('#productDescriptionField').val(), pQuantity:0, pWeightType:'Kg'}]);
                history.goBack();   //and return to the home screen
            }
        }
    }

    return(
        <div className="Application">
            <header>
                <div className="alert alert-danger" role="alert" id='error-product' onClick={()=>{$('#error-product').attr('hidden',true)}} hidden>
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
                        <img src='https://icons-for-free.com/iconfiles/png/512/arrow+right+chevron+chevronrightcircle+circle+right+right-1320185732004907921.png' id='right-back-btn' onClick={goBack}></img>
                    </div>
                </div>
            </header>
            <div className="container">
                    <div className='row'>
                        <h1>Producto Nuevo</h1>
                    </div>
                    
                    <div className='fair-spacing'/>
                    <div className='row'>
                        <form>
                            <div className="form-group row">
                                <label htmlFor="productNameField" className="col-sm-2 col-form-label">Nombre</label>
                                <div className="col-sm-10">
                                <input type="text" className="form-control" id="productNameField" placeholder="Nombre de Producto"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="productDescriptionField" className="col-sm-2 col-form-label">Descripcion</label>
                                <div className="col-sm-10">
                                <input type="text" className="form-control" id="productDescriptionField" placeholder="Descripcion (opcional)"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-2">[Cantidad]</div>
                                <div className="col-sm-10">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="gridCheckKg" onChange={checkedBoxKG} checked/>
                                    <label className="form-check-label" htmlFor="gridCheckKg">
                                    Kg
                                    </label>
                                </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-2"></div>
                                <div className="col-sm-1">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="gridCheckBulk" onChange={checkedBoxBULK}/>
                                    <label className="form-check-label" htmlFor="gridCheckBulk">
                                    Bulto/Caja
                                    </label>
                                </div>
                                </div>
                                <div className="col-sm-2">
                                <div className="form-check">
                                    <input type="text" className="form-control" id="inputQuantityType" placeholder="Peso (kg)" disabled/>
                                </div>
                                </div>
                            </div>
                            <div className="fair-spacing"/>
                            <div className="form-group row">
                                <div className="col-sm-10">
                                <button type="submit" className="btn btn-primary" onClick={registerProduct}>Registrar Producto</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div> 
        </div>

    );

}

export default AddProduct;