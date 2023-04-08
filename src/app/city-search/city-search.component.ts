import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { debounceTime } from 'rxjs/operators'

import { WeatherService } from '../weather/weather.service'

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css'],
})
export class CitySearchComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<string>()
  search = new FormControl('', [Validators.minLength(2)])

  constructor(private weatherService: WeatherService) {}
  ngOnInit(): void {
    this.search.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((searchValue: string | null) => {
        if (!this.search.invalid) {
          this.searchEvent.emit(searchValue!)
          const userInput = searchValue!.split(',').map((s) => s.trim())
          this.weatherService
            .getCurrentWeather(
              userInput[0],
              userInput.length > 1 ? userInput[1] : undefined
            )
            .subscribe((data) => console.log(data))
        }
      })
  }
}
