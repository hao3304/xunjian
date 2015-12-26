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
                    name: "Ѳ�����",
                    key: "home",
                    active:false,
                    child:[
                        {
                            name: "Ѳ��ƻ�",
                            key: "project",
                            active:false
                        },
                        {
                            name: "Ѳ������",
                            key: "task",
                            active:false
                        },
                        {
                            name: "Ѳ���¼",
                            key: "record",
                            active:false
                        },
                        {
                            name: "�ۺϲ�ѯ",
                            key: "query",
                            active:false
                        }
                    ]
                },
                {
                    name: "������Ϣ",
                    key: "base",
                    active:false,
                    child:[
                        {
                            name: "Ѳ������",
                            key: "type",
                            active:false
                        },
                        {
                            name: "Ѳ�����",
                            key: "target",
                            active:false
                        },
                        {
                            name: "Ѳ������",
                            key: "section",
                            active:false
                        },
                        {
                            name: "Ѳ��·��",
                            key: "route",
                            active:false
                        },
                        {
                            name: "Ѳ�첿λ",
                            key: "position",
                            active:false
                        }

                    ]
                },
                //{
                //    name: "ȱ�ݹ���",
                //    key: "defect",
                //    active:false
                //},
                {
                    name: "ϵͳ����",
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
                this.func[0].name = "Ѳ�����";
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