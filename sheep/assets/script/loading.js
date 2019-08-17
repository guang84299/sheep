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
cc.GAME.control = [];
cc.gjiabeilist = [];

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
            "conf/rankAward",
            "conf/rankUp",
            "conf/qiandao",
            "conf/choujiang",
            "conf/truckHor",
            "conf/truckVic",
            "conf/shop",
            "conf/cardDraw",
            "conf/cardGrade",
            "conf/cardText",
            "conf/compose",
            "conf/dogText",

            "prefab/sheep",
            "prefab/buoy",
            "prefab/box",

            "images/sheep/buoy",
            "images/sheep/sheep1",
            "images/sheep/sheep2",
            "images/sheep/sheep3",
            "images/sheep/sheep4",
            "images/sheep/sheep5",
            "images/sheep/sheep6",

            "anims/TouchParti",

            "prefab/ui/coinAni",
            "prefab/ui/diamondAni",
            "prefab/ui/toast",

            "prefab/ui/carhup",
            "prefab/ui/carvup",
            "prefab/ui/choujiang",
            "prefab/ui/dog",
            "prefab/ui/freecoin",
            "prefab/ui/freetili",
            "prefab/ui/lixian",
            "prefab/ui/lvup",
            "prefab/ui/nameup",
            "prefab/ui/power",
            "prefab/ui/qiandao",
            "prefab/ui/rank",
            "prefab/ui/setting",
            "prefab/ui/shop",
            "prefab/ui/shouyi",
            "prefab/ui/shouyifanbei",
            "prefab/ui/skill",
            "prefab/ui/tanxian",
            "prefab/ui/tanxiangame",
            "prefab/ui/tanxianjiesuan",
            "prefab/ui/tanxiantask",
            "prefab/ui/unlockbox",
            "prefab/ui/unlockdog",
            "prefab/ui/yindao",


            "prefab/anim/coinani",

            //"prefab/particle/suijinbi",
            //"scene/game1"
        ];


        this.completedCount = 0;
        this.totalCount = this.purls.length;
        this.loadCount = 0;

        this.nowtime = new Date().getTime();
        for(var i=0;i<3;i++)
            this.loadres();

        var self = this;
        qianqista.init("wx37d536c56e3e73f7","19d75155c485a20eefe6b18064a2ab53","全民剪羊毛",function(){
            var score = storage.getLevel();
            sdk.uploadScore(score,self.initNet.bind(self));
        });
        sdk.getUserInfo();
        sdk.videoLoad();
        sdk.closeRank();
        sdk.keepScreenOn();


        this.loadNode.runAction(cc.repeatForever(cc.rotateBy(1,180)));

        this.isFirst = false;
        if(storage.getFirst() == 0)
        {
            this.isFirst = true;
            storage.setFirst(1);
            storage.setMusic(1);
            storage.setSound(1);
            storage.setVibrate(1);
            storage.setCoin(100);
            storage.setDogCardLv(1,1)
        }
    },

    loadres: function()
    {
        var self = this;
        if(this.loadCount<this.totalCount)
        {
            var index = this.loadCount;
            var path = this.purls[index];
            if(path.indexOf("images/sheep/") != -1 || path.indexOf("anims/") != -1)
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
            this.progressBar.node.active = false;
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
        else if(url.indexOf("prefab/anim/") != -1)
            pifx = "prefab_anim_";
        else if(url.indexOf("prefab/") != -1)
            pifx = "prefab_";
        else if(url.indexOf("conf/") != -1)
        {
            pifx = "conf_"+resource.name;
            //console.error(url,cc.url.raw("resources/"+url));
            resource = JSON.parse(resource.text);
        }

        if(url.indexOf("conf/") != -1)
            res[pifx] = resource;
        else
            res[pifx+resource.name] = resource;

        //cc.log(url);
        //cc.log(res);
    },

    initNet: function()
    {
        var self = this;
        var httpDatas = false;
        var httpControl = false;
        qianqista.datas(function(res){
            console.log('my datas:', res);
            if(res.state == 200)
            {
                self.updateLocalData(res.data);
            }
            httpDatas = true;

            if(httpDatas && httpControl)
            {
                self.loadNode.active = false;
                self.startGame();
            }

        });

        //qianqista.pdatas(function(res){
        //    self.updateLocalData2(res);
        //    httpPdatas = true;
        //
        //    if(httpDatas && httpPdatas && httpControl)
        //    {
        //        self.loadNode.active = false;
        //        self.startGame();
        //    }
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
            httpControl = true;

            if(httpDatas && httpControl)
            {
                self.loadNode.active = false;
                self.startGame();
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

            if(datas.hasOwnProperty("diamond"))
            {
                var diamond = Number(datas.diamond);
                var diamond2 = storage.getDiamond();
                if(diamond2>diamond) diamond = diamond2;
                storage.setDiamond(diamond);
            }

            if(datas.hasOwnProperty("faccoin"))
            {
                var coin = Number(datas.faccoin);
                var coin2 = storage.getFacCoin();
                if(coin2>coin) coin = coin2;
                storage.setFacCoin(coin);
            }

            if(datas.hasOwnProperty("toalcoin"))
            {
                var coin = Number(datas.toalcoin);
                var coin2 = storage.getToalCoin();
                if(coin2>coin) coin = coin2;
                storage.setToalCoin(coin);
            }

            if(datas.hasOwnProperty("lock"))
                storage.setLock(Number(datas.lock));

            var lock = storage.getLock();
            for(var i=1;i<=lock;i++)
            {
                if(datas.hasOwnProperty("level_"+i))
                    storage.setLevel(i,Number(datas["level_"+i]));

                if(datas.hasOwnProperty("level_"+i+"_dog"))
                    storage.setLevelDog(i,Number(datas["level_"+i+"_dog"]));
            }

            for(var i=1;i<=30;i++)
            {
                if(datas.hasOwnProperty("sheep_"+i))
                    storage.setSheep(i,Number(datas["sheep_"+i]));
                if(datas.hasOwnProperty("buoy_"+i))
                    storage.setBuoy(i,Number(datas["buoy_"+i]));
            }

            if(datas.hasOwnProperty("carv_lv"))
                storage.setCarVLv(Number(datas.carv_lv));

            if(datas.hasOwnProperty("carh_lv"))
                storage.setCarHLv(Number(datas.carh_lv));

            if(datas.hasOwnProperty("task"))
                storage.setTask(Number(datas.task));

            if(datas.hasOwnProperty("maxrank"))
                storage.setMaxRank(Number(datas.maxrank));

            if(datas.hasOwnProperty("rankup"))
                storage.setRankUp(datas.rankup);

            if(datas.hasOwnProperty("qiandao_num"))
                storage.setQianDaoNum(Number(datas.qiandao_num));

            if(datas.hasOwnProperty("choujiangtoal_num"))
                storage.setChoujiangToalNum(Number(datas.choujiangtoal_num));

            //if(datas.hasOwnProperty("login_time"))
            //    storage.setLoginTime(Number(datas.login_time));

            if(datas.hasOwnProperty("login_day"))
                storage.setLoginDay(Number(datas.login_day));
            if(datas.hasOwnProperty("game_num"))
                storage.setGameNum(Number(datas.game_num));
            if(datas.hasOwnProperty("lixian_time"))
                storage.setLixianTime(Number(datas.lixian_time));

            if(datas.hasOwnProperty("yindao"))
                storage.setYinDao(Number(datas.yindao));

            if(datas.hasOwnProperty("txlv"))
                storage.setTxLv(Number(datas.txlv));
            if(datas.hasOwnProperty("txnum"))
                storage.setTxNum(Number(datas.txnum));
            if(datas.hasOwnProperty("txtask"))
                storage.setTxTask(Number(datas.txtask));

            if(datas.hasOwnProperty("nameup"))
                storage.setNameUp(Number(datas.nameup));


            if(datas.hasOwnProperty("ginvitelist"))
                cc.ginvitelist = datas.ginvitelist;
            if(datas.hasOwnProperty("ginvite_lnum"))
                storage.setInviteLnum(Number(datas.ginvite_lnum));

            if(datas.hasOwnProperty("gjiabeilist"))
                cc.gjiabeilist = datas.gjiabeilist;


            console.log("datas:",datas);

            var now = new Date().getTime();
            if(datas.hasOwnProperty("login_time"))
                cc.login_time = Number(datas.login_time);
            else
                cc.login_time = now;
            storage.setLoginTime(now);
            storage.uploadLoginTime();

            if(res.isRestTime(cc.login_time,now))
            {
                storage.setYesRank(storage.getMaxRank());

                storage.setLoginDay(parseInt(datas.login_day)+1);
                storage.uploadLoginDay();

                cc.gjiabeilist = [];
                storage.uploadJiabei();

                storage.setFreeDiaNum(1);
            }
        }
        else
        {
            var now = new Date().getTime();
            cc.login_time = now;
            storage.setLoginTime(now);
            storage.setLoginDay(1);
            storage.setFreeDiaNum(1);
            this.uploadData();
        }
    },

    updateLocalData2: function(res)
    {
        var self = this;
        if(res.state == 1)
        {
            qianqista.paddUser(function(res){
                //qianqista.rankScore(function(res2){
                //    self.worldrank = res2.data;
                //});
            },storage.getToalCoin()/config.totalCoinRate);
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
