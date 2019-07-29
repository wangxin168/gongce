// pages/introduce/index.js

const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        introduceImg: [],
        introduce: null
    },

    onLoad: function (options) {
        var that = this;
        that.getIntroduce();
    },
    getIntroduce: function () {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: app.globalData.url + 'index.php/api/Home/introduction',
            success: function (res) {
                wx.hideLoading();
                if (res.data.status == 200) {
                    that.setData({
                        introduceImg: res.data.data.images,
                        introduce: WxParse.wxParse('introduce', 'html', res.data.data.introduction, that, 5)
                    })
                }else{
                    wx.showToast({
                        title: res.data.message,
                        icon: 'loading',
                        duration: 1000
                    });
                }
            },
            fail: function (res) {
                wx.hideLoading();
                wx.showToast({
                    title: '请求失败',
                    icon: 'loading',
                    duration: 1000
                });
            }
        })
    }

})