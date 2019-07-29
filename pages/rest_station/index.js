// pages/rest_station/index.js
const app = getApp();
Page({
    data: {
        current_address: "",
        wc_guide_info: [],
        current_page: 1,
        sum_page: 1
    },
    onLoad: function (options) {
        var that = this;
        app.globalData.qqmapsdk.reverseGeocoder({
            location: {
                latitude: app.globalData.location.latitude,
                longitude: app.globalData.location.longitude
            },
            success: function (res) {
                
                var address = res.result.address;
                that.setData({
                    current_address: address
                });

            },
            fail: function (res) {
                wx.showToast({
                    title: '解析地址错误',
                    icon: 'loading',
                    duration: 1000
                });

            },

        });
        that.getwcinfo();
    },
    onPullDownRefresh: function () {
        var that = this;
        wx.stopPullDownRefresh();
        that.setData({
            current_address: that.data.current_address,
            wc_guide_info: [],
            current_page: 1,
            sum_page: 1
        })
        that.getwcinfo();
    },
    getwcinfo: function () {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: app.globalData.url + 'index.php/api/Home/index',
            data: {
                type: 3,
                lng: app.globalData.location.longitude,
                lat: app.globalData.location.latitude,
                page: that.data.current_page,
                page_size: 8
            },
            success: function (data) {
                wx.hideLoading();
                if (data.data.status == 200) {
                    if (that.data.current_page == 1) {
                        that.setData({
                            wc_guide_info: data.data.data.res,
                            sum_page: data.data.data.totalpage
                        })
                    } else {
                        var new_page_cont = that.data.wc_guide_info;
                        var current_guide_list = data.data.data.res;
                        for (var i = 0; i < current_guide_list.length; i++) {
                            new_page_cont.push(current_guide_list[i])
                        }
                        that.setData({
                            wc_guide_info: new_page_cont
                        })
                    }

                } else {
                    wx.showToast({
                        title: data.data.error,
                        icon: 'loading',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '请求失败',
                    icon: 'loading',
                    duration: 1000
                })
            }
        })
    },
    onReachBottom: function (e) {
        var that = this;
        var current_page = null;
        current_page = that.data.current_page + 1;
        that.setData({
            current_page: current_page
        })
        if (current_page <= that.data.sum_page) {
            wx.showToast({
                title: '加载中！',
                icon: 'loading',
                duration: 1000
            })
            that.getwcinfo();
        } else if (current_page > that.data.sum_page) {
            wx.showToast({
                title: '数据已加载完',
                icon: 'loading',
                duration: 1000
            });
            return;
        }

    },
    wc_area: function (e) {
        wx.navigateTo({
            url: '/pages/wc_area/index?id=' + e.currentTarget.dataset.id
        })
    }
})