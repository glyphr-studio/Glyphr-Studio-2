# Glyphr Studio v2!
 V2 is back :-) the overall goal is codebase modernization. Much of the code hasn't been worked on since 2010, so it's time to do an all-up scrub.

## What's changing
| | **Convert our JavaScript to use ES6 stuff** |
| --- | --- |
| :soon: | Change prototypes to classes |
| :white_check_mark: | Let / Const instead of Var |
| :white_large_square: | Template strings instead of string concatenation |
| :soon: | Modules (native) |
| | Probably more... |

| | **Other stuff** |
| --- | --- |
| :soon: | Lint everything with ESLint, Google style |
| :soon: | JSDoc *all the things* |
| :white_large_square: | CSS3, mostly for Variables and Layout |
| :white_check_mark: | New test framework and tests for all our code |
| :white_check_mark: | Dev and Prod environments that make it easy to keep code separate and testable, but also concatenate-able and minimize-able. |
| :soon: | Minimize global variables |
| :white_large_square: | Investigation - HTML Templates or Web Components for UI Controls |
| :white_large_square: | Investigation - Language switching for localization |


## What's not changing
So, here at Glyphr Studio, we've always had a very strong DIY attitude - this means:
* The whole tool will still concat down to a single .html file that includes CSS and JavaScript, able to run locally or online without a back-end
* The only external library we will use is OpenType.js, for importing and exporting OTF files
  * This means no UI Frameworks like React or Vue, and no helper libraries like Paper.js

## Timeline
Let's call it v2-alpha while things are being refactored.  This will probably extend through the summer of 2018.  V2 will be released in beta side-by-side with V1.  And, despite the new major version number, V2 will accept project files created with V1 (backwards compatible).


## License
 Copyright (C) 2010 - 2018 Matthew LaGrandeur, released under
 [GPL 3.0](https://github.com/mattlag/Glyphr-Studio/blob/master/LICENSE-gpl-3.0.txt)

## Author
| ![Matthew LaGrandeur's picture](https://1.gravatar.com/avatar/f6f7b963adc54db7e713d7bd5f4903ec?s=70) |
|---|
| [Matthew LaGrandeur](http://mattlag.com/) |
| matt[at]mattlag[dot]com |