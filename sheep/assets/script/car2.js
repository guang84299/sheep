
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

        this.isRuning = false;
        if(this.game.unLock>0)
            this.run();
    },

    run: function()
    {
        this.isRuning = true;
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
                car.index = i+1;
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

            runCar.lunzi1 = runCar.children[0];
            runCar.lunzi2 = runCar.children[1];
            runCar.coinsp = runCar.children[2];
            runCar.lunzi1.runAction(cc.repeatForever(cc.rotateBy(1,360)));
            runCar.lunzi2.runAction(cc.repeatForever(cc.rotateBy(1,360)));

            runCar.coinsp.active = false;
            runCar.lunzi1.active = false;
            runCar.lunzi2.active = false;
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
        car.lunzi1.active = true;
        car.lunzi2.active = true;

        if(this.isUp)
        {
            this.isUp = false;
            var dt = Math.random()+Math.random();
            this.node.runAction(cc.sequence(
                cc.delayTime(dt),
                cc.callFunc(function(){
                    self.run();
                })
            ));
        }
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
        car.lunzi1.active = true;
        car.lunzi2.active = true;
    },

    addCoin: function(car)
    {
        car.scaleX = -1;
        car.lunzi1.active = false;
        car.lunzi2.active = false;

        var coin = cc.instantiate(car.coinsp);
        coin.active = true;
        coin.scaleX = 1;
        coin.x = -270;
        coin.y = this.node.y;
        coin.zIndex = this.node.zIndex+1;
        this.node.parent.addChild(coin);


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
                coin.destroy();
                car.coinsp.active = true;
                self.carBack(car);
            })
        ));
    },

    subCoin: function(car)
    {
        car.scaleX = 1;
        car.lunzi1.active = false;
        car.lunzi2.active = false;

        var coin = cc.instantiate(car.coinsp);
        coin.position = this.node.position.add(car.position);
        coin.parent = this.node.parent;

        coin.runAction(cc.sequence(
            cc.moveBy(0.3,cc.v2(0,100)).easing(cc.easeSineIn()),
            cc.removeSelf()
        ));

        car.coinsp.active = false;

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

        if(this.cars.length<Number(this.conf.num))
        {
            var car = this.node.children[0];
            for(var i=this.cars.length;i<Number(this.conf.num);i++)
            {
                var c = cc.instantiate(car);
                c.x = 0;
                c.isRun = false;
                c.coin = 0;
                c.scaleX = 1;
                this.node.addChild(c);

                this.isUp = true;
            }

            this.cars = this.node.children;

        }

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
