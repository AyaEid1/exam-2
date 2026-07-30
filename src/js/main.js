let allMeals = [];
let currentMeal = {};
let currentProduct = {};
let allAreas = [];
let servings = 1;
let currentView = "grid";
let productCategories = [];
 window.addEventListener("load", function () {

    const loader = document.getElementById("app-loading-overlay");

    setTimeout(() => {

        loader.classList.add("opacity-0");

        setTimeout(() => {

            loader.classList.add("hidden");

        }, 500);

    }, 1500);  

});
window.addEventListener("DOMContentLoaded", function () {

    let page = localStorage.getItem("currentPage") || "meals";

    switch(page){

        case "products":

            showProductsPage();
            setActiveLink(document.getElementById("products-link"));
            getCategories();

            break;

        case "foodlog":

            showFoodLogPage();
            loadFoodLog();
            const weekData = getWeekData();
            displayWeeklyOverview(weekData);
            updateWeeklyStats(weekData);
            setActiveLink(document.getElementById("foodlog-link"));
            break;

        default:

            showHomePage();
            setActiveLink(document.getElementById("recipes-link"));

    }

}); 
function showLoading(containerId){

document.getElementById(containerId).innerHTML=`

<div class="col-span-full flex justify-center py-20">

<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>

</div>

`;

}
document.getElementById("log-meal-btn").addEventListener("click", openLogMealModal);
async function getAllMeals(category = "") {
 showLoading("recipes-grid");
    try {

        let url = "";

        if (category == "") {

          url = "https://nutriplan-api.vercel.app/api/meals/search?q=a&page=1&limit=100";

        } else {

            url = `https://nutriplan-api.vercel.app/api/meals/filter?category=${category}&page=1&limit=25`;

        }

        let response = await fetch(url);

        let data = await response.json();
        allMeals = data.results;
 

        displayMeals();
        

    }

    catch (error) {

        console.log(error);

    }

}

