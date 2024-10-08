export type TimeUnits = "hour" | "minute" | "second";
export type TimeSteps = "prevTime" | "currentTime" | "nextTime" | "substitutePrevTime" | "substituteNextTime";
export type JBTimeInputElements = {
    svgDOM: SVGElement;
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
    separatorTexts: NodeListOf<SVGTextElement>
}

export type DefaultPositions = {
    substitutePrevTimeTextY: number;
    prevTimeTextY: number;
    currentTimeTextY: number;
    nextTimeTextY: number;
    substituteNextTimeTextY: number;
    hourTextX: number;
    minuteTextX: number;
    secondTextX: number;
    //y difference between two time step
    timeStepYDiff: number,
    //zarib tabdil dom pos -> svg pos
    svgPosScale: number
}
type AnimationHandlerPerUnit = {
    isTextAnimationPlaying: boolean,
    waitingAction: (() => void) | null,
}
export type AnimationHandler = {
    [key in TimeUnitsString]: AnimationHandlerPerUnit;
}
export type GrabbedElement = {
    dom: SVGGElement;
    timeUnit: TimeUnitsString;
    timeStep: TimeSteps;
    startY: number;
    iterationDone: number;
    lastAction: string | null;
    actionRecords: string[];
    addActionRecord: (action: string) => void;
    lastLogicalAction: string;
    isDragged: boolean;
    acc: {
        inDirectionMoveStack: number[];
        prevTouchYPos: number | null;
        direction: number;
        t: number;
        captureMove: (movementY: number) => void;
    }
}
type JBTimePickerFullValueObject = {
    [key in TimeUnitsString]: number
}
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type JBTimePickerValueObject = Optional<JBTimePickerFullValueObject, 'second'>;

export type SecondRange = [null | number, null | number];
export type TimeUnitsString = 'hour' | 'minute' | 'second';
export type TimeUnitsObject = {
    [key in TimeUnitsString]: TimeUnitsString
}