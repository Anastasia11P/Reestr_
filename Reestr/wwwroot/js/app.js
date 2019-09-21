var store;
Ext.Loader.loadScript('//cdn.rawgit.com/Arhia/Ext.ux.grid.Printer/master/ux/grid/Printer.js');

function createForm3(func) {// Создание формы 3

    var window = Ext.create('Ext.window.Window', {
        title: 'Анкета гражданина',
        id: 'formId3',
        modal: true,
        width: 300,
        height: 300,
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Фамилия',
            name: 'lastname',
            id: 'lastNameIdF3',
            labelAlign: 'top',
            cls: 'field-margin',
            flex: 1
        }, {
            xtype: 'textfield',
            fieldLabel: 'Имя',
            name: 'firstName',
            id: 'firstNameIdF3',
            labelAlign: 'top',
            cls: 'field-margin',
            flex: 1
        }, {
            xtype: 'textfield',
            fieldLabel: 'Отчество',
            id: 'patronymicIdF3',
            name: 'patronymic',
            labelAlign: 'top',
            cls: 'field-margin',
            flex: 1
        }, {
            xtype: 'textfield',
            fieldLabel: 'Дата рождения',
            name: 'dateOfBirth',
            id: 'dateOfBirthIdF3',
            labelAlign: 'top',
            cls: 'field-margin',
            flex: 1
        }, {
            xtype: 'button',
            text: 'Выход',
            cls: 'field-margin',
            handler: function () {//Выход
                func();

            }
        }]
    });
    window.show();
}
function addUser() {//Запрос на добавление
    //Если хотя бы одно не пустое
    if ((Ext.getCmp('firstNameIdF3').getValue() != '') || (Ext.getCmp('lastNameIdF3').getValue() != '') || (Ext.getCmp('patronymicIdF3').getValue() != '') || (Ext.getCmp('dateOfBirthIdF3').getValue() != '')) {

        Ext.Msg.confirm('Добавление', 'Продолжить ?', function (btn) {
            if (btn === 'yes') {//POST 
                Ext.Ajax.request({
                    url: "/api/citizens/Add",
                    method: 'POST',
                    jsonData:
                    {
                        FirstName: Ext.getCmp('firstNameIdF3').getValue(), LastName: Ext.getCmp('lastNameIdF3').getValue(),
                        Patronymic: Ext.getCmp('patronymicIdF3').getValue(), DateOfBirth: Ext.Date.format(Ext.Date.parse(Ext.getCmp('dateOfBirthIdF3').getValue(), 'd-m-Y'), 'm-d-Y')
                    },
                    success: function (response, options) {
                        updateTable();
                        Ext.getCmp('formId3').close();
                    },
                    failure: function (response, options) {
                        alert("Bad request: " + response.statusText);
                    }
                });
            }
            else {
                Ext.getCmp('formId3').close();
            }
        });
    } else {
        Ext.getCmp('formId3').close();
    }
}
function updateUser() {//Запрос на изменение
    //Если хотя бы одно поле изменено 
    var selectedRecord = Ext.getCmp('gridId').getView().getSelectionModel().getSelection()[0];
    var temp = Ext.Date.format(selectedRecord.get('dateOfBirth'), 'd-m-Y');
    if ((Ext.getCmp('firstNameIdF3').getValue() != selectedRecord.get('firstName')) || (Ext.getCmp('lastNameIdF3').getValue() != selectedRecord.get('lastName')) || (Ext.getCmp('patronymicIdF3').getValue() != selectedRecord.get('patronymic')) || (Ext.getCmp('dateOfBirthIdF3').getValue() != temp)) {
        Ext.Msg.confirm('Обновление', 'Продолжить ?', function (btn) {
            if (btn === 'yes') {// запрос на обновление
                Ext.Ajax.request({
                    url: "/api/citizens/Update",
                    method: 'Put',
                    jsonData: {
                        Id: Ext.getCmp('gridId').getView().getSelectionModel().getSelection()[0].get('id'),
                        FirstName: Ext.getCmp('firstNameIdF3').getValue(), LastName: Ext.getCmp('lastNameIdF3').getValue(),
                        Patronymic: Ext.getCmp('patronymicIdF3').getValue(), DateOfBirth: Ext.Date.format(Ext.Date.parse(Ext.getCmp('dateOfBirthIdF3').getValue(), 'd-m-Y'), 'm-d-Y')
                    },
                    success: function (response, options) {
                        updateTable();
                        Ext.getCmp('formId3').close();
                    },
                    failure: function (response, options) {
                        alert("Bad request: " + response.statusText);
                    }
                });
            }
            else {
                Ext.getCmp('formId3').close();
            }
        });
    } else {
        Ext.getCmp('formId3').close();
    }
}
function updateTable() {
    Ext.Ajax.request({
        url: "/api/citizens/search",
        method: 'Get',
        params: {
            firstName: Ext.getCmp('firstNameIdF1').getValue(), patronymic: Ext.getCmp('patronymicIdF1').getValue(), lastName: Ext.getCmp('lastNameIdF1').getValue(),
            startDate: Ext.getCmp('startDateIdF1').getValue(), endDate: Ext.getCmp('endDateIdF1').getValue()
        },
        success: function (response, options) {
            var temp = JSON.parse(response.responseText);
            store = new Ext.data.ArrayStore({// хранилище
                model: User,
                data: temp.map(it => Object.values(it))
            });
            Ext.getCmp('gridId').reconfigure(store);
            Ext.getCmp('gridId').getView().refresh()
        },
        failure: function (response, options) {
            alert("Bad request: " + response.statusText);
        }
    });
}

