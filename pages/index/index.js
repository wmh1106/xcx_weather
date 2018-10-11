import {
    host,
    weatherMap,
    weatherColorMap
} from '../../utils/util.js'

const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')

const unprompted = 0
const unAuthorized = 1
const authorized = 2

const unprompted_tips = '点击获取当前位置'
const unAuthorized_tips = '点击开启位置权限'
const authorized_tips = ''

// wx.openSetting({success:()=>{}})

let qqmapsdk = new QQMapWX({
    key: 'UUABZ-NM53I-TLEG7-5TAKN-TJNKV-IZFP5'
})

Page({
    data: {
        weatherList: [],
        now: null,
        today: null,
        day: '',
        nowWeatherBackground: '',

		city: '',
        locationTipsText: unprompted_tips,
        locationAuthType: unprompted
    },
    onLoad() {
        const _this = this
        this.setData({
            day: this.getNowDay()
        })

        this.getLocation()

		// this.getWeather()
		
    },

    onShow() {
        wx.getSetting({
            success: res => {
				console.log(res)
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
    getWeather(callBack) {
        const _this = this
		console.log(this.city)
        wx.request({
            url: host + '/api/weather/now',
            data: {
                city: this.city
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.code === 200) {
                    const result = res.data.result
                    _this.setData({
                        weatherList: _this.get24H(result.forecast),
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
    getNowDay() {
        const date = new Date()
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    },

    onTapLocation() {
        this.getLocation()
    },
    getLocation() {
        const _this = this
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success(res) {

                _this.setData({
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
                        _this.setData({
                            city: res.result.address_component.city
                        },function(){
							_this.getWeather()
						})
                    }
                });
            },
            fail(res) {
                _this.setData({
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

    onPullDownRefresh() {
        this.getWeather(() => {
            wx.stopPullDownRefresh()
        })
        console.log("refresh executed!")
    }
})