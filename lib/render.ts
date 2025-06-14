export function renderHTML(): string {
  return /* html */ `
  <div class="jb-time-picker-web-component">
    <div class="svg-clock-wrapper">
        <svg class="svg-clock" viewBox="0 0 1024 1024">
            <circle cx="512" cy="512" r="512" class="outer-circle"></circle>
            <circle cx="512" cy="512" r="480" class="inner-circle"></circle>
            <g class="time-text-wrapper substitute-prev-time" mask="url(#PrevTimeWrapperMask)">
            </g>
            <g class="time-text-wrapper prev-time" mask="url(#PrevTimeWrapperMask)">
            </g>
            <g class="time-text-wrapper current-time">
                <text class="separator-text" dominant-baseline="middle" y="512" >:</text>
                <text class="separator-text" dominant-baseline="middle" y="512" >:</text>
            </g>
            <g class="time-text-wrapper next-time" mask="url(#NextTimeWrapperMask)">
            </g>
            <g class="time-text-wrapper substitute-next-time" mask="url(#NextTimeWrapperMask)">
            </g>
            <g class="time-indicators">
                <use class="hour-indicator"  xlink:href="#HourSymbol" x="512" y="512"></use>
                <use class="minute-indicator"  xlink:href="#MinuteSymbol" x="512" y="512"></use>
                <use class="second-indicator"  xlink:href="#SecondSymbol" x="512" y="512"></use>
            </g>
            <defs>
                <linearGradient id="next-time-opacity-filter"  gradientTransform="rotate(90)">
                    <stop offset="0%" style="stop-color: #97999a; stop-opacity: 1.0"/>
                    <stop offset="40%" style="stop-color: #97999a; stop-opacity: 1.0"/>
                    <stop offset="55%" style="stop-color: #97999a; stop-opacity: 0.4"/>
                    <stop offset="70%" style="stop-color: #97999a; stop-opacity: 0.10"/>
                    <stop offset="100%" style="stop-color: #97999a; stop-opacity: 0.0"/>
                </linearGradient>
                <linearGradient id="prev-time-opacity-filter"  gradientTransform="rotate(90)">
                    <stop offset="0%" style="stop-color: #97999a; stop-opacity: 0.0"/>
                    <stop offset="30%" style="stop-color: #97999a; stop-opacity: 0.10"/>
                    <stop offset="45%" style="stop-color: #97999a; stop-opacity: 0.4"/>
                    <stop offset="60%" style="stop-color: #97999a; stop-opacity: 1.0"/>
                    <stop offset="100%" style="stop-color: #97999a; stop-opacity: 1.0"/>
                  </linearGradient>
                  <mask id="PrevTimeWrapperMask">
                    <rect x="0" y="250" width="1024" height="300" fill="url(#prev-time-opacity-filter)"  />
                  </mask>
                  <mask id="NextTimeWrapperMask">
                    <rect x="0" y="450" width="1024" height="300" fill="url(#next-time-opacity-filter)"  />
                  </mask>
                  <g id="HourSymbol">
                      <circle r="50" cx="0" cy="0" class="hour-symbol"></circle>
                  </g>
                  <g id="MinuteSymbol">
                    <circle r="40" cx="0" cy="0" class="minute-symbol"></circle>
                </g>
                <g id="SecondSymbol">
                    <circle r="30" cx="0" cy="0" class="second-symbol"></circle>
                </g>
              </defs>
        </svg>
    </div>
  </div>
  `;
}