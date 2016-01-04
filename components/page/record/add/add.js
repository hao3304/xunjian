/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");
var Check = require("main/check.js");

module.exports = Vue.extend({
   inherit:true,
   template:__inline("add.html"),
   data: function () {
      return {
         record:{
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
            InputType:0, /*web����*/
            StationId:localStorage["STATIONID"], /*ˮ��վID*/
            Remark:""
         },
         contents:[],
         count:0 /*����ϴ�����*/
      }
   },
   methods:{
      init: function () {
         var self = this;
         laydate.skin('molv');
         var start = {istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#beginDate",choose: function (d) {
            self.record.StartTime = d;
            end.min = d;
            end.start = d
         }};
         var end = {istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#endDate",choose: function (d) {
            self.record.FinishiTime = d;
            start.max = d;
         }};

         var inspect= {istime: true, format: 'YYYY-MM-DD',elem:"#inspectDate",choose: function (d) {
            self.record.InspectDate = d;
         }};
         laydate(start);
         laydate(end);
         laydate(inspect);
      },
      getDetail: function (id) {
         var self = this;
         this.loading = true;
         Service.getRoutStruct(id, function (rep) {
            self.contents =self.tranData(rep);
            self.loading = false;
         })
      },
      tranData: function (data) {
         var lst = [];
         if(data.length > 1){
            for(var i=0;i<data.length;i++){
               var sections = data[i].sectionObjectList;
               for(var s=0;s<sections.length;s++){
                  var contents = sections[s].contentList;
                  for(var c = 0;c<contents.length;c++){
                     lst.push({
                        SectionId:data[i].FSectionId,
                        SectionName:data[i].sectionName,
                        ObjectName:sections[s].objectame,
                        ObjectId:sections[s].FObjectId,
                        ContentName:contents[c].FContentName,
                        ContentStatus:0,
                        ContentId:contents[c].FId,
                        Remark:"",
                        InputType:0,
                        ContentValue:contents[c].FContentDefault,
                        FileList:[]
                     })
                  }
               }
            }
         }
         data = lst;
         var target = data[0];
         data[0].rows = 1;
         for(var i = 1;i<data.length;i++){
            if(target.SectionId == data[i].SectionId){
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
            if(t.ObjectId == data[i].ObjectId){
               t.objrows += 1;
            }else{
               t = data[i];
               t.objrows = 1;
            }
         }

         return data;
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
         return "http://221.12.173.124:8080/inspectservice/"+f.FileRelativeAddress;
      },
      submitRecord: function () {
         this.loading = true;
         var self = this;
         Service.addNewRecord(JSON.stringify({recordstr:this.record,ObjectContentResultListstr:this.contents}), function (rep) {
            self.loading = false;
            alert("��ӳɹ���");
            self.initData();
         })
      },
      initData: function () {
         this.record.RoutName = "";
         this.record.Status = "";
         this.record.RoutId = "";
         this.record.RecordDesc="";
         this.record.InspectDate ="";/*�������*/
         this.record.InspectPerson ="";/*�����*/
         this.record.ChargePersonId ="";/*�����*/
         this.record.StartTime = "";
         this.record.FinishiTime = "";
         this.record.StationId = localStorage["STATIONID"];
         this.record.Remark ="";
         this.contents = [];
      },
      backReload: function () {
         this.$parent.$broadcast("record-reload");
      }
   },
   watch:{
      "record.RoutId": function (v) {
         if(v=="��ѡ��"){
            this.initData();
         } else if(v){
            this.getDetail(v);
            var  rs = this.base.routList;
            for(var i=0;i<rs.length;i++){
               if(rs[i].value == v){
                  this.record.RoutName = rs[i].text;
               }
            }
         }
      }
   },
   computed: {
      validation: function () {
         return {
            RoutId: Check.check(this.record.RoutId,"plusinteger"),
            Status: Check.check(this.record.Status,"plusinteger"),
            userList: Check.check(this.record.userList,"required"),
            StartTime: Check.check(this.record.StartTime,"datetime"),
            FinishiTime: Check.check(this.record.FinishiTime,"datetime"),
            InspectPerson: Check.check(this.record.InspectPerson,"required"),
            ChargePersonId: Check.check(this.record.ChargePersonId,"required"),
            InspectDate: Check.check(this.record.InspectDate,"datetime")
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
      this.init();
   }
});