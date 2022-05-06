# inputSaver
A jQuery plugin for save your form elements current state and dataTable columnVisibility options.

(Current api only support columnVisibility for dataTables but it may expand for further dataTable options.)

# Installation
inputSaver plugin has built on jQuery-ui widget factory so after adding jQuery to your
html file you also need to add library called jQuery-ui. inputSaver uses Bootstrap for 
default html theme so you need to add also bootstrap4 too.

# CDN
```html 
<script src="https://cdn.jsdelivr.net/gh/erensertkaya/inputSaver/inputSaver.js" referrerpolicy="no-referrer"></script> 
```

# Dependencies
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" integrity="sha512-uto9mlQzrs59VwILcLiRYeLKPPbS/bT71da/OEBYEwcdNUk8jYIy+D176RYoop1Da+f9mvkYrmj5MCLZWEtQuA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.4.10/dist/sweetalert2.all.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/erensertkaya/inputSaver/inputSaver.js" referrerpolicy="no-referrer"></script>
```

# Simple Usages

    # Database Example

````javascript
$("#exampleDiv").inputSaver({
    identifier:["id","name"],
    name:"count",
    saveTo:"database",
    context:[$("#myForm")],
    disInclude:[".myClass","myId"],
    urlToMount:"/plugin/inputsaver/all",
    urlToSave:"/plugin/inputsaver/create",
    urlToUpdate:"/plugin/inputsaver/update",
    urlToDelete:"/plugin/inputsaver/delete"
});
````

    # Storage Example

````javascript
$("#exampleDiv").inputSaver({
    identifier:["id","name"],
    name:"count",
    saveTo:"storage",
    context:[$("#myForm")],
    disInclude:[".myClass","myId"],
});
````
___

You have to select where to plugin mount with jQuery selector, after that you can initialize plugin
on that element.

>identifier: By given order inputSaver collets all the input elements according to theese attiributes values by given order..

>name: Name of the plugin that belongs that page. It has to be unique for that page.

>context: Array of elements to determine which range of dom element's will saved.
> If you don't set that option, by default it's going to set as document object that means it's
will save all the form elements.

>saveTo: As option name tells, this option is where you decide to save collected data
whether server or client. (You have two option database and storage, by default it's set as storage).

>disInclude: Array of jQuery selectors for disincluding unwanted input elements. 

# Optional Options
>urlToSave, urlToSave, urlToUpdate, urlToDelete: Those options need to use if saveTo option set as database.
Every option corresponding to backend url which perform database related operations.

# Callback Functions

>afterMount: Triggered immediately after values mount to elements which saved by inputSaver.
> 
>(This can be use for reinitializing other plugings like select2, dataTables etc.)

>mutateAfter: Triggered immediately after new options saved by inputSaver.
> 
>mutateBefore: Triggered immediately before new options saved by inputsaver.
>
>(These can be use for manipulating data before saving)



