import { APIInstance, MainDay, NextDay, processedWeatherData } from "./appLogic.js";



function isNull(element: HTMLElement|null, message: String): boolean {
    if (!element) {
        console.warn(message);
        return true;
    }
    else {
        return false;
    }
}

class InputValidation {


    renderInfo(weatherData: processedWeatherData) {
        const firstDay: MainDay = weatherData.firstDay
        const cityName : HTMLElement|null = document.querySelector(".city-name");
        const  countryName: HTMLElement|null = document.querySelector("#country-name");
        const statusEl: HTMLElement|null = document.querySelector("#country");
        const sensacao = HTMLElement|null = document.querySelector("#sensacao");
        const weatherStatus = HTMLElement|null = document.querySelector("#status-weather");
        const temperature = HTMLElement|null = document.querySelector("#temperature");
        const umidityElement = HTMLElement|null = document.querySelector("#medida-umidade");
        const windElement = HTMLElement|null = document.querySelector("#medida-ar");
        const visibilityElement = HTMLElement|null = document.querySelector("#medida-visibilidade");
        const medidaPressao = HTMLElement|null = document.querySelector("#medida-pressao");

        cityName.innerText = firstDay.city;
        statusEl?.innerText = firstDay.conditions;
        sensacao.innerText = firstDay.feelsLike;
        weatherStatus.innerText = firstDay.conditions;
        temperature.innerText = firstDay.temp;
        umidityElement.innerText = firstDay.humidity;
        windElement.innerText = firstDay.windSpeed;
        visibilityElement.innerText = firstDay.visibility;
        medidaPressao.innerText = firstDay.pressure;
        //change the icons dynamically
    }   

    init() {
        const searchInput: HTMLInputElement|null = document.querySelector("#search-input");
        const searchButton: HTMLButtonElement|HTMLElement|null = document.querySelector("#search-button");
        if (isNull(searchButton, "search button is null")) {
            searchButton!.addEventListener("click", () => {
            //fun~ao de pesquisa do appLogic.js
            const processedWeatherData = APIInstance.getCityInfo(searchInput!.value);
        })
        }  
    }
}


