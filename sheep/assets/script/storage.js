/**
 * Created by guang on 18/7/19.
 */
module.exports = {
    pice:['k','m','b','t','a','aa','ab','ac','ad','ae','af','ag','ah','ai','aj','ak','al','am','an','ao','ap','aq','ar','as','at'],
    audioContext: null,
    effectContext: null,
    pfix: "sheep_",
    n2AddSpeed:false,
    playSoundTime:0,
    playMusic: function(music)
    {
        if(this.getMusic() == 1)
        {
            this.stopMusic();

            cc.loader.loadRes(music, function (err, clip)
            {
                if(!err)
                {
                    cc.audioEngine.play(clip, true, 0.3);
                }
                else
                {
                    console.log(err);
                }
            });
            //if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
            //{
            //    if(this.audioContext == null)
            //    {
            //        this.audioContext = BK.createAudioContext();
            //        this.audioContext.loop = true;
            //        this.audioContext.src = "GameRes://"+music;
            //    }
            //    this.audioContext.play();
            //}
            //else
            //{
            //    cc.audioEngine.play(music,true,1);
            //}
        }
    },

    pauseMusic: function()
    {
        if(this.getMusic() == 1)
            cc.audioEngine.pauseAll();
    },

    resumeMusic: function()
    {
        if(this.getMusic() == 1)
            cc.audioEngine.resumeAll();
    },

    stopMusic: function()
    {
        //if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        //{
        //    if(this.audioContext)
        //        this.audioContext.pause();
        //}
        //else
        //{
            cc.audioEngine.stopAll();
        //}
    },

    playSound: function(sound)
    {
        if(this.getSound() == 1)
        {
            var now = new Date().getTime();
            if(now-this.playSoundTime>200)
            {
                this.playSoundTime = now;
                cc.loader.loadRes(sound, function (err, clip)
                {
                    if(!err)
                    {
                        cc.audioEngine.play(clip, false, 1);
                    }
                    else
                    {
                        //console.log(err);
                    }
                });
            }

            //if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
            //{
            //    if(this.effectContext == null)
            //    {
            //        this.effectContext = BK.createAudioContext({'type':'effect'});
            //    }
            //    //播放多个音效
            //    this.effectContext.src = "GameRes://"+sound;
            //    this.effectContext.play()
            //}
            //else
            //{
            //    cc.audioEngine.play(sound,false,1);
            //}
        }
    },

    setFirst: function(first)
    {
        cc.sys.localStorage.setItem(this.pfix+"first",first);
    },

    getFirst: function()
    {
        var first = cc.sys.localStorage.getItem(this.pfix+"first");
        first = first ? first : 0;
        return Number(first);
    },

    setCoin: function(coin)
    {
        cc.sys.localStorage.setItem(this.pfix+"coin",Math.floor(coin));
    },

    getCoin: function()
    {
        var coin = cc.sys.localStorage.getItem(this.pfix+"coin");
        coin = coin ? coin : 0;
        return Number(coin);
    },

    uploadCoin: function()
    {
        var datas = {};
        datas.coin = this.getCoin();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setDiamond: function(diamond)
    {
        cc.sys.localStorage.setItem(this.pfix+"diamond",Math.floor(diamond));
    },

    getDiamond: function()
    {
        var diamond = cc.sys.localStorage.getItem(this.pfix+"diamond");
        diamond = diamond ? diamond : 0;
        return Number(diamond);
    },

    uploadDiamond: function()
    {
        var datas = {};
        datas.diamond = this.getDiamond();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setFacCoin: function(coin)
    {
        cc.sys.localStorage.setItem(this.pfix+"faccoin",Math.floor(coin));
    },

    getFacCoin: function()
    {
        var coin = cc.sys.localStorage.getItem(this.pfix+"faccoin");
        coin = coin ? coin : 0;
        return Number(coin);
    },

    uploadFacCoin: function()
    {
        var datas = {};
        datas.faccoin = this.getFacCoin();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setToalCoin: function(coin)
    {
        cc.sys.localStorage.setItem(this.pfix+"toalcoin",Math.floor(coin));
    },

    getToalCoin: function()
    {
        var coin = cc.sys.localStorage.getItem(this.pfix+"toalcoin");
        coin = coin ? coin : 0;
        return Number(coin);
    },

    uploadToalCoin: function()
    {
        var datas = {};
        datas.toalcoin = this.getToalCoin();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setChoujiangNum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"choujiang_num",num);
    },

    getChoujiangNum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"choujiang_num");
        num = num ? num : 0;
        return Number(num);
    },

    setChoujiangTime: function(time)
    {
        cc.sys.localStorage.setItem(this.pfix+"choujiang_time",time);
    },

    getChoujiangTime: function()
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"choujiang_time");
        time = time ? time : 0;
        return Number(time);
    },

    setChoujiangToalNum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"choujiangtoal_num",num);
    },

    getChoujiangToalNum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"choujiangtoal_num");
        num = num ? num : 0;
        return Number(num);
    },

    uploadChoujiangToalNum: function()
    {
        var datas = {};
        datas.choujiangtoal_num = this.getChoujiangToalNum();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setLevel: function(type,lv)
    {
        cc.sys.localStorage.setItem(this.pfix+type+"_level",lv);
    },

    getLevel: function(type)
    {
        var lv = cc.sys.localStorage.getItem(this.pfix+type+"_level");
        lv = lv ? lv : 1;
        return Number(lv);
    },

    uploadLevel: function(type)
    {
        var datas = {};
        datas["level_"+type] = this.getLevel(type);
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setLevelCoin: function(index,coin)
    {
        cc.sys.localStorage.setItem(this.pfix+"level_"+index+"_coin",coin);
    },

    getLevelCoin: function(index)
    {
        var coin = cc.sys.localStorage.getItem(this.pfix+"level_"+index+"_coin");
        coin = coin ? coin : 0;
        return Number(coin);
    },

    setLevelDog: function(index,lv)
    {
        cc.sys.localStorage.setItem(this.pfix+"level_"+index+"_dog",lv);
    },

    getLevelDog: function(index)
    {
        var lv = cc.sys.localStorage.getItem(this.pfix+"level_"+index+"_dog");
        lv = lv ? lv : 0;
        return Number(lv);
    },

    uploadLevelDog: function(index)
    {
        var datas = {};
        datas["level_"+index+"_dog"] = this.getLevelDog(index);
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setLock: function(lv)
    {
        cc.sys.localStorage.setItem(this.pfix+"lock",lv);
    },

    getLock: function()
    {
        var lv = cc.sys.localStorage.getItem(this.pfix+"lock");
        lv = lv ? lv : 0;
        return Number(lv);
    },

    uploadLock: function()
    {
        var datas = {};
        datas.lock = this.getLock();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setCarVLv: function(lv)
    {
        cc.sys.localStorage.setItem(this.pfix+"carv_lv",lv);
    },

    getCarVLv: function()
    {
        var lv = cc.sys.localStorage.getItem(this.pfix+"carv_lv");
        lv = lv ? lv : 1;
        return Number(lv);
    },

    uploadCarVLv: function()
    {
        var datas = {};
        datas.carv_lv = this.getCarVLv();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setCarHLv: function(lv)
    {
        cc.sys.localStorage.setItem(this.pfix+"carh_lv",lv);
    },

    getCarHLv: function()
    {
        var lv = cc.sys.localStorage.getItem(this.pfix+"carh_lv");
        lv = lv ? lv : 1;
        return Number(lv);
    },

    uploadCarHLv: function()
    {
        var datas = {};
        datas.carh_lv = this.getCarHLv();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setTask: function(id)
    {
        cc.sys.localStorage.setItem(this.pfix+"task",id);
    },

    getTask: function()
    {
        var id = cc.sys.localStorage.getItem(this.pfix+"task");
        id = id ? id : 1;
        return Number(id);
    },

    uploadTask: function()
    {
        var datas = {};
        datas.task = this.getTask();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setSheep: function(id,lv)
    {
        cc.sys.localStorage.setItem(this.pfix+"sheep_"+id,lv);
    },

    getSheep: function(id)
    {
        var lv = cc.sys.localStorage.getItem(this.pfix+"sheep_"+id);
        lv = lv ? lv : 0;
        return Number(lv);
    },

    uploadSheep: function(id)
    {
        var datas = {};
        datas["sheep_"+id] = this.getSheep(id);
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setBuoy: function(id,lv)
    {
        cc.sys.localStorage.setItem(this.pfix+"buoy_"+id,lv);
    },

    getBuoy: function(id)
    {
        var lv = cc.sys.localStorage.getItem(this.pfix+"buoy_"+id);
        lv = lv ? lv : 0;
        return Number(lv);
    },

    uploadBuoy: function(id)
    {
        var datas = {};
        datas["buoy_"+id] = this.getBuoy(id);
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setRankUp: function(rankup)
    {
        cc.sys.localStorage.setItem(this.pfix+"rankup",rankup);
    },

    addRankUp: function(id)
    {
        if(!this.isRankUp(id))
        {
            var rankup = this.getRankUp();
            rankup.push(id);
            cc.sys.localStorage.setItem(this.pfix+"rankup",JSON.stringify(rankup));
        }
    },

    isRankUp: function(id)
    {
        var rankup = this.getRankUp();
        var b = false;
        for(var i=0;i<rankup.length;i++)
        {
            if(rankup[i] == id)
            {
                b = true;
                break;
            }
        }
        return b;
    },

    getRankUp: function()
    {
        var rankup = cc.sys.localStorage.getItem(this.pfix+"rankup");
        rankup = rankup ? rankup : "[]";
        if(typeof rankup == "object")
            return rankup;
        return JSON.parse(rankup);
    },

    uploadRankUp: function()
    {
        var datas = {};
        datas.rankup = this.getRankUp();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setYesRank: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"yesrank",num);
    },

    getYesRank: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"yesrank");
        num = num ? num : 0;
        return Number(num);
    },

    setMaxRank: function(num)
    {
        var max = this.getMaxRank();
        if(max == 0 || num<max)
        {
            cc.sys.localStorage.setItem(this.pfix+"maxrank",num);
            this.uploadMaxRank();
        }
    },

    getMaxRank: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"maxrank");
        num = num ? num : 0;
        return Number(num);
    },

    uploadMaxRank: function()
    {
        var datas = {};
        datas.maxrank = this.getMaxRank();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setYesRankTime: function(time)
    {
        cc.sys.localStorage.setItem(this.pfix+"yesrank_time",time);
    },

    getYesRankTime: function()
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"yesrank_time");
        time = time ? time : 0;
        return Number(time);
    },


    setLoginTime: function(time)
    {
        cc.sys.localStorage.setItem(this.pfix+"login_time",time);
    },

    getLoginTime: function()
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"login_time");
        time = time ? time : 0;
        return Number(time);
    },

    uploadLoginTime: function()
    {
        var datas = {};
        datas.login_time = this.getLoginTime();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setLoginDay: function(day)
    {
        cc.sys.localStorage.setItem(this.pfix+"login_day",day);
    },

    getLoginDay: function()
    {
        var day = cc.sys.localStorage.getItem(this.pfix+"login_day");
        day = day ? day : 0;
        return Number(day);
    },

    uploadLoginDay: function()
    {
        var datas = {};
        datas.login_day = this.getLoginDay();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setLixianTime: function(time)
    {
        cc.sys.localStorage.setItem(this.pfix+"lixian_time",time);
    },

    getLixianTime: function()
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"lixian_time");
        time = time ? time : new Date().getTime();
        return Number(time);
    },

    uploadLixianTime: function()
    {
        var datas = {};
        datas.lixian_time = this.getLixianTime();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setQianDaoNum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"qiandao_num",num);
    },

    getQianDaoNum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"qiandao_num");
        num = num ? num : 0;
        return Number(num);
    },

    uploadQianDaoNum: function()
    {
        var datas = {};
        datas.qiandao_num = this.getQianDaoNum();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },


    setAddSpeedTime: function(time)
    {
        cc.sys.localStorage.setItem(this.pfix+"addspeed_time",time);
    },

    getAddSpeedTime: function()
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"addspeed_time");
        time = time ? time : 0;
        return Number(time);
    },

    setAddRateTime: function(time)
    {
        cc.sys.localStorage.setItem(this.pfix+"addrate_time",time);
    },

    getAddRateTime: function()
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"addrate_time");
        time = time ? time : 0;
        return Number(time);
    },

    addAddSpeedTask: function(task)
    {
        var tasks = this.getAddSpeedTask();
        //if(tasks.length == 0) this.setAddSpeedTime(new Date().getTime());
        tasks.push(task);
        cc.sys.localStorage.setItem(this.pfix+"addspeed_task",JSON.stringify(tasks));
    },

    removeAddSpeedTask: function(index)
    {
        if(!index) index = 0;
        var tasks = this.getAddSpeedTask();
        if(tasks.length>0) tasks.splice(index,1);
        //if(tasks.length > 0) this.setAddSpeedTime(new Date().getTime());
        cc.sys.localStorage.setItem(this.pfix+"addspeed_task",JSON.stringify(tasks));
    },

    getAddSpeedTask: function()
    {
        var task = cc.sys.localStorage.getItem(this.pfix+"addspeed_task");
        task = task ? task : "[]";
        return JSON.parse(task);
    },

    addAddRateTask: function(task)
    {
        var tasks = this.getAddRateTask();
        //if(tasks.length == 0) this.setAddRateTime(new Date().getTime());
        tasks.push(task);
        cc.sys.localStorage.setItem(this.pfix+"addrate_task",JSON.stringify(tasks));
    },

    removeAddRateTask: function(index)
    {
        if(!index) index = 0;
        var tasks = this.getAddRateTask();
        if(tasks.length>0) tasks.splice(index,1);
        //if(tasks.length > 0) this.setAddRateTime(new Date().getTime());
        cc.sys.localStorage.setItem(this.pfix+"addrate_task",JSON.stringify(tasks));
    },

    updateAddRateTask: function(tasks)
    {
        cc.sys.localStorage.setItem(this.pfix+"addrate_task",JSON.stringify(tasks));
    },

    getAddRateTask: function()
    {
        var task = cc.sys.localStorage.getItem(this.pfix+"addrate_task");
        task = task ? task : "[]";
        return JSON.parse(task);
    },


    setGameNum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"game_num",num);
    },

    getGameNum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"game_num");
        num = num ? num : 0;
        return Number(num);
    },


    setMusic: function(music)
    {
        cc.sys.localStorage.setItem(this.pfix+"music",music);
    },
    getMusic: function()
    {
        var music = cc.sys.localStorage.getItem(this.pfix+"music");
        music = music ? music : 0;
        return Number(music);
    },

    setSound: function(sound)
    {
        cc.sys.localStorage.setItem(this.pfix+"sound",sound);
    },
    getSound: function()
    {
        var sound = cc.sys.localStorage.getItem(this.pfix+"sound");
        sound = sound ? sound : 0;
        return Number(sound);
    },

    setVibrate: function(vibrate)
    {
        cc.sys.localStorage.setItem(this.pfix+"vibrate",vibrate);
    },
    getVibrate: function()
    {
        var vibrate = cc.sys.localStorage.getItem(this.pfix+"vibrate");
        vibrate = vibrate ? vibrate : 0;
        return Number(vibrate);
    },

    setYinDao: function(yindao)
    {
        cc.sys.localStorage.setItem(this.pfix+"yindao",yindao);
    },
    getYinDao: function()
    {
        var yindao = cc.sys.localStorage.getItem(this.pfix+"yindao");
        yindao = yindao ? yindao : 1;
        return Number(yindao);
    },

    uploadYinDao: function()
    {
        var datas = {};
        datas.yindao = this.getYinDao();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setInviteLnum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"invite_lnum",num);
    },
    getInviteLnum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"invite_lnum");
        num = num ? num : 0;
        return Number(num);
    },

    uploadJiabei: function()
    {
        var datas = {};
        datas.gjiabeilist = [];
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setDogCard: function(id)
    {
        cc.sys.localStorage.setItem(this.pfix+"DogCard",id);
    },
    getDogCard: function()
    {
        var id = cc.sys.localStorage.getItem(this.pfix+"DogCard");
        id = id ? id : 1;
        return Number(id);
    },
    uploadDogCard: function()
    {
        var datas = {};
        datas.dogcard = this.getDogCard();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setDogCardLv: function(id,lv)
    {
        cc.sys.localStorage.setItem(this.pfix+"DogCardLv_"+id,lv);
    },
    getDogCardLv: function(id)
    {
        var lv = cc.sys.localStorage.getItem(this.pfix+"DogCardLv_"+id);
        lv = lv ? lv : 0;
        return Number(lv);
    },
    uploadDogCardLv: function(id)
    {
        var datas = {};
        datas["dogcardlv_"+id] = this.getDogCardLv(id);
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },


    setDogCardNum: function(id,num)
    {
        cc.sys.localStorage.setItem(this.pfix+"DogCardNum_"+id,num);
    },
    getDogCardNum: function(id)
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"DogCardNum_"+id);
        num = num ? num : 0;
        return Number(num);
    },
    uploadDogCardNum: function(id)
    {
        var datas = {};
        datas["dogcardnum_"+id] = this.getDogCardNum(id);
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },


    setCailiao: function(type,id,num)
    {
        cc.sys.localStorage.setItem(this.pfix+"cailiao_"+type+"_"+id,num);
    },
    getCailiao: function(type,id)
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"cailiao_"+type+"_"+id);
        num = num ? num : 0;
        return Number(num);
    },
    uploadCailiao: function(type,id)
    {
        var datas = {};
        datas["cailiao_"+type+"_"+id] = this.getCailiao(type,id);
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setCailiaoTime: function(type,id,time)
    {
        cc.sys.localStorage.setItem(this.pfix+"cailiaoTime_"+type+"_"+id,time);
    },
    getCailiaoTime: function(type,id)
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"cailiaoTime_"+type+"_"+id);
        time = time ? time : 0;
        return Number(time);
    },

    //type 1:羊 2：刀
    setPeiyuTime: function(type,id,time)
    {
        cc.sys.localStorage.setItem(this.pfix+"peiyuTime_"+type+"_"+id,time);
    },
    getPeiyuTime: function(type,id)
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"peiyuTime_"+type+"_"+id);
        time = time ? time : 0;
        return Number(time);
    },


    setFreeDiaNum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"freeDiaNum",num);
    },
    getFreeDiaNum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"freeDiaNum");
        num = num ? num : 0;
        return Number(num);
    },

    setShopVcarTime: function(lv,time)
    {
        cc.sys.localStorage.setItem(this.pfix+"shopVcarTime_"+lv,time);
    },
    getShopVcarTime: function(lv)
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"shopVcarTime_"+lv);
        num = num ? num : 0;
        return Number(num);
    },

    setShopHcarTime: function(lv,time)
    {
        cc.sys.localStorage.setItem(this.pfix+"shopHcarTime_"+lv,time);
    },
    getShopHcarTime: function(lv)
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"shopHcarTime_"+lv);
        num = num ? num : 0;
        return Number(num);
    },

    setShopVcarAdNum: function(lv,num)
    {
        cc.sys.localStorage.setItem(this.pfix+"shopVcarAdNum_"+lv,num);
    },
    getShopVcarAdNum: function(lv)
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"shopVcarAdNum_"+lv);
        num = num ? num : 0;
        return Number(num);
    },

    setShopHcarAdNum: function(lv,num)
    {
        cc.sys.localStorage.setItem(this.pfix+"shopHcarAdNum_"+lv,num);
    },
    getShopHcarAdNum: function(lv)
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"shopHcarAdNum_"+lv);
        num = num ? num : 0;
        return Number(num);
    },


    setDogCardTime: function(lv,time)
    {
        cc.sys.localStorage.setItem(this.pfix+"DogCardTime_"+lv,time);
    },
    getDogCardTime: function(lv)
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"DogCardTime_"+lv);
        num = num ? num : 0;
        return Number(num);
    },
    setDogCardAdNum: function(lv,num)
    {
        cc.sys.localStorage.setItem(this.pfix+"DogCardAdNum_"+lv,num);
    },
    getDogCardAdNum: function(lv)
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"DogCardAdNum_"+lv);
        num = num ? num : 0;
        return Number(num);
    },



    setTxLv: function(txlv)
    {
        cc.sys.localStorage.setItem(this.pfix+"txlv",txlv);
    },
    getTxLv: function()
    {
        var txlv = cc.sys.localStorage.getItem(this.pfix+"txlv");
        txlv = txlv ? txlv : 1;
        return Number(txlv);
    },
    uploadTxLv: function()
    {
        var datas = {};
        datas.txlv = this.getTxLv();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },


    setTxNum: function(txnum)
    {
        cc.sys.localStorage.setItem(this.pfix+"txnum",txnum);
    },
    getTxNum: function()
    {
        var txnum = cc.sys.localStorage.getItem(this.pfix+"txnum");
        txnum = txnum ? txnum : 0;
        return Number(txnum);
    },
    uploadTxNum: function()
    {
        var datas = {};
        datas.txnum = this.getTxNum();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setTxTime: function(txtime)
    {
        cc.sys.localStorage.setItem(this.pfix+"txtime",txtime);
    },
    getTxTime: function()
    {
        var txtime = cc.sys.localStorage.getItem(this.pfix+"txtime");
        txtime = txtime ? txtime : 0;
        return Number(txtime);
    },

    setTxTask: function(txtask)
    {
        cc.sys.localStorage.setItem(this.pfix+"txtask",txtask);
    },
    getTxTask: function()
    {
        var txtask = cc.sys.localStorage.getItem(this.pfix+"txtask");
        txtask = txtask ? txtask : 1;
        return Number(txtask);
    },
    uploadTxTask: function()
    {
        var datas = {};
        datas.txtask = this.getTxTask();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setTxTaskCoin: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"txtaskcoin",num);
    },
    getTxTaskCoin: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"txtaskcoin");
        num = num ? num : 0;
        return Number(num);
    },

    setTxTaskLq: function(lv,num)
    {
        cc.sys.localStorage.setItem(this.pfix+"txtasklq_"+lv,num);
    },
    getTxTaskLq: function(lv)
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"txtasklq_"+lv);
        num = num ? num : 0;
        return Number(num);
    },

    setNameUp: function(nameup)
    {
        cc.sys.localStorage.setItem(this.pfix+"nameup",nameup);
    },
    getNameUp: function()
    {
        var nameup = cc.sys.localStorage.getItem(this.pfix+"nameup");
        nameup = nameup ? nameup : 0;
        return Number(nameup);
    },
    uploadNameUp: function()
    {
        var datas = {};
        datas.nameup = this.getNameUp();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    uploadAddmini: function()
    {
        var datas = {};
        datas.addmini = 1;
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },


    scientificToNumber: function(num) {
        var str = num.toString();
        /*6e7或6e+7 都会自动转换数值*/
        var index = str.indexOf("e+");
        if (index == -1) {
            return str;
        } else {
            /*6e-7 需要手动转换*/
            var head = str.substr(0,index);
            var zero = '';
            var len = parseInt(str.substr(index+2,str.length));
            if(head.indexOf(".")>=0)
            {
                var h = head.split(".");
                head = h[0]+h[1];
                len = len - h[1].length;
            }
            for(var i=0;i<len;i++)
            {
                zero += '0';
            }
            return head + zero;
        }
    },


    castNum: function(coin)
    {
        coin = Math.floor(coin);
        var str = this.scientificToNumber(coin);
        var s = '';
        var n = 0;
        if(str.length>3)
            n = parseInt((str.length-1)/3);
        if(n>0)
        {
            coin = parseFloat(coin/Math.pow(1000,n)).toFixed(2);
        }
        str = coin+"";
        var l = str.split(".")[0].split("").reverse();
        for (var i = 0; i < l.length; i++) {
            s += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        s = s.split("").reverse().join("");
        if(n>0)
        {
            var r = str.split(".")[1];
            s = s + "." + r;
            s += this.pice[n-1];
        }
        return s;
    },

    getLabelStr: function(str,num)
    {
        var s = "";
        var len = 0;
        for (var i=0; i<str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                len++;
                if(len>=num-2)
                {
                    if(i != str.length-1)
                        s += "...";
                    break;
                }
                else
                {
                    s += str.charAt(i);
                }
            }
            else {
                len+=2;
                if(len>=num-2)
                {
                    if(i != str.length-1)
                        s += "...";
                    break;
                }
                else
                {
                    s += str.charAt(i);
                }
            }
        }
        return s;
    },

    getCountDown: function(t1,t2,fnum)
    {
        var time = t2 - t1;
        var str = "";
        if(!fnum) fnum = 3;

        if(time<=0)
        {
            if(fnum == 1)
                str = "00";
            else if(fnum == 2)
                str = "00:00";
            else if(fnum == 3)
                str = "00:00:00";

            return str;
        }

        var d = Math.floor(time/(24*60*60*1000));
        var h = Math.floor((time - d*24*60*60*1000)/(60*60*1000));
        var m = Math.floor((time - d*24*60*60*1000 - h*60*60*1000)/(60*1000));
        var s = Math.floor(((time - d*24*60*60*1000 - h*60*60*1000 - m*60*1000))/1000);
        var sd = d < 10 ? "0"+d : d;
        var sh = h < 10 ? "0"+h : h;
        var sm = m < 10 ? "0"+m : m;
        var ss = s < 10 ? "0"+s : s;


        if(fnum == 1)
            str = ss;
        else if(fnum == 2)
            str = sm+":"+ss;
        else if(fnum == 3)
            str = sh+":"+sm+":"+ss;
        else
        {
            if(d>0) str = sd+":"+sh+":"+sm+":"+ss;
            else str = sh+":"+sm+":"+ss;
        }

        return str;
    }
};