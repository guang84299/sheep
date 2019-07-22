
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
       this.init();
    },

    init: function()
    {
        this.game = cc.find("Canvas").getComponent("main");

        this.node.sc = this;
        this.node.zIndex = 999;
        this.updateDt = 0;
        this.dir = -1;
        this.index = -1;
        this.ny = this.node.y;

        this.lv = cc.storage.getCarVLv();
        this.conf = cc.res.conf_truckVic[this.lv-1];
        this.speed = 10/Number(this.conf.speed);
        this.coin = 0;
        this.isRun = false;

        this.maosp = this.node.children[0];
        this.maosp.active = false;

        this.scheduleOnce(this.run.bind(this),1);
    },

    back: function()
    {
        var self = this;
        this.index = -1;
        var h = this.game.boxs[0].height;
        var num = (-this.node.y+this.ny)/h;
        var t = this.speed*num;
        var y = this.ny;
        var dt = 0.5;
        cc.res.setSpriteFrame("images/main/car_up",this.node);
        this.node.runAction(cc.sequence(
            cc.moveTo(t,cc.v2(this.node.x,y)),
            cc.callFunc(function(){
                self.subMao();
            }),
            cc.delayTime(dt),
            cc.callFunc(this.run.bind(this))
        ));
    },

    run: function()
    {
        this.isRun = true;
        var num = this.game.unLock;
        if(this.game.boxs.length<num)
        {
            this.scheduleOnce(this.run.bind(this),1);
            return;
        }
        var h = this.game.boxs[0].height;
        var y = 0;
        var dt = 0.5;
        var t = this.speed;

        var coin = Number(this.conf.capacity)-this.coin;

        this.index++;
        if(this.index>=num || coin<=0){
            this.back();
            return;
        }

        cc.res.setSpriteFrame("images/main/car_down",this.node);
        //this.maosp.active = false;


        if(num == 0)
        {
            y = this.ny;
        }
        else if(this.index == 0)
        {
            t = t/2;
            y = this.game.boxs[this.index].y-h/2;
        }
        else
        {
            y = this.game.boxs[this.index].y-h/2;
        }

        var self = this;
        this.node.runAction(cc.sequence(
            cc.moveTo(t,cc.v2(this.node.x,y)),
            cc.callFunc(function(){
                if(self.index < num && self.index>=0)
                {
                    var box = self.game.boxs[self.index].getComponent("box");
                    var coin = Number(self.conf.capacity)-self.coin;
                    if(box.coin>0 && coin>0)
                    {
                        coin = box.getCoin(coin);
                        self.coin += coin;
                        self.addMao(y,box.type);
                    }
                }

            }),
            cc.delayTime(dt),
            cc.callFunc(this.run.bind(this))
        ));
    },

    addMao: function(h,type)
    {
        var icon = type+1;

        var mao = new cc.Node();
        mao.addComponent(cc.Sprite);
        mao.x = -170;
        mao.y = h;
        mao.zIndex = this.node.zIndex+1;
        this.node.parent.addChild(mao);
        cc.res.setSpriteFrame("images/main/car_mao"+icon,mao);

        var self = this;
        mao.runAction(cc.sequence(
            cc.moveTo(0.3,this.node.position).easing(cc.easeSineIn()),
            cc.callFunc(function(){
                self.maosp.active = true;
                cc.res.setSpriteFrame("images/main/car_mao"+icon,self.maosp);
                mao.destroy();
            })
        ));
    },

    subMao: function()
    {
        if(this.maosp.active)
        {
            var mao = cc.instantiate(this.maosp);
            mao.position = this.node.position;
            mao.zIndex = this.node.zIndex+1;
            mao.parent = this.node.parent;

            var self = this;
            mao.runAction(cc.sequence(
                cc.moveBy(0.3,cc.v2(0,100)).easing(cc.easeSineIn()),
                cc.callFunc(function(){
                    self.game.addFacCoin(self.coin);
                    self.coin = 0;
                }),
                cc.removeSelf()
            ));
        }

        this.maosp.active = false;
    },

    lvup: function()
    {
        this.lv = cc.storage.getCarVLv();
        this.conf = cc.res.conf_truckVic[this.lv-1];
        this.speed = 10/Number(this.conf.speed);
    },

    update: function(dt)
    {
        this.updateDt += dt;
        if(this.updateDt>1/30.0)
        {
            //this.updateMove(this.updateDt);



            this.updateDt = 0;
        }
    }
});
