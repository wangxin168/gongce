//app.js
var QQMapWX = require('/utils/qqmap-wx-jssdk.min.js');
App({
    onLaunch: function () {
        var that = this;

        that.globalData.qqmapsdk = new QQMapWX({
          key: 'KPVBZ-I3S3V-MMOPH-UIWX5-BSW53-XFFWG'
        });
        wx.getLocation({
            altitude: false,
            success: function (res) {
              console.log(res)
                var latitude = res.latitude;
                var longitude = res.longitude;
                that.globalData.location = {
                    latitude: latitude,
                    longitude: longitude
                }
            },
            fail: function () {
                setTimeout(function () {

                    wx.getSetting({
                        success: (res) => {
                            console.log(res)
                            if (!res.authSetting['scope.userLocation']) {

                                wx.openSetting({
                                    success: (response) => {
                                        wx.showModal({
                                            title: '请重新授权',
                                            content: '需要获取您的地址信息',
                                            success: function (data) {
                                                // console.log("授权1" + data.cancel);
                                                // console.log("授权2" + data.confirm);
                                                wx.getLocation({
                                                    success: function (res) {
                                                        console.log("地址" + res.latitude)
                                                        var latitude = res.latitude;
                                                        var longitude = res.longitude;
                                                        that.globalData.location = {
                                                            latitude: latitude,
                                                            longitude: longitude
                                                        }
                                                    }
                                                })
                                            }
                                        });


                                    }
                                })

                            }
                        }
                    })

                }, 1000);
            }
        });
    },
    globalData: {
      url: 'https://www.hlhuxcx.top/'
    }
})