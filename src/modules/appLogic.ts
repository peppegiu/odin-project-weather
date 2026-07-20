export interface MainDay {
  icon: string;
  temp: number;
  conditions: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  dateTime: Date;
  city: string;
}

export interface NextDay {
  icon: string;
  temp: number;
  conditions: string;
  humidity: number;
  dateTime: Date;
  city: string;
}

interface WeatherData {
  resolvedAddress: string;
  firstDay: MainDay;
  nextDays: Array<NextDay> | Array<MainDay>;
}

export interface processedWeatherData {
  firstDay: MainDay;
  processedDays: Array<NextDay>;
}

export interface WeatherDataInterface {
  getCityInfo(city: string): void;
  processarDados(weatherData: object): object;
}

export class APIService implements WeatherDataInterface {
  private WeatherAPI = process.env.API_KEY;

  async getCityInfo(city: string): Promise<any> {
    try {
      let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&include=days%2Ccurrent&key=${this.WeatherAPI}&contentType=json`;
      // faz uma requisição  ao endereço com a url formatada
      url = encodeURI(url);

      const response = await fetch(url);

      const data = await response.json;
      return data;
    } catch (error) {
      console.log("Ocorreu um erro:", error);
    }
  }
  public processarDados(weatherData: WeatherData): Partial<processedWeatherData> {
    let resolvedAddress = weatherData.resolvedAddress;
    let firstDay: MainDay | NextDay;
    const FIRST_DAY_INDEX = 0;

    firstDay = weatherData.nextDays[FIRST_DAY_INDEX];
    const otherDays = weatherData.nextDays.filter(
      (_: MainDay | NextDay, index: number) => index !== FIRST_DAY_INDEX,
    );

    const processedDays = otherDays
      .slice(0, 4)
      .map((day: NextDay, index: number) => ({
        icon: day.icon,
        temp: day.temp,
        conditions: day.conditions,
        humidity: day.humidity,
        datetime: day.dateTime,
        city: day.city,
      }));

    return { firstDay, processedDays };
  };
};

export class CachedWeatherAPI implements WeatherDataInterface {
  private service: any;
  private cityCache: Array<MainDay | NextDay> = [];
  private weatherCache : Array<WeatherData> = [];

  constructor(service: any) {
    this.service = service;
  }

  cityExists(city: string) {
    const found = this.cityCache
      .find((day) => day.city == city);
    return found != undefined ? true : false;
  }

  weatherExists(weatherData: WeatherData) {
    const found = this.weatherCache
      .find((weather) => weather.resolvedAddress == weatherData.resolvedAddress);
    return found != undefined ? true : false;
  }

  getCityInfo(city: string): MainDay | NextDay | undefined   {
    if (!this.cityExists(city)) {
      this.cityCache.push(this.service.getCityInfo(city));
    }
    else {
      const cachedCity = this.cityCache.find((day) => day.city == city);
      this.processarDados(cachedCity);
    }
  }

  processarDados(weatherData: WeatherData): processedWeatherData {
    if (this.weatherCache.length != 0) {
      const processedWeatherData = this.service.processarDados(weatherData);
      this.weatherCache.push(processedWeatherData);
      return processedWeatherData;
    }
  }
}

export const APIInstance = new CachedWeatherAPI(new APIService());