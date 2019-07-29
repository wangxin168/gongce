// pages/suggest/index.js
const app = getApp();
var nav_style = ['active', '', ''];
Page({
    data: {
        view: {
            height: wx.getStorageSync('viewHeight')
        },
        nav_style: nav_style,
        suggest_all_list: [],
        record_type: 0,
        current_page: 1,
        sum_page: 1,
        current_index:0

    },
    onLoad: function (options) {
        var that = this;
        that.suggest_all(3);

    },
    onPullDownRefresh: function () {
        var that = this;
        wx.stopPullDownRefresh();
        that.setData({
            suggest_all_list: [],
            current_page: 1,
            sum_page: 1
        })
        that.suggest_all(that.data.current_index == 0 ? 3 : that.data.current_index);
    },
    tab_nav_item: function (e) {

        var that = this;

        var index = e.currentTarget.dataset.index;

        var nav_style = ['', '', ''];

        nav_style[index] = 'active';

        that.setData({
            nav_style: nav_style,
            current_index: index,
            current_page:1
        });
        if (index == 0) {
            that.suggest_all(3);
        } else if (index == 1) {
            that.suggest_all(1);
        } else if (index == 2) {
            that.suggest_all(2);
        }
    },
    // 全部
    suggest_all: function (type) {
        var that = this;

        var  suggest_all_list = that.data.suggest_all_list;      

        // console.log("当前页" + that.data.current_page)
        wx.showLoading({
            title: '加载中',
        })
        
        wx.request({
            url: app.globalData.url + 'index.php/api/Home/advise',
            data: {
                uid: wx.getStorageSync("uid"),
                page: that.data.current_page,
                page_size: 8,
                status: type
            },
            success: function (resquest) {
                wx.hideLoading();
                if (resquest.data.status == 200) {
                    if (that.data.current_page==1){
                        if (resquest.data.data.res.length == 0){
                            that.setData({
                                record_type: 0,
                            })
                            return;
                        }
                        
                        suggest_all_list=[];

                        suggest_all_list = resquest.data.data.res;
                        
                        that.setData({
                            record_type: 1,
                            suggest_all_list: suggest_all_list,
                            sum_page: resquest.data.data.totalpage
                        })
                        
                    }else{
                        var new_page_cont = that.data.suggest_all_list;
                        var now_suggest_all_list = resquest.data.data.res;
                        for (var i = 0; i < now_suggest_all_list.length; i++) {
                            // console.log(now_suggest_all_list[i]);
                            new_page_cont.push(now_suggest_all_list[i]);
                        }
                        that.setData({
                            record_type: 1,
                            suggest_all_list: new_page_cont
                        })
                    }
                } else {
                    wx.showToast({
                        title: resquest.data.error,
                        icon: 'loading',
                        duration: 1000
                    })
                }
            },
            fail: function (res) {
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
            that.suggest_all(that.data.current_index == 0 ? 3 : 　that.data.current_index);
        } else if (current_page > that.data.sum_page) {
            wx.showToast({
                title: '数据已加载完',
                icon: 'loading',
                duration: 1000
            });
            return;
        }
    },
    // 未处理状态下删除建议
    suggest_del: function (e) {
        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        wx.request({
            url: app.globalData.url + 'index.php/api/Home/del_advise',
            data: {
                id: e.currentTarget.dataset.id
            },
            success: function (res) {
                if (res.data.status == 200) {
                    that.suggest_all(that.data.current_index == 0 ? 3 : that.data.current_index);
                } else {
                    wx.showToast({
                        title: res.data.error,
                        icon: 'loading',
                        duration: 1000
                    })
                }

            },
            fail: function (error) {
                wx.showToast({
                    title: '请求失败',
                    icon: 'loading',
                    duration: 1000
                })
            }
        })
    },
    my_suggest: function () {
        wx.navigateTo({
            url: '/pages/suggest/mysuggest/index',
        })
    }
})