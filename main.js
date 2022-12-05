const API = "http://localhost:8000/nameLast";

let names = document.querySelector("#names");
let lastName = document.querySelector("#lastName");
let contacts = document.querySelector("#contact");
let photo = document.querySelector("#photo");
let btnAdd = document.querySelector("#btn-add");
let btnDelete = document.querySelector('.btn btn-secondary')
let list = document.querySelector("#names-list");
let editNames = document.querySelector("#edit-names");
let editLastName = document.querySelector("#edit-last-name");
let editContacts = document.querySelector("#edit-contacts");
let editPhoto = document.querySelector("#edit-photo");
let editSaveBtn = document.querySelector("#btn-save-edit");
let editModal = document.querySelector("#exempleModal");


btnAdd.addEventListener("click", async function () {
  
  let obj = {
      names: names.value,
      lastName: lastName.value,
      contacts: contacts.value,
      photo: photo.value,
  }

  
  if (
    !obj.names.trim() ||
    !obj.lastName.trim() ||
    !obj.contacts.trim() ||
    !obj.photo.trim()
  ) {
    alert("заполните поля");
    return;
  }
  
  await fetch(API, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    }, 
    body: JSON.stringify(obj), 
  });
  render();
  
  names.value = "";
  lastName.value = "";
  contacts.value = "";
  photo.value = "";
});


render();
async function render() {
  let nameLast = await fetch(API)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  list.innerHTML = "";

  nameLast.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML = `
    <div class="card m-5" style="width: 18rem;">
  <img src=${element.photo} class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${element.names}</h5>
    <p class="card-text">${element.lastName}</p>
    <p class="card-text">${element.contacts}</p>
    <a href="#" class="btn btn-danger btn-delete" id=${element.id}>DELETE</a>
    <a href="#" class="btn btn-primary btn-edit" data-bs-toggle="modal" 
    data-bs-target="#exampleModal" id=${element.id}>EDIT</a>
  </div>
</div> `;

    list.append(newElem);   
  });
}




document.addEventListener("click", function (e) {
 
  if (e.target.classList.contains("btn-edit")) {
   
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
       
        editNames.value = data.names;
        editLastName.value = data.lastName;
        editContacts.value = data.contacts;
        editPhoto.value = data.photo;
         
        editSaveBtn.setAttribute("id", data.id);
      });
  }
});


editSaveBtn.addEventListener("click", function () {
  let id = this.id;
 
  let names = editNames.value;
  let lastName = editLastName.value;
  let contacts = editContacts.value;
  let photo = editPhoto.value;
  
  if (!names || !lastName || !contacts || !photo) return;

   
  let editedListName = {
    names: names,
    lastName: lastName,
    contacts: contacts,
    photo: photo,
  };
  saveEdit(editedListName, id);
});


async function saveEdit(editedListName, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedListName),
  });
 
  render();
  
  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}


document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      let id = e.target.id;
      fetch(`${API}/${id}`, {
        method: "DELETE",
      }).then(() => {
        contentList.innerHTML = "";
        displayInfo();
      });
    }
  });