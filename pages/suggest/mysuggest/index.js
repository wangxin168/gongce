// pages/suggest/mysuggest/index.js
const app = getApp();
Page({
    data: {
        login_member:''         //输入的手机号
    },
    input_val:function(e){
        var userphone = e.detail.value;
        this.setData({
            login_member: userphone
        })
    },
    formsubmit:function(e){
        var that = this;
        if (!e.detail.value.username) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'loading',
                duration: 1000
            })
            return;
        } else if (!e.detail.value.userphone) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'loading',
                duration: 1000
            })
            return;
        }else if (!e.detail.value.describtion) {
            wx.showToast({
                title: '请输入情况描述',
                icon: 'loading',
                duration: 1000
            })
            return;
        }
        if (that.data.login_member.length == 11) {
            var myreg = /^1\d{10}$/;
            if (!myreg.test(that.data.login_member)) {
                wx.showToast({
                    title: '请输入正确的手机号',
                    icon: 'loading',
                    duration: 1000
                });
                return;
            }
        } else {
            wx.showToast({
                title: '请输入完整手机号',
                icon: 'loading',
                duration: 1000
            })
            return;
        }
        wx.request({
            url: app.globalData.url + 'index.php/api/Home/add_advise',
            data: {
                uid: wx.getStorageSync("uid"),
                name: e.detail.value.username,
                mobile: e.detail.value.userphone,
                description: e.detail.value.describtion
            },
            success: function (res) {
                if (res.data.status == 200) {
                    wx.showToast({
                        title: '提交成功',
                        duration: 1000
                    })
                    wx.navigateTo({
                        url: '/pages/suggest/index',
                    })
                } else {
                    wx.showToast({
                        title: res.data.error,
                        icon: "loading",
                        duration: 1000
                    })
                }
            },
            fail: function (error) {
                wx.showToast({
                    title: '提交失败',
                    icon: "loading",
                    duration: 1000
                })
            }
        })
    }
})