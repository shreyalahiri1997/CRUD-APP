console.log("hi")

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');


function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
    }
    
    reader.readAsDataURL(e.target.files[0]);
}



fetch("http://localhost:3000/users")
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("NETWORK RESPONSE ERROR");
        }
    })
    .then(data => {
        console.log(data)
    })
    .catch((error) => console.error("FETCH ERROR:", error));



function getUserFormData() {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("password").value;
    const state = document.getElementById("state").value;
    const city = document.getElementById("city").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const imageElementCanvas = document.getElementById('imageCanvas');

    const imageString = imageElementCanvas.toDataURL()

    const userData = {
        name: `${firstname} ${lastname}`,
        dob: dob,
        password: password,
        state: state,
        city: city,
        email: email,
        phone: phone,
        userImage: imageString
    }
    
    return userData
}



async function postUserFormData() {
    console.log("We triggered post call")
    let userformData = getUserFormData()
    const settings = {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userformData)
    }
    try {
        const fetchResponse = await fetch("http://localhost:3000/users", settings)
        const data = await fetchResponse
        console.log(data)
        return data
    }
    catch (e) {
        console.log(e)
        return e
    }


}

// const element = document.getElementById("submitButton");
// element.addEventListener("click", postUserFormData);

// function displayCocktail(data) {
//     const cocktail = data.drinks[0];
//     const cocktailDiv = document.getElementById("cocktail");
//     // cocktail name
//     const cocktailName = cocktail.strDrink;
//     const heading = document.createElement("h1");
//     heading.innerHTML = cocktailName;
//     cocktailDiv.appendChild(heading);
//     // cocktail image
//     const cocktailImg = document.createElement("img");
//     cocktailImg.src = cocktail.strDrinkThumb;
//     cocktailDiv.appendChild(cocktailImg);
//     document.body.style.backgroundImage = "url('" + cocktail.strDrinkThumb + "')";
//     // cocktail ingredients
//     const cocktailIngredients = document.createElement("ul");
//     cocktailDiv.appendChild(cocktailIngredients);
//     const getIngredients = Object.keys(cocktail)
//         .filter(function (ingredient) {
//             return ingredient.indexOf("strIngredient") == 0;
//         })
//         .reduce(function (ingredients, ingredient) {
//             if (cocktail[ingredient] != null) {
//                 ingredients[ingredient] = cocktail[ingredient];
//             }
//             return ingredients;
//         }, {});
//     for (let key in getIngredients) {
//         let value = getIngredients[key];
//         listItem = document.createElement("li");
//         listItem.innerHTML = value;
//         cocktailIngredients.appendChild(listItem);
//     }
// }