var storage = require("storage");
var res = require("res");

const {ccclass, property} = cc._decorator;

@ccclass
export default class recorderaward extends cc.Component {

   
    award = 0;
    game = null;
    // onLoad () {}

    start () {
       this.updateUI();
       var coin_val = cc.find("bg/box/goldbg/num",this.node).getComponent(cc.Label);
       coin_val.string = storage.castNum(this.award);
    }

    updateUI()
    {
       
    }

    lingqu(){
        this.game.startRecorder();
        this.hide();
    }

    show(data){
        this.game = cc.find("Canvas").getComponent("main");
        this.award = this.game.getSecVal()*10*60;
        cc.sdk.showBanner();
    }

    hide(){
        this.node.destroy();
        cc.sdk.hideBanner();
    }

    click(event,data){
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "lingqu")
        {
            this.lingqu();
        }
       
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
