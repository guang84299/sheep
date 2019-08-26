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

        this.box = cc.find("box",this.bg);
        this.item = cc.find("item",this.bg);
        this.level = cc.find("level",this.bg).getComponent(cc.Label);
        this.pro_num = cc.find("pro/num",this.bg).getComponent(cc.Label);
        this.pro = cc.find("pro",this.bg).getComponent(cc.ProgressBar);


        this.initBox();
    },

    updateUI: function()
    {
        this.level.string = "第"+storage.getTxLv()+"关";
        this.pro_num.string = this.tili+"/"+this.tiliTotal;
        this.pro.progress = this.tili/this.tiliTotal;
    },

    initBox: function()
    {
        //随机9-15个材料 id:材料id type 1:金币 2：钻石 3：体力+ 4：体力- 5：材料1 。。。
        var num = Math.floor(Math.random()*7)+9;
        this.cailiaos = [];
        this.cailiaos.push({tid:-1,type:1,id:0});
        this.cailiaos.push({tid:-1,type:2,id:0});
        this.cailiaos.push({tid:-1,type:3,id:0});
        this.cailiaos.push({tid:-1,type:4,id:0});

        //获取未解锁材料
        var cls = [];
        var index = this.game.unLock;
        var indexNum = 0;
        if(this.index)
        {
            index = this.index;
            indexNum = index-1;
        }
        for(var i=indexNum;i<index;i++)
        {
            var data = cc.res.conf_compose[i];
            //是否已经解锁 0：未解锁 1:解锁 2：使用
            var sheep = storage.getSheep(parseInt(data.id));
            if(sheep == 0)
            {
                var wool = storage.getCailiao(1,parseInt(data.wool));
                var feed = storage.getCailiao(2,parseInt(data.feed));


                if(wool<parseInt(data.woolCost))
                    cls.push({type:1,id:parseInt(data.wool),img:data.woolImage});
                if(feed<parseInt(data.feedCost))
                    cls.push({type:2,id:parseInt(data.feed),img:data.feedImage});
            }

            var buoy = storage.getBuoy(parseInt(data.newKnife));
            if(buoy == 0)
            {
                var ore = storage.getCailiao(3,parseInt(data.ore));
                var chart = storage.getCailiao(4,parseInt(data.chart));

                if(ore<parseInt(data.oreCost))
                    cls.push({type:3,id:parseInt(data.ore),img:data.oreImage});
                if(chart<parseInt(data.chartCost))
                    cls.push({type:4,id:parseInt(data.chart),img:data.chartImage});
            }

            if(cls.length>0) break;

        }

        for(var i=0;i<cls.length;i++)
        {
            this.cailiaos.push({tid:-1,type:cls[i].type+4,id:cls[i].id,img:cls[i].img});
        }
        //填充获得的材料
        for(var i=this.cailiaos.length;i<num;i++)
        {
            var type = Math.floor(Math.random()*5);
            if(type == 0)
            {
                if(cls.length>0)
                {
                    var cl = cls[Math.floor(Math.random()*cls.length)];
                    this.cailiaos.push({tid:-1,type:cl.type+4,id:cl.id,img:cl.img});
                }
            }
            else if(type == 1)
            {
                this.cailiaos.push({tid:-1,type:3,id:0});
            }
            else if(type == 2)
            {
                this.cailiaos.push({tid:-1,type:4,id:0});
            }
            else if(type == 3)
            {
                this.cailiaos.push({tid:-1,type:1,id:0});
            }
            else if(type == 4)
            {
                this.cailiaos.push({tid:-1,type:2,id:0});
            }
        }
        //为材料随机tid
        this.tids = [];
        for(var i=1;i<=25;i++)
            this.tids.push(i);
        for(var i=0;i<this.cailiaos.length;i++)
        {
            this.cailiaos[i].tid = this.geneTid();
        }

        this.nextLvTid = this.geneTid();

        this.box.destroyAllChildren();
        for(var i=1;i<=25;i++)
        {
            var item = cc.instantiate(this.item);
            item.scale = 0.95;
            item.active = true;
            item.tid = i;
            item.pstate = 1;//1: 可点 2：已点 3：不可点
            var icon = cc.find("icon",item);
            item.icon = icon;

            this.box.addChild(item);
        }

        this.isFirst = true;
    },

    geneTid: function()
    {
        var tidIndex = Math.floor(Math.random()*this.tids.length);
        var tid = this.tids[tidIndex];
        this.tids.splice(tidIndex,1);
        var l = true;
        var r = true;
        var t = true;
        var b = true;
        for(var i=0;i<this.cailiaos.length;i++)
        {
            if(this.cailiaos[i].tid == tid)
                return this.geneTid();
            if(this.cailiaos[i].tid-1 == tid)
                l = false;
            if(this.cailiaos[i].tid+1 == tid)
                r = false;
            if(this.cailiaos[i].tid-5 == tid)
                t = false;
            if(this.cailiaos[i].tid+5 == tid)
                b = false;
        }
        if(!l && !r)
            return this.geneTid();
        if(!t && !b)
            return this.geneTid();

        return tid;
    },


    btnitem: function(tid)
    {
        if(this.tili<=0)
        {
            res.showToast("体力不足！");
            cc.res.openUI("freetili");
            return;
        }

        var isFirst = false;
        if(this.isFirst)
        {
            isFirst = true;
            this.isFirst = false;
            for(var i=1;i<=25;i++)
            {
                if(tid != i)
                {
                    var item = this.box.children[i-1];
                    item.pstate = 3;//1: 可点 2：已点 3：不可点
                    //res.setSpriteFrame("images/tanxian/box1",item);
                }
            }
        }

        var item = this.box.children[tid-1];
        if(item.pstate==1)
        {
            this.tili -= 1;
            this.updateUI();

            item.pstate = 2;//1: 可点 2：已点 3：不可点
            res.setSpriteFrameAtlas("images/tanxian","box3",item);

            item.icon.width = 60;
            item.icon.height = 60;
            //材料
            var cailiao = null;
            for(var i=0;i<this.cailiaos.length;i++)
            {
                 if(this.cailiaos[i].tid == tid)
                 {
                     cailiao = this.cailiaos[i];
                     break;
                 }
            }

            //todo 设置材料图标 并获取材料
            if(cailiao)
            {

                if(cailiao.type == 3)
                {
                    item.icon.active = true;
                    var par = cc.find("par", item.icon).getComponent(cc.ParticleSystem);
                    //par.startColor = cc.color(51,253,155);
                    par.node.active = true;

                    res.setSpriteFrameAtlas("images/tanxian","tili",item.icon);
                    this.tili += 5;
                    this.updateUI();
                    res.showToast("体力+5");
                }
                else if(cailiao.type == 4)
                {
                    item.icon.active = true;
                    item.icon.width = 90;
                    item.icon.height = 90;

                    res.setSpriteFrameAtlas("images/tanxian","xianjing",item.icon);
                    this.tili -= 3;
                    this.updateUI();
                    res.showToast("体力-3");
                }
                else
                {
                    item.icon.active = true;
                    this.awards.push(cailiao);
                    if(cailiao.type == 1)
                    {
                        res.setSpriteFrameAtlas("images/common","coin",item.icon);
                        var par = cc.find("par", item.icon).getComponent(cc.ParticleSystem);
                        par.startColor = cc.color(220,220,13);
                        par.node.active = true;
                    }
                    else if(cailiao.type == 2)
                    {
                        res.setSpriteFrameAtlas("images/common","diamond",item.icon);
                        var par = cc.find("par", item.icon).getComponent(cc.ParticleSystem);
                        par.startColor = cc.color(240,22,230);
                        par.node.active = true;
                    }
                    else if(cailiao.type == 5)
                    {
                        res.setSpriteFrameAtlas("images/main","car_mao"+(parseInt(cailiao.img)+1),item.icon);
                    }
                    else if(cailiao.type == 6)
                    {
                        res.setSpriteFrame("images/cailiao/sl/"+cailiao.img,item.icon);
                    }
                    else if(cailiao.type == 7)
                    {
                        res.setSpriteFrame("images/cailiao/ks/"+cailiao.img,item.icon);
                    }
                    else if(cailiao.type == 8)
                    {
                        res.setSpriteFrame("images/cailiao/tz/"+cailiao.img,item.icon);
                    }
                }

            }

            //如果是出口
            if(tid == this.nextLvTid)
            {
                if(item.icon.active)
                {
                    this.nextLevel();
                    return;
                }
                else
                {
                    item.pstate = 1;
                    item.icon.active = true;
                    item.icon.width = 90;
                    item.icon.height = 90;
                    res.setSpriteFrameAtlas("images/tanxian","xycrk",item.icon);
                }
            }


            //设置周围格子可点
            if(tid-1>0 && tid%5 != 1)
            {
                var item2 = this.box.children[tid-1-1];
                if(item2.pstate == 3)
                {
                    item2.pstate = 1;
                    res.setSpriteFrameAtlas("images/tanxian","box2",item2);
                }
            }

            if(tid+1<25 && tid%5 != 0)
            {
                var item2 = this.box.children[tid+1-1];
                if(item2.pstate == 3)
                {
                    item2.pstate = 1;
                    res.setSpriteFrameAtlas("images/tanxian","box2",item2);
                }
            }

            if(tid-5>0)
            {
                var item2 = this.box.children[tid-5-1];
                if(item2.pstate == 3)
                {
                    item2.pstate = 1;
                    res.setSpriteFrameAtlas("images/tanxian","box2",item2);
                }
            }

            if(tid+5<=25)
            {
                var item2 = this.box.children[tid+5-1];
                if(item2.pstate == 3)
                {
                    item2.pstate = 1;
                    res.setSpriteFrameAtlas("images/tanxian","box2",item2);
                }
            }
        }


        if(isFirst)
        {
            for(var i=1;i<=25;i++)
            {
                var item = this.box.children[i-1];
                if(item.pstate == 3)//1: 可点 2：已点 3：不可点
                {
                    res.setSpriteFrameAtlas("images/tanxian","box1",item);
                }
            }
        }
    },

    nextLevel: function()
    {
        var lv = storage.getTxLv();
        storage.setTxLv(lv+1);

        var self = this;
        this.canTouch = false;
        this.scheduleOnce(function(){
            self.initUI();
            self.updateUI();
            self.canTouch = true;
        },0.1);

    },

    addTili: function(num)
    {
        this.tili += num;
        this.updateUI();
    },

    show: function(index)
    {
        this.index = index;
        this.awards = [];
        this.canTouch = true;
        this.tiliTotal = 30;
        this.tili = this.tiliTotal;

        //this.main.wxQuanState(false);
        this.game = cc.find("Canvas").getComponent("main");
        this.node.sc = this;
        this.initUI();
        this.updateUI();

        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));
        var self = this;
        cc.sdk.showBanner(this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

        cc.qianqista.event("探险游戏_打开");
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
        cc.sdk.hideBanner();
        cc.res.openUI("tanxian",null,this.awards);
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "item")
        {
            if(this.canTouch)
            this.btnitem(event.target.tid);
        }
        else if(data == "lingqu2")
        {
            var self = this;
            if(this.useShare)
            {
                cc.sdk.share(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                },"qiandao");
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
