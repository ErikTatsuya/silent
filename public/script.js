const createUser = document.getElementById("create_user");

function showMessage(message, classType) {
    const element = document.getElementById("response_element");
    if (element) {
        element.remove();
    }

    const divForm = document.getElementById("div_form");

    const responseElement = document.createElement("p");
    responseElement.id = "response_element";
    responseElement.textContent = message;
    
    if (classType) {
        responseElement.classList.add(classType);
    }

    divForm.appendChild(responseElement);
}

createUser.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target;
    const urlAPI = "http://localhost:3000/silent/users/create-user";

    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());

    const response = await fetch(urlAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData)
    });

    const data = await response.json();
    
    if (response.status === 409) {
        showMessage("User already exists. Change the name or email.", "error");
        return;
    }

    if (response.status === 201) {
        console.log("Success:", data);
        showMessage("Success while creating a user", "success");
        form.reset();
        return;
    }

    // fallback caso status não seja 201 nem 409
    console.log("Error:", data);
    showMessage("Error while creating a user", "error");
});
