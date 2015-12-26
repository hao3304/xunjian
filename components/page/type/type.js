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
   template:__inline("type.html"),
   data: function () {
      return {
         styles:{
            "max-height":document.documentElement.clientHeight-200 +"px",
            "overflow-y":"auto"
         },
         list:[],
         contentList:[],
         standardList:[], /*巡检标准列表*/
         methodList:[], /*巡检方法列表*/
         selectType:"",
         type:{
            id:"",
            categoryName:"",
            remark:""
         },
         content:{
            Id:"",
            categoryId:"",
            standardId:"",
            method:"",
            contentName:"",
            //contentIndex:"",
            contentMax:"",
            contentMin:"",
            contentType:0,
            contentDefault:""
         }
      }
   },
   methods:{
      render: function () {
         this.getList();
         this.init();
      },
      init: function () {
         var self = this;

      },
      getList: function () {
         var self = this;
         this.loading = true;
         Service.GetInspectCategoryList({}, function (rep) {
            self.list = rep;
            self.loading = false;
         })
      },
      getContentList: function () {
         var self = this;
         this.loading = true;
         Service.getInspectCategoryContentList(this.selectType, function (rep) {
            self.loading = false;
            self.contentList = rep;
         })
      },
      onAdd: function () {
         this.target = model;
         this._showModal();
      },
      onDelType: function (id) {
         var r = confirm("是否删除该类型？");
         if(r){
            var self = this;
            self.loading = true;
            Service.DeleteInspectCategory(id, function (rep) {
               self.loading = false;
               self.getList();
            })
         }

         window.event.stopPropagation();
      },
      onEditType: function (t) {
         this.type.id = t.FId;
         this.type.categoryName = t.FCategoryName;
         this.type.remark= t.FRemark;
         this._showModal();
         window.event.stopPropagation();
      },
      onSubmitType: function () {
         this.loading = true;
         var self = this;

         if(this.type.id){
            Service.UpdateInspectCategory(this.type, function (rep) {
               self.getList();
               self.loading = false;
               self._hideModal();
            })
         }else{
            Service.AddInspectCategory(this.type, function (rep) {
               self.getList();
               self.loading = false;
               self._hideModal();
            })
         }
      },
      getStandardList: function () {
         var self = this;
         Service.GetInspectStandardList(function (rep) {
            var lst = [];
            for(var i=0;i<rep.length;i++){
               lst.push({text:rep[i].FStandardName,value:rep[i].FId})
            }
            self.content.standardId = lst.length>0?lst[0].value:"";
            self.standardList = lst;
         });
      },
      getMethodList: function () {
         var self = this;
         Service.GetInspectMethodList(function (rep) {
            var lst = [];
            for(var i=0;i<rep.length;i++){
               lst.push({text:rep[i].FMethodName,value:rep[i].FId})
            }
            self.content.method = lst.length>0?lst[0].value:"";
            self.methodList = lst;
         });
      },
      onAddType: function () {
         this.type.id = "";
         this.type.categoryName = "";
         this.type.remark= "";
         this._showModal();
      },
      onAddContent: function () {
         this.content.Id = "";
         this.content.categoryId = this.selectType;
         this.content.standardId = this.standardList[0].value;
         this.content.method= this.methodList[0].value;
         this.content.contentName="";
         /*   this.content.contentIndex="";*/
         this.content.contentMax="";
         this.content.contentMin="";
         this.content.contentType= 0;
         this.content.contentDefault="";

         this._showContentModal();
      },
      _hideModal: function () {
         $('#typeModal').modal('hide')
      },
      _showModal: function () {
         $('#typeModal').modal('show')
      },
      _hideContentModal: function () {
         $("#contentModal").modal("hide");
      },
      _showContentModal: function () {
         $("#contentModal").modal("show");
      },
      onSelectType: function (id) {
         this.selectType = id;
         this.getContentList();
      },
      onSubmitContent: function () {
         var self = this;
         this.loading = true;
         if(!this.content.Id){
            Service.addInspectCategoryContent(this.content, function (rep) {
               self.loading = false;
               self._hideContentModal();
               self.getContentList();
            })
         }else{
            Service.updateInspectCategoryContent(this.content, function (rep) {
               self.loading = false;
               self._hideContentModal();
               self.getContentList();
            })
         }

      },
      onDelContent: function (id) {
         var r = confirm("是否删除该内容？");
         if(r){
            var self = this;
            self.loading = true;
            Service.deleteInspectCategoryContent(id, function (rep) {
               self.loading = false;
               self.getContentList();
            })
         }
      },
      onEditContent: function (c) {
         this.content.Id = c.FId;
         this.content.categoryId = c.FCategoryId;
         this.content.standardId = c.FStandardId;
         this.content.method= c.FMethodId;
         this.content.contentName= c.FContentName;
         //this.content.contentIndex= c.FContentName;
         this.content.contentMax= c.FContentMax;
         this.content.contentMin= c.FContentMin;
         this.content.contentType= c.FContentType;
         this.content.contentDefault= c.FContentDefault;

         this._showContentModal();
      }
   },
   watch:{
      "content.contentType": function (v) {
         if(v==0){
            this.content.contentMax= "";
            this.content.contentMin= "";
         }
      }
   },
   ready: function () {
      this.render();
      this.getStandardList();
      this.getMethodList();
   }
});

