import utils from '../../../utils/util.js'

Page({
    data: {
        defaultImg: '/image/bg.jpg',
        id: -1,

		content:[],
		firstImage:'',
		id:-1,
		readCount:0,
		source:'',
		title:'',
		date:''
    },
    onLoad(event) {
        this.setData({
            id: event.id
        }, () => {
            this.getDetail(this.data.id)
        })
    },
    onPullDownRefresh() {
        this.getDetail(this.data.id, () => {
            wx.stopPullDownRefresh()
        })
    },

    getDetail(id, callBack) {

        wx.request({
            url: utils.host + '/api/news/detail',
            data: {
                id: id
            },
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                console.log()

                const {
                    content,
                    firstImage,
                    id,
                    readCount,
                    source,
                    title,
                    date
                } = res.data.result

				this.setData({
					content,
					firstImage,
					id,
					readCount,
					source,
					title,
					date: utils.changeTime(date)
				})
            },
            complete() {
                callBack && callBack()
            }
        })
    },
})