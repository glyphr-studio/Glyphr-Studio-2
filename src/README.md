# Welcome to teh code...

There are two main areas of code in Glyphr Studio v2 -
divided out into folders. Those two main areas are:

- **Project Data** - this is the hierarchy of data, from
  x/y points all the way up to paths, glyphs, and metadata. This
  is the 'theoretical' type data that can be exported to various
  formats, saved to a project file, drawn to screens, manipulated
  mathematically... whatever.

- **The App** - at it's core Glyphr Studio is an application for
  editing typefaces. So, utilizing the Project Data hierarchy,
  there's a whole bunch of other UI stuff that's needed to manipulate
  that data in a way that's easy and slick. That's where the App comes in.

### Gotta keep 'em separated

Glyphr Studio v1 was kind of a huge mess. Pieces of the UI would directly
update project data, and assume "the right thing" would be done in other
places. Sprinkled throughout the data structure methods were bits of code
that checked to see if some UI was present, and made changes to it.
**Glyphr Studio v2 has an absolute separation between Project Data, and
the App that edits it.** This is like a super common programming best
practice, but it's a big change from V1, so it is at least worth mentioning.

### Meta

Testing has been set up using Jasmine, and can be run by doing `npm test`.
Tests are stored as `-.test.js` in a `test` folder (at the moment, only
Project Data code has test coverage). All files with this suffix
will be included in the test pass.

# Project Data

Our data structure is roughly hierarchical:

    Glyphr Studio Project
      ┣━ Metadata
      ┣━ Settings
      ┣━ Kerning
      ┃   ┗━ HKern
      ┣━ Components
      ┃   ┗━ Glyph
      ┣━ Ligatures
      ┃   ┗━ Glyph
      ┗━ Glyphs
          ┗━ Glyph
              ┣━ Component Instance
              ┗━ Path
                  ┣━ Path Point
                  ┃   ┗━ Control Point
                  ┃       ┗━ Coord
                  ┗━ Poly Segment
                      ┗━ Segment

Though there is also **`XY Point`** type for simple coordinates. Additionally,
there is also the **`HKern`** type, used to represent class-based kern information.

Besides this, the most common hierarchy is:

`Glyph` ⟩ `Path` ⟩ `Path Point` ⟩ `Control Point` ⟩ `Coord`

The classes in this main hierarchy all extend the **`Glyph Element`** class,
which implements some common concepts - the main one being caching
and cache clearing whenever a change is made.

The **`Glyph`** type is used for Glyphs, Components, and Ligatures.

**`Path`** and **`Component Instance`** surface the same API, essentially,
and can be treated interchangeably from a **`Glyph`**'s point of view.
Under the covers, though, a **`Path`** relies on **`Path Points`** to draw
itself, where a **`Component Instance`** relies on a link to another
**`Glyph`**, plus some transforms, to draw itself.

(Note: removal of the concept of `Shape` from v2. `Shape` functionality has
been merged into `Path`.)

**All Glyph Elements should have 100% test coverage**

## Paths, Path Points, and Bézier Curves

Early in the history of Glyphr Studio, a decision was made to base **`Path`**
data on an internal concept called a **`Path Point`**. Traditionally, data for
typeface design programs was stored as a series of "on curve"
or "off curve" points. Or they were stored as if they were Bézier Curves, basically
as 4 sets of coordinates (e.g. PostScript) . Glyphr Studio's **`Path`** differs
from both of these - namely, a **`Path`** is essentially a collection of
**`Path Points`**, where each **`Path Point`** has a base point, plus two "handles".
For any graphic designer, this should be a very familiar representation of a path.

Classic Bézier Curve Segment notation starts with a base point, then has two "handle"
control points, then a finishing base point. But to store a series of these
would include double-storing all base points... or having some way for a
single segment to "_know_" about the base point of other segments. This
did not seem ideal.

Alternatively, classic typeface design concepts store a series of x/y points,
with each one having a designation of "on curve" (for base points) and
"off curve" (for handles) points. The edge cases here get tricky for
multiple "off curve" points in a row. Also, "off curve" points have to "_know_"
about "on curve" points to draw a curve... so separating them seems odd.

In the end, Glyphr Studio's **`Path Point`** has a base point and two handles.
Handles can be hidden for corner points. **`Path Point`** has types like
symmetrical, flat, or corner, to make things easier for the designer.
Glyphr Studio **`Paths`** are implicitly closed, there is no danger of strange
situations with multiple "off curve" handle points, and it only stores
the base point data one time per point.

Great, so what's with the **`Poly Segment`** and **`Segment`** classes? These
actually convert Glyphr Studio **`Paths`** to and from Bézier curve format.
As it turns out, there is a wealth of Math concepts around Bézier curves.
Namely, we use it to find the bounding boxes of complex paths, and also
split paths into multiple sub-paths when adding a path point. Since the
industry relies on Bézier math to do this stuff, so do we. Many **`Path`**
functions quickly convert to **`Segment`** or **`Poly Segment`** classes to do
some calculations, then convert back to Glyphr Studio's data format.

# App and Project Editor

The App side of things in V2 is going to be very different than V1. This is
mostly to meet the new goal of being able to edit two Projects at one time,
which has been a very common feature request. To do this, we're introducing
a new concept of a **`Project Editor`**. This new shiny thing will be directly
responsible for editing a **Glyphr Studio Project**, and to do so will hold
all of the Navigation, History, Selected State, and whatever else is needed to
edit a single project.

The new App hierarchy will look roughly like this:

    App
      ┗━ Project Editor
          ┣━ Glyphr Studio Project
          ┣━ Pub/Sub
          ┣━ Current Selected State
          ┣━ History
          ┗━ Navigation
              ┗━ Page
                  ┣━ Content
                  ┃   ┗━ Controls
                  ┗━ Panels
                      ┗━ Controls

The App will manage the currently selected / visible Project Editor,
or possibly displaying two or more at one time. Through the App,
cross-project-editor scenarios (like glyph copy/paste) will be enabled.

The **App**, **Controls**, **IO**, **Pages**, **Panels**, and **Project Editor**
folders all support this overall App model.

**App files should have as many tests as is feasible**
(right now, it's not many)

# Other Stuff

There are a few other folders:

**Lib** holds libraries (like OpenType.js)
and also fixed reference data (like Unicode Names). The whole **lib** folder
should be excluded from **src** folder level searches, as those files
should not need updating.

**Common** is what it sounds like, it holds generic functionality that
may be used by any App or Project Data code. Includes things like
Math and Color functions.

**Samples** has a few Glyphr Studio projects that can be loaded as
examples. It also has some sample glyph elements to enable easier testing.

# That's it!

Send me email at mail@glyphrstudio.com if you have any questions or would
like to contribute features!
