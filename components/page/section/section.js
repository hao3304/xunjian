/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");




module.exports = Vue.extend({
   inherit:true,
   template:__inline("section.html"),
   data: function () {
      return {
         styles:{
            "max-height":document.documentElement.clientHeight-200 +"px",
            "overflow-y":"auto"
         },
         selectSection:"",
         objList:[],
         sectionObjList:[],
         list:[],
         section:{
            id:"",
            radioA:"",
            radioB:"",
            description:"",
            remark:"",
            fullName:""
         }
      }
   },
   methods:{
      render: function () {
         this.getList();
      },
      getList: function () {
         var self = this;
         this.loading = true;
         Service.GetInspectSectionList({}, function (rep) {
            self.list = rep;
            self.loading = false;
         })
      },
      getObjList: function () {
         var self = this;
         Service.getInspectObjectList({}, function (rep) {
            self.objList = rep;
         });
      },
      getSectionObjList: function () {
        var self = this;
         this.loading = true;
         Service.GetInspectSectionObjectList(this.selectSection, function (rep) {
            self.loading = false;
            self.sectionObjList = rep;
         })
      },
      onAddObj: function () {
         this.getObjList();
         this._showObjModal();
      },
      _hasCheck: function (id) {
         var checked = false;
         var lst = this.sectionObjList;
         for(var i=0;i<lst.length;i++){
            if(lst[i].FId == id){
               checked = true;
            }
         }
         return checked;
      },

      onDelSection: function (id) {
         var self = this;
         this.loading = true;
         var r = confirm("ÊÇ·ñÉ¾³ý¸ÃÇø¶Î£¿");
         if(r){
            Service.DeleteInspectSection(id, function (rep) {
               self.loading = false;
               self.render();
            })
         }
      },
      onCheckAll: function (e) {
         var inputs = $("#objModal tbody").find("input[type='checkbox']");
         for(var i=0;i<inputs.length;i++){
            inputs[i].checked = e.target.checked;
         }
      },
      onEditSection: function (o) {

         this.section.id = o.FId;
         this.section.radioA = o.FRadioA;
         this.section.radioB = o.FRadioB;
         this.section.description = o.FDescription;
         this.section.remark = o.FRemark;
         this.section.fullName = o.FSectionFullName;
         this._showModal();
      },
      onAddSection: function () {
         this.section.id="";
         this.section.radioA="";
         this.section.radioB="";
         this.section.description="";
         this.section.remark="";
         this.section.fullName="";

        this._showModal();
      },
      onSubmit: function () {
         this.loading = true;
         var self = this;
         if(this.section.id){
            Service.UpdateInspectSection(this.section, function (rep) {
               self.loading = false;
               self._hideModal();
               self.render();
            })
         }else{
            Service.AddInspectSection(this.section, function (rep) {
               self.loading = false;
               self._hideModal();
               self.render();
            })
         }


      },
      onSubmitObj: function () {
         var inputs = $("#objModal tbody").find("input:checked"),lst = [];
         inputs.each(function (index,ele) {
            lst.push($(ele).data("value"));
         });
         var self = this;
         Service.updateSectionObjectList(JSON.stringify({
            sectionId:String(this.selectSection),
            objectList:lst
         }), function (rep) {
            self._hideObjModal();
            self.getSectionObjList();
         })

      },
      onSelectSection: function (id) {
         this.selectSection = id;
         this.getSectionObjList();
      },
      _hideModal: function () {
         $('#sectionModal').modal('hide')
      },
      _showModal: function () {
         $('#sectionModal').modal('show')
      },
      _hideObjModal: function () {
         $("#objModal").modal("hide");
      },
      _showObjModal: function () {
         $("#objModal").modal("show");
      }
   },
   ready: function () {
      this.render();
   }
});