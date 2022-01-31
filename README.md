# inputSaver
A jQuery plugin for save your form elements current state.

# Installation
inputSaver plugin has built on jQuery-ui widget factory so after adding jQuery to your
html file you also need to add library called jQuery-ui. inputSaver uses Bootstrap for 
default html theme so you need to add also bootstrap4 too.

# Dependencies
```html
<!-- js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" integrity="sha512-uto9mlQzrs59VwILcLiRYeLKPPbS/bT71da/OEBYEwcdNUk8jYIy+D176RYoop1Da+f9mvkYrmj5MCLZWEtQuA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
<!-- html -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
```

# Simple Usage

````javascript
$("#exampleDiv").inputSaver({
    identifier:"name",
    name:"count",
    context:[$("#countingForm")],
    saveTo:"storage",
});
````
___

You have to select where to plugin mount with jQuery selector, after that you can initialize plugin
on that element.

>identifier: It's the attribute that select all the form elements on current page that plugin works.

>name: It's name of the plugin that belongs that page. It has to be unique for that project.

>context: It's an array of elements to determine which range of page element's will saved.
> If you don't set that option, by default it's going to set as document object that means it's
will save all the form elements.


