/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");

var model = {
   id:"",
   objectname:"",
   fullName:"",
   majorId:0,
   inspectCycle:"",
   cycleType:"",
   categoryId:"",
   inspectStatus:"",
   remark:""
};

module.exports = Vue.extend({
   inherit:true,
   template:__inline("target.html"),
   data: function () {
      return {
         styles:{
            "max-height":document.documentElement.clientHeight-200 +"px",
            "overflow-y":"auto"
         },
         list:[],
         filterList:[],
         selectType:"",
         target:model,
         typeList:[]
      }
   },
   methods:{
      render: function () {
         this.getList();
         this.init();
         this.getTypeList();
      },
      init: function () {
         var self = this;

      },
      getList: function () {
         var self = this;
         this.loading = true;
         Service.getInspectObjectList({}, function (rep) {
            self.list = rep;
            self.filterList = rep;
            self.loading = false;
         })
      },
      getTypeList: function () {
         var self = this;
         Service.GetInspectCategoryList({}, function (rep) {
            self.typeList = rep;
         })
      },
      onDelTarget: function (id) {
         var self = this;
         var r = confirm("是否删除该对象？");
         if(r){
            this.loading = true;
            Service.deleteInspectObject(id, function (rep) {
               self.loading = false;
               self.getList();
            })
         }
      },
      onSelectType: function (id) {
         this.selectType = id;
      },
      clearSelect: function () {
         this.selectType = "";
      },
      addTarget: function () {
         var self = this;
         this.loading = true;
         this.plan = model;
         Service.AddInspectObject(this.plan, function (rep) {
            self.loading = false;
            self._hideModal();
            self.getList();
         })
      },
      onEditTarget: function (p) {
         this.target = {
            id: p.FId,
            objectname: p.FObjectName,
            fullName: p.FObjectFullName,
            majorId:0,
            inspectCycle: p.FInspectCycle,
            cycleType:p.FCycleType,
            categoryId: p.FCategoryId,
            inspectStatus: p.FInspectstatus,
            remark: p.FRemark
         };
         this._showModal();
      },
      updateTarget: function () {
         this.loading = true;
         var self = this;
         Service.UpdateInspectObject(this.target, function () {
            self.loading = false;
            self._hideModal();
            self.getList();
         })
      },
      onSubmit: function () {
         if(this.target.id){
            this.updateTarget();
         }else{
            this.addTarget();
         }
      },
      onAdd: function () {
         this.target.id  = "";
         this.target.objectname  = "";
         this.target.fullName  = "";
         this.target.majorId  = 0;
         this.target.inspectCycle  = "";
         this.target.cycleType  = "";
         this.target.categoryId  = "";
         this.target.inspectStatus  = "";
         this.target.remark  = "";
         this._showModal();
      },
      _hideModal: function () {
         $('#targetModal').modal('hide')
      },
      _showModal: function () {
         $('#targetModal').modal('show')
      }
   },
   watch:{
     "selectType": function (v) {
        if(v){
           var lst =[];
           for(var i=0;i<this.list.length;i++){
               if(this.list[i].FCategoryId == v){
                  lst.push(this.list[i]);
               }
           }
           this.filterList = lst;
        }

     } 
   },
   ready: function () {
      this.render();
   }
});
