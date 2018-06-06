
/**
    Horizontal Kern
    An object for storing two groups of glyphs, and
    the kern value that applies to them.
**/


    function HKern(oa) {
        this.objtype = 'hkern';

        this.leftgroup = oa.leftgroup || [];
        this.rightgroup = oa.rightgroup || [];

        // Positive values reduce space between chars
        this.value = oa.value || 0;
    }

    HKern.prototype.getName = function() {
        let left = hexToChars(this.leftgroup.join(''));
        let right = hexToChars(this.rightgroup.join(''));
        return '' + left + ' | ' + right;
    };

    function getSelectedKern() {
        let re = _GP.kerning[_UI.selectedKern];
        return re || _GP.kerning[getFirstID(_GP.kerning)] || false;
    }

    function getSelectedKernID() {
        _UI.selectedKern = _UI.selectedKern || getFirstID(_GP.kerning);
        return _UI.selectedKern;
    }
