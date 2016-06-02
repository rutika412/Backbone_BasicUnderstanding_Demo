(function () {

    window.App = {

        Models: {},
        Collections: {},
        Views: {},
        Router: {}

    };

    //window.template = function () {
    //    return _.template( $('#'+ id).html());
    //}

    App.Router = Backbone.Router.extend({

        routes: {
            '': 'index',
            'show/:id' : 'show'
        },
        index : function () {
            
            console.log("Hi there from index page");
        },
        show: function (id) {
            console.log("Show Route" + id);
        }

    });
    new App.Router;
    Backbone.history.start();

    App.Models.Task = Backbone.Model.extend({
        //set defaults

        //validate

        validate: function (attrs) {
            if(!$.trim(attrs.title)){
                return 'A task requires a valid title.';
            }
        }
    });

    App.Views.Tasks = Backbone.View.extend({

        tagName: 'ul',
        initialize : function() {
            this.collection.on('add', this.addOne, this);
        },
        render  : function () {
            this.collection.each(this.addOne, this);
         
        },
        addOne : function (task) {
            var taskView  = new App.Views.Task({ model : task});
            this.$el.append(taskView.render().$el);
            //return this;
        }

    });

    App.Views.Task = Backbone.View.extend({

        tagName: 'li',

        template: _.template($('#taskTemplate').html()),

        initialize : function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },

        events: {
            'click .edit': 'editTask',
            'click .delete': 'destroy'
        },

        editTask: function () {
            var editTask = prompt('what would you like to change the text to', this.model.get('title'));
            if (!editTask) {
                return;
            }
            this.model.set('title', editTask);
        },

        destroy: function () {
            this.model.destroy();
            console.log(taskCollection);
            //this.$el.remove();

        },
        remove : function () {
            this.$el.remove();
        },
        render: function () {
            var template = this.template(this.model.toJSON());
            this.$el.html(template);
            return this;
        }
    });


    //View for new task
    App.Views.AddTask = Backbone.View.extend({

        el: '#addTask',
        events: {
            'submit': 'submit'
        },
        initialize: function () {

        },
        submit: function (e) {
            //alert('submitted');
            e.preventDefault();
            var newTaskTitle = $(e.currentTarget).find('input[type=text]').val();
            console.log(newTaskTitle);
            var task = new App.Models.Task({ title: newTaskTitle });
            this.collection.add(task);
            console.log(task);
        }

    });

    
    App.Collections.Tasks = Backbone.Collection.extend({
       model :App.Models.Task
    });

    //Collection of tasks
   window.taskCollection = new App.Collections.Tasks( [
        {
            title: 'Go to the store',
            priority : 4
        },

        {
            title: 'Go to the mall',
            priority : 3
        },
        {
            title: 'Get to work',
            priority :  5
        }
    
    ]);
    
   var addTaskView = new App.Views.AddTask({ collection : taskCollection });
    var tasksView = new App.Views.Tasks({ collection: taskCollection });

    tasksView.render();
    //$(document.body).html(tasksView.el);
    $('.task').html(tasksView.el);

})();