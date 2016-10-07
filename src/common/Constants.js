/* globals define */
(function(root, factory){
    if(typeof define === 'function' && define.amd) {
        define([], function(){
            return factory();
        });
    } else if(typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CONSTANTS = factory();
    }
}(this, function() {
    return {
        LINE_OFFSET: 'lineOffset',

        // DeepForge metadata creation in dist execution
        START_CMD: 'deepforge-cmd',

        IMAGE: {  // all prefixed w/ 'IMG' for simple upload detection
            PREFIX: 'IMG',
            BASIC: 'IMG-B',
            CREATE: 'IMG-C',
            UPDATE: 'IMG-U',
            NAME: 'IMAGE-N'  // No upload required
        },

        GRAPH_CREATE: 'GRAPH',
        GRAPH_PLOT: 'PLOT',
        GRAPH_CREATE_LINE: 'LINE',

        // Code Generation Constants
        CTOR_ARGS_ATTR: 'ctor_arg_order',

        // Operation types
        OP: {
            INPUT: 'Input',
            OUTPUT: 'Output'
        },

        PULSE: {
            DEAD: 0,
            ALIVE: 1,
            DOESNT_EXIST: 3
        },

        // Job stdout update
        STDOUT_UPDATE: 'stdout_update'
    };
}));
