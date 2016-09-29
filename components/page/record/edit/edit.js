/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");
var Router = require('component_modules/director').Router;

module.exports = Vue.extend({
   inherit:true,
   template:__inline("edit.html"),
   data: function () {
      return {
         contents:[],
         detail:{
            RoutName:"",
            Status:"",/*״̬��0��������1�쳣��2����*/
            RoutId:"",
            RecordDesc:"",
            InspectDate:"", /*�������*/
            InspectPerson:"", /*�����*/
            ChargePersonId:"",/*������*/
            StartTime:"",
            FinishiTime:"",
            ExcuteStatus:1, /*ִ��״̬*/
            FInputType:0, /*web����*/
            StationId:"", /*ˮ��վID*/
            Remark:"",
            CheckPersonName:"",
            inputPersonName:"",
            writePersonName:"",
            FWriteTime:""

         },
         pics:[],
         showMore:false
      }
   },
   methods:{
      render:function(id){
         this.getDetail(id);
      },
      onShowMore: function () {
        this.showMore = true;
      },
      getDetail: function (id) {
         var self = this;
         this.loading = true;
         this.showMore = false;
         Service.getRecordById(id, function (rep) {

            self.detail.Id = rep.FId;
            self.detail.RoutName = rep.FRoutName;
            self.detail.Status = rep.FStatus;
            self.detail.RoutId = rep.FRoutId;
            self.detail.InspectDate = filter.tranDate(rep.FInspectDate);/*�������*/
            self.detail.InspectPerson = rep.FInspectPerson;/*�����*/
            self.detail.ChargePersonId = rep.FChargePersonId;/*�����*/
            self.detail.StartTime = filter.tranDate(rep.FStartTime);
            self.detail.FinishiTime = filter.tranDate(rep.FFinishiTime);
            self.detail.StationId = rep.FStationId;
            self.detail.RecordDesc = rep.FRecordDesc;

            self.detail.CheckPersonName = rep.checkPersonName;
            self.detail.inputPersonName = rep.inputPersonName;
            self.detail.FInputType = rep.FInputType ==1?"�ֻ��ϴ�":"��ҳ���";
            self.detail.writePersonName = rep.writePersonName;
            self.detail.FWriteTime = filter.tranDate(rep.FWriteTime);

            self.contents = self.tranData(rep);
            self.loading = false;
         })
      },
      tranData: function (result) {
         var data  = result.recordResultContentList;
         if(data.length > 1){
            /*�ϲ�����*/
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

            /*�ϲ�����*/
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
               data[i].CheckResult = "δ��¼";
               data[i].FileList = [];
               for(var d= 0;d < dl.length;d++){
                  if(dl[d].FSectionId == data[i].sectionId){
                     var beginstr = filter.tranDate(dl[d].FBeginTime);
                     if(dl[d].FBeginInputType == 0){
                        beginstr += "(�ֶ�)";
                     }
                     var endstr = filter.tranDate(dl[d].FEndTime);
                     if(dl[d].FEndInputType == 0){
                        endstr += "(�ֶ�)";
                     }
                     data[i].CheckResult = beginstr +"<br/>��<br/>" + endstr;
                  }
               }
            }

         }
         return data;
      },
      onCheck: function (id) {
         var r = confirm("ȷ�����ͨ���ü�¼��");
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
         var r = confirm("ȷ�������ü�¼��ˣ�");
         if(r){
            var self = this;
            this.loading = true;
            Service.checkRecord(id,0, function (rep) {
               self.loading = false;
               self.render(id);
            })
         }
      },
      upFile: function (obj,index){
         this.loading = true;
         var self = this;
         Service.upFile(index, function (rep) {
            self.loading = false;
            self.count+=1;
            obj.FileList.push({
               "FileName": rep.FFileName,
               "FileExt": rep.FFileExt,
               "FileSize": rep.FFileSize,
               "FileRelativeAddress": rep.FFileRelativeAddress,
               "FileType": rep.FFileType,
               "FileCreateTime": filter.tranDate(rep.FFileCreateTime)
            });
         });
         return false;
      },
      getSrc: function (f) {
         return Service.baseUrl +f.FileRelativeAddress;
      },
      getPic: function (v) {
         var self = this;
         this.loading = true;
         Service.getInspectObjectContentResultFileList(v, function (rep) {
            for(var i=0;i<rep.length;i++){
               rep[i].FFileRelativeAddress = Service.baseUrl +rep[i].FFileRelativeAddress;
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
         this.loading = true;
         var self = this;
         Service.updateInsRecord(JSON.stringify({recordstr:this.detail,ObjectContentResultListstr:this.contents}),function(rep){
            self.loading = false;
            if(rep == 1){
               alert("���³ɹ���");
               var router = new Router;
               router.setRoute("record");
            }else{
               alert("����ʧ�ܣ�");
            }
         })
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