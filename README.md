# Glyphr Studio v2!
V2 is back :-) the overall goal is codebase modernization. Much of the code hasn't been
worked on since 2010, so it's time to do an all-up scrub.

While most user scenarios and functionality will be the same as V1, the one main
functionality improvement will be **multi-project editing** that will allow for
cross-project copy/paste and merging fonts.

## Links
| Website | [glyphrstudio.com](https://www.glyphrstudio.com) |
| :---- | :---- |
| Email | [mail@glyphrstudio.com](mailto:mail@glyphrstudio.com) |
| App | [glyphrstudio.com/v2/app](https://www.glyphrstudio.com/v2/app) |
| Help & Docs | [glyphrstudio.com/v2/help](https://www.glyphrstudio.com/v2/help/) |
| Blog | [glyphrstudio.com/blog](https://www.glyphrstudio.com/blog/) |
| Mastodon | [@glyphrstudio@typo.social](https://typo.social/@glyphrstudio) |
| Reddit | [reddit.com/r/GlyphrStudio](https://www.reddit.com/r/GlyphrStudio/) |
| Twitter | [@glyphrstudio](https://twitter.com/glyphrstudio) |
| GitHub | [github.com/glyphr-studio](https://github.com/glyphr-studio) |


## What's changing
My rough road-map is to start refactoring the Glyph Element objects (the underlying
data structures that describe glyphs), ensure we have good separation between data
and the UI, then start working on the new UI layer.

| | **Glyph Elements / Project Data stuff** |
|:---:|:--- |
| :white_check_mark: | Modules (native) |
| :white_check_mark: | Change prototypes to classes |
| :white_check_mark: | Let / Const instead of Var |
| :white_check_mark: | Template strings instead of string concatenation |
| :white_check_mark: | Lint everything with Prettier |
| :white_check_mark: | JSDoc *all the things* |
| :white_check_mark: | Vitest tests for everything (basic coverage) |
| :soon: | Vitest tests for everything (advanced coverage) |

| | **UI Layer stuff** |
|:---:|:--- |
| :white_check_mark: | Use Web Components to define atomic controls |
| :white_check_mark: | New top-level navigation / page view switching |
| :white_check_mark: | CSS3, mostly for Variables and Layout |
| :white_check_mark: | Let / Const instead of Var |
| :white_check_mark: | Template strings instead of string concatenation |
| :white_check_mark: | Lint everything with Prettier |
| :white_check_mark: | JSDoc *all the things* |
| :black_square_button: | Vitest tests for everything (basic coverage) |
| :black_square_button: | Investigation - Language switching for localization |


## What's not changing
So, here at Glyphr Studio, we've always had a very strong DIY attitude - this means:
* The only external library we will use *for the UI* is OpenType.js, for importing and
exporting OTF files
  * This means no UI Frameworks like React or Vue, and no helper libraries like Paper.js
* The whole app will still concat down to HTML, CSS, and JavaScript files:
  * Continuing the ability to run locally (or online) without a back-end
  * Build process using Vite for modules

## Timeline
Preliminary investigations started in 2019... but Covid slowed things way down.
Things have picked back up in 2021/2022. Alphas are being released in late 2022
/ early 2023, with a goal of finishing in 2023. The Alpha versions got the basics
in place, Beta 1 got core editing features in place, and by the end of Beta 2 we
will have full feature parity with v1. The full v2 release will have additional
features that don't exist in v1.

Bug fixes for V1 will still take precedence over V2.

Merging new ideas with old functionality is time consuming :-)

## Contributing
This project uses Vite for bundling and testing. Current working source code is in the
`/src` directory, and the latest stable release is bundled and put in the `/dist` directory.
Read more about how the code is structured and how to contribute features in: [/src/README.md](./src/README.md).

## License
 Copyright (C) 2010 - 2023 Matthew LaGrandeur, released under
 [GPL 3.0](https://github.com/mattlag/Glyphr-Studio/blob/master/LICENSE-gpl-3.0.txt)

## Author
| ![Matthew LaGrandeur's picture](https://1.gravatar.com/avatar/f6f7b963adc54db7e713d7bd5f4903ec?s=70) |
|---|
| [Matthew LaGrandeur](http://mattlag.com/) |
| matt[at]mattlag[dot]com |