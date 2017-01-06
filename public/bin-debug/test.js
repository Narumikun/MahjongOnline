var tr = egret.sys.tr;
/**
 * Created by Narumi on 2016/12/9.
 */
var test_cases = {};
var Tester = (function () {
    function Tester() {
        this.canvas = document.getElementsByTagName('canvas')[0];
    }
    Tester.prototype.startTest = function () {
        setInterval(this.monkey, 2000);
    };
    Tester.prototype.monkey = function () {
        var canvas = document.getElementsByTagName('canvas')[0];
        var x = Math.random() * canvas.width, y = Math.random() * canvas.height;
        var event = new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP, false, true, x, y);
        var targets = [manager.actions.action_sprites, manager.actions.option_sprites, manager.hand_tiles[0]];
        var target, num;
        if (manager.button.parent) {
            manager.button.dispatchEvent(event);
        }
        for (var i = 0; i < targets.length; i++) {
            num = targets[i].numChildren;
            target = targets[i].getChildAt(Math.floor(Math.random() * num));
            if (target) {
                target.dispatchEvent(event);
            }
        }
    };
    return Tester;
}());
/*
 class Tester {
 private monkey;
 private decorDispatcher;
 public constructor(){

 this.monkey = new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP);
 this.decorDispatcher = new MyEventDispatcher();
 this.decorDispatcher.addEventListener(egret.TouchEvent, this, this);

 }

 public startTest(width,height,baseX=0,baseY=0) {
 var stageX = baseX + Math.random()*width;
 var stageY = baseY + Math.random()*height;
 egret.TouchEvent.dispatchTouchEvent(this.decorDispatcher,egret.TouchEvent.TOUCH_TAP,true,false,stageX,stageY)
 }
 }

 class MyEventDispatcher extends egret.HashObject implements egret.IEventDispatcher {
 private dispatcher:egret.EventDispatcher;

 public constructor() {
 super();
 this.dispatcher = new egret.EventDispatcher(this);
 }

 public once(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
 this.dispatcher.once(type, listener, thisObject, useCapture, priority);
 }

 public addEventListener(type:string, listener:Function, thisObject:any,
 useCapture:boolean = false, priority:number = 0):void {
 this.dispatcher.addEventListener(type, listener, thisObject, useCapture, priority);
 }

 public dispatchEvent(evt:egret.Event):boolean {
 return this.dispatcher.dispatchEvent(evt);
 }

 public hasEventListener(type:string):boolean {
 return this.dispatcher.hasEventListener(type);
 }

 public removeEventListener(type:string, listener:Function, useCapture:boolean = false):void {
 this.dispatcher.removeEventListener(type, listener, useCapture);
 }

 public willTrigger(type:string):boolean {
 return this.dispatcher.willTrigger(type);
 }
 }
 */ 
