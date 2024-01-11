# Glyphr Studio v2!

Glyphr Studio v2 is a web-based font editor, optimized for typeface design beginners or hobbyists.

While most user scenarios and functionality are the same as v1, the one main
functionality improvement will be **multi-project editing** that will allow for
cross-project copy/paste and merging fonts.

The overall goal for v2 is codebase modernization. Much of the v1 code hasn't been
worked on since 2010, so it was time to do an all-up scrub.

## Links

| Website     | [glyphrstudio.com](https://www.glyphrstudio.com)                    |
| :---------- | :------------------------------------------------------------------ |
| Email       | [mail@glyphrstudio.com](mailto:mail@glyphrstudio.com)               |
| App         | [glyphrstudio.com/v2/app](https://www.glyphrstudio.com/v2/app)      |
| Help & Docs | [glyphrstudio.com/v2/help](https://www.glyphrstudio.com/v2/help/)   |
| Blog        | [glyphrstudio.com/blog](https://www.glyphrstudio.com/blog/)         |
| Mastodon    | [@glyphrstudio@typo.social](https://typo.social/@glyphrstudio)      |
| Reddit      | [reddit.com/r/GlyphrStudio](https://www.reddit.com/r/GlyphrStudio/) |
| Twitter     | [@glyphrstudio](https://twitter.com/glyphrstudio)                   |
| GitHub      | [github.com/glyphr-studio](https://github.com/glyphr-studio)        |

## Approach

So, here at Glyphr Studio, we've always had a very strong DIY attitude - this means:

- The only external library we will use _for the UI_ is OpenType.js, for importing and
  exporting OTF files
  - This means no UI Frameworks like React or Vue, and no helper libraries like Paper.js
- The whole app will still concat down to HTML, CSS, and JavaScript files:
  - Continuing the ability to run on a local server (or online) without a back-end
  - Build process using Vite for modules

## Timeline

Preliminary investigations started in 2019... but Covid slowed things way down.
Things picked back up in 2021/2022. Alphas and Betas were released in late 2022
/ early 2023, and v2.0.0 was released in December 2023.

V2 will exist along side v1 until January 15th, 2024, when v2 will become the default
experience and v1 will be deprecated.

## Contributing

This project uses Vite for bundling and testing. Current working source code is in the
`/src` directory, and the latest stable release is bundled and put in the `/dist` directory.
Read more about how the code is structured and how to contribute features in: [/src/README.md](./src/README.md).

## License

Copyright (C) 2010 - 2024 Matthew LaGrandeur, released under
[GPL 3.0](https://github.com/mattlag/Glyphr-Studio/blob/master/LICENSE-gpl-3.0.txt)

## Author

| ![Matthew LaGrandeur's picture](https://1.gravatar.com/avatar/f6f7b963adc54db7e713d7bd5f4903ec?s=70) |
| ---------------------------------------------------------------------------------------------------- |
| [Matthew LaGrandeur](http://mattlag.com/)                                                            |
| matt[at]mattlag[dot]com                                                                              |
