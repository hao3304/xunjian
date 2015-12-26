/**
 * Created by jack on 2015/8/24.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");

module.exports = Vue.component("c-nav",{
    inherit:true,
    template:__inline("nav.html"),
    props:["view","stations"],
    data: function () {
        return {
            "func": [
                {
                    name: "巡检管理",
                    key: "home",
                    active:false,
                    child:[
                        {
                            name: "巡检计划",
                            key: "project",
                            active:false
                        },
                        {
                            name: "巡检任务",
                            key: "task",
                            active:false
                        },
                        {
                            name: "巡检记录",
                            key: "record",
                            active:false
                        },
                        {
                            name: "综合查询",
                            key: "query",
                            active:false
                        }
                    ]
                },
                {
                    name: "基础信息",
                    key: "base",
                    active:false,
                    child:[
                        {
                            name: "巡检类型",
                            key: "type",
                            active:false
                        },
                        {
                            name: "巡检对象",
                            key: "target",
                            active:false
                        },
                        {
                            name: "巡检区段",
                            key: "section",
                            active:false
                        },
                        {
                            name: "巡检路线",
                            key: "route",
                            active:false
                        },
                        {
                            name: "巡检部位",
                            key: "position",
                            active:false
                        }

                    ]
                },
                //{
                //    name: "缺陷管理",
                //    key: "defect",
                //    active:false
                //},
                {
                    name: "系统设置",
                    key: "config",
                    active:false
                }
            ],
            "active":"",
            "child":"",
            "station":localStorage["STATIONID"]||""
        }
    },
    watch:{
        "view": function (v) {
            var func = this.func,i=0;
            this.child = "";
            for(;i<func.length;i++){
                if(func[i].key == v){
                    this.active = func[i].key;
                }

                if(func[i].child){
                    var child = func[i].child;
                    for(var c in child){
                        if(child[c].key == v) {
                            this.active = func[i].key;
                            this.child = child[c].key;
                            func[i].name = child[c].name;
                        }
                    }
                }
            }

            if(v == "home"){
                this.func[0].name = "巡检管理";
            }
        },
        "station": function (v) {
            Service.setSession(v, function (rep) {
                localStorage["STATIONID"] = v;
                window.location.reload();
            })
        }
    },
    methods:{

    },
    ready: function () {

    }
});