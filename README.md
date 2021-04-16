# jb-time-picker web component

this component is 24hour svg-base time picker web component that use wheel to get time from user.
sample: <https://codepen.io/javadbat/pen/yLgjGdv>
## usage

you just need to install it with npm and import it and use tag nothing more.

```command
npm i jb-time-picker
```

import and load web component in any js file

```javascript
import 'jb-time-picker'
```

use it in your html or jsx or any other markup file:

```html
<jb-time-picker></jb-time-picker>
```

## set and get value

you can set or get component value by using standard value property object

```javascript
//get value
console.log(document.querySelector('jb-time-picker').value)
//set value
document.querySelector('jb-time-picker').value = {hour:3,minute:10,second:20}

```

## set time focus

you can focus in one of time unit like hour or minute with code when you need to. for example when you want user pay attention to hour and change it first to do that just call `setTimeUnitFocus` function:

```javascript
//focus on hour
document.querySelector('jb-time-picker').setTimeUnitFocus('hour')
//focus on minute
document.querySelector('jb-time-picker').setTimeUnitFocus('minute')
//focus on second
document.querySelector('jb-time-picker').setTimeUnitFocus('second')

```

## event

```javascript
//on change
document.querySelector('jb-time-picker').addEventListener('change', (e)=>{console.log(e.target.value)});

```
