const { randomUUID } = require("crypto");
const { writeFileSync, readFileSync } = require("fs");

/**
 * The total time the macro needs to execute may not be equal to the sum of the wait times defined
 */

/**
 * Define the macro as a list of strings; Example inputs include
 * m l 50 - presses down the left mouse button for 50 ms, then releases
 * m r 50 - right click
 * m m 50 - mouse wheel click
 * b k 100 - presses down the button "k" for 100 ms, then releases
 * bd rshift [200] - presses down the rshift button after an optional 200 ms wait, a "bu rshift" command should be called later on
 * p 400 500 - sets the mouse position to x=400 y=500
 * p ~-17 ~50 - moves the mouse 17 pixels to the left and 50 up
 * w 500 - wait 500 ms, may not use the "async" keyword
 */

const actions = {
    setMouse: {
        BindingGuid: "00000000-0000-0000-0000-000000000000",
        Guid: "<uuid>",
        MacroActionType: 3,
        Flags: 0,
        ScanCode: 0,
        VisualKeyCode: 0,
        IsLeftSide: false,
        IsRightSide: false,
        Win32MouseKeys: 0,
        TimeSpan: "<delay>",
        X: -1,
        Y: -1,
        Delta: 0
    },
    moveMouse: {
        BindingGuid: "00000000-0000-0000-0000-000000000000",
        Guid: "<uuid>",
        MacroActionType: 4,
        Flags: 0,
        ScanCode: 0,
        VisualKeyCode: 0,
        IsLeftSide: false,
        IsRightSide: false,
        Win32MouseKeys: 0,
        TimeSpan: "<delay>",
        X: -1,
        Y: -1,
        Delta: 0
    },
    mouseDown: {
        BindingGuid: "<uuid_connection>",
        Guid: "<uuid>",
        MacroActionType: 5,
        Flags: 0,
        ScanCode: 0,
        VisualKeyCode: 0,
        IsLeftSide: false,
        IsRightSide: false,
        Win32MouseKeys: -1,
        TimeSpan: "<delay>",
        X: 0,
        Y: 0,
        Delta: 0
    },
    mouseUp: {
        BindingGuid: "<uuid_connection>",
        Guid: "<uuid>",
        MacroActionType: 6,
        Flags: 0,
        ScanCode: 0,
        VisualKeyCode: 0,
        IsLeftSide: false,
        IsRightSide: false,
        Win32MouseKeys: -1,
        TimeSpan: "<delay>",
        X: 0,
        Y: 0,
        Delta: 0
    },
    buttonDown: {
        BindingGuid: "<uuid_connection>",
        Guid: "<uuid>",
        MacroActionType: 8,
        Flags: 0,
        ScanCode: -1,
        VisualKeyCode: -1,
        IsLeftSide: false,
        IsRightSide: false,
        Win32MouseKeys: 0,
        TimeSpan: "<delay>",
        X: 0,
        Y: 0,
        Delta: 0
    },
    buttonUp: {
        BindingGuid: "<uuid_connection>",
        Guid: "<uuid>",
        MacroActionType: 9,
        Flags: 128,
        ScanCode: -1,
        VisualKeyCode: -1,
        IsLeftSide: false,
        IsRightSide: false,
        Win32MouseKeys: 0,
        TimeSpan: "<delay>",
        X: 0,
        Y: 0,
        Delta: 0
    }
};

const win32MouseKeys = {
    l: 2,
    r: 8,
    m: 32
};

const buttonMap = {
    esc: [1, 27],
    back: [14, 8],
    space: [57, 32],
    enter: [28, 13],
    apps: [93, 93, 1, 1],
    caps: [58, 20],
    tab: [15, 9],
    lshift: [42, 160],
    lctrl: [28, 162],
    lalt: [56, 164, 32],
    lctrlaltmod: [541, 162, 32, 0], // press down this button before R ALT to turn it into ALT GR
    rshift: [54, 161, 1, 1],
    rctrl: [29, 163, 1, 1],
    ralt: [56, 165, 33, 1],
    1: [2, 49],
    2: [3, 50],
    3: [4, 51],
    4: [5, 52],
    5: [6, 53],
    6: [7, 54],
    7: [8, 55],
    8: [9, 56],
    9: [10, 57],
    0: [11, 48],
    ß: [],
    q: [16, 81],
    w: [17, 87],
    e: [18, 69],
    r: [19, 82],
    t: [20, 84],
    z: [21, 90],
    u: [22, 85],
    i: [23, 73],
    o: [24, 79],
    p: [25, 80],
    ü: [26, 186],
    "+": [27, 187],
    a: [30, 65],
    s: [31, 83],
    d: [32, 68],
    f: [33, 70],
    g: [34, 71],
    h: [35, 72],
    j: [36, 74],
    k: [37, 75],
    l: [38, 76],
    ö: [39, 192],
    ä: [40, 222],
    "#": [43, 191],
    y: [44, 89],
    x: [45, 88],
    c: [46, 67],
    v: [47, 86],
    b: [48, 66],
    n: [49, 78],
    m: [50, 77],
    ",": [51, 188],
    ".": [52, 190],
    "-": [53, 189]
};

const out = {
    MultipleTimes: 1,
    MacroPlaybackOption: 0,
    MacroActions: [
        {
            BindingGuid: "00000000-0000-0000-0000-000000000000",
            Guid: randomUUID(),
            MacroActionType: 2,
            Flags: 0,
            ScanCode: 0,
            VisualKeyCode: 0,
            IsLeftSide: false,
            IsRightSide: false,
            Win32MouseKeys: 0,
            TimeSpan: "00:00:00.0050000",
            X: 0,
            Y: 0,
            Delta: 0
        }
    ]
}

