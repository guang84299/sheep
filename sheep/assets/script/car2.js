
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.game = cc.find("Canvas").getComponent("main");

        this.node.sc = this;
        this.node.zIndex = 999;
        this.updateDt = 0;

        this.lv = cc.storage.getCarHLv();
        this.conf = cc.res.conf_truckHor[this.lv-1];
        this.speed = 10/Number(this.conf.speed);

        var car = this.node.children[0];
        for(var i=1;i<Number(this.conf.num);i++)
        {
            var c = cc.instantiate(car);
            this.node.addChild(c);
        }
        this.cars = this.node.children;

        this.run();
    },

    run: function()
    {
        var isRun = false;
        var runCar = null;
        for(var i=0;i<this.cars.length;i++)
        {
            var car = this.cars[i];
            if(!car.isRun)
            {
                car.isRun = true;
                car.coin = 0;
                car.zIndex = this.cars.length-i;
                isRun = true;
                runCar = car;
                break;
            }

        }
        if(isRun)
        {
            var self = this;
            var dt = this.speed*0.5;
            if(dt<0.5) dt = 0.5;
            this.node.runAction(cc.sequence(
                cc.delayTime(dt),
                cc.callFunc(function(){
                    self.carGo(runCar);
                    self.run();
                })
            ));
        }
    },

    carGo: function(car)
    {
        var self = this;
        car.runAction(cc.sequence(
            cc.moveBy(this.speed,-400,0),
            cc.callFunc(function(){
                self.addCoin(car);
            })
        ));
    },

    carBack: function(car)
    {
        var self = this;
        car.runAction(cc.sequence(
            cc.moveBy(this.speed,400,0),
            cc.callFunc(function(){
                self.subCoin(car);
            })
        ));
    },

    addCoin: function(car)
    {
        car.scaleY = -1;
        var coin = new cc.Node();
        coin.addComponent(cc.Sprite);
        coin.x = -270;
        coin.y = this.node.y;
        coin.zIndex = this.node.zIndex+1;
        this.node.parent.addChild(coin);

        cc.res.setSpriteFrame("images/common/coin",coin);

        var capacity = Number(this.conf.capacity);
        if(capacity>this.game.faccoin)
        {
            car.coin = this.game.faccoin;
            this.game.addFacCoin(-car.coin);
        }
        else
        {
            car.coin = capacity;
            this.game.addFacCoin(-car.coin);
        }

        var self = this;
        coin.runAction(cc.sequence(
            cc.moveBy(0.3,cc.v2(100,0)).easing(cc.easeSineIn()),
            cc.callFunc(function(){
                if(car.childrenCount==0)
                {
                    coin.position = cc.v2(0,0);
                    coin.parent = car;
                }
                else
                {
                    coin.destroy();
                }
                self.carBack(car);
            })
        ));
    },

    subCoin: function(car)
    {
        car.scaleY = 1;
        if(car.childrenCount>0)
        {
            var coin = car.children[0];
            coin.position = this.node.position.add(car.position);
            coin.parent = this.node.parent;

            coin.runAction(cc.sequence(
                cc.moveBy(0.3,cc.v2(0,100)).easing(cc.easeSineIn()),
                cc.removeSelf()
            ));
        }

        car.destroyAllChildren();

        var self = this;
        car.runAction(cc.sequence(
            cc.delayTime(0.3),
            cc.callFunc(function(){
                self.game.addCoin(car.coin,self.game.shouYiRate);
                car.coin = 0;
                self.carGo(car);
            })
        ));
    },

    lvup: function()
    {
        this.lv = cc.storage.getCarHLv();
        this.conf = cc.res.conf_truckHor[this.lv-1];
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