async function getMealDetails(id) {
  document.getElementById("recipes-grid").innerHTML=`
        <div class="col-span-full flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    `;
    try {

        let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/${id}`);

        let data = await response.json();
currentMeal = data.result;
currentMeal.nutrition = generateNutrition(currentMeal);
displayMealDetails();

showMealDetailsPage();
    } catch (error) {

        console.log(error);

    }

} 

getAllMeals();
getAllAreas();
document.getElementById("back-to-meals-btn").addEventListener("click",function(){

    showHomePage();

});
function displayMeals() {
if (allMeals.length === 0) {

    document.getElementById("recipes-grid").innerHTML = `
    
        <div class="col-span-full flex flex-col items-center justify-center py-20">

            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">

                <i class="fa-solid fa-magnifying-glass text-3xl text-gray-400"></i>

            </div>

            <h3 class="mt-6 text-2xl font-semibold text-gray-700">
                No recipes found
            </h3>

            <p class="mt-2 text-gray-500">
                Try a different search term.
            </p>

        </div>

    `;

    return;
}
    let cartona = "";
 
    for (let meal of allMeals) {

        if (currentView === "grid") {

            cartona += `
            <div
                onclick="getMealDetails('${meal.id}')"
                class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">

                <div class="relative h-48 overflow-hidden">

                    <img
                        src="${meal.thumbnail}" 
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">

                    <div class="absolute bottom-3 left-3 flex gap-2">

                        <span class="px-2 py-1 bg-white rounded-full text-xs">
                            ${meal.category}
                        </span>

                        <span class="px-2 py-1 bg-emerald-500 text-white rounded-full text-xs">
                            ${meal.area}
                        </span>

                    </div>

                </div>

                <div class="p-4">

                    <h3 class="font-bold text-lg">${meal.name}</h3>

                    <p class="text-gray-500 text-sm">
                        Delicious recipe to try!
                    </p>

                </div>

            </div>
            `;

        } else {

            cartona += `
            <div
                onclick="getMealDetails('${meal.id}')"
                class="recipe-card bg-white rounded-xl shadow-sm p-4 flex items-center gap-5 hover:shadow-lg cursor-pointer">

                <img
                    src="${meal.thumbnail}"
                    class="w-40 h-28 rounded-lg object-cover">

                <div class="flex-1">

                    <h3 class="text-xl font-bold mb-2">
                        ${meal.name}
                    </h3>

                    <p class="text-gray-600 mb-3">
                        Delicious recipe to try!
                    </p>

                    <div class="flex gap-2">

                        <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                            ${meal.category}
                        </span>

                        <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            ${meal.area}
                        </span>

                    </div>

                </div>

            </div>
            `;
        }
    }

    const grid = document.getElementById("recipes-grid");

if(currentView === "grid"){

    grid.className = "grid grid-cols-4 gap-5";

}else{

    grid.className = "grid grid-cols-2 gap-5";

}

grid.innerHTML = cartona; 

}
 function changeView(view) {

    currentView = view;

    const gridBtn = document.getElementById("grid-view-btn");
    const listBtn = document.getElementById("list-view-btn");
    const grid = document.getElementById("recipes-grid");
 
    gridBtn.classList.remove("bg-white", "shadow-sm");
    listBtn.classList.remove("bg-white", "shadow-sm");

    if (view === "grid") {

        grid.className = "grid grid-cols-4 gap-5";

        gridBtn.classList.add("bg-white", "shadow-sm");

    } else {

        grid.className = "grid grid-cols-2 gap-5";

        listBtn.classList.add("bg-white", "shadow-sm");

    }

    displayMeals();

}
document
.getElementById("grid-view-btn")
.addEventListener("click",()=>{

    changeView("grid");

});

document
.getElementById("list-view-btn")
.addEventListener("click",()=>{

    changeView("list");

});
/***hide***/
function showMealDetailsPage(){

    hideAllPages();

    document.getElementById("meal-details").classList.remove("hidden");

    window.scrollTo(0,0);

}
function hideAllPages() {

    document.getElementById("header").classList.add("hidden");

    document.getElementById("search-filters-section").classList.add("hidden");

    document.getElementById("meal-categories-section").classList.add("hidden");

    document.getElementById("all-recipes-section").classList.add("hidden");

    document.getElementById("meal-details").classList.add("hidden");

    document.getElementById("products-section").classList.add("hidden");
    document.getElementById("foodlog-section").classList.add("hidden");
 
}
/***show***/
function saveCurrentPage(page) {

    localStorage.setItem("currentPage", page);

    history.pushState(
        { page: page },
        "",
        "/" + page
    );

}
function showHomePage() {

    saveCurrentPage("meals");
    hideAllPages();

    document.getElementById("header").classList.remove("hidden");

    document.getElementById("search-filters-section").classList.remove("hidden");

    document.getElementById("meal-categories-section").classList.remove("hidden");

    document.getElementById("all-recipes-section").classList.remove("hidden");

    window.scrollTo(0,0);

}
function showProductsPage(){

    saveCurrentPage("products");
    hideAllPages();

    document.getElementById("products-section").classList.remove("hidden");

    window.scrollTo(0,0);

}
function showFoodLogPage(){

    saveCurrentPage("foodlog");

    hideAllPages();

    document.getElementById("foodlog-section").classList.remove("hidden");

}
document.getElementById("recipes-link").addEventListener("click", function (e) {
    e.preventDefault();
        setActiveLink(this); 

    showHomePage();
});

document.getElementById("products-link")
.addEventListener("click", function (e) {

    e.preventDefault();

    setActiveLink(this);

    showProductsPage();

    getCategories(); 
});
document.getElementById("foodlog-link").addEventListener("click", function (e) {
    e.preventDefault();
    setActiveLink(this);
        showFoodLogPage();
        loadFoodLog();
});
function setActiveLink(activeLink) {

    document.querySelectorAll(".nav-link").forEach(link => {

        link.classList.remove(
            "bg-emerald-50",
            "text-emerald-700"
        );

        link.classList.add(
            "text-gray-600",
            "hover:bg-gray-50"
        );

    });

    activeLink.classList.remove(
        "text-gray-600",
        "hover:bg-gray-50"
    );

    activeLink.classList.add(
        "bg-emerald-50",
        "text-emerald-700"
    );

}
 function displayMealDetails(){

    document.getElementById("meal-image").src = currentMeal.thumbnail;

    document.getElementById("meal-name").innerHTML = currentMeal.name;

    document.getElementById("meal-category").innerHTML = currentMeal.category;

    document.getElementById("meal-area").innerHTML = currentMeal.area;

    let video = "";

if (currentMeal.youtube) {
    video = currentMeal.youtube.replace(
        "watch?v=",
        "embed/"
    );
}

document.getElementById("meal-video").src = video;

    displayIngredients();
   displayInstructions();
   displayNutrition();

}
function displayIngredients(){

let cartona="";

for(let i=0;i<currentMeal.ingredients.length;i++){

cartona+=`

<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">

<input
type="checkbox"
class="w-5 h-5 text-emerald-600 rounded"/>

<span>

<b>${currentMeal.ingredients[i].measure}</b>

${currentMeal.ingredients[i].ingredient}

</span>

</div>

`;

}
document.getElementById("ingredients-container").innerHTML=cartona;


}
function displayInstructions(){

    let cartona = "";

    for(let i = 0 ; i < currentMeal.instructions.length ; i++){

        cartona += `

<div
class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">

<div
class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">

${i+1}

</div>

<p class="text-gray-700 leading-relaxed pt-2">

${currentMeal.instructions[i]}

</p>

</div>

`;

    }

document.getElementById("instructions-container").innerHTML = cartona;

}
const nutritionBase = {

    Chicken: {
        calories: 180,
        protein: 30,
        carbs: 5,
        fat: 8
    },

    Beef: {
        calories: 280,
        protein: 28,
        carbs: 4,
        fat: 18
    },

    Seafood: {
        calories: 170,
        protein: 32,
        carbs: 3,
        fat: 6
    },

    Dessert: {
        calories: 320,
        protein: 5,
        carbs: 48,
        fat: 12
    },

    Vegetarian: {
        calories: 150,
        protein: 12,
        carbs: 22,
        fat: 5
    },

    Default: {
        calories: 220,
        protein: 18,
        carbs: 18,
        fat: 8
    }

};
 function generateNutrition(meal) {
  let count = meal.ingredients.length;
    const base =
        nutritionBase[meal.category] ||
        nutritionBase.Default;

    let nutrition = {

        calories: base.calories,

        protein: base.protein,

        carbs: base.carbs,

        fat: base.fat,

        fiber: 0,

        sugar: 0,

        saturatedFat: 0,

        cholesterol: 0,

        sodium: 0

    };
    nutrition.calories += count * 15;
    nutrition.protein += count;
    nutrition.carbs += Math.floor(count / 2);
    nutrition.fat += Math.floor(count / 3);

    nutrition.fiber = Math.floor(count / 2);

    nutrition.sugar = Math.floor(nutrition.carbs * 0.25);

    nutrition.saturatedFat = Math.floor(nutrition.fat * 0.3);

    nutrition.cholesterol = 100 + count * 12;

    nutrition.sodium = 300 + count * 35;

    return nutrition;

}
function openLogMealModal() {

    servings = 1;

    Swal.fire({

        width: 650,

        showConfirmButton: false,

        html: `

        <div class="text-left">

            <div class="flex items-center gap-4 mb-6">

                <img
                src="${currentMeal.thumbnail}"
                class="w-20 h-20 rounded-xl object-cover">

                <div>

                    <h2 class="text-2xl font-bold">
                        Log This Meal
                    </h2>

                    <p class="text-gray-500">
                        ${currentMeal.name}
                    </p>

                </div>

            </div>

            <h3 class="font-semibold mb-3">
                Number of Servings
            </h3>


            <div class="flex items-center gap-4 mb-6">

                <button
                id="minus-btn"
                class="w-10 h-10 rounded-lg bg-gray-200">

                    -

                </button>

                <input
                id="servings-input"
                value="1"
                readonly
                class="w-20 text-center border rounded-lg py-2">

                <button
                id="plus-btn"
                class="w-10 h-10 rounded-lg bg-gray-200">

                    +

                </button>

            </div>


            <div
            class="bg-emerald-50 rounded-xl p-4">

                <div class="grid grid-cols-4 gap-3 text-center">

                    <div>

                        <h4 id="modal-calories"
                        class="font-bold text-xl text-emerald-600">

             ${currentMeal.nutrition.calories}
                        </h4>

                        <p>Calories</p>

                    </div>

                    <div>

                        <h4 id="modal-protein">

                  ${currentMeal.nutrition.protein}

                        </h4>

                        <p>Protein</p>

                    </div>

                    <div>

                        <h4 id="modal-carbs">
${currentMeal.nutrition.carbs}

                        </h4>

                        <p>Carbs</p>

                    </div>

                    <div>

                        <h4 id="modal-fat">

                ${currentMeal.nutrition.fat}
                        </h4>

                        <p>Fat</p>

                    </div>

                </div>

            </div>

<br>
            <div class="flex gap-3">

                <button
                id="cancel-btn"
                class="w-1/2 py-3 rounded-lg bg-gray-200">

                    Cancel

                </button>

                <button
                id="save-btn"
                class="w-1/2 py-3 rounded-lg bg-blue-600 text-white">

                    Log Meal

                </button>

            </div>

        </div>

        `,

        didOpen() {

            attachModalEvents();

        }

    });

}
function attachModalEvents(){

document
.getElementById("plus-btn")
.addEventListener("click",increaseServings);

document
.getElementById("minus-btn")
.addEventListener("click",decreaseServings);

document
.getElementById("cancel-btn")
.addEventListener("click",()=>{

Swal.close();

});

document
.getElementById("save-btn")
.addEventListener("click",saveMeal);

}
function increaseServings(){

servings++;

updateModal();

}

function decreaseServings(){

if(servings>1){

servings--;

updateModal();

}

}
function updateModal(){

document.getElementById("servings-input").value=servings;

document.getElementById("modal-calories").innerHTML=
currentMeal.nutrition.calories * servings;

document.getElementById("modal-protein").innerHTML=
currentMeal.nutrition.protein * servings;

document.getElementById("modal-carbs").innerHTML=
currentMeal.nutrition.carbs * servings;

document.getElementById("modal-fat").innerHTML=
currentMeal.nutrition.fat * servings;

}
function saveMeal(){

let item={

    id:Date.now(),

    type:"meal",

    name:currentMeal.name,

    image:currentMeal.thumbnail,

    calories:currentMeal.nutrition.calories*servings,

    protein:currentMeal.nutrition.protein*servings,

    carbs:currentMeal.nutrition.carbs*servings,

    fat:currentMeal.nutrition.fat*servings,

    servings:servings,

    date:new Date().toISOString().split("T")[0]

};

saveFoodLog(item);
 loadFoodLog();
Swal.fire({

icon:"success",

title:"Meal Logged!"

});

}
function displayNutrition() {
let nutrition = currentMeal.nutrition;
    const totalCalories = nutrition.calories * 4;

    let cartona = `

    <p class="text-sm text-gray-500 mb-4">
        Per serving
    </p>

    <div
        class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">

        <p class="text-sm text-gray-600">
            Calories per serving
        </p>

        <p class="text-4xl font-bold text-emerald-600">
            ${nutrition.calories}
        </p>

        <p class="text-xs text-gray-500 mt-1">
            Total: ${totalCalories} cal
        </p>

    </div>
    ${nutritionRow(
        "emerald",
        "Protein",
        nutrition.protein,
        50
    )}

    ${nutritionRow(
        "blue",
        "Carbs",
        nutrition.carbs,
        300
    )}

    ${nutritionRow(
        "purple",
        "Fat",
        nutrition.fat,
        65
    )}

    ${nutritionRow(
        "orange",
        "Fiber",
        nutrition.fiber,
        30
    )}

    ${nutritionRow(
        "pink",
        "Sugar",
        nutrition.sugar,
        50
    )}

    ${nutritionRow(
        "red",
        "Saturated Fat",
        nutrition.saturatedFat,
        20
    )}

    <div class="mt-6 pt-6 border-t border-gray-100">

        <h3 class="text-sm font-semibold mb-3">
            Other
        </h3>

        <div class="grid grid-cols-2 gap-3">

            <div class="flex justify-between">

                <span>Cholesterol</span>

                <span>${nutrition.cholesterol}mg</span>

            </div>

            <div class="flex justify-between">

                <span>Sodium</span>

                <span>${nutrition.sodium}mg</span>

            </div>

        </div>

    </div>

    `;

    document.getElementById(
        "nutrition-facts-container"
    ).innerHTML = cartona;

}
function nutritionRow(color, title, value, maxValue) {

    let percent = (value / maxValue) * 100;

    if (percent > 100) {
        percent = 100;
    }

    return `

    <div class="mt-4">

        <div class="flex items-center justify-between">

            <div class="flex items-center gap-2">

                <div class="w-3 h-3 rounded-full bg-${color}-500"></div>

                <span>${title}</span>

            </div>

            <span class="font-bold">

                ${value}g

            </span>

        </div>

        <div class="w-full bg-gray-100 rounded-full h-2 mt-2">

            <div
                class="bg-${color}-500 h-2 rounded-full"
                style="width:${percent}%">

            </div>

        </div>

    </div>

    `;

}
//search
document
    .getElementById("search-input")
    .addEventListener("keydown", function (e) {

        if (e.key === "Enter") {
            searchMeals();
        }

    });
    async function searchMeals() {
 showLoading("recipes-grid");
    let searchValue = document
        .getElementById("search-input")
        .value
        .trim();

    if (searchValue === "") {

        getAllMeals();
        
        return;

    }

    try {

        let response = await fetch(
            `https://nutriplan-api.vercel.app/api/meals/search?q=${searchValue}&page=1&limit=25`
        );

        let data = await response.json();

        allMeals = data.results;
displayMeals();
    } catch (error) {
        console.log(error);
    }
}
//filter by category area
async function getAllAreas() {

    try {

        let response = await fetch(
            "https://nutriplan-api.vercel.app/api/meals/areas"
        );

        let data = await response.json();

        allAreas = data.results;

        displayAreas();

    } catch (error) {

        console.log(error);

    }

}
function displayAreas() {

    let cartona = `
        <button
            class="area-filter-btn px-4 py-2 bg-emerald-600 text-white rounded-full"
            data-area="">
            All Cuisines
        </button>
    `;

    for (let i = 0; i < 10; i++) {

        cartona += `
            <button
                class="area-filter-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full"
                data-area="${allAreas[i].name}">
                ${allAreas[i].name}
            </button>
        `;

    }

    document.getElementById("areas-container").innerHTML = cartona;

}
document
.getElementById("areas-container")
.addEventListener("click", function(e){

    if(!e.target.classList.contains("area-filter-btn")) return;

    document
    .querySelectorAll(".area-filter-btn")
    .forEach(btn=>{

        btn.classList.remove(
            "bg-emerald-600",
            "text-white"
        );

        btn.classList.add(
            "bg-gray-100",
            "text-gray-700"
        );

    });

    e.target.classList.remove(
        "bg-gray-100",
        "text-gray-700"
    );

    e.target.classList.add(
        "bg-emerald-600",
        "text-white"
    );

    filterByArea(
        e.target.dataset.area
    );

});
async function getAreas() {
    let response = await fetch("https://nutriplan-api.vercel.app/api/meals/areas");
    let data = await response.json();

}
async function filterByArea(area) { 
showLoading("recipes-grid");
  let url="";

    if(area==""){

        getAllMeals();
        return;
    } 
    url=`https://nutriplan-api.vercel.app/api/meals/filter?area=${encodeURIComponent(area)}`;

    try {

          let response=await fetch(url);

if(!response.ok){

throw new Error("Network Error");

}
    let data=await response.json();

    allMeals=data.results;

    displayMeals();

    } catch (error) {

        console.log(error);

    }

}
const categories = [
  {
    name: "Beef",
    icon: "fa-drumstick-bite",
    bg: "from-red-50 to-pink-50",
    border: "border-red-200",
    iconBg: "from-red-400 to-pink-500"
  },
  {
    name: "Chicken",
    icon: "fa-drumstick-bite",
    bg: "from-yellow-50 to-orange-50",
    border: "border-yellow-200",
    iconBg: "from-yellow-400 to-orange-500"
  },
  {
    name: "Dessert",
    icon: "fa-cake-candles",
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200",
    iconBg: "from-pink-400 to-rose-500"
  },
  {
    name: "Lamb",
    icon: "fa-drumstick-bite",
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    iconBg: "from-orange-400 to-amber-500"
  },
  {
    name: "Miscellaneous",
    icon: "fa-bowl-food",
    bg: "from-slate-50 to-gray-50",
    border: "border-slate-200",
    iconBg: "from-slate-400 to-gray-500"
  },
  {
    name: "Pasta",
    icon: "fa-bowl-food",
    bg: "from-yellow-50 to-yellow-100",
    border: "border-yellow-300",
    iconBg: "from-yellow-400 to-yellow-500"
  },
  {
    name: "Pork",
    icon: "fa-bacon",
    bg: "from-red-50 to-rose-50",
    border: "border-red-200",
    iconBg: "from-red-400 to-rose-500"
  },
  {
    name: "Seafood",
    icon: "fa-fish",
    bg: "from-sky-50 to-cyan-50",
    border: "border-sky-200",
    iconBg: "from-sky-400 to-cyan-500"
  },
  {
    name: "Side",
    icon: "fa-burger",
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200",
    iconBg: "from-green-400 to-emerald-500"
  },
  {
    name: "Starter",
    icon: "fa-utensils",
    bg: "from-cyan-50 to-teal-50",
    border: "border-cyan-200",
    iconBg: "from-cyan-400 to-teal-500"
  },
  {
    name: "Vegan",
    icon: "fa-leaf",
    bg: "from-green-50 to-lime-50",
    border: "border-green-200",
    iconBg: "from-green-500 to-lime-500"
  },
  {
    name: "Vegetarian",
    icon: "fa-seedling",
    bg: "from-lime-50 to-green-50",
    border: "border-lime-200",
    iconBg: "from-lime-400 to-green-500"
  }
];
displayCategories();

