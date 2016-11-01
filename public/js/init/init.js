window.App = {
    components: {},
    systems: {},
    entities: [],
    settings: { width: window.innerWidth, height: window.innerHeight }
};

App.Entity = function Entity() {
    this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + App.Entity.prototype.$count;

    App.Entity.prototype.$count++;

    return this;
};

App.Entity.prototype.$count = 0;

App.Entity.prototype.addComponent = function addComponent ( component ){
    this[component.name] = component;
    return this;
};

App.Entity.prototype.removeComponent = function removeComponent(componentName) {
    var name = componentName; // assume a string was passed in

    if(typeof componentName === 'function'){ 
        // get the name from the prototype of the passed component function
        name = componentName.prototype.name;
    }

    delete this[name];
    return this;
};

App.Entity.prototype.print = function print () {
    // Function to print / log information about the entity
    console.log(JSON.stringify(this, null, 4));
    return this;
};