/*globals define*/

define([
    'widgets/EasyDAG/SelectionManager',
    'widgets/EasyDAG/Buttons',
    'underscore'
], function(
    EasyDAGSelectionManager,
    Buttons,
    _
) {
    'use strict';

    var SelectionManager = function(widget) {
        EasyDAGSelectionManager.call(this, widget);
    };

    _.extend(SelectionManager.prototype, EasyDAGSelectionManager.prototype);

    SelectionManager.prototype.createActionButtons = function(width/*, height*/) {
        // Add 'watch' and 'jumpToDef' buttons
        // TODO
        new Buttons.Enter({
            context: this._widget,
            $pEl: this.$selection,
            item: this.selectedItem,
            x: width,
            y: 0
        });
    };

    return SelectionManager;
});
