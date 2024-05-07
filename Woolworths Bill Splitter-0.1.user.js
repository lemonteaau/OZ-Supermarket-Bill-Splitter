// ==UserScript==
// @name         Woolworths Bill Splitter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add checkboxes to Woolworths order items to calculate shared costs
// @author       lemontea
// @match        https://www.woolworths.com.au/shop/myaccount/myorders/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Function to add checkboxes and calculate the total
  function setupCheckboxes() {
    document
      .querySelectorAll("wow-my-order-groceries-list-item-v2")
      .forEach((item, index) => {
        if (!item.querySelector('input[type="checkbox"]')) {
          const priceElement = item.querySelector(".price");
          const qtyElement = item
            .querySelector(".item-qty-unit")
            .textContent.trim();
          const totalQty = parseInt(qtyElement.split(" of ")[1]);

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = "checkbox" + index;
          checkbox.style.margin = "0 10px";
          checkbox.style.cursor = "pointer";
          checkbox.style.transform = "scale(1.5)";

          const quantityInput = document.createElement("input");
          quantityInput.type = "number";
          quantityInput.value = 0;
          quantityInput.min = 0;
          quantityInput.max = totalQty;
          quantityInput.id = "quantity" + index;
          quantityInput.style.width = "50px";
          quantityInput.style.margin = "0 10px";
          quantityInput.disabled = true;

          quantityInput.onchange = () => {
            calculateTotal();
          };

          checkbox.onchange = () => {
            if (checkbox.checked) {
              quantityInput.disabled = false;
              quantityInput.value = totalQty;
            } else {
              quantityInput.disabled = true;
              quantityInput.value = 0;
            }
            calculateTotal();
          };

          const container = document.createElement("div");
          container.style.display = "flex";
          container.style.alignItems = "center";

          if (totalQty === 1) {
            const halfButton = document.createElement("button");
            halfButton.textContent = "Just Half";
            halfButton.style.margin = "0 10px";
            halfButton.onclick = () => {
              quantityInput.value = 0.5;
              calculateTotal();
            };

            container.appendChild(halfButton);
          }

          container.appendChild(quantityInput);
          container.appendChild(priceElement.cloneNode(true));
          container.appendChild(checkbox);

          priceElement.parentNode.insertBefore(container, priceElement);
          priceElement.remove();
        }
      });
  }

  // Function to calculate the total cost of selected items
  function calculateTotal() {
    let total = 0;
    document
      .querySelectorAll("wow-my-order-groceries-list-item-v2")
      .forEach((item, index) => {
        const checkbox = document.getElementById("checkbox" + index);
        if (checkbox && checkbox.checked) {
          const quantityInput = document.getElementById("quantity" + index);
          const purchasedQty = parseFloat(quantityInput.value);
          const qtyElement = item
            .querySelector(".item-qty-unit")
            .textContent.trim();
          const totalQty = parseInt(qtyElement.split(" of ")[1]);

          const priceText = item.querySelector(".price").textContent.trim();
          const price = parseFloat(priceText.replace("$", ""));

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
    let display = document.getElementById("totalDisplay");
    if (!display) {
      display = document.createElement("div");
      display.id = "totalDisplay";
      display.style.position = "fixed";
      display.style.bottom = "20px";
      display.style.right = "20px";
      display.style.backgroundColor = "white";
      display.style.border = "1px solid black";
      display.style.padding = "10px";
      document.body.appendChild(display);
    }
    display.textContent = "Total: $" + total.toFixed(2);
  }

  // Observer to monitor changes in the DOM
  const observer = new MutationObserver(function () {
    if (document.querySelector("wow-my-order-groceries-list-item-v2")) {
      setupCheckboxes();
    }
  });

  // Start observing the document
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
})();
