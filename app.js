//not working in js
// document.querySelector(".kidsIcon").style.fontSize = "1vh";



// BANNER 

let banner=document.querySelector(".banner");
    bannerposter() //craetes banner on load reload
    
// code to generate specific images 
function bannerposter(){

  
  fetch("https://api.unsplash.com/photos/random?query=sneaker_art", {headers:{Authorization:"Client-ID QxT4DOimI2ygNtbcGyK73lZyvyWvpAr3R-yE8o7SNlE"}})
  .then((apiresponse)=>{return apiresponse.json()})
  .then((returneddata)=>{ 
    console.log(returneddata)
    // let imgurl=returneddata.results[0].urls.regular
    let imgurl=returneddata.urls.regular
    banner.innerHTML=`<img src="${imgurl}">`
    
  })
  .catch(error=>alert(error))
}

// now 
// Click wishlist icon ➝ add to wishlist

// Click bag icon ➝ add to cart, calculate discounted price

// Update navbar badges in real-time

// Maintain arrays to store wishlist and cart card data

// Store this in localStorage

// On icon click in navbar ➝ go to respective page (wishlist/cart)

// [New] Update badge count dynamically on navbar icons




// Global arrays to store selected cards
let wishlistItems = [];
let bagItems = [];

// Utility: Update badge numbers in navbar
function updateBadges() {
  document.querySelector(".wishlist-badge").innerHTML = wishlistItems.length;
  document.querySelector(".bag-badge").innerHTML= bagItems.length;
}

// Add to wishlist (no duplicates)
//.some checks if there is even a single element satisfying the condition
function addToWishlist(item) {
  let exists = wishlistItems.some(i => i.name === item.name);
  if (!exists) {
    wishlistItems.push(item);
    updateBadges();
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }
}

// Add to cart and calculate final bill
function addToCart(item) {
  let exists = bagItems.some(i => i.name === item.name);
  if (!exists) {
    item.finalPrice = Math.floor(item.price - (item.price * item.discount) / 100);
    bagItems.push(item);
    updateBadges();
    localStorage.setItem("cart", JSON.stringify(bagItems));
  }
}


// SLIDERBOX 

// this function will populate the slider box with elements= array elements

function populatesliderbox(namesArray){
  
  let sliderbox=document.querySelector(".sliderbox")
  
  sliderbox.innerHTML=""
  
  namesArray.forEach(name => {
  
    let card=document.createElement("div")
    card.classList.add("card")
    let imgbox=document.createElement("div")
    imgbox.classList.add("imgbox")
    let price=Math.floor(Math.random()*3000)
    let discount=Math.floor(Math.random()*20)
    
    fetch("https://api.unsplash.com/photos/random?query=sneakers", {
  headers: {
    Authorization: "Client-ID QxT4DOimI2ygNtbcGyK73lZyvyWvpAr3R-yE8o7SNlE"
  }
})
.then((apiresonse) => apiresonse.json())
.then((jsonapidata) => {
  let imgurl = jsonapidata.urls.small;

  // 1️⃣ Set image in imgbox
  imgbox.innerHTML = `<img src="${imgurl}">`;

  // imgbox will be prepend at end 
  card.innerHTML += `
    <div class="cardname">${name}</div>
    <div class="price">₹${price}</div>
    <div class="discount">${discount}% OFF</div>
    <div class="bag"><i class="fa-solid fa-bag-shopping"></i></div>
    <div class="wishlist"><i class="fa-solid fa-heart"></i></div>
  `;

  // 3️⃣ Add image on top
  card.prepend(imgbox);

  // 4️⃣ Append card to slider
  sliderbox.appendChild(card);

  // 5️⃣ ✅ Build item object from current card
  let item = {
    name: name,
    price: price,
    discount: discount,
    img: imgurl
  };

  // 6️⃣ ❤️ Wishlist icon click → add to wishlist
  card.querySelector(".wishlist i").addEventListener("click", function () {
    addToWishlist(item);
  });

  // 7️⃣ 🛍️ Cart icon click → add to cart
  card.querySelector(".bag i").addEventListener("click", function () {
    addToCart(item);
  });
})

.catch((error) => {
  alert("Too many images fetched too quickly 😅: " + error);
});

    
  });
}

//now when the page loads
// writing it like this will cause error when slider isnt loaded and try to populate so there is a better way first we check that dom have a slider box then we will populate it

