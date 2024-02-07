const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-GHP-ET-WEB-FT-SF/events'

const state = {
  parties: []
  // could add other pieces of state
} 

const partiesList = document.querySelector('#parties');

const addPartyForm = document.querySelector('#addParty');
addPartyForm.addEventListener('submit', createParty);

// Sync state with the API and rerender
// This happens in order for the page to load correctly anytime changes are made
async function render() {
 await getParties()
 renderParties()
}
render();

// Update state with recipes from API
// This will reach out to the API and fetch the data, convert the raw data to something legible to the user, and bring it in. Our page will 'await' this to happen and then render the page with the parties fetched included.

async function getParties() {
  try {
    // fetch recipe data
    const response = await fetch(API_URL)
    // parse response - translate JSON into a JS object
    const json = await response.json()
    // update `parties` array
    state.parties = json.data
    console.log(state.parties)
  } catch(error) {
    console.error(error)
  }
}

// Ask API to create a new recipe and rerender
// This will take the input the user types into our form, convert that format of input backwards from when we fetched it so that it jives with the raw data of the API, and add that information as a new party on our page.

async function createParty(event) {
  event.preventDefault()

  const name = addPartyForm.title.value
  const description = addPartyForm.description.value
  const date = addPartyForm.date.value
  const location = addPartyForm.location.value

  try {
    // post recipe data
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, description, date, location})
    })
    // parse response
    const json = await response.json()
    // rerender the page (which will update `recipes` array)
    render()

  } catch(error) {
    console.error(error)
  }
}

// Ask API to delete a recipe and rerender
// This will allow us to delete any of our parties on our site via a delete button (which will be added later) by fetching the party by its unique id and removing the object associated with it when the page is redererd.

async function deleteParty(id) {
  try {
    // make a DELETE request
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    })
    // we can parse response and do things with response if needed
    // rerender everything
    render()
  } catch(error) {
    console.error(error)
  }
}

// Render parties from state
// This will take all of the parties loaded and/or added into the state party array and display them onto our page.

function renderParties() {
  if(state.parties.length < 1) {
    const newListItem = document.createElement("li")
    newListItem.textContent = "No events found"
    partiesList.append(newListItem)
  }
  else {
    partiesList.replaceChildren() 

    // for each party object
    state.parties.forEach((partyObj) => {
      // create a <li> 
      const newListItem = document.createElement("li")
      newListItem.classList.add("party")

      // with a heading, paragraph, date, location
      const newHeading = document.createElement("h2")
      newHeading.textContent = partyObj.title
      const newParagraph = document.createElement("p")
      newParagraph.textContent = partyObj.description
      const newDate = document.createElement("p")
      newDate.textContent = partyObj.date
      const newLocation = document.createElement ("p")
      newLocation.textContent = partyObj.location

      const deleteButton = document.createElement("button")
      deleteButton.textContent = "Delete"
      deleteButton.addEventListener("click", () => deleteParty(partyObj.id))

      newListItem.append(newHeading, newParagraph, newDate, newLocation)
      // append to `partiesList`
      partiesList.append(newListItem) 
    })
  }
}