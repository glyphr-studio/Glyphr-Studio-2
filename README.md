# Glyphr Studio v2!
V2 is back :-) the overall goal is codebase modernization. Much of the code hasn't been worked on since 2010,
so it's time to do an all-up scrub.

While most user scenarios and functionality will be the same as V1, the one main functionality improvement will
be **multi-project editing** that will allow for cross-project copy/paste and merging fonts.

## What's changing
My rough road-map is to start refactoring the Glyph Element objects (the underlying data structures
that describe glyphs), ensure we have good separation between data and the UI, then start working on
the new UI layer.
| | **Glyph Elements / Project Data stuff** |
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
| :white_check_mark: | New top-level navigation / page view switching |
| :white_check_mark: | CSS3, mostly for Variables and Layout |
| :white_check_mark: | Let / Const instead of Var |
| :white_check_mark: | Template strings instead of string concatenation |
| :white_check_mark: | Lint everything with Prettier |
| :white_check_mark: | JSDoc *all the things* |
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
* The whole app will still concat down to HTML, CSS, and JavaScript files:
  * Continuing the ability to run locally (or online) without a back-end
  * Build process using Vite for modules

## Timeline
Preliminary investigations started in 2019... but Covid slowed things way down.
Things have picked back up in 2021/2022. Bug fixes for V1 will still take precedence over V2.

Merging new ideas with old functionality is also time consuming :-)


## License
 Copyright (C) 2010 - 2022 Matthew LaGrandeur, released under
 [GPL 3.0](https://github.com/mattlag/Glyphr-Studio/blob/master/LICENSE-gpl-3.0.txt)

## Author
| ![Matthew LaGrandeur's picture](https://1.gravatar.com/avatar/f6f7b963adc54db7e713d7bd5f4903ec?s=70) |
|---|
| [Matthew LaGrandeur](http://mattlag.com/) |
| matt[at]mattlag[dot]com |