# macrobuilder
Macrobuilder is a CLI to ease the creation of macros for the EVGA keyboard and mouse product series. The tool allows the generation of an importable macro using a predefined set of inputs.

The tool was developed for the EVGA Z15 and has not been tested for other products. It may or may not work; so if you're feeling lucky, try it out.

Furthermore, the tool was developed for a QWERTZ key mapping and other mappings may either produce some display glitches or not work at all, depending on EVGAs interpreter.
## input
To generate a macro, define a file `input.json` and run `node .`. The JSON file should look like this:
```json
{
    "name": "new_macro",
    "defaultDelay": 10,
    "startPosition": [500, 500],
    "macro": [
        "m l 50",
        "m r 50",
        "m l 50"
    ]
}
```
If the mouse position should not be set at the start of the macro, `startPosition` should be `null`. In that case the macro may not use absolute position modifiers such as `p 150 445`, but may only use relative motion such as `p ~50 ~-25`.

An example input JSON is included in the repository.
## Valid Commands
| Command | Description | Example |
| ------- | ----------- | ------- |
| m \<key> \<delay> | Pushes down a mouse button for *delay* milliseconds; valid keys are `l`, `r` and `m`. | `m r 50` |
| b \<key> \<delay> | Pushes down a keyboard key for *delay* milliseconds; Some control keys may not be supported yet. You can fix this by manually adding the scancode, key display code, flag at button-down and flag offset at button-up in the keymap in the source code | `b k 300` |
| bd \<key> \[delay] | Pushes down a keyboard key after an optional *delay* milliseconds of delay; does not release the key; if you call `bd`, you need to call `bu` later | `bd rshift` |
| bu \<key> \[delay] | Releases a keyboard key that was pushed down beforehands after an optional delay; the button has to have been pressed down via `bu` earlier | `bu rshift` |
| p \[\~]\<x> \[\~]\<y> | Moves the mouse cursor either to a specific location, or relative to its' current position; relative movement is prepended with `~`; absolute movement is only possible if the macro has a start position | `p 500 550`, `p ~25 ~-50` |
| w \<delay> | Adds a delay before the next command is called | `w 500` |