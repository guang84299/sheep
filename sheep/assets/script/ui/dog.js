var storage = require("storage");
var res = require("res");
var sdk = require("sdk");
var config = require("config");

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

        this.page1 = cc.find("box/page1",this.bg);
        this.page2 = cc.find("box/page2",this.bg);

        this.card1_btn1 = cc.find("card1/btn1",this.page1).getComponent(cc.Button);
        this.card1_btn2 = cc.find("card1/btn2",this.page1).getComponent(cc.Button);
        this.card1_btn1_desc = cc.find("card1/btn1/desc",this.page1).getComponent(cc.Label);
        this.card1_btn2_desc = cc.find("card1/btn2/desc",this.page1).getComponent(cc.Label);

        this.card2_btn1 = cc.find("card2/btn1",this.page1).getComponent(cc.Button);
        this.card2_btn2 = cc.find("card2/btn2",this.page1).getComponent(cc.Button);
        this.card2_btn1_desc = cc.find("card2/btn1/desc",this.page1).getComponent(cc.Label);
        this.card2_btn2_desc = cc.find("card2/btn2/desc",this.page1).getComponent(cc.Label);

        this.cards = [];
        for(var i=1;i<=5;i++)
        {
            var card = cc.find("card"+i,this.page2);
            card.tid = i;
            this.cards.push(card);
        }
        this.selbox = cc.find("selbox",this.page2);
        this.selCardIndex = 0;

        this.cardColors = [
            cc.color(0,0,0),
            cc.color(0,255,0),
            cc.color(0,0,255),
            cc.color(128,0,128),
            cc.color(22,107,201)
        ];

        this.upDt = 0;
        this.open1();
    },

    updateUI: function()
    {

    },

    open1: function()
    {
        this.page1.active = true;
        this.page2.active = false;

        this.updatePage1();
    },

    updatePage1: function()
    {
        var val = this.game.getSecVal();
        this.cost1 = val*10;
        this.cost2 = val*80;
        this.cost3 = 100;
        this.card1_btn1_desc.string = storage.castNum(this.cost1)+"金币购买1次";
        this.card1_btn2_desc.string = storage.castNum(this.cost2)+"金币购买10次";
        this.card2_btn1_desc.string = storage.castNum(this.cost3)+"钻石购买1次";
        this.card2_btn2_desc.string = "观看"+storage.getDogCardAdNum(4)+"/3次视频\r\n免费购买9次";

        var time1 = storage.getDogCardTime(1);
        this.card1_btn1_desc.time = time1;
        if(time1 == 0)
        {
            this.card1_btn1.interactable = true;
        }
        else
        {
            this.card1_btn1.interactable = false;
        }

        var time2 = storage.getDogCardTime(2);
        this.card1_btn2_desc.time = time2;
        if(time2 == 0)
        {
            this.card1_btn2.interactable = true;
        }
        else
        {
            this.card1_btn2.interactable = false;
        }

        var time3 = storage.getDogCardTime(3);
        this.card2_btn1_desc.time = time3;
        if(time3 == 0)
        {
            this.card2_btn1.interactable = true;
        }
        else
        {
            this.card2_btn1.interactable = false;
        }

        //var time4 = storage.getDogCardTime(4);
        //this.card2_btn2_desc.time = time4;
        //if(time4 == 0)
        //{
        //    this.card2_btn2.interactable = true;
        //}
        //else
        //{
        //    this.card2_btn2.interactable = false;
        //}
    },

    updatePage1Time: function()
    {
        var now = new Date().getTime();
        if(this.card1_btn1_desc.time>0)
        {
            if(this.card1_btn1_desc.time>now)
                this.card1_btn1_desc.string = storage.getCountDown(now,this.card1_btn1_desc.time,2);
            else
            {
                storage.setDogCardTime(1,0);
                this.updatePage1();
            }
        }

        if(this.card1_btn2_desc.time>0)
        {
            if(this.card1_btn2_desc.time>now)
                this.card1_btn2_desc.string = storage.getCountDown(now,this.card1_btn2_desc.time,2);
            else
            {
                storage.setDogCardTime(2,0);
                this.updatePage1();
            }
        }

        if(this.card2_btn1_desc.time>0)
        {
            if(this.card2_btn1_desc.time>now)
                this.card2_btn1_desc.string = storage.getCountDown(now,this.card2_btn1_desc.time,2);
            else
            {
                storage.setDogCardTime(3,0);
                this.updatePage1();
            }
        }
    },

    open2: function()
    {
        this.page1.active = false;
        this.page2.active = true;

        this.updatePage2();
    },

    updatePage2: function()
    {
        for(var i=0;i<this.cards.length;i++)
        {
            var card = this.cards[i];
            var desc = cc.find("desc",card).getComponent(cc.Label);
            var lv = cc.find("lv",card).getComponent(cc.Label);
            var pro = cc.find("pro",card).getComponent(cc.Label);

            var sel = cc.find("sel",card);
            var mask = cc.find("mask",card);
            sel.active = false;
            mask.active = false;


            var data = cc.res.conf_cardText[i];
            desc.string = data.character;

            var cardLv = storage.getDogCardLv(i+1);
            var carNum = storage.getDogCardNum(i+1);


            if(cardLv>=cc.res.conf_cardGrade.length)
            {
                lv.string = "满级";
                pro.node.active = false;
            }
            else
            {
                lv.string = "等级"+cardLv;
                var dataGrade = cc.res.conf_cardGrade[cardLv];
                pro.string = carNum+"/"+dataGrade["card"+(i+1)];
            }

            if(cardLv>0)
            {
                if(i==this.selCardIndex)
                {
                    sel.active = true;
                }
            }
            else
            {
                mask.active = true;
            }

            if(i>=3)
            {
                var btn = cc.find("btn",card);
                btn.active = false;
                if(carNum>0 && cardLv==0)btn.active = true;
            }
        }

        var rate = cc.find("rate",this.selbox).getComponent(cc.Label);
        var name = cc.find("name",this.selbox).getComponent(cc.Label);
        var desc = cc.find("desc",this.selbox).getComponent(cc.Label);
        var grade = cc.find("grade",this.selbox).getComponent(cc.Label);
        var base = cc.find("base",this.selbox).getComponent(cc.Label);
        var up = cc.find("up",this.selbox).getComponent(cc.Label);
        var ratio = cc.find("ratio",this.selbox).getComponent(cc.Label);

        var use = cc.find("use",this.selbox).getComponent(cc.Button);
        var use_str = cc.find("use/str",this.selbox).getComponent(cc.Label);

        var seldata = cc.res.conf_cardText[this.selCardIndex];
        var cardLv = storage.getDogCardLv(this.selCardIndex+1);

        rate.string = "牧场收益加成X"+(Number(seldata.base)+Number(seldata.ratio)*cardLv).toFixed(2);
        name.string = "姓名："+seldata.name;
        desc.string = "性格："+seldata.tips;
        grade.string = "品级："+seldata.character;
        base.string = "基础收益加成："+seldata.base+"倍";
        up.string = "收益加成上限："+seldata.top+"倍";
        ratio.string = "成长系数："+seldata.ratio;

        grade.node.color = this.cardColors[this.selCardIndex];
        ratio.node.color = this.cardColors[this.selCardIndex];

        var cardId = storage.getDogCard();
        if(this.selCardIndex+1 == cardId)
        {
            use.interactable = false;
            use_str.string = "使用中";
        }
        else
        {
            use.interactable = true;
            use_str.string = "启用";
        }
    },



    show: function()
    {
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


        cc.qianqista.event("商店_打开");

    },

    hide: function()
    {
        this.game.updateRed();
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
    },

    getChoukaIndex: function(type)
    {
        var awards = [];
        for(var i=0;i<cc.res.conf_cardDraw.length;i++)
        {
            var cardd = cc.res.conf_cardDraw[i];
            if(type == 1 || type == 2)
            {
                if(cardd.pool == "1")
                    awards.push(cardd);
            }
            else
            {
                if(cardd.pool == "2")
                    awards.push(cardd);
            }
        }
        var r = Math.random()*10000;
        var weight = 0;
        var awardIndex = 1;
        for(var i=awards.length-1;i>=0;i--)
        {
            var award = awards[i];
            weight += Number(award.weight);
            if(r<=weight)
            {
                awardIndex = parseInt(award.character);
                break;
            }
        }
        return awardIndex;
    },


    chouka: function(type)
    {
        var self = this;
        self.isChoukaing = true;
        //单抽
        if(type == 1 || type == 3)
        {
            var singlecard = cc.find("singlecard",this.node);
            singlecard.active = true;

            var card = cc.find("card",singlecard);
            var box = cc.find("box",singlecard);

            var card_desc = cc.find("desc",card).getComponent(cc.Label);

            var title = cc.find("title",box).getComponent(cc.Label);
            var desc = cc.find("desc",box).getComponent(cc.Label);
            var info2 = cc.find("info2",box).getComponent(cc.Label);
            var info = cc.find("info",box);

            var name = cc.find("name",info).getComponent(cc.Label);
            var desc = cc.find("desc",info).getComponent(cc.Label);
            var grade = cc.find("grade",info).getComponent(cc.Label);
            var base = cc.find("base",info).getComponent(cc.Label);
            var up = cc.find("up",info).getComponent(cc.Label);
            var ratio = cc.find("ratio",info).getComponent(cc.Label);


            var index = this.getChoukaIndex(type);
            var cardLv = storage.getDogCardLv(index);
            var seldata = cc.res.conf_cardText[index-1];

            card_desc.string = seldata.character;
            if(cardLv>0)
            {
                title.string = "相同品质卡片自动转为升级经验";
                info2.node.active = true;
                info2.string = seldata.character+"牧羊犬升级进度+1";
                info.active = false;
            }
            else
            {
                title.string = "新卡片在狗窝中查看使用";
                info2.node.active = false;
                info.active = true;

                name.string = "姓名："+seldata.name;
                desc.string = "性格："+seldata.tips;
                grade.string = "品级："+seldata.character;
                base.string = "基础收益加成："+seldata.base+"倍";
                up.string = "收益加成上限："+seldata.top+"倍";
                ratio.string = "成长系数："+seldata.ratio;

                grade.node.color = this.cardColors[index-1];
                ratio.node.color = this.cardColors[index-1];
            }

            //动画
            box.active = false;
            card.scale = 0;
            card.runAction(cc.sequence(
                cc.scaleTo(0.5,-1,1).easing(cc.easeSineIn()),
                cc.scaleTo(1,1,1).easing(cc.easeSineIn()),
                cc.callFunc(function(){
                    box.active = true;
                    self.isChoukaing = false;
                })
            ));


            var carNum = storage.getDogCardNum(index);
            carNum += 1;
            storage.setDogCardNum(index,carNum);

            var dataGrade = cc.res.conf_cardGrade[cardLv];
            var upCarNum = Number(dataGrade["card"+index]);
            if(carNum>=upCarNum)
            {
                if(index<4 || cardLv>0)
                {
                    carNum = upCarNum-carNum;
                    if(carNum<0) carNum = 0;
                    storage.setDogCardNum(index,carNum);
                    storage.setDogCardLv(index,cardLv+1);
                    storage.uploadDogCardLv(index);
                }
            }
            storage.uploadDogCardNum(index);
        }
        //9连抽
        else
        {
            var card9 = cc.find("card9",this.node);
            card9.active = true;

            var cards = cc.find("cards",card9).children;
            var box = cc.find("box",card9);
            box.active = false;

            var rindex = [];
            for(var i=0;i<cards.length;i++)
            {
                var card = cards[i];
                var desc = cc.find("desc",card).getComponent(cc.Label);
                var desc2 = cc.find("desc2",card).getComponent(cc.Label);

                var index = this.getChoukaIndex(type);
                var cardLv = storage.getDogCardLv(index);
                var seldata = cc.res.conf_cardText[index-1];

                desc.string = seldata.character;
                if(cardLv>0) desc2.string = "已拥有";
                else desc2.string = "新";

                //动画
                card.scale = 0;
                card.runAction(cc.sequence(
                    cc.delayTime(0.6*i),
                    cc.scaleTo(0.2,-1,1).easing(cc.easeSineIn()),
                    cc.scaleTo(0.5,1,1).easing(cc.easeSineIn())
                ));

                var carNum = storage.getDogCardNum(index);
                carNum += 1;
                storage.setDogCardNum(index,carNum);

                var dataGrade = cc.res.conf_cardGrade[cardLv];
                var upCarNum = Number(dataGrade["card"+index]);
                if(carNum>=upCarNum)
                {
                    if(index<4 || cardLv>0)
                    {
                        carNum = upCarNum-carNum;
                        if(carNum<0) carNum = 0;
                        storage.setDogCardNum(index,carNum);
                        storage.setDogCardLv(index,cardLv+1);
                    }
                }


                var b = false;
                for(var j=0;j<rindex.length;j++)
                {
                    if(rindex[j] == index)
                    {
                        b = true;
                        break;
                    }
                }
                if(!b) rindex.push(index);
            }

            for(var j=0;j<rindex.length;j++)
            {
                storage.uploadDogCardLv(rindex[j]);
                storage.uploadDogCardNum(rindex[j]);
            }

            card9.runAction(cc.sequence(
                cc.delayTime(0.7*9),
                cc.callFunc(function(){
                    box.active = true;
                    self.isChoukaing = false;
                })
            ));
        }
    },

    buy1: function()
    {
        if(this.game.coin >= this.cost1)
        {
            this.game.addCoin(-this.cost1);
            storage.setDogCardTime(1,new Date().getTime()+120*1000);
            this.updatePage1();
            this.chouka(1);
        }
        else
        {
            res.showToast("金币不足！");
        }
    },

    buy2: function()
    {
        if(this.game.coin >= this.cost2)
        {
            this.game.addCoin(-this.cost2);
            storage.setDogCardTime(2,new Date().getTime()+240*1000);
            this.updatePage1();
            this.chouka(2);
        }
        else
        {
            res.showToast("金币不足！");
        }
    },

    buy3: function()
    {
        if(this.game.diamond >= this.cost3)
        {
            this.game.addDiamond(-this.cost3);
            storage.setDogCardTime(3,new Date().getTime()+60*1000);
            this.updatePage1();
            this.chouka(3);
        }
        else
        {
            res.showToast("钻石不足！");
        }
    },

    buy4: function()
    {
        var adNum = storage.getDogCardAdNum(4);
        adNum += 1;
        if(adNum >= 3)
        {
            storage.setDogCardAdNum(4,0);
            this.updatePage1();
            this.chouka(4);
        }
        else
        {
            storage.setDogCardAdNum(4,adNum);
            this.updatePage1();
            res.showToast("再看"+(3-adNum)+"次抽卡");
        }
    },

    selcard: function(tid)
    {
        var cardLv = storage.getDogCardLv(tid);
        if(cardLv>0)
        {
            this.selCardIndex = tid-1;
            this.updatePage2();
        }
    },

    jiesuo: function(index)
    {
        var carNum = storage.getDogCardNum(index);
        var cardLv = storage.getDogCardLv(index);
        var dataGrade = cc.res.conf_cardGrade[cardLv];
        var upCarNum = Number(dataGrade["card"+index]);
        if(carNum>=upCarNum)
        {
            carNum = upCarNum-carNum;
            if(carNum<0) carNum = 0;
            storage.setDogCardNum(index,carNum);
            storage.setDogCardLv(index,cardLv+1);
            storage.uploadDogCardLv(index);
        }
        storage.uploadDogCardNum(index);
        this.updatePage2();

        carNum = storage.getDogCardNum(index);
        cardLv = storage.getDogCardLv(index);
        dataGrade = cc.res.conf_cardGrade[cardLv];
        var upCarNum = Number(dataGrade["card"+index]);
        if(carNum>=upCarNum)
        {
            this.jiesuo(index);
        }
    },

    use: function()
    {
        var cardId = storage.getDogCard();
        if(cardId != this.selCardIndex+1)
        {
            storage.setDogCard(this.selCardIndex+1);
            storage.uploadDogCard();
            this.updatePage2();
        }
    },

    click: function(event,data)
    {
        var self = this;
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
        else if(data == "buy1")
        {
            this.buy1();
            cc.qianqista.event("牧羊犬_购买1");
        }
        else if(data == "buy2")
        {
            this.buy2();
            cc.qianqista.event("牧羊犬_购买2");
        }
        else if(data == "buy3")
        {
            this.buy3();
            cc.qianqista.event("牧羊犬_购买3");
        }
        else if(data == "buy4")
        {
            sdk.showVedio(function(r){
                if(r)
                {
                    self.buy4();
                }
            });

            cc.qianqista.event("牧羊犬_购买4");
        }
        else if(data == "closesinglecard")
        {
            if(!this.isChoukaing)
            cc.find("singlecard",this.node).active = false;
        }
        else if(data == "closecard9")
        {
            if(!this.isChoukaing)
            cc.find("card9",this.node).active = false;
        }
        else if(data == "selcard")
        {
            this.selcard(event.target.tid);
        }
        else if(data == "jiesuo4")
        {
            sdk.showVedio(function(r){
                if(r)
                {
                    self.jiesuo(4);
                }
            });
        }
        else if(data == "jiesuo5")
        {
            sdk.showVedio(function(r){
                if(r)
                {
                    self.jiesuo(5);
                }
            });
        }
        else if(data == "use")
        {
            this.use();
        }
        storage.playSound(res.audio_button);
        cc.log(data);
    },

    update: function(dt)
    {
        this.upDt += dt;
        if(this.upDt>1)
        {
            this.upDt = 0;
            this.updatePage1Time();
        }
    }


});
