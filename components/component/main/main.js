
var Vue = require('component_modules/vue');
var Router = require('component_modules/director').Router;
var login = require('components/page/login/login');
var Service = require('main/service.js');

require("loading/loading.js");
require("nav/nav.js");


window.app = new Vue({
    el:"#app",
    data:{
        contentHeight:document.documentElement.clientHeight-230,
        "currentView":"",
        "loading":false, /*是否显示加载*/
        "progress":true, /*显示进度条*/
        "base":{
            "routList":[], /*路线*/
            "categoryList":[],
            "sectionList":[],
            "userList":[],
            "stationList":[],
            "cycleType":[
                {value:0,text:"天"},
                {value:1,text:"周"},
                {value:2,text:"月"},
                {value:3,text:"季"},
                {value:4,text:"年"}
            ],
            "status":[
                {value:0,text:"正常"},
                {value:1,text:"异常"},
                {value:2,text:"良好"}
            ],
            "checkState":[
                {value:0,text:"未审核"},
                {value:1,text:"审核通过"}
            ]
        },
        "auth":{
            userid:""
        },
        "routeObject":{
            id:"",
            sid:"",
            name:""
        },
        "step":6,
        "nstep":0,
        "hasInit":false
    },
    components:{
        "login":login
    },
    watch:{
        "nstep": function (v) {
            if(v==this.step){
                this.loading =false;
            }
        }
    },
    methods:{
        init: function () {
            this.loading = true;
            this._getStationList();
            this.hasInit = true;
        },
        _getRout: function () {
            var self = this;
            Service.GetRoutList({}, function (rep) {
                var lst = [],i = 0;
                for(;i<rep.length;i++){
                    lst.push({text:rep[i].FRoutName,value:rep[i].FId});
                }
                self.base.routList = lst;
                self.nstep+=1;
            })
        },
        _getCategory: function () {
            var self = this;
            Service.GetInspectCategoryList({}, function (rep) {
                var lst = [],i = 0;
                for(;i<rep.length;i++){
                    lst.push({text:rep[i].FCategoryName,value:rep[i].FId});
                }
                self.base.categoryList = lst;
                self.nstep+=1;
            })
        },
        _getSection: function () {
            var self = this;
            Service.GetInspectSectionList({}, function (rep) {
                var lst = [],i = 0;
                if(rep){
                    for(;i<rep.length;i++){
                        lst.push({text:rep[i].FDescription,value:rep[i].FId,fullname:rep[i].FSectionFullName});
                    }
                }
                self.base.sectionList = lst;
                self.nstep+=1;
            })
        },
        _getUserList: function () {
            var self = this;
            Service.getUserList(function (rep) {
                var lst = [],i = 0;
                for(;i<rep.length;i++){
                    lst.push({text:rep[i].FUserName,value:rep[i].FUserId});
                }

                self.base.userList = lst;
                self.nstep+=1;

            })
        },
        _getStationList: function () {
            var self = this;

            Service.getStationList(function (rep) {
                var lst = [],i = 0;
                for(;i<rep.length;i++){
                    lst.push({text:rep[i].FStationName,value:rep[i].FStationId});
                }
                self.base.stationList = lst;
                self.nstep+=1;

                var v = localStorage.getItem("STATIONID") || lst[0].value;
                Service.setSession(v, function (r) {
                    localStorage["STATIONID"] = r;
                    self.nstep+=1;
                    self._getRout();
                    self._getCategory();
                    self._getSection();
                    self._getUserList();
                    self.$broadcast("ready");
                });
            })
        },
        checkUser: function () {
            this.userid = Service.getCookie("FUserId");
            if(this.userid){
                if(!this.hasInit&&window.location.hash.indexOf("login")<0){
                    this.init();
                }
            }else{
                var router = new Router();
                router.setRoute("login");
            }
        }
    },
    ready: function () {
        this.checkUser();
        $(".admin").height(document.documentElement.clientHeight-80);
        laydate.skin('molv');
    }
});

/*过场动画*/
Vue.transition('slide', {
    enter: function (el) {
        $(el).css({
            "opacity":0,
            "margin-top":20
        }).animate({
            "opacity":1,
            "margin-top":0
        },300,"linear");
    },
    leave: function (el) {
        if(el > 0 ){
            $(el).remove();
        }
    }
});

/*表单验证结果*/
Vue.directive('disabled', function (value) {
    this.el.disabled = !value;
});

var router = new Router();

function doRouter(view,component){
    var coms = window.app.$options.components;

    if(!coms[view]){
        coms[view] = component;
    }
    app.currentView = view;
}

router.on("/home",function(){
    require.async(["page/home/home.js"], function (p) {
        doRouter("home",p);
    })
});

router.on("/",function(){
    return;
});

router.on("/marker",function(){
    require.async(["page/marker/marker.js"], function (p) {
        doRouter("marker",p);
    })
});

router.on("/project",function(){
    require.async(["page/project/project.js"], function (p) {
        doRouter("project",p);
    })
});

router.on("/target",function(){
    require.async(["page/target/target.js"], function (p) {
        doRouter("target",p);
    })
});

router.on("/record",function(){
    require.async(["page/record/record.js"], function (p) {
        doRouter("record",p);
    })
});

router.on("/record/:id",function(id){
    require.async(["page/record/detail/detail.js"], function (p) {
        p.options.methods.getId = function () {
            return id;
        };
        window.app.$broadcast("reload",{id:id});
        doRouter("record-detail",p);
    })
});

router.on("/contrast",function(){
    require.async(["page/record/contrast/contrast.js"], function (p) {
        doRouter("contrast",p);
    })
});

router.on("/task",function(){
    require.async(["page/task/task.js"], function (p) {
        doRouter("task",p);
    })
});

router.on("/query",function(){
    require.async(["page/query/query.js"], function (p) {
        doRouter("query",p);
    })
});

router.on("/route",function(){
    require.async(["page/route/route.js"], function (p) {
        doRouter("route",p);
    })
});

router.on("/addRecord",function(){
    require.async(["page/record/add/add.js"], function (p) {
        doRouter("addRecord",p);
    })
});

router.on("/route/:relationid/:sectionid/:sectionname",function(relationid,sectionid,sectionname){
    require.async(["page/route/object/object.js"], function (p) {
        window.app.routeObject.id = relationid;
        window.app.routeObject.sid = sectionid;
        window.app.routeObject.name = sectionname;
        window.app.$broadcast("reload-object",{id:relationid,sid:sectionid,name:sectionname});
        doRouter("object",p);
    })
});

router.on("/login",function(){
    require.async(["page/login/login.js"], function (p) {
        doRouter("login",p);
    })
});

router.on("/type",function(){
    require.async(["page/type/type.js"], function (p) {
        doRouter("type",p);
    })
});

router.on("/section",function(){
    require.async(["page/section/section.js"], function (p) {
        doRouter("section",p);
    })
});

router.on("/marker",function(){
    require.async(["page/marker/marker.js"], function (p) {
        doRouter("marker",p);
    })
});

router.on("/position",function(){
    require.async(["page/position/position.js"], function (p) {
        doRouter("position",p);
    })
});


router.configure({
    notfound: function () {
        router.setRoute("/error/notfound")
    }
});


router.on("/base",function(){
    require.async(["page/base/base.js"], function (p) {
        doRouter("base",p);
    })
});

router.on("/config",function(){
    require.async(["page/config/config.js"], function (p) {
        doRouter("config",p);
    })
});

router.on("/defect",function(){
    require.async(["page/defect/defect.js"], function (p) {
        doRouter("defect",p);
    })
});

router.init("/login");


