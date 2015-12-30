/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");
var Check = require("main/check.js");

var model = {
   id:"",
   ChargePersonID:0,
   ChargePersonName:"",
   startTime:"",
   endTime:"",
   cycle:"",
   cycleType:"",
   routId:"",
   status:"",
   remark:""
}

module.exports = Vue.extend({
   inherit:true,
   template:__inline("project.html"),
   data: function () {
      return {
         plans:[],
         plan:model,
         active:"创建"
      }
   },
   methods:{
      render: function () {
         this.getList();
         this.init();
      },
      init: function () {
         var self = this;
         laydate.skin('molv');

         laydate({istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#startTime",choose: function (d) {
            self.plan.startTime = d;
         }});

         laydate({istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#endTime",choose: function (d) {
            self.plan.endTime = d;
         }})

         laydate({istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#startTime_query",choose: function (d) {
         }});

         laydate({istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#endTime_query",choose: function (d) {
         }})
      },
      getList: function () {
         var self = this;
         this.loading = true;
         Service.GetInspectPlanList({}, function (rep) {
            self.plans = rep;
            self.loading = false;
         })
      },
      onDelPlan: function (id) {
         var self = this;
         var r = confirm("是否删除该计划？");
         if(r){
            this.loading = true;
            Service.DeleteInspectPlan(id, function (rep) {
               self.loading = false;
               self.getList();
            })
         }
      },
      addPlan: function () {
         var self = this;
         this.loading = true;
         this.plan.ChargePersonName = $("#ChargePerson")[0].selectedOptions[0].innerText;
         Service.AddInspectPlan(this.plan, function (rep) {
            self.loading = false;
            self._hideModal();
            self.getList();
         })
      },
      onEditPlan: function (p) {
         this.plan = {
            id: p.FId,
            ChargePersonID:p.FChargePersonID,
            ChargePersonName: p.FChargePersonName,
            startTime:filter.tranDate(p.FStartTime),
            endTime:filter.tranDate(p.FEndTime),
            cycle: p.FCycle,
            cycleType:p.FCycleType,
            routId: p.FRoutId,
            status: p.FStatus,
            remark: p.FRemark
         };
         this._showModal();
      },
      updatePlan: function () {
         this.loading = true;
         var self = this;
         Service.UpdateInspectPlan(this.plan, function (rep) {
            self.loading = false;
            self._hideModal();
            self.getList();
         })
      },
      onSubmit: function () {
         if(this.plan.id){
            this.updatePlan();
         }else{
            this.addPlan();
         }
      },
      onAdd: function () {
         this.plan.id ="";
         this.plan.ChargePersonID= -1;
         this.plan.ChargePersonName="";
         this.plan.startTime="";
         this.plan.endTime="";
         this.plan.cycle="";
         this.plan.cycleType="";
         this.plan.routId="";
         this.plan.status= 1;
         this.plan.remark="";
         this._showModal();
      },
      _hideModal: function () {
         $('#projectModal').modal('hide')
      },
      _showModal: function () {
         $('#projectModal').modal('show')
      }
   },
   computed: {
      validation: function () {
         return {
            remark: Check.check(this.plan.remark,"required"),
            routId: Check.check(this.plan.routId,"plusinteger"),
            cycleType: Check.check(this.plan.cycleType,"plusinteger")
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
   }
});