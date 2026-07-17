interface MainDay {
  icon: string;
  temp: number;
  conditions: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  dateTime: Date;
}

interface NextDay {
  icon: string;
  temp: number;
  conditions: string;
  humidity: number;
  dateTime: Date;
}

interface WeatherData {
  resolvedAddress: string;
  firstDay: MainDay;
  nextDays: Array<NextDay> | Array<MainDay>;
}

interface WeatherDataInterface {
  getCityInfo(city: string): void;
  processarDados(weatherData: object): object;
}

class APIService implements WeatherDataInterface {
  private WeatherAPI = process.env.API_KEY;

  public getCityInfo(city: string): void {
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&include=days%2Ccurrent&key=${this.WeatherAPI}&contentType=json`;
    // faz uma requisição  ao endereço com a url formatada
    url = encodeURI(url);
    fetch(url).then(function (response) {
      return response.json();
    });
  }
  public processarDados(weatherData: WeatherData): object {
    let resolvedAddress = weatherData.resolvedAddress;
    let firstDay: MainDay;
    const FIRST_DAY_INDEX = 0;

    const mainDay = weatherData.nextDays.filter(
      (_, index) => index === FIRST_DAY_INDEX,
    );
    const otherDays = weatherData.nextDays.filter(
      (_: MainDay | NextDay, index: number) => index !== FIRST_DAY_INDEX,
    );

    const processedDays = otherDays
      .slice(0, 4)
      .map((day: NextDay, index: number) => {
        icon: day.icon;
        temp: day.temp;
        conditions: day.conditions;
        humidity: day.humidity;
        datetime: day.dateTime;
      });

    return { mainDay, otherDays };
  }
}
//Implementar o sistema do proxy

