# Woolies Bill Splitter

This userscript enhances your experience on the Woolworths website by adding functionality to split bills easily. 

![image](https://github.com/user-attachments/assets/1fa93ca7-d0ee-4c23-94e0-c8d1e9fd2643)


## Features

- **Easy Item Selection**: Large, intuitive selection buttons make it simple to choose items to include in your split bill calculation.
- **Quantity Input**: Adjust the quantity for each selected item, reflecting the share of the item that you are splitting.
- **Dynamic Calculation**: Automatically calculates and displays the total cost of the selected items and quantities in real time.
- **Toggle Half Portions**: For single items, easily toggle between full and half quantities with a dedicated button.
- **Responsive Design**: Works on both desktop and mobile views of the Woolworths orders page.


## Installation

1. **Install Tampermonkey**: If not already installed, add the Tampermonkey extension to your browser. Tampermonkey is available for Chrome, Firefox, Safari, and other major browsers.
   - [Tampermonkey for Chrome](https://tampermonkey.net/?ext=dhdg&browser=chrome)
   - [Tampermonkey for Firefox](https://tampermonkey.net/?ext=dhdg&browser=firefox)
   - [Tampermonkey for Safari](https://tampermonkey.net/?ext=dhdg&browser=safari)

2. **Install the Script**: 
   - Open Tampermonkey in your browser and click on "Create a new script".
   - Delete the default template that appears.
   - Copy and paste the entire code provided here into the new script window.
   - Save the script by clicking on the disk icon or pressing `Ctrl + S`.

3. **Usage**: Navigate to the "My Orders" section of your Woolworths account. The script will automatically add checkboxes, quantity inputs, and the total calculation display to your order items.

## How It Works

The script automatically detects the items listed in your Woolworths orders. For each item:
- A checkbox is added to select the item.
- A quantity input field is added next to each item, initially disabled and set to zero.
- If an item's quantity is one, a "Just Half" button is also provided to quickly select half of that item.

As you select items and adjust quantities, the script calculates the total price for the selected share and displays it in a fixed position at the bottom right of the page.

## Compatibility

This script is designed to work with the specific URL structure of Woolworths' "My Orders" section (`https://www.woolworths.com.au/shop/myaccount/myorders/*`). It may not work if the website's structure is changed or updated.

## Contribution

Contributions are welcome. If you have any suggestions or improvements, feel free to fork this repository and submit a pull request.

## License

This project is open-source and available under the MIT License.

## Disclaimer

This script, "Woolies Bill Splitter," is provided for educational and communication purposes only and is not affiliated with, authorized, or sponsored by Woolworths Corporation. It is independently developed and does not reflect the views or policies of Woolworths.
The author makes no warranties regarding the accuracy, reliability, or suitability of this script and shall not be held liable for any outcomes resulting from its use. Users assume all risks associated with the operation of this script.
Please comply with all applicable laws and regulations, and respect the terms of use of Woolworths' website when using this script.
