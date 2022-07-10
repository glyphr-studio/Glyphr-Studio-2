# Glyphr Studio v2!
V2 is back :-) the overall goal is codebase modernization. Much of the code hasn't been worked on since 2010,
so it's time to do an all-up scrub.

While most features and functionality will be the same as V1, the one main functionality improvement will
be **multi-project editing** that will allow for cross-project copy/paste and merging fonts.

## What's changing
My rough road-map is to start refactoring the Glyph Element objects (the underlying data structures
that describe glyphs), ensure we have good separation between data and the UI, then start working on
the new UI layer.
| | **Glyph Elements / data structure stuff** |
|:---:|:--- |
| :white_check_mark: | Modules (native) |
| :white_check_mark: | Change prototypes to classes |
| :white_check_mark: | Let / Const instead of Var |
| :white_check_mark: | Template strings instead of string concatenation |
| :white_check_mark: | Lint everything with Prettier |
| :white_check_mark: | JSDoc *all the things* |
| :white_check_mark: | Jasmine tests for everything (basic coverage) |
| :soon: | Jasmine tests for everything (advanced coverage) |

| | **UI Layer stuff** |
|:---:|:--- |
| :white_check_mark: | Use Web Components to define atomic controls |
| :soon: | New top-level navigation / page view switching |
| :soon: | CSS3, mostly for Variables and Layout |
| :soon: | Let / Const instead of Var |
| :soon: | Template strings instead of string concatenation |
| :soon: | Lint everything with Prettier |
| :soon: | JSDoc *all the things* |
| :black_square_button: | Jasmine tests for everything (basic coverage) |
| :black_square_button: | Investigation - Language switching for localization |

| | **Supplemental stuff** |
|:---:|:--- |
| :black_square_button: | Investigate tech stack for Help & Documentation site |
| :black_square_button: | Investigate migration or redesign for Blog site |
| :black_square_button: | Create new website |


## What's not changing
So, here at Glyphr Studio, we've always had a very strong DIY attitude - this means:
* The only external library we will use *for the UI* is OpenType.js, for importing and exporting OTF files
  * This means no UI Frameworks like React or Vue, and no helper libraries like Paper.js
* The whole app will still concat down to a single .html file that includes CSS and JavaScript
  * Continuing the ability to run locally (or online) without a back-end
  * Build process is still TBD - maybe using rollup or parcel for modules

## Timeline
The V2 effort took a pause while major work on V1 was being completed.  With that done (around the end of
2019) I'm in the stage of thinking about just what major architecture changes I want to tackle.  Currently
there is a rough version of the glyph, font, and project data structure (which you can read about in the
dev/readme) and I've begun thinking about UI controls, and page view rendering. Since we're not using any
UI Frameworks, these are big items that will probably take time.

Call this early stage of churn "V2 Alpha" - my guess is it will probably last through 2020.
**UPDATE** Covid drastically reduced free time, so this was a longer pause than once thought.
Bug fixes on V1 will still happen, so I don't feel particularly rushed to make progress on V2.


## License
 Copyright (C) 2010 - 2022 Matthew LaGrandeur, released under
 [GPL 3.0](https://github.com/mattlag/Glyphr-Studio/blob/master/LICENSE-gpl-3.0.txt)

## Author
| ![Matthew LaGrandeur's picture](https://1.gravatar.com/avatar/f6f7b963adc54db7e713d7bd5f4903ec?s=70) |
|---|
| [Matthew LaGrandeur](http://mattlag.com/) |
| matt[at]mattlag[dot]com |