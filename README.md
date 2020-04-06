# Glyphr Studio v2!
V2 is back :-) the overall goal is codebase modernization. Much of the code hasn't been worked on since 2010,
so it's time to do an all-up scrub.

While most features and functionality will be the same as V1, the one main functionality improvement will
be **multi-project editing** that will allow for cross-project copy/paste and merging fonts.

## What's changing
| | **Convert our JavaScript to use ES6 stuff** |
|:---:|:--- |
| :soon: | Change prototypes to classes |
| :white_check_mark: | Let / Const instead of Var |
| :black_square_button: | Template strings instead of string concatenation |
| :soon: | Modules (native) |
| :black_square_button: | Investigation - HTML Templates or Web Components for UI Controls |
| | Probably more... |

| | **Other stuff** |
|:---:|:--- |
| :soon: | Lint everything with ESLint, Google style |
| :soon: | JSDoc *all the things* |
| :black_square_button: | CSS3, mostly for Variables and Layout |
| :white_check_mark: | New test framework and tests for all our code |
| :white_check_mark: | Dev and Test environments that make it easy to keep code separate and testable. |
| :soon: | Minimize global variables |
| :black_square_button: | Investigation - Language switching for localization |


## What's not changing
So, here at Glyphr Studio, we've always had a very strong DIY attitude - this means:
* The only external library we will use *for the UI* is OpenType.js, for importing and exporting OTF files
  * This means no UI Frameworks like React or Vue, and no helper libraries like Paper.js
* The whole app will still concat down to a single .html file that includes CSS and JavaScript
  * Continuing the ability to run locally (or online) without a back-end
  * Build process is still TBD - maybe using rollup.js for modules

## Timeline
The V2 effort took a pause while major work on V1 was being completed.  With that done (around the end of
2019) I'm in the stage of thinking about just what major architecture changes I want to tackle.  Currently
there is a rough version of the glyph, font, and project data structure (which you can read about in the
dev/readme) and I've begun thinking about UI controls, and page view rendering. Since we're not using any
UI Frameworks, these are big items that will probably take time.

Call this early stage of churn "V2 Alpha" - my guess is it will probably last through 2020. Bug fixes on V1
will still happen, so I don't feel particularly rushed to make progress on V2.


## License
 Copyright (C) 2010 - 2020 Matthew LaGrandeur, released under
 [GPL 3.0](https://github.com/mattlag/Glyphr-Studio/blob/master/LICENSE-gpl-3.0.txt)

## Author
| ![Matthew LaGrandeur's picture](https://1.gravatar.com/avatar/f6f7b963adc54db7e713d7bd5f4903ec?s=70) |
|---|
| [Matthew LaGrandeur](http://mattlag.com/) |
| matt[at]mattlag[dot]com |