function displayCategories() {

    let cartona = "";

    for (let category of categories) {

        cartona += `
        <div
            class="category-card bg-gradient-to-br ${category.bg}
            rounded-xl p-3 border ${category.border}
            hover:shadow-md cursor-pointer transition-all group"
            data-category="${category.name}">

            <div class="flex items-center gap-2.5">

                <div class="w-9 h-9 rounded-lg flex items-center justify-center
                bg-gradient-to-br ${category.iconBg} text-white">

                    <i class="fa-solid ${category.icon}"></i>

                </div>

                <h3 class="text-sm font-bold">
                    ${category.name}
                </h3>

            </div>

        </div>
        `;
    }

    document.getElementById("categories-grid").innerHTML = cartona;
}
document
.getElementById("categories-grid")
.addEventListener("click", function(e){

    let card = e.target.closest(".category-card");

    if(!card) return;

    filterByCategory(card.dataset.category);

});
async function filterByCategory(category){
 showLoading("recipes-grid");

    try{

        let response = await fetch(
`https://nutriplan-api.vercel.app/api/meals/filter?category=${category}&page=1&limit=25`
        );

        let data = await response.json();

        allMeals = data.results || [];

        displayMeals();

    }

    catch(error){

        console.log(error);

    }

} 
//Product Scanner
let allProducts = [];
let filteredProducts = [];
let currentNutriGrade = "";
async function searchProducts() {

    let value = document
        .getElementById("product-search-input")
        .value.trim();

    if(value==""){
    allProducts=[];

    filteredProducts=[];

    displayProducts(); 
        return;

    } 
    showLoading("products-grid");

  let response = await fetch(
`https://nutriplan-api.vercel.app/api/products/search?q=${value}&page=1&limit=24`
);

let data = await response.json();
allProducts = data.results || []; 
filterProducts();
}
document
.getElementById("product-search-input")
.addEventListener("keydown",function(e){

if(e.key==="Enter"){

searchProducts();

}

});
document
.getElementById("search-product-btn")
.addEventListener("click",searchProducts);
 document
