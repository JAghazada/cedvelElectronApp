const electron = require('electron');
const { ipcRenderer } = electron;
const tbody = document.querySelector('tbody');
const add_btn = document.querySelector('.add-btn');
const edit_btn = document.querySelector('.edit-btn');
const close = document.querySelector('.close');
const modal = document.querySelector('.modal');

add_btn.addEventListener('click', function () {
    const product_name = document.getElementById('product_name').value.trim()
    const product_count = document.getElementById('product_count').value.trim()
    const product_price = document.getElementById('product_price').value.trim()
    const product_notes = document.getElementById('notes').value.trim()

    if (product_name !== '' && product_count !== '' && product_price !== '') {
        var  product_price_2 =''
        for(let c of product_price){

            if(c===','){
                c='.'
            }
            product_price_2+=c
        }
        const dataJson = {
            product_name,
            product_count,
            product_price:product_price_2,
            product_notes
        }
       
        ipcRenderer.send('key:data', dataJson)

    }
    document.getElementById('product_name').value = ''
    document.getElementById('product_count').value = ''
    document.getElementById('product_price').value = ''
    document.getElementById('notes').value = ''



})
close.addEventListener('click', function () {
    modal.style.display = 'none'
})
const deleteProducts = (id) => {
    ipcRenderer.send('key:DeleteItem', id)
}
function editProducts(items) {
    // ipcRenderer.send('key:EditItem', id)
    const id = items[0]
    const product_name = items[1]
    const product_count = items[2]
    const product_price = items[3]
    const product_notes = items[4]
    modal.style.display = 'block'
    document.getElementById('product_name_edit').value = product_name
    document.getElementById('product_count_edit').value = product_count
    document.getElementById('product_price_edit').value = product_price
    document.getElementById('notes_edit').value = product_notes
    edit_btn.addEventListener('click', function () {
        let product_name_edit = document.getElementById('product_name_edit').value.trim()
        let product_count_edit = document.getElementById('product_count_edit').value.trim()
        let product_price_edit = document.getElementById('product_price_edit').value.trim()
        let product_notes_edit = document.getElementById('notes_edit').value.trim()
        if (product_name_edit !== '' && product_count_edit !== '' && product_price_edit !== '') {
            const dataJson = {
                id,
                product_name_edit,
                product_count_edit,
                product_price_edit,
                product_notes_edit
            }
            ipcRenderer.send('key:EditItem', dataJson)

        }

    })
}
ipcRenderer.on('key:summa', (err, data) => {
    const { max, product_length } = data
    document.querySelector('.product-price').innerHTML = max
    document.querySelector('.product-count').innerHTML = product_length
})
ipcRenderer.on('key:resetData', (err, dt) => {
    tbody.innerHTML = ''
    for (let items of dt) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <th scope ="row">${items.product_name}</th>
        <td>${items.product_count}</td>
        <td>${items.product_price}</td>
        <td>${items.product_notes}</td>
        <td><div class="delete"  onclick="deleteProducts(${items.id})">X</div></td>
        
    `;
        // <td><div class="edit"  onclick="editProducts([${items.id},'${items.product_name}','${items.product_count}','${items.product_price}','${items.product_notes}'])">
        //     <img src="../assets/images/Edit.svg" alt="Edit">
        //     </div></td>
        tbody.append(tr);


    }
})
document.querySelector('.pre-btn').addEventListener('click',function(){
    const element = document.getElementById('mainContainer')
    html2pdf().from(element).save()
})