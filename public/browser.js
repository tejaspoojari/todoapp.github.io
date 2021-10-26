
function itemTemplate(item) {
    return `<li  class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
    <button data-id=${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id=${item._id} class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
    </li>` };

// Initial Landing page
let ourHTML = item.map(function(item){
    return itemTemplate(item);
}).join('');
document.querySelector("#item-list").insertAdjacentHTML('beforeend', ourHTML)

//Create feature
    
let createField = document.querySelector("#create-field");

let edit = document.querySelector("#create-form");
edit = document.addEventListener("submit", create);
function create(e) {
    e.preventDefault()
    console.log(e);
    axios.post('/submit', { text: createField.value }).then(function (response) {
    document.querySelector("#item-list").insertAdjacentHTML('beforeend', itemTemplate(response.data))
    }).catch(function(){
        console.log('ran into a problem')}
    )
    createField.value = "";
    createField.focus();
};

//Edit by button 

document.addEventListener('click', function (e) {

    if (e.target.classList.contains('edit-me')) {

        let userInput = prompt('Please edit below', e.target.parentElement.parentElement.querySelector('.item-text').innerHTML);
        if (userInput) {
            axios.post('/update-item', { text: userInput, id: e.target.getAttribute('data-id') }).then(function () {
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput;
            }).catch(function () {
                console.log('Please try again');
            });
        };
    };
});

//Delete by button

document.addEventListener('click', function (e) {

    if (e.target.classList.contains('delete-me')) {

        let deleteItem = confirm('Want to delete this');

        if (deleteItem) {
            axios.post('/delete-item', { id: e.target.getAttribute('data-id') }).then(function () {
                e.target.parentElement.parentElement.remove();
            }).catch(function () {
                console.log('Please try again');
            });
        }
    };
});