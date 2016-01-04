/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");
var filter = require("component/filter/filter.js");
var Service = require("main/service.js");
var Check = require("main/check.js");

var model = {
   id:"",
   routid:"",
   routdesc:"",
   planid:"",
   chargepersonid:"",
   chargepersonname:"",
   inspectpersonid:0,
   inspectpersonname:"测试人员",
   createtype:1,
   remark:"",
   beginTime:"",
   endTime:""
};

module.exports = Vue.extend({
   inherit:true,
   template:__inline("task.html"),
   data: function () {
      return {
         tasks:[],
         task:model,
         query:{
            state:-1,
            beginTime:"",
            endTime:""
         }
      }
   },
   methods:{
      init: function () {
         var self = this;
         laydate({istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#startTime",choose: function (d) {
            self.task.beginTime = d;
         }});

         laydate({istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#endTime",choose: function (d) {
            self.task.endTime = d;
         }})

         laydate({istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#begin_query",choose: function (d) {
            self.query.beginTime = d;
         }});

         laydate({istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#end_query",choose: function (d) {
            self.query.endTime = d;
         }})
      },
      render:function(){
         this.getList();
      },
      getList: function () {
         var self = this;
         self.loading = true;
         Service.getPlanTaskList({}, function (rep) {
            self.loading = false;
            self.tasks  = rep;
         })
      },
      onDelTask: function (id) {
         var self = this;
         var r = confirm("是否删除该任务？");
         if(r){
            this.loading = true;
            Service.deletePlanTask(id, function (rep) {
               self.loading = false;
               self.getList();
            })
         }
      },
      addTask: function () {
         var self = this;
         this.loading = true;

         this.task.chargepersonname = $($("#chargepersonname")[0].selectedOptions).html();
         this.task.routdesc = $($("#routdesc")[0].selectedOptions).html();

         Service.addPlanTask(this.task, function (rep) {
            self.loading = false;
            self._hideModal();
            self.getList();
         })
      },
      onEditTask: function (p) {
         this.task = {
            id: p.Fid,
            routid: p.FRoutId,
            routdesc:p.FRoutDesc,
            planid: p.FPlanId,
            chargepersonid:"",
            chargepersonname: p.FChargePersonName,
            inspectpersonid:0,
            inspectpersonname: p.FInspectPersonName,
            createtype:1,
            remark: p.FRemark,
            beginTime: p.FBeginTime,
            endTime: p.FEndTime
         };
         this._showModal();
      },
      updateTask: function () {
         this.loading = true;
         var self = this;
         Service.updatePlanTask(this.task, function (rep) {
            self.loading = false;
            self._hideModal();
            self.getList();
         })
      },
      onSubmit: function () {
         if(this.task.id){
            this.updateTask();
         }else{
            this.addTask();
         }
      },
      onAdd: function () {
         this.task = {
            id:"",
            routid:"",
            routdesc:"",
            planid:"",
            chargepersonid:"",
            chargepersonname:"",
            inspectpersonid:0,
            inspectpersonname:"测试人员",
            createtype:1,
            remark:"",
            beginTime:"",
            endTime:""
         };
         this._showModal();
      },
      onReset: function () {
         this.query = {
            state:-1,
            beginTime:"",
            endTime:""
         };
         $("#begin_query").val("");
         $("#end_query").val("");
         this.render();
      },
      onQuery: function () {
         var param = {
            state:this.query.state>=0?this.query.state:undefined,
            beginTime:this.query.beginTime?this.query.beginTime:undefined,
            endTime:this.query.endTime?this.query.endTime:undefined
         };
         var self = this;
         self.loading = true;
         Service.getPlanTaskList(param, function (rep) {
            self.loading = false;
            self.tasks  = rep;
         })
      },
      _hideModal: function () {
         $('#taskModal').modal('hide')
      },
      _showModal: function () {
         $('#taskModal').modal('show')
      }
   },
   computed: {
      validation: function () {
         return {
            routid: Check.check(this.task.routid,"plusinteger"),
            beginTime: Check.check(this.task.beginTime,"datetime"),
            endTime: Check.check(this.task.endTime,"datetime"),
            chargepersonid: Check.check(this.task.chargepersonid,"plusinteger")
         }
      },
      isValid: function () {
         var validation = this.validation;
         return Object.keys(validation).every(function (key) {
            return validation[key]
         })
      }
   },
   ready: function () {
      this.render();
      this.init();
   }
});