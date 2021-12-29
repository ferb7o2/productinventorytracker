import React, {useState, createContext, useContext} from 'react';

export const DataContext = createContext();

export const DataProvider = ({children}) => {
    const product_data=/*[
        {pId: 1, pName:'Chile Guajillo', pDescription:' 1 Kg Chile Guajillo', pQuantity:1, pWeightType:'Kg'},
        {pId: 2, pName:'Hoja p/tamal Chisemex', pDescription:'Bulto Hoja p/Tamal c/24 pzs', pQuantity:1, pWeightType:'Bulto'},
        {pId: 3, pName:'Alpiste Bulto 25 kg', pDescription:'Bulto de Alpiste c/25 Kg', pQuantity:1, pWeightType:'Bulto'},
      ];*/
      [{
        "pId": 1,
        "pName": "Milk Powder",
        "pDescription": "Mix - Cocktail Strawberry Daiquiri",
        "pQuantity": 4,
        "pWeightType": "Kg"
      }, {
        "pId": 2,
        "pName": "Chicken - Whole Roasting",
        "pDescription": "Wine - Red, Concha Y Toro",
        "pQuantity": 67,
        "pWeightType": "Kg"
      }, {
        "pId": 3,
        "pName": "Nantucket - 518ml",
        "pDescription": "Irish Cream - Baileys",
        "pQuantity": 26,
        "pWeightType": "Kg"
      }, {
        "pId": 4,
        "pName": "Lobster - Tail 6 Oz",
        "pDescription": "Peach - Fresh",
        "pQuantity": 36,
        "pWeightType": "Bulto"
      }, {
        "pId": 5,
        "pName": "Dooleys Toffee",
        "pDescription": "Food Colouring - Orange",
        "pQuantity": 24,
        "pWeightType": "Kg"
      }, {
        "pId": 6,
        "pName": "Potatoes - Mini Red",
        "pDescription": "Chicken Breast Wing On",
        "pQuantity": 81,
        "pWeightType": "Kg"
      }, {
        "pId": 7,
        "pName": "Beer - Steamwhistle",
        "pDescription": "Juice - Clam, 46 Oz",
        "pQuantity": 95,
        "pWeightType": "Bulto"
      }, {
        "pId": 8,
        "pName": "Carbonated Water - Blackcherry",
        "pDescription": "Sauce - Vodka Blush",
        "pQuantity": 5,
        "pWeightType": "Kg"
      }, {
        "pId": 9,
        "pName": "Lidsoupcont Rp12dn",
        "pDescription": "Bread Crumbs - Panko",
        "pQuantity": 50,
        "pWeightType": "Bulto"
      }, {
        "pId": 10,
        "pName": "Coffee - French Vanilla Frothy",
        "pDescription": "Water, Tap",
        "pQuantity": 85,
        "pWeightType": "Bulto"
      }, {
        "pId": 11,
        "pName": "Godiva White Chocolate",
        "pDescription": "Wine - Sauvignon Blanc",
        "pQuantity": 52,
        "pWeightType": "Kg"
      }, {
        "pId": 12,
        "pName": "Skewers - Bamboo",
        "pDescription": "Watercress",
        "pQuantity": 68,
        "pWeightType": "Kg"
      }, {
        "pId": 13,
        "pName": "Gatorade - Orange",
        "pDescription": "Thyme - Lemon, Fresh",
        "pQuantity": 25,
        "pWeightType": "Kg"
      }, {
        "pId": 14,
        "pName": "Shortbread - Cookie Crumbs",
        "pDescription": "Lady Fingers",
        "pQuantity": 28,
        "pWeightType": "Bulto"
      }, {
        "pId": 15,
        "pName": "Mince Meat - Filling",
        "pDescription": "Cheese - Gouda",
        "pQuantity": 71,
        "pWeightType": "Kg"
      }, {
        "pId": 16,
        "pName": "Pepper - Chilli Seeds Mild",
        "pDescription": "Nut - Pumpkin Seeds",
        "pQuantity": 28,
        "pWeightType": "Kg"
      }, {
        "pId": 17,
        "pName": "Soup - Cream Of Broccoli, Dry",
        "pDescription": "Pasta - Fettuccine, Dry",
        "pQuantity": 55,
        "pWeightType": "Kg"
      }, {
        "pId": 18,
        "pName": "Doilies - 12, Paper",
        "pDescription": "Aspic - Amber",
        "pQuantity": 49,
        "pWeightType": "Bulto"
      }, {
        "pId": 19,
        "pName": "Cleaner - Bleach",
        "pDescription": "Nantucket Cranberry Juice",
        "pQuantity": 97,
        "pWeightType": "Kg"
      }, {
        "pId": 20,
        "pName": "Basil - Pesto Sauce",
        "pDescription": "Veal - Sweetbread",
        "pQuantity": 48,
        "pWeightType": "Kg"
      }, {
        "pId": 21,
        "pName": "Pasta - Canelloni",
        "pDescription": "Towel - Roll White",
        "pQuantity": 99,
        "pWeightType": "Kg"
      }, {
        "pId": 22,
        "pName": "Kiwi Gold Zespri",
        "pDescription": "Dried Figs",
        "pQuantity": 3,
        "pWeightType": "Bulto"
      }, {
        "pId": 23,
        "pName": "Beer - Sleemans Honey Brown",
        "pDescription": "Figs",
        "pQuantity": 100,
        "pWeightType": "Bulto"
      }, {
        "pId": 24,
        "pName": "Urban Zen Drinks",
        "pDescription": "Roe - Lump Fish, Black",
        "pQuantity": 63,
        "pWeightType": "Kg"
      }, {
        "pId": 25,
        "pName": "Cups 10oz Trans",
        "pDescription": "Cheese - Le Cru Du Clocher",
        "pQuantity": 10,
        "pWeightType": "Bulto"
      }, {
        "pId": 26,
        "pName": "Cookies - Oreo, 4 Pack",
        "pDescription": "Pasta - Elbows, Macaroni, Dry",
        "pQuantity": 5,
        "pWeightType": "Kg"
      }, {
        "pId": 27,
        "pName": "Crawfish",
        "pDescription": "Snapple - Mango Maddness",
        "pQuantity": 96,
        "pWeightType": "Kg"
      }, {
        "pId": 28,
        "pName": "Roe - Lump Fish, Black",
        "pDescription": "Straw - Regular",
        "pQuantity": 12,
        "pWeightType": "Kg"
      }, {
        "pId": 29,
        "pName": "Wine - Maipo Valle Cabernet",
        "pDescription": "Lamb - Shanks",
        "pQuantity": 79,
        "pWeightType": "Kg"
      }, {
        "pId": 30,
        "pName": "Pasta - Spaghetti, Dry",
        "pDescription": "Bacardi Breezer - Strawberry",
        "pQuantity": 22,
        "pWeightType": "Bulto"
      }, {
        "pId": 31,
        "pName": "Chevril",
        "pDescription": "Potatoes - Mini Red",
        "pQuantity": 84,
        "pWeightType": "Kg"
      }, {
        "pId": 32,
        "pName": "Soup - Knorr, French Onion",
        "pDescription": "Wine - Cabernet Sauvignon",
        "pQuantity": 84,
        "pWeightType": "Bulto"
      }, {
        "pId": 33,
        "pName": "Calvados - Boulard",
        "pDescription": "Thermometer Digital",
        "pQuantity": 44,
        "pWeightType": "Bulto"
      }, {
        "pId": 34,
        "pName": "Lettuce - Iceberg",
        "pDescription": "Pork - Bacon,back Peameal",
        "pQuantity": 41,
        "pWeightType": "Kg"
      }, {
        "pId": 35,
        "pName": "Peach - Halves",
        "pDescription": "Egg - Salad Premix",
        "pQuantity": 74,
        "pWeightType": "Kg"
      }, {
        "pId": 36,
        "pName": "Turkey - Whole, Fresh",
        "pDescription": "Soup - Campbells, Chix Gumbo",
        "pQuantity": 52,
        "pWeightType": "Bulto"
      }, {
        "pId": 37,
        "pName": "Orange - Tangerine",
        "pDescription": "Bread - Rolls, Corn",
        "pQuantity": 90,
        "pWeightType": "Kg"
      }, {
        "pId": 38,
        "pName": "Kahlua",
        "pDescription": "Beer - Steamwhistle",
        "pQuantity": 56,
        "pWeightType": "Kg"
      }, {
        "pId": 39,
        "pName": "Chutney Sauce",
        "pDescription": "Puree - Kiwi",
        "pQuantity": 64,
        "pWeightType": "Bulto"
      }, {
        "pId": 40,
        "pName": "Capon - Breast, Wing On",
        "pDescription": "Ice Cream Bar - Oreo Sandwich",
        "pQuantity": 11,
        "pWeightType": "Kg"
      }, {
        "pId": 41,
        "pName": "Sea Bass - Whole",
        "pDescription": "Beer - Upper Canada Light",
        "pQuantity": 75,
        "pWeightType": "Kg"
      }, {
        "pId": 42,
        "pName": "Cookie - Oatmeal",
        "pDescription": "Salmon Steak - Cohoe 6 Oz",
        "pQuantity": 36,
        "pWeightType": "Kg"
      }, {
        "pId": 43,
        "pName": "Water - Perrier",
        "pDescription": "Gingerale - Schweppes, 355 Ml",
        "pQuantity": 67,
        "pWeightType": "Bulto"
      }, {
        "pId": 44,
        "pName": "Chilli Paste, Sambal Oelek",
        "pDescription": "Pears - Anjou",
        "pQuantity": 3,
        "pWeightType": "Bulto"
      }, {
        "pId": 45,
        "pName": "Marjoram - Fresh",
        "pDescription": "Mushroom - Porcini Frozen",
        "pQuantity": 24,
        "pWeightType": "Bulto"
      }, {
        "pId": 46,
        "pName": "Cheese - Brie",
        "pDescription": "Bagel - Everything",
        "pQuantity": 92,
        "pWeightType": "Bulto"
      }, {
        "pId": 47,
        "pName": "Beef - Ground Lean Fresh",
        "pDescription": "Towel - Roll White",
        "pQuantity": 36,
        "pWeightType": "Kg"
      }, {
        "pId": 48,
        "pName": "Milk - 2%",
        "pDescription": "Neckerchief Blck",
        "pQuantity": 6,
        "pWeightType": "Kg"
      }, {
        "pId": 49,
        "pName": "Orange Roughy 4/6 Oz",
        "pDescription": "Cookies - Englishbay Wht",
        "pQuantity": 98,
        "pWeightType": "Bulto"
      }, {
        "pId": 50,
        "pName": "Sun - Dried Tomatoes",
        "pDescription": "Pork - Hock And Feet Attached",
        "pQuantity": 31,
        "pWeightType": "Bulto"
      }, {
        "pId": 51,
        "pName": "Red Cod Fillets - 225g",
        "pDescription": "Bok Choy - Baby",
        "pQuantity": 44,
        "pWeightType": "Bulto"
      }, {
        "pId": 52,
        "pName": "Zucchini - Mini, Green",
        "pDescription": "Bread - Bistro White",
        "pQuantity": 88,
        "pWeightType": "Kg"
      }, {
        "pId": 53,
        "pName": "Chocolate - Milk",
        "pDescription": "Syrup - Monin - Granny Smith",
        "pQuantity": 27,
        "pWeightType": "Bulto"
      }, {
        "pId": 54,
        "pName": "Spice - Peppercorn Melange",
        "pDescription": "Pail With Metal Handle 16l White",
        "pQuantity": 46,
        "pWeightType": "Kg"
      }, {
        "pId": 55,
        "pName": "Tomato Paste",
        "pDescription": "Banana - Green",
        "pQuantity": 36,
        "pWeightType": "Kg"
      }, {
        "pId": 56,
        "pName": "Bread - Petit Baguette",
        "pDescription": "Crab Brie In Phyllo",
        "pQuantity": 8,
        "pWeightType": "Bulto"
      }, {
        "pId": 57,
        "pName": "Chicken - Leg, Fresh",
        "pDescription": "Yogurt - Blueberry, 175 Gr",
        "pQuantity": 54,
        "pWeightType": "Bulto"
      }, {
        "pId": 58,
        "pName": "Lid - Translucent, 3.5 And 6 Oz",
        "pDescription": "Schnappes Peppermint - Walker",
        "pQuantity": 51,
        "pWeightType": "Bulto"
      }, {
        "pId": 59,
        "pName": "Nut - Hazelnut, Whole",
        "pDescription": "Soup - Knorr, Chicken Gumbo",
        "pQuantity": 93,
        "pWeightType": "Kg"
      }, {
        "pId": 60,
        "pName": "Water - Aquafina Vitamin",
        "pDescription": "Quinoa",
        "pQuantity": 95,
        "pWeightType": "Kg"
      }, {
        "pId": 61,
        "pName": "Pork - Bones",
        "pDescription": "Lemon Balm - Fresh",
        "pQuantity": 32,
        "pWeightType": "Kg"
      }, {
        "pId": 62,
        "pName": "Fennel - Seeds",
        "pDescription": "Pepper - Scotch Bonnet",
        "pQuantity": 37,
        "pWeightType": "Kg"
      }, {
        "pId": 63,
        "pName": "Bowl 12 Oz - Showcase 92012",
        "pDescription": "Juice - Grapefruit, 341 Ml",
        "pQuantity": 10,
        "pWeightType": "Bulto"
      }, {
        "pId": 64,
        "pName": "Tortillas - Flour, 10",
        "pDescription": "Sugar - Fine",
        "pQuantity": 35,
        "pWeightType": "Kg"
      }, {
        "pId": 65,
        "pName": "Squid U5 - Thailand",
        "pDescription": "Pasta - Angel Hair",
        "pQuantity": 88,
        "pWeightType": "Bulto"
      }, {
        "pId": 66,
        "pName": "Nougat - Paste / Cream",
        "pDescription": "Wine - Spumante Bambino White",
        "pQuantity": 96,
        "pWeightType": "Kg"
      }, {
        "pId": 67,
        "pName": "Wine - White, Chardonnay",
        "pDescription": "Shrimp - Black Tiger 8 - 12",
        "pQuantity": 76,
        "pWeightType": "Kg"
      }, {
        "pId": 68,
        "pName": "Garlic - Elephant",
        "pDescription": "Pork - Belly Fresh",
        "pQuantity": 39,
        "pWeightType": "Kg"
      }, {
        "pId": 69,
        "pName": "Cheese - Bakers Cream Cheese",
        "pDescription": "English Muffin",
        "pQuantity": 9,
        "pWeightType": "Bulto"
      }, {
        "pId": 70,
        "pName": "Lambcasing",
        "pDescription": "Roe - White Fish",
        "pQuantity": 37,
        "pWeightType": "Kg"
      }, {
        "pId": 71,
        "pName": "Wine - Fontanafredda Barolo",
        "pDescription": "Chocolate - White",
        "pQuantity": 57,
        "pWeightType": "Kg"
      }, {
        "pId": 72,
        "pName": "Cheese Cheddar Processed",
        "pDescription": "Mushroom - Portebello",
        "pQuantity": 89,
        "pWeightType": "Kg"
      }, {
        "pId": 73,
        "pName": "Nut - Pumpkin Seeds",
        "pDescription": "Easy Off Oven Cleaner",
        "pQuantity": 31,
        "pWeightType": "Kg"
      }, {
        "pId": 74,
        "pName": "Nestea - Iced Tea",
        "pDescription": "Wine - Ej Gallo Sierra Valley",
        "pQuantity": 100,
        "pWeightType": "Bulto"
      }, {
        "pId": 75,
        "pName": "Lemonade - Natural, 591 Ml",
        "pDescription": "Appetizer - Crab And Brie",
        "pQuantity": 21,
        "pWeightType": "Bulto"
      }, {
        "pId": 76,
        "pName": "Ice Cream - Turtles Stick Bar",
        "pDescription": "Flour - Buckwheat, Dark",
        "pQuantity": 18,
        "pWeightType": "Kg"
      }, {
        "pId": 77,
        "pName": "Parsley - Fresh",
        "pDescription": "Scallops - Live In Shell",
        "pQuantity": 11,
        "pWeightType": "Kg"
      }, {
        "pId": 78,
        "pName": "Pasta - Fusili Tri - Coloured",
        "pDescription": "Water Chestnut - Canned",
        "pQuantity": 74,
        "pWeightType": "Kg"
      }, {
        "pId": 79,
        "pName": "Soup - Chicken And Wild Rice",
        "pDescription": "Beef - Tenderloin Tails",
        "pQuantity": 49,
        "pWeightType": "Bulto"
      }, {
        "pId": 80,
        "pName": "Green Scrubbie Pad H.duty",
        "pDescription": "Leeks - Large",
        "pQuantity": 10,
        "pWeightType": "Bulto"
      }, {
        "pId": 81,
        "pName": "Energy Drink - Franks Pineapple",
        "pDescription": "Wine - Sawmill Creek Autumn",
        "pQuantity": 74,
        "pWeightType": "Bulto"
      }, {
        "pId": 82,
        "pName": "Energy - Boo - Koo",
        "pDescription": "Coffee - French Vanilla Frothy",
        "pQuantity": 18,
        "pWeightType": "Kg"
      }, {
        "pId": 83,
        "pName": "Cinnamon - Stick",
        "pDescription": "Milk - Buttermilk",
        "pQuantity": 16,
        "pWeightType": "Bulto"
      }, {
        "pId": 84,
        "pName": "Pepper - Paprika, Spanish",
        "pDescription": "Wiberg Super Cure",
        "pQuantity": 74,
        "pWeightType": "Kg"
      }, {
        "pId": 85,
        "pName": "Island Oasis - Peach Daiquiri",
        "pDescription": "Bread Ww Cluster",
        "pQuantity": 40,
        "pWeightType": "Bulto"
      }, {
        "pId": 86,
        "pName": "Energy Drink Red Bull",
        "pDescription": "Pasta - Angel Hair",
        "pQuantity": 94,
        "pWeightType": "Kg"
      }, {
        "pId": 87,
        "pName": "Red Snapper - Fillet, Skin On",
        "pDescription": "Turkey Leg With Drum And Thigh",
        "pQuantity": 17,
        "pWeightType": "Kg"
      }, {
        "pId": 88,
        "pName": "Tahini Paste",
        "pDescription": "Sausage - Blood Pudding",
        "pQuantity": 64,
        "pWeightType": "Bulto"
      }, {
        "pId": 89,
        "pName": "Cape Capensis - Fillet",
        "pDescription": "Hagen Daza - Dk Choocolate",
        "pQuantity": 15,
        "pWeightType": "Bulto"
      }, {
        "pId": 90,
        "pName": "Caviar - Salmon",
        "pDescription": "Energy Drink - Redbull 355ml",
        "pQuantity": 98,
        "pWeightType": "Bulto"
      }, {
        "pId": 91,
        "pName": "Wine - Chianti Classica Docg",
        "pDescription": "Cheese - Fontina",
        "pQuantity": 66,
        "pWeightType": "Bulto"
      }, {
        "pId": 92,
        "pName": "Beer - Blue Light",
        "pDescription": "Steampan - Lid For Half Size",
        "pQuantity": 44,
        "pWeightType": "Kg"
      }, {
        "pId": 93,
        "pName": "Olives - Black, Pitted",
        "pDescription": "Chocolate - Compound Coating",
        "pQuantity": 92,
        "pWeightType": "Kg"
      }, {
        "pId": 94,
        "pName": "Sprouts - Bean",
        "pDescription": "Sun - Dried Tomatoes",
        "pQuantity": 97,
        "pWeightType": "Bulto"
      }, {
        "pId": 95,
        "pName": "Muffin - Zero Transfat",
        "pDescription": "Canada Dry",
        "pQuantity": 51,
        "pWeightType": "Kg"
      }, {
        "pId": 96,
        "pName": "Pork Loin Cutlets",
        "pDescription": "Corn - On The Cob",
        "pQuantity": 54,
        "pWeightType": "Bulto"
      }, {
        "pId": 97,
        "pName": "Wine - Merlot Vina Carmen",
        "pDescription": "Bread - Malt",
        "pQuantity": 50,
        "pWeightType": "Bulto"
      }, {
        "pId": 98,
        "pName": "Soup - Campbells - Tomato",
        "pDescription": "Tray - 12in Rnd Blk",
        "pQuantity": 42,
        "pWeightType": "Kg"
      }, {
        "pId": 99,
        "pName": "Chocolate - Semi Sweet",
        "pDescription": "Blouse / Shirt / Sweater",
        "pQuantity": 33,
        "pWeightType": "Bulto"
      }, {
        "pId": 100,
        "pName": "Mix - Cocktail Strawberry Daiquiri",
        "pDescription": "Eggplant Oriental",
        "pQuantity": 54,
        "pWeightType": "Bulto"
      }];
      

      const [ProductData,setProductData]=useState(product_data);

      const transaction_data=[
        { tId:1, tpId:1, date:'12/24/2021', vId:1, purchaseInvoiceId:1, purchaseWeight:23, purchasePrice:4322, saleInvoiceId: null, saleWeight:null, salePrice:null},
        { tId:2, tpId:1, date:'12/29/2021', vId:1, purchaseInvoiceId:12, purchaseWeight:44, purchasePrice:4322, saleInvoiceId: null, saleWeight:null, salePrice:null},
        { tId:3, tpId:1, date:'12/31/2021', vId:null, purchaseInvoiceId:null, purchaseWeight:null, purchasePrice:null, saleInvoiceId: 244, saleWeight:67, salePrice:5000},
      ]

      const [TransactionData, setTransactionData]=useState(transaction_data);

      const vendor_data=/*[
        {vId: 1, vName:'Chisemex', vRFC:'MELM8305281H0', vNumOfTransactions:32, vAddress:'N/A'},
        {vId: 2, vName:'Distribuidora De Productos Deshidratados SA de CV', vRFC:'JEFC8305281H0', vNumOfTransactions:12, vAddress:'N/A'},
        {vId: 3, vName:'Alfredo Lopez', vRFC:'LANJ8305281H0', vNumOfTransactions:94, vAddress:'Calera de Victor Rosales Zacatecas'},
      ]*/
      [{
        "vId": 1,
        "vName": "Reynolds-Nitzsche",
        "vRFC": "151.239.86.85",
        "vNumOfTransactions": 75,
        "vAddress": "987 Prairieview Junction"
      }, {
        "vId": 2,
        "vName": "Jacobs-Koelpin",
        "vRFC": "50.165.34.44",
        "vNumOfTransactions": 98,
        "vAddress": "5354 Gina Road"
      }, {
        "vId": 3,
        "vName": "Streich, Mohr and Hammes",
        "vRFC": "30.54.158.26",
        "vNumOfTransactions": 83,
        "vAddress": "6569 Kenwood Parkway"
      }, {
        "vId": 4,
        "vName": "Metz-Simonis",
        "vRFC": "180.212.220.13",
        "vNumOfTransactions": 5,
        "vAddress": "8536 Memorial Road"
      }, {
        "vId": 5,
        "vName": "Pagac-Turcotte",
        "vRFC": "148.17.248.243",
        "vNumOfTransactions": 86,
        "vAddress": "94 Esker Drive"
      }, {
        "vId": 6,
        "vName": "Swift Inc",
        "vRFC": "172.122.121.177",
        "vNumOfTransactions": 53,
        "vAddress": "743 Weeping Birch Alley"
      }, {
        "vId": 7,
        "vName": "Blanda LLC",
        "vRFC": "250.98.190.181",
        "vNumOfTransactions": 81,
        "vAddress": "8077 Granby Terrace"
      }, {
        "vId": 8,
        "vName": "Kautzer-Block",
        "vRFC": "214.237.0.86",
        "vNumOfTransactions": 58,
        "vAddress": "9490 Warbler Pass"
      }, {
        "vId": 9,
        "vName": "Ryan, Kozey and Frami",
        "vRFC": "140.13.255.187",
        "vNumOfTransactions": 81,
        "vAddress": "81558 Almo Alley"
      }, {
        "vId": 10,
        "vName": "Wintheiser Group",
        "vRFC": "237.15.253.29",
        "vNumOfTransactions": 3,
        "vAddress": "4121 Bluestem Court"
      }, {
        "vId": 11,
        "vName": "McLaughlin and Sons",
        "vRFC": "96.137.70.127",
        "vNumOfTransactions": 90,
        "vAddress": "65548 Twin Pines Hill"
      }, {
        "vId": 12,
        "vName": "Cormier, Heidenreich and Ernser",
        "vRFC": "181.127.187.209",
        "vNumOfTransactions": 54,
        "vAddress": "0732 Pond Hill"
      }, {
        "vId": 13,
        "vName": "Gottlieb Group",
        "vRFC": "129.90.10.115",
        "vNumOfTransactions": 18,
        "vAddress": "74 Homewood Crossing"
      }, {
        "vId": 14,
        "vName": "O'Hara-Wiegand",
        "vRFC": "251.141.84.143",
        "vNumOfTransactions": 7,
        "vAddress": "5 Russell Terrace"
      }, {
        "vId": 15,
        "vName": "Prosacco and Sons",
        "vRFC": "40.184.243.68",
        "vNumOfTransactions": 12,
        "vAddress": "53 Talisman Road"
      }, {
        "vId": 16,
        "vName": "Morissette LLC",
        "vRFC": "166.53.117.233",
        "vNumOfTransactions": 50,
        "vAddress": "29 Cordelia Avenue"
      }, {
        "vId": 17,
        "vName": "Emard-Hessel",
        "vRFC": "247.135.195.255",
        "vNumOfTransactions": 7,
        "vAddress": "1 Summerview Parkway"
      }, {
        "vId": 18,
        "vName": "Nolan-Hilll",
        "vRFC": "207.217.129.118",
        "vNumOfTransactions": 88,
        "vAddress": "59 Mcguire Terrace"
      }, {
        "vId": 19,
        "vName": "Parisian Group",
        "vRFC": "225.224.225.28",
        "vNumOfTransactions": 83,
        "vAddress": "641 Macpherson Plaza"
      }, {
        "vId": 20,
        "vName": "McGlynn-Schinner",
        "vRFC": "191.116.214.54",
        "vNumOfTransactions": 42,
        "vAddress": "8 Main Way"
      }, {
        "vId": 21,
        "vName": "Kunde, Hilpert and Armstrong",
        "vRFC": "28.48.48.35",
        "vNumOfTransactions": 57,
        "vAddress": "9 Straubel Place"
      }, {
        "vId": 22,
        "vName": "Nitzsche Group",
        "vRFC": "99.184.125.80",
        "vNumOfTransactions": 40,
        "vAddress": "760 Heath Center"
      }, {
        "vId": 23,
        "vName": "Lind LLC",
        "vRFC": "187.89.3.27",
        "vNumOfTransactions": 58,
        "vAddress": "36 2nd Center"
      }, {
        "vId": 24,
        "vName": "Abshire-Rowe",
        "vRFC": "26.150.197.226",
        "vNumOfTransactions": 55,
        "vAddress": "340 Troy Court"
      }, {
        "vId": 25,
        "vName": "Dietrich, Labadie and Wunsch",
        "vRFC": "116.198.209.96",
        "vNumOfTransactions": 99,
        "vAddress": "3888 Fordem Crossing"
      }, {
        "vId": 26,
        "vName": "Block, Hessel and Sporer",
        "vRFC": "171.170.18.67",
        "vNumOfTransactions": 30,
        "vAddress": "5165 Holy Cross Plaza"
      }, {
        "vId": 27,
        "vName": "Davis-Jenkins",
        "vRFC": "131.18.86.203",
        "vNumOfTransactions": 32,
        "vAddress": "21257 Hoard Crossing"
      }, {
        "vId": 28,
        "vName": "McGlynn, Kuhlman and Kerluke",
        "vRFC": "77.204.188.11",
        "vNumOfTransactions": 57,
        "vAddress": "0721 Blue Bill Park Alley"
      }, {
        "vId": 29,
        "vName": "Sipes, Powlowski and Dach",
        "vRFC": "117.245.240.84",
        "vNumOfTransactions": 27,
        "vAddress": "39397 Spohn Drive"
      }, {
        "vId": 30,
        "vName": "Williamson and Sons",
        "vRFC": "119.92.41.88",
        "vNumOfTransactions": 76,
        "vAddress": "5 Arkansas Way"
      }, {
        "vId": 31,
        "vName": "Price Inc",
        "vRFC": "186.135.10.37",
        "vNumOfTransactions": 43,
        "vAddress": "0473 Walton Street"
      }, {
        "vId": 32,
        "vName": "Mitchell and Sons",
        "vRFC": "212.174.52.51",
        "vNumOfTransactions": 82,
        "vAddress": "1 Red Cloud Parkway"
      }, {
        "vId": 33,
        "vName": "Spencer-Konopelski",
        "vRFC": "89.159.232.220",
        "vNumOfTransactions": 90,
        "vAddress": "6 Arizona Way"
      }, {
        "vId": 34,
        "vName": "Runolfsdottir-Schiller",
        "vRFC": "111.243.128.213",
        "vNumOfTransactions": 61,
        "vAddress": "7 Raven Point"
      }, {
        "vId": 35,
        "vName": "Kreiger, Friesen and Zulauf",
        "vRFC": "144.102.149.245",
        "vNumOfTransactions": 9,
        "vAddress": "727 Farwell Street"
      }, {
        "vId": 36,
        "vName": "Parisian-Muller",
        "vRFC": "97.156.166.137",
        "vNumOfTransactions": 37,
        "vAddress": "72986 Grover Plaza"
      }, {
        "vId": 37,
        "vName": "Bode Inc",
        "vRFC": "179.67.139.1",
        "vNumOfTransactions": 7,
        "vAddress": "1398 Judy Place"
      }, {
        "vId": 38,
        "vName": "Gorczany-Ortiz",
        "vRFC": "183.68.242.184",
        "vNumOfTransactions": 52,
        "vAddress": "9406 Shopko Drive"
      }, {
        "vId": 39,
        "vName": "Schroeder-Dach",
        "vRFC": "65.26.176.7",
        "vNumOfTransactions": 100,
        "vAddress": "89201 Lindbergh Terrace"
      }, {
        "vId": 40,
        "vName": "Dooley-Terry",
        "vRFC": "246.14.132.13",
        "vNumOfTransactions": 61,
        "vAddress": "94 Marquette Point"
      }, {
        "vId": 41,
        "vName": "Larkin-Beahan",
        "vRFC": "89.155.184.197",
        "vNumOfTransactions": 62,
        "vAddress": "954 Kenwood Junction"
      }, {
        "vId": 42,
        "vName": "Schmeler, Hills and Terry",
        "vRFC": "53.103.221.223",
        "vNumOfTransactions": 65,
        "vAddress": "75597 Memorial Plaza"
      }, {
        "vId": 43,
        "vName": "Collins-Parker",
        "vRFC": "41.238.64.201",
        "vNumOfTransactions": 19,
        "vAddress": "3178 Arapahoe Way"
      }, {
        "vId": 44,
        "vName": "Greenholt Inc",
        "vRFC": "156.24.253.141",
        "vNumOfTransactions": 86,
        "vAddress": "4 Schlimgen Parkway"
      }, {
        "vId": 45,
        "vName": "Kilback Inc",
        "vRFC": "238.9.248.61",
        "vNumOfTransactions": 74,
        "vAddress": "9 Swallow Way"
      }, {
        "vId": 46,
        "vName": "Veum-Hartmann",
        "vRFC": "166.29.225.12",
        "vNumOfTransactions": 12,
        "vAddress": "43094 Becker Junction"
      }, {
        "vId": 47,
        "vName": "Harris, Rath and Gibson",
        "vRFC": "231.149.217.228",
        "vNumOfTransactions": 65,
        "vAddress": "12 Nobel Hill"
      }, {
        "vId": 48,
        "vName": "Sawayn, Rowe and Rohan",
        "vRFC": "36.168.106.149",
        "vNumOfTransactions": 91,
        "vAddress": "74597 Basil Lane"
      }, {
        "vId": 49,
        "vName": "Russel and Sons",
        "vRFC": "215.62.174.205",
        "vNumOfTransactions": 20,
        "vAddress": "949 Lighthouse Bay Junction"
      }, {
        "vId": 50,
        "vName": "Predovic-Farrell",
        "vRFC": "98.119.165.241",
        "vNumOfTransactions": 6,
        "vAddress": "528 Karstens Pass"
      }, {
        "vId": 51,
        "vName": "Oberbrunner Inc",
        "vRFC": "112.54.113.157",
        "vNumOfTransactions": 65,
        "vAddress": "0302 Hazelcrest Pass"
      }, {
        "vId": 52,
        "vName": "Monahan Inc",
        "vRFC": "248.119.182.188",
        "vNumOfTransactions": 76,
        "vAddress": "067 Manitowish Alley"
      }, {
        "vId": 53,
        "vName": "Hilpert-Sanford",
        "vRFC": "180.29.134.104",
        "vNumOfTransactions": 10,
        "vAddress": "1337 Southridge Circle"
      }, {
        "vId": 54,
        "vName": "Batz-Leffler",
        "vRFC": "160.118.201.51",
        "vNumOfTransactions": 39,
        "vAddress": "812 Lawn Lane"
      }, {
        "vId": 55,
        "vName": "Ebert Inc",
        "vRFC": "246.55.86.88",
        "vNumOfTransactions": 27,
        "vAddress": "36770 Continental Street"
      }, {
        "vId": 56,
        "vName": "Okuneva-Jacobs",
        "vRFC": "168.9.227.242",
        "vNumOfTransactions": 40,
        "vAddress": "5407 Grim Crossing"
      }, {
        "vId": 57,
        "vName": "Monahan-Daniel",
        "vRFC": "169.188.219.202",
        "vNumOfTransactions": 75,
        "vAddress": "95 Union Lane"
      }, {
        "vId": 58,
        "vName": "Skiles, Lehner and Streich",
        "vRFC": "0.83.248.4",
        "vNumOfTransactions": 21,
        "vAddress": "9 Ohio Circle"
      }, {
        "vId": 59,
        "vName": "Green-Kuhic",
        "vRFC": "84.45.223.111",
        "vNumOfTransactions": 81,
        "vAddress": "077 Buhler Drive"
      }, {
        "vId": 60,
        "vName": "Smitham and Sons",
        "vRFC": "98.189.15.115",
        "vNumOfTransactions": 20,
        "vAddress": "3662 Grayhawk Center"
      }, {
        "vId": 61,
        "vName": "Funk and Sons",
        "vRFC": "142.208.115.94",
        "vNumOfTransactions": 75,
        "vAddress": "5 Anniversary Place"
      }, {
        "vId": 62,
        "vName": "Rowe-Jacobson",
        "vRFC": "170.108.102.205",
        "vNumOfTransactions": 92,
        "vAddress": "81403 Manufacturers Point"
      }, {
        "vId": 63,
        "vName": "Satterfield LLC",
        "vRFC": "254.43.150.6",
        "vNumOfTransactions": 78,
        "vAddress": "413 Burning Wood Street"
      }, {
        "vId": 64,
        "vName": "Walker, Auer and Waelchi",
        "vRFC": "193.221.247.11",
        "vNumOfTransactions": 77,
        "vAddress": "4858 Upham Street"
      }, {
        "vId": 65,
        "vName": "Prosacco, Roob and Adams",
        "vRFC": "155.58.62.139",
        "vNumOfTransactions": 12,
        "vAddress": "54526 Amoth Crossing"
      }, {
        "vId": 66,
        "vName": "Rogahn, Lubowitz and Ankunding",
        "vRFC": "3.188.10.222",
        "vNumOfTransactions": 33,
        "vAddress": "73 Birchwood Pass"
      }, {
        "vId": 67,
        "vName": "Cruickshank Group",
        "vRFC": "186.91.40.24",
        "vNumOfTransactions": 11,
        "vAddress": "9432 Towne Trail"
      }, {
        "vId": 68,
        "vName": "Hamill and Sons",
        "vRFC": "233.212.90.135",
        "vNumOfTransactions": 100,
        "vAddress": "7 Sherman Parkway"
      }, {
        "vId": 69,
        "vName": "Powlowski-Heathcote",
        "vRFC": "108.225.130.121",
        "vNumOfTransactions": 92,
        "vAddress": "6 Rieder Parkway"
      }, {
        "vId": 70,
        "vName": "Bailey-Mante",
        "vRFC": "194.137.57.13",
        "vNumOfTransactions": 59,
        "vAddress": "768 Buhler Center"
      }, {
        "vId": 71,
        "vName": "Rau and Sons",
        "vRFC": "216.169.181.199",
        "vNumOfTransactions": 54,
        "vAddress": "3758 Bultman Point"
      }, {
        "vId": 72,
        "vName": "Adams Inc",
        "vRFC": "171.28.225.159",
        "vNumOfTransactions": 43,
        "vAddress": "2804 Ryan Plaza"
      }, {
        "vId": 73,
        "vName": "Lowe-Okuneva",
        "vRFC": "122.140.46.62",
        "vNumOfTransactions": 75,
        "vAddress": "6111 New Castle Junction"
      }, {
        "vId": 74,
        "vName": "Thiel Inc",
        "vRFC": "225.126.125.97",
        "vNumOfTransactions": 48,
        "vAddress": "878 Maple Wood Center"
      }, {
        "vId": 75,
        "vName": "Conn, Schuppe and Erdman",
        "vRFC": "119.245.231.187",
        "vNumOfTransactions": 23,
        "vAddress": "6 East Court"
      }, {
        "vId": 76,
        "vName": "Wehner-Schinner",
        "vRFC": "125.6.41.222",
        "vNumOfTransactions": 96,
        "vAddress": "091 Leroy Crossing"
      }, {
        "vId": 77,
        "vName": "Ratke-Cole",
        "vRFC": "174.203.255.90",
        "vNumOfTransactions": 43,
        "vAddress": "85685 Montana Trail"
      }, {
        "vId": 78,
        "vName": "Leffler LLC",
        "vRFC": "32.59.120.196",
        "vNumOfTransactions": 59,
        "vAddress": "55485 Prairieview Alley"
      }, {
        "vId": 79,
        "vName": "Mayer-McClure",
        "vRFC": "73.69.162.19",
        "vNumOfTransactions": 94,
        "vAddress": "23388 Londonderry Place"
      }, {
        "vId": 80,
        "vName": "Hills-Gottlieb",
        "vRFC": "58.213.221.69",
        "vNumOfTransactions": 9,
        "vAddress": "42 Bay Road"
      }, {
        "vId": 81,
        "vName": "Friesen Group",
        "vRFC": "68.163.237.156",
        "vNumOfTransactions": 33,
        "vAddress": "1 Delladonna Parkway"
      }, {
        "vId": 82,
        "vName": "Emard, Dach and Treutel",
        "vRFC": "213.185.159.180",
        "vNumOfTransactions": 24,
        "vAddress": "6 Browning Plaza"
      }, {
        "vId": 83,
        "vName": "Schuster Inc",
        "vRFC": "229.240.49.42",
        "vNumOfTransactions": 5,
        "vAddress": "24 Trailsway Street"
      }, {
        "vId": 84,
        "vName": "Deckow, Simonis and Zulauf",
        "vRFC": "20.250.165.82",
        "vNumOfTransactions": 56,
        "vAddress": "6 Acker Trail"
      }, {
        "vId": 85,
        "vName": "Cassin Inc",
        "vRFC": "108.144.190.131",
        "vNumOfTransactions": 77,
        "vAddress": "58 Veith Crossing"
      }, {
        "vId": 86,
        "vName": "Hackett-Block",
        "vRFC": "144.157.43.96",
        "vNumOfTransactions": 49,
        "vAddress": "7 Toban Trail"
      }, {
        "vId": 87,
        "vName": "Pollich-Langworth",
        "vRFC": "196.24.35.240",
        "vNumOfTransactions": 34,
        "vAddress": "7 Harper Terrace"
      }, {
        "vId": 88,
        "vName": "Kovacek Inc",
        "vRFC": "180.210.149.105",
        "vNumOfTransactions": 19,
        "vAddress": "6 Macpherson Road"
      }, {
        "vId": 89,
        "vName": "O'Kon and Sons",
        "vRFC": "103.173.39.5",
        "vNumOfTransactions": 11,
        "vAddress": "1186 Merrick Avenue"
      }, {
        "vId": 90,
        "vName": "Tromp, Mills and McKenzie",
        "vRFC": "197.51.98.25",
        "vNumOfTransactions": 68,
        "vAddress": "0 Coolidge Point"
      }, {
        "vId": 91,
        "vName": "Gerlach and Sons",
        "vRFC": "186.3.27.94",
        "vNumOfTransactions": 5,
        "vAddress": "9 2nd Point"
      }, {
        "vId": 92,
        "vName": "Heidenreich-Pfannerstill",
        "vRFC": "161.53.11.108",
        "vNumOfTransactions": 27,
        "vAddress": "7898 Talmadge Trail"
      }, {
        "vId": 93,
        "vName": "Treutel, Aufderhar and Lebsack",
        "vRFC": "211.191.4.133",
        "vNumOfTransactions": 79,
        "vAddress": "47423 Delaware Drive"
      }, {
        "vId": 94,
        "vName": "O'Reilly, Waelchi and Rogahn",
        "vRFC": "193.198.71.54",
        "vNumOfTransactions": 4,
        "vAddress": "555 Emmet Hill"
      }, {
        "vId": 95,
        "vName": "Lind, Bauch and Brekke",
        "vRFC": "6.214.105.12",
        "vNumOfTransactions": 93,
        "vAddress": "40239 Dwight Circle"
      }, {
        "vId": 96,
        "vName": "Nolan Inc",
        "vRFC": "63.44.128.81",
        "vNumOfTransactions": 66,
        "vAddress": "12062 Corben Park"
      }, {
        "vId": 97,
        "vName": "Homenick and Sons",
        "vRFC": "103.176.141.93",
        "vNumOfTransactions": 90,
        "vAddress": "332 Crest Line Point"
      }, {
        "vId": 98,
        "vName": "Walsh Group",
        "vRFC": "0.100.198.92",
        "vNumOfTransactions": 66,
        "vAddress": "63 Bultman Circle"
      }, {
        "vId": 99,
        "vName": "Trantow, Schultz and Keeling",
        "vRFC": "142.217.235.239",
        "vNumOfTransactions": 49,
        "vAddress": "81 Lerdahl Terrace"
      }, {
        "vId": 100,
        "vName": "Renner LLC",
        "vRFC": "39.175.106.15",
        "vNumOfTransactions": 8,
        "vAddress": "5 Morning Drive"
      }]
      
    
    
     // const [data,setData]=useState(product_data);
      const [VendorData, setVendorData]=useState(vendor_data);

      return (
          <DataContext.Provider value ={[[ProductData,setProductData], [TransactionData, setTransactionData],[VendorData, setVendorData]]}>
              {children}
          </DataContext.Provider>
      );
};

export const useStateContext= () => useContext(DataContext);


