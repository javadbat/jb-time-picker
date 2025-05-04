import HTML from "./jb-time-picker.html";
import CSS from "./jb-time-picker.scss";
import {AnimationHandler,DefaultPositions,GrabbedElement,JBTimeInputElements,JBTimePickerValueObject,TimeUnitsObject,TimeUnitsString,TimeUnits,TimeSteps} from "./types";
import { enToFaDigits } from "jb-core";
import {registerDefaultVariables} from 'jb-core/theme';
export * from "./types.js";

const TimeUnits: TimeUnitsObject = {
  hour: "hour",
  minute: "minute",
  second: "second",
};
const TimeSteps = {
  substitutePrev: "substitutePrevTime",
  prev: "prevTime",
  current: "currentTime",
  next: "nextTime",
  substituteNext: "substituteNextTime",
};
const ActionTypes = {
  move: "MOVE",
  add1: "ADD_1",
  subtract1: "SUB_1",
};
export class JBTimePickerWebComponent extends HTMLElement {
  #value: JBTimePickerValueObject = {
    second: 0,
    minute: 0,
    hour: 0,
  };
  elements: JBTimeInputElements;
  #maxTimeUnitValues: { [key in TimeUnits]: number } = {
    hour: 24,
    minute: 59,
    second: 59,
  };
  focusedTimeUnit: TimeUnits | null = null;
  #grabbedElement: GrabbedElement | null = null;
  // to show 01 instead of 1 in picker
  get frontalZero() {
    return this.#frontalZero;
  }
  set frontalZero(value) {
    if (this.frontalZero !== value) {
      this.#frontalZero = value;
      this.#initTimeTextNodes();
    }
  }
  #frontalZero = false;
  /**
   * @description user want to grey out some unit because they are optional
  */ 
  set optionalUnits(value: TimeUnitsString[]) {
    this.#optionalUnits = value;
    value.forEach((v) => {
      this.elements.currentTime[v]?.classList.add("--optional");
      this.elements.nextTime[v]?.classList.add("--optional");
      this.elements.prevTime[v]?.classList.add("--optional");
    });
  }
  get optionalUnits() {
    return this.#optionalUnits;
  }
  #optionalUnits: TimeUnitsString[] = [];
  get value() {
    return this.#value;
  }
  set value(value: JBTimePickerValueObject) {
    if (!this.#animationHandler.hour.isTextAnimationPlaying) {
      this.#updateValue(value.hour, TimeUnits.hour, false);
    } else {
      this.#animationHandler.hour.waitingAction = () => {
        this.#updateValue(value.hour, TimeUnits.hour, false);
      };
    }
    if (!this.#animationHandler.minute.isTextAnimationPlaying) {
      this.#updateValue(value.minute, TimeUnits.minute, false);
    } else {
      this.#animationHandler.minute.waitingAction = () => {
        this.#updateValue(value.minute, TimeUnits.minute, false);
      };
    }
    if (value.second) {
      if (!this.#animationHandler.second.isTextAnimationPlaying) {
        this.#updateValue(value.second, TimeUnits.second, false);
      } else {
        this.#animationHandler.second.waitingAction = () => {
          this.#updateValue(value.second!, TimeUnits.second, false);
        };
      }
    }
  }
  get secondEnabled() {
    return this.#secondEnabled;
  }
  set secondEnabled(value) {
    if (typeof value == "boolean") {
      this.#secondEnabled = value;
      if (value == false) {
        this.#disableSecond();
      } else {
        this.#enableSecond();
      }
    }
  }
  //will show persian number even if user type en number but value will be passed as en number
  #showPersianNumber = false;
  get showPersianNumber() {
    return this.#showPersianNumber;
  }
  set showPersianNumber(value: boolean) {
    this.#showPersianNumber = Boolean(value);
    this.#initTimeTextNodes();
  }
  /**
   * @public
   * @description if you are too obsessed with the svg text width to be equal and aligned you can set it base on your font width (between 150,300) base on your font
   */
  textWidth:number|null = null
  constructor() {
    super();
    this.#initWebComponent();
  }
  connectedCallback() {
    // standard web component event that called when all of dom is bounded
    this.#callOnLoadEvent();
    this.#initProp();
    this.#callOnInitEvent();
  }
  #callOnLoadEvent() {
    const event = new CustomEvent("load", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  #callOnInitEvent() {
    const event = new CustomEvent("init", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  #initWebComponent() {
    const shadowRoot = this.attachShadow({
      mode: "open",
    });
    registerDefaultVariables();
    const html = `<style>${CSS}</style>` + "\n" + HTML;
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      svgDOM: shadowRoot.querySelector(".svg-clock")!,
      timeIndicators: {
        hour: shadowRoot.querySelector(".hour-indicator")!,
        minute: shadowRoot.querySelector(".minute-indicator")!,
        second: shadowRoot.querySelector(".second-indicator")!,
      },
      substitutePrevTime: {
        wrapper: shadowRoot.querySelector(".substitute-prev-time")!,
        hour: null,
        minute: null,
        second: null,
      },
      prevTime: {
        wrapper: shadowRoot.querySelector(".prev-time")!,
        hour: null,
        minute: null,
        second: null,
      },
      currentTime: {
        wrapper: shadowRoot.querySelector(".current-time")!,
        hour: null,
        minute: null,
        second: null,
      },
      nextTime: {
        wrapper: shadowRoot.querySelector(".next-time")!,
        hour: null,
        minute: null,
        second: null,
      },
      substituteNextTime: {
        wrapper: shadowRoot.querySelector(".substitute-next-time")!,
        hour: null,
        minute: null,
        second: null,
      },
      separatorTexts: shadowRoot.querySelectorAll(".separator-text")!,
    };

    this.#registerEventListener();
  }
  #initTimeUnitIndicator() {
    this.#placeTimeUnitIndicator(TimeUnits.hour, this.value.hour);
    this.#placeTimeUnitIndicator(TimeUnits.minute, this.value.minute);
    if (this.secondEnabled && this.value.second) {
      this.#placeTimeUnitIndicator(TimeUnits.second, this.value.second);
    }
  }
  /**
   * initiate time unit text on component did mount or node display settings change
   * @private
   */
  #initTimeTextNodes() {
    //create time text nodes in svg for example 12:39:48
    //                                          13:40:49
    //                                          14:41:50
    const currentHour = this.#getValidValue(this.value.hour, TimeUnits.hour);
    const currentMinute = this.#getValidValue(
      this.value.minute,
      TimeUnits.minute
    );
    const currentSecond = this.#getValidValue(
      this.value.second || 0,
      TimeUnits.second
    );
    // substitute prev
    const substitutePrevTimeWrapper = this.shadowRoot!.querySelector(
      ".substitute-prev-time"
    )!;
    //remove old element if exist becuase we want fresh start in this function
    if (this.elements.substitutePrevTime.hour) {
      this.elements.substitutePrevTime.hour.remove();
      this.elements.substitutePrevTime.hour = null;
    }
    if (this.elements.substitutePrevTime.minute) {
      this.elements.substitutePrevTime.minute.remove();
      this.elements.substitutePrevTime.minute = null;
    }
    if (this.elements.substitutePrevTime.second) {
      this.elements.substitutePrevTime.second.remove();
      this.elements.substitutePrevTime.second = null;
    }
    //
    if (currentHour > 1) {
      //in above code it remove i just keep this code for a whaile to make sure nothing happen
      // if (this.elements.substitutePrevTime.hour) {
      //     this.elements.substitutePrevTime.hour.remove();
      //     this.elements.substitutePrevTime.hour = null;
      // }
      const substitutePrevTimeHour = this.#createTimeTextDOM(
        TimeUnits.hour,
        "substitutePrevTime",
        currentHour - 2
      );
      substitutePrevTimeWrapper.append(substitutePrevTimeHour);
      this.elements.substitutePrevTime.hour = substitutePrevTimeHour;
    }
    if (currentMinute > 1) {
      const substitutePrevTimeMinute = this.#createTimeTextDOM(
        TimeUnits.minute,
        "substitutePrevTime",
        currentMinute - 2
      );
      substitutePrevTimeWrapper.append(substitutePrevTimeMinute);
      this.elements.substitutePrevTime.minute = substitutePrevTimeMinute;
    }
    if (this.secondEnabled && currentSecond > 1) {
      const substitutePrevTimeSecond = this.#createTimeTextDOM(
        TimeUnits.second,
        "substitutePrevTime",
        currentSecond - 2
      );
      substitutePrevTimeWrapper.append(substitutePrevTimeSecond);
      this.elements.substitutePrevTime.second = substitutePrevTimeSecond;
    }
    //prev
    const prevTimeWrapper = this.shadowRoot!.querySelector(".prev-time")!;
    //remove old element if exist because we want fresh start in this function
    if (this.elements.prevTime.hour) {
      this.elements.prevTime.hour.remove();
      this.elements.prevTime.hour = null;
    }
    if (this.elements.prevTime.minute) {
      this.elements.prevTime.minute.remove();
      this.elements.prevTime.minute = null;
    }
    if (this.elements.prevTime.second) {
      this.elements.prevTime.second.remove();
      this.elements.prevTime.second = null;
    }
    if (currentHour > 0) {
      const prevTimeHour = this.#createTimeTextDOM(
        TimeUnits.hour,
        "prevTime",
        currentHour - 1
      );
      prevTimeWrapper.append(prevTimeHour);
      this.elements.prevTime.hour = prevTimeHour;
    }
    if (currentMinute > 0) {
      const prevTimeMinute = this.#createTimeTextDOM(
        TimeUnits.minute,
        "prevTime",
        currentMinute - 1
      );
      prevTimeWrapper.append(prevTimeMinute);
      this.elements.prevTime.minute = prevTimeMinute;
    }
    if (this.secondEnabled && currentSecond > 0) {
      const prevTimeSecond = this.#createTimeTextDOM(
        TimeUnits.second,
        "prevTime",
        currentSecond - 1
      );
      prevTimeWrapper.append(prevTimeSecond);
      this.elements.prevTime.second = prevTimeSecond;
    }
    //current
    if (this.elements.currentTime.hour) {
      //remove text node if exist and replace it with a new one after if
      this.elements.currentTime.hour.remove();
      this.elements.currentTime.hour = null;
    }
    const currentTimeHour = this.#createTimeTextDOM(
      TimeUnits.hour,
      "currentTime",
      currentHour
    );
    this.elements.currentTime.hour = currentTimeHour;
    if (this.elements.currentTime.minute) {
      //remove text node if exist and replace it with a new one after if
      this.elements.currentTime.minute.remove();
      this.elements.currentTime.minute = null;
    }
    const currentTimeMinute = this.#createTimeTextDOM(
      TimeUnits.minute,
      "currentTime",
      currentMinute
    );
    this.elements.currentTime.minute = currentTimeMinute;
    if (this.elements.currentTime.second) {
      //remove text node if exist and replace it with a new one after if
      this.elements.currentTime.second.remove();
      this.elements.currentTime.second = null;
    }
    const currentTimeWrapper = this.shadowRoot!.querySelector(".current-time")!;
    currentTimeWrapper.append(currentTimeHour, currentTimeMinute);
    if (this.secondEnabled) {
      const currentTimeSecond = this.#createTimeTextDOM(
        TimeUnits.second,
        "currentTime",
        currentSecond
      );
      this.elements.currentTime.second = currentTimeSecond;
      currentTimeWrapper.append(currentTimeSecond);
    }
    //next
    const nextTimeWrapper = this.shadowRoot!.querySelector(".next-time")!;
    //remove old element if exist becuase we want fresh start in this function
    if (this.elements.nextTime.hour) {
      this.elements.nextTime.hour.remove();
      this.elements.nextTime.hour = null;
    }
    if (this.elements.nextTime.minute) {
      this.elements.nextTime.minute.remove();
      this.elements.nextTime.minute = null;
    }
    if (this.elements.nextTime.second) {
      this.elements.nextTime.second.remove();
      this.elements.nextTime.second = null;
    }
    if (currentHour < this.#maxTimeUnitValues.hour) {
      const nextTimeHour = this.#createTimeTextDOM(TimeUnits.hour,"nextTime",currentHour + 1);
      nextTimeWrapper.append(nextTimeHour);
      this.elements.nextTime.hour = nextTimeHour;
    }
    if (currentMinute < this.#maxTimeUnitValues.minute) {
      const nextTimeMinute = this.#createTimeTextDOM(TimeUnits.minute,"nextTime",currentMinute + 1);
      nextTimeWrapper.append(nextTimeMinute);
      this.elements.nextTime.minute = nextTimeMinute;
    }
    if (this.secondEnabled && currentSecond < this.#maxTimeUnitValues.second) {
      const nextTimeSecond = this.#createTimeTextDOM(TimeUnits.second,"nextTime",currentSecond + 1);
      nextTimeWrapper.append(nextTimeSecond);
      this.elements.nextTime.second = nextTimeSecond;
    }
    // substitute next
    const substituteNextTimeWrapper = this.shadowRoot!.querySelector(".substitute-next-time")!;
    //remove old element if exist because we want fresh start in this function
    if (this.elements.substituteNextTime.hour) {
      this.elements.substituteNextTime.hour.remove();
      this.elements.substituteNextTime.hour = null;
    }
    if (this.elements.substituteNextTime.minute) {
      this.elements.substituteNextTime.minute.remove();
      this.elements.substituteNextTime.minute = null;
    }
    if (this.elements.substituteNextTime.second) {
      this.elements.substituteNextTime.second.remove();
      this.elements.substituteNextTime.second = null;
    }
    if (currentHour + 1 < this.#maxTimeUnitValues.hour) {
      const substituteNextTimeHour = this.#createTimeTextDOM(TimeUnits.hour,"substituteNextTime",currentHour + 2);
      substituteNextTimeWrapper.append(substituteNextTimeHour);
      this.elements.substituteNextTime.hour = substituteNextTimeHour;
    }
    if (currentMinute + 1 < this.#maxTimeUnitValues.minute) {
      const substituteNextTimeMinute = this.#createTimeTextDOM(TimeUnits.minute,"substituteNextTime",currentMinute + 2);
      substituteNextTimeWrapper.append(substituteNextTimeMinute);
      this.elements.substituteNextTime.minute = substituteNextTimeMinute;
    }
    if (
      this.secondEnabled &&
      currentSecond + 2 < this.#maxTimeUnitValues.second
    ) {
      const substituteNextTimeSecond = this.#createTimeTextDOM(TimeUnits.second,"substituteNextTime",currentSecond + 2);
      substituteNextTimeWrapper.append(substituteNextTimeSecond);
      this.elements.substituteNextTime.second = substituteNextTimeSecond;
    }
    //attach mouse down events
    this.#attachMouseDownEventToTimeTextDOM(TimeUnits.hour, "prevTime");
    this.#attachMouseDownEventToTimeTextDOM(TimeUnits.minute, "prevTime");
    this.#attachMouseDownEventToTimeTextDOM(TimeUnits.hour, "currentTime");
    this.#attachMouseDownEventToTimeTextDOM(TimeUnits.minute, "currentTime");
    this.#attachMouseDownEventToTimeTextDOM(TimeUnits.hour, "nextTime");
    this.#attachMouseDownEventToTimeTextDOM(TimeUnits.minute, "nextTime");
    if (this.secondEnabled) {
      this.#attachMouseDownEventToTimeTextDOM(TimeUnits.second, "prevTime");
      this.#attachMouseDownEventToTimeTextDOM(
        TimeUnits.second,
        "currentTime"
      );
      this.#attachMouseDownEventToTimeTextDOM(TimeUnits.second, "nextTime");
    }
  }
  #registerEventListener() {
    this.shadowRoot!.addEventListener("mousemove", (e) => {
      this.#onMouseMove(e as MouseEvent);
    });
    this.elements.svgDOM.addEventListener("touchmove", (e) => {
      this.#onTouchMove(e);
    });
    this.shadowRoot!.addEventListener(
      "mouseup",
      this.#handleTextMouseUp.bind(this)
    );
    this.elements.svgDOM.addEventListener(
      "touchend",
      this.#handleTextMouseUp.bind(this)
    );
  }
  #attachMouseDownEventToTimeTextDOM(timeUnit: TimeUnits, timeStep: TimeSteps) {
    //first we check if there is a bounded event we remove it
    const element = this.elements[timeStep][timeUnit];
    if (element) {
      //@ts-ignore
      const prevBoundedEvent = element._boundedMouseDownEvent;
      if (typeof prevBoundedEvent == "function") {
        element.removeEventListener("mousedown", prevBoundedEvent);
        element.removeEventListener(
          "touchstart",
          //@ts-ignore
          element._boundedTouchStartEvent
        );
      }
      //bind new event
      const mouseDownEventFunc = (e: MouseEvent) => {
        this.#onTextMouseDown(e, timeUnit, timeStep);
      };
      const touchStartEventFunc = (e: TouchEvent) => {
        this.#onTextTouchStart(e, timeUnit, timeStep);
      };
      element.addEventListener("mousedown", mouseDownEventFunc);
      element.addEventListener("touchstart", touchStartEventFunc);
      //we add event to dom object so we can  unsubscribe it later and attach new event again
      //@ts-ignore
      element._boundedMouseDownEvent = mouseDownEventFunc;
      //@ts-ignore
      element._boundedTouchStartEvent = touchStartEventFunc;
    }
  }
  get timeTextXPositions() {
    let hourX = 212;
    let minuteX = 512;
    const secondX = 812;
    if (!this.secondEnabled) {
      hourX = 512 - 150;
      minuteX = 512 + 150;
    }
    return { hourX, minuteX, secondX };
  }
  get #separatorsXPosition() {
    if (this.secondEnabled) {
      return [362, 662];
    } else {
      return [512];
    }
  }
  #secondEnabled = true;
  #defaultPositions!: DefaultPositions;
  #animationHandler!: AnimationHandler;
  /**
 * keep value of time picker
 * @private
 * @memberof JBTimePickerWebComponent
 */
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  #initProp() {
    const self = this;
    this.#defaultPositions = {
      //
      substitutePrevTimeTextY: 212,
      prevTimeTextY: 362,
      currentTimeTextY: 512,
      nextTimeTextY: 662,
      substituteNextTimeTextY: 812,
      get hourTextX() {
        return self.timeTextXPositions.hourX;
      },
      get minuteTextX() {
        return self.timeTextXPositions.minuteX;
      },
      get secondTextX() {
        return self.timeTextXPositions.secondX;
      },
      //y diffrent between two time step
      timeStepYDiff: 150,
      //zarib tabdil dom pos -> svg pos
      get svgPosScale() {
        return 1;
      }, //define original func down there
    };
    //when we want to convert mouse movement or any other nonSvg scale coordination to svg scale one we use this function
    //its defined as a getter function becuase it must be live and cant be stored becuase sometimes component created in js env not document or it created in hidden div or even user zoomin and zoomout page
    // and all this action make scale wrong or undefined so we must get it every time we need it
    Object.defineProperty(this.#defaultPositions, "svgPosScale", {
      get: () => {
        if (this.elements.timeIndicators && this.elements.timeIndicators.hour) {
          const ctm = this.elements.timeIndicators.hour.getCTM();
          if (ctm && typeof ctm.inverse == "function") {
            return ctm.inverse().a;
          } else {
            return 1;
          }
        } else {
          return 1;
        }
      },
    });
    /*
        this object define to handle events on animation playing.
        for example when minute value set from outside to 10 and before animation finished minute set to 30 we can handle it by set waitingAction to  serhour to 30 and when last animation iteration finished we start palying animation for 30
        waitingAction is a function that we want to be played after animation iteration finished for example ()=>{this.updateValue(30, TimeUnits.minute, false)}
        */
    this.#animationHandler = {
      hour: {
        isTextAnimationPlaying: false,
        waitingAction: null,
      },
      minute: {
        isTextAnimationPlaying: false,
        waitingAction: null,
      },
      second: {
        isTextAnimationPlaying: false,
        waitingAction: null,
      },
    };
    this.#initTimeTextNodes();
    this.#initTimeUnitIndicator();
    this.#initSeparators();
  }
  static get observedAttributes(): string[] {
    return [];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // do something when an attribute has changed
    this.#onAttributeChange(name, newValue);
  }
  #onAttributeChange(name: string, value: string) {
    // switch (name) {
    //     // case 'name':
    //     //     break;
    // }
  }
  #handleTextClick(timeUnit: TimeUnitsString, timeStep: TimeSteps) {
    //in mouse up we check if user not dragged anything call click by ourself
    if (timeStep == TimeSteps.prev || timeStep == TimeSteps.next) {
      const value = this.elements[timeStep][timeUnit]!.innerHTML;
      const validValue = this.#getValidValue(parseInt(value), timeUnit);
      this.#updateValue(validValue, timeUnit, true);
    }
  }
  #onTextTouchStart(e: TouchEvent, timeUnit: TimeUnits, timeStep: TimeSteps) {
    const currentYPos = e.touches[0].pageY;
    this.#handleTextMouseDown(currentYPos, timeUnit, timeStep);
  }
  #onTextMouseDown(e: MouseEvent, timeUnit: TimeUnits, timeStep: TimeSteps) {
    const currentYPos = e.pageY;
    this.#handleTextMouseDown(currentYPos, timeUnit, timeStep);
  }
  #handleTextMouseDown(currentYPos: number, timeUnit: TimeUnits, timeStep: TimeSteps) {
    const grabbedElement = this.elements.prevTime[timeUnit];
    this.#grabbedElement = {
      dom: grabbedElement,
      timeUnit: timeUnit,
      timeStep: timeStep,
      startY: currentYPos,
      //how many time we add or subtract current time unit
      iterationDone: 0,
      // what is the last action we done
      lastAction: null,
      //next 4 prop is for handling user action when user change time uint text value but without mouseup he decided to put it back in prev place
      //record all (except move) action occurred on this mouse down to next mouse leave
      actionRecords: [],
      addActionRecord: function (action) {
        if (action !== ActionTypes.move) {
          this.actionRecords.push(action);
        }
        this.lastAction = action;
      },
      get lastLogicalAction() {
        return this.actionRecords[this.actionRecords.length - 1];
      },
      //when user move and drag element we make it true so click event can distinguish drag and click
      isDragged: false,
      //this part is for handling fast swipe when user fast swipe and we want to add or subtract more than on number
      // we calc acceleration on mouse up base on user moving behavior and decide how many iteration we need
      acc: {
        //we capture all movementY user do but when user change mouse move direction we reset it becuase
        //این آرایه فقط وقتی مهمه که حرکت کاربر در یک جهت باشه که ما بتونیم شتاب یک حرکت کاربر رو محاسبه کنیم و اگه موس کاربر تغییر جهت بده از نظر ما حرکت جدیدی شروع شده
        inDirectionMoveStack: [0],
        // in touch mode we cant have e.movementY so we use this stack to store it and calc moveY on touch move
        prevTouchYPos: null,
        //1 for down move -1 for up move
        direction: 0,
        //firstmove time
        t: performance.now(),
        captureMove: function (movementY) {
          const newDirection = movementY > 0 ? 1 : -1;
          if (newDirection == this.direction || this.direction == 0) {
            //when new
            this.inDirectionMoveStack.push(movementY);
            this.direction = newDirection;
          } else {
            this.inDirectionMoveStack = [movementY];
            this.direction = newDirection;
            this.t = performance.now();
          }
        },
      },
    };
    this.setTimeUnitFocus(timeUnit);
  }
  #onMouseMove(e: MouseEvent) {
    const currentYPos = e.pageY;
    const movementY = e.movementY;
    this.#handleTextDrag(currentYPos, movementY);
  }
  /**
   *
   * @param {TouchEvent} e
   */
  #onTouchMove(e: TouchEvent) {
    if (this.#grabbedElement) {
      const currentYPos = e.touches[0].pageY;
      const prevTouchYPos = this.#grabbedElement.acc.prevTouchYPos
        ? this.#grabbedElement.acc.prevTouchYPos
        : this.#grabbedElement.startY;
      //update prev y for next move
      this.#grabbedElement.acc.prevTouchYPos = currentYPos;
      const movementY = currentYPos - prevTouchYPos;
      e.preventDefault();
      this.#handleTextDrag(currentYPos, movementY);
    }
  }
  /**
   * handle text drag on touch move or mouse move
   * @param {Number} currentYPos finger or mouse current position on screen in y axis
   * @param {Number} movementY //finger or mouse movement on screen in y axis
   */
  #handleTextDrag(currentYPos: number, movementY: number) {
    if (this.#grabbedElement) {
      this.#grabbedElement.isDragged = true;
      //how much y change is important to us to change position of element
      const sensitiveDiffValue = 100;
      const yDiff = currentYPos - this.#grabbedElement.startY;
      // mouse movement diff is base on dom pixel we must convert them to svg pixel scale
      const svgYDiff = this.#defaultPositions.svgPosScale * yDiff;
      //what we want to do
      let action = ActionTypes.move; //default is just move items
      if (
        (this.#grabbedElement.iterationDone == 0 ||
          this.#grabbedElement.lastLogicalAction == ActionTypes.add1) &&
        svgYDiff > sensitiveDiffValue
      ) {
        //if prev value was valid we let user substrack
        if (this.#value[this.#grabbedElement.timeUnit]! > 0) {
          action = ActionTypes.subtract1;
        }
      }
      if (
        (this.#grabbedElement.iterationDone == 0 ||
          this.#grabbedElement.lastLogicalAction == ActionTypes.subtract1) &&
        svgYDiff < -1 * sensitiveDiffValue
      ) {
        if (
          this.#value[this.#grabbedElement.timeUnit]! <
          this.#maxTimeUnitValues[this.#grabbedElement.timeUnit]
        ) {
          action = ActionTypes.add1;
        }
      }
      if (action == ActionTypes.subtract1) {
        this.#value[this.#grabbedElement.timeUnit] =
          this.#value[this.#grabbedElement.timeUnit]! - 1;
        this.#triggerOnChangeEvent();
        //in this case we try to decrease grabbed time by 1 so we keep track of it.
        this.#grabbedElement.iterationDone += 1;
        this.#subtractTimeTextUnitDomOperation(
          this.#grabbedElement.timeUnit,
          svgYDiff
        );
        // we update mouse y on grab becuase next movement will be calculated base on current mouse pos so yDiff calc correctly base on switched places element
        this.#grabbedElement.startY = currentYPos;
        //update  grabbed time step after swap changing done
        this.#grabbedElement.timeStep =
          this.#grabbedElement.timeStep == TimeSteps.current
            ? "nextTime"
            : "currentTime";

        //
        this.#onTimeTextChange(
          this.#grabbedElement.timeUnit,
          this.#value[this.#grabbedElement.timeUnit]!
        );
      } else if (action == ActionTypes.add1) {
        // we add value first
        this.#value[this.#grabbedElement.timeUnit] =
          this.#value[this.#grabbedElement.timeUnit]! + 1;
        this.#triggerOnChangeEvent();
        //user scroll up and want to add to time unit
        //in this case we try to increase grabbed time by 1 so we keep track of it.
        this.#grabbedElement.iterationDone += 1;
        this.#addTimeTextUnitDomOperation(
          this.#grabbedElement.timeUnit,
          svgYDiff
        );
        // we update mouse y on grab becuase next movement will be calculated base on current mouse pos so yDiff calc correctly base on switched places element
        this.#grabbedElement.startY = currentYPos;
        //update  grabbed time step after swap changeing done
        this.#grabbedElement.timeStep =
          this.#grabbedElement.timeStep == TimeSteps.current
            ? "prevTime"
            : "currentTime";
        //
        this.#onTimeTextChange(
          this.#grabbedElement.timeUnit,
          this.#value[this.#grabbedElement.timeUnit]!
        );
      } else {
        if (this.elements.substitutePrevTime[this.#grabbedElement.timeUnit]) {
          this.elements.substitutePrevTime[
            this.#grabbedElement.timeUnit
          ]!.style.transform = `translateY(${svgYDiff}px)`;
        }
        if (this.elements.prevTime[this.#grabbedElement.timeUnit]) {
          this.elements.prevTime[
            this.#grabbedElement.timeUnit
          ]!.style.transform = `translateY(${svgYDiff}px)`;
        }
        this.elements.currentTime[
          this.#grabbedElement.timeUnit
        ]!.style.transform = `translateY(${svgYDiff}px)`;
        if (this.elements.nextTime[this.#grabbedElement.timeUnit]) {
          this.elements.nextTime[
            this.#grabbedElement.timeUnit
          ]!.style.transform = `translateY(${svgYDiff}px)`;
        }
        if (this.elements.substituteNextTime[this.#grabbedElement.timeUnit]) {
          this.elements.substituteNextTime[
            this.#grabbedElement.timeUnit
          ]!.style.transform = `translateY(${svgYDiff}px)`;
        }
      }
      // we memorize what we do in this move event so we can use it in next move
      this.#grabbedElement.addActionRecord(action);
      // to detect swipe we start to capture user movement so we can play swipe on mouse up
      this.#grabbedElement.acc.captureMove(movementY);
    }
  }
  #subtractTimeTextUnitDomOperation(
    timeUnit: TimeUnitsString,
    svgYDiff: number
  ) {
    //when we subtrack the value and we want all  swap dom place job be done
    //remember allways update this._value befor call this function
    //remove old next substitude dom becuse it will replaced
    const forDeleteSubDom = this.elements.substituteNextTime[timeUnit];
    this.elements.substituteNextTime[timeUnit] = null;
    if (forDeleteSubDom) {
      forDeleteSubDom.remove();
    }
    //move element to they new right parent
    this.#changeTimeTextParent(
      timeUnit,
      "nextTime",
      "substituteNextTime",
      svgYDiff
    );
    this.#changeTimeTextParent(
      timeUnit,
      "currentTime",
      "nextTime",
      svgYDiff
    );
    this.#changeTimeTextParent(
      timeUnit,
      "prevTime",
      "currentTime",
      svgYDiff
    );
    this.#changeTimeTextParent(
      timeUnit,
      "substitutePrevTime",
      "prevTime",
      svgYDiff
    );
    // add new prev substitude element
    if (this.#value && this.#value[timeUnit]! > 1) {
      const prevSubstituteValue = this.#value[timeUnit]! - 2;
      const newSubstitutePrev = this.#createTimeTextDOM(
        timeUnit,
        "substitutePrevTime",
        prevSubstituteValue
      );
      this.elements.substitutePrevTime.wrapper.appendChild(newSubstitutePrev);
      this.elements.substitutePrevTime[timeUnit] = newSubstitutePrev;
    }
  }
  #addTimeTextUnitDomOperation(timeUnit: TimeUnitsString, svgYDiff: number) {
    //when we add to the value and we want all  swap dom place job be done
    //remember always update this._value before call this function
    //remove old prev substitute dom because it will replaced
    const forDeleteSubDom = this.elements.substitutePrevTime[timeUnit];
    this.elements.substitutePrevTime[timeUnit] = null;
    if (forDeleteSubDom) {
      forDeleteSubDom.remove();
    }
    //move element to they new right parent
    this.#changeTimeTextParent(
      timeUnit,
      "prevTime",
      "substitutePrevTime",
      svgYDiff
    );
    this.#changeTimeTextParent(
      timeUnit,
      "currentTime",
      "prevTime",
      svgYDiff
    );
    this.#changeTimeTextParent(
      timeUnit,
      "nextTime",
      "currentTime",
      svgYDiff
    );
    this.#changeTimeTextParent(
      timeUnit,
      "substituteNextTime",
      "nextTime",
      svgYDiff
    );

    // add new prev substitute element
    if (this.#value[timeUnit] + 1 < this.#maxTimeUnitValues[timeUnit]) {
      const nextSubstituteValue = this.#value[timeUnit] + 2;
      const newSubstituteNext = this.#createTimeTextDOM(timeUnit,"substituteNextTime",nextSubstituteValue);
      this.elements.substituteNextTime.wrapper.appendChild(newSubstituteNext);
      this.elements.substituteNextTime[timeUnit] = newSubstituteNext;
    }
  }
  #changeTimeTextParent(timeUnit: TimeUnits, currentTimeStep: TimeSteps, newTimeStep: TimeSteps, yDiff: number) {
    const dom = this.elements[currentTimeStep][timeUnit];
    if (dom) {
      //@ts-ignore
      dom.setAttribute("y", this.#defaultPositions[newTimeStep + "TextY"]);
      // after we swap we need to reverse transition base on new pos
      let newYDiff = 0;
      if (yDiff > 0) {
        //on top to bottom move dir
        newYDiff = -1 * (this.#defaultPositions.timeStepYDiff - yDiff);
      }
      if (yDiff < 0) {
        //on bottom to  top move dir
        newYDiff = this.#defaultPositions.timeStepYDiff + yDiff;
      }
      dom.style.transform = `translateY(${newYDiff}px)`;
      this.elements[newTimeStep].wrapper.appendChild(dom);
      this.elements[newTimeStep][timeUnit] = dom;
      // we change on mouse down vent base on new units and parent
      this.#attachMouseDownEventToTimeTextDOM(timeUnit, newTimeStep);
      this.elements[currentTimeStep][timeUnit] = null;
    }
  }
  #handleTextMouseUp() {
    if (this.#grabbedElement) {
      this.#handleUserBigSwipe();
      const timeUnit = this.#grabbedElement.timeUnit;
      const timeStep = this.#grabbedElement.timeStep;
      this.#moveBackToPos(this.elements.substitutePrevTime[timeUnit]!);
      this.#moveBackToPos(this.elements.prevTime[timeUnit]!);
      this.#moveBackToPos(this.elements.currentTime[timeUnit]!);
      this.#moveBackToPos(this.elements.nextTime[timeUnit]!);
      this.#moveBackToPos(this.elements.substituteNextTime[timeUnit]!);
      if (!this.#grabbedElement.isDragged) {
        this.#handleTextClick(timeUnit, timeStep);
      }
      this.#grabbedElement = null;
    }
  }

  #moveBackToPos(dom: SVGGElement) {
    if (dom) {
      //remove all transform and changed pos from element and returned it to natrual place. used on drop event
      dom.style.transition = `transform 0.3s 0s ease`;
      //remove above assigned animation
      setTimeout(() => {
        dom.style.transition = "";
      }, 300);
      dom.style.transform = ``;
    }
  }
  #createTimeTextDOM(timeUnit: TimeUnitsString,timeStep: TimeSteps,timeValue: number) {
    const xmlns = "http://www.w3.org/2000/svg";
    //<text class="hour-text time-text" dominant-baseline="middle" textLength="150" y="212" x="212"></text>
    //@ts-ignore
    const y = this.#defaultPositions[timeStep + "TextY"];
    //@ts-ignore
    const x = this.#defaultPositions[timeUnit + "TextX"];
    const textElem = document.createElementNS(xmlns, "text");
    textElem.classList.add(`${timeUnit}-text`, "time-text");
    textElem.setAttributeNS(null, "dominant-baseline", "middle");
    if(this.textWidth){
      textElem.setAttributeNS(null, "textLength", this.textWidth.toString());
    }
    textElem.setAttributeNS(null, "lengthAdjust", "spacing");
    textElem.setAttributeNS(null, "y", y);
    textElem.setAttributeNS(null, "x", x);
    // turn 2 to 02 if configured by user
    let valueString = timeValue.toString();
    if (this.frontalZero && timeValue < 10) {
      valueString = "0" + valueString;
    }
    if(this.#showPersianNumber){
      valueString = enToFaDigits(valueString);
    }
    textElem.innerHTML = valueString;
    //attach class
    if (this.focusedTimeUnit == timeUnit) {
      textElem.classList.add("--focused");
    }
    if (this.optionalUnits.includes(timeUnit)) {
      textElem.classList.add("--optional");
    }
    return textElem;
  }
  #onTimeTextChange(timeUnit: TimeUnits, value: number) {
    this.#placeTimeUnitIndicator(timeUnit, value);
  }

  #placeTimeUnitIndicator(timeUnit: TimeUnits, value: number) {
    const pos = this.#getUnitXYPoint(value, timeUnit);
    this.elements.timeIndicators[timeUnit].setAttribute("x", pos.x.toString());
    this.elements.timeIndicators[timeUnit].setAttribute("y", pos.y.toString());
  }
  #getUnitXYPoint(value: number, TimeUnit: TimeUnits) {
    const eachUnitDeg = TimeUnit == TimeUnits.hour ? 30 : 6;
    //480+512/2 middle of ring
    const r = 496;
    const centerX = 512;
    const centerY = 512;
    const angle = value * eachUnitDeg - 90;
    const radian = angle * (Math.PI / 180);
    const x = centerX + Math.cos(radian) * r;
    const y = centerY + Math.sin(radian) * r;
    return { x, y };
  }
  /**
   * @public
   * @description let user change focused time unit from outside 
   */
  setTimeUnitFocus(timeUnit: TimeUnits) {
    //when user select certain unit like hour and try to change it by text wheel or indicator or something elese or even programicaly we exec this method
    if (timeUnit != this.focusedTimeUnit) {
      const oldFocusedTimeUnit = this.focusedTimeUnit;
      this.focusedTimeUnit = timeUnit;
      if (timeUnit) {
        //set new focus DOM class
        this.elements.currentTime[timeUnit]!.classList.add("--focused");
        //if hour is 24 or 0 next and prev may not be available
        if (this.elements.nextTime[timeUnit]) {
          this.elements.nextTime[timeUnit]!.classList.add("--focused");
        }
        if (this.elements.prevTime[timeUnit]) {
          this.elements.prevTime[timeUnit]!.classList.add("--focused");
        }
        if (this.elements.substitutePrevTime[timeUnit]) {
          this.elements.substitutePrevTime[timeUnit]!.classList.add("--focused");
        }
        if (this.elements.substituteNextTime[timeUnit]) {
          this.elements.substituteNextTime[timeUnit]!.classList.add("--focused");
        }
        this.elements.timeIndicators[timeUnit].classList.add("--focused");
      }
      //remove old focus dom
      if (oldFocusedTimeUnit && oldFocusedTimeUnit !== null) {
        this.elements.currentTime[oldFocusedTimeUnit]!.classList.remove(
          "--focused"
        );
        if (this.elements.nextTime[oldFocusedTimeUnit]) {
          this.elements.nextTime[oldFocusedTimeUnit]!.classList.remove(
            "--focused"
          );
        }
        if (this.elements.prevTime[oldFocusedTimeUnit]) {
          this.elements.prevTime[oldFocusedTimeUnit]!.classList.remove(
            "--focused"
          );
        }
        if (this.elements.substitutePrevTime[oldFocusedTimeUnit]) {
          this.elements.substitutePrevTime[oldFocusedTimeUnit]!.classList.remove(
            "--focused"
          );
        }
        if (this.elements.substituteNextTime[oldFocusedTimeUnit]) {
          this.elements.substituteNextTime[oldFocusedTimeUnit]!.classList.remove(
            "--focused"
          );
        }
        this.elements.timeIndicators[oldFocusedTimeUnit].classList.remove(
          "--focused"
        );
      }
    }
  }
  /**
   * //if user swipe(move mouse in one direction more than enough pixel fast) we must change value more than 1 iteration
   * @private
   */
  #handleUserBigSwipe() {
    if (this.#grabbedElement) {
      const movementSum = this.#grabbedElement.acc.inDirectionMoveStack.reduce(
        (a, b) => {
          return a + b;
        }
      );
      const vectorScaleMovementSum =
        this.#defaultPositions.svgPosScale * movementSum;
      const swipeDuration = performance.now() - this.#grabbedElement.acc.t;
      const acceleration = movementSum / swipeDuration;
      //console.table({movementSum,vectorScaleMovementSum,swipeDuration,acceleration});
      //how much user must move mouse so we start adding multiple value with animation
      const sensitiveYDiffPoint = 200;
      if (Math.abs(vectorScaleMovementSum) > sensitiveYDiffPoint) {
        //TODO: its better to be a combination of acceleration and vectorScaleMovementSum but im bad at physic so i make it simple
        const neededItration = Math.round(Math.abs(acceleration * 10));
        const timeUnit = this.#grabbedElement.timeUnit;
        //this.grabbedElement.acc.direction is -1 for add and 1 for sub so we *-1 it
        const newValue =
          this.#grabbedElement.acc.direction * -1 * neededItration +
          this.value[timeUnit]!;
        const validNewValue = this.#getValidValue(newValue, timeUnit);
        this.#updateValue(validNewValue, timeUnit);
      }
    }
  }
  /**
   * @private
   * @param {number} value new value
   * @param {TimeUnitsString} timeUnit hour minute or second
   * @param {boolean} canTriggerOnChange when this method called in response of outside value update we dont call onChange so this flag will be false in that situation or other time we dont want to trigger change event
   */
  #updateValue(value: number,timeUnit: TimeUnitsString,canTriggerOnChange = true) {
    //how many iteration we need to get to the right point in value
    const timeDistance = value - this.value[timeUnit]!;
    if (timeDistance == 0) {
      return;
    }
    let remainingDistance = Math.abs(timeDistance);
    const direction = timeDistance > 0 ? 1 : timeDistance == 0 ? 0 : -1;
    const add1ToValue = () => {
      // we simulate Promise.race for callback
      let isOnFinishedExecuted = false;
      const onFinish = () => {
        if (!isOnFinishedExecuted) {
          this.#animationHandler[timeUnit].isTextAnimationPlaying = false;
          isOnFinishedExecuted = true;
          this.#value[timeUnit] = this.#value[timeUnit]! + direction;
          if (canTriggerOnChange) {
            this.#triggerOnChangeEvent();
          }
          if (direction == 1) {
            this.#addTimeTextUnitDomOperation(timeUnit, 0);
          }
          if (direction == -1) {
            this.#subtractTimeTextUnitDomOperation(timeUnit, 0);
          }
          if (
            typeof this.#animationHandler[timeUnit].waitingAction === "function"
          ) {
            //if new value setted and we must stop current value animation iteration and exec waiting action
            this.#animationHandler[timeUnit].waitingAction!();
            this.#animationHandler[timeUnit].waitingAction = null;
          } else {
            //continue animation iteration

            remainingDistance--;
            if (remainingDistance > 0) {
              add1ToValue();
            }
          }
        }
      };
      //calc animation duration for each iteration
      const minT = 50;
      const maxT = 200;
      const accTime =
        Math.abs(timeDistance) == 1
          ? 100
          : (maxT - minT) / (Math.abs(timeDistance) - 1);
      const animationDuration =
        minT + accTime * (Math.abs(timeDistance) - remainingDistance);
      const animationEasing = remainingDistance == 1 ? "ease" : "linear";
      // play animation
      this.#animationHandler[timeUnit].isTextAnimationPlaying = true;
      this.#playTextNodeAnimation(
        timeUnit,
        "substitutePrevTime",
        direction,
        onFinish,
        animationDuration,
        animationEasing
      );
      this.#playTextNodeAnimation(
        timeUnit,
        "prevTime",
        direction,
        onFinish,
        animationDuration,
        animationEasing
      );
      this.#playTextNodeAnimation(
        timeUnit,
        "currentTime",
        direction,
        onFinish,
        animationDuration,
        animationEasing
      );
      this.#playTextNodeAnimation(
        timeUnit,
        "nextTime",
        direction,
        onFinish,
        animationDuration,
        animationEasing
      );
      this.#playTextNodeAnimation(
        timeUnit,
        "substituteNextTime",
        direction,
        onFinish,
        animationDuration,
        animationEasing
      );
      this.#placeTimeUnitIndicator(timeUnit, value);
    };
    if (remainingDistance > 0) {
      add1ToValue();
    }
  }
  /**
   * @private
   * @param {string} timeUnit
   * @param {string} timeStep
   * @param {integer} direction -1 or 1. -1 mean subtracted +1 mean add
   * @param {Function} onFinish callback to what happen when animation finished
   * @param {Number} animationDuration how many millisecond animation take
   * @param {string} animationEasing optional and determine animation ease param
   */
  #playTextNodeAnimation(
    timeUnit: TimeUnits,
    timeStep: TimeSteps,
    direction: number,
    onFinish: () => void,
    animationDuration = 100,
    animationEasing = "linear"
  ) {
    //for mor code readabilityy we set direction in meaning way
    const iterationHeight = -1 * direction * this.#defaultPositions.timeStepYDiff;
    const animationId = `${Math.random()}-animation`;
    const element = this.elements[timeStep][timeUnit];
    if (element) {
      const animation = element.animate(
        [
          { transform: `translateY(${0}px)` },
          { transform: `translateY(${iterationHeight}px)` },
        ],
        {
          id: animationId,
          duration: animationDuration,
          easing: animationEasing,
        }
      );
      animation.onfinish = onFinish;
    }
  }
  #getValidValue(value: number, timeUnit: TimeUnits) {
    if (value < 0) {
      return 0;
    }
    if (value > this.#maxTimeUnitValues[timeUnit]) {
      return this.#maxTimeUnitValues[timeUnit];
    }
    return Math.round(value);
  }
  /**
   * call all change event listener. we must call it when a change occur
   * @private
   */
  #triggerOnChangeEvent() {
    const event = new CustomEvent("change");
    this.dispatchEvent(event);
  }
  #disableSecond() {
    /**
     *
     * @param {HTMLElement} element
     */
    function hideElement(element: SVGTextElement | SVGGElement) {
      if (element) {
        element.classList.add("--hidden");
      }
    }
    hideElement(this.elements.currentTime.second!);
    hideElement(this.elements.nextTime.second!);
    hideElement(this.elements.substituteNextTime.second!);
    hideElement(this.elements.prevTime.second!);
    hideElement(this.elements.substitutePrevTime.second!);
    hideElement(this.elements.timeIndicators.second!);
    hideElement(this.elements.separatorTexts[1]);
    this.#initTimeTextNodes();
    this.#initTimeUnitIndicator();
    this.#initSeparators();
  }
  #enableSecond() {
    /**
     *
     * @param {HTMLElement} element
     */
    function showElement(element: SVGTextElement | SVGGElement) {
      if (element) {
        element.classList.remove("--hidden");
      }
    }
    showElement(this.elements.currentTime.second!);
    showElement(this.elements.nextTime.second!);
    showElement(this.elements.substituteNextTime.second!);
    showElement(this.elements.prevTime.second!);
    showElement(this.elements.substitutePrevTime.second!);
    showElement(this.elements.timeIndicators.second);
    showElement(this.elements.separatorTexts[1]);
    this.#initTimeTextNodes();
    this.#initTimeUnitIndicator();
    this.#initSeparators();
  }
  #initSeparators() {
    this.elements.separatorTexts[0].setAttribute(
      "x",
      this.#separatorsXPosition[0].toString()
    );
    if (this.secondEnabled) {
      this.elements.separatorTexts[1].setAttribute(
        "x",
        this.#separatorsXPosition[1].toString()
      );
      this.elements.separatorTexts[1].classList.remove("--hidden");
    } else {
      this.elements.separatorTexts[1].classList.add("--hidden");
    }
  }
}
const myElementNotExists = !customElements.get("jb-time-picker");
if (myElementNotExists) {
  window.customElements.define("jb-time-picker", JBTimePickerWebComponent);
}