.getElementById("barcode-input")
.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        searchBarcode();

    }

});
async function searchBarcode() {

    let barcode = document.getElementById("barcode-input").value.trim();
 
    if (barcode === "") return;

    showLoading("products-grid");

    try {

        let response = await fetch(
            `https://nutriplan-api.vercel.app/api/products/barcode/${barcode}`
        );

        let data = await response.json();

        if (data.result) {

            allProducts = [data.result];
            filteredProducts = [...allProducts];

        } else {

            allProducts = [];
            filteredProducts = [];

        }

        displayProducts();

    } catch (error) {
    console.log(error);

    allProducts=[];

    filteredProducts=[];

    displayProducts();

    }

}
document
.getElementById("lookup-barcode-btn")
.addEventListener("click",searchBarcode);
function displayProducts(){
if (filteredProducts.length === 0) {

        document.getElementById("products-grid").innerHTML = `
            <div class="col-span-full">
                <div class="py-12">
                    <div class="text-center">

                        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fa-solid fa-box-open text-3xl text-gray-400"></i>
                        </div>

                        <p class="text-gray-500 text-lg mb-2">
                            No products to display
                        </p>

                        <p class="text-gray-400 text-sm">
                            Search for a product or browse by category
                        </p>

                    </div>
                </div>
            </div>
        `;

        document.getElementById("products-count").innerHTML = "0 products found";

        return;
    }

let cartona="";

for(let product of filteredProducts){

cartona+=`
<div onclick="getProductDetails('${product.barcode}')"
    class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
    data-barcode="${product.barcode}"
>

    <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">

        <img
            class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          src="${product.image || './src/images/placeholder.png'}"
            alt="${product.name}"
            loading="lazy"
        />

        <!-- Nutri Score -->
        <div
            class="absolute top-2 left-2
            bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
        >
            Nutri-Score ${product.nutritionGrade || "-"}
        </div>

        <!-- NOVA -->
        <div
            class="absolute top-2 right-2
            bg-lime-500 text-white text-xs font-bold
            w-6 h-6 rounded-full flex items-center justify-center"
        >
            ${product.novaGroup || "-"}
        </div>

    </div>

    <div class="p-4">

        <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
            ${product.brand || "Unknown Brand"}
        </p>

        <h3
            class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
        >
            ${product.name}
        </h3>

        <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">

            <span>
                <i class="fa-solid fa-weight-scale mr-1"></i>
                ${product.quantity || "-"}
            </span>

            <span>
                <i class="fa-solid fa-fire mr-1"></i>
                ${product.nutrients?.calories ?? "-"} kcal
            </span>

        </div>

        <div class="grid grid-cols-4 gap-1 text-center">

            <div class="bg-emerald-50 rounded p-1.5">
                <p class="text-xs font-bold text-emerald-700">
                 ${(product.nutrients?.protein ?? 0).toFixed(1)}g
                </p>
                <p class="text-[10px] text-gray-500">
                    Protein
                </p>
            </div>

            <div class="bg-blue-50 rounded p-1.5">
                <p class="text-xs font-bold text-blue-700">
               ${(product.nutrients?.carbs ?? 0).toFixed(1)}g
                </p>
                <p class="text-[10px] text-gray-500">
                    Carbs
                </p>
            </div>

            <div class="bg-purple-50 rounded p-1.5">
                <p class="text-xs font-bold text-purple-700">
                    ${(product.nutrients?.fat ?? 0).toFixed(1)}g
                </p>
                <p class="text-[10px] text-gray-500">
                    Fat
                </p>
            </div>

            <div class="bg-orange-50 rounded p-1.5">
                <p class="text-xs font-bold text-orange-700">
                ${(product.nutrients?.sugar ?? 0).toFixed(1)}g
                </p>
                <p class="text-[10px] text-gray-500">
                    Sugar
                </p>
            </div>

        </div>

    </div>

</div>

`;

}

document.getElementById("products-grid").innerHTML=cartona;

document.getElementById("products-count").innerHTML=
`${filteredProducts.length} products found`;

}
document.querySelectorAll(".nutri-score-filter").forEach(btn => {

    btn.addEventListener("click", function () {

        document.querySelectorAll(".nutri-score-filter").forEach(b => {

            b.classList.remove(
                "bg-emerald-600",
                "text-white"
            );

            b.classList.add(
                "bg-gray-100"
            );

        });

        this.classList.remove("bg-gray-100");

        this.classList.add(
            "bg-emerald-600",
            "text-white"
        );

        currentNutriGrade = this.dataset.grade;

        filterProducts();

    });

});
 function filterProducts(){

    if(currentNutriGrade==""){

        filteredProducts=[...allProducts];

    }else{

        filteredProducts=allProducts.filter(product=>

            product.nutritionGrade?.toLowerCase() === currentNutriGrade

        );

    }

    displayProducts();

}
 
 async function getProductDetails(barcode) {

    try {

        let response = await fetch(
            `https://nutriplan-api.vercel.app/api/products/barcode/${barcode}`
        );

        let data = await response.json();  

        if(data.result){

            currentProduct = data.result; 

    openProductPopup();

 
        }else{

        Swal.fire({

icon:"error",

title:"Product not found",
 
});

        }


    }

    catch(error){

        console.log(error);

    }

}
function getGradeColor(grade){

    switch((grade || "").toLowerCase()){

        case "a":
            return "#16a34a";

        case "b":
            return "#65a30d";

        case "c":
            return "#facc15";

        case "d":
            return "#f97316";

        case "e":
            return "#dc2626";

        case "f":
            return "#f59e0b";
        case "g":
            return "#f59e4";
            
        case "h":
            return "#ff3059";
        case "n":
            return "#00b9df";
        default:
            return "#6b7280";

    }

}
function openProductPopup(){

const gradeColor=getGradeColor(currentProduct.nutritionGrade);
Swal.fire({

    width:850, 
    showConfirmButton:false,
customClass:{
    popup:"rounded-3xl"
},
    html:`

    <div>

<div>  
 <div class="flex items-start gap-6 mb-6">
<div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
    <img
        src="${currentProduct.image || './src/images/placeholder.png'}"
        class="w-full h-full object-contain">
</div>
    <div class="flex-1 text-left">

        <p class="text-sm text-emerald-600 font-semibold mb-2">
            ${currentProduct.brand || "Unknown Brand"}
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-2">
            ${currentProduct.name}
        </h2>

        <p class="text-sm text-gray-500 mb-3">
            ${currentProduct.quantity || ""}
        </p>

<div class="flex gap-4 mt-6 mb-6">

    <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${gradeColor}20">
 
<span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${gradeColor}">

            ${currentProduct.nutritionGrade || "-"}
</span>  
        <div>

            <p class="text-xs font-bold" style="color: ${gradeColor}">

                Nutri-Score

            </p>

            <p class="text-[10px] text-gray-600">

                ${getGradeText(currentProduct.nutritionGrade)}

            </p>

        </div>

    </div>
    <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${gradeColor}20">
 
<span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${gradeColor}">
            ${currentProduct.novaGroup || "-"}
</span> 

        <div>

            <p class="text-xs font-bold" style="color: ${gradeColor}">

                NOVA

            </p>

            <p class="text-[10px] text-gray-600">

                ${getNovaText(currentProduct.novaGroup)}

            </p>

        </div>

    </div>

</div>
    </div>
 
 <button
        onclick="Swal.close()"
        class="close-product-modal text-gray-400 hover:text-gray-600">

        <i class="fa-solid fa-xmark text-2xl text-gray-500"></i>

    </button>
 
</div>

</div>
<div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">

    <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">

        <i class="fa-solid fa-chart-pie text-emerald-600"></i>

        Nutrition Facts

        <span class="text-sm font-normal text-gray-500">
            (per 100g)
        </span>

    </h3>

    <div class="text-center mb-4 pb-4 border-b border-emerald-200">

        <p class="text-4xl font-bold text-gray-900">

            ${currentProduct.nutrients?.calories ?? "-"}

        </p>

        <p class="text-sm text-gray-500">
            Calories
        </p>

    </div>

    <div class="grid grid-cols-4 gap-4">

        ${nutritionItem(
            "emerald",
            "Protein",
            currentProduct.nutrients?.protein,
            50
        )}

        ${nutritionItem(
            "blue",
            "Carbs",
            currentProduct.nutrients?.carbs,
            100
        )}

        ${nutritionItem(
            "purple",
            "Fat",
            currentProduct.nutrients?.fat,
            65
        )}

        ${nutritionItem(
    "orange",
    "Sugar",
    currentProduct.nutrients?.sugar,
    50
)}

    </div>

    <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">

        <div class="text-center">

            <p class="text-sm font-semibold text-gray-900">
                ${formatNumber(currentProduct.nutrients?.saturatedFat ?? "-")}g
            </p>

            <p class="text-xs text-gray-500">
                Saturated Fat
            </p>

        </div>

        <div class="text-center">

            <p class="text-sm font-semibold text-gray-900">
                ${formatNumber(currentProduct.nutrients?.fiber ?? "-")}g
            </p>

            <p class="text-xs text-gray-500">
                Fiber
            </p>

        </div>

        <div class="text-center">

            <p class="text-sm font-semibold text-gray-900">
                ${formatNumber(currentProduct.nutrients?.salt ?? "-")}g
            </p>

            <p class="text-xs text-gray-500">
                Salt
            </p>

        </div>

    </div>

</div>
<div class="bg-gray-50 rounded-xl p-5 mb-6">

    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">

        <i class="fa-solid fa-list text-gray-600"></i>

        Ingredients

    </h3>

    <p class="text-sm text-gray-600 leading-relaxed">

        ${currentProduct.ingredients || "No ingredients available"}

    </p>

</div>

${currentProduct.allergens ? `

<div class="bg-red-50 rounded-xl p-5 mb-6 border border-red-200">

    <h3 class="font-bold text-red-700 mb-2 flex items-center gap-2">

        <i class="fa-solid fa-triangle-exclamation"></i>

        Allergens

    </h3>

    <p class="text-sm text-red-600">

        ${currentProduct.allergens}

    </p>

</div>

` : ""}
   <div class="flex gap-3 mt-8">

    <button
        id="log-product-btn"
        class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition">

        <i class="fa-solid fa-plus mr-2"></i>

        Log This Food

    </button>

    <button
        onclick="Swal.close()"
        class="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-semibold transition">

        Close

    </button>

</div>
    </div>


    `,
        didOpen: () => {

            document
                .getElementById("log-product-btn")
                .addEventListener("click", () => {

                    saveProduct();

                    Swal.close();

                    Swal.fire({
                        icon:"success",
                        title:"Product Logged!"
                    });

                });

        }

});


}