// populatesliderbox(["The OG's","Charmers","Rizzlers","Swaggers","Ether"])
// better way 
if (document.querySelector(".sliderbox")) {
  populatesliderbox(["The OG's", "Charmers", "Rizzlers", "Swaggers", "Ether"]);
}


//this will reload the sliderbox
let rightarrow = document.querySelector(".rightarrow");
if (rightarrow) {
  rightarrow.addEventListener("click", function () {
    populatesliderbox(["The OG's", "Charmers", "Rizzlers", "Swaggers", "Ether"]);
  });
}




// IN BAG POPULATING THE CARD CONTAINER 

let main=document.querySelector(".main")
let billcontainer=document.querySelector(".billcontainer")

if (main && billcontainer) {
  // only run this logic if on Bag.html
  let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  bagItems = storedCart;
  bagpopulator(bagItems);
  calculateBill(bagItems);
  updateBadges();
}


function bagpopulator(bagItems){
  let bagcards=document.querySelector(".bagcards");
  bagcards.innerHTML="";
  bagItems.forEach(item => {//create card
                            let card=document.createElement("div");
                            card.classList.add("card")
    // Create imgbox
    let imgbox = document.createElement("div");
    imgbox.classList.add("imgbox");
    imgbox.innerHTML = `<img src="${item.img}">`;

    // Card content
    card.innerHTML += `
      <div class="cardname">${item.name}</div>
      <div class="price">Price: ₹${item.price}</div>
      <div class="discount">${item.discount}% OFF</div>
      <div class="finalprice">Final: ₹${item.finalPrice}</div>
    `;
  
    // Prepend imgbox and append to bagcards
    card.prepend(imgbox);
    bagcards.appendChild(card);
  });
}
if (document.querySelector(".bagcards")) {
  // Read cart from localStorage
  let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  bagItems = storedCart;
  bagpopulator(bagItems);
  calculateBill(bagItems);

  updateBadges(); // to sync navbar badges
}





// bill stuff.

function calculateBill(bagItems) {
  let billcontainer = document.querySelector(".billcontainer");
  billcontainer.innerHTML = ""; // Clear previous bill

  let billHTML = `<h2>Bill Summary</h2>`;

  // 1️⃣ List items and calculate subtotal
  let subtotal = 0;
  billHTML += `<ul>`;
  bagItems.forEach(item => {
    billHTML += `<li>${item.name} — ₹${item.finalPrice}</li>`;
    subtotal += item.finalPrice;
  });
  billHTML += `</ul>`;

  // 2️⃣ Add taxes and charges
  let gst = Math.floor(subtotal * 0.28);
  let delivery = Math.floor(subtotal * 0.10);
  let finalTotal = subtotal + gst + delivery;

  // 3️⃣ Display final totals
  billHTML += `
    <p>Subtotal: ₹${subtotal}</p>
    <p>GST (28%): ₹${gst}</p>
    <p>Delivery (10%): ₹${delivery}</p>
    <hr>
    <h3>Total: ₹${finalTotal}</h3>
  `;

  billcontainer.innerHTML = billHTML;
}


// populating wishlistbox in wishlistItems.html using wishlistItems[]

function populatewishlistbox(wishlistItems){
  let wishlistbox=document.querySelector(".wishlistbox");
  wishlistbox.innerHTML="";
  wishlistItems.forEach(item => {//create card
                            let card=document.createElement("div");
                            card.classList.add("card")
    // Create imgbox
    let imgbox = document.createElement("div");
    imgbox.classList.add("imgbox");
    imgbox.innerHTML = `<img src="${item.img}">`;

    // Card content
    card.innerHTML += `
      <div class="cardname">${item.name}</div>
      <div class="price">Price: ₹${item.price}</div>
      <div class="discount">${item.discount}% OFF</div>
      <div class="finalprice">Final: ₹${item.finalPrice}</div>
    `;
  
    // Prepend imgbox and append to bagcards
    card.prepend(imgbox);
    wishlistbox.appendChild(card);
  });
}
// this will run the above fn 
if (document.querySelector(".wishlistbox")) {
  // Read cart from localStorage
  let storedwishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlistItems = storedwishlist;
  populatewishlistbox(wishlistItems);
  

  updateBadges(); // to sync navbar badges
}