
class BMWaveform {
    constructor(canvas, color, maxValue, step){
        this.canvas = canvas;
        this.color = color;
        this.maxValue = maxValue;
        this.step = step;

        this.context = this.canvas.getContext("2d");
        this.context.strokeStyle = this.color;
        this.lineWidth = 1.2;
        this.lineCap = 'round';

        this.prevPointX = 0;
        this.prevPointY = this.canvas.height / 2;
    }

    add(yValue){
        var curPointX = this.prevPointX + this.step;

        if(curPointX >= this.canvas.width){
            this.prevPointX = 0;
            curPointX = 0;

            this.context.beginPath();
            this.context.fillRect(0, 0, 5, this.canvas.height);
            this.context.stroke();
        }
        else{
            var curPointY = this.canvas.height - yValue * this.canvas.height / this.maxValue;
            curPointY = curPointY * 0.98;

            this.context.beginPath();
            this.context.fillRect(curPointX, 0, 5, this.canvas.height);
            this.context.moveTo(this.prevPointX, this.prevPointY);
            this.context.lineTo(curPointX, curPointY);
            this.context.stroke();
        }

        this.prevPointX = curPointX;
        this.prevPointY = curPointY;
    }

    addArray(arr){
        while(arr.length > 0){
            this.add(arr.shift());
        }
    }
}