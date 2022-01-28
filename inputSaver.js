$.widget("IS.inputSaver", {
    // Default options.
    options: {
        name:"",
        html: `
                <div class="accordion" id="inputSaver">
                <div class="card">
                <div class="card-header" id="headingOne">
                <h5 class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Previous Options</button>
                </h5>
                </div>
                <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                <div class="input-saver-container card-body">
                </div>
                </div>
                </div>
                <div>
                <button class="input-saver-save-button btn btn-success float-right">Save Option</button>
                </div>
                </div>
`,
        saveTo: "database", //database, storage,
        identifier:"id", //name,id any attiribute
        context:[this.document],
        allInputs:true,
        baseUrl:window.location.origin,
        urlToSave:"",
        urlToMount:"",
        urlToDelete:""

    },

    _state:{
        data:[],
        dataToSend:{},
        dataToSendJSON:{},
        name:"",
        inputs:[],
        selects:[],
        textAreas:[],
        list:""
    },

    _create: function() {

        this.element.append(this.options.html);

        this._getList();

        this._on($(".input-saver-save-button"),{
            "click": function (){
                this._getAll();
                this._bundleData();
                this._nameDialog();
            }
        });

        this._on(this.document,{
            "click.input-saver-delete-button": function (e){
                this._deleteRow($(e.target).parents(".input-saver-row").data("id"));
            }
        });

        this._on(this.document,{
            "click.input-saver-map": function (e){
                this._mapToDom($(e.target).parents(".input-saver-row").data("id"));
            }
        });
    },

    _nameDialog:function (){
        Swal.fire({
            title: 'Add Previous Options',
            html: `<input type="text" id="name" class="swal2-input" placeholder="Name">`,
            confirmButtonText: 'Save',
            focusConfirm: false,
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('.swal2-input').value;
                let hasThatName = false;

                $(".input-saver-map").each((index,item) => {
                    if (name === $(item).text().trim()){
                        hasThatName = true;
                        Swal.showValidationMessage(`You can't use same name more than once.`)
                    }
                });

                if (!name) {
                    Swal.showValidationMessage(`Please enter name.`)
                }

                if (name && hasThatName === false) {
                    this._state.name = name;
                    this._save();
                }

            }
        })
    },

    _bundleData: function (){
        this._state.dataToSend = {input:this._state.inputs, select:this._state.selects, textarea:this._state.textAreas}
        this._trigger( "mutateAfter", null,this._state.dataToSend);
        this._state.dataToSendJSON = JSON.stringify(this._state.dataToSend);

        this._state.inputs = [];
        this._state.selects = [];
        this._state.textAreas = [];
    },

    _getAll:function (){
        if (this.options.allInputs === true){
            this.options.context.forEach((node) => {
                this._setInputs(this._getInputs(node));
                this._setSelects(this._getSelects(node));
                this._setTextareas(this._getTextAreas(node));
            });
        }
    },

    _getSelects(node){
        return node.find("select")
    },

    _getInputs(node){
        return node.find("input")
    },

    _getTextAreas(node){
        return node.find("textarea")
    },

    _setSelects(node){
        node.each((index,element) => {
            var selects = {identifier:this.options.identifier,key:$(element).attr(this.options.identifier),value:[]};
            this._trigger( "mutateBefore", null,{element: element, data:selects});
            selects.key = $(element).attr(selects.identifier);
            for (selectObjKey in selects){
                if (selectObjKey === "value"){
                    $(element).find("option").each((index,item) => {
                        var options = {identifier:this.options.identifier, key:$(item).attr(this.options.identifier), value:$(item).is(":selected")};
                        this._trigger( "mutateBefore", null,{element: item, data:options});
                        options.key = $(item).attr(options.identifier);
                        selects[selectObjKey].push(options);
                    })
                }
            }
            this._state.selects.push(selects);
        });
    },

    _setTextareas(node){
        node.each((index,element) => {
            var textareas = {identifier:this.options.identifier,key:$(element).attr(this.options.identifier),value:$(element).val()};
            this._trigger( "mutateBefore", null,{element: element, data:textareas});
            textareas.key = $(element).attr(textareas.identifier);
            this._state.textAreas.push(textareas);
        });
    },

    _setInputs(node){
        node.each((index,element) => {
            if ($(element).attr("type") !== "radio" && $(element).attr("type") !== "checkbox"){
                var inputs = {identifier:this.options.identifier,key:$(element).attr(this.options.identifier),value:$(element).val()};
                this._trigger( "mutateBefore", null,{element: element, data:inputs});
                inputs.key = $(element).attr(inputs.identifier);
                this._state.inputs.push(inputs);
            }
            else{
                var radioAndCheckbox = {identifier:this.options.identifier,key:$(element).attr(this.options.identifier),value:$(element).is(':checked')};
                this._trigger( "mutateBefore", null,{element: element, data:radioAndCheckbox});
                radioAndCheckbox.key = $(element).attr(radioAndCheckbox.identifier);
                this._state.inputs.push(radioAndCheckbox);
            }
        });
    },

    _save(){
        this._loading();
        switch(this.options.saveTo) {
            case "database":
                this._saveDatabase();
                break;
            case "storage":
                this._saveStorage();
                break;
        }
    },

    _saveStorage(){
        localStorage.setItem("inputSaver_"+this.options.name+"_"+this._state.name, this._state.dataToSendJSON);
        this._mountRow({id:"inputSaver_"+this.options.name+"_"+this._state.name,data:this._state.dataToSendJSON,name:this._state.name});
    },

    _saveDatabase(){
        $.ajax({
            url:this.options.baseUrl+this.options.urlToSave,
            type: 'POST',
            dataType: 'json',
            data: {data:this._state.dataToSendJSON,widgetName:this.options.name,name:this._state.name},
            success: (data) => {
                this._mountRow(data);
            },
        });
    },

    _mountRow(data){
        this._state.data.push({id:data.id, data:data.data});

        var row = `
            <div data-id="${data.id}" class="input-saver-row">
            <button class="input-saver-delete-button btn btn-danger"><i class="fa fa-trash"></i></button>
            <button class="input-saver-map alert alert-secondary" role="alert">
            ${data.name}
            </button>
            <br>
            </div>
                    `;

        $(this.element).find(".input-saver-container").append(row);

        $(this.element).find(".collapse").collapse('show');
    },

    _loading(){
        setTimeout(function(){
            $(".lds-ring").hide();
        },1000);
        $(".lds-ring").show();
    },

    _getList(){
        switch(this.options.saveTo) {
            case "database":
                this._getListFromDatabase();
                break;
            case "storage":
                this._getListFromStorage();
                break;
        }
    },

    _getListFromDatabase(){
        $.ajax({
            url:this.options.baseUrl+this.options.urlToMount,
            type: 'POST',
            dataType: 'json',
            data: {widgetName:this.options.name},
            success: (data) => {
                this._mountList(data);
            },
        });
    },

    _getListFromStorage(){
        var arr = [];

        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).substring(0, 11) === 'inputSaver_') {
                arr.push({id:localStorage.key(i),data:localStorage.getItem(localStorage.key(i)),widget_name:localStorage.key(i).split("_")[1],name:localStorage.key(i).split("_")[2]});
            }
        }

        this._mountList(Object.assign({}, arr));
    },

    _mountList(data){
        var row = ``;
        for (datum in data){
            this._state.data.push({id:data[datum].id, data:data[datum].data});

            if (this.options.name === data[datum].widget_name){
                row += `<div data-id="${data[datum].id}" class="input-saver-row">
                <button class="input-saver-delete-button btn btn-danger"><i class="fa fa-trash"></i></button>
                <button class="input-saver-map alert alert-secondary" role="alert">
                ${data[datum].name}
                </button>
                <br>
                </div>`;
            }
        }

        $(this.element).find(".input-saver-container").append(row);

    },

    _deleteRow(id){
        switch(this.options.saveTo) {
            case "database":
                this._deleteRowFromDatabase(id);
                break;
            case "storage":
                this._deleteRowFromStorage(id);
                break;
        }
    },

    _deleteRowFromDatabase(id){
        $.ajax({
            url:this.options.baseUrl+this.options.urlToDelete,
            type: 'POST',
            dataType: 'json',
            data:{id:id},
            success: (data) => {
                $(".input-saver-row").each(function (index,item){
                    if($(item).data("id") == data.id){
                        $(item).remove();
                    }
                });
            }
        });
    },

    _deleteRowFromStorage(id){
        localStorage.removeItem(id);
        $(".input-saver-row").each(function (index,item){
            if($(item).data("id") == id){
                $(item).remove();
            }
        });
    },

    _mapToDom(id){
        this._state.data.forEach( (dataItem,index) => {
            if (dataItem.id == id){
                var data =  JSON.parse(dataItem.data);
                console.log(data);
                for (datum in data){
                    if (datum === "textarea"){
                        data[datum].forEach( (itemTextarea, index) => {
                            this.options.context.forEach((oneContext, index) => {
                                $(oneContext).find(datum).each((index,x) => {
                                    if($(x).attr(itemTextarea.identifier) === itemTextarea.key){
                                        $(x).text(itemTextarea.value);
                                    }
                                });
                            });
                        });
                    }
                    if (datum === "input"){
                        data[datum].forEach( (itemInput,index) => {
                            this.options.context.forEach((oneContext,index) =>{
                                $(oneContext).find(datum).each((index,x) => {
                                    if($(x).attr(itemInput.identifier) === itemInput.key){
                                        if ( $(x).attr("type") !== "radio" && $(x).attr("type") !== "checkbox"){
                                            $(x).attr("value",itemInput.value);
                                        }
                                        else {
                                            $(x).attr("checked",itemInput.value);
                                        }
                                    }
                                });
                            });
                        });
                    }
                    if (datum === "select"){
                        data[datum].forEach( (itemSelect,index) => {
                            this.options.context.forEach((oneContext,index) =>{
                                $(oneContext).find(datum).each((index,x) => {
                                    $(x).find("option").each((index,x) => {
                                        itemSelect.value.forEach((y,index) => {
                                            if ($(x).attr(y.identifier) === y.key){
                                                $(x).attr("selected",y.value);
                                            }
                                        })
                                    });
                                });
                            });
                        });
                    }
                }
            }
        });
        this._trigger( "afterMount", null);
    },

});