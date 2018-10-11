import {
	host
} from '../../utils/util.js'

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
		console.log(event.city)
		this.getWeather()
	},
	getWeather(callBack) {
		const _this = this
		wx.request({
			url: host + '/api/weather/future',
			data: {
				time: new Date().getTime(),
				city: _this.city
			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {

				if (res.data.code === 200) {
					const result = res.data.result
					console.log(result)
					const list = result.map((item, index) => {
						return {
							...item,
							week: dayMap[index],
							time: _this.getNowDay(),
							src: '/image/' + item.weather + '-icon.png'
						}
					})
					console.log(list)
					_this.setData({
						list:list
					})
				}
			},
			complete() {
				callBack && callBack()
			}
		})
	},
	getNowDay() {
		const date = new Date()
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
	},
})