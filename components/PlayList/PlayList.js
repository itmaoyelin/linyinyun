// components/PlayList/PlayList.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        playList:{
            type:Array,
            value:[]
        }
    },
    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        //goto跳转处理函数
        gotoHandle(e){
            // console.log(e)
            //调用函数向父组件发送数据
            this.triggerEvent('Goto',{value:e.currentTarget.dataset.song})

        },
    }
})
