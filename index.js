'use strict';

const STORE = {
  itemList:[
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  hideChecked : false,
  searchString : ''

};


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
        <button class="shopping-item-edit js-item-edit">
        <span class="button-label">edit</span>
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
    return STORE.hideChecked === false || item.checked === false ? item : null  ;
  }

  function hideBySearch(item){
    let nameString = '';
    try{nameString = item.name;}
    catch(err){}
    return nameString.includes(STORE.searchString) ? item : null;
  }

  return array.map(hideChecked).map(hideBySearch);

}


function renderShoppingList() {
  // render the shopping list in the DOM
  // console.log('`renderShoppingList` ran');
  const displayed = filterHidden(STORE.itemList)
  const shoppingListItemsString = generateShoppingItemsString(displayed);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.itemList.push({name: itemName, checked: false});
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
  STORE.itemList[itemIndex].checked = !STORE.itemList[itemIndex].checked;
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
    STORE.hideChecked = !STORE.hideChecked;
    renderShoppingList();
  });
}

function handleSearchTermChanged(){
  $('#item-filter-form').on('keyup', event => {
  //  console.log('searching for', $('#search-field').val() );
    STORE.searchString = $('#search-field').val();
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleItemDeleteClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    STORE.itemList.splice(itemIndex,1);
    console.log(STORE.itemList);
    renderShoppingList();


  });
}

function handleEditClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
        
    const itemIndex = getItemIndexFromElement(event.currentTarget);

    //creates new text field, pulls value from STORE
    $(event.currentTarget.closest('li')).find('.shopping-item').html(
      `<form id='#js-edit-form'>
                <input id='js-edit-field-${itemIndex}' type= "text">
            </form>`);
             
    $(`#js-edit-field-${itemIndex}`).val(STORE.itemList[itemIndex].name);
    $(`#js-edit-field-${itemIndex}`).focus();

    //creates new listener for each open edit form, pushes to STORE
    $(`#js-edit-field-${itemIndex}`).closest('form').submit(event => {
      event.preventDefault();
      const newName = $(`#js-edit-field-${itemIndex}`).val();
      console.log(newName)
      STORE.itemList[itemIndex].name = newName;
      renderShoppingList();

    });

  });


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
  handleEditClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);