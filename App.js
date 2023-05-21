import React from 'react';
import './style.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherData: null,
      location: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({location: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.location) {
      const location = this.state.location.replace(/ /g, "+");
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid={YOUR_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          if (data.cod === "404") {
            this.setState({ weatherData: null, errorMessage: "Location not found. Please try again." });
          } else {
            this.setState({ weatherData: data, errorMessage: null });
          }
        })
        .catch(error => {
          console.log('There was a problem with the fetch operation: ', error.message);
        });
    } else {
      this.setState({ errorMessage: "Please select a location." });
    }
  }
  
  

  render() {
    let weatherContent;
    if (this.state.weatherData && this.state.weatherData.weather && this.state.weatherData.weather.length > 0) {
      let weatherImage;
      switch (this.state.weatherData.weather[0].main) {
        case 'Clear':
          weatherImage = '/sunny.png';
          break;
        case 'Clouds':
          weatherImage = '/very_cloudy.png';
          break;
        case 'Rain':
          weatherImage = '/rainy.png';
          break;
        default:
          weatherImage = '/cloudy.png';
      }
  
      weatherContent = (
        <div className="weather-container">
          <h1>{this.state.weatherData.name}</h1>
          <img className="weather-image" src={process.env.PUBLIC_URL + weatherImage} alt="Weather" />
          <p>{this.state.weatherData.main.temp}</p>
          <p>{this.state.weatherData.weather[0].description}</p>
        </div>
      );
    }
  
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Location:
            <select value={this.state.location} onChange={this.handleChange}>
              <option value="">Select a location</option>
              <option value="New York, NY, US">New York, NY, US</option>
              <option value="London, England, UK">London, England, UK</option>
              <option value="Tokyo, Japan">Tokyo, Japan</option>
            </select>
          </label>
          <input type="submit" value="Get Weather" />
        </form>
        {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
        {weatherContent}
      </div>
    );
  }
}  

export default App;