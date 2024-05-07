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
          checkbox.style.marginRight = "5px";

          const quantityInput = document.createElement("input");
          quantityInput.type = "number";
          quantityInput.value = 0; // 默认值设置为0
          quantityInput.min = 0;
          quantityInput.max = totalQty;
          quantityInput.id = "quantity" + index;
          quantityInput.style.width = "50px";
          quantityInput.style.marginRight = "10px";
          quantityInput.disabled = true; // 默认禁用输入框

          const halfButton = document.createElement("button");
          halfButton.textContent = "Just Half";
          halfButton.style.marginRight = "10px";
          halfButton.onclick = () => {
            quantityInput.value = Math.ceil(totalQty / 2);
            calculateTotal();
          };

          checkbox.onchange = () => {
            if (checkbox.checked) {
              quantityInput.disabled = false;
              quantityInput.value = totalQty; // 当勾选时设置为最大数量
              halfButton.disabled = false; // 启用按钮
            } else {
              quantityInput.disabled = true;
              quantityInput.value = 0; // 取消勾选时重置为0
              halfButton.disabled = true; // 禁用按钮
            }
            calculateTotal();
          };

          priceElement.parentNode.insertBefore(halfButton, priceElement);
          priceElement.parentNode.insertBefore(quantityInput, halfButton);
          priceElement.parentNode.insertBefore(checkbox, quantityInput);
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
          const purchasedQty = parseInt(quantityInput.value);
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
