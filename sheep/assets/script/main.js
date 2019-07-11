/**
 * Created by guang on 18/7/18.
 */
var config = require("config");
var storage = require("storage");
var qianqista = require("qianqista");
var sdk = require("sdk");
var res = require("res");


cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function() {
        cc.ginvitelist = [];
        cc.myscene = "main";

        storage.playMusic(res.audio_music);

        //this.initPhysics();
        this.initData();

        this.initUI();
        this.updateUI();

        this.addBox();
        this.addListener();

        this.updateLixian();
    },

    initPhysics: function()
    {
        cc.director.getPhysicsManager().enabled = true;
        //cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //cc.PhysicsManager.DrawBits.e_pairBit |
        //cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //cc.PhysicsManager.DrawBits.e_jointBit |
        //cc.PhysicsManager.DrawBits.e_shapeBit;
        cc.director.getPhysicsManager().debugDrawFlags = 0;
        //cc.PhysicsManager.FIXED_TIME_STEP = 1/30;
        cc.PhysicsManager.VELOCITY_ITERATIONS = 1;
        cc.PhysicsManager.POSITION_ITERATIONS = 1;
        //cc.PhysicsManager.MAX_ACCUMULATOR = cc.PhysicsManager.FIXED_TIME_STEP*2;
        cc.director.getPhysicsManager().enabledAccumulator = false;
        cc.director.getPhysicsManager().gravity = cc.v2(0,0);

        //cc.director.getPhysicsManager()._debugDrawer.node.group = "game";


        //cc.director.getPhysicsManager().attachDebugDrawToCamera(this.gameCamera);
        //var manager = cc.director.getCollisionManager();
        //manager.enabled = true;
        //manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;

    },


    initData: function()
    {
        this.lastY = 0;
        this.coin = storage.getCoin();
        this.toalcoin = storage.getToalCoin();
        this.faccoin = storage.getFacCoin();
        this.updateCoinDt = 0;
        this.saveCoinDt = 0;
        this.updateCoinTime = Math.random();
        this.uploadCoinDt = 0;
        this.shouyiDt = 0;

        qianqista.onshowmaincallback = this.updateLixian.bind(this);

        this.initShouYi();
    },

    initUI: function()
    {
        this.node_main = cc.find("node_main",this.node);
        this.node_display = cc.find("display",this.node);

        this.scroll = cc.find("scroll",this.node_main).getComponent(cc.ScrollView);
        this.scrollContent = cc.find("scroll/view/content",this.node_main);

        this.coin_label = cc.find("top/coinbg/num",this.node_main).getComponent(cc.Label);
        this.totalLv = cc.find("top/bg/totalLv",this.node_main).getComponent(cc.Label);
        this.pro = cc.find("top/bg/pro",this.node_main).getComponent(cc.ProgressBar);
        this.pro_num = cc.find("top/bg/pro/num",this.node_main).getComponent(cc.Label);
        this.currName = cc.find("top/bg/currName",this.node_main).getComponent(cc.Label);
        this.nextName = cc.find("top/bg/nextName",this.node_main).getComponent(cc.Label);

        this.task = cc.find("task",this.node_main).getComponent("task");

        this.headIcon = cc.find("top/bg/mask/headIcon",this.node_main);

        this.car = cc.find("car",this.scrollContent).getComponent("car");
        this.car2 = cc.find("car2",this.scrollContent).getComponent("car2");

        this.faccoin_label = cc.find("head/factory/coin",this.scrollContent).getComponent(cc.Label);

        res.loadPic(qianqista.avatarUrl,this.headIcon);

        this.boxs = [];
        //for(var i=0;i<3;i++)
        //{
        //    var box = cc.instantiate(cc.res["prefab_box"]);
        //    box.getComponent("box").init(i+1);
        //    this.scrollContent.addChild(box);
        //    this.scrollContent.height = box.height*(i+1);
        //    box.y = -box.height*i-100;
        //
        //    this.boxs.push(box);
        //}


        if(sdk.is_iphonex())
        {
            var topNode = cc.find("top",this.node_main);
            topNode.runAction(cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(function(){
                    var s = cc.view.getFrameSize();
                    var dpi = cc.winSize.width/s.width;
                    topNode.y -= dpi*30;

                })
            ));
        }

        //this.updateUIControl();
    },

    updateUI: function()
    {
        this.coin_label.string = storage.castNum(this.coin);
        this.faccoin_label.string = storage.castNum(this.faccoin);

        var tlv = 0;
        var lock = storage.getLock();
        for(var i=1;i<=lock;i++)
        {
            tlv += storage.getLevel(i);
        }

        var nextPro = this.getNextNikePro(tlv);

        this.totalLv.string = tlv;
        this.pro.progress = tlv/parseInt(nextPro);
        this.pro_num.string = tlv+"/"+parseInt(nextPro);

        this.currName.string = this.getNikeName(tlv);
        this.nextName.string = this.getNextNikeName(tlv);

        this.unLock = lock;
        this.totalLvNum = tlv;

        this.task.updateUI();
    },

    getNikeName: function(tlv)
    {
        var n = -1;
        for(var i=0;i<res.conf_achievement.length;i++)
        {
            if(parseInt(res.conf_achievement[i].condition)>tlv)
            {
                n = i-1;
                break;
            }
        }
        if(n == -1) n = res.conf_achievement.length-1;
        return res.conf_achievement[n].name;
    },

    getNextNikeName: function(tlv)
    {
        var n = -1;
        for(var i=0;i<res.conf_achievement.length;i++)
        {
            if(parseInt(res.conf_achievement[i].condition)>tlv)
            {
                n = i;
                break;
            }
        }
        if(n == -1) n = res.conf_achievement.length-1;
        return res.conf_achievement[n].name;
    },

    getNextNikePro: function(tlv)
    {
        var n = -1;
        for(var i=0;i<res.conf_achievement.length;i++)
        {
            if(parseInt(res.conf_achievement[i].condition)>tlv)
            {
                n = i;
                break;
            }
        }
        if(n == -1) n = res.conf_achievement.length-1;
        return res.conf_achievement[n].condition;
    },

    addCoin: function(coin,rate)
    {
        var add = Number(coin);
        if(add>0)
        {
            if(!this.coin_pos)
            {
                var coinbg = cc.find("top/coinbg/num",this.node_main);
                this.coin_pos = coinbg.convertToWorldSpace(coinbg.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            }

            var str = "+"+storage.castNum(add);
            if(rate)
            {
                add *= rate;
                str = "+"+storage.castNum(add) + "x" + rate;
            }

            res.showCoin(str,this.coin_pos,this.node_main);
            this.toalcoin += add;
        }
        this.coin += add;
        this.coin_label.string = storage.castNum(this.coin);
    },

    addFacCoin: function(coin)
    {
        var add = Number(coin);
        this.faccoin += add;
        this.faccoin_label.string = storage.castNum(this.faccoin);
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
    },

    updateUIControl: function()
    {
        cc.GAME.skipgame = null;
        cc.GAME.share = false;
        cc.GAME.lixianswitch = false;
        cc.GAME.shares = [];
        if(cc.GAME.control.length>0)
        {
            for(var i=0;i<cc.GAME.control.length;i++)
            {
                var con = cc.GAME.control[i];
                if(con.id == "skipgame")
                {
                    if(con.value)
                    {
                        var s = con.value.replace(/\'/g,"\"");
                        cc.GAME.skipgame = JSON.parse(s);
                    }
                }
                else if(con.id.indexOf("share") != -1)
                {
                    if(con.id == "share")
                    {
                        cc.GAME.share = con.value == 1 ? true : false;
                    }
                    else
                    {
                        if(con.value)
                        {
                            var s = con.value.replace(/\'/g,"\"");
                            cc.GAME.shares.push(JSON.parse(s));
                        }
                    }

                }
                else if(con.id == "lixian")
                {
                    cc.GAME.lixianswitch = con.value == 1 ? true : false;
                }
            }

        }

        this.share_btn.active = cc.GAME.share;
    },

    addBox: function()
    {
        if(this.boxs.length<15)
        {
            var lock = this.unLock;
            if(this.boxs.length < lock+1 || this.boxs.length<3)
            {
                var box = cc.instantiate(cc.res["prefab_box"]);
                box.getComponent("box").init(this.boxs.length+1);
                this.scrollContent.addChild(box);

                box.y = -box.height*this.boxs.length-320;

                this.boxs.push(box);
                this.scrollContent.height = box.height*this.boxs.length+320;
                cc.log(this.boxs.length);

                this.updateBox();
                this.scheduleOnce(this.addBox.bind(this),0.1);
            }
            else
            {
                if(!this.car.isRun)
                    this.car.run();
            }
        }

    },

    lvupBox: function(index)
    {
        var box = this.boxs[index-1];
        box.getComponent("box").lvup();
        this.updateUI();

        var boxs = this.boxs;

        for(var i=0;i<boxs.length;i++)
        {
            var box = boxs[i].getComponent("box");
            if(!box.isUnLock)
            {
                if(this.judgeUnLock(i+1))
                    box.toUnlock();
            }
        }
    },

    carvup: function()
    {
        this.car.lvup();
        this.task.updateUI();
    },

    carhup: function()
    {
        this.car2.lvup();
        this.task.updateUI();
    },

    judgeUnLock: function(lv)
    {
        var lock = this.unLock;
        if(lock<15 && lv<=15)
        {
            var tlv = 0;
            for(var i=1;i<=lock;i++)
            {
                tlv += storage.getLevel(i);
            }

            return tlv>=parseInt(res.conf_grade[lv-1].condition);

        }
        return false;
    },

    getSecVal: function()
    {
        var boxs = this.boxs;

        var val = 0;
        for(var i=0;i<boxs.length;i++)
        {
            var box = boxs[i].getComponent("box");
            if(box.isUnLock)
            {
               val += box.pice*(1/box.growSpeed);
            }
        }
        return val*36;
    },

    updateBox: function()
    {
        var h = this.scroll.node.height;
        var y = this.scroll.getScrollOffset().y;

        var boxs = this.boxs;

        //var s = "";
        for(var i=0;i<boxs.length;i++)
        {
            var box = boxs[i];
            if(box.y>h-y-box.height || -box.y-y>h)
            {
                box.sc.changeUpdate(false);
                //s += i+":";
            }
            else
            {
                box.sc.changeUpdate(true);
            }
        }
        //cc.log(s);
    },

    updateCoin: function(dt)
    {
        //this.updateCoinDt += dt;
        //
        //if(this.updateCoinDt>this.updateCoinTime && this.totalLvNum>=10)
        //{
        //    this.addCoin(this.getSecVal()*this.updateCoinDt,this.shouYiRate);
        //    this.updateCoinDt = 0;
        //    this.updateCoinTime = Math.random();
        //    if(this.updateCoinTime<0.2) this.updateCoinTime = 0.2;
        //    else if(this.updateCoinTime>0.5) this.updateCoinTime = 0.5;
        //}

        this.saveCoinDt += dt;
        if(this.saveCoinDt>3)
        {
            this.saveCoinDt = 0;
            storage.setCoin(this.coin);
            storage.setToalCoin(this.toalcoin);
            storage.setFacCoin(this.faccoin);
        }

        this.uploadCoinDt += dt;
        if(this.uploadCoinDt>20)
        {
            this.uploadCoinDt = 0;
            storage.uploadCoin();
            storage.uploadToalCoin();
            storage.uploadFacCoin();

            storage.setLixianTime(new Date().getTime());
            storage.uploadLixianTime();

            qianqista.uploadScore(this.toalcoin);

            qianqista.rankSelf(function(res2){
                var rankNum = res2.data;
                storage.setMaxRank(rankNum);
            });
        }
    },

    updateLixian: function()
    {
        var now = new Date().getTime();
        var time = storage.getLixianTime();
        var t = (now-time)/1000-20;
        if(t>0)
        {
            storage.setLixianTime(now);
            var val = this.getSecVal()*t;
            res.openUI("lixian",null,val);
        }
    },

    initShouYi: function()
    {
        var rateTasks = storage.getAddRateTask();
        if(rateTasks.length>0)
        {
            this.rateTask = rateTasks[0];
            this.rateTaskTime = storage.getAddRateTime();
        }
        else
        {
            this.rateTask = undefined;
        }

        var speedTasks = storage.getAddSpeedTask();
        if(speedTasks.length>0)
        {
            this.speedTask = speedTasks[0];
            this.speedTaskTime = storage.getAddSpeedTime();
        }
        else
        {
            this.speedTask = undefined;
        }
    },

    updateShouYi: function(dt)
    {
        this.shouyiDt += dt;
        if(this.shouyiDt>1)
        {
            this.shouyiDt = 0;

            if(this.rateTask)
            {
                var now = new Date().getTime();
                var time = this.rateTaskTime+this.rateTask.time*60*60*1000;
                if(now<time)
                {
                    this.shouYiRate = this.rateTask.reward;
                }
                else
                {
                    this.shouYiRate = undefined;
                    storage.removeAddRateTask();
                    this.initShouYi();
                }
            }

            if(this.speedTask)
            {
                var now = new Date().getTime();
                var time = this.speedTaskTime+this.speedTask.time*60*60*1000;
                if(now<time)
                {
                    this.shouYiSpeed = this.speedTask.reward;
                }
                else
                {
                    this.shouYiSpeed = undefined;
                    storage.removeAddSpeedTask();
                    this.initShouYi();
                }
            }

        }
    },

    scrollEvent: function(event,data)
    {
        var y = this.scroll.getScrollOffset().y;
        if(Math.abs(this.lastY-y)>10)
        {
            var h = this.scrollContent.height - this.scroll.node.height;
            if(h-y<20)
            {
                this.addBox();
            }
            else
                this.updateBox();

            this.lastY = y;
        }

    },




    click: function(event,data)
    {
        var self = this;
        if(data == "game1")
        {
            sdk.hideClub();
            cc.director.loadScene("game1");
        }
        else if(data == "setting")
        {
            res.openUI("setting");
        }
        else if(data == "choujiang")
        {
            res.openUI("choujiang");
        }
        else if(data == "qiandao")
        {
            res.openUI("qiandao");
        }
        else if(data == "rank")
        {
            res.openUI("rank");
        }
        else if(data == "share")
        {
            sdk.share(null,"main");
            cc.qianqista.event("分享有礼_打开");
        }
        else if(data == "carhup")
        {
            res.openUI("carhup");
        }
        else if(data == "carvup")
        {
            res.openUI("carvup");
        }
        storage.playSound(res.audio_button);
        cc.log(data);
    },


    addListener: function()
    {
        var s = cc.winSize;
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            var pos = event.getLocation();
            if(this.state == "start")
            {

            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {

        }, this);
    },


    update: function(dt) {
        this.updateCoin(dt);
        this.updateShouYi(dt);
    }
});