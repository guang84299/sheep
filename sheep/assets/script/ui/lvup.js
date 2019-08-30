var storage = require("storage");
var res = require("res");

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad: function()
    {

        
    },
    initUI: function()
    {
        this.bg = cc.find("bg",this.node);

        this.box1 = cc.find("box",this.bg);
        this.box2 = cc.find("box2",this.bg);
        this.box3 = cc.find("box3",this.bg);

        this.title1 = cc.find("title/num1",this.bg).getComponent(cc.Label);
        this.title2 = cc.find("title/lvbox/num2",this.bg).getComponent(cc.Label);
        this.buoyIcon = cc.find("buoyIcon",this.box1);
        this.pro =  cc.find("pro",this.box1).getComponent(cc.ProgressBar);
        this.buoyDesc = cc.find("buoyDesc",this.box1).getComponent(cc.Label);

        this.icon1_val = cc.find("box/icon1/val",this.bg).getComponent(cc.Label);
        this.icon1_val2 = cc.find("box/icon1/val2",this.bg).getComponent(cc.Label);
        this.icon2_val = cc.find("box/icon2/val",this.bg).getComponent(cc.Label);
        this.icon2_val2 = cc.find("box/icon2/val2",this.bg).getComponent(cc.Label);
        this.icon3_val = cc.find("box/icon3/val",this.bg).getComponent(cc.Label);
        this.icon3_val2 = cc.find("box/icon3/val2",this.bg).getComponent(cc.Label);
        this.icon4_val = cc.find("box/icon4/val",this.bg).getComponent(cc.Label);
        this.icon4_val2 = cc.find("box/icon4/val2",this.bg).getComponent(cc.Label);

        this.cost10 = cc.find("box/up10/costbg/cost",this.bg).getComponent(cc.Label);
        this.up_rate10 = cc.find("box/up10/desc",this.bg).getComponent(cc.Label);

        this.cost1 = cc.find("box/up1/costbg/cost",this.bg).getComponent(cc.Label);
        this.up_rate1 = cc.find("box/up1/desc",this.bg).getComponent(cc.Label);

        this.peiyangsuc = cc.find("peiyangsuc",this.node);
        this.peiyangsuc.active = false;

        if(this.index == 1)
        {
            cc.find("toggles/toggle2",this.bg).active = false;
            cc.find("toggles/toggle3",this.bg).active = false;
        }

        this.updateRed();
        this.open1();
    },

    open1: function()
    {
        this.box1.active = true;
        this.box2.active = false;
        this.box3.active = false;
    },

    open2: function()
    {
        this.box1.active = false;
        this.box2.active = true;
        this.box3.active = false;

        this.updatePage2();

    },

    open3: function()
    {
        this.box1.active = false;
        this.box2.active = false;
        this.box3.active = true;

        this.updatePage3();

    },

    updateRed: function()
    {
        if(this.index > 1)
        {
            var data = cc.res.conf_compose[this.index-1];
            var sheep = storage.getSheep(parseInt(data.id));
            var buoy = storage.getBuoy(parseInt(data.newKnife));

            var red1 = cc.find("toggles/toggle2/red",this.bg);
            var red2 = cc.find("toggles/toggle3/red",this.bg);
            red1.active = sheep == 3 ? false : true
            red2.active = buoy == 3 ? false : true;

            if(red1.active && !red1.isAni)
            {
                red1.isAni = true;
                red1.runAction(cc.repeatForever(cc.jumpBy(1,0,0,16,2)));
            }
            if(red2.active && !red2.isAni)
            {
                red2.isAni = true;
                red2.runAction(cc.repeatForever(cc.jumpBy(1,0,0,16,2)));
            }
        }
    },

    updateUI: function()
    {
        var lv = storage.getLevel(this.index);
        this.title1.string = this.index;
        this.title2.string = "lv"+lv;

        var type = cc.res.conf_grade[this.index-1].knifeType;
        var nexlLv = this.findNextBuoy(lv);
        var sp = cc.res["sheep_buoy.plist"].getSpriteFrame("buoyIcon"+type+"_"+res.conf_base[nexlLv-1].buoyNum);
        this.buoyIcon.getComponent(cc.Sprite).spriteFrame = sp;
        //res.setSpriteFrame("images/buoy/buoyIcon"+this.index+"_"+res.conf_base[nexlLv-1].buoyNum,this.buoyIcon);

        this.pro.progress = lv/nexlLv;
        if(Math.abs(nexlLv-lv)<1)
            this.buoyDesc.string = "剪刀数量已达最大值！";
        else
            this.buoyDesc.string = "下次增加剪刀要达到"+nexlLv+"级";

        var nlv = lv+1;
        if(nlv>res.conf_base.length) nlv = res.conf_base.length;

        this.icon1_val.string = res.conf_base[lv-1].growSpeed+"秒";
        this.icon1_val2.string = (Number(res.conf_base[nlv-1].growSpeed)-Number(res.conf_base[lv-1].growSpeed)).toFixed(2)+"秒";

        var datacompose = cc.res.conf_compose[this.index-1];
        var sheep = storage.getSheep(parseInt(datacompose.id));

        var pice = Number(res.conf_price[lv-1]["price"+this.index]);
        var pice2 = Number(res.conf_price[nlv-1]["price"+this.index]);

        if(sheep == 3)
        {
            pice *= 1.3;
            pice2 *= 1.3;
        }

        this.icon2_val.string = storage.castNum(pice);
        this.icon2_val2.string = "+"+storage.castNum(pice2-pice);

        this.icon3_val.string = res.conf_base[lv-1].buoyNum;
        this.icon3_val2.string = "+"+(Number(res.conf_base[nlv-1].buoyNum)-Number(res.conf_base[lv-1].buoyNum));

        this.icon4_val.string = res.conf_base[lv-1].buoySpeed;
        this.icon4_val2.string = "+"+(Number(res.conf_base[nlv-1].buoySpeed)-Number(res.conf_base[lv-1].buoySpeed)).toFixed(2);

        var costDate = this.getCost(lv,1);
        this.cost1.string = storage.castNum(costDate.cost);
        this.up_rate1.string = costDate.n;

        var costDate = this.getCost(lv,10);
        this.cost10.string = storage.castNum(costDate.cost);
        this.up_rate10.string = costDate.n;

    },

    findNextBuoy: function(lv)
    {
        var nlv = lv;
        var currNum = res.conf_base[lv-1].buoyNum;
        for(var i=lv;i<res.conf_base.length;i++)
        {
            if(currNum != res.conf_base[i].buoyNum)
            {
                nlv = i+1;
                break;
            }
        }
        return nlv;
    },

    getCost: function(lv,num)
    {
        var cost = 0;
        var n = 0;
        for(var i=0;i<num;i++)
        {
            if(lv+i<res.conf_cost.length)
            {
                var c = Number(res.conf_cost[lv+i]["ranch"+this.index]);
                cost += c;
                n++;
            }
            else
            break;
        }
        return {cost:cost,n:n};
    },

    lvup: function(rate)
    {
        var lv = storage.getLevel(this.index);
        var costDate = this.getCost(lv,rate);

        if(costDate.n<1)
        {
            res.showToast("等级已满！");
        }
        else
        {
            if(this.game.coin>=costDate.cost)
            {
                this.game.addCoin(-costDate.cost);

                storage.setLevel(this.index,lv+costDate.n);
                storage.uploadLevel(this.index);
                this.updateUI();
                this.game.lvupBox(this.index);

                if(!this.isPlaySheep)
                {
                    this.isPlaySheep = true;
                    var self = this;
                    cc.storage.playSound(cc.res.audio_sheep);
                    this.scheduleOnce(function(){
                        self.isPlaySheep = false;
                    },10);
                }

            }
            else
            {
                res.showToast("金币不足！");
                cc.res.openUI("freecoin");
            }
        }
    },

    updatePage2: function()
    {
        this.unscheduleAllCallbacks();
        this.sheepPeiyuState = 0;

        var btn_video = cc.find("btn_video",this.box2);
        var btn_tanxian = cc.find("btn_tanxian",this.box2);

        var yangmao_icon = cc.find("yangmao/icon",this.box2);
        var yangmao_pro = cc.find("yangmao/pro",this.box2).getComponent(cc.ProgressBar);
        var yangmao_pro_num = cc.find("yangmao/pro/num",this.box2).getComponent(cc.Label);
        var yangmao_desc = cc.find("yangmao/desc",this.box2).getComponent(cc.Label);

        var siliao_icon = cc.find("siliao/icon",this.box2);
        var siliao_pro = cc.find("siliao/pro",this.box2).getComponent(cc.ProgressBar);
        var siliao_pro_num = cc.find("siliao/pro/num",this.box2).getComponent(cc.Label);
        var siliao_desc = cc.find("siliao/desc",this.box2).getComponent(cc.Label);

        var yang_icon = cc.find("yang/icon",this.box2);
        var yang_peiyu = cc.find("yang/peiyu",this.box2);
        var yang_peiyu_state1 = cc.find("yang/peiyu/state1",this.box2);
        var yang_peiyu_state2 = cc.find("yang/peiyu/state2",this.box2);

        var data = cc.res.conf_compose[this.index-1];

        cc.res.setSpriteFrameAtlas("images/main","car_mao"+(parseInt(data.woolImage)+1),yangmao_icon);
        cc.res.setSpriteFrame("images/cailiao/sl/"+data.feedImage,siliao_icon);
        var sheepConf = cc.config.sheepAnim[parseInt(data.newSheep)];
        cc.res.setSpriteFrame("images/sheepIcon/sheepIcon"+sheepConf.lv,yang_icon);
        yang_icon.color = sheepConf.color;

        btn_video.active = true;
        btn_tanxian.active = true;
        yang_peiyu.active = true;

        //是否已经解锁 0：未解锁 1:解锁 2：使用
        var sheep = storage.getSheep(parseInt(data.id));
        if(sheep == 0)
        {
            var p1 = false;
            var p2 = false;
            var now = new Date().getTime();

            var woolTime = storage.getCailiaoTime(1,parseInt(data.wool));
            var addWool = Math.floor(((now-woolTime)/1000)/parseInt(data.woolTime));
            var wool = storage.getCailiao(1,parseInt(data.wool));
            if(addWool>0)
            {
                wool += addWool;
                if(wool>parseInt(data.woolCost)) wool = parseInt(data.woolCost);
                storage.setCailiao(1,parseInt(data.wool),wool);
                storage.setCailiaoTime(1,parseInt(data.wool),now);
            }


            var feedTime = storage.getCailiaoTime(2,parseInt(data.feed));
            var addFeed = Math.floor(((now-feedTime)/1000)/parseInt(data.feedTime));
            var feed = storage.getCailiao(2,parseInt(data.feed));
            if(addFeed>0)
            {
                feed += addFeed;
                if(feed>parseInt(data.feedCost)) feed=parseInt(data.feedCost);
                storage.setCailiao(2,parseInt(data.feed),feed);
                storage.setCailiaoTime(2,parseInt(data.feed),now);
            }

            yangmao_pro.progress = wool/parseFloat(data.woolCost);
            yangmao_pro_num.string = wool+"/"+data.woolCost;
            if(wool>=parseInt(data.woolCost))
            {
                yangmao_desc.string = "00:00";//"收集完成";
                p1 = true;
            }
            else
            {
                //yangmao_desc.string = "每"+data.woolTime+"秒增加1个";
                var t2 = Number(data.woolTime)*(parseInt(data.woolCost)-wool)*1000+now - (now-woolTime);
                yangmao_desc.string = storage.getCountDown(now,t2,2);
            }

            siliao_pro.progress = feed/parseFloat(data.feedCost);
            siliao_pro_num.string = feed+"/"+data.feedCost;
            if(feed>=parseInt(data.feedCost))
            {
                siliao_desc.string = "00:00";//"收集完成";
                p2 = true;
            }
            else
            {
                //siliao_desc.string = "每"+data.feedTime+"秒增加1个";
                var t2 = Number(data.feedTime)*(parseInt(data.feedCost)-feed)*1000+now-(now-feedTime);
                siliao_desc.string = storage.getCountDown(now,t2,2);
            }

            var updateTime = 1;
            if(p1 && p2)
            {
                var peiyuTime = storage.getPeiyuTime(1,parseInt(data.id));

                if(peiyuTime==0)
                {
                    peiyuTime = now+(parseInt(data.sheepTime)*1000);
                    storage.setPeiyuTime(1,parseInt(data.id),peiyuTime);
                }

                yang_peiyu_state1.active = false;
                yang_peiyu_state2.active = true;
                var timeLabel = cc.find("time",yang_peiyu_state2).getComponent(cc.Label);
                timeLabel.string = storage.getCountDown(now,peiyuTime,2);

                if(now>=peiyuTime)
                {
                    storage.setSheep(parseInt(data.id),1);
                    storage.uploadSheep(parseInt(data.id));
                    //this.openpeiyangsuc(true);
                }
                updateTime = 1;
                this.sheepPeiyuState = 1;
            }

            if(parseInt(data.woolTime)<updateTime)
                updateTime = parseInt(data.woolTime);
            if(parseInt(data.feedTime)<updateTime)
                updateTime = parseInt(data.feedTime);

            this.scheduleOnce(this.updatePage2.bind(this),updateTime);
        }
        else
        {
            yangmao_pro.progress = 1;
            yangmao_pro_num.string = data.woolCost+"/"+data.woolCost;
            siliao_pro.progress = 1;
            siliao_pro_num.string = data.feedCost+"/"+data.feedCost;

            btn_video.active = false;
            btn_tanxian.active = false;
            yangmao_desc.string = "00:00";
            siliao_desc.string = "00:00";

            yang_peiyu_state1.active = true;
            yang_peiyu_state2.active = false;
            if(sheep == 1)
            {
                this.sheepPeiyuState = 2;
                cc.find("str1",yang_peiyu_state1).active = true;
                cc.find("str2",yang_peiyu_state1).active = false;
                //cc.find("str",yang_peiyu_state1).getComponent(cc.Label).string = "培育";
            }
            else if(sheep == 2)
            {
                this.sheepPeiyuState = 3;
                cc.find("str1",yang_peiyu_state1).active = false;
                cc.find("str2",yang_peiyu_state1).active = true;
                //cc.find("str",yang_peiyu_state1).getComponent(cc.Label).string = "放入羊场";
            }
            else
            {
                this.sheepPeiyuState = 4;
                yang_peiyu.active = false;
                //cc.find("str",yang_peiyu_state1).getComponent(cc.Label).string = "已放入羊场";
            }
        }
    },

    updatePage3: function()
    {
        this.unscheduleAllCallbacks();
        this.buoyPeiyuState = 0;

        var btn_video = cc.find("btn_video",this.box3);
        var btn_tanxian = cc.find("btn_tanxian",this.box3);

        var yangmao_icon = cc.find("yangmao/icon",this.box3);
        var yangmao_pro = cc.find("yangmao/pro",this.box3).getComponent(cc.ProgressBar);
        var yangmao_pro_num = cc.find("yangmao/pro/num",this.box3).getComponent(cc.Label);
        var yangmao_desc = cc.find("yangmao/desc",this.box3).getComponent(cc.Label);

        var siliao_icon = cc.find("siliao/icon",this.box3);
        var siliao_pro = cc.find("siliao/pro",this.box3).getComponent(cc.ProgressBar);
        var siliao_pro_num = cc.find("siliao/pro/num",this.box3).getComponent(cc.Label);
        var siliao_desc = cc.find("siliao/desc",this.box3).getComponent(cc.Label);

        var yang_icon = cc.find("yang/icon",this.box3);
        var yang_peiyu = cc.find("yang/peiyu",this.box3);
        var yang_peiyu_state1 = cc.find("yang/peiyu/state1",this.box3);
        var yang_peiyu_state2 = cc.find("yang/peiyu/state2",this.box3);

        btn_video.active = true;
        btn_tanxian.active = true;
        yang_peiyu.active = true;

        //var str = cc.find("str",yang_peiyu_state1).getComponent(cc.Label);

        var data = cc.res.conf_compose[this.index-1];

        cc.res.setSpriteFrame("images/cailiao/ks/"+data.oreImage,yangmao_icon);
        cc.res.setSpriteFrame("images/cailiao/tz/"+data.chartImage,siliao_icon);

        var sp = cc.res["sheep_buoy.plist"].getSpriteFrame("buoyIcon"+data.newKnife+"_1");
        yang_icon.getComponent(cc.Sprite).spriteFrame = sp;

        //是否已经解锁 0：未解锁 1:解锁 2：使用
        var buoy = storage.getBuoy(parseInt(data.newKnife));
        if(buoy == 0)
        {
            var p1 = false;
            var p2 = false;
            var now = new Date().getTime();

            var oreTime = storage.getCailiaoTime(3,parseInt(data.ore));
            var addore = Math.floor(((now-oreTime)/1000)/parseInt(data.oreTime));
            var ore = storage.getCailiao(3,parseInt(data.ore));
            if(addore>0)
            {
                ore += addore;
                if(ore>parseInt(data.oreCost)) ore = parseInt(data.oreCost);
                storage.setCailiao(3,parseInt(data.ore),ore);
                storage.setCailiaoTime(3,parseInt(data.ore),now);
            }


            var chartTime = storage.getCailiaoTime(4,parseInt(data.chart));
            var addchart = Math.floor(((now-chartTime)/1000)/parseInt(data.chartTime));
            var chart = storage.getCailiao(4,parseInt(data.chart));
            if(addchart>0)
            {
                chart += addchart;
                if(chart>parseInt(data.chartCost)) chart=parseInt(data.chartCost);
                storage.setCailiao(4,parseInt(data.chart),chart);
                storage.setCailiaoTime(4,parseInt(data.chart),now);
            }


            yangmao_pro.progress = ore/parseFloat(data.oreCost);
            yangmao_pro_num.string = ore+"/"+data.oreCost;
            if(ore>=parseInt(data.oreCost))
            {
                yangmao_desc.string = "00:00";//"收集完成";
                p1 = true;
            }
            else
            {
                //yangmao_btn_video.active = true;
                //yangmao_btn_tanxian.active = true;
                //yangmao_desc.string = "每"+data.oreTime+"秒增加1个";

                var t2 = Number(data.oreTime)*(parseInt(data.oreCost)-ore)*1000+now - (now-oreTime);
                yangmao_desc.string = storage.getCountDown(now,t2,2);
            }

            siliao_pro.progress = chart/parseFloat(data.chartCost);
            siliao_pro_num.string = chart+"/"+data.chartCost;
            if(chart>=parseInt(data.chartCost))
            {
                siliao_desc.string = "00:00";
                p2 = true;
            }
            else
            {
                var t2 = Number(data.chartTime)*(parseInt(data.chartCost)-chart)*1000+now - (now-chartTime);
                siliao_desc.string = storage.getCountDown(now,t2,2);
            }

            var updateTime = 1;
            if(p1 && p2)
            {
                var peiyuTime = storage.getPeiyuTime(2,parseInt(data.newKnife));

                if(peiyuTime==0)
                {
                    peiyuTime = now+(parseInt(data.knifeTime)*1000);
                    storage.setPeiyuTime(2,parseInt(data.newKnife),peiyuTime);
                }

                yang_peiyu_state1.active = false;
                yang_peiyu_state2.active = true;
                var timeLabel = cc.find("time",yang_peiyu_state2).getComponent(cc.Label);
                timeLabel.string = storage.getCountDown(now,peiyuTime,2);

                if(now>=peiyuTime)
                {
                    storage.setBuoy(parseInt(data.newKnife),1);
                    storage.uploadBuoy(parseInt(data.newKnife));
                    //this.openpeiyangsuc();
                }
                updateTime = 1;
                this.buoyPeiyuState = 1;
            }

            if(parseInt(data.oreTime)<updateTime)
                updateTime = parseInt(data.oreTime);
            if(parseInt(data.chartTime)<updateTime)
                updateTime = parseInt(data.chartTime);

            this.scheduleOnce(this.updatePage3.bind(this),updateTime);
        }
        else
        {
            yangmao_pro.progress = 1;
            yangmao_pro_num.string = data.oreCost+"/"+data.oreCost;
            siliao_pro.progress = 1;
            siliao_pro_num.string = data.chartCost+"/"+data.chartCost;

            btn_video.active = false;
            btn_tanxian.active = false;
            yangmao_desc.string = "00:00";
            siliao_desc.string = "00:00";

            yang_peiyu_state1.active = true;
            yang_peiyu_state2.active = false;
            if(buoy == 1)
            {
                this.buoyPeiyuState = 2;
                //str.string = "研发";
                cc.find("str1",yang_peiyu_state1).active = true;
                cc.find("str2",yang_peiyu_state1).active = false;
            }
            else if(buoy == 2)
            {
                this.buoyPeiyuState = 3;
                //str.string = "放入羊场";
                cc.find("str1",yang_peiyu_state1).active = false;
                cc.find("str2",yang_peiyu_state1).active = true;
            }
            else
            {
                this.buoyPeiyuState = 4;
                //str.string = "已放入羊场";
                yang_peiyu.active = false;
            }
        }
    },

    openpeiyangsuc: function(isSheep)
    {
        this.peiyangsuc.active = true;

        var title = cc.find("title",this.peiyangsuc);
        var icon = cc.find("icon",this.peiyangsuc);
        var desc = cc.find("desc",this.peiyangsuc).getComponent(cc.Label);
        var btn = cc.find("btn",this.peiyangsuc).getComponent(cc.Button);

        var data = cc.res.conf_compose[this.index-1];
        icon.stopAllActions();
        if(isSheep)
        {
            cc.res.setSpriteFrameAtlas("images/lvup","peiyuchengg",title);
            icon.scale = 0.8;
            desc.string = "获得新羊";

            var sheepConf = cc.config.sheepAnim[parseInt(data.newSheep)];
            cc.res.setSpriteFrame("images/sheepIcon/sheepIcon"+sheepConf.lv,icon);
            icon.color = sheepConf.color;
        }
        else
        {
            cc.res.setSpriteFrameAtlas("images/lvup","yjchenggong",title);
            icon.scale = 1;
            desc.string = "获得新刀";

            icon.color = cc.color(255,255,255);
            var sp = cc.res["sheep_buoy.plist"].getSpriteFrame("buoy"+data.newKnife+"_1");
            icon.getComponent(cc.Sprite).spriteFrame = sp;
            icon.runAction(cc.repeatForever(cc.rotateBy(1,360)));
        }


        this.useShare = false;
        if(cc.GAME.share)
        {
            var rad = parseInt(cc.GAME.peiyusucAd);
            if(!cc.GAME.hasVideo) rad = 100;
            if(Math.random()*100 < rad)
            {
                this.useShare = true;
                btn.node.getChildByName("share").active = true;
                btn.node.getChildByName("video").active = false;
            }
            else
            {
                btn.node.getChildByName("share").active = false;
                btn.node.getChildByName("video").active = true;
            }
        }
        else
        {
            btn.node.getChildByName("share").active = false;
            btn.node.getChildByName("video").active = true;
        }

    },

    peiyu_sheep: function()
    {
        var self = this;
        if(this.sheepPeiyuState == 0)
        {
            res.showToast("材料不足！");
        }
        else if(this.sheepPeiyuState == 1)
        {
            var data = cc.res.conf_compose[this.index-1];
            cc.sdk.showVedio(function(r){
                if(r)
                {
                    storage.setPeiyuTime(1,parseInt(data.id),new Date().getTime());
                    storage.setSheep(parseInt(data.id),1);
                    storage.uploadSheep(parseInt(data.id));
                    self.sheepPeiyuState = 2;
                    //self.openpeiyangsuc(true);
                }
            });
        }
        else if(this.sheepPeiyuState == 2)
        {
            //var data = cc.res.conf_compose[this.index-1];
            //storage.setSheep(parseInt(data.id),2);
            //storage.uploadSheep(parseInt(data.id));
            //this.updatePage2();
            //this.sheepPeiyuState = 3;

            var data = cc.res.conf_compose[this.index-1];
            storage.setSheep(parseInt(data.id),3);
            storage.uploadSheep(parseInt(data.id));
            this.updatePage2();
            this.sheepPeiyuState = 4;

            this.game.boxs[this.index-1].sc.useNewSheep();

            this.updateRed();

            this.openpeiyangsuc(true);
        }
        else if(this.sheepPeiyuState == 3)
        {
            var data = cc.res.conf_compose[this.index-1];
            storage.setSheep(parseInt(data.id),3);
            storage.uploadSheep(parseInt(data.id));
            this.updatePage2();
            this.sheepPeiyuState = 4;

            this.game.boxs[this.index-1].sc.useNewSheep();

            this.updateRed();
        }
    },

    peiyu_buoy: function()
    {
        var self = this;
        if(this.buoyPeiyuState == 0)
        {
            res.showToast("材料不足！");
        }
        else if(this.buoyPeiyuState == 1)
        {
            var data = cc.res.conf_compose[this.index-1];
            cc.sdk.showVedio(function(r){
                if(r)
                {
                    storage.setPeiyuTime(2,parseInt(data.newKnife),new Date().getTime());
                    storage.setBuoy(parseInt(data.newKnife),1);
                    storage.uploadBuoy(parseInt(data.newKnife));
                    self.buoyPeiyuState = 2;
                    //self.openpeiyangsuc();
                }
            });
        }
        else if(this.buoyPeiyuState == 2)
        {
            //var data = cc.res.conf_compose[this.index-1];
            //storage.setBuoy(parseInt(data.newKnife),2);
            //storage.uploadBuoy(parseInt(data.newKnife));
            //this.updatePage3();
            //this.buoyPeiyuState = 3;

            var data = cc.res.conf_compose[this.index-1];
            storage.setBuoy(parseInt(data.newKnife),3);
            storage.uploadBuoy(parseInt(data.newKnife));
            this.updatePage3();
            this.buoyPeiyuState = 4;

            this.game.boxs[this.index-1].sc.useNewBuoy();

            this.updateRed();

            this.openpeiyangsuc();
        }
        else if(this.buoyPeiyuState == 3)
        {
            var data = cc.res.conf_compose[this.index-1];
            storage.setBuoy(parseInt(data.newKnife),3);
            storage.uploadBuoy(parseInt(data.newKnife));
            this.updatePage3();
            this.buoyPeiyuState = 4;

            this.game.boxs[this.index-1].sc.useNewBuoy();

            this.updateRed();
        }
    },

    mao_video: function()
    {
        var self = this;
        cc.sdk.showVedio(function(r){
            if(r)
            {
                var data = cc.res.conf_compose[self.index-1];
                storage.setCailiao(1,parseInt(data.wool),parseInt(data.woolCost));
                storage.setCailiao(2,parseInt(data.feed),parseInt(data.feedCost));
                self.updatePage2();
            }
        });

    },

    mao_video2: function()
    {
        var self = this;
        cc.sdk.showVedio(function(r){
            if(r)
            {
                var data = cc.res.conf_compose[self.index-1];
                storage.setCailiao(3,parseInt(data.ore),parseInt(data.oreCost));
                storage.setCailiao(4,parseInt(data.chart),parseInt(data.chartCost));
                self.updatePage3();
            }
        });

    },

    siliao_video: function()
    {
        var self = this;
        cc.sdk.showVedio(function(r){
            if(r)
            {
                var data = cc.res.conf_compose[self.index-1];
                storage.setCailiao(2,parseInt(data.feed),parseInt(data.feedCost));
                self.updatePage2();
            }
        });

    },

    siliao_video2: function()
    {
        var self = this;
        cc.sdk.showVedio(function(r){
            if(r)
            {
                var data = cc.res.conf_compose[self.index-1];
                storage.setCailiao(4,parseInt(data.chart),parseInt(data.chartCost));
                self.updatePage3();
            }
        });

    },

    tanxian: function()
    {
        cc.res.openUI("tanxian",null,this.index);
        //this.hide();
    },

    lingqu: function(x2)
    {
        var award = 10;
        if(x2) award *= 2;
        this.game.addDiamond(award);

        res.showToast("钻石+"+storage.castNum(award));
        this.peiyangsuc.active = false;
        //cc.res.showCoinAni();
    },

    show: function(index)
    {
        this.index = index;
        cc.log(index);
        //this.main.wxQuanState(false);
        this.game = cc.find("Canvas").getComponent("main");
        this.node.sc = this;
        this.initUI();
        this.updateUI();

        var self = this;
        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));


        if(this.game.yindao == 5)
        {
            this.node.opacity = 0;
            this.lvup(10);
            this.hide();
        }
        else
        {
            var self = this;
            cc.sdk.showBanner(this.bg,function(dis){
                if(dis<0)
                    self.bg.y -= dis;
            });
        }
        //storage.playSound(res.audio_win);
    },

    hide: function()
    {
        //this.main.wxQuanState(true);
        var self = this;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    self.node.destroy();
                })
            ));


        if(this.game.yindao == 5)
        {
            this.game.updateYindao();
            this.node.destroy();
        }
        else
        {
            cc.sdk.hideBanner();
        }

        if(this.index == 3 && this.game.needYindaoxiaotou)
        {
            this.game.needYindaoxiaotou = false;
            this.game.openXiaotou(3);
            this.game.scheduleOnce(function(){
                res.openUI("yindao",null,7);
            },0.5);
        }
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "toggle")
        {
            if(event.target.name == "toggle1")
                this.open1();
            else if(event.target.name == "toggle2")
                this.open2();
            else if(event.target.name == "toggle3")
                this.open3();
        }
        else if(data == "up10")
        {
            this.lvup(10);
        }
        else if(data == "up1")
        {
            this.lvup(1);
        }
        else if(data == "peiyu_sheep")
        {
            this.peiyu_sheep();
        }
        else if(data == "mao_video")
        {
            this.mao_video();
        }
        else if(data == "siliao_video")
        {
            this.siliao_video();
        }
        else if(data == "peiyu_buoy")
        {
            this.peiyu_buoy();
        }
        else if(data == "mao_video2")
        {
            this.mao_video2();
        }
        else if(data == "siliao_video2")
        {
            this.siliao_video2();
        }
        else if(data == "tanxian")
        {
            this.tanxian();
        }
        else if(data == "closepeiyangsuc")
        {
            this.lingqu();
        }
        else if(data == "lingqu")
        {
            var self = this;
            if(this.useShare)
            {
                cc.sdk.share(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                },"lvup");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                });
            }
        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
