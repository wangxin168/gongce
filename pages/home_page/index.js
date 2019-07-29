// pages/home_page/index.js
const app = getApp();
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        view: {
            height: null
        }
    },
    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                //   console.log(res);
                wx.setStorageSync('viewHeight', res.windowHeight);
                //设置高度，根据当前设备宽高满屏显示
                that.setData({
                    view: {
                        height: res.windowHeight
                    }
                })
            }
        });
        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.request({
                        url: app.globalData.url + 'index.php/api/Api/get_openid_api',
                        data: {
                            code: res.code
                        },
                        method: "GET",
                        success: function (response) {
                            if (response.data.status == 200) {
                                wx.setStorageSync('openid', response.data.data.openid);
                                wx.setStorageSync('uid', response.data.data.uid);
                                that.setData({
                                    openid: response.data.data.openid
                                })
                            } else {
                                wx.showToast({
                                    title: '请求失败',
                                    icon: 'loading',
                                    duration: 1000
                                })
                            }
                        }
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg);
                }
            }
        })
    },
    wc_guide: function () {
        wx.navigateTo({
            url: '/pages/wc_guide/index',
        })
    },
    bindGetUserInfo: function (e) {

        console.log(e);

        var that = this;

        if (e.detail.userInfo) {

            var user_inf = e.detail.userInfo;

            wx.request({
                url: app.globalData.url + 'index.php/api/Api/get_info',
                data: {

                    uid: wx.getStorageSync('uid'),
                    avatar: user_inf.avatarUrl,
                    nickname: user_inf.nickName

                },
                success: function (res) {

                    that.setData({
                        canIUse: false
                    });
                }
            });

        }

    }
})