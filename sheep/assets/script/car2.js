
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
        this.goTime = new Date().getTime();
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

            runCar.ani = cc.instantiate(cc.res["prefab_anim_carspeedup"]);
            runCar.ani.scale = 1;
            runCar.ani.parent = runCar;
            runCar.ani.position = cc.v2(60,0);
            runCar.ani.active = false;
        }
    },

    carGo: function(car)
    {
        var now = new Date().getTime();
        var carId = 0;
        for(var i=0;i<3;i++)
        {
            var ct = cc.storage.getShopHcarTime(i);
            if(ct>now) carId = i+1;
        }
        cc.res.setSpriteFrameAtlas("images/main","car_2"+carId,car);

        var self = this;

        var dtv = 0;
        var now = new Date().getTime();
        this.goTime = new Date().getTime();

        if(now-this.goTime<500)
        {
            dtv = 0.5;
            this.goTime = now;
        }
        car.runAction(cc.sequence(
            cc.moveBy((this.speed+dtv)*(1.0/this.game.rate7),-350,0),
            cc.callFunc(function(){
                self.addCoin(car);
            })
        ));
        car.lunzi1.active = true;
        car.lunzi2.active = true;

        if(this.isUp)
        {
            this.isUp = false;
            var dt = Math.random()*(1.0/this.game.rate7);
            this.node.runAction(cc.sequence(
                cc.delayTime(dt),
                cc.callFunc(function(){
                    self.run();
                })
            ));
        }

        car.ani.active = this.game.rate7 != 1 ? true : false;

    },

    carBack: function(car)
    {
        var self = this;
        car.runAction(cc.sequence(
            cc.moveBy(this.speed*(1.0/this.game.rate7),350,0),
            cc.callFunc(function(){
                self.subCoin(car);
            })
        ));
        car.lunzi1.active = true;
        car.lunzi2.active = true;

        car.ani.active = this.game.rate7 != 1 ? true : false;
    },

    addCoin: function(car)
    {
        car.scaleX = -1;
        car.lunzi1.active = false;
        car.lunzi2.active = false;

        var capacity = Number(this.conf.capacity);
        var carrySpeed = Number(this.conf.carrySpeed);

        if(this.game.faccoin<=0 || car.coin>=capacity)
        {
            var self = this;
            car.runAction(cc.sequence(
                cc.delayTime(0.3*(1.0/this.game.rate7)),
                cc.callFunc(function(){
                    self.carBack(car);
                })
            ));

            return;
        }

        var coin = cc.instantiate(car.coinsp);
        coin.active = true;
        coin.scaleX = 1;
        coin.x = -270;
        coin.y = this.node.y;
        coin.zIndex = this.node.zIndex+1;
        this.node.parent.addChild(coin);



        if(carrySpeed>this.game.faccoin)
        {
            car.coin += this.game.faccoin;
            this.game.addFacCoin(-this.game.faccoin);
        }
        else
        {
            car.coin += carrySpeed;
            this.game.addFacCoin(-carrySpeed);
        }

        var self = this;
        coin.runAction(cc.sequence(
            cc.moveBy(0.3*(1.0/this.game.rate7),cc.v2(100,0)).easing(cc.easeSineIn()),
            cc.callFunc(function(){
                coin.destroy();
                car.coinsp.active = true;
            })
        ));

        this.node.runAction(cc.sequence(
            cc.delayTime(1*(1.0/this.game.rate7)),
            cc.callFunc(function(){
                self.addCoin(car);
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
            cc.moveBy(0.3*(1.0/this.game.rate7),cc.v2(0,100)).easing(cc.easeSineIn()),
            cc.removeSelf()
        ));

        car.coinsp.active = false;

        var self = this;
        car.runAction(cc.sequence(
            cc.delayTime(0.3*(1.0/this.game.rate7)),
            cc.callFunc(function(){
                self.game.addCoin(car.coin,self.game.shouYiRate);
                car.coin = 0;
                self.carGo(car);
            })
        ));

        //判断升级提示
        if(this.game.yindao>=6 && !cc.res.autoHand && this.game.unLock<5 && Math.random()<0.5)
        {
            var zcoin = this.game.faccoin;

            if(zcoin > Number(this.conf.capacity)*this.cars.length)
            {
                //this.game.scrollBox(0);
                cc.res.showHand(cc.find("head/carhup/shengji",this.game.scrollContent),4);
            }
            else
            {
                //判断牧场
                for(var i=this.game.unLock;i>0;i--)
                {
                    var lv = cc.storage.getLevel(i);
                    var cost = this.getCost(lv,i);
                    if(cost != 0 && this.game.coin>cost)
                    {
                        //this.game.scrollBox(i);
                        cc.res.showHand(cc.find("box_lvup/shengji",this.game.boxs[i-1]),5);
                        break;
                    }
                }
            }
        }
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

    getCost: function(lv,index)
    {
        var cost = 0;
        if(lv+1<cc.res.conf_cost.length)
        {
            var c = Number(cc.res.conf_cost[lv+1]["ranch"+index]);
            cost += c;
        }
        return cost;
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
