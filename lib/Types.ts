export type JBTimeInputElements = {
    svgDOM:SVGElement;
    timeIndicators: {
        hour: SVGGElement;
        minute: SVGGElement;
        second: SVGGElement;
    },
    substitutePrevTime: {
        wrapper: SVGGElement,
        hour: SVGGElement | null;
        minute: SVGGElement | null;
        second: SVGGElement | null;
    },
    prevTime: {
        wrapper: SVGGElement;
        hour: SVGGElement | null;
        minute: SVGGElement | null;
        second: SVGGElement | null;
    },
    currentTime: {
        wrapper: SVGGElement;
        hour: SVGGElement | null;
        minute: SVGGElement | null;
        second: SVGGElement | null;
    },
    nextTime: {
        wrapper: SVGGElement;
        hour: SVGGElement | null;
        minute: SVGGElement | null;
        second: SVGGElement | null;
    },
    substituteNextTime: {
        wrapper: SVGGElement;
        hour: SVGGElement | null;
        minute: SVGGElement | null;
        second: SVGGElement | null;
    },
    sepratorTexts: NodeListOf<SVGTextElement> 
}

export type DefaultPositions = {
    substitutePrevTimeTextY:number;
            prevTimeTextY: number;
            currentTimeTextY: number;
            nextTimeTextY: number;
            substituteNextTimeTextY: number;
            hourTextX:number;
            minuteTextX:number;
            secondTextX:number;
            //y diffrent between two time step
            timeStepYDiff: number,
            //zarib tabdil dom pos -> svg pos
           svgPosScale:number
}
type AnimationHandlerPerUnit = {
    isTextAnimationPlaying: boolean,
    waitingAction: (()=>void) | null,
}
export type AnimationHandler = {
    hour: AnimationHandlerPerUnit ;
    minute: AnimationHandlerPerUnit;
    second: AnimationHandlerPerUnit;
}
export type GrabbedElement = {
    dom:SVGGElement;
    timeUnit:string;
    timeStep:string;
    startY:number;
    itrationDone:number;
    lastAction: string | null;
    actionRecords:string[];
    addActionRecord:(action:string)=>void;
    lastLogicalAction:string;
    isDragged:boolean;
    acc:{
        inDirectionMoveStack:number[];
        prevTouchYPos: number | null;
        direction:number;
        t:number;
        captureMove: (movementY:number)=>void;
    }
}
export type JBTimePickerValueObject = {
    hour:number;
    minute:number;
    second?:number;
}
export type SecondRange = [null| number, null| number];