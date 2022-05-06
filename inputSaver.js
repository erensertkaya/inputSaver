$.widget("IS.inputSaver", {
    // Default options.
    options: {
        name:"",
        html: `<div class="inputsaver-accordion" id="inputSaver">
                    <div class="" id="inputSaverCard">
                        <div class="" id="headingOne">
                            <button class="inputsaver-accordion-button btn btn-link btn-oval btn-sm rounded-s btn-warning" type="button">Previous Options</button>
                            <button class="input-saver-save-button btn btn-success float-right btn-oval btn-sm rounded-s btn-primary">Save Option</button>
                        </div>
                        <div id="collapseOne">
                            <div class="input-saver-container card-body card card-header" style="text-align: left; display: none;">
                        </div>
                    </div>
                </div>
`,
        saveTo: "database", //database, storage,
        identifier:['id','name'], //name,id any attiribute
        context:[$(document)],
        allInputs:true,
        baseUrl:window.location.origin,
        urlToMount:"",
        urlToSave:"",
        urlToUpdate:"",
        urlToDelete:"",
        disInclude:[]
    },

    _state:{
        data:[],
        dataToSend:{},
        dataToSendJSON:{},
        name:"",
        inputs:[],
        selects:[],
        textAreas:[],
        dataTables:[],
        list:"",
        selectedDefault:""
    },

    _create: function() {

        this.element.append(this.options.html);

        $("#inputSaver").css({
            "position": "absolute",
            "top": "75px",
        })
        $("#inputSaverCard").css({
            "max-height": "40vh",
            "overflow-y": "auto",
        });

        this._mountList(this._getList());

        this._mapDefault();

        this._on($(".input-saver-save-button"),{
            "click": function (){
                this._getAll();
                this._nameDialog();
            }
        });

        this._on(this.document,{
            "click.input-saver-delete-button": function (e){
                this._deleteRow($(e.target).parents(".input-saver-row").data("id")).then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: `Removed successfully !`,
                        showConfirmButton: true,
                        timer: 10000
                    })
                })
            }
        });

        this._on(this.document,{
            "click.input-saver-map": function (e){
                this._mapToDom($(e.target).parents(".input-saver-row").data("id"));
            }
        });

        this._on(this.document,{
            "click.input-saver-lock-button": (e) => {
                e.stopImmediatePropagation();
                this._setDefault(e.currentTarget);
            }
        });

        this._on(this.document,{
            "click.inputsaver-accordion-button": (e) => {
                e.target.classList.toggle("active");
                if ( Array.from(e.target.classList).includes("active")) {
                    $(e.target).parents("#inputSaverCard").children("#collapseOne").children()[0].style.display = "block";
                } else {
                    $(e.target).parents("#inputSaverCard").children("#collapseOne").children()[0].style.display = "none";
                }
            }
        });

    },

    _nameDialog:function (){
        Swal.fire({
            title: 'Add Previous Options',
            html: `<input type="text" id="name" class="swal2-input" placeholder="Name"><textarea id="note" class="swal2-input" placeholder="Note">`,
            confirmButtonText: 'Save',
            showCloseButton: true,
            focusConfirm: false,
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#name').value;
                const note = Swal.getPopup().querySelector('#note').value;
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
                    this._state.note = note;
                    this._bundleData();
                    this._save().then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: `Saved successfully !`,
                            showConfirmButton: true,
                            timer: 10000
                        })
                    })
                }

            }
        })
    },

    _bundleData: function (){
        this._state.dataToSend = {input:this._state.inputs, select:this._state.selects, textarea:this._state.textAreas, dataTables:this._state.dataTables, note:this._state.note, name:this._state.name,isDefault:false}
        this._trigger( "mutateAfter", null,this._state.dataToSend);
        this._state.dataToSendJSON = JSON.stringify(this._state.dataToSend);

        this._state.inputs = [];
        this._state.selects = [];
        this._state.textAreas = [];
        this._state.dataTables = [];
    },

    _getAll:function (){
        if (this.options.allInputs === true){

            this.options.context.forEach((context,index) => {
                this.options.context[index] = $(context[index].cloneNode(true));
            });

            this.options.context.forEach((contextNode) => {
                this._cleanContextes(contextNode);
            });

            this.options.context.forEach((node) => {
                this._setInputs(this._getInputs(node));
                this._setSelects(this._getSelects(node));
                this._setTextareas(this._getTextAreas(node));
                this._setDatatables(this._getDatatables(node));
            });
        }
    },

    _cleanContextes(context){
        this.options.disInclude.forEach((filteredSelection) => {
            context.find(filteredSelection).remove()
            context.remove(filteredSelection);
        })
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

    _getDatatables(node){
        return node.find("table")
    },

    _setDatatables(node){
        node.each((index,element) => {
            var datatables = {identifier: "id", key:$(element).attr('id'), columnVisibility:[]};
            if ($(element).attr('id') !== undefined){
                for (datatablesObjKey in datatables){
                    if (datatablesObjKey === "columnVisibility"){
                        $("#"+$(element).attr('id')).DataTable().columns().header().toArray().forEach((node,index) => {
                            var columnVisibility = {columnId:`${node.firstChild.textContent}`, value:$("#"+$(element).attr('id')).DataTable().column(node).visible()};
                            datatables[datatablesObjKey].push(columnVisibility);
                        })
                    }
                }
                if ($(element).attr("id") !== undefined) {
                    this._state.dataTables.push(datatables);
                }
            }
        });
    },

    _setSelects(node){
        node.each((index,element) => {
            $(this.options.identifier).each((index,identifier) => {
                var selects = {identifier:identifier,key:$(element).attr(identifier),value:[]};
                this._trigger( "mutateBefore", null,{element: element, data:selects});
                selects.key = $(element).attr(selects.identifier);
                for (selectObjKey in selects){
                    if (selectObjKey === "value"){
                        $(this.options.identifier).each((index,optionIdentifier) => {
                            $(element).find("option").each((index,item) => {
                                var options = {identifier:optionIdentifier, key:$(item).attr(identifier), value:$(item).is(":selected")};
                                this._trigger( "mutateBefore", null,{element: item, data:options});
                                options.key = $(item).attr(options.identifier);
                                if ($(item).attr(options.identifier) !== undefined) {
                                    selects[selectObjKey].push(options);
                                }
                            })
                        })
                    }
                }
                if ($(element).attr(selects.identifier) !== undefined) {
                    this._state.selects.push(selects);
                }
            })
        });
    },

    _setTextareas(node){
        node.each((index,element) => {
            $(this.options.identifier).each((index,identifier) => {
                var textareas = {identifier:identifier,key:$(element).attr(identifier),value:$(element).val()};
                this._trigger( "mutateBefore", null,{element: element, data:textareas});
                textareas.key = $(element).attr(textareas.identifier);
                if ($(element).attr(textareas.identifier) !== undefined) {
                    this._state.textAreas.push(textareas);
                }
            });

        });
    },

    _setInputs(node){
        node.each((index,element) => {
            if ($(element).attr("type") !== "button"){
                if ($(element).attr("type") !== "radio" && $(element).attr("type") !== "checkbox"){
                    $(this.options.identifier).each((index,identifier) => {
                        var inputs = {identifier:identifier,key:$(element).attr(identifier),value:$(element).val()};
                        this._trigger( "mutateBefore", null,{element: element, data:inputs});
                        inputs.key = $(element).attr(inputs.identifier);
                        if ($(element).attr(inputs.identifier) !== undefined){
                            this._state.inputs.push(inputs);
                        }
                    })
                }
                else{
                    $(this.options.identifier).each((index,identifier) => {
                        var radioAndCheckbox = {identifier:identifier,key:$(element).attr(identifier),value:$(element).is(':checked')};
                        this._trigger( "mutateBefore", null,{element: element, data:radioAndCheckbox});
                        radioAndCheckbox.key = $(element).attr(radioAndCheckbox.identifier);
                        if ($(element).attr(radioAndCheckbox.identifier) !== undefined) {
                            this._state.inputs.push(radioAndCheckbox);
                        }
                    });

                }
            }
        });
    },


    async _save(data){
        this._loading();
        switch(this.options.saveTo) {
            case "database":
                await this._saveDatabase(data);
                break;
            case "storage":
                await this._saveStorage(data);
                break;
        }
    },

    _saveStorage(data){
        if (!data){
            localStorage.setItem("inputSaver_"+this.options.name+"_"+this._state.name, this._state.dataToSendJSON);
            this._mountRow({id:"inputSaver_"+this.options.name+"_"+this._state.name,data:this._state.dataToSendJSON,name:this._state.name});
        }
        else{
            localStorage.setItem("inputSaver_"+this.options.name+"_"+this._state.name, this._state.dataToSendJSON);
            this._mountRow({id:"inputSaver_"+this.options.name+"_"+this._state.name,data:data,name:this._state.name});
        }
    },

    _saveDatabase(data){
        if (!data){
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: this.options.baseUrl + this.options.urlToSave,
                    type: 'POST',
                    dataType: 'json',
                    data: {data: this._state.dataToSendJSON, widgetName: this.options.name, name: this._state.name},
                    success: (data) => {
                        this._mountRow(data);
                        resolve(data);
                    },
                });
            })
        }
        else{
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: this.options.baseUrl + this.options.urlToSave,
                    type: 'POST',
                    dataType: 'json',
                    data: {data: data, widgetName: this.options.name, name: this._state.name},
                    success: (data) => {
                        this._mountRow(data);
                        resolve(data);
                    },
                });
            })
        }
    },

    _mountRow(data){
        this._state.data.push(data);
        const jsonData = JSON.parse(data.data);
        var row = `
            <div data-id="${data.id}" class="input-saver-row"> 
            <button class="input-saver-lock-button btn btn-info"><i class="fa fa-unlock"></i></button>
            <button class="input-saver-delete-button btn btn-danger"><i class="fa fa-trash"></i></button> 
            <button type="button" data-toggle="tooltip" data-placement="bottom" title="${jsonData.note}" class="input-saver-map alert alert-secondary" role="alert">
            ${data.name}
            </button>
            <br>
            </div>
                    `;

        $(this.element).find(".input-saver-container").append(row);
        $(this.element).find(".input-saver-container").css("display","block");

        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
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
                return this._state.list;

            case "storage":
                this._getListFromStorage();
                return this._state.list;
        }
    },

    _getListFromDatabase(){
        $.ajax({
            url:this.options.baseUrl+this.options.urlToMount,
            type: 'POST',
            dataType: 'json',
            data: {widgetName:this.options.name},
            async:false,
            success: (data) => {
                this._state.list = data;
            },
        })
    },

    _getListFromStorage(){
        var arr = [];

        for (var i = 0; i < localStorage.length; i++) {
            var explodedKey = localStorage.key(i).split("_");
            if (explodedKey[0] === 'inputSaver' && explodedKey[1] === this.options.name) {
                arr.push({id:localStorage.key(i),data:localStorage.getItem(localStorage.key(i)),widget_name:localStorage.key(i).split("_")[1],name:localStorage.key(i).split("_")[2]});
            }
        }
        this._state.list = Object.assign({}, arr);
        
        if(arr.length > 0){
            this._state.list = Object.assign({}, arr);
        }
        else{
            this._state.list = "";
        }
    },

    _mountList(data){
        var row = ``;
        this._state.data.push(...data);
        for (datum in data){
            const jsonData = JSON.parse(data[datum].data);
            if (this.options.name === data[datum].widget_name){
                row += `<div data-id="${data[datum].id}" class="input-saver-row">
                <button class="input-saver-lock-button btn btn-info"><i class="fa fa-${jsonData.isDefault === true ? 'lock' : 'unlock'}"></i></button>
                <button class="input-saver-delete-button btn btn-danger"><i class="fa fa-trash"></i></button> 
                <button type="button" data-toggle="tooltip" data-placement="bottom" title="${jsonData.note}" class="input-saver-map alert alert-secondary" role="alert">
                ${data[datum].name}
                </button>  
                <br>
                </div>`;
            }
            $(function () {
                $('[data-toggle="tooltip"]').tooltip()
            })
        }

        $(this.element).find(".input-saver-container").append(row);

    },

    async _deleteRow(id){
        switch(this.options.saveTo) {
            case "database":
                await this._deleteRowFromDatabase(id);
                break;
            case "storage":
                await this._deleteRowFromStorage(id);
                break;
        }
    },

    _deleteRowFromDatabase(id){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.options.baseUrl + this.options.urlToDelete,
                type: 'POST',
                dataType: 'json',
                data: {id: id},
                success: (data) => {
                    $(".input-saver-row").each(function (index, item) {
                        if ($(item).data("id") == data.id) {
                            $(item).remove();
                            resolve(data);
                        }
                    });
                }
            });
        })
    },

    _deleteRowFromStorage(id){
        localStorage.removeItem(id);
        $(".input-saver-row").each(function (index,item){
            if($(item).data("id") == id){
                $(item).remove();
            }
        });
    },

    _mapDefault(){
        this._state.data.forEach( (dataItem,index) => {
            var data =  JSON.parse(dataItem.data);
            if (data.isDefault === true){
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
                                        if ( $(x).attr("type") !== "radio" && $(x).attr("type") !== "checkbox" && $(x).attr("type") !== "button"){
                                            $(x).prop("value",itemInput.value);
                                        }
                                        else {
                                            $(x).prop("checked",itemInput.value);
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
                                                $(x).prop("selected",y.value);
                                            }
                                        })
                                    });
                                });
                            });
                        });
                    }
                    if (datum === "dataTables"){
                        data[datum].forEach( (itemDataTable,index) => {
                            itemDataTable.columnVisibility.forEach((y,index) => {
                                if (!$.fn.DataTable.isDataTable("#"+itemDataTable.key)){
                                    $("#"+itemDataTable.key).on("init.dt",() => {
                                        $("#"+itemDataTable.key).DataTable().column("th:contains('"+y.columnId+"')").visible(y.value);
                                    })
                                }
                                else{
                                    $("#"+itemDataTable.key).DataTable().column("th:contains('"+y.columnId+"')").visible(y.value);
                                }
                            })
                        });
                    }
                }
                $(document).ready(() => {
                    toastr.success(`Saved option called as ${data.name} applied to page !`,{timeOut: 5000});
                })
            }
        });
        this._trigger( "afterMount", null);
    },

    _mapToDom(id){
        this._state.data.forEach( (dataItem,index) => {
            var data =  JSON.parse(dataItem.data);
            if (dataItem.id == id){
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
                                        if ( $(x).attr("type") !== "radio" && $(x).attr("type") !== "checkbox" && $(x).attr("type") !== "button"){
                                            $(x).prop("value",itemInput.value);
                                        }
                                        else {
                                            $(x).prop("checked",itemInput.value);
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
                                                $(x).prop("selected",y.value);
                                            }
                                        })
                                    });
                                });
                            });
                        });
                    }
                    if (datum === "dataTables"){
                        data[datum].forEach( (itemDataTable,index) => {
                            itemDataTable.columnVisibility.forEach((y,index) => {
                                if (!$.fn.DataTable.isDataTable("#"+itemDataTable.key)){
                                    $("#"+itemDataTable.key).on("init.dt",() => {
                                        $("#"+itemDataTable.key).DataTable().column("th:contains('"+y.columnId+"')").visible(y.value);
                                    })
                                }
                                else{
                                    $("#"+itemDataTable.key).DataTable().column("th:contains('"+y.columnId+"')").visible(y.value);
                                }
                            })
                        });
                    }
                }
                $(document).ready(() => {
                    Swal.fire({
                        icon: 'success',
                        title: `Saved options called as ${data.name} applied to page !`,
                        showConfirmButton: true,
                        timer: 10000
                    })
                })
            }
        });
        this._trigger( "afterMount", null);
    },

    async _updateData(data){
        switch(this.options.saveTo) {
            case "database":
                return await this._updateDataFromDatabase(data);
            case "storage":
                return this._updateDataFromStorage(data);
        }
    },

    _updateDataFromDatabase(data){
        return new Promise((resolve, reject) => {
            $.ajax({
                url:this.options.baseUrl+this.options.urlToUpdate,
                type: 'POST',
                dataType: 'json',
                data: {data:JSON.stringify(data)},
                success:function (data){
                    resolve(data.data);
                },
                error:function (data){
                    reject(data.data);
                }
            });
        })
    },

    _updateDataFromStorage(data){
        return new Promise((resolve, reject) => {
            const state = [];
            for (key in data) {
                localStorage.setItem(data[key].id, JSON.stringify(data[key]));
            }
            for (key in data) {
                state.push({id:data[key].id, data:localStorage.getItem(data[key].id)});
            }
            resolve(state);
        })
    },

    _setDefault(element){
        $('.lds-ring').show();
        this._state.selectedDefault = $(element).parent("div").data("id");
        let newData = this._state.data.map((row,index) => {
            const rowData = JSON.parse(row.data);
            rowData.id = row.id;
            if (row.id == this._state.selectedDefault){
                rowData.isDefault === true ? rowData.isDefault = false : rowData.isDefault = true;
                rowData.isDefault === true ? $(element).find("i").removeAttr("class").attr("class", "fa fa-lock") : $(element).find("i").removeAttr("class").attr("class", "fa fa-unlock");
            }
            else{
                rowData.isDefault = false;
                $(`[data-id='${row.id}'] .input-saver-lock-button`).find("i").removeAttr("class").attr("class", "fa fa-unlock");
            }
            return rowData;
        })
        this._updateData(newData).then((value) => {
            this._state.data = value;
            $('.lds-ring').hide();
            Swal.fire({
                icon: 'success',
                title: `Set as default successfully !`,
                showConfirmButton: true,
                timer: 10000
            })
        });
    },


});
