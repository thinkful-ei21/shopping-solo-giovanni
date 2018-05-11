'use strict';

const STORE = [
  {name: 'init', hideChecked: false, searchString: ''},
  {name: 'apples', checked: false},
  {name: 'oranges', checked: false},
  {name: 'milk', checked: true},
  {name: 'bread', checked: false}
];


function generateItemElement(item, itemIndex, template) {
  return item === null ? '' : `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

function filterHidden(array){

  function hideChecked(item){
    return STORE[0].hideChecked === false || item.checked === false ? item : null  ;
  }

  function hideBySearch(item){
    let nameString = '';
    try{nameString = item.name;}
    catch(err){console.log(err)}
    return nameString.includes(STORE[0].searchString) && nameString !== 'init' ? item : null;
  }


  return array.map(hideChecked).map(hideBySearch);

}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const displayed = filterHidden(STORE)
  const shoppingListItemsString = generateShoppingItemsString(displayed);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function handleHideCheckedClicked(){
  $('#item-filter-form').on('change', '.hide-checked-checkbox' , event => {
    //     console.log('checking')
    STORE[0].hideChecked = !STORE[0].hideChecked;
    renderShoppingList();
  });
}

function handleSearchTermChanged(){
  $('#item-filter-form').on('keyup', event => {
    console.log('searching for', $('#search-field').val() );
    STORE[0].searchString = $('#search-field').val();
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleItemDeleteClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    STORE.splice(itemIndex,1);
    console.log(STORE);
    renderShoppingList();


  });
  // this function will be responsible for when users want to delete a shopping list
  // item
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCheckedClicked();
  handleSearchTermChanged();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);