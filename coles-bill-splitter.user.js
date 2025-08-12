// ==UserScript==
// @name         Coles Bill Splitter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add checkboxes to Coles order items to calculate shared costs, handling substitutions
// @author       lemontea
// @match        https://www.coles.com.au/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CSS for improved UI
    const addStyles = () => {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .bill-splitter-container {
                display: flex;
                align-items: center;
                background-color: #f8f9fa;
                border-radius: 6px;
                padding: 6px 10px;
                margin: 8px 0;
            }
            .bill-splitter-select-btn {
                min-width: 90px;
                height: 34px;
                margin: 0 10px;
                padding: 2px 10px;
                border: 2px solid #E01A22;
                border-radius: 6px;
                background-color: white;
                color: #E01A22;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .bill-splitter-select-btn.selected {
                background-color: #E01A22;
                color: white;
            }
            .bill-splitter-qty-input {
                width: 60px;
                height: 28px;
                margin: 0 10px;
                padding: 2px 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                text-align: center;
            }
            .bill-splitter-half-btn {
                background-color: #f0f0f0;
                color: #333;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 5px 10px;
                margin: 0 10px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }
            .bill-splitter-half-btn.active {
                background-color: #E01A22;
                color: white;
                border-color: #E01A22;
            }
            .bill-splitter-half-btn:hover {
                background-color: #e0e0e0;
            }
            .bill-splitter-half-btn.active:hover {
                background-color: #B9091D;
            }
            .bill-splitter-total-display {
                position: fixed;
                bottom: 120px;
                right: 20px;
                background-color: #E01A22;
                color: white;
                border-radius: 8px;
                padding: 12px 20px;
                font-size: 18px;
                font-weight: bold;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 9999;
            }
            .bill-splitter-price {
                font-weight: bold;
                margin: 0 10px;
            }
            .bill-splitter-disabled {
                opacity: 0.5;
            }
            /* Float Coles savings badges above their normal position - only in order items */
            .coles-targeting-ProductListStyledProductList .coles-targeting-ProductInTrolleyStyledProductPricingView {
                position: relative;
            }
            .coles-targeting-ProductListStyledProductList .coles-targeting-BadgeBadgeWrapper[type="savings"] {
                position: absolute;
                z-index: 50;
                top: -10px;
                right: 0;
            }
        `;
        document.head.appendChild(styleSheet);
    };

    // Function to add buttons and calculate the total
    function setupItems() {
        document.querySelectorAll('[data-testid^="trolley-productItem-"]').forEach((item, index) => {
            if (!item.querySelector('.bill-splitter-container')) {
                const priceElement = getPriceElement(item);
                const qtyElement = item.querySelector('[data-testid="product_in_trolley__quantity"]');
                if (!qtyElement || !priceElement) return;

                const qtyText = qtyElement.textContent.trim();
                const totalQty = parseInt(qtyText.replace('Quantity: ', ''));

                const container = document.createElement('div');
                container.className = 'bill-splitter-container';

                // Create selection button instead of checkbox
                const selectButton = document.createElement('button');
                selectButton.id = 'select-btn-' + index;
                selectButton.className = 'bill-splitter-select-btn';
                selectButton.textContent = 'Select';
                selectButton.dataset.selected = 'false';

                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.value = 0;
                quantityInput.min = 0;
                quantityInput.max = totalQty;
                quantityInput.step = "0.5";
                quantityInput.id = 'quantity' + index;
                quantityInput.className = 'bill-splitter-qty-input bill-splitter-disabled';
                quantityInput.disabled = true;

                const priceClone = document.createElement('span');
                priceClone.className = 'bill-splitter-price';
                priceClone.textContent = priceElement.textContent.trim();

                quantityInput.onchange = () => {
                    if (parseFloat(quantityInput.value) > totalQty) {
                        quantityInput.value = totalQty;
                    }

                    // Update half button state based on the quantity
                    const halfButton = document.getElementById('half-btn-' + index);
                    if (halfButton) {
                        if (parseFloat(quantityInput.value) === 0.5) {
                            halfButton.classList.add('active');
                        } else {
                            halfButton.classList.remove('active');
                        }
                    }

                    calculateTotal();
                };

                selectButton.onclick = () => {
                    const isSelected = selectButton.dataset.selected === 'true';
                    if (!isSelected) {
                        selectButton.dataset.selected = 'true';
                        selectButton.classList.add('selected');
                        selectButton.textContent = 'Selected';
                        quantityInput.disabled = false;
                        quantityInput.value = totalQty;
                        quantityInput.classList.remove('bill-splitter-disabled');

                        // Update half button state
                        const halfButton = document.getElementById('half-btn-' + index);
                        if (halfButton) {
                            halfButton.classList.remove('active');
                        }
                    } else {
                        selectButton.dataset.selected = 'false';
                        selectButton.classList.remove('selected');
                        selectButton.textContent = 'Select';
                        quantityInput.disabled = true;
                        quantityInput.value = 0;
                        quantityInput.classList.add('bill-splitter-disabled');

                        // Update half button state
                        const halfButton = document.getElementById('half-btn-' + index);
                        if (halfButton) {
                            halfButton.classList.remove('active');
                        }
                    }
                    calculateTotal();
                };

                if (totalQty === 1) {
                    const halfButton = document.createElement('button');
                    halfButton.textContent = '½';
                    halfButton.className = 'bill-splitter-half-btn';
                    halfButton.id = 'half-btn-' + index;
                    halfButton.dataset.halfActive = 'false';

                    halfButton.onclick = (e) => {
                        e.preventDefault();
                        const isHalfActive = halfButton.dataset.halfActive === 'true';

                        if (!isHalfActive) {
                            // Activate half selection
                            halfButton.dataset.halfActive = 'true';
                            halfButton.classList.add('active');

                            // Select the item and set to half
                            selectButton.dataset.selected = 'true';
                            selectButton.classList.add('selected');
                            selectButton.textContent = 'Selected';
                            quantityInput.disabled = false;
                            quantityInput.classList.remove('bill-splitter-disabled');
                            quantityInput.value = 0.5;
                        } else {
                            // Deactivate half selection
                            halfButton.dataset.halfActive = 'false';
                            halfButton.classList.remove('active');

                            // Return to full quantity
                            quantityInput.value = totalQty;
                        }

                        calculateTotal();
                    };

                    container.appendChild(halfButton);
                }

                container.appendChild(quantityInput);
                container.appendChild(priceClone);
                container.appendChild(selectButton);

                // Insert after the product wrapper
                const productWrapper = item.querySelector('.coles-targeting-ProductInTrolleyProductInfoWrapper');
                if (productWrapper) {
                    productWrapper.parentNode.insertBefore(container, productWrapper.nextSibling);
                }

                // Hide the original price element
                priceElement.style.display = 'none';
            }
        });
    }

    // Function to get the correct price element, considering Coles structure
    function getPriceElement(item) {
        // Look for the main price element with data-testid="product-pricing"
        let priceElement = item.querySelector('[data-testid="product-pricing"]');
        if (!priceElement) {
            // Fallback to class-based selector
            priceElement = item.querySelector('.price__value');
        }
        return priceElement;
    }

    // Function to calculate the total cost of selected items
    function calculateTotal() {
        let total = 0;
        document.querySelectorAll('[data-testid^="trolley-productItem-"]').forEach((item, index) => {
            const selectButton = document.getElementById('select-btn-' + index);
            if (selectButton && selectButton.dataset.selected === 'true') {
                const quantityInput = document.getElementById('quantity' + index);
                const purchasedQty = parseFloat(quantityInput.value);

                const qtyElement = item.querySelector('[data-testid="product_in_trolley__quantity"]');
                if (!qtyElement) return;

                const qtyText = qtyElement.textContent.trim();
                const totalQty = parseInt(qtyText.replace('Quantity: ', ''));

                const priceElement = getPriceElement(item);
                if (!priceElement) return;

                const priceText = priceElement.textContent.trim();
                const price = parseFloat(priceText.replace('$', ''));

                if (totalQty > 0) {
                    const pricePerUnit = price / totalQty;
                    total += pricePerUnit * purchasedQty;
                }
            }
        });
        updateTotalDisplay(total);
    }

    // Function to update the display of the total cost
    function updateTotalDisplay(total) {
        let display = document.getElementById('totalDisplay');
        if (!display) {
            display = document.createElement('div');
            display.id = 'totalDisplay';
            display.className = 'bill-splitter-total-display';
            document.body.appendChild(display);
        }
        display.textContent = 'Total: $' + total.toFixed(2);
    }

    // Initialize the script
    function init() {
        addStyles();
        setupItems();

        // Also set up an interval to check for new items
        setInterval(setupItems, 1000);
    }

    // Observer to monitor changes in the DOM
    const observer = new MutationObserver(function(mutations) {
        if (document.querySelector('[data-testid^="trolley-productItem-"]')) {
            setupItems();
        }
    });

    // Start observing the document with more specific target
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run on page load and DOMContentLoaded to ensure it starts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOMContentLoaded has already fired
        init();
    }

    // Final fallback for completely loaded page
    window.addEventListener('load', init);
})();