function createForm2() {// создание формы 2
    Ext.Ajax.request({//Запрос на поиск
        
        url: "/api/citizens/Search",
        method: 'Get',
        params: {
            firstName: Ext.getCmp('firstNameIdF1').getValue(), patronymic: Ext.getCmp('patronymicIdF1').getValue(), lastName: Ext.getCmp('lastNameIdF1').getValue(),
            startDate: Ext.getCmp('startDateIdF1').getValue(), endDate: Ext.getCmp('endDateIdF1').getValue()
        },        
        success: function (response, options) {
            var temp = JSON.parse(response.responseText);
            store = new Ext.data.ArrayStore({// хранилище
                model: User,                
                data: temp.map(it => Object.values(it))
            });

            var window = Ext.create('Ext.window.Window', {
                title: 'Список анкет',
                width: 425,
                resizable: false,
                modal: true,
                id: 'formId2',
                height: 400,

                items: [
                    listView = Ext.create('Ext.grid.Panel', { // таблица форма 2
                        width: 420,
                        height: 395,
                        cls: 'field-margin',
                        id: 'gridId',
                        collapsible: true,
                        title: 'Реестр граждан',
                        renderTo: Ext.getBody(),

                        store: store,
                        multiSelect: false,
                        viewConfig: {
                            emptyText: 'No images to display'
                        },

                        columns: [{
                            text: 'Имя',
                            flex: 35,
                            dataIndex: 'firstName'
                        }, {
                            text: 'Отчество',
                            flex: 35,
                            dataIndex: 'patronymic'
                        }, {
                            text: 'Фамилия',
                            flex: 35,
                            dataIndex: 'lastName'
                        }, {
                            text: 'Дата рождения',
                            flex: 35,
                            dataIndex: 'dateOfBirth',
                            xtype: 'datecolumn',
                            renderer: Ext.util.Format.dateRenderer('d-m-Y'),
                            format: 'd-m-Y'
                        }],
                        tbar: [{
                            xtype: 'button',
                            text: 'Добавить',
                            cls: 'field-margin',
                            handler: function () {//Добавить
                                createForm3(addUser);
                            }
                        }, {
                            xtype: 'button',
                            text: 'Изменить',
                            cls: 'field-margin',
                            handler: function () {//Изменить
                                if (Ext.getCmp('gridId').getView().getSelectionModel().hasSelection()) {
                                    var selectedRecord = Ext.getCmp('gridId').getView().getSelectionModel().getSelection()[0];
                                    createForm3(updateUser);
                                    Ext.getCmp('lastNameIdF3').setValue(selectedRecord.get('lastName'));
                                    Ext.getCmp('firstNameIdF3').setValue(selectedRecord.get('firstName'));
                                    Ext.getCmp('patronymicIdF3').setValue(selectedRecord.get('patronymic'));
                                    var temp = Ext.Date.format(selectedRecord.get('dateOfBirth'), 'd-m-Y');
                                    Ext.getCmp('dateOfBirthIdF3').setValue(temp);
                                }
                            }
                        }, {
                            xtype: 'button',
                            text: 'Удалить',
                            cls: 'field-margin',
                            handler: function () {//Удалить
                                if (Ext.getCmp('gridId').getView().getSelectionModel().hasSelection()) {
                                    Ext.Msg.confirm('Удаление', 'Продолжить?', function (btn) {
                                        if (btn === 'yes') {// Запрос на обновление
                                            Ext.Ajax.request({
                                                url: "/api/citizens/delete",
                                                method: 'Delete',
                                                jsonData: {
                                                    Id: Ext.getCmp('gridId').getView().getSelectionModel().getSelection()[0].get('id'),
                                                    FirstName: Ext.getCmp('gridId').getView().getSelectionModel().getSelection()[0].get('firstName'),
                                                    LastName: Ext.getCmp('gridId').getView().getSelectionModel().getSelection()[0].get('lastName'),
                                                    Patronymic: Ext.getCmp('gridId').getView().getSelectionModel().getSelection()[0].get('patronymic'),
                                                    DateOfBirth: Ext.getCmp('gridId').getView().getSelectionModel().getSelection()[0].get('dateOfBirth')
                                                },
                                                success: function (response, options) {
                                                    updateTable();
                                                },
                                                failure: function (response, options) {
                                                    alert("Bad request: " + response.statusText);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }, {
                            xtype: 'button',
                            text: 'Печатать',
                            handler: function () {
                                Ext.ux.grid.Printer.printAutomatically = true;
                                Ext.ux.grid.Printer.closeAutomaticallyAfterPrint = true; 
                                Ext.ux.grid.Printer.closeLinkText = '';
                                Ext.ux.grid.Printer.printLinkText = '';
                                Ext.ux.grid.Printer.print(Ext.getCmp('gridId'));
                            }
                        }, {
                            xtype: 'button',
                            text: 'Выход',
                            cls: 'field-margin',
                            handler: function () {
                                Ext.getCmp('formId2').close();
                            }
                        }
                        ]
                    })]

            });
            window.show();
        },
        failure: function (response, options) {
            alert("Bad request: " + response.statusText);
        }
    });
}
Ext.onReady(function () {//Форма 1
    Ext.define('User', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'id', type: 'string' },
            { name: 'lastName', type: 'string' },
            { name: 'firstName', type: 'string' },
            { name: 'patronymic', type: 'string' },
            { name: 'dateOfBirth', type: 'date' }
        ]
    });

    var window = Ext.create('Ext.window.Window', {
        title: 'Условия поиска',
        width: 300,
        height: 300,
        id: 'formId1',
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        renderTo: Ext.getBody(),
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Фамилия',
            name: 'lastName',
            labelAlign: 'top',
            id: 'lastNameIdF1',
            cls: 'field-margin',
            flex: 1
        }, {
            xtype: 'textfield',
            fieldLabel: 'Имя',
            name: 'firstName',
            labelAlign: 'top',
            id: 'firstNameIdF1',
            cls: 'field-margin',
            flex: 1
        }, {
            xtype: 'textfield',
            fieldLabel: 'Отчество',
            name: 'patronymic',
            labelAlign: 'top',
            id: 'patronymicIdF1',
            cls: 'field-margin',
            flex: 1
        }, {
            xtype: 'textfield',
            fieldLabel: 'Начало периода даты рождения',
            name: 'startDate',
            labelAlign: 'top',
            id: 'startDateIdF1',
            cls: 'field-margin',
            flex: 1
        }, {
            xtype: 'textfield',
            fieldLabel: 'Конец периода даты рождения',
            name: 'endDate',
            id: 'endDateIdF1',
            labelAlign: 'top',
            cls: 'field-margin',
            flex: 1
        }],

        // кнопки формы
        buttons: [{
            text: 'Поиск',
            handler: function () {
                createForm2();
            }
        }, {
            text: 'Выход',
            handler: function () {
                Ext.getCmp('formId1').close();
            }
        }],
    });
    window.show();

});

