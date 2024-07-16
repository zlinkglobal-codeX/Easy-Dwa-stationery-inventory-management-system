document.addEventListener('DOMContentLoaded', function() {
    const addItemForm = document.getElementById('addItemForm');
    const inventoryTable = document.getElementById('inventoryTable');
    const restockForm = document.getElementById('restockForm');
    let currentRestockItemId = null;

    function loadItems() {
        let items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        items.forEach(addItemToTable);
        updateTotalPaidAmount();
    }

    function saveItems(items) {
        localStorage.setItem('inventoryItems', JSON.stringify(items));
        updateTotalPaidAmount();
    }

    function addItemToTable(item) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td><input type="number" class="form-control" value="${item.totalStock}" readonly></td>
            <td><input type="number" class="form-control" step="0.01" value="${item.price}" readonly></td>
            <td><input type="number" class="form-control" value="${item.quantityBought}" onchange="updateItem(${item.id}, 'quantityBought', this.value)"></td>
            <td><input type="number" class="form-control" value="${item.stockLeft}" readonly></td>
            <td><input type="number" class="form-control" step="0.01" value="${item.amountPaid}" readonly></td>
            <td><button class="btn btn-primary" onclick="openRestockModal(${item.id})">Restock</button></td>
            <td><button class="btn btn-danger" onclick="removeItem(${item.id})">Remove</button></td>
        `;
        inventoryTable.appendChild(row);
    }

    function addItem(event) {
        event.preventDefault();
        let items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        const newItem = {
            id: Date.now(),
            name: addItemForm.item_name.value,
            totalStock: parseInt(addItemForm.stock.value, 10),
            price: parseFloat(addItemForm.price.value),
            quantityBought: 0,
            stockLeft: parseInt(addItemForm.stock.value, 10),
            amountPaid: 0
        };
        items.push(newItem);
        saveItems(items);
        addItemToTable(newItem);
        addItemForm.reset();
        $('#addItemModal').modal('hide');
    }

    window.openRestockModal = function(id) {
        currentRestockItemId = id;
        $('#restockItemModal').modal('show');
    };

    function restockItem(event) {
        event.preventDefault();
        const quantityToAdd = parseInt(restockForm.restockQuantity.value, 10);
        let items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        const item = items.find(item => item.id === currentRestockItemId);
        if (item) {
            item.totalStock += quantityToAdd;
            item.stockLeft += quantityToAdd;
            saveItems(items);
            inventoryTable.innerHTML = '';
            loadItems();
            $('#restockItemModal').modal('hide');
            restockForm.reset();
        }
    }

    window.removeItem = function(id) {
        let items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        items = items.filter(item => item.id !== id);
        saveItems(items);
        inventoryTable.innerHTML = '';
        loadItems();
    };

    window.updateItem = function(id, field, value) {
        let items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        const item = items.find(item => item.id === id);
        if (item) {
            item[field] = parseInt(value, 10);
            if (field === 'quantityBought') {
                item.stockLeft = item.totalStock - item.quantityBought;
                item.amountPaid = item.quantityBought * item.price;
            }
            saveItems(items);
            inventoryTable.innerHTML = '';
            loadItems();
        }
    };

    function updateTotalPaidAmount() {
        let items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        let totalPaid = items.reduce((sum, item) => sum + item.amountPaid, 0);
        document.getElementById('totalPaidAmount').value = totalPaid.toFixed(2);
    }

    addItemForm.addEventListener('submit', addItem);
    restockForm.addEventListener('submit', restockItem);
    loadItems();
});
