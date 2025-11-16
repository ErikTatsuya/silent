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

createUser.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target;
    const urlAPI = "http://localhost:3000/silent/users/create-user";

    const formData = new FormData(form);

    //converte para json
    const jsonData = Object.fromEntries(formData.entries());

    const response = await fetch( urlAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData)
    })

    const data = await response.json();

    if(response.status === 409){
        showMessage("User already exists. change the name or email.");
        return;
    }

    if (response.status === 201){
        console.log(`success: ${data}`)

        showMessage("Sucess while creating a user", "success");
        
        form.reset();
    }

    console.log(`error: ${data}`)
    
    showMessage("Sucess while creating a user", "success");

    return response.json();
})