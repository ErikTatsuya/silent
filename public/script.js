const createUser = document.getElementById("create_user");

function showMessage(message, classType)
{
    const element = document.getElementById("response_element");
    if (element)
    {
        element.remove();
    }

    const divForm = document.getElementById(`div_form`);

    const responseElement = document.createElement("p");

    responseElement.id = "response_element";
    responseElement.textContent = message;
    responseElement.classList.add(classType);

    divForm.appendChild(responseElement);
}

createUser.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.target;
    const urlAPI = "http://localhost:3000/silent/users/create-user";

    const formData = new FormData(form);

    //converte para json
    const jsonData = Object.fromEntries(formData.entries());

    fetch
    (
        urlAPI, 
        {
            method: "POST",
            headers: {
                //informa para a api que é um json
                "Content-Type": "application/json"
            },

            body: JSON.stringify(jsonData)
        }
    )
    

    .then(response => {
        if(!response.ok)
        {
            throw new Error(`http error. status: ${response.status}`)
        }

        return response.json();
    })


    .then(data => {
        console.log(`success: ${data}`)

        showMessage("Sucess while creating a user", "success");

        form.reset();
    })

    .catch(error => {
        console.error(`Error ${error}`);

        showMessage("Error while creating a user", "error");
    })
})