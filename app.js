let banner=document.querySelector(".banner");
    bannerposter()
    
// code to generate specific images 
function bannerposter(){

  
  fetch("https://api.unsplash.com/photos/random?query=clothing", {headers:{Authorization:"Client-ID QxT4DOimI2ygNtbcGyK73lZyvyWvpAr3R-yE8o7SNlE"}})
  .then((apiresponse)=>{return apiresponse.json()})
  .then((returneddata)=>{ 
    console.log(returneddata)
    // let imgurl=returneddata.results[0].urls.regular
    let imgurl=returneddata.urls.regular
    banner.innerHTML=`<img src="${imgurl}">`
    
  })
  .catch(error=>alert(error))
}
let card=document.querySelectorAll(".card")

// this function will populate the slider box with elements= array elements
function populatesliderbox(namesArray){
  //select sliderbox
  let sliderbox=document.querySelector(".sliderbox")
  //clear previous cards on reexecution of code
  sliderbox.innerHTML=""
  //function to be applied on each element of namesArray
  namesArray.forEach(name => {
    //create a card
    //create a imgbox
    //create random price 
    //create random discount
    //fetch image
    //add all to the card innerhtml in .then
    //prepend imgbox in card--places child on top
    //append card to slider box
    // number of cards= number of elements
    let card=document.createElement("div")
    card.classList.add("card")
    let imgbox=document.createElement("div")
    imgbox.classList.add("imgbox")
    let price=Math.floor(Math.random()*3000)
    let discount=Math.floor(Math.random()*20)
    
    fetch("https://api.unsplash.com/photos/random?query=sneakers",{headers:{Authorization:"Client-ID QxT4DOimI2ygNtbcGyK73lZyvyWvpAr3R-yE8o7SNlE"}})
    .then((apiresonse)=>{return apiresonse.json()})
    .then((jsonapidata)=>{
      let imgurl=jsonapidata.urls.small;
      imgbox.innerHTML=`<img src="${imgurl}">`
      card.innerHTML=`
          
          <div class="cardname">${name}</div>
          <div class="price">₹${price}</div>
          <div class="discount">${discount}% OFF</div>
          <div class="bag"><i class="fa-solid fa-bag-shopping"></i></div>
          <div class="wishlist"><i class="fa-solid fa-heart"></i></div>`
          card.prepend(imgbox)
    sliderbox.appendChild(card) //these two are added here so that the image loads when the card is loading if put outside imgbox will not render
    })
    .catch((error)=>{alert("Too many images are generated in short time :p ----> "+error)})
    
  });
}

//now when the page loads
populatesliderbox(["The OG's","Charmers","Rizzlers","Swagger","Ether"])

//this will reload the sliderbox
let rightarrow=document.querySelector(".rightarrow").addEventListener("click",function(){
  populatesliderbox(["The OG's","Charmers","Rizzlers","Swagger","Ether"])
})






    
