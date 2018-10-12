import utils from '../../utils/util.js'

const dayMap = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

Page({
	data:{
		list:[],
		city:'',
	},
	onLoad(event){
		this.setData({
			city: event.city
		})
		this.getWeather()
	},
	getWeather(callBack) {
		
		wx.request({
			url: utils.host + '/api/weather/future',
			data: {
				time: new Date().getTime(),
				city: this.city
			},
			header: {
				'content-type': 'application/json'
			},
			success:(res)=> {

				if (res.data.code === 200) {
					const result = res.data.result
					const list = result.map((item, index) => {
						return {
							...item,
							week: dayMap[index],
							time: utils.getNowDay(),
							src: '/image/' + item.weather + '-icon.png'
						}
					})
					this.setData({
						list:list
					})
				}
			},
			complete() {
				callBack && callBack()
			}
		})
	}

})