/*globals define, $,_*/
/*jshint browser: true, camelcase: false*/

define([
    'decorators/EllipseDecorator/EasyDAG/EllipseDecorator.EasyDAGWidget',
    './AttributeField',
    './CreateAttributeField',
    'decorators/MetaDecorator/DiagramDesigner/AttributeDetailsDialog',
    'css!./OpIntDecorator.EasyDAGWidget.css'
], function (
    DecoratorBase,
    AttributeField,
    CreateAttributeField,
    AttributeDetailsDialog
) {

    'use strict';

    var OpIntDecorator,
        DECORATOR_ID = 'OpIntDecorator';

    OpIntDecorator = function (options) {
        DecoratorBase.call(this, options);
    };

    _.extend(OpIntDecorator.prototype, DecoratorBase.prototype);

    OpIntDecorator.prototype.DECORATOR_ID = DECORATOR_ID;
    OpIntDecorator.prototype.initialize = function() {
        if (this.isOperation()) {
            this.color = '#2196f3';
        } else if (this._node.baseName) {
            // On hover, show the type
            this.enableTooltip(this._node.baseName, 'dark');
        }
        DecoratorBase.prototype.initialize.call(this);
        this.$name.on('dblclick', this.editName.bind(this));
    };

    OpIntDecorator.prototype.AttributeField = AttributeField;
    OpIntDecorator.prototype.isOperation = function() {
        return this._node.baseName === 'Operation';
    };

    OpIntDecorator.prototype.createAttributeFields = function(y, width) {
        var field,
            initialY = y;

        if (!this.isOperation()) {
            return y;
        }

        y = DecoratorBase.prototype.createAttributeFields.call(this, y, width);
        // Change attribute field so clicking allows user to edit/delete the field
        this.fields.forEach(field =>
            field.onLabelClick = this.editAttributeMeta.bind(this, field.name));

        // Add the 'create new attribute' field
        y += this.ROW_HEIGHT + (y === initialY ? 0 : 10);
        field = new CreateAttributeField(this.logger, this.$attributes, y, width);
        field.onClick = this.newAttribute.bind(this);
        this.fields.push(field);
        return y;
    };

    OpIntDecorator.prototype.newAttribute = function() {
        var defSchema = {
            type: 'string'
        };

        this.editAttributeMeta(null, defSchema);
    };

    OpIntDecorator.prototype.expand = function() {
        DecoratorBase.prototype.expand.call(this, this.isOperation());
    };

    OpIntDecorator.prototype.editAttributeMeta = function(name, defSchema) {
        var dialog = new AttributeDetailsDialog(),
            node = this.client.getNode(this._node.id),
            attrNames = node.getValidAttributeNames(),
            attrInfo = this._node.attributes[name] || defSchema,
            schema,
            i;

        // Open the dialog for editing the attribute
        schema = _.extend({defaultValue: attrInfo.value}, attrInfo);

        // Remove the current name
        i = attrNames.indexOf(name);
        if (i !== -1) {
            attrNames.splice(i, 1);
        }

        dialog.show(schema, attrNames,
            desc => this.setAttributeMeta(name, desc),
            () => this.deleteAttribute(name));
    };

    OpIntDecorator.prototype.deleteAttribute = function(name) {
        var opName = this._node.attributes.name.value,
            msg = `Deleting "${name}" attribute from "${opName}" operation`;

        this.client.startTransaction(msg);
        this.client.removeAttributeSchema(this._node.id, name);
        this.client.delAttributes(this._node.id, name);
        this.client.completeTransaction();
    };

    OpIntDecorator.prototype.setAttributeMeta = function(name, desc) {
        var schema,
            opName = this._node.attributes.name.value,
            msg = `Updating "${name}" attribute in "${opName}" operation`;

        // Create the schema from the desc
        schema = {
            type: desc.type,
            min: desc.min,
            max: desc.max,
            regexp: desc.regexp
        };

        if (desc.isEnum) {
            schema.enum = desc.enumValues;
        }

        // Update the operation's attribute
        this.client.startTransaction(msg);

        if (name !== desc.name) {  // Renaming attribute
            if (name) {
                this.client.removeAttributeSchema(this._node.id, name);
                this.client.delAttributes(this._node.id, name);
            }
            name = desc.name;
        }

        this.client.setAttributeSchema(this._node.id, name, schema);
        this.client.setAttributes(this._node.id, name, desc.defaultValue);
        this.client.completeTransaction();
    };

    OpIntDecorator.prototype.editName = function() {
        var html = this.$name[0][0],
            position = html.getBoundingClientRect(),

            width = Math.max(position.right-position.left, 15),
            container = $('<div>'),
            parentHtml = $('body');

        // foreignObject was not working so we are using a tmp container
        // instead
        container.css('top', position.top);
        container.css('left', position.left);
        container.css('position', 'absolute');
        container.css('width', width);
        container.attr('id', 'CONTAINER-TMP');

        $(parentHtml).append(container);

        container.editInPlace({
            enableEmpty: true,
            value: this.name,
            css: {
                'z-index': 10000,
                'id': 'asdf',
                'width': width,
                'xmlns': 'http://www.w3.org/1999/xhtml'
            },
            onChange: this.onNameChanged.bind(this),
            onFinish: function () {
                $(this).remove();
            }
        });
    };

    OpIntDecorator.prototype.onNameChanged = function(oldVal, newValue) {
        var whitespace = /^\s*$/;
        if (newValue !== oldVal && !whitespace.test(newValue)) {
            this.onValidNameChange(newValue);
        }
    };

    OpIntDecorator.prototype.onValidNameChange = function(newValue) {
        this.saveAttribute('name', newValue);
    };

    OpIntDecorator.prototype.getDisplayName = function() {
        return this._node.name;
    };

    return OpIntDecorator;
});
