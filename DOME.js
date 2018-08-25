// Function to fix a bug in IE 8 which does not support the Array.prototype.indexOf function
if (typeof Array.prototype.indexOf !== "function") {
    Array.prototype.indexOf = function(element) {
        for (var i =0; i<this.length;i++) {
            if(this[i] === element) {
                return i
            }
        }
        return -1
    }
}

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

    // This function adds attributes to an elements or returns the attributes of elements
    Dome.prototype.attr = function(attr, value) {
        if (typeof value !== "undefined") {
            return this.forEach(function(element) {
                element.setAttribute(attr, value)
            })
        } else {
            return this.mapOne(function(element) {
                return element.getAttribute(attr)
            })
        }
    }

    // Append an element. Append one or more new/existing elements to one or more existing elements. The argument elements has to be an instance of the DOME object
    Dome.prototype.append = function(elements) {
        return this.forEach(function(parentElement, i) {
            elements.forEach(function(childElement) {
                // Cloning/Copying node if appending to more than one existing element
                if (i > 0) {
                    childElement = childElement.cloneNode(true)
                }
                parentElement.appendChild(childElement)
            })
        })
    }

    // Prepend an element
    Dome.prototype.prepend = function(elements) {
        return this.forEach(function(parentElement,j) {
            for(var i=elements.length-1;i>=0;i--) {
                childElement = j > 0 ? elements[i].cloneNode(true) : elements[i]
                parentElement.insertBefore(childElement,parentElement.firstChild)
            }
        })
    }

    // Removing elements from the DOM
    Dome.prototype.remove = function() {
        return this.forEach(function(element) {
            return element.parentNode.removeChild(element)
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
        },

        // Create a new DOM element with a tagname and an attributes object containing key value pairs of the attributes to be added
        create: function(tagName, attributes) {
            var element = new Dome([document.createElement(tagName)])
            // We delete the className and text so that we do not add them as attributes while looping through the other attribute keys
            if (attributes) {
                if(attributes.className) {
                    element.addClass(attributes.className)
                    delete attributes.className
                }
                if (attributes.text) {
                    element.text(attributes.text)
                    delete attributes.text
                }
                for (var key in attributes) {
                    // This check is to ensure there are no properties inherited
                    if(attributes.hasOwnProperty(key)) {
                        element.attr(key, attributes[key])
                    }
                }
            }
            return element;
        }
    };
    return dome
}());