function nutritionItem(color, title, value, max) {

    value = Number(value || 0);

    let percent = (value / max) * 100;

    if (percent > 100) percent = 100;

    return `

    <div class="text-center">

        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">

            <div
                class="bg-${color}-500 h-2 rounded-full"
                style="width:${percent}%">
            </div>

        </div>

        <p class="text-lg font-bold text-${color}-600">

            ${value.toFixed(1)}g

        </p>

        <p class="text-xs text-gray-500">

            ${title}

        </p>

    </div>

    `;
}
function formatNumber(value) {

    if (value == null || value === "") return "-";

    return Number(value).toFixed(1);

}
function getGradeText(grade){

    switch((grade || "").toLowerCase()){

        case "a":
            return "Excellent";

        case "b":
            return "Good";

        case "c":
            return "Average";

        case "d":
            return "Poor";

        case "e":
            return "Bad";

        default:
            return "Unknown";

    }

}
function getNovaText(nova){

    switch(Number(nova)){

        case 1:
            return "Unprocessed";

        case 2:
            return "Processed ingredients";

        case 3:
            return "Processed";

        case 4:
            return "Ultra-processed";

        default:
            return "-";

    }

}

async function getCategories() {
    try {
        let response = await fetch("https://nutriplan-api.vercel.app/api/products/categories");
        let data = await response.json();

     productCategories = data.results;

        displayProductCategories();

    } catch (error) {
        console.log(error);
    }
}
getCategories();
function displayProductCategories() {

    let cartona = ` `;

    for (const category of productCategories) {

        cartona += `
            <button
                class="product-category-btn flex-shrink-0 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                onclick="loadCategory('${category.id}', this)">
                ${category.name}
            </button>
        `;
    }

    document.getElementById("product-categories").innerHTML = cartona;
}
 async function loadCategory(categoryId, btn) {

    document.querySelectorAll(".product-category-btn").forEach(button => {

        button.classList.remove(
            "bg-emerald-600",
            "text-white",
            "active"
        );

        button.classList.add("bg-gray-100");

    });

    btn.classList.remove("bg-gray-100");

    btn.classList.add(
        "bg-emerald-600",
        "text-white",
        "active"
    );
 
    showLoading("products-grid");

    try {

        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/products/category/${categoryId}`
        );

        const data = await response.json();
 
allProducts = data.results || [];
filteredProducts = [...allProducts];

filterProducts(); 

    } catch (err) {

        console.log(err);

    }

} 
/******foodLog********* */
let foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];
function saveFoodLog(item){

    foodLog.push(item);

    localStorage.setItem(
        "foodLog",
        JSON.stringify(foodLog)
    );

}
function saveProduct(){

let item={

    id:Date.now(),

    type:"product",

    name:currentProduct.name,

    image:currentProduct.image,

  calories: currentProduct.nutrients?.calories || 0,
protein: currentProduct.nutrients?.protein || 0,
carbs: currentProduct.nutrients?.carbs || 0,
fat: currentProduct.nutrients?.fat || 0,

    servings:1,

    date:new Date().toISOString().split("T")[0]

};

saveFoodLog(item);
    loadFoodLog();
}
function loadFoodLog(){
  const currentDate = new Date();

document.getElementById("foodlog-date").innerHTML =
currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
});

foodLog =
JSON.parse(localStorage.getItem("foodLog")) || [];

const today =
currentDate.toISOString().split("T")[0];

let todayItems =
foodLog.filter(item => item.date === today);

    const weekData = getWeekData();

    displayFoodLog(todayItems);

    displayWeeklyOverview(weekData);

    updateWeeklyStats(weekData);

}

function displayFoodLog(items){

let container=
document.getElementById("logged-items-list");

if (items.length === 0) {

    container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-14 text-center">

            <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">

                <i class="fa-solid fa-utensils text-3xl text-gray-400"></i>

            </div>

            <h3 class="text-xl font-semibold text-gray-700">
                No food logged today
            </h3>

            <p class="text-gray-500 mt-2 mb-6">
                Start tracking your nutrition by logging meals or scanning products
            </p>

            <div class="flex gap-3">

                <button
                    id="browse-recipes-btn"
                    class="px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition">

                    <i class="fa-solid fa-plus mr-2"></i>
                    Browse Recipes

                </button>

                <button
                    id="scan-product-btn"
                    class="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">

                    <i class="fa-solid fa-barcode mr-2"></i>
                    Scan Product

                </button>

            </div>

        </div>
    `;

    document.getElementById("logged-count").innerHTML = 0;

    document.getElementById("clear-foodlog").style.display = "none";

    updateSummary([]);

    document.getElementById("browse-recipes-btn")
        .addEventListener("click", () => {

            showHomePage();
            setActiveLink(document.getElementById("recipes-link"));

        });

    document.getElementById("scan-product-btn")
        .addEventListener("click", () => {

            showProductsPage();
            setActiveLink(document.getElementById("products-link"));

        });

    return;
}

let cartona="";

items.forEach(item=>{

cartona += `

<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4">

<div class="flex items-center gap-4">

<img
src="${item.image}"
class="w-14 h-14 rounded-lg object-cover">

<div>

<h4 class="font-semibold">
${item.name}
</h4>

<p class="text-sm text-gray-500">
${item.servings} serving
</p>

</div>

</div>

<div class="flex items-center gap-6">

<div class="text-center">

<p class="font-bold text-emerald-600">
${item.calories}
</p>

<p class="text-xs text-gray-500">
kcal
</p>

</div>

<div class="text-xs text-gray-500">
${item.protein}g P
</div>

<div class="text-xs text-gray-500">
${item.carbs}g C
</div>

<div class="text-xs text-gray-500">
${item.fat}g F
</div>

<button
onclick="deleteFood(${item.id})"
class="text-red-500 hover:text-red-700">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

});

container.innerHTML=cartona;
document.getElementById("logged-count").innerHTML =
items.length;
const clearBtn =
document.getElementById("clear-foodlog");

clearBtn.style.display =
items.length ? "block" : "none";
updateSummary(items);

} 
function updateSummary(items) {

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    items.forEach(item => {
        calories += Number(item.calories);
        protein += Number(item.protein);
        carbs += Number(item.carbs);
        fat += Number(item.fat);
    });

    const caloriesGoal = 2000;
    const proteinGoal = 50;
    const carbsGoal = 250;
    const fatGoal = 65;

    document.getElementById("calories-value").innerHTML =
        `${calories} / ${caloriesGoal} kcal`;

    document.getElementById("protein-value").innerHTML =
        `${protein} / ${proteinGoal} g`;

    document.getElementById("carbs-value").innerHTML =
        `${carbs} / ${carbsGoal} g`;

    document.getElementById("fat-value").innerHTML =
        `${fat} / ${fatGoal} g`;

    document.getElementById("calories-progress").style.width =
        `${Math.min(calories / caloriesGoal * 100,100)}%`;

    document.getElementById("protein-progress").style.width =
        `${Math.min(protein / proteinGoal * 100,100)}%`;

    document.getElementById("carbs-progress").style.width =
        `${Math.min(carbs / carbsGoal * 100,100)}%`;

    document.getElementById("fat-progress").style.width =
        `${Math.min(fat / fatGoal * 100,100)}%`;
}
function deleteFood(id){

foodLog=foodLog.filter(item=>item.id!==id);

localStorage.setItem(
"foodLog",
JSON.stringify(foodLog)
);

loadFoodLog();

    displayWeeklyOverview(getWeekData());
}
function clearFoodLog(){

foodLog=[];

localStorage.setItem(

"foodLog",

JSON.stringify(foodLog)

);

loadFoodLog();

    displayWeeklyOverview(getWeekData());
}
  
document
.getElementById("clear-foodlog")
.addEventListener("click",clearFoodLog);
function displayWeeklyOverview(data){

    let cartona = "";

    data.forEach(day => {

        cartona += `
        <div class="text-center ${day.today ? 'bg-indigo-100 rounded-xl p-2' : ''}">

            <p class="text-xs text-gray-500">${day.dayName}</p>

            <p class="font-semibold">${day.dayNumber}</p>

            <div class="mt-2 ${day.calories ? 'text-emerald-600' : 'text-gray-300'}">

                <p class="text-lg font-bold">${day.calories}</p>

                <p class="text-xs">kcal</p>

            </div>

            ${
                day.items
                ? `<p class="text-xs text-gray-400">${day.items} items</p>`
                : ""
            }

        </div>
        `;
    });

    document.getElementById("weekly-overview").innerHTML = cartona;
}
function getWeekData() {

    let foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];

    let today = new Date();

    let weekData = [];

    for (let i = 6; i >= 0; i--) {

        let date = new Date();
        date.setDate(today.getDate() - i);

        let dateString = date.toISOString().split("T")[0];

        let meals = foodLog.filter(item => item.date === dateString);

        let calories = meals.reduce((sum, meal) => sum + Number(meal.calories), 0);

        weekData.push({
            dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
            dayNumber: date.getDate(),
            calories: calories,
            items: meals.length,
            today: dateString === today.toISOString().split("T")[0]
        });

    }

    return weekData;
}
displayWeeklyOverview(getWeekData());
 function updateWeeklyStats(data){

    let totalCalories = 0;
    let totalItems = 0;
    let goalDays = 0;

    data.forEach(day => {

        totalCalories += day.calories;
        totalItems += day.items;

        if(day.calories >= 1800 && day.calories <= 2200){

            goalDays++;

        }

    });

    const average = Math.round(totalCalories / 7);

    document.getElementById("weekly-average").innerHTML =
        `${average} kcal`;

    document.getElementById("weekly-items").innerHTML =
        `${totalItems} items`;

    document.getElementById("goal-days").innerHTML =
        `${goalDays} / 7`;
        

}