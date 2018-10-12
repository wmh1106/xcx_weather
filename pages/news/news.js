import utils from '../../utils/util.js'

Page({
    data: {
        articles: [],
        defaultImg: '/image/bg.jpg',
		typeText:[{
			type: 'gn',
			text: '国内'
		},
		{
			type: 'gj',
			text: '国际'
		},
		{
			type: 'yl',
			text: '娱乐'
		},
		{
			type: 'js',
			text: '军事'
		},
		{
			type: 'ty',
			text: '体育'
		},
		{
			type: 'other',
			text: '其他'
		}
		],
        newsType: 'gn',
        activeIndex: 0
    },

    onLoad() {
		this.getNews(this.data.newsType)
    },

    onPullDownRefresh() {
		this.getNews(this.data.newsType,() => {
            wx.stopPullDownRefresh()
        })
    },

    getNews(type,callBack) {

        wx.request({
            url: utils.host + '/api/news/list',
            data: {
                type: type
            },
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                let list = res.data.result

				console.log(list)

				list = list.map(item=>{
					let date = utils.changeTime(item.date)

					return {
						...item,
						date
					}
				})

                this.setData({
                    articles: list
                })
            },
            complete() {
                callBack && callBack()
            }
        })
    },
    goToDetails(event) {
        const id = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/news/newsDetails/newsDetails?id=' +id
        })
    },

	bindCutClass(event){
		const index = event.currentTarget.dataset.index
		const type = event.currentTarget.dataset.type
		this.setData({
			activeIndex : index,
			newsType: type
		},()=>{
			this.getNews(this.data.newsType)
		})
	},


})