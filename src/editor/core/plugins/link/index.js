/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {linkPlugin} from './plugin'
import {menu} from './menu'

const link = {
    id: 'link',
    schema: schema,
    menu: (options) => menu(options),
    registerMarkdownIt: (md) => {
        var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };

        md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
            // If you are sure other plugins can't add `target` - drop check below
            var aIndex = tokens[idx].attrIndex('target');

            if (aIndex < 0) {
                tokens[idx].attrPush(['target', '_blank']); // add new attribute
            } else {
                tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
            }

            tokens[idx].attrPush(['rel', 'noopener']);

            // pass token to default renderer.
            return defaultRender(tokens, idx, options, env, self);
        };
    },
    plugins: (options) => {
        return [linkPlugin];
    }
};

export default link;
