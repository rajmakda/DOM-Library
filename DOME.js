window.dome = (function() {

    // Contructor function for new instances of library
    function Dome(elements) {
        for (var i = 0;i < elements.length; i++) {
            this[i] = elements[i]
        }
        this.length = elements.length
    }

    // Utility functions

    // Maps through all the elements and invokes the callback that is passed by calling it on the Dome object elements. The result of the callback is returned for each element in an array
    Dome.prototype.map = function(callback) {
        var results = [];
        for (var i = 0;i<this.length; i++) {
            results.push(callback.call(this,this[i],i));
        }
        return results;
    }

    // Essentially the same thing as map but the result is not important so we just return this to make it chainable
    Dome.prototype.forEach = function(callback) {
        this.map(callback);
        return this;
    }

    // Again the same thing as map. Difference is that in terms of making library friendly, if we have only one element, we return the result of the callback directly else we return an array of the results
    Dome.prototype.mapOne = function(callback) {
        var results = this.map(callback);
        return results.length > 1 ? results:results[0]
    }


    // This function is used to set text of all elements if an argument is passed else it will return the text for the elements
    Dome.prototype.text = function(text) {
        if (typeof text !== "undefined") {
            return this.forEach(function(element) {
                element.innerText = text
            })
        } else {
            return this.mapOne(function(element) {
                return element.innerText
            })
        }
    }

    // This function is essentially the same as text but will instead set or get inner HTML
    Dome.prototype.html = function(html) {
        if (typeof html !== "undefined") {
            return this.forEach(function(element) {
                element.innerHTML = html
            })
        } else {
            return this.mapOne(function(element) {
                return element.innerHTML
            })
        }
    }

    // This function is used to add one class or an array of classes to the elements
    Dome.prototype.addClass = function(classes) {
        var className = ""
        if (typeof classes !== "string") {
            for (var i=0;i<classes.length;i++) {
                className += " " + classes[i]
            }
        } else {
            className += " " + classes
        }
        return this.forEach(function(element) {
            element.className += className
        })
    }

    // This function will remove a class name from the elements. Only one class can be removed at a time. All instances of the class name will be removed.
    Dome.prototype.removeClass = function (classToBeRemoved) {
        return this.forEach(function(element) {
            var classes = element.className
            classes = classes.split(" ")
            var i;
            while((i = classes.indexOf(classToBeRemoved)) > -1) {
                cs = cs.splice(0,i).concat(cs.splice(++i))
            }
            element.className = cs.join(" ")
        })
    }

    // Main library object
    var dome = {

        // Gets the DOM elements specified by the selector. Selector can be a string (CSS Selector), a DOM Node or a NodeList
        get: function(selector) {
            var elements;
            // If string then selector is a CSS selector
            if (typeof selector === "string") {
                elements = document.querySelectorAll(selector);
            // If selector has length, we assume it is a NodeList
            } else if (selector.length) {
                elements = selector;
            // Else selector is a DOM Node and add it to an array to be consistent with the library
            } else {
                elements = [selector];
            }
            return new Dome(elements);
        }
    };
    return dome
}());