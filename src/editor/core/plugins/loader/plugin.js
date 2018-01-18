/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {Plugin} from "prosemirror-state"
import {Decoration, DecorationSet} from "prosemirror-view"


const loaderPlugin = new Plugin({
    state: {
        init() {
            return DecorationSet.empty
        },
        apply(tr, set) {
            // Adjust decoration positions to changes made by the transaction
            debugger;
            set = set.map(tr.mapping, tr.doc);
            // See if the transaction adds or removes any placeholders
            let action = tr.getMeta(this);
            if (action && action.add) {
                let widget = humhub.require('ui.loader').set($('<span class="ProseMirror-placeholder">'), {
                    span: true,
                    size: '8px',
                    css: {
                        padding: '0px',
                        width: '60px'
                    }
                })[0];
                let deco = Decoration.widget(action.add.pos, widget, {id: action.add.id});
                set = set.add(tr.doc, [deco])
            } else if (action && action.remove) {
                set = set.remove(set.find(null, null,
                    spec => spec.id == action.remove.id))
            }
            return set
        }
    },
    props: {
        decorations(state) { return this.getState(state) }
    }
});


function findPlaceholder(state, id) {
    let decos = loaderPlugin.getState(state);
    let found = decos.find(null, null, spec => spec.id == id)
    return found.length ? found[0].from : null
}

export {loaderPlugin, findPlaceholder}