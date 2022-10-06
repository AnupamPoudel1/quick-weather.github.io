// personal api key
const apiKey = "065e46007d8901a61072ec35f4d4301a"

const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoText = inputPart.querySelector(".text-part"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header ion-icon");

let api;

inputField.addEventListener("keyup", e =>{
    // if user pressed enter key and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){
        // if browser support geolocation 
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        // if browser doesnot support geolocation 
        alert("Your browser does not support geolocation api");
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api =  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error){
    infoText.innerText = error.message;
    infoText.classList.add("error");
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData(){
    infoText.innerText = "Getting weather details.....";
    infoText.classList.add("pending");
    // getting api response and returning it with parsing into js obj and in another
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoText.innerHTML =  `${inputField.value} isn't a valid city.`;
        infoText.classList.replace("pending", "error");
    }else{
        // getting required properties values from the info object 
        const city = info.name;
        const country = info.sys.country;
        const{description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        // changing weather icon according to weather
        if(id == 800){
            weatherIcon.src = "./Assets/images/clear.svg"
        }else if(id >= 200 && id <= 232){
            weatherIcon.src = "./Assets/images/storm.svg"
        }else if(id >= 600 && id <= 622){
            weatherIcon.src = "./Assets/images/snow.svg"
        }else if(id >= 701 && id <= 781){
            weatherIcon.src = "./Assets/images/haze.svg"
        }else if(id >= 801 && id <= 804){
            weatherIcon.src = "./Assets/images/cloud.svg"
        }else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            weatherIcon.src = "./Assets/images/rain.svg"
        }

        // passing these values to the particular html element 
        wrapper.querySelector(".temperature .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity .numb").innerText = `${humidity}%`;
        
        
        infoText.classList.remove("pending", "error");
        wrapper.classList.add("active");
        console.log(info);
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});