var FilePlugin = require("nativescript-file-plugin").FilePlugin;
var filePlugin = new FilePlugin();

describe("greet function", function() {
    it("exists", function() {
        expect(filePlugin.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(filePlugin.greet()).toEqual("Hello, NS");
    });
});