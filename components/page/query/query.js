/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");
var Service = require("main/service.js");
var filter = require("filter/filter.js");


module.exports = Vue.extend({
   inherit:true,
   template:__inline("query.html"),
   data: function () {
      return {
         styles:{
            "max-height":document.documentElement.clientHeight-200 +"px",
            "overflow-y":"auto"
         },
         type:"route",
         query:{
            objectId:"",
            beginTime:"",
            endTime:"",
            checkStatus:"",
            state:""
         },
         list:[],
         objectType:"",
         pics:[]
      }
   },
   methods:{
      render: function () {
         this.GetRoutType();
      },
      init: function () {
         var self = this;
         laydate.skin('molv');

         var start = {istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#beginTime",choose: function (d) {
            self.query.beginTime = d;
            end.min = d;
            end.start = d
         }};
         var end = {istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#endTime",choose: function (d) {
            self.query.endTime = d;
            start.max = d;
         }};
         laydate(start);

         laydate(end)
      },
      getLocationType: function () {
         var self = this;
         Service.GetLocationTypeTree({}, function (rep) {
            self.renderTree(rep);
         })
      },
      GetCategoryType: function () {
         var self = this;
         Service.GetCategoryTypeTree({}, function (rep) {
            self.renderTree(rep);
         })
      },
      GetRoutType: function () {
         var self = this;
         Service.GetRoutTypeTree({}, function (rep) {
            self.renderTree(rep);
         })
      },
      renderTree: function (data) {
         data[0].open = true;
         $.fn.zTree.init($("#tree"), {
            data: {
               simpleData: {
                  enable: true
               }
            },
            callback:{
               onClick: this.getData
            }
         }, data);
      },
      GetObjectDataList: function () {
         var self = this;
         self.loading = true;

         var param = {
            beginTime:this.query.beginTime,
            endTime:this.query.endTime,
            checkStatus:this.query.checkStatus,
            state:this.query.state,
            objectId:this.query.objectId
         }

         Service.GetObjectDataList(this.tranParam(param), function (rep) {
            self.loading = false;
            self.list = rep;
         })
      },
      GetLocationObjectDataList: function () {
         var self = this;
         self.loading = true;

         var param = {
            beginTime:this.query.beginTime,
            endTime:this.query.endTime,
            checkStatus:this.query.checkStatus,
            state:this.query.state,
            locationId:this.query.objectId
         }

         Service.GetLocationObjectDataList(this.tranParam(param), function (rep) {
            self.loading = false;
            self.list = rep;
         })
      },
      GetCategoryObjectDataList: function () {
         var self = this;
         self.loading = true;
         var param = {
            beginTime:this.query.beginTime,
            endTime:this.query.endTime,
            checkStatus:this.query.checkStatus,
            state:this.query.state,
            categoryId:this.query.objectId
         }
         Service.GetCategoryObjectDataList(this.tranParam(param), function (rep) {
            self.loading = false;
            self.list = rep;
         })
      },
      GetRoutObjectDataList: function () {
         var self = this;
         self.loading = true;
         var param = {
            beginTime:this.query.beginTime?this.query.beginTime:undefined,
            endTime:this.query.endTime?this.query.endTime:undefined,
            checkStatus:this.query.checkStatus?this.query.checkStatus:undefined,
            state:this.query.state?this.query.state:undefined,
            routId:this.query.objectId?this.query.objectId:undefined
         }
         Service.GetRoutObjectDataList(param, function (rep) {
            self.loading = false;
            self.list = rep;
         })
      },
      tranParam: function (param) {

         var n = {};
         for(var i in param){
            if(param[i]){
               n[i] = param[i];
            }
         }
         return n;
      },
      GetSectionObjectDataList: function () {

         var self = this;
         self.loading = true;
         var param = {
            beginTime:this.query.beginTime?this.query.beginTime:undefined,
            endTime:this.query.endTime?this.query.endTime:undefined,
            checkStatus:this.query.checkStatus?this.query.checkStatus:undefined,
            state:this.query.state?this.query.state:undefined,
            sectionId:this.query.objectId?this.query.objectId:undefined
         }

         Service.GetSectionObjectDataList(param, function (rep) {
            self.loading = false;
            self.list = rep;
         })
      },
      getData: function (e,type,node) {
         this.query.objectId = node.objectId;
         this.objectType = node.objectType;
         this.onQuery();
      },
      onQuery: function () {

         switch (this.objectType){
            case 5:{
               this.GetObjectDataList();
               break;
            }
            case 4:{
               this.GetLocationObjectDataList();
               break;
            }
            case 1:{
               this.GetCategoryObjectDataList();
               break;
            }
            case 2:{
               this.GetRoutObjectDataList();
               break;
            }
            case 3:{
               this.GetSectionObjectDataList();
               break;
            }
         }
      },
      onReset: function () {
         this.query.beginTime = "";
         this.query.endTime = "";
         this.query.checkStatus = "";
         this.query.state = "";
         this.onQuery();
      },
      getPic: function (v) {
         var self = this;
         this.loading = true;
         Service.getInspectObjectContentResultFileList(v, function (rep) {
            for(var i=0;i<rep.length;i++){
               rep[i].FFileRelativeAddress =  "http://221.12.173.124:8080/inspectservice/"+rep[i].FFileRelativeAddress;
            }
            self.pics = rep;
            self.loading = false;
            self.showModal();
         })
      },
      showModal: function () {
         $('#queryModal').modal('show');
      },
      hideModal: function () {
         $('#queryModal').modal('hide');
      }
   },
   watch:{
      "type": function (v) {
         switch (v){
            case "position":{
               return this.getLocationType();
               break;
            }
            case "type":{
               return this.GetCategoryType();
               break;
            }
            case "route":{
               return this.GetRoutType();
               break;
            }
         }
      }
   },
   ready: function () {
      this.render();
      this.init();
   }
});