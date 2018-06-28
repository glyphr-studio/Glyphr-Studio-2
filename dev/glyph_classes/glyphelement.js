
/**
 * Base for all Glyph Elements
 */
export default class GlyphElement {
    /** Yay! */
    constructor() {}


    /**
     * Find out what type of Element this is
     */
    get objType() {
        return this.constructor.name;
    }


    /**
     * Export object properties that need to be saved to a project file
     * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
     * @return {*}
     */
    save(verbose = false) {
        let re = clone(this);

        if (verbose) re.objType = this.objType;

        return re;
    }
}
