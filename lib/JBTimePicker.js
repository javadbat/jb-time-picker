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
    move: 'MOVE',
    add1: 'ADD_1',
    subtrack1: 'SUB_1'
};
class JBTimePickerWebComponent extends HTMLElement {
    get value() {
        return this._value;
    }
    /**
     * @typedef JBTimePickerValue
     * @property {number} hour
     * @property {number} minute
     * @property {number} second
    */
    /**
     * @param {JBTimePickerValue} value 
     * @memberof JBTimePickerWebComponent
     */
    set value(value) {
        this.updateValue(value.hour, TimeUnits.hour,false);
        this.updateValue(value.minute, TimeUnits.minute, false);
        this.updateValue(value.second, TimeUnits.second, false);
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
            timeIndicators: {
                hour: this.shadowRoot.querySelector('.hour-indicator'),
                minute: this.shadowRoot.querySelector('.minute-indicator'),
                second: this.shadowRoot.querySelector('.second-indicator')
            },
            substitutePrevTime: {
                wrapper: this.shadowRoot.querySelector('.substitute-prev-time'),
                hour: null,
                minute: null,
                second: null,
            },
            prevTime: {
                wrapper: this.shadowRoot.querySelector('.prev-time'),
                hour: null,
                minute: null,
                second: null,
            },
            currentTime: {
                wrapper: this.shadowRoot.querySelector('.current-time'),
                hour: null,
                minute: null,
                second: null,
            },
            nextTime: {
                wrapper: this.shadowRoot.querySelector('.next-time'),
                hour: null,
                minute: null,
                second: null,
            },
            substituteNextTime: {
                wrapper: this.shadowRoot.querySelector('.substitute-next-time'),
                hour: null,
                minute: null,
                second: null,
            },
        };
        this.registerEventListener();
    }
    initTimeUnitIndicator() {
        this.placeTimeUnitIndicator(TimeUnits.hour, this.value.hour);
        this.placeTimeUnitIndicator(TimeUnits.minute, this.value.minute);
        this.placeTimeUnitIndicator(TimeUnits.second, this.value.second);
    }
    /**
     * initiate time unit text on component did mount
     * @private
     */
    initTimeTextNodes() {
        //create time text nodes in svg for example 12:39:48
        //                                          13:40:49
        //                                          14:41:50  
        const currentHour = this.getValidValue(this.value.hour, TimeUnits.hour);
        const currentMinute = this.getValidValue(this.value.minute, TimeUnits.minute);
        const currentSecond = this.getValidValue(this.value.second);
        // substitute prev
        const substitutePrevTimeWrapper = this.shadowRoot.querySelector('.substitute-prev-time');
        if (currentHour > 1) {
            const substitutePrevTimeHour = this.createTimeTextDOM(TimeUnits.hour, TimeSteps.substitudePrev, currentHour - 2);
            substitutePrevTimeWrapper.append(substitutePrevTimeHour);
            this.elements.substitutePrevTime.hour = substitutePrevTimeHour;
        }
        if (currentMinute > 1) {
            const substitutePrevTimeMinute = this.createTimeTextDOM(TimeUnits.minute, TimeSteps.substitudePrev, currentMinute - 2);
            substitutePrevTimeWrapper.append(substitutePrevTimeMinute);
            this.elements.substitutePrevTime.minute = substitutePrevTimeMinute;
        }
        if (currentSecond > 1) {
            const substitutePrevTimeSecond = this.createTimeTextDOM(TimeUnits.second, TimeSteps.substitudePrev, currentSecond - 2);
            substitutePrevTimeWrapper.append(substitutePrevTimeSecond);
            this.elements.substitutePrevTime.second = substitutePrevTimeSecond;
        }
        //prev
        const prevTimeWrapper = this.shadowRoot.querySelector('.prev-time');
        if (currentHour > 0) {
            const prevTimeHour = this.createTimeTextDOM(TimeUnits.hour, TimeSteps.prev, currentHour - 1);
            prevTimeWrapper.append(prevTimeHour);
            this.elements.prevTime.hour = prevTimeHour;
        }
        if (currentMinute > 0) {
            const prevTimeMinute = this.createTimeTextDOM(TimeUnits.minute, TimeSteps.prev, currentMinute - 1);
            prevTimeWrapper.append(prevTimeMinute);
            this.elements.prevTime.minute = prevTimeMinute;
        }
        if (currentSecond > 0) {
            const prevTimeSecond = this.createTimeTextDOM(TimeUnits.second, TimeSteps.prev, currentSecond - 1);
            prevTimeWrapper.append(prevTimeSecond);
            this.elements.prevTime.second = prevTimeSecond;
        }
        //current
        const currentTimeHour = this.createTimeTextDOM(TimeUnits.hour, TimeSteps.current, currentHour);
        this.elements.currentTime.hour = currentTimeHour;
        const currentTimeMinute = this.createTimeTextDOM(TimeUnits.minute, TimeSteps.current, currentMinute);
        this.elements.currentTime.minute = currentTimeMinute;
        const currentTimeSecond = this.createTimeTextDOM(TimeUnits.second, TimeSteps.current, currentSecond);
        this.elements.currentTime.second = currentTimeSecond;
        const currentTimeWrapper = this.shadowRoot.querySelector('.current-time');
        currentTimeWrapper.append(currentTimeHour, currentTimeMinute, currentTimeSecond);
        //next
        const nextTimeWrapper = this.shadowRoot.querySelector('.next-time');
        if (currentHour < this.maxTimeUnitValues.hour) {
            const nextTimeHour = this.createTimeTextDOM(TimeUnits.hour, TimeSteps.next, currentHour + 1);
            nextTimeWrapper.append(nextTimeHour);
            this.elements.nextTime.hour = nextTimeHour;
        }
        if (currentMinute < this.maxTimeUnitValues.minute) {
            const nextTimeMinute = this.createTimeTextDOM(TimeUnits.minute, TimeSteps.next, currentMinute + 1);
            nextTimeWrapper.append(nextTimeMinute);
            this.elements.nextTime.minute = nextTimeMinute;
        }
        if (currentSecond < this.maxTimeUnitValues.second) {
            const nextTimeSecond = this.createTimeTextDOM(TimeUnits.second, TimeSteps.next, currentSecond + 1);
            nextTimeWrapper.append(nextTimeSecond);
            this.elements.nextTime.second = nextTimeSecond;
        }
        // substitute next
        const substituteNextTimeWrapper = this.shadowRoot.querySelector('.substitute-next-time');
        if (currentHour + 1 < this.maxTimeUnitValues.hour) {
            const substituteNextTimeHour = this.createTimeTextDOM(TimeUnits.hour, TimeSteps.substitudeNext, currentHour + 2);
            substituteNextTimeWrapper.append(substituteNextTimeHour);
            this.elements.substituteNextTime.hour = substituteNextTimeHour;
        }
        if (currentMinute + 1 < this.maxTimeUnitValues.minute) {
            const substituteNextTimeMinute = this.createTimeTextDOM(TimeUnits.minute, TimeSteps.substitudeNext, currentMinute + 2);
            substituteNextTimeWrapper.append(substituteNextTimeMinute);
            this.elements.substituteNextTime.minute = substituteNextTimeMinute;
        }
        if (currentSecond + 1 < this.maxTimeUnitValues.second) {
            const substituteNextTimeSecond = this.createTimeTextDOM(TimeUnits.second, TimeSteps.substitudeNext, currentSecond + 2);
            substituteNextTimeWrapper.append(substituteNextTimeSecond);
            this.elements.substituteNextTime.second = substituteNextTimeSecond;
        }
        //attach mouse down events
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
        const element = this.elements[timeStep][timeUnit];
        if (element) {
            const prevBindedEvent = element._bindedMouseDownEvent;
            if (typeof prevBindedEvent == "function") {
                element.removeEventListener('mousedown', prevBindedEvent);
            }
            //bind new event
            const eventFunc = (e) => { this.handleTextMouseDown(e, timeUnit, timeStep); };
            element.addEventListener('mousedown', eventFunc);
            //we add event to dom object so we can  unsubscribe it later and attach new event again
            element._bindedMouseDownEvent = eventFunc;
        }

    }
    initProp() {
        /**
        * keep vlaue of time picker
        * @private
        * @memberof JBTimePickerWebComponent
        */
        this._value = {
            second: 0,
            minute: 0,
            hour: 0
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
        this.maxTimeUnitValues = {
            hour: 24,
            minute: 60,
            second: 60
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
    handleTextClick(timeUnit, timeStep) {
        //in mouse up we check if user not dragged anything call click by ourself
        if (timeStep == TimeSteps.prev || timeStep == TimeSteps.next) {
            const value = this.elements[timeStep][timeUnit].innerHTML;
            const validValue = this.getValidValue(value, timeUnit);
            this.updateValue(validValue, timeUnit);
        }
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
            lastAction: null,
            //next 4 prop is for handling user action when user change time uinit text value but without mouseup he decided to put it back in prev place 
            //record all (except move) action occured on this mouse down to next mouse leave
            actionRecords: [],
            addActionRecord: function (action) {
                if (action !== ActionTypes.move) { this.actionRecords.push(action); }
                this.lastAction = action;
            },
            get lastLogicalAction() {
                return this.actionRecords[this.actionRecords.length - 1];
            },
            //when user move and drag element we make it true so click event can distiguish drag and click
            isDragged: false,
            //this part is for handling fast swipe when user fast swipe and we want to add or substract more than on number
            // we calc acceleration on mouse up base on user moving behavior and decide how many itration we need
            acc: {
                //we capture all movementY user do but when user change mouse move direction we reset it becuase
                //این آرایه فقط وقتی مهمه که حرکت کاربر در یک جهت باشه که ما بتونیم شتاب یک حرکت کاربر رو محاسبه کنیم و اگه موس کاربر تغییر جهت بده از نظر ما حرکت جدیدی شروع شده
                inDirectionMoveStack: [0],
                //1 for down move -1 for up move
                direction: 0,
                //firstmove time
                t: performance.now(),
                captureMove: function (movementY) {
                    const newDirection = movementY > 0 ? 1 : -1;
                    if (newDirection == this.direction || this.direction == 0) {
                        this.inDirectionMoveStack.push(movementY);
                        this.direction = newDirection;
                    } else {
                        this.inDirectionMoveStack = [movementY];
                        this.direction = newDirection;
                        this.t = performance.now();
                    }

                }
            }
        };
        this.setTimeUnitFocus(timeUnit);
    }
    handleTextDrag(e) {
        if (this.grabbedElement) {
            this.grabbedElement.isDragged = true;
            //how much y change is important to us to change position of element
            const sensetiveDiffValue = 100;
            const yDiff = e.pageY - this.grabbedElement.startY;
            // mouse movement diff is base on dom pixel we must convert them to svg pixcel scale
            const svgYDiff = this.defaultPositions.svgPosScale * yDiff;
            //what we want to do
            let action = ActionTypes.move;//default is just move items
            if ((this.grabbedElement.itrationDone == 0 || this.grabbedElement.lastLogicalAction == ActionTypes.add1) && svgYDiff > sensetiveDiffValue) {
                //if prev value was valid we let user substrack
                if(this._value[this.grabbedElement.timeUnit]>0){
                    action = ActionTypes.subtrack1;
                }
            }
            if ((this.grabbedElement.itrationDone == 0 || this.grabbedElement.lastLogicalAction == ActionTypes.subtrack1) && svgYDiff < (-1 * sensetiveDiffValue)) {
                if(this._value[this.grabbedElement.timeUnit]< this.maxTimeUnitValues[this.grabbedElement.timeUnit]){
                    action = ActionTypes.add1;
                }
            }
            if (action == ActionTypes.subtrack1) {
                this._value[this.grabbedElement.timeUnit] = this._value[this.grabbedElement.timeUnit] - 1;
                this.triggerOnChangeEvent();
                //in this case we try to decrease grabbed time by 1 so we keep track of it.
                this.grabbedElement.itrationDone += 1;
                this.subtrackTimeTextUnitDomOperation(this.grabbedElement.timeUnit, svgYDiff);
                // we update mouse y on grab becuase next movement will be calculated base on current mose pos so yDiff calc correctly base on switched places element
                this.grabbedElement.startY = e.pageY;
                //update  grabbed time step after swap changeing done
                this.grabbedElement.timeStep = this.grabbedElement.timeStep == TimeSteps.current ? TimeSteps.next : TimeSteps.current;

                //
                this.onTimeTextChange(this.grabbedElement.timeUnit, this._value[this.grabbedElement.timeUnit]);
            } else if (action == ActionTypes.add1) {
                // we add value first
                this._value[this.grabbedElement.timeUnit] = this._value[this.grabbedElement.timeUnit] + 1;
                this.triggerOnChangeEvent();
                //user scroll up and want to add to time unit
                //in this case we try to increase grabbed time by 1 so we keep track of it.
                this.grabbedElement.itrationDone += 1;
                this.addTimeTextUnitDomOperation(this.grabbedElement.timeUnit, svgYDiff);
                // we update mouse y on grab becuase next movement will be calculated base on current mose pos so yDiff calc correctly base on switched places element
                this.grabbedElement.startY = e.pageY;
                //update  grabbed time step after swap changeing done
                this.grabbedElement.timeStep = this.grabbedElement.timeStep == TimeSteps.current ? TimeSteps.prev : TimeSteps.current;
                //
                this.onTimeTextChange(this.grabbedElement.timeUnit, this._value[this.grabbedElement.timeUnit]);

            } else {
                if (this.elements.substitutePrevTime[this.grabbedElement.timeUnit]) {
                    this.elements.substitutePrevTime[this.grabbedElement.timeUnit].style.transform = `translateY(${svgYDiff}px)`;
                }
                if (this.elements.prevTime[this.grabbedElement.timeUnit]) {
                    this.elements.prevTime[this.grabbedElement.timeUnit].style.transform = `translateY(${svgYDiff}px)`;
                }
                this.elements.currentTime[this.grabbedElement.timeUnit].style.transform = `translateY(${svgYDiff}px)`;
                if (this.elements.nextTime[this.grabbedElement.timeUnit]) {
                    this.elements.nextTime[this.grabbedElement.timeUnit].style.transform = `translateY(${svgYDiff}px)`;
                }
                if (this.elements.substituteNextTime[this.grabbedElement.timeUnit]) {
                    this.elements.substituteNextTime[this.grabbedElement.timeUnit].style.transform = `translateY(${svgYDiff}px)`;
                }
            }
            // we memorize what we do in this move event so we can use it in next move
            this.grabbedElement.addActionRecord(action);
            // to detect swipe we start to capture user movement so we can play swipe on mouse up
            this.grabbedElement.acc.captureMove(e.movementY);
        }

    }
    subtrackTimeTextUnitDomOperation(timeUnit, svgYDiff) {
        //when we subtrack the value and we want all  swap dom place job be done
        //remember allways update this._value befor call this function
        //remove old next substitude dom becuse it will replaced
        const forDeleteSubDom = this.elements.substituteNextTime[timeUnit];
        this.elements.substituteNextTime[timeUnit] = null;
        if (forDeleteSubDom) {
            forDeleteSubDom.remove();
        }
        //move element to they new right parent 
        this.changeTimeTextParent(timeUnit, TimeSteps.next, TimeSteps.substitudeNext, svgYDiff);
        this.changeTimeTextParent(timeUnit, TimeSteps.current, TimeSteps.next, svgYDiff);
        this.changeTimeTextParent(timeUnit, TimeSteps.prev, TimeSteps.current, svgYDiff);
        this.changeTimeTextParent(timeUnit, TimeSteps.substitudePrev, TimeSteps.prev, svgYDiff);
        // add new prev substitude element
        if (this._value[timeUnit] > 1) {
            const prevSubstituteValue = this._value[timeUnit] - 2;
            const newSubstitudePrev = this.createTimeTextDOM(timeUnit, TimeSteps.substitudePrev, prevSubstituteValue);
            this.elements.substitutePrevTime.wrapper.appendChild(newSubstitudePrev);
            this.elements.substitutePrevTime[timeUnit] = newSubstitudePrev;
        }

    }
    addTimeTextUnitDomOperation(timeUnit, svgYDiff) {
        //when we add to the value and we want all  swap dom place job be done
        //remember allways update this._value befor call this function
        //remove old prev substitude dom because it will replaced
        const forDeleteSubDom = this.elements.substitutePrevTime[timeUnit];
        this.elements.substitutePrevTime[timeUnit] = null;
        if (forDeleteSubDom) {
            forDeleteSubDom.remove();
        }
        //move element to they new right parent 
        this.changeTimeTextParent(timeUnit, TimeSteps.prev, TimeSteps.substitudePrev, svgYDiff);
        this.changeTimeTextParent(timeUnit, TimeSteps.current, TimeSteps.prev, svgYDiff);
        this.changeTimeTextParent(timeUnit, TimeSteps.next, TimeSteps.current, svgYDiff);
        this.changeTimeTextParent(timeUnit, TimeSteps.substitudeNext, TimeSteps.next, svgYDiff);

        // add new prev substitude element
        if (this._value[timeUnit] + 1 < this.maxTimeUnitValues[timeUnit]) {
            const nextSubstituteValue = this._value[timeUnit] + 2;
            const newSubstitudeNext = this.createTimeTextDOM(timeUnit, TimeSteps.substitudeNext, nextSubstituteValue);
            this.elements.substituteNextTime.wrapper.appendChild(newSubstitudeNext);
            this.elements.substituteNextTime[timeUnit] = newSubstitudeNext;
        }


    }
    changeTimeTextParent(timeUnit, currentTimeStep, newtimeStep, yDiff) {
        const dom = this.elements[currentTimeStep][timeUnit];
        if (dom) {
            dom.setAttribute('y', this.defaultPositions[newtimeStep + "TextY"]);
            // after we swap we need to reverse transition base on new pos
            let newYDiff = 0;
            if (yDiff > 0) {
                //on top to buttom move dir
                newYDiff = -1 * (this.defaultPositions.timeStepYDiff - yDiff);
            }
            if (yDiff < 0) {
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

    }
    handleTextMouseUp(e) {
        if (this.grabbedElement) {
            this.handleUserBigSwipe();
            const timeUnit = this.grabbedElement.timeUnit;
            const timeStep = this.grabbedElement.timeStep;
            this.moveBackToPos(this.elements.substitutePrevTime[timeUnit]);
            this.moveBackToPos(this.elements.prevTime[timeUnit]);
            this.moveBackToPos(this.elements.currentTime[timeUnit]);
            this.moveBackToPos(this.elements.nextTime[timeUnit]);
            this.moveBackToPos(this.elements.substituteNextTime[timeUnit]);
            if (!this.grabbedElement.isDragged) {
                this.handleTextClick(timeUnit, timeStep);
            }
            this.grabbedElement = null;
        }
    }

    moveBackToPos(dom) {
        if (dom) {
            //remove all transform and changed pos from element and returned it to natrual place. used on drop event
            dom.style.transition = `transform 0.3s 0s ease`;
            //remove above assigned animation
            setTimeout(() => { dom.style.transition = ''; }, 300);
            dom.style.transform = ``;
        }

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
        if (this.focusedTimeUnit == timeUnit) {
            textElem.classList.add('--focused');
        }
        return textElem;

    }
    onTimeTextChange(timeUnit, value) {
        this.placeTimeUnitIndicator(timeUnit, value);
    }

    placeTimeUnitIndicator(timeUnit, value) {
        const pos = this.getUnitXYPoint(value, timeUnit);
        this.elements.timeIndicators[timeUnit].setAttribute('x', pos.x);
        this.elements.timeIndicators[timeUnit].setAttribute('y', pos.y);
    }
    getUnitXYPoint(value, TimeUnit) {
        const eachUnitDeg = TimeUnit == TimeUnits.hour ? 30 : 6;
        //480+512/2 middle of ring
        const r = 496;
        const centerX = 512;
        const centerY = 512;
        const angle = (value * eachUnitDeg) - 90;
        const radian = angle * (Math.PI / 180);
        const x = centerX + Math.cos(radian) * r;
        const y = centerY + Math.sin(radian) * r;
        return { x, y };
    }
    /**
     * setTimeUnit focus suitable  for when you want your user to change specific TimeUnit
     * @public
     * @param {string} timeUnit 
     */
    setTimeUnitFocus(timeUnit) {
        //when user select certain unit like hour and try to change it by text wheel or indicator or something elese or even programicaly we exec this method
        if (timeUnit != this.focusedTimeUnit) {
            const oldFocusedTimeUnit = this.focusedTimeUnit;
            this.focusedTimeUnit = timeUnit;
            if (timeUnit) {
                //set new focus DOM class
                this.elements.currentTime[timeUnit].classList.add('--focused');
                //if hour is 24 or 0 next and prev may not be available
                if (this.elements.nextTime[timeUnit]) {
                    this.elements.nextTime[timeUnit].classList.add('--focused');
                }
                if (this.elements.prevTime[timeUnit]) {
                    this.elements.prevTime[timeUnit].classList.add('--focused');
                }
                if (this.elements.substitutePrevTime[timeUnit]) {
                    this.elements.substitutePrevTime[timeUnit].classList.add('--focused');
                }
                if (this.elements.substituteNextTime[timeUnit]) {
                    this.elements.substituteNextTime[timeUnit].classList.add('--focused');
                }
                this.elements.timeIndicators[timeUnit].classList.add('--focused');
            }
            //remove old focus dom
            if (oldFocusedTimeUnit) {
                this.elements.currentTime[oldFocusedTimeUnit].classList.remove('--focused');
                if (this.elements.nextTime[oldFocusedTimeUnit]) {
                    this.elements.nextTime[oldFocusedTimeUnit].classList.remove('--focused');
                }
                if (this.elements.prevTime[oldFocusedTimeUnit]) {
                    this.elements.prevTime[oldFocusedTimeUnit].classList.remove('--focused');
                }
                if (this.elements.substitutePrevTime[oldFocusedTimeUnit]) {
                    this.elements.substitutePrevTime[oldFocusedTimeUnit].classList.remove('--focused');
                }
                if (this.elements.substituteNextTime[oldFocusedTimeUnit]) {
                    this.elements.substituteNextTime[oldFocusedTimeUnit].classList.remove('--focused');
                }
                this.elements.timeIndicators[oldFocusedTimeUnit].classList.remove('--focused');
            }
        }


    }
    /**
     * //if user swipe(move mouse in one direction more than enough pixel fast) we must change value more than 1 iteration
     * @private
     */
    handleUserBigSwipe() {
        
        const movementSum = this.grabbedElement.acc.inDirectionMoveStack.reduce((a, b) => { return a + b; });
        const vectorScaleMovementSum = this.defaultPositions.svgPosScale * movementSum;
        const swipeDuration = performance.now() - this.grabbedElement.acc.t;
        const acceleration = movementSum / swipeDuration;
        //console.table({movementSum,vectorScaleMovementSum,swipeDuration,acceleration});
        //how much user must move mouse so we start adding multiple value with animation
        const sensetiveYDiffPoint = 200;
        if (Math.abs(vectorScaleMovementSum) > sensetiveYDiffPoint) {
            //TODO: its better to be a combination of acceleration and vectorScaleMovementSum but im bad at physic so i make it simple
            const neededItration = Math.round(Math.abs(acceleration * 10));
            const timeUnit = this.grabbedElement.timeUnit;
            //this.grabbedElement.acc.direction is -1 for add and 1 for sub so we *-1 it 
            const newValue = (this.grabbedElement.acc.direction * -1 * neededItration) + this.value[timeUnit];
            const validNewValue = this.getValidValue(newValue, timeUnit);
            this.updateValue(validNewValue, timeUnit);
        }
    }
    /**
     * @private
     * @param {number} value new value
     * @param {string} timeUnit hour minute or second
     * @param {boolean} canTriggerOnChange when this method called in response of outside value update we dont call onChange so this flag will be false in that situation or other time we dont want to trigger change event
     */
    updateValue(value, timeUnit, canTriggerOnChange = true) {
        //how many itration we need to get to the right point in value
        const timeDistance = value - this.value[timeUnit];
        if (timeDistance == 0) {
            return;
        }
        let remainingDistance = Math.abs(timeDistance);
        const direction = timeDistance > 0 ? 1 : (timeDistance == 0 ? 0 : -1);
        const add1ToValue = () => {
            // we simulate Promise.race for callback
            let isOnFinishedExecuted = false;
            const onFinish = () => {
                if (!isOnFinishedExecuted) {
                    isOnFinishedExecuted = true;
                    this._value[timeUnit] = this._value[timeUnit] + direction;
                    if(canTriggerOnChange){
                        this.triggerOnChangeEvent();
                    }
                    if (direction == 1) {
                        this.addTimeTextUnitDomOperation(timeUnit, 0);
                    }
                    if (direction == -1) {
                        this.subtrackTimeTextUnitDomOperation(timeUnit, 0);
                    }
                    remainingDistance--;
                    if (remainingDistance > 0) {
                        add1ToValue();
                    }
                }
            };
            //calc animstion duration for each iteration
            const minT = 50;
            const maxT = 200;
            const accTime = Math.abs(timeDistance) == 1 ? 100 : (maxT - minT) / (Math.abs(timeDistance) - 1);
            const animationDuration = minT + (accTime * (Math.abs(timeDistance) - remainingDistance));
            const animationEasing = remainingDistance == 1 ? "ease" : "linear";
            // only one on finish is enugth to run the after needed effect 
            this.playTextNodeAnimation(timeUnit, TimeSteps.substitudePrev, direction, onFinish, animationDuration, animationEasing);
            this.playTextNodeAnimation(timeUnit, TimeSteps.prev, direction, onFinish, animationDuration, animationEasing);
            this.playTextNodeAnimation(timeUnit, TimeSteps.current, direction, onFinish, animationDuration, animationEasing);
            this.playTextNodeAnimation(timeUnit, TimeSteps.next, direction, onFinish, animationDuration, animationEasing);
            this.playTextNodeAnimation(timeUnit, TimeSteps.substitudeNext, direction, onFinish, animationDuration, animationEasing);
            this.placeTimeUnitIndicator(timeUnit, value);
        };
        if (remainingDistance > 0) {
            add1ToValue();
        }

    }
    /**
     * @private
     * @param {string} timeUnit
     * @param {string} timeStep
     * @param {integer} diraction -1 or 1. -1 mean substractand +1 mean add
     * @param {Function} onFinish callback to what happen when animation finished
     * @param {Number} animationDuration how many milisecond animation take
     * @param {string} animationEasing optional and determine animation ease param
     */
    playTextNodeAnimation(timeUnit, timeStep, diraction, onFinish, animationDuration = 100, animationEasing = "linear") {
        //for mor code readabilityy we set direction in meaning way 
        const itrationHeight = -1 * diraction * this.defaultPositions.timeStepYDiff;
        const animationId = `${Math.random()}-animation`;
        const element = this.elements[timeStep][timeUnit];
        if (element) {
            const animation = element.animate([{ transform: `translateY(${0}px)` }, { transform: `translateY(${itrationHeight}px)` }], { id: animationId, duration: animationDuration, easing: animationEasing });
            animation.onfinish = onFinish;
        }
    }
    /**
     *
     * this function convert not valid value like -3 or 26(hour) to valid number in boundry 
     * @param {*} value
     * @param {*} timeUnit
     * @return {Number} 
     * @memberof JBTimePickerWebComponent
     */
    getValidValue(value, timeUnit) {
        if (value < 0) {
            return 0;
        }
        if (value > this.maxTimeUnitValues[timeUnit]) {
            return this.maxTimeUnitValues[timeUnit];
        }
        return Math.round(value);
    }
    /**
     * call all change event listener. we must call it when a change accur
     * @private
     */
    triggerOnChangeEvent(){
        const event = new CustomEvent('change');
        this.dispatchEvent(event);
    }
}
const myElementNotExists = !customElements.get('jb-time-picker');
if (myElementNotExists) {
    window.customElements.define('jb-time-picker', JBTimePickerWebComponent);
}
