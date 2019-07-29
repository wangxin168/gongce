// pages/wc_area/index.js
const app = getApp();
Page({
    data: {
        map:{
            lat:0,
            lng:0,
            markers:[],
            navigation:null
        },
        service_detail: [],
        wc_id:null,
        
    },

    onLoad: function (options) {
        var that = this;
        that.setData({
            wc_id: options.id
        })
        that.get_wc_detail();
    },
    get_wc_detail: function () {
        var that=this;
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: app.globalData.url + 'index.php/api/Home/service_detail',
            data:{
                id: that.data.wc_id,
                lng: app.globalData.location.longitude,
                lat: app.globalData.location.latitude
            },
            success:function(res){
                console.log(res)
                wx.hideLoading();
                if(res.data.status==200){
                    that.setData({
                        navigation: res.data.data.name,
                        service_detail: res.data.data,
                        'map.lat': res.data.data.lat,
                        'map.lng':res.data.data.lng,
                        'map.markers':[{
                            latitude: res.data.data.lat,
                            longitude: res.data.data.lng,
                            name: res.data.data.title
                        }]
                    })
                    wx.setNavigationBarTitle({
                        title: that.data.navigation
                    })  
                }else{
                    wx.showToast({
                        title: res.data.error,
                        icon:'loading',
                        duration:1000
                    })
                }
            },
            fail:function(){
                wx.hideLoading();
                wx.showToast({
                    title: '请求失败',
                    icon:'loading',
                    duration:1000
                })
            }
        })
    },
    location:function(){
        wx.openLocation({
            latitude: this.data.map.lat,
            longitude: this.data.map.lng,
            name: this.data.navigation,
            scale: 28
        })
    }
})