var TEXT_TYPE_AUTO  = 'AUTO';

var editor = document.getElementById('editor');
const ctx = editor.getContext('2d');
var opt = {
    width : 800,
};

class Text {
    constructor(text=''){
        this.value = text;
        this.size = 14;
        this.fontStyle = 'Arial';
        this.color = 'black';
    }
}

class Square{

    constructor(ctx,x=10,y=10,width=70,height=25, color='blue'){
        this.text = new Text('Click');
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.textType = TEXT_TYPE_AUTO;
    }

    draw(){
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.drawText();
        this.drawBorder();
    }

    drawText(){
        this.ctx.font = `${this.fontSize}px ${this.fontStyle}`;
        this.ctx.fillStyle = this.text.color;
        const textX = this.x + (this.width / 2) - (this.getTextWidth(this.text.value) / 2);
        const textY = this.y + (this.height / 2) + (this.text.size / 2) - 3;
        this.ctx.fillText(this.text.value, textX, textY);
    }

    drawBorder(){
        this.ctx.strokeStyle = "blue"; 
        this.ctx.strokeRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2); 
    }

    getTextWidth(text){
        return this.ctx.measureText(text).width;
    }

}

class DragAction{
    constructor(addX= -1, addY=-1, index){
        this.addX = addX;
        this.addY = addY;
        this.index = index;
    }
}

class MainContext {

    constructor(ctx){
        this.ctx = ctx;
        this.components = [new Square(this.ctx)];
    }

    onMouseDown(e, _this){
        if(_this.drag) return;

        for(let index in _this.components){
            const component = _this.components[index];
            const endX = component.x + component.width;
            const endY = component.y + component.height;
            if( e.layerX >= component.x && e.layerX <= endX && e.layerY >= component.y && e.layerY <= endY ){
                document.getElementById('editor').style.cursor = 'pointer';
                _this.drag = new DragAction(e.layerX - component.x, e.layerY - component.y, parseInt(index));
                break;
            }
        }
    }

    onMouseUp(e, _this){
        if(!_this.drag) return;

        const grid = 10;
        const component = _this.components[_this.drag.index];
        component.x = component.x - (component.x % grid);
        component.y = component.y - (component.y % grid);
        _this.run();

        _this.drag = null;
        document.getElementById('editor').style.cursor = 'context-menu';
    }

    onMouseMove(e, _this){
        if(!_this.drag) return;

        const component = _this.components[_this.drag.index];
        component.x += (e.layerX - component.x) - _this.drag.addX;
        component.y += (e.layerY - component.y) - _this.drag.addY;
        _this.run();
    }

    drawGrid(){
        for(let i = 1; i < editor.height / 10; i++){
            for(let j = 1; j < editor.width / 10; j++){
                ctx.beginPath();
                ctx.arc(10 * j , 10 * i, 1, 0, 2 * Math.PI);
                ctx.fill(); 
            }
        }
    }

    run(){
        this.ctx.clearRect(0,0,opt.width,500);
        this.drawGrid();
        for(let component of this.components){
            component.draw();
        }
        
    }

    onClick(e, _this){
        for(let index in _this.components){
            const component = _this.components[index];
            const endX = component.x + component.width;
            const endY = component.y + component.height;
            if( e.layerX >= component.x && e.layerX <= endX && e.layerY >= component.y && e.layerY <= endY ){
                document.getElementById('editor').style.cursor = 'pointer';
                _this.drag = new DragAction(e.layerX - component.x, e.layerY - component.y, parseInt(index));
                break;
            }
        }
    }

    onButton(e, _this){
        _this.components.push(new Square(_this.ctx));
        _this.run();
    }

}

function config(editor, opt = {}){
    editor.width = opt.width || 500;
    editor.height = opt.height || 500;
}


config(editor, {
    width: 800
});

const mainContext = new MainContext(ctx);
(function(editor, mainContext){
    editor.onmousedown = (e) => { mainContext.onMouseDown(e, mainContext); };
    editor.onmouseup = (e) => { mainContext.onMouseUp(e, mainContext) };
    editor.onmousemove = (e) => { mainContext.onMouseMove(e, mainContext) };
    document.getElementById('button').onclick = (e) => { mainContext.onButton(e, mainContext) };
}(editor, mainContext));
mainContext.run();
