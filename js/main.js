const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
    console.log("data books", books);

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function(event){
        event.preventDefault();
        searchBook();
    });

    
});

function addBook() {
    const textBookTitle = document.getElementById('inputBookTitle').value;
    const textBookAuthor = document.getElementById('inputBookAuthor').value;
    const textBookYear = document.getElementById('inputBookYear').value;
    const checkBox = document.getElementById('inputBookIsComplete').checked;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textBookTitle, textBookAuthor, textBookYear, checkBox);
    books.push(bookObject);
   
    console.log("setelah di add >>>>>",bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}
   
function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const incompletedBOOKList = document.getElementById('incompleteBookshelfList');
    incompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerText = '';

    for (const bookItem of books) {
        const bookElement = inputBooks(bookItem);
        if (!bookItem.isCompleted) 
            incompletedBOOKList.append(bookElement);
        else
            completedBOOKList.append(bookElement);        
    }
});


function inputBooks(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_list');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('book_shelf');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        container.append(checkButton, trashButton);
    }

    return container;
}


function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}


function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook(){
    const textBookTitle = document.getElementById('searchBookTitle').value;
    const incompletedBOOKList = document.getElementById('incompleteBookshelfList');
    incompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerText = '';

    for (const bookItem of books) {
        const bookElement = inputBooks(bookItem);
        if(bookItem.title == textBookTitle){
            if (!bookItem.isCompleted) 
            incompletedBOOKList.append(bookElement);
            else
                completedBOOKList.append(bookElement);
        }        
    }
    
    // setTimeout(loadDataFromStorage(), 50000);
}

