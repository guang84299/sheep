
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.game = cc.find("Canvas").getComponent("main");
        this.box = this.node.parent.parent.getComponent("box");
        this.node.sc = this;

        this.anim = new cc.Node();
        this.anim.addComponent(cc.Sprite);
        this.node.addChild(this.anim);

        this.aniconfig = cc.config.sheepAnim[parseInt((this.box.index-1)/3)];
        this.conf = this.box.conf;

        this.holdTime = this.conf.growSpeed;
        this.holdTimeDt = 0;
        this.updateDt = 0;
        this.growDt = 0;
        this.isUpdate = true;
        this.playHoldAni();
    },

    playCutAni: function()
    {
        this.state = "cut";
        var self = this;
        cc.res.playPlistAnim(this.anim,cc.res["sheep_sheep"+this.aniconfig.lv+".plist"],this.aniconfig.cutAnim,this.aniconfig.cutframeNum,0.03,1,function(){
            self.playHoldAni();
        });
        //同时播放掉落
        var node = cc.res.playPlistAnim2(cc.res["sheep_sheep"+this.aniconfig.lv+".plist"],this.aniconfig.dropAnim,this.aniconfig.dropframeNum,0.03,1,null,true);
        this.node.addChild(node);
        node.runAction(cc.sequence(
            cc.moveTo(0.3,cc.v2(0,50)).easing(cc.easeSineIn()),
            cc.moveTo(0.3,cc.v2(0,0)).easing(cc.easeSineIn())
        ));

        if(this.game.totalLvNum < 10)
            this.game.addCoin(this.box.pice);
    },

    playGrowAni1: function()
    {
        this.state = "grow1";
        var self = this;
        cc.res.playPlistAnim(this.anim,cc.res["sheep_sheep"+this.aniconfig.lv+".plist"],this.aniconfig.growAnim1,this.aniconfig.growframeNum1,0.01,1,function(){
            self.playGrowAni2();
        });
    },

    playGrowAni2: function()
    {
        this.state = "grow";
        cc.res.playPlistAnim(this.anim,cc.res["sheep_sheep"+this.aniconfig.lv+".plist"],this.aniconfig.growAnim2,this.aniconfig.growframeNum2,0.05,-1);
    },

    playHoldAni: function()
    {
        this.state = "hold";
        cc.res.playPlistAnim(this.anim,cc.res["sheep_sheep"+this.aniconfig.lv+".plist"],this.aniconfig.holdAnim,this.aniconfig.holdframeNum,0.05,-1);
    },

    changeUpdate: function(update)
    {
        if(this.isUpdate != update)
        {
            this.isUpdate = update;
            this.node.active = this.isUpdate;
        }
    },

    lvup: function()
    {
        this.conf = this.box.conf;

        this.holdTime = this.conf.growSpeed;
    },


    update: function(dt)
    {
        if(this.box.isUpdate)
        {
            this.updateDt += dt;
            if(this.updateDt>1/30.0)
            {
                if(this.state == "hold")
                {
                    this.holdTimeDt += this.updateDt;
                    if(this.holdTimeDt>this.holdTime)
                    {
                        this.holdTimeDt = 0;
                        this.playGrowAni1();
                    }
                }

                if(this.state == "grow1")
                {
                    this.growDt += this.updateDt;
                    if(this.growDt>1)
                    {
                        this.growDt = 0;
                        this.state = "grow";
                    }
                }

                if(this.state == "grow")
                {
                    for(var i=0;i<this.box.buoys.length;i++)
                    {
                        var buoy = this.box.buoys[i];
                        var dis = this.node.position.sub(buoy.position).mag();
                        if(dis<buoy.sc.collradius+this.node.width/2)
                        {
                            this.playCutAni();
                            break;
                        }
                    }
                }


                this.updateDt = 0;
            }

        }
    }

});