// input
const input = JSON.parse(readFileSync("./input.json", "utf-8"));

const macro = input.macro;

const defaultDelay = input.defaultDelay;

// main logic

function formatTimeSpan(ms) {
    if (nextElementWait > 0) {
        ms = nextElementWait;
        nextElementWait = 0;
    }
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}0000`
}

let nextElementWait = 0;
const hasStartPosition = input.startPosition && Number.isInteger(input.startPosition[0]) && Number.isInteger(input.startPosition[1]);
let lastMousePosition = hasStartPosition ? input.startPosition : [0, 0];
if (hasStartPosition) {
    const action = Object.assign({}, actions.setMouse);
    action.TimeSpan = formatTimeSpan(20);
    action.BindingGuid = "00000000-0000-0000-0000-000000000000";
    action.Guid = randomUUID();
    action.X = lastMousePosition[0];
    action.Y = lastMousePosition[1];
    out.MacroActions.push(action);
}

const expectedActions = [];

for (const cmdstring of macro) {
    if (cmdstring.startsWith("w ")) {
        nextElementWait += Number(cmdstring.slice(2).trim());
        continue;
    }

    if (cmdstring.startsWith("p ")) {
        const args = cmdstring.split(" ").slice(1);
        let action = null;
        if (args[0].startsWith("~")) {
            action = Object.assign({}, actions.moveMouse);
            args[0] = Number(args[0].slice(1));
            args[1] = Number(args[1].slice(1));
            lastMousePosition = [lastMousePosition[0] + args[0], lastMousePosition[1] + args[1]];
        } else {
            action = Object.assign({}, actions.moveMouse);
            args[0] = Number(args[0]) - lastMousePosition[0];
            args[1] = Number(args[1]) - lastMousePosition[1];
            lastMousePosition = [lastMousePosition[0] + args[0], lastMousePosition[1] + args[1]];
        }
        action.TimeSpan = formatTimeSpan(defaultDelay);
        action.BindingGuid = "00000000-0000-0000-0000-000000000000";
        action.Guid = randomUUID();
        action.X = args[0];
        action.Y = args[1];
        out.MacroActions.push(action);
        continue;
    }

    if (cmdstring.startsWith("bd ")) {
        const args = cmdstring.split(" ").slice(1);
        const button = buttonMap[args[0]];

        if (expectedActions.some(v => v.VisualKeyCode === button[1] && v.ScanCode === button[0]))
            throw new Error(`Error executing '${cmdstring}': Button already pressed down`);

        const action = Object.assign({}, actions.buttonDown);
        const expectedAction = Object.assign({}, actions.buttonUp);

        action.BindingGuid = randomUUID();
        action.Guid = randomUUID();
        action.ScanCode = button[0];
        action.VisualKeyCode = button[1];
        action.TimeSpan = formatTimeSpan(Number(args[1] ?? defaultDelay));
        expectedAction.BindingGuid = action.BindingGuid;
        expectedAction.Guid = randomUUID();
        expectedAction.ScanCode = button[0];
        expectedAction.VisualKeyCode = button[1];
        if (button[2])
            action.Flags += button[2];
        if (button[3])
            expectedAction.Flags += button[3];

        expectedActions.push(expectedAction);
        out.MacroActions.push(action);
    }

    if (cmdstring.startsWith("bu ")) {
        const args = cmdstring.split(" ").slice(1);
        const button = buttonMap[args[0]];

        const actionIndex = expectedActions.findIndex(v => v.VisualKeyCode === button[1] && v.ScanCode === button[0]);
        if (actionIndex < 0)
            throw new Error(`Error executing ${cmdstring}: Button has not yet been pressed`);

        const action = expectedActions.splice(actionIndex, 1)[0];
        action.TimeSpan = formatTimeSpan(Number(args[1] ?? defaultDelay))

        out.MacroActions.push(action);
    }

    if (cmdstring.startsWith("b ")) {
        const args = cmdstring.split(" ").slice(1);
        const button = buttonMap[args[0]];

        const action0 = Object.assign({}, actions.buttonDown);
        const action1 = Object.assign({}, actions.buttonUp);

        action0.BindingGuid = randomUUID();
        action0.Guid = randomUUID();
        action0.ScanCode = button[0];
        action0.VisualKeyCode = button[1];
        action0.TimeSpan = formatTimeSpan(defaultDelay);
        action1.BindingGuid = action0.BindingGuid;
        action1.Guid = randomUUID();
        action1.ScanCode = button[0];
        action1.VisualKeyCode = button[1];
        action1.TimeSpan = formatTimeSpan(Number(args[1] ?? defaultDelay));
        if (button[2])
            action0.Flags += button[2];
        if (button[3])
            action1.Flags += button[3];

        out.MacroActions.push(action0, action1);
    }

    if (cmdstring.startsWith("m")) {
        const args = cmdstring.split(" ").slice(1);

        const action0 = Object.assign({}, actions.mouseDown);
        const action1 = Object.assign({}, actions.mouseUp);

        action0.BindingGuid = randomUUID();
        action0.Guid = randomUUID();
        action0.Win32MouseKeys = win32MouseKeys[args[0]];
        action0.TimeSpan = formatTimeSpan(defaultDelay);
        action1.BindingGuid = action0.BindingGuid;
        action1.Guid = randomUUID();
        action1.Win32MouseKeys = win32MouseKeys[args[0]];
        action1.TimeSpan = formatTimeSpan(Number(args[1] ?? defaultDelay))

        out.MacroActions.push(action0, action1);
    }
}

if (expectedActions.length > 0)
    throw new Error("Some buttons were not released");

// output
console.log(out);

writeFileSync(`./${input.name}.macro`, JSON.stringify(out, null, 2));
