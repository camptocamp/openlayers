/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/SLD/v1_0_0.js
 */

/**
 * Class: OpenLayers.Format.SLD/v1_0_0_GeoServer
 * Read and write SLD version 1.0.0 with GeoServer-specific enhanced options.
 * See http://svn.osgeo.org/geotools/trunk/modules/extension/xsd/xsd-sld/src/main/resources/org/geotools/sld/bindings/StyledLayerDescriptor.xsd
 * for more information.
 *
 * Inherits from:
 *  - <OpenLayers.Format.SLD.v1_0_0>
 */
OpenLayers.Format.SLD.v1_0_0_GeoServer = OpenLayers.Class(
    OpenLayers.Format.SLD.v1_0_0, {

    /**
     * Property: version
     * {String} The specific parser version.
     */
    version: "1.0.0",

    /**
     * Property: profile
     * {String} The specific profile
     */
    profile: "GeoServer",

   /**
     * Constructor: OpenLayers.Format.SLD.v1_0_0_GeoServer
     * Create a new parser for GeoServer-enhanced SLD version 1.0.0.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: OpenLayers.Util.applyDefaults({
        "sld": OpenLayers.Util.applyDefaults({
            "Priority": function(node, obj) {
                var value = this.readers.ogc._expression.call(this, node);
                if (value) {
                    obj.priority = value;
                }
            },
            "VendorOption": function(node, obj) {
                if (!obj.vendorOptions) {
                    obj.vendorOptions = [];
                }
                obj.vendorOptions.push({
                    name: node.getAttribute("name"),
                    value: this.getChildValue(node)
                });
            }
        }, OpenLayers.Format.SLD.v1_0_0.prototype.readers["sld"])
    }, OpenLayers.Format.SLD.v1_0_0.prototype.readers),

    /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */
    writers: OpenLayers.Util.applyDefaults({
        "sld": OpenLayers.Util.applyDefaults({
            "Priority": function(priority) {
                return this.writers.sld._OGCExpression.call(
                    this, "sld:Priority", priority
                );
            },
            "VendorOption": function(option) {
                return this.createElementNSPlus("sld:VendorOption", {
                    attributes: {name: option.name},
                    value: option.value
                });
            },
            "TextSymbolizer": function(symbolizer) {
                var writers = OpenLayers.Format.SLD.v1_0_0.prototype.writers;
                var node = writers["sld"]["TextSymbolizer"].apply(this, arguments);
                if (symbolizer.externalGraphic || symbolizer.graphicName) {
                    this.writeNode("Graphic", symbolizer, node);
                }
                if ("priority" in symbolizer) {
                    this.writeNode("Priority", symbolizer.priority, node);
                }
                return this.addVendorOptions(node, symbolizer);
            },
            "PointSymbolizer": function(symbolizer) {
                var writers = OpenLayers.Format.SLD.v1_0_0.prototype.writers;
                var node = writers["sld"]["PointSymbolizer"].apply(this, arguments);
                return this.addVendorOptions(node, symbolizer);
            },
            "LineSymbolizer": function(symbolizer) {
                var writers = OpenLayers.Format.SLD.v1_0_0.prototype.writers;
                var node = writers["sld"]["LineSymbolizer"].apply(this, arguments);
                return this.addVendorOptions(node, symbolizer);
            },
            "PolygonSymbolizer": function(symbolizer) {
                var writers = OpenLayers.Format.SLD.v1_0_0.prototype.writers;
                var node = writers["sld"]["PolygonSymbolizer"].apply(this, arguments);
                return this.addVendorOptions(node, symbolizer);
            }
        }, OpenLayers.Format.SLD.v1_0_0.prototype.writers["sld"])
    }, OpenLayers.Format.SLD.v1_0_0.prototype.writers),

    /**
     * Method: addVendorOptions
     * Add in the VendorOption tags and return the node again.
     *
     * Parameters:
     * node - {DOMElement} A DOM node.
     * symbolizer - {Object}
     *
     * Returns:
     * {DOMElement} A DOM node.
     */
    addVendorOptions: function(node, symbolizer) {
        var options = symbolizer.vendorOptions;
        if (options) {
            for (var i=0, ii=options.length; i<ii; ++i) {
                this.writeNode("VendorOption", options[i], node);
            }
        }
        return node;
    },

    CLASS_NAME: "OpenLayers.Format.SLD.v1_0_0_GeoServer"

});
