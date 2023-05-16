import React from 'react'
import '../themes/DayNightToggle.css'

export default function DayNightToggle() {
  return (
    <div class = 'switch'>
        <label for="toggle">
            <input type='checkbox' id='toggle'/>
            <div class='bg'></div>
            <div class='sun-moon'></div>
            <div class='background'></div>
        </label>
      
    </div>
  )
}
