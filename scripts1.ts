// scripts.js
document.addEventListener('DOMContentLoaded', (event) => {
    loadInventory();

    document.getElementById('addItemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addItem();
    });
});

function loadInventory() {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    let inventoryTable = document.getElementById('inventoryTable');
    inventoryTable.innerHTML = '';

    inventory.forEach((item, index) => {
        let row = inventoryTable.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = item.name;
        row.insertCell(2).textContent = item.quantity;
        row.insertCell(3).textContent = item.price;

        let updateCell = row.insertCell(4);
        let updateForm = document.createElement('form');
        updateForm.className = 'form-inline';
        updateForm.onsubmit = function(e) {
            e.preventDefault();
            updateItem(index, updateForm.querySelector('input').value);
        };

        let updateInput = document.createElement('input');
        updateInput.type = 'number';
        updateInput.className = 'form-control mx-sm-2';
        updateInput.required = true;

        let updateButton = document.createElement('button');
        updateButton.type = 'submit';
        updateButton.className = 'btn btn-secondary';
        updateButton.textContent = 'Update';

        updateForm.appendChild(updateInput);
        updateForm.appendChild(updateButton);
        updateCell.appendChild(updateForm);

        let removeCell = row.insertCell(5);
        let removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger';
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() {
            removeItem(index);
        };
        removeCell.appendChild(removeButton);
    });
}

function addItem() {
    let itemName = document.getElementById('item_name').value;
    let quantity = parseInt(document.getElementById('quantity').value);
    let price = parseFloat(document.getElementById('price').value);

    if (itemName.trim() === '' || isNaN(quantity) || quantity < 1 || isNaN(price) || price < 0) {
        alert('Please enter valid item name, quantity, and price.');
        return;
    }

    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    inventory.push({ name: itemName, quantity: quantity, price: price });
    localStorage.setItem('inventory', JSON.stringify(inventory));

    document.getElementById('addItemForm').reset();
    loadInventory();
}

function updateItem(index, soldQuantity) {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    soldQuantity = parseInt(soldQuantity);
    if (isNaN(soldQuantity) || soldQuantity < 1) {
        alert('Please enter a valid sold quantity.');
        return;
    }
    inventory[index].quantity -= soldQuantity;
    if (inventory[index].quantity < 0) inventory[index].quantity = 0;
    localStorage.setItem('inventory', JSON.stringify(inventory));
    loadInventory();
}

function removeItem(index) {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    inventory.splice(index, 1);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    loadInventory();
}
