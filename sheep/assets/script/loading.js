/**
 * Created by guang on 19/4/9.
 */

var res = require("res");
var qianqista = require("qianqista");
var sdk = require("sdk");
var storage = require("storage");
var config = require("config");

cc.qianqista = qianqista;
cc.sdk = sdk;
cc.storage = storage;
cc.config = config;
cc.myscene = "load";
cc.res = res;
cc.GAME = {};

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },

        progressTips: {
            default: null,
            type: cc.Label
        },

        progressCar: {
            default: null,
            type: cc.Node
        },

        loadNode: {
            default: null,
            type: cc.Node
        }
    },


    onLoad: function() {

        //cc.sys.os = "web";
        this.resource = null;
        res.initPools();

        this.purls = [
            //"audio/button",
            "conf/base",
            "conf/cost",
            "conf/price",
            "conf/achievement",
            "conf/ranch",
            "conf/grade",
            "conf/task",

            "prefab/sheep",
            "prefab/buoy",
            "prefab/box",

            "images/sheep/sheep1",
            "images/sheep/sheep2",
            "images/sheep/sheep3",
            "images/sheep/sheep4",
            "images/sheep/sheep5",

            "prefab/ui/coinAni",
            "prefab/ui/toast",

            "prefab/ui/lvup",
            "prefab/ui/lixian",
            "prefab/ui/setting",
            "prefab/ui/choujiang",

            //"prefab/particle/suijinbi",
            //"scene/game1"
        ];


        this.completedCount = 0;
        this.totalCount = this.purls.length;
        this.loadCount = 0;

        this.nowtime = new Date().getTime();
        for(var i=0;i<5;i++)
            this.loadres();

        var self = this;
        qianqista.init("wx37d536c56e3e73f7","19d75155c485a20eefe6b18064a2ab53","全民剪羊毛",function(){
            var score = storage.getLevel();
            sdk.uploadScore(score,self.initNet.bind(self));
        });
        sdk.getUserInfo();
        //sdk.videoLoad();
        sdk.closeRank();


        this.loadNode.runAction(cc.repeatForever(cc.rotateBy(1,180)));

        this.isFirst = false;
        if(storage.getFirst() == 0)
        {
            this.isFirst = true;
            storage.setFirst(1);
            storage.setMusic(1);
            storage.setSound(1);
            storage.setVibrate(1);
            storage.setCoin(0);
        }
    },

    loadres: function()
    {
        var self = this;
        if(this.loadCount<this.totalCount)
        {
            var index = this.loadCount;
            var path = this.purls[index];
            if(path.indexOf("images/sheep/") != -1)
            {
                cc.loader.loadRes(this.purls[index],cc.SpriteAtlas, function(err, prefab)
                {
                    self.progressCallback(self.completedCount,self.totalCount,prefab,index);
                });
            }
            else
            {
                cc.loader.loadRes(this.purls[index], function(err, prefab)
                {
                    self.progressCallback(self.completedCount,self.totalCount,prefab,index);
                });
            }

            this.loadCount++;
        }
    },


    progressCallback: function (completedCount, totalCount, resource,index) {
        this.progress = completedCount / totalCount;
        this.resource = resource;
        this.completedCount++;
        //this.totalCount = totalCount;

        this.progressBar.progress = this.progress;
        this.progressTips.string = "加载中 " + Math.floor(this.completedCount/this.totalCount*100)+"%";

        if(this.completedCount>=this.totalCount)
        {
            this.completeCallback();
        }
        else{
            this.loadres();
        }

        this.setRes(resource,index);

        this.progressCar.x = this.progress*300-150;
        //cc.log(resource);
    },
    completeCallback: function (error, resource) {
        console.log("-----completeCallback---time:",new Date().getTime()-this.nowtime);
        this.progressTips.string = "加载完成";
        this.progressBar.progress = 1;
        //this.progressTips.string = "加载中";
        //this.progressBar.node.active = true;
        //cc.loader.loadResDir("audio", this.progressCallback.bind(this), this.completeCallback2.bind(this));

        this.startGame();
    },

    startGame: function()
    {
        if(!this.loadNode.active && this.progressBar.progress >= 1)
        {
            cc.director.loadScene("main");
        }

    },

    setRes: function(resource,index)
    {
        var url = this.purls[index];
        var pifx = "";
        if(url.indexOf("audio/") != -1)
            pifx = "audio_";
        else if(url.indexOf("sheep/") != -1)
            pifx = "sheep_";
        else if(url.indexOf("prefab/ui/") != -1)
            pifx = "prefab_ui_";
        else if(url.indexOf("prefab/") != -1)
            pifx = "prefab_";
        else if(url.indexOf("conf/") != -1)
        {
            pifx = "conf_"+resource.name;
            resource = JSON.parse(resource.text);
        }

        if(url.indexOf("conf/") != -1)
            res[pifx] = resource;
        else
            res[pifx+resource.name] = resource;

        //cc.log(res);
    },

    initNet: function()
    {
        var self = this;
        qianqista.datas(function(res){
            console.log('my datas:', res);
            if(res.state == 200)
            {
                self.updateLocalData(res.data);
            }
            self.loadNode.active = false;
            self.startGame();
        });
        //qianqista.pdatas(function(res){
        //    self.updateLocalData2(res);
        //});
        //qianqista.rankScore(function(res){
        //    self.worldrank = res.data;
        //});

        qianqista.control(function(res){
            console.log('my control:', res);
            if(res.state == 200)
            {
                cc.GAME.control = res.data;
            }
        });

        //if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        //{
        //    BK.Script.log(1,1,'---------qianqista.init：');
        //    BK.onEnterForeground(function(){
        //        BK.Script.log(1,1,"---onEnterForeground----");
        //
        //        //storage.playMusic(self.res.audio_bgm);
        //    });
        //}

    },

    updateLocalData: function(data)
    {
        if(data)
        {
            var datas = JSON.parse(data);
            if(datas.hasOwnProperty("first"))
                storage.setFirst(1);
            if(datas.hasOwnProperty("coin"))
            {
                var coin = Number(datas.coin);
                var coin2 = storage.getCoin();
                if(coin2>coin) coin = coin2;
                storage.setCoin(coin);
            }

            if(datas.hasOwnProperty("lock"))
                storage.setLock(Number(datas.lock));

            var lock = storage.getLock();
            for(var i=1;i<=lock;i++)
            {
                if(datas.hasOwnProperty("level_"+i))
                    storage.setLevel(1,Number(datas["level_"+i]));
            }

            if(datas.hasOwnProperty("task"))
                storage.setTask(Number(datas.task));

            if(datas.hasOwnProperty("login_time"))
                storage.setLoginTime(Number(datas.login_time));
            if(datas.hasOwnProperty("login_day"))
                storage.setLoginDay(Number(datas.login_day));
            if(datas.hasOwnProperty("game_num"))
                storage.setGameNum(Number(datas.game_num));
            if(datas.hasOwnProperty("lixian_time"))
                storage.setLixianTime(Number(datas.lixian_time));


            if(datas.hasOwnProperty("ginvitelist"))
                cc.ginvitelist = datas.ginvitelist;
            if(datas.hasOwnProperty("ginvite_lnum"))
                storage.setInviteLnum(Number(datas.ginvite_lnum));


            console.log("datas:",datas);
        }
        else
        {
            this.uploadData();
        }
    },

    updateLocalData2: function(res)
    {
        var self = this;
        if(res.state == 1)
        {
            qianqista.paddUser(function(res){
                qianqista.rankScore(function(res2){
                    self.worldrank = res2.data;
                });
            },storage.getCoin());
        }
        else
        {
            var datas = res.data;
            if(datas)
            {

            }
        }
    },

    uploadData: function()
    {
        var datas = {};
        datas.first = storage.getFirst();
        datas.coin = storage.getCoin();
        datas.lock = storage.getLock();

        for(var i=1;i<=datas.lock;i++)
        {
            datas["level_"+i] = storage.getLevel(i);
        }
        datas.task = storage.getTask();

        datas.login_time = storage.getLoginTime();
        datas.login_day = storage.getLoginDay();
        datas.game_num = storage.getGameNum();
        datas.ginvite_lnum = storage.getInviteLnum();

        datas.lixian_time = storage.getLixianTime();

        console.log("uploadData:",datas);
        var data = JSON.stringify(datas);
        var self = this;
        qianqista.uploaddatas(data,function(res){
            console.log("--uploaddatas:",res);
            //if(res && res.state == 200)
            //    self.updateData();
        });

        //qianqista.uploadScore(storage.getMaxPoint());
    }
});
