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

        this.updateRed();
        this.updateFlyCoin();

        if(this.yindao < 22)//22
        {
            //this.yindao = 14;
            //if(this.yindao == 4) this.yindao = 3;
            //else if(this.yindao == 5) this.yindao = 6;
            //else if(this.yindao == 8) this.yindao = 7;
            //else if(this.yindao == 9) this.yindao = 10;
            //else if(this.yindao == 12) this.yindao = 11;
            //else if(this.yindao == 13) this.yindao = 14;

            if(this.yindao < 2)
            {
                this.scheduleOnce(function(){
                    res.openUI("yindao");
                },0.5);
            }
            else
            {
                this.yindao = 22;
            }
        }

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
        this.diamond = storage.getDiamond();
        this.toalcoin = storage.getToalCoin();
        this.faccoin = storage.getFacCoin();
        this.updateCoinDt = 0;
        this.saveCoinDt = 0;
        this.updateCoinTime = Math.random();
        this.uploadCoinDt = 0;
        this.shouyiDt = 0;
        this.yindao = storage.getYinDao();

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
        this.diamond_label = cc.find("top/diamondbg/num",this.node_main).getComponent(cc.Label);
        this.totalLv = cc.find("top/bg/totalLv",this.node_main).getComponent(cc.Label);
        this.pro = cc.find("top/bg/pro",this.node_main).getComponent(cc.ProgressBar);
        this.pro_num = cc.find("top/bg/pro/num",this.node_main).getComponent(cc.Label);
        this.currName = cc.find("top/bg/currName",this.node_main);
        this.nextName = cc.find("top/bg/nextNamebg/nextName",this.node_main);
        this.nextNamebg = cc.find("top/bg/nextNamebg",this.node_main);

        this.task = cc.find("task",this.node_main).getComponent("task");

        this.headIcon = cc.find("top/bg/mask/headIcon",this.node_main);

        this.car = cc.find("car",this.scrollContent).getComponent("car");
        this.car2 = cc.find("car2",this.scrollContent).getComponent("car2");

        this.faccoin_label = cc.find("head/factory/coin",this.scrollContent).getComponent(cc.Label);
        this.carvup_num = cc.find("head/carvup/num",this.scrollContent).getComponent(cc.Label);
        this.carhup_num = cc.find("head/carhup/num",this.scrollContent).getComponent(cc.Label);

        this.scrollControlUp = cc.find("scrollControl/up",this.node_main);
        this.scrollControlDown = cc.find("scrollControl/down",this.node_main);
        this.scrollControlUp.active = false;

        //res.loadPic(qianqista.avatarUrl,this.headIcon);

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

        this.updateUIControl();
    },

    updateUI: function()
    {
        this.coin_label.string = storage.castNum(this.coin);
        this.diamond_label.string = storage.castNum(this.diamond);
        this.faccoin_label.string = storage.castNum(this.faccoin);
        this.carvup_num.string = "lv"+storage.getCarVLv();
        this.carhup_num.string = "lv"+storage.getCarHLv();

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

        var nickName = this.getNikeName(tlv);
        var nextNickName = this.getNextNikeName(tlv);
        res.setSpriteFrameAtlas("images/name",nickName,this.currName);
        if(nickName != nextNickName)
            res.setSpriteFrameAtlas("images/name",nextNickName,this.nextName);
        else
            this.nextNamebg.active = false;

        this.unLock = lock;
        this.totalLvNum = tlv;

        if(!this.lastName)this.lastName = nickName;
        else
        {
            if(this.lastName != nickName)
            {
                res.openUI("nameup");
            }
            this.lastName = nickName;
        }

        this.task.updateUI();
    },

    getNikeName: function(tlv)
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
        if(n == -1) n = res.conf_achievement.length;
        return n;
    },

    getNextNikeName: function(tlv)
    {
        var n = -1;
        for(var i=0;i<res.conf_achievement.length;i++)
        {
            if(parseInt(res.conf_achievement[i].condition)>tlv)
            {
                n = i+1;
                break;
            }
        }
        if(n == -1) n = res.conf_achievement.length;
        return n;
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
                str = "+"+storage.castNum(add);// + "x" + rate;
            }

            res.showCoin(str,this.coin_pos,this.node_main);
            this.toalcoin += add;
        }
        this.coin += add;
        if(add>0)
        {
            var self = this;
            this.coin_label.node.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.scaleTo(0.2,1.2).easing(cc.easeSineIn()),
                cc.scaleTo(0.2,1).easing(cc.easeSineIn()),
                cc.callFunc(function(){
                    self.coin_label.string = storage.castNum(self.coin);
                })
            ));
        }
        else
        {
            this.coin_label.string = storage.castNum(this.coin);
        }
    },

    addDiamond: function(diamond,rate)
    {
        var add = Number(diamond);
        if(add>0)
        {
            if(!this.diamond_pos)
            {
                var coinbg = cc.find("top/diamondbg/num",this.node_main);
                this.diamond_pos = coinbg.convertToWorldSpace(coinbg.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            }

            var str = "+"+storage.castNum(add);
            if(rate)
            {
                add *= rate;
                str = "+"+storage.castNum(add) + "x" + rate;
            }

            res.showCoin(str,this.diamond_pos,this.node_main);
        }
        this.diamond += add;
        storage.setDiamond(this.diamond);
        storage.uploadDiamond();
        if(add>0)
        {
            var self = this;
            this.diamond_label.node.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.scaleTo(0.2,1.2).easing(cc.easeSineIn()),
                cc.scaleTo(0.2,1).easing(cc.easeSineIn()),
                cc.callFunc(function(){
                    self.diamond_label.string = storage.castNum(self.diamond);
                })
            ));
        }
        else
        {
            this.diamond_label.string = storage.castNum(this.diamond);
        }
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
        cc.GAME.adCheck = true;
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
                else if(con.id == "adCheck")
                {
                    cc.GAME.adCheck = con.value == 1 ? true : false;
                }
                else
                {
                    cc.GAME[con.id] = con.value;
                }
            }

        }

        //this.share_btn.active = cc.GAME.share;

    },

    addBox: function()
    {
        if(this.boxs.length<30)
        {
            var lock = this.unLock;
            if(this.boxs.length < lock+1 || this.boxs.length<3)
            {
                var box = cc.instantiate(cc.res["prefab_box"]);
                box.getComponent("box").init(this.boxs.length+1);
                this.scrollContent.addChild(box);

                box.y = -box.height*this.boxs.length-487;

                this.boxs.push(box);
                this.scrollContent.height = box.height*this.boxs.length+487;
                cc.log(this.boxs.length);

                this.updateBox();
                this.scheduleOnce(this.addBox.bind(this),0.05);

                if(this.boxs.length == lock)
                    this.updateLixian();
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

        this.carvup_num.string = "lv"+storage.getCarVLv();
    },

    carhup: function()
    {
        this.car2.lvup();
        this.task.updateUI();

        this.carhup_num.string = "lv"+storage.getCarHLv();
    },

    judgeUnLock: function(lv)
    {
        var lock = this.unLock;
        if(lock<30 && lv<=30)
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
            if(box.y>h-y-box.height*2 || -box.y-y>h)
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

            qianqista.uploadScore(this.toalcoin/config.totalCoinRate);

            var self = this;
            qianqista.rankSelf(function(res2){
                var rankNum = res2.data;
                storage.setMaxRank(rankNum);
                self.updateRed();
            });
        }
    },

    updateLixian: function()
    {
        if(this.yindao == 14 || this.yindao >= 22)
        {
            var now = new Date().getTime();
            var time = storage.getLixianTime();
            var t = (now-time)/1000-20;
            if(t>0)
            {
                if(t>0.5*60*60) t = 0.5*60*60;
                storage.setLixianTime(now);
                var val = this.getSecVal()*t;
                if(val>0)
                    res.openUI("lixian",null,val);
            }
        }
    },

    updateDogcardShouyi: function()
    {
        var dogcard = storage.getDogCard();
        var seldata = cc.res.conf_cardText[dogcard-1];
        var cardLv = storage.getDogCardLv(dogcard);

        var rate = Number(seldata.base)+Number(seldata.ratio)*cardLv;
        var time = 24;
        var to = new Date().getTime() + time*60*60*1000;

        var ishave = false;
        var isupdate = false;
        var rateTasks = storage.getAddRateTask();
        for(var i=0;i<rateTasks.length;i++)
        {
            var rateTask = rateTasks[i];
            if(rateTask.tip.indexOf("牧羊犬") != -1)
            {
                ishave = true;
                if(rateTask.reward != rate)
                {
                    rateTasks[i].reward = rate;
                    rateTasks[i].time = time;
                    rateTasks[i].to = to;
                    rateTasks[i].tip = "牧羊犬加倍"+rate.toFixed(2);
                    storage.updateAddRateTask(rateTasks);
                    isupdate = true;
                }
                break;
            }
        }

        if(!ishave)
        {
            var task = {reward:rate,time:time,tip:"牧羊犬加倍"+rate.toFixed(2),to:to};
            storage.addAddRateTask(task);
        }
    },

    initShouYi: function()
    {

        if(cc.gjiabeilist.length>0)
        {
            var rate = 2;
            var tips = "1人助力2倍收益";
            if(cc.gjiabeilist.length>=6)
            {
                rate = 4;
                tips = "6人助力4倍收益";
            }
            else if(cc.gjiabeilist.length>=3)
            {
                rate = 3;
                tips = "3人助力3倍收益";
            }

            var mt = new Date();
            mt.setHours(23);
            mt.setMinutes(59);
            mt.setSeconds(59);

            var time = (mt.getTime() - new Date().getTime())/(60*60*1000.0);
            var to = new Date().getTime() + time*60*60*1000;

            var ishave = false;
            var isupdate = false;
            var rateTasks = storage.getAddRateTask();
            for(var i=0;i<rateTasks.length;i++)
            {
                var rateTask = rateTasks[i];
                if(rateTask.tip.indexOf("助力") != -1)
                {
                    ishave = true;
                    if(rateTask.reward != rate)
                    {
                        rateTasks[i].reward = rate;
                        rateTasks[i].time = time;
                        rateTasks[i].tip = tips;
                        storage.updateAddRateTask(rateTasks);
                        isupdate = true;
                    }
                    break;
                }
            }

            if(!ishave)
            {
                var task = {reward:rate,time:time,tip:tips,to:to};
                storage.addAddRateTask(task);
            }
        }
        this.updateDogcardShouyi();

        this.shouYiRate = 1;

        this.rateTask = storage.getAddRateTask();

        //if(rateTasks.length>0)
        //{
        //    this.rateTask = rateTasks[0];
        //    this.rateTaskTime = storage.getAddRateTime();
        //}
        //else
        //{
        //    this.rateTask = undefined;
        //}

        this.shouYiSpeed = 1;
        this.speedTask = storage.getAddSpeedTask();
        //if(speedTasks.length>0)
        //{
        //    this.speedTask = speedTasks[0];
        //    this.speedTaskTime = storage.getAddSpeedTime();
        //}
        //else
        //{
        //    this.speedTask = undefined;
        //}
    },

    updateShouYi: function(dt)
    {
        this.shouyiDt += dt;
        if(this.shouyiDt>1)
        {
            this.shouyiDt = 0;

            var rate = 1;
            if(this.rateTask && this.rateTask.length>0)
            {
                var now = new Date().getTime();
                for(var i=0;i<this.rateTask.length;i++)
                {
                    var task = this.rateTask[i];
                    if(task.to>now)
                    {
                        rate += task.reward;
                    }
                    else
                    {
                        storage.removeAddRateTask(i);
                        this.initShouYi();
                        break;
                    }
                }
                if(rate>1) rate -= 1;
                //var time = this.rateTaskTime+this.rateTask.time*60*60*1000;
                //if(now<time)
                //{
                //    this.shouYiRate = this.rateTask.reward;
                //}
                //else
                //{
                //    this.shouYiRate = undefined;
                //    storage.removeAddRateTask();
                //    this.initShouYi();
                //}
            }
            this.shouYiRate = rate;

            var speed = 1;
            if(this.speedTask && this.speedTask.length>0)
            {
                var now = new Date().getTime();
                for(var i=0;i<this.speedTask.length;i++)
                {
                    var task = this.speedTask[i];
                    if(task.to>now)
                    {
                        speed += task.reward;
                    }
                    else
                    {
                        storage.removeAddSpeedTask(i);
                        this.initShouYi();
                        break;
                    }
                }
                if(speed>1) speed -= 1;
                //var time = this.speedTaskTime+this.speedTask.time*60*60*1000;
                //if(now<time)
                //{
                //    this.shouYiSpeed = this.speedTask.reward;
                //}
                //else
                //{
                //    this.shouYiSpeed = undefined;
                //    storage.removeAddSpeedTask();
                //    this.initShouYi();
                //}
            }
            this.shouYiSpeed = speed;
        }
    },

    updateRed: function()
    {
        //排行
        var maxRank = storage.getMaxRank();
        var showRank = false;
        for(var i=0;i<res.conf_rankUp.length;i++)
        {
            var data = res.conf_rankUp[i];
            if(!storage.isRankUp(data.id))
            {
                if(maxRank!=0 && maxRank<=parseInt(data.back))
                {
                    showRank = true;
                }
            }
        }
        if(!showRank)
        {
            var yesRank = storage.getYesRank();

            var awardId = -1;
            var yestime = storage.getYesRankTime();
            var now = new Date().getTime();
            if(yesRank != 0 && res.isRestTime(yestime,now))
            {
                for(var i=0;i<res.conf_rankAward.length;i++)
                {
                    var data = res.conf_rankAward[i];
                    if(yesRank>=parseInt(data.front) &&
                        yesRank<=parseInt(data.back) )
                    {
                        awardId = i;
                        break;
                    }
                }
            }
            if(awardId != -1)
                showRank = true;
        }

        //转盘
        var showChoujiang = false;
        var choujiangNum = storage.getChoujiangNum();
        showChoujiang = choujiangNum>0 ? true : false;
        if(!showChoujiang)
        {
            var choujiangTime = storage.getChoujiangTime();
            var now = new Date().getTime();
            if(choujiangNum < 5)
            {
                if(now - choujiangTime>5*60*1000)
                {
                    var num = Math.floor((now - choujiangTime)/(5*60*1000));
                    choujiangNum += num;
                    if(choujiangNum>5) choujiangNum = 5;
                    showChoujiang = choujiangNum>0 ? true : false;
                }
            }
        }

        //签到
        var showQiandao = false;
        var loginDay = storage.getLoginDay();
        var qiandaoNum = storage.getQianDaoNum();
        if(loginDay>qiandaoNum && qiandaoNum<7)
            showQiandao = true;

        //探险
        var showTanxian = false;
        if(storage.getTxNum()>0)
        {
            showTanxian = true;
        }
        else
        {
            var txTime = storage.getTxTime();
            var now = new Date().getTime();
            if(txTime>0 && now>=txTime)
            {
                showTanxian = true;
            }
        }

        //商店
        var showShop = false;
        var freeDiaNum = storage.getFreeDiaNum();
        if(freeDiaNum == 1) showShop = true;


        cc.find("top/buttons/rank/red",this.node_main).active = showRank;
        cc.find("top/buttons/zhuanpan/red",this.node_main).active = showChoujiang;
        cc.find("top/buttons/qiandao/red",this.node_main).active = showQiandao;
        cc.find("top/buttons/tanxian/red",this.node_main).active = showTanxian;
        cc.find("top/buttons/shop/red",this.node_main).active = showShop;
    },

    updateYindao: function()
    {
        if(this.yindao<22)
        {
            this.yindao += 1;
            storage.setYinDao(this.yindao);

            storage.uploadYinDao();

            var node = this.node.getChildByName("ui_yindao");
            if(node)
            {
                node.active = true;
                if(node.zIndex != 999) node.zIndex = 999;
                node.getComponent("yindao").updateYindao();
            }
        }
    },

    hideYindao: function()
    {
        var node = this.node.getChildByName("ui_yindao");
        if(node)
        {
            node.active = false;
        }
    },

    updateFlyCoin: function()
    {
        var now = new Date().getTime();
        if(!this.flyCoinTime)
        {
            this.flyCoinTime = now;

            var flycoin = cc.find("top/flycoin",this.node_main);
            flycoin.active = true;
            flycoin.x = -cc.winSize.width/2-flycoin.width;

            flycoin.runAction(cc.repeatForever(cc.sequence(
                cc.moveBy(8,cc.winSize.width+flycoin.width,0),
                cc.moveBy(8,-cc.winSize.width-flycoin.width,0)
            )));
        }
    },

    touchBox: function(pos)
    {
        for(var i=0;i<this.boxs.length;i++)
        {
            this.boxs[i].sc.touchBox(pos);
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

            this.scrollControlUp.active = y<10?false:true;
            this.scrollControlDown.active = h-y<10?false:true;
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
            if(sdk.judgePower())
                res.openUI("rank");
            else
            {
                res.openUI("power");
                sdk.openSetting(function(r){
                    res.closeUI("power");
                    if(r){
                        res.showToast("成功获取权限！");
                        cc.qianqista.event("授权_允许");
                    }
                    else
                    {
                        res.showToast("请允许授权！");
                        cc.qianqista.event("授权_拒绝");
                    }
                });
            }
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
        else if(data == "shouyi")
        {
            //res.openUI("shouyi");
        }
        else if(data == "up")
        {
            this.scroll.scrollToTop(1);
            this.scrollControlUp.active =false;
            this.scrollControlDown.active =true;
        }
        else if(data == "down")
        {
            this.scroll.scrollToBottom(1);
            this.scrollControlUp.active =true;
            this.scrollControlDown.active =false;
        }
        else if(data == "skill")
        {
            res.openUI("skill");
        }
        else if(data == "shouyifanbei")
        {
            res.openUI("shouyifanbei");
        }
        else if(data == "flycoin")
        {
            res.openUI("freecoin");
        }
        else if(data == "shop")
        {
            res.openUI("shop");
        }
        else if(data == "dog")
        {
            res.openUI("dog");
        }
        else if(data == "tanxian")
        {
            res.openUI("tanxian");
        }
        storage.playSound(res.audio_button);
        cc.log(data);
    },


    addListener: function()
    {
        var s = cc.winSize;
        var self = this;
        this.scrollContent.on(cc.Node.EventType.TOUCH_START, function (event) {
            var pos = event.getLocation();
            this.lastTouchPos = pos;
            //if(this.state == "start")
            //{
            //
            //}

            var node = cc.res.playPlistAnim3(cc.res["TouchParti.plist"],0.04,1,null,true);
            node.position = pos.sub(cc.v2(s.width/2, s.height/2));
            node.scale = 2;
            this.node.addChild(node);

        }, this);
        //this.scrollContent.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        //
        //}, this);
        this.scrollContent.on(cc.Node.EventType.TOUCH_END, function (event) {
            var pos = event.getLocation();
            if(pos.sub(this.lastTouchPos).mag()<20)
            {
                this.touchBox(pos.sub(cc.v2(s.width/2,s.height/2)));
            }
        }, this);
    },


    update: function(dt) {
        this.updateCoin(dt);
        this.updateShouYi(dt);
    }
});