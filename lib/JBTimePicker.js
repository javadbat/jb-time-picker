import HTML from './JBTimePicker.html';
import CSS from './JBTimePicker.scss';
const TimeUnits = {
    hour: 'hour',
    minute: 'minute',
    second: 'second'
};
const TimeSteps = {
    substitudePrev: 'substitutePrevTime',
    prev: 'prevTime',
    current: 'currentTime',
    next: 'nextTime',
    substitudeNext: 'substituteNextTime'
};
const ActionTypes = {
    move:'MOVE',
    add1:'ADD_1',
    subtrack1:'SUB_1'
};
class JBTimePickerWebComponent extends HTMLElement {
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    constructor() {
        super();
        this.initWebComponent();
    }
    connectedCallback() {
        // standard web component event that called when all of dom is binded
        this.callOnLoadEvent();
        this.initProp();
        this.callOnInitEvent();

    }
    callOnLoadEvent() {
        var event = new CustomEvent('load', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    callOnInitEvent() {
        var event = new CustomEvent('init', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    initWebComponent() {
        this._shadowRoot = this.attachShadow({
            mode: 'open'
        });
        const html = `<style>${CSS}</style>` + '\n' + HTML;
        const element = document.createElement('template');
        element.innerHTML = html;
        this.shadowRoot.appendChild(element.content.cloneNode(true));
        this.elements = {
            svgDOM: this.shadowRoot.querySelector('.svg-clock'),
            timeIndicators:{
                hour: this.shadowRoot.querySelector('.hour-indicator'),
                minute: this.shadowRoot.querySelector('.minute-indicator'),
                second: this.shadowRoot.querySelector('.second-indicator')
            }
        };
        this.registerEventListener();
    }
    initTimeUnitIndicator(){
        this.placeTimeUnitIndicator(TimeUnits.hour, this.value.hour);
        this.placeTimeUnitIndicator(TimeUnits.minute, this.value.minute);
        this.placeTimeUnitIndicator(TimeUnits.second, this.value.second);
    }
    initTimeTextNodes() {
        //create time text nodes in svg for example 12:39:48
        //                                          13:40:49
        //                                          14:41:50  
        const currentHour = this.value.hour;
        const currentMinute = this.value.minute;
        const currentSecond = this.value.second;
        // substitute prev
        const substitutePrevTimeHour = this.createTimeTextDOM(TimeUnits.hour, TimeSteps.substitudePrev, currentHour-2);
        const substitutePrevTimeMinute = this.createTimeTextDOM(TimeUnits.minute, TimeSteps.substitudePrev, currentMinute - 2);
        const substitutePrevTimeSecond = this.createTimeTextDOM(TimeUnits.second, TimeSteps.substitudePrev, currentSecond - 2);
        const substitutePrevTimeWrapper = this.shadowRoot.querySelector('.substitute-prev-time');
        substitutePrevTimeWrapper.append(substitutePrevTimeHour, substitutePrevTimeMinute, substitutePrevTimeSecond);
        //prev
        const prevTimeHour = this.createTimeTextDOM(TimeUnits.hour, TimeSteps.prev, currentHour - 1);
        const prevTimeMinute = this.createTimeTextDOM(TimeUnits.minute, TimeSteps.prev, currentMinute - 1);
        const prevTimeSecond = this.createTimeTextDOM(TimeUnits.second, TimeSteps.prev, currentSecond - 1);
        const prevTimeWrapper = this.shadowRoot.querySelector('.prev-time');
        prevTimeWrapper.append(prevTimeHour, prevTimeMinute, prevTimeSecond);
        //current
        const currentTimeHour = this.createTimeTextDOM(TimeUnits.hour, TimeSteps.current, currentHour);
        const currentTimeMinute = this.createTimeTextDOM(TimeUnits.minute, TimeSteps.current, currentMinute);
        const currentTimeSecond = this.createTimeTextDOM(TimeUnits.second, TimeSteps.current, currentSecond);
        const currentTimeWrapper = this.shadowRoot.querySelector('.current-time');
        currentTimeWrapper.append(currentTimeHour, currentTimeMinute, currentTimeSecond);
        //next
        const nextTimeHour = this.createTimeTextDOM(TimeUnits.hour, TimeSteps.next, currentHour + 1);
        const nextTimeMinute = this.createTimeTextDOM(TimeUnits.minute, TimeSteps.next, currentMinute + 1);
        const nextTimeSecond = this.createTimeTextDOM(TimeUnits.second, TimeSteps.next, currentSecond + 1);
        const nextTimeWrapper = this.shadowRoot.querySelector('.next-time');
        nextTimeWrapper.append(nextTimeHour, nextTimeMinute, nextTimeSecond);
        // substitute next
        const substituteNextTimeHour = this.createTimeTextDOM(TimeUnits.hour, TimeSteps.substitudeNext, currentHour +2);
        const substituteNextTimeMinute = this.createTimeTextDOM(TimeUnits.minute, TimeSteps.substitudeNext, currentMinute + 2);
        const substituteNextTimeSecond = this.createTimeTextDOM(TimeUnits.second, TimeSteps.substitudeNext, currentSecond + 2);
        const substituteNextTimeWrapper = this.shadowRoot.querySelector('.substitute-next-time');
        substituteNextTimeWrapper.append(substituteNextTimeHour, substituteNextTimeMinute, substituteNextTimeSecond);
        const elementObj = {
            substitutePrevTime: {
                wrapper: substitutePrevTimeWrapper,
                hour: substitutePrevTimeHour,
                minute: substitutePrevTimeMinute,
                second: substitutePrevTimeSecond,
            },
            prevTime: {
                wrapper: prevTimeWrapper,
                hour: prevTimeHour,
                minute: prevTimeMinute,
                second: prevTimeSecond,
            },
            currentTime: {
                wrapper: currentTimeWrapper,
                hour: currentTimeHour,
                minute: currentTimeMinute,
                second: currentTimeSecond,
            },
            nextTime: {
                wrapper: nextTimeWrapper,
                hour: nextTimeHour,
                minute: nextTimeMinute,
                second: nextTimeSecond,
            },
            substituteNextTime: {
                wrapper: substituteNextTimeWrapper,
                hour: substituteNextTimeHour,
                minute: substituteNextTimeMinute,
                second: substituteNextTimeSecond,
            },
        };
        this.elements = {
            ...this.elements,
            ...elementObj
        };
        this.attachMouseDownEventToTimeTextDOM(TimeUnits.hour, TimeSteps.prev);
        this.attachMouseDownEventToTimeTextDOM(TimeUnits.minute, TimeSteps.prev);
        this.attachMouseDownEventToTimeTextDOM(TimeUnits.second, TimeSteps.prev);
        this.attachMouseDownEventToTimeTextDOM(TimeUnits.hour, TimeSteps.current);
        this.attachMouseDownEventToTimeTextDOM(TimeUnits.minute, TimeSteps.current);
        this.attachMouseDownEventToTimeTextDOM(TimeUnits.second, TimeSteps.current);
        this.attachMouseDownEventToTimeTextDOM(TimeUnits.hour, TimeSteps.next);
        this.attachMouseDownEventToTimeTextDOM(TimeUnits.minute, TimeSteps.next);
        this.attachMouseDownEventToTimeTextDOM(TimeUnits.second, TimeSteps.next);

    }
    registerEventListener() {
        this.shadowRoot.addEventListener('mousemove', this.handleTextDrag.bind(this));
        this.shadowRoot.addEventListener('mouseup', this.handleTextMouseUp.bind(this));
    }
    attachMouseDownEventToTimeTextDOM(timeUnit, timeStep) {
        //first we check if there is a binded event we remove it
        const prevBindedEvent = this.elements[timeStep][timeUnit]._bindedMouseDownEvent;
        if (typeof prevBindedEvent == "function") {
            this.elements[timeStep][timeUnit].removeEventListener('mousedown', prevBindedEvent);
        }
        //bind new event
        const eventFunc = (e) => { this.handleTextMouseDown(e, timeUnit, timeStep); };
        this.elements[timeStep][timeUnit].addEventListener('mousedown', eventFunc);
        //we add event to dom object so we can  unsubscribe it later and attach new event again
        this.elements[timeStep][timeUnit]._bindedMouseDownEvent = eventFunc;
    }
    initProp(){
        /**
        * keep vlaue of time picker
        * @private
        * @memberof JBTimePickerWebComponent
        */
        this._value = {
            second:18,
            minute:36,
            hour:20
        };
        this.focusedTimeUnit = null;
        this.grabbedElement = null;
        this.defaultPositions = {
            substitutePrevTimeTextY: 212,
            prevTimeTextY: 362,
            currentTimeTextY: 512,
            nextTimeTextY: 662,
            substituteNextTimeTextY: 812,
            hourTextX: 212,
            minuteTextX: 512,
            secondTextX: 812,
            //y diffrent between two time step
            timeStepYDiff: 150,
            //zarib tabdil dom pos -> svg pos
            svgPosScale: this.elements.svgDOM.getCTM().inverse().a
        };
        this.initTimeTextNodes();
        this.initTimeUnitIndicator();
    }
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // do something when an attribute has changed
        this.onAttributeChange(name, newValue);
    }
    onAttributeChange(name, value) {
        // switch (name) {
        //     // case 'name':
        //     //     break;
        // }

    }
    handleTextMouseDown(e, timeUnit, timeStep) {
        const grabbedElement = this.elements.prevTime[timeUnit];
        this.grabbedElement = {
            dom: grabbedElement,
            timeUnit: timeUnit,
            timeStep: timeStep,
            startY: e.pageY,
            //how many time we add or substract current time unit
            itrationDone: 0,
            // what is the last action we done
            lastAction:null,
            //record all (except move) action occured on this mouse down to next mouse leave
            actionRecords:[],
            addActionRecord:function(action){
                if(action !== ActionTypes.move){this.actionRecords.push(action);}
                this.lastAction= action;
            },
            get lastLogicalAction() {
                return this.actionRecords[this.actionRecords.length-1];
            }
        };
        this.setTimeUnitFocus(timeUnit);
    }
    handleTextDrag(e) {
        if (this.grabbedElement) {
            //how much y change is important to us to change position of element
            const sensetiveDiffValue = 100;
            const yDiff = e.pageY - this.grabbedElement.startY;
            // mouse movement diff is base on dom pixel we must convert them to svg pixcel scale
            const svgYDiff = this.defaultPositions.svgPosScale * yDiff;
            //what we want to do
            let action = ActionTypes.move;//default is just move items
            if((this.grabbedElement.itrationDone == 0 || this.grabbedElement.lastLogicalAction == ActionTypes.add1) && svgYDiff > sensetiveDiffValue){
                action = ActionTypes.subtrack1;
            }
            if((this.grabbedElement.itrationDone == 0 || this.grabbedElement.lastLogicalAction == ActionTypes.subtrack1) && svgYDiff < (-1 * sensetiveDiffValue)){
                action = ActionTypes.add1;
            }
            if (action == ActionTypes.subtrack1) {
                //in this case we try to decrease grabbed time by 1 so we keep track of it.
                this.grabbedElement.itrationDone += 1;
                //remove old next substitude dom becuse it will replaced
                const forDeleteSubDom = this.elements.substituteNextTime[this.grabbedElement.timeUnit];
                this.elements.substituteNextTime[this.grabbedElement.timeUnit] = null;
                forDeleteSubDom.remove();
                //move element to they new right parent 
                this.changeTimeTextParent(this.grabbedElement.timeUnit, TimeSteps.next, TimeSteps.substitudeNext, svgYDiff);
                this.changeTimeTextParent(this.grabbedElement.timeUnit, TimeSteps.current, TimeSteps.next, svgYDiff);
                this.changeTimeTextParent(this.grabbedElement.timeUnit, TimeSteps.prev, TimeSteps.current, svgYDiff);
                this.changeTimeTextParent(this.grabbedElement.timeUnit, TimeSteps.substitudePrev, TimeSteps.prev, svgYDiff);
                // we update mouse y on grab becuase next movement will be calculated base on current mose pos so yDiff calc correctly base on switched places element
                this.grabbedElement.startY = e.pageY;
                //update  grabbed time step after swap changeing done
                this.grabbedElement.timeStep = this.grabbedElement.timeStep == TimeSteps.current? TimeSteps.next : TimeSteps.current;
                // add new prev substitude element
                const currentTime = parseInt(this.elements.currentTime[this.grabbedElement.timeUnit].innerHTML);
                const prevSubstituteValue = currentTime - 2;
                const newSubstitudePrev = this.createTimeTextDOM(this.grabbedElement.timeUnit, TimeSteps.substitudePrev, prevSubstituteValue);
                this.elements.substitutePrevTime.wrapper.appendChild(newSubstitudePrev);
                this.elements.substitutePrevTime[this.grabbedElement.timeUnit] = newSubstitudePrev;
                this.onTimeTextChange( this.grabbedElement.timeUnit ,currentTime);
            } else if (action == ActionTypes.add1) {
                //user scroll up and want to add to time unit
                //in this case we try to increase grabbed time by 1 so we keep track of it.
                this.grabbedElement.itrationDone += 1;
                //remove old prev substitude dom because it will replaced
                const forDeleteSubDom = this.elements.substitutePrevTime[this.grabbedElement.timeUnit];
                this.elements.substitutePrevTime[this.grabbedElement.timeUnit] = null;
                forDeleteSubDom.remove();
                //move element to they new right parent 
                this.changeTimeTextParent(this.grabbedElement.timeUnit, TimeSteps.prev, TimeSteps.substitudePrev, svgYDiff);
                this.changeTimeTextParent(this.grabbedElement.timeUnit, TimeSteps.current, TimeSteps.prev, svgYDiff);
                this.changeTimeTextParent(this.grabbedElement.timeUnit, TimeSteps.next, TimeSteps.current, svgYDiff);
                this.changeTimeTextParent(this.grabbedElement.timeUnit, TimeSteps.substitudeNext, TimeSteps.next, svgYDiff);
                // we update mouse y on grab becuase next movement will be calculated base on current mose pos so yDiff calc correctly base on switched places element
                this.grabbedElement.startY = e.pageY;
                // add new prev substitude element
                const currentTime = parseInt(this.elements.currentTime[this.grabbedElement.timeUnit].innerHTML);
                const nextSubstituteValue = currentTime + 2;
                const newSubstitudeNext = this.createTimeTextDOM(this.grabbedElement.timeUnit, TimeSteps.substitudeNext, nextSubstituteValue);
                this.elements.substituteNextTime.wrapper.appendChild(newSubstitudeNext);
                this.elements.substituteNextTime[this.grabbedElement.timeUnit] = newSubstitudeNext;
                //
                this.onTimeTextChange(this.grabbedElement.timeUnit, currentTime);
            } else {
                this.elements.substitutePrevTime[this.grabbedElement.timeUnit].style.transform = `translateY(${svgYDiff}px)`;
                this.elements.prevTime[this.grabbedElement.timeUnit].style.transform = `translateY(${svgYDiff}px)`;
                this.elements.currentTime[this.grabbedElement.timeUnit].style.transform = `translateY(${svgYDiff}px)`;
                this.elements.nextTime[this.grabbedElement.timeUnit].style.transform = `translateY(${svgYDiff}px)`;
                this.elements.substituteNextTime[this.grabbedElement.timeUnit].style.transform = `translateY(${svgYDiff}px)`;
            }
            // we memorize what we do in this move event so we can use it in next move
            this.grabbedElement.addActionRecord(action);
        }

    }
    changeTimeTextParent(timeUnit, currentTimeStep, newtimeStep, yDiff) {
        const dom = this.elements[currentTimeStep][timeUnit];
        dom.setAttribute('y', this.defaultPositions[newtimeStep + "TextY"]);
        // after we swap we need to reverse transition base on new pos
        let newYDiff = 0;
        if(yDiff>0){
            //on top to buttom move dir
            newYDiff = -1 * (this.defaultPositions.timeStepYDiff - yDiff);
        }
        if(yDiff<0){
            //on bottom to  top move dir
            newYDiff = this.defaultPositions.timeStepYDiff + yDiff;
        }
        dom.style.transform = `translateY(${newYDiff}px)`;
        this.elements[newtimeStep].wrapper.appendChild(dom);
        this.elements[newtimeStep][timeUnit] = dom;
        // we change on mouse down vent base on new units and parent
        this.attachMouseDownEventToTimeTextDOM(timeUnit, newtimeStep);
        this.elements[currentTimeStep][timeUnit] = null;
    }
    handleTextMouseUp() {
        if (this.grabbedElement) {
            const timeUnit = this.grabbedElement.timeUnit;
            this.moveBackToPos(this.elements.substitutePrevTime[timeUnit]);
            this.moveBackToPos(this.elements.prevTime[timeUnit]);
            this.moveBackToPos(this.elements.currentTime[timeUnit]);
            this.moveBackToPos(this.elements.nextTime[timeUnit]);
            this.moveBackToPos(this.elements.substituteNextTime[timeUnit]);
            this.grabbedElement = null;
        }

    }
    moveBackToPos(dom) {
        //remove all transform and changed pos from element and returned it to natrual place. used on drop event
        dom.style.transition = `transform 0.3s 0s ease`;
        //remove above assigned animation
        setTimeout(() => { dom.style.transition = ''; }, 300);
        dom.style.transform = ``;
    }
    createTimeTextDOM(timeUnit, timeStep, timeValue) {
        const xmlns = "http://www.w3.org/2000/svg";
        //<text class="hour-text time-text" dominant-baseline="middle" textLength="150" y="212" x="212"></text>
        let y = this.defaultPositions[timeStep + 'TextY'];
        let x = this.defaultPositions[timeUnit + 'TextX'];
        const textElem = document.createElementNS(xmlns, 'text');
        textElem.classList.add(`${timeUnit}-text`, 'time-text');
        textElem.setAttributeNS(null, 'dominant-baseline', 'middle');
        textElem.setAttributeNS(null, 'textLength', '150');
        textElem.setAttributeNS(null, 'y', y);
        textElem.setAttributeNS(null, 'x', x);
        textElem.innerHTML = timeValue;
        if(this.focusedTimeUnit == timeUnit){
            textElem.classList.add('--focused');
        }
        return textElem;

    }
    onTimeTextChange(timeUnit, value){
        this.placeTimeUnitIndicator(timeUnit, value);
    }
    placeTimeUnitIndicator(timeUnit, value){
        const pos = this.getUnitXYPoint(value, timeUnit);
        this.elements.timeIndicators[timeUnit].setAttribute('x', pos.x);
        this.elements.timeIndicators[timeUnit].setAttribute('y', pos.y); 
    }
    getUnitXYPoint(value,TimeUnit){
        const eachUnitDeg = TimeUnit == TimeUnits.hour?30:6;
        //480+512/2 middle of ring
        const r = 496;
        const centerX = 512;
        const centerY = 512;
        const angle = (value * eachUnitDeg)-90;
        const radian = angle * (Math.PI/180);
        const x = centerX+ Math.cos(radian) * r;
        const y = centerY + Math.sin(radian) * r ;
        return {x,y};
    }
    setTimeUnitFocus(timeUnit){
        //when user select certain unit like hour and try to change it by text wheel or indicator or something elese or even programicaly we exec this method
        if(timeUnit != this.focusedTimeUnit){
            const oldFocusedTimeUnit = this.focusedTimeUnit;
            this.focusedTimeUnit = timeUnit;
            if(timeUnit){
                //set new focus DOM class
                this.elements.currentTime[timeUnit].classList.add('--focused');
                this.elements.nextTime[timeUnit].classList.add('--focused');
                this.elements.prevTime[timeUnit].classList.add('--focused');
                this.elements.substitutePrevTime[timeUnit].classList.add('--focused');
                this.elements.substituteNextTime[timeUnit].classList.add('--focused');
                this.elements.timeIndicators[timeUnit].classList.add('--focused');
            }
            //remove old focus dom
            if(oldFocusedTimeUnit){
                this.elements.currentTime[oldFocusedTimeUnit].classList.remove('--focused');
                this.elements.nextTime[oldFocusedTimeUnit].classList.remove('--focused');
                this.elements.prevTime[oldFocusedTimeUnit].classList.remove('--focused');
                this.elements.substitutePrevTime[oldFocusedTimeUnit].classList.remove('--focused');
                this.elements.substituteNextTime[oldFocusedTimeUnit].classList.remove('--focused');
                this.elements.timeIndicators[oldFocusedTimeUnit].classList.remove('--focused');
            }
        }
        

    }
}
const myElementNotExists = !customElements.get('jb-time-picker');
if (myElementNotExists) {
    window.customElements.define('jb-time-picker', JBTimePickerWebComponent);
}
