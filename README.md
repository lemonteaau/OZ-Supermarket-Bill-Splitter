# OZ Supermarket Bill Splitter

This userscript collection enhances your experience on major Australian supermarket websites by adding functionality to split bills easily. Currently supports **Woolworths** and **Coles**.


![image](https://github.com/user-attachments/assets/1fa93ca7-d0ee-4c23-94e0-c8d1e9fd2643)
![image](https://github.com/user-attachments/assets/313d0499-2649-465d-8afa-e3996cc95aa1)



## Supported Supermarkets

### 🛒 Woolworths Bill Splitter
- **File**: `woolworths-bill-splitter.user.js`
- **Target**: `https://www.woolworths.com.au/shop/myaccount/myorders/*`

### 🛒 Coles Bill Splitter  
- **File**: `coles-bill-splitter.user.js`
- **Target**: `https://www.coles.com.au/account/orders/*`


## Features

Both versions include the same core functionality:

- **Easy Item Selection**: Large, intuitive selection buttons make it simple to choose items to include in your split bill calculation.
- **Quantity Input**: Adjust the quantity for each selected item, reflecting the share of the item that you are splitting.
- **Dynamic Calculation**: Automatically calculates and displays the total cost of the selected items and quantities in real time.
- **Toggle Half Portions**: For single items, easily toggle between full and half quantities with a dedicated button.
- **Responsive Design**: Works on both desktop and mobile views of the respective supermarket order pages.
- **Brand-Specific Styling**: Each version uses the appropriate supermarket's brand colors and adapts to their unique website structure.

## Installation

1. **Install Tampermonkey**: If not already installed, add the Tampermonkey extension to your browser. Tampermonkey is available for Chrome, Firefox, Safari, and other major browsers.
   - [Tampermonkey for Chrome](https://tampermonkey.net/?ext=dhdg&browser=chrome)
   - [Tampermonkey for Firefox](https://tampermonkey.net/?ext=dhdg&browser=firefox)
   - [Tampermonkey for Safari](https://tampermonkey.net/?ext=dhdg&browser=safari)

2. **Install the Script(s)**: 
   - Open Tampermonkey in your browser and click on "Create a new script".
   - Delete the default template that appears.
   - Copy and paste the entire code from your desired script file:
     - For Woolworths: `woolworths-bill-splitter.user.js`
     - For Coles: `coles-bill-splitter.user.js` 
     - You can install both if you shop at both supermarkets!
   - Save the script by clicking on the disk icon or pressing `Ctrl + S`.

3. **Usage**: 
   - **Woolworths**: Navigate to the "My Orders" section of your Woolworths account
   - **Coles**: Navigate to the "Orders" section of your Coles account
   
   The script will automatically add selection buttons, quantity inputs, and the total calculation display to your order items.

## How It Works

The scripts automatically detect the items listed in your supermarket orders. For each item:
- A selection button is added to select the item.
- A quantity input field is added next to each item, initially disabled and set to zero.
- If an item's quantity is one, a "½" button is provided to quickly toggle between half and full quantity.
- Visual feedback provides clear indication of selected items and halved portions.

As you select items and adjust quantities, the script calculates the total price for the selected share and displays it in a fixed position at the bottom right of the page.


## Contribution

Contributions are welcome! If you have suggestions, improvements, or want to add support for additional Australian supermarkets, feel free to:
- Fork this repository
- Submit a pull request
- Open an issue for discussion

### Adding New Supermarkets
If you'd like to contribute support for other supermarkets (IGA, ALDI, etc.), please follow the adaptation pattern established in the Coles version.

## License

This project is open-source and available under the MIT License.

## Disclaimer

These scripts are provided for educational and convenience purposes only and are not affiliated with, authorized, or sponsored by Woolworths Corporation, Coles Group, or any other supermarket chain. They are independently developed and do not reflect the views or policies of these companies.

The authors make no warranties regarding the accuracy, reliability, or suitability of these scripts and shall not be held liable for any outcomes resulting from their use. Users assume all risks associated with the operation of these scripts.

Please comply with all applicable laws and regulations, and respect the terms of use of the respective supermarket websites when using these scripts. 
