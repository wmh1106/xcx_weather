

import utils from '../../utils/util.js'

const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')

const weatherMap = {
    'sunny': '晴天',
    'cloudy': '多云',
    'overcast': '阴',
    'lightrain': '小雨',
    'heavyrain': '大雨',
    'snow': '雪'
}

const weatherColorMap = {
    'sunny': '#cbeefd',
    'cloudy': '#deeef6',
    'overcast': '#c6ced2',
    'lightrain': '#bdd5e1',
    'heavyrain': '#c5ccd0',
    'snow': '#aae1fc'
}

const unprompted = 0
const unAuthorized = 1
const authorized = 2

const unprompted_tips = '点击获取当前位置'
const unAuthorized_tips = '点击开启位置权限'
const authorized_tips = ''

// wx.openSetting({success:()=>{}})

const qqmapsdk = new QQMapWX({
	key: utils.qqMapKeySDK
})

Page({
    data: {
        weatherList: [],
        now: null,
        today: null,
        day: '',
        nowWeatherBackground: '',
        // 城市相关
        city: '',
        locationTipsText: unprompted_tips,
        locationAuthType: unprompted
    },

    onLoad() {

        this.setData({
			day: utils.getNowDay()
        })

        this.getLocation()

        // this.getWeather()
    },

    onShow() {
        wx.getSetting({
            success: res => {
                let auth = res.authSetting['scope.userLocation']
                if (auth && this.data.locationAuthType !== authorized) {
                    //权限从无到有
                    this.setData({
                        locationAuthType: authorized,
                        locationTipsText: authorized_tips
                    })
                    this.getLocation()
                }
                //权限从有到无未处理
            }
        })
    },

	onPullDownRefresh() {
		this.getWeather(() => {
			wx.stopPullDownRefresh()
		})
	},

	bindTapLocation() {
		this.getLocation()
	},

    getWeather(callBack) {
        wx.request({
            url: utils.host + '/api/weather/now',
            data: {
                city: this.data.city
            },
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                if (res.data.code === 200) {
                    const result = res.data.result

                    this.setData({
                        weatherList: this.get24H(result.forecast),
                        now: {
                            ...result.now,
                            text: weatherMap[result.now.weather]
                        },
                        today: result.today,
                        nowWeatherBackground: '/image/' + result.now.weather + '-bg.png'
                    })
                    wx.setNavigationBarColor({
                        frontColor: '#000000',
                        backgroundColor: weatherColorMap[result.now.weather]
                    })
                }
            },
            complete() {
                callBack && callBack()
            }
        })
    },

    getLocation() {
		
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {

                this.setData({
                    locationTipsText: authorized_tips,
                    locationAuthType: authorized
                })

                const latitude = res.latitude
                const longitude = res.longitude

                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    success: res => {
                        this.setData({
                            city: res.result.address_component.city
                        }, () => {
							console.log(this.data.city)
                            this.getWeather()
                        })
                    }
                });
            },
            fail: (res) => {
                this.setData({
                    locationTipsText: unAuthorized_tips,
                    locationAuthType: unAuthorized
                })
            }
        })


    },

    get24H(arr) {

        const now = new Date().getHours()

        return arr.map((item, index) => {
            item.src = '/image/' + item.weather + '-icon.png'
            if (index === 0) {
                item.time = '现在'
                return item
            } else {
                item.time = (index * 3 + now) % 24
                return item
            }
        })
    },

    goToList(event) {
        const city = event.currentTarget.dataset.city
        wx.navigateTo({
            url: '/pages/list/list?city=' + city
        })
    },

    
})