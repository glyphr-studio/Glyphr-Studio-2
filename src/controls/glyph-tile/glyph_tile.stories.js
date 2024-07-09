import { GlyphrStudioProject } from "../../project_data/glyphr_studio_project";
import exampleProject from "../../samples/oblegg.gs2?raw";
import { GlyphTile } from "./glyph_tile";

const project = new GlyphrStudioProject(JSON.parse(exampleProject));

console.log(project);

customElements.define('glyph-tile', GlyphTile);

export default {
	title: 'Controls/GlyphTile',
	component: 'glyph-tile',
	render: (args) => {
		let tile = new GlyphTile({
			project: project,
			'displayed-item-id': args.displayedItemID,
			'session-state': args.sessionState,
		});
		if(args.selected) tile.setAttribute('selected', '');
		tile.redraw();

		return tile;
	},
};

export const Primary = {
	args: {
		displayedItemID: 'glyph-0x41',
	},
};

export const Selected = {
	args: {
		displayedItemID: 'glyph-0x41',
		selected: true,
	},
}
export const notCreated = {
	args: {
		displayedItemID: 'glyph-0x42',
		sessionState: 'notCreated',
	},
};

export const newGlyph = {
	args: {
		displayedItemID: 'glyph-0x43',
		sessionState: 'new',
	},
};

export const changedGlyph = {
	args: {
		displayedItemID: 'glyph-0x44',
		sessionState: 'changed',
	},
};