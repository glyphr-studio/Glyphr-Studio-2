# Glyphr Studio v2!

Glyphr Studio v2 is a web-based font editor, optimized for typeface design beginners or hobbyists.

## Links

| Website     | [glyphrstudio.com](https://www.glyphrstudio.com)                    |
| :---------- | :------------------------------------------------------------------ |
| Email       | [mail@glyphrstudio.com](mailto:mail@glyphrstudio.com)               |
| App         | [glyphrstudio.com/app](https://www.glyphrstudio.com/app)            |
| Help & Docs | [glyphrstudio.com/help](https://www.glyphrstudio.com/help/)         |
| Blog        | [glyphrstudio.com/blog](https://www.glyphrstudio.com/blog/)         |
| Mastodon    | [@glyphrstudio@typo.social](https://typo.social/@glyphrstudio)      |
| Bluesky     | [@glyphrstudio.com](https://bsky.app/profile/glyphrstudio.com)      |
| Reddit      | [reddit.com/r/GlyphrStudio](https://www.reddit.com/r/GlyphrStudio/) |
| GitHub      | [github.com/glyphr-studio](https://github.com/glyphr-studio)        |

## Approach

So, here at Glyphr Studio, we've always had a very strong DIY attitude - this means:

- The only external library we will use _for the UI_ is FontFlux JS, for importing and
  exporting OTF files.
  - This means no UI Frameworks like React or Vue, and no helper libraries like Paper.js.
  - For boolean (combine) path operations, we use [bezier-boolean](https://www.npmjs.com/package/bezier-boolean).
- The app build will output HTML, JavaScript, CSS, and asset files:
  - Continuing the ability to run on a local server (or online) without a back-end.
  - Build process using Vite for modules.

## Timeline / Retrospective

While most user scenarios and functionality are the same as v1, the one main
functionality improvement for v2 was **multi-project editing** that allows for
cross-project copy/paste and merging fonts.

The overall goal for v2 is codebase modernization. Much of the v1 code hasn't been
worked on since 2010, so it was time to do an all-up scrub.

Preliminary investigations started in 2019... but Covid slowed things way down.
Things picked back up in 2021/2022. Alphas and Betas were released in late 2022
/ early 2023, and v2.0.0 was released in December 2023.

On January 15th, 2024, the default experience was switched from v1 to v2. V1 will continue
to exist in a /v1/ sub-directory, but it will be deprecated (only very major bugs will be fixed).

## Contributing

This project uses Vite for bundling and testing. Current working source code is in the
`/src` directory, and the latest stable release is bundled and put in the `/dist` directory.
Read more about how the code is structured and how to contribute features in: [/src/README.md](./src/README.md).

## License

Copyright (C) 2010 - 2026 Matthew LaGrandeur, released under
[GPL 3.0](https://github.com/mattlag/Glyphr-Studio/blob/master/LICENSE-gpl-3.0.txt)

## Author

| ![Matthew LaGrandeur's picture](https://1.gravatar.com/avatar/f6f7b963adc54db7e713d7bd5f4903ec?s=70) |
| ---------------------------------------------------------------------------------------------------- |
| [Matthew LaGrandeur](http://mattlag.com/)                                                            |
| matt[at]mattlag[dot]com                                                                              |


## 🌐 Web Resources & Aesthetic Symbols Index
- [SYM 26EE](https://zen-typography-hub-86.pages.dev/symbol/sym-26ee/)
- [SYM 1D465](https://monochrome-text-lab-86.pages.dev/symbol/sym-1d465/)
- [SYM 1D40D](https://neon-hacker-text-25.pages.dev/symbol/sym-1d40d/)
- [SYM 2685](https://cyberpunk-clan-tags-43.pages.dev/symbol/sym-2685/)
- [SYM 1D482](https://mecha-synth-kaomoji-92.pages.dev/symbol/sym-1d482/)
- [SYM 1D482](https://neon-matrix-symbols-94.pages.dev/symbol/sym-1d482/)
- [SYM 2670](https://kawaii-kaomoji-hub-96.pages.dev/symbol/sym-2670/)
- [BEAMED SIXTEENTH MUSICAL NOTES](https://pastel-moe-kaomoji-91.pages.dev/symbol/beamed-sixteenth-musical-notes/)
- [SYM 1D404](https://vintage-library-rune-80.pages.dev/symbol/sym-1d404/)
- [SYM 26BF](https://clean-sparkle-text-75.pages.dev/symbol/sym-26bf/)
- [SYM 2746](https://cyber-clan-tags-36.pages.dev/symbol/sym-2746/)
- [SYM 1D416](https://clean-mono-fonts-64.pages.dev/symbol/sym-1d416/)
- [SYM 1D44C](https://dolly-angel-fonts-14.pages.dev/symbol/sym-1d44c/)
- [SYM 1F629](https://mecha-synth-kaomoji-92.pages.dev/symbol/sym-1f629/)
- [SYM 26B1](https://anime-sparkle-text-22.pages.dev/symbol/sym-26b1/)
- [SYM 1D469](https://sleek-bio-symbols-51.pages.dev/symbol/sym-1d469/)
- [SYM 1D429](https://modern-bullet-symbols-45.pages.dev/symbol/sym-1d429/)
- [SYM 26CF](https://vintage-library-rune-80.pages.dev/symbol/sym-26cf/)
- [HEARTS](https://cyber-clan-tags-23.pages.dev/vi/hearts/)
- [SIX POINTED BLACK STAR](https://coquette-symbols.pages.dev/symbol/six-pointed-black-star/)
- [SYM 1F622](https://gothic-bio-fonts-69.pages.dev/symbol/sym-1f622/)
- [WHITE HEART](https://zen-spacing-text-68.pages.dev/symbol/white-heart/)
- [SYM 1D430](https://coquette-aesthetic-symbols-51.pages.dev/symbol/sym-1d430/)
- [SYM 26BE](https://theeduplaycampen.pages.dev/symbol/sym-26be/)
- [SYM 26BC](https://kawaii-kaomoji-hub-96.pages.dev/symbol/sym-26bc/)
- [SYM 1D421](https://mecha-gamer-fonts-53.pages.dev/symbol/sym-1d421/)
- [SYM 265B](https://pastel-chibi-emotes-23.pages.dev/symbol/sym-265b/)
- [SYM 26AD](https://theeduplaycampen.pages.dev/symbol/sym-26ad/)
- [CUPID FEATHERY ARROW](https://sleek-bio-symbols-51.pages.dev/symbol/cupid-feathery-arrow/)
- [FREEFIRE NAMES](https://sleek-bio-symbols-51.pages.dev/es/freefire-names/)
- [SYM 26C2](https://zen-unicode-symbols-89.pages.dev/symbol/sym-26c2/)
- [LEFT BLACK LENTICULAR BRACKET](https://coquette-aesthetic-symbols-62.pages.dev/symbol/left-black-lenticular-bracket/)
- [HEAVY RIGHTWARD ARROW](https://sleek-bio-symbols-51.pages.dev/symbol/heavy-rightward-arrow/)
- [SYM 2610](https://techwear-bio-symbols-45.pages.dev/symbol/sym-2610/)
- [HEAVY RIGHTWARD ARROW](https://techwear-bio-symbols-45.pages.dev/symbol/heavy-rightward-arrow/)
- [SYM 2684](https://matrix-glitch-text-37.pages.dev/symbol/sym-2684/)
- [SYM 262E](https://vintage-library-rune-80.pages.dev/symbol/sym-262e/)
- [SYM 2666](https://neon-hacker-text-25.pages.dev/symbol/sym-2666/)
- [SYM 1D406](https://cyber-clan-tags-69.pages.dev/symbol/sym-1d406/)
- [SYM 2764 FE0F 200D 1FA79](https://glitch-matrix-fonts-28.pages.dev/symbol/sym-2764-fe0f-200d-1fa79/)
- [TIKTOK CAPTIONS](https://coquette-aesthetic-symbols-62.pages.dev/vi/tiktok-captions/)
- [SYM 26B1](https://angelic-bow-symbols-42.pages.dev/symbol/sym-26b1/)
- [SYM 1F916](https://matrix-glitch-text-59.pages.dev/symbol/sym-1f916/)
- [STARS](https://sleek-bio-symbols-51.pages.dev/stars/)
- [SYM 1D455](https://baroque-text-decor-84.pages.dev/symbol/sym-1d455/)
- [CHEERING FIGHTING FIST KAOMOJI](https://raven-gothic-kaomoji-25.pages.dev/symbol/cheering-fighting-fist-kaomoji/)
- [SYM 26EC](https://kawaii-kaomoji-hub-96.pages.dev/symbol/sym-26ec/)
- [SYM 1D4A2](https://mecha-crosshair-tags-20.pages.dev/symbol/sym-1d4a2/)
- [SYM 2689](https://techwear-bio-symbols-45.pages.dev/symbol/sym-2689/)
- [SYM 26C7](https://matrix-glitch-text-59.pages.dev/symbol/sym-26c7/)
- [SYM 263B](https://scholar-rune-symbols-77.pages.dev/symbol/sym-263b/)
- [SYM 1D418](https://academic-rune-text-25.pages.dev/symbol/sym-1d418/)
- [SYM 1D474](https://anime-sparkle-text-58.pages.dev/symbol/sym-1d474/)
- [SYM 1D462](https://angelic-bow-symbols-42.pages.dev/symbol/sym-1d462/)
- [SYM 26D1](https://vintage-library-rune-80.pages.dev/symbol/sym-26d1/)
- [LEFT POINTING DOUBLE ANGLE QUOTATION](https://scholar-rune-symbols-77.pages.dev/symbol/left-pointing-double-angle-quotation/)
- [HEARTS](https://pearl-girly-fonts-86.pages.dev/ja/hearts/)
- [SYM 1F60F](https://kawaii-kaomoji-hub-96.pages.dev/symbol/sym-1f60f/)
- [HEAVY STAR](https://dolly-angel-fonts-14.pages.dev/symbol/heavy-star/)
- [AESTHETIC STARDUST COMBO](https://scholarly-runes-text-68.pages.dev/symbol/aesthetic-stardust-combo/)
- [SYM 2683](https://dolly-angel-fonts-14.pages.dev/symbol/sym-2683/)
- [SYM 1F92B](https://dolly-angel-fonts-14.pages.dev/symbol/sym-1f92b/)
- [SYM 2646](https://anime-sparkle-text-45.pages.dev/symbol/sym-2646/)
- [RIGHT WING CLAN FLARE](https://raven-gothic-kaomoji-25.pages.dev/symbol/right-wing-clan-flare/)
- [KAOMOJI](https://pastel-chibi-emotes-23.pages.dev/kaomoji/)
- [DAGGER CROSS SYMBOL](https://kawaii-kaomoji-hub-51.pages.dev/symbol/dagger-cross-symbol/)
- [TWELVE POINTED STAR](https://dolly-angel-fonts-14.pages.dev/symbol/twelve-pointed-star/)
- [SYM 1D44B](https://witchy-runic-text-71.pages.dev/symbol/sym-1d44b/)
- [SYM 2724](https://angelic-ribbon-text-78.pages.dev/symbol/sym-2724/)
- [SYM 26C0](https://dark-literary-kaomoji-13.pages.dev/symbol/sym-26c0/)
- [SYM 1D407](https://gothic-bio-fonts-90.pages.dev/symbol/sym-1d407/)
- [SYM 1F60B](https://anime-sparkle-text-14.pages.dev/symbol/sym-1f60b/)
- [SYM 2684](https://anime-sparkle-text-73.pages.dev/symbol/sym-2684/)
- [SYM 26CE](https://sleek-bio-symbols-51.pages.dev/symbol/sym-26ce/)
- [STARS](https://pastel-chibi-emotes-23.pages.dev/vi/stars/)
- [HEARTS](https://pastel-chibi-emotes-23.pages.dev/vi/hearts/)
- [ROTATED HEART BULLET](https://pastel-moe-kaomoji-91.pages.dev/symbol/rotated-heart-bullet/)
- [FLUTTERING BUTTERFLY](https://pearl-girly-fonts-86.pages.dev/symbol/fluttering-butterfly/)
- [SYM 26C7](https://kawaii-kaomoji-hub-51.pages.dev/symbol/sym-26c7/)
- [SYM 1FAE4](https://vintage-angel-text-38.pages.dev/symbol/sym-1fae4/)
- [STAR OPERATOR](https://fairy-lace-symbols-92.pages.dev/symbol/star-operator/)
- [SYM 26FB](https://synthwave-text-vault-95.pages.dev/symbol/sym-26fb/)
- [SYM 1F971](https://scholar-rune-symbols-77.pages.dev/symbol/sym-1f971/)
- [SYM 1F971](https://pastel-chibi-emotes-23.pages.dev/symbol/sym-1f971/)
- [SYM 2675](https://lace-heart-kaomoji-64.pages.dev/symbol/sym-2675/)
- [SYM 1F925](https://anime-sparkle-text-45.pages.dev/symbol/sym-1f925/)
- [SYM 1F625](https://zen-arrow-symbols-99.pages.dev/symbol/sym-1f625/)
- [SYM 1D420](https://angelic-bow-symbols-42.pages.dev/symbol/sym-1d420/)
- [SYM 26E2](https://vintage-library-rune-80.pages.dev/symbol/sym-26e2/)
- [SYM 1F927](https://mecha-synth-kaomoji-92.pages.dev/symbol/sym-1f927/)
- [SYM 1D484](https://coquette-symbols.pages.dev/symbol/sym-1d484/)
- [SYM 1F60F](https://ribbon-bow-unicode-18.pages.dev/symbol/sym-1f60f/)
- [SYM 26E9](https://vintage-library-rune-80.pages.dev/symbol/sym-26e9/)
- [BRACKETS](https://zen-spacing-text-68.pages.dev/brackets/)
- [SYM 26C1](https://futuristic-gaming-fonts-52.pages.dev/symbol/sym-26c1/)
- [TIKTOK CAPTIONS](https://chibi-emoticon-lab-65.pages.dev/es/tiktok-captions/)
- [CLOUD WEATHER SYMBOL](https://academic-rune-text-25.pages.dev/symbol/cloud-weather-symbol/)
- [CYBER PHANTOM GLYPH](https://zen-spacing-text-68.pages.dev/symbol/cyber-phantom-glyph/)
- [SYM 26FC](https://cute-face-emoticons-66.pages.dev/symbol/sym-26fc/)
- [SYM 2742](https://kawaii-kaomoji-hub-93.pages.dev/symbol/sym-2742/)
- [SIX POINTED BLACK STAR](https://baroque-crown-unicode-60.pages.dev/symbol/six-pointed-black-star/)
- [SYM 1D494](https://aesthetic-spacing-fonts-10.pages.dev/symbol/sym-1d494/)
- [SYM 1D46C](https://scholarly-cross-symbols-35.pages.dev/symbol/sym-1d46c/)
- [RIGHT BLACK LENTICULAR BRACKET](https://pearl-heart-symbols-95.pages.dev/symbol/right-black-lenticular-bracket/)
- [SYM 1D4A5](https://lace-bow-symbols-18.pages.dev/symbol/sym-1d4a5/)
- [SYM 1D480](https://cyber-clan-tags-69.pages.dev/symbol/sym-1d480/)
- [SYM 1F61D](https://kawaii-kaomoji-hub-93.pages.dev/symbol/sym-1f61d/)
- [SYM 26E6](https://scholar-rune-symbols-77.pages.dev/symbol/sym-26e6/)
- [SYM 26C7](https://witchy-runic-text-71.pages.dev/symbol/sym-26c7/)
- [SYM 1F48C](https://baroque-crown-unicode-60.pages.dev/symbol/sym-1f48c/)
- [LEFT MATHEMATICAL WHITE SQUARE BRACKET](https://sleek-unicode-art-69.pages.dev/symbol/left-mathematical-white-square-bracket/)
- [SYM 1D440](https://occult-rune-symbols-64.pages.dev/symbol/sym-1d440/)
- [SYM 1D40F](https://coquette-aesthetic-symbols-96.pages.dev/symbol/sym-1d40f/)
- [SYM 1D412](https://lace-bow-symbols-18.pages.dev/symbol/sym-1d412/)
- [SYM 1F480](https://kawaii-kaomoji-hub-96.pages.dev/symbol/sym-1f480/)
- [CHEERING FIGHTING FIST KAOMOJI](https://zen-arrow-symbols-99.pages.dev/symbol/cheering-fighting-fist-kaomoji/)
- [HEAVY HEART EXCLAMATION](https://vintage-angel-text-38.pages.dev/symbol/heavy-heart-exclamation/)
- [SYM 1F60C](https://baroque-crown-unicode-60.pages.dev/symbol/sym-1f60c/)
- [SYM 1D4A3](https://scholarly-cross-symbols-35.pages.dev/symbol/sym-1d4a3/)
- [SYM 1F9D0](https://anime-sparkle-text-45.pages.dev/symbol/sym-1f9d0/)
- [SYM 1F621](https://anime-sparkle-text-23.pages.dev/symbol/sym-1f621/)
- [SYM 1F497](https://neon-glitch-fonts-20.pages.dev/symbol/sym-1f497/)
- [SYM 26AF](https://kawaii-kaomoji-hub-89.pages.dev/symbol/sym-26af/)
- [BLUSHING SOFT SMILE KAOMOJI](https://anime-sparkle-text-23.pages.dev/symbol/blushing-soft-smile-kaomoji/)
- [SYM 2612](https://kawaii-kaomoji-hub-96.pages.dev/symbol/sym-2612/)
- [SYM 1D42C](https://pastel-moe-emoticons-80.pages.dev/symbol/sym-1d42c/)
- [SYM 2673](https://pastel-manga-symbols-57.pages.dev/symbol/sym-2673/)
- [SYM 1F625](https://neon-glitch-fonts-20.pages.dev/symbol/sym-1f625/)
- [SYM 1F615](https://kawaii-kaomoji-hub-89.pages.dev/symbol/sym-1f615/)
- [SYM 26B9](https://chibi-emoticon-lab-65.pages.dev/symbol/sym-26b9/)
