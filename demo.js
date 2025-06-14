// Every page-specific feature is safely wrapped in checks.

// No more "null property" errors.

// Includes wishlist, bag/cart, and homepage logic correctly isolated.

// because it was showing cant read properties of null while opening bag and wishlist page 





// -------- BANNER (index.html) --------
if (document.querySelector(".banner")) {
  bannerposter();

  function bannerposter() {
    fetch("https://api.unsplash.com/photos/random?query=sneaker", {
      headers: {
        Authorization: "Client-ID QxT4DOimI2ygNtbcGyK73lZyvyWvpAr3R-yE8o7SNlE"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        let imgurl = data.urls.regular;
        
      let banner = document.querySelector(".banner");

      // Create <img> element for background
      let bannerbg = document.createElement("img");
      bannerbg.classList.add("bannerbg");
      // as the created element is an img .src can give its source that stored im=n imgurl 
      bannerbg.src=imgurl; 
      

      // Append image WITHOUT removing existing headings
      banner.appendChild(bannerbg);
      })
      .catch((error) => alert(error));
  }
}

// -------- Global Arrays & Badge Update --------
let wishlistItems = [];
let bagItems = [];

function updateBadges() {
  const wishBadge = document.querySelector(".wishlist-badge");
  const bagBadge = document.querySelector(".bag-badge");
  if (wishBadge) wishBadge.innerHTML = wishlistItems.length;
  if (bagBadge) bagBadge.innerHTML = bagItems.length;
}

// -------- Add to Wishlist --------
function addToWishlist(item) {
  let exists = wishlistItems.some(i => i.name === item.name);
  if (!exists) {
    wishlistItems.push(item);
    updateBadges();
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }
}

// -------- Add to Cart --------
function addToCart(item) {
  let exists = bagItems.some(i => i.name === item.name);
  if (!exists) {
    item.finalPrice = Math.floor(item.price - (item.price * item.discount) / 100);
    bagItems.push(item);
    updateBadges();
    localStorage.setItem("cart", JSON.stringify(bagItems));
  }
}

// -------- Homepage: Slider Population (index.html) --------
if (document.querySelector(".sliderbox")) {
  const names = ["OG's", "Charm", "Riz", "Swag", "Ether"];
  populatesliderbox(names);

  function populatesliderbox(namesArray) {
    const sliderbox = document.querySelector(".sliderbox");
    sliderbox.innerHTML = "";

    namesArray.forEach(name => {
      const card = document.createElement("div");
      card.classList.add("card");

      const imgbox = document.createElement("div");
      imgbox.classList.add("imgbox");

      const price = Math.floor(Math.random() * 3000);
      const discount = Math.floor(Math.random() * 20);

      fetch("https://api.unsplash.com/photos/random?query=sneakers", {
        headers: {
          Authorization: "Client-ID QxT4DOimI2ygNtbcGyK73lZyvyWvpAr3R-yE8o7SNlE"
        }
      })
        .then((res) => res.json())
        .then((data) => {
          let imgurl = data.urls.small;
          imgbox.innerHTML = `<img src="${imgurl}">`;

          card.innerHTML += `
            <div class="cardname">${name}</div>
            <div class="price">₹${price}</div>
            <div class="discount">${discount}% OFF</div>
            <div class="bag"><i class="fa-solid fa-bag-shopping"></i></div>
            <div class="wishlist"><i class="fa-solid fa-heart"></i></div>
          `;
          card.prepend(imgbox);
          sliderbox.appendChild(card);

          const item = { name, price, discount, img: imgurl };

          card.querySelector(".wishlist i").addEventListener("click", () => addToWishlist(item));
          card.querySelector(".bag i").addEventListener("click", () => addToCart(item));
        })
        .catch(err => alert("Too many requests: " + err));
    });
  }

  const rightarrow = document.querySelector(".rightarrow");
  if (rightarrow) {
    rightarrow.addEventListener("click", () => populatesliderbox(names));
  }
}

// -------- Bag Page --------
if (document.querySelector(".bagcards")) {
  bagItems = JSON.parse(localStorage.getItem("cart")) || [];
  updateBadges();
  bagpopulator(bagItems);
  calculateBill(bagItems);

  function bagpopulator(items) {
    const bagcards = document.querySelector(".bagcards");
    bagcards.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");

      const imgbox = document.createElement("div");
      imgbox.classList.add("imgbox");
      imgbox.innerHTML = `<img src="${item.img}">`;

      card.innerHTML += `
        <div class="cardname">${item.name}</div>
        <div class="price">Price: ₹${item.price}</div>
        <div class="discount">${item.discount}% OFF</div>
        <div class="finalprice">Final: ₹${item.finalPrice}</div>
      `;
      card.prepend(imgbox);
      document.querySelector(".bagcards").appendChild(card);
       
    });

  }

  function calculateBill(items) {
    const billcontainer = document.querySelector(".billcontainer");
    billcontainer.innerHTML = "<h2>Bill Summary</h2><ul></ul>";
    let subtotal = 0;

    items.forEach(item => {
      billcontainer.querySelector("ul").innerHTML += `<li>${item.name} — ₹${item.finalPrice}</li>`;
      subtotal += item.finalPrice;
    });

    const gst = Math.floor(subtotal * 0.28);
    const delivery = Math.floor(subtotal * 0.10);
    const total = subtotal + gst + delivery;

    billcontainer.innerHTML += `
      <p>Subtotal: ₹${subtotal}</p>
      <p>GST (28%): ₹${gst}</p>
      <p>Delivery (10%): ₹${delivery}</p>
      <hr>
      <h3>Total: ₹${total}</h3>
    `;
     
  }
}

// -------- Wishlist Page --------
if (document.querySelector(".wishlistbox")) {
  wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
  updateBadges();
  populatewishlistbox(wishlistItems);

  function populatewishlistbox(items) {
    const wishlistbox = document.querySelector(".wishlistbox");
    wishlistbox.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");

      const imgbox = document.createElement("div");
      imgbox.classList.add("imgbox");
      imgbox.innerHTML = `<img src="${item.img}">`;

      card.innerHTML += `
        <div class="cardname">${item.name}</div>
        <div class="price">Price: ₹${item.price}</div>
        <div class="discount">${item.discount}% OFF</div>
        <div class="finalprice">Final: ₹${item.finalPrice || Math.floor(item.price - (item.price * item.discount) / 100)}</div>
      `;
      card.prepend(imgbox);
      wishlistbox.appendChild(card);
    });
     updateBadges();
  }
}
