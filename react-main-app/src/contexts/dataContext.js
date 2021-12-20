import React, {useState, createContext, useContext} from 'react';

export const DataContext = createContext();

export const DataProvider = ({children}) => {
    const product_data=[
        {pId: 1, pName:'Chile Guajillo', pDescription:' 1 Kg Chile Guajillo', pQuantity:1, pWeightType:'Kg'},
        {pId: 2, pName:'Hoja p/tamal Chisemex', pDescription:'Bulto Hoja p/Tamal c/24 pzs', pQuantity:1, pWeightType:'Bulto'},
        {pId: 3, pName:'Alpiste Bulto 25 kg', pDescription:'Bulto de Alpiste c/25 Kg', pQuantity:1, pWeightType:'Bulto'},
      ];

      const [ProductData,setProductData]=useState(product_data);

      const transaction_data=[
        { tId:1, tpId:1, date:'12/24/2021', vId:1, purchaseInvoiceId:1, purchaseWeight:23, purchasePrice:4322, saleInvoiceId: null, saleWeight:null, salePrice:null},
        { tId:2, tpId:1, date:'12/29/2021', vId:1, purchaseInvoiceId:12, purchaseWeight:44, purchasePrice:4322, saleInvoiceId: null, saleWeight:null, salePrice:null},
        { tId:3, tpId:1, date:'12/31/2021', vId:null, purchaseInvoiceId:null, purchaseWeight:null, purchasePrice:null, saleInvoiceId: 244, saleWeight:67, salePrice:5000},
      ]

      const [TransactionData, setTransactionData]=useState(transaction_data);

      const vendor_data=[
        {vId: 1, vName:'Chisemex', vRFC:'MELM8305281H0', vNumOfTransactions:32, vAddress:'N/A'},
        {vId: 2, vName:'Distribuidora De Productos Deshidratados SA de CV', vRFC:'JEFC8305281H0', vNumOfTransactions:12, vAddress:'N/A'},
        {vId: 3, vName:'Alfredo Lopez', vRFC:'LANJ8305281H0', vNumOfTransactions:94, vAddress:'Calera de Victor Rosales Zacatecas'},
      ]
    
    
     // const [data,setData]=useState(product_data);
      const [VendorData, setVendorData]=useState(vendor_data);

      return (
          <DataContext.Provider value ={[[ProductData,setProductData], [TransactionData, setTransactionData],[VendorData, setVendorData]]}>
              {children}
          </DataContext.Provider>
      );
};

export const useStateContext= () => useContext(DataContext);


