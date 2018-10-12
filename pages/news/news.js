import utils from '../../utils/util.js'
const newUrl = 'http://v.juhe.cn/toutiao/index'

import {
    newListData
} from '../../mook/news.js'

Page({
    data: {
        articles: [],
		defaultImg:'/image/bg.jpg'
    },

    onLoad() {
        this.getNews()
    },

	onPullDownRefresh() {
		this.getNews(() => {
			wx.stopPullDownRefresh()
		})
	},

    getNews(callBack) {
        
        wx.request({
            url: newUrl,
            data: {
                type: 'top',
                key: utils.newKeySDK
            },
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
				console.log(res)
				const list = res.data.result.data
                this.setData({
					articles: list
                })
            },
            complete() {
				callBack && callBack()
		}
        })
    },
	goToDetails(event){
		console.log(event)
		const url = event.currentTarget.dataset.url
		wx.navigateTo({
			url: '/pages/news/newsDetails/newsDetails?url=' + url
		})
	}
})