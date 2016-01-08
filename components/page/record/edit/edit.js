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
   template:__inline("edit.html"),
   data: function () {
      return {
         contents:[],
         detail:{
            RoutName:"",
            Status:"",/*状态，0，正常，1异常，2良好*/
            RoutId:"",
            RecordDesc:"",
            InspectDate:"", /*检查日期*/
            InspectPerson:"", /*检查人*/
            ChargePersonId:"",/*负责人*/
            StartTime:"",
            FinishiTime:"",
            ExcuteStatus:1, /*执行状态*/
            InputType:0, /*web输入*/
            StationId:"", /*水电站ID*/
            Remark:""
         },
         pics:[]
      }
   },
   methods:{
      render:function(id){
         this.getDetail(id);
      },
      getDetail: function (id) {
         var self = this;
         this.loading = true;
         Service.getRecordById(id, function (rep) {

            self.detail.Id = rep.FId;
            self.detail.RoutName = rep.FRoutName;
            self.detail.Status = rep.FStatus;
            self.detail.RoutId = rep.FRoutId;
            self.detail.RecordDesc= rep.FRecordDesc;
            self.detail.InspectDate = filter.tranDate(rep.FInspectDate);/*检查日期*/
            self.detail.InspectPerson = rep.FInspectPerson;/*检查人*/
            self.detail.ChargePersonId = rep.FChargePersonId;/*检查人*/
            self.detail.StartTime = filter.tranDate(rep.FStartTime);
            self.detail.FinishiTime = filter.tranDate(rep.FFinishiTime);
            self.detail.StationId = rep.FStationId;
            self.detail.Remark = rep.FRemark;

            self.contents = self.tranData(rep);
            self.loading = false;
         })
      },
      tranData: function (result) {
         var data  = result.recordResultContentList;
         if(data.length > 1){
            /*合并区段*/
            var target = data[0];
            data[0].rows = 1;
            for(var i = 1;i<data.length;i++){
               if(target.sectionId == data[i].sectionId){
                  target.rows +=1;
               }else{
                  target = data[i];
                  target.rows = 1;
               }
            }

            /*合并对象*/
            var t = data[0];
            data[0].objrows = 1;
            for(var i = 1;i<data.length;i++){
               if(t.FObjectId == data[i].FObjectId){
                  t.objrows += 1;
               }else{
                  t = data[i];
                  t.objrows = 1;
               }
            }

            var dl = result.recordSecDetailList;

            for(var i = 0;i<data.length;i++){
               data[i].CheckResult = "未现场检查";
               for(var d= 0;d < dl.length;d++){
                  if(dl[d].FSectionId == data[i].sectionId){
                     var beginstr = filter.tranDate(dl[d].FBeginTime);
                     if(dl[d].FBeginInputType == 0){
                        beginstr += "(手动)";
                     }
                     var endstr = filter.tranDate(dl[d].FEndTime);
                     if(dl[d].FEndInputType == 0){
                        endstr += "(手动)";
                     }
                     data[i].CheckResult = beginstr +"<br/>至<br/>" + endstr;
                  }
               }
            }

         }

         return data;
      },
      onCheck: function (id) {
         var r = confirm("确定审核通过该记录？");
         if(r){
            var self = this;
            this.loading = true;
            Service.checkRecord(id,1, function (rep) {
               self.loading = false;
               self.render(id);
            })
         }
      },
      onRemoveCheck: function (id) {
         var r = confirm("确定撤销该记录审核？");
         if(r){
            var self = this;
            this.loading = true;
            Service.checkRecord(id,0, function (rep) {
               self.loading = false;
               self.render(id);
            })
         }
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
         $('#detailModal').modal('show');
      },
      hideModal: function () {
         $('#detailModal').modal('hide');
      },
      onUpdate: function () {
         Service.updateInsRecord(JSON.stringify({recordstr:this.detail,ObjectContentResultListstr:this.contents}))
      }
   },
   ready: function () {
      var self = this;
      self.render(this.getId());
      this.$on("edit", function (p) {
         self.render(p.id);
      })
   }
});