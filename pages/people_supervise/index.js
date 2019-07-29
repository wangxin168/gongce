// pages/people_supervise/index.js

const app = getApp();

Page({

    data: {
        tip_msg: 'toast提示信息',
        showToast: false,
        userInfo: null,
        login_member: '',         //输入的手机号
        poster_src_add: "../../img/add.png",
        poster_src: [],
        area_list: [],
        height: wx.getStorageSync('viewHeight'),
        area_id: null,
        upload_img: [],
        index:0,
        choose_address:[]
        
    },
    onLoad:function(){
        var that=this;
        that.get_area_list();
    },
    input_val: function (e) {

        var val = e.detail.value;

        this.setData({

            login_member: val

        });

    },

    bindPickerChange: function (e) {
        var area_id= parseInt(e.detail.value);
        var choose_address = this.data.choose_address;
        this.setData({
            index: e.detail.value,
            area_id: choose_address[area_id]['id']
        });
    },
    get_area_list: function (e) {
        var that = this;
        wx.showLoading({
            title: '加载中'
        })
        
        wx.request({
            url: app.globalData.url + 'index.php/api/Home/get_area',
            success: function (res) {
                wx.hideLoading();
                if (res.data.status == 200) {
                    var choose_address=[];
                    for (var i = 0; i < res.data.data.length;i++){
                        choose_address.push(res.data.data[i].name);
                    }
                    that.setData({
                        area_list: choose_address,
                        choose_address: res.data.data,
                        area_id: res.data.data[0].id
                    });
                } else {
                    wx.showToast({
                        title: res.data.error,
                        icon: 'loading',
                        duration: 1000
                    })
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
    
    //图片上传
    up_img: function () {
        var that = this;
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                console.log(res.tempFilePaths);
                var successUp = 0; //成功个数
                var failUp = 0; //失败个数
                var length = res.tempFilePaths.length; //总共个数
                var i = 0; //第几个
                that.upload(res.tempFilePaths, successUp, failUp, i, length);
            }
        })
    },
    upload: function (filePaths, successUp, failUp, i, length) {
        var that = this;
        console.log("imgurl=" + filePaths);
        console.log("imgurl=" + filePaths[i]);
        wx.uploadFile({
            url: app.globalData.url + 'index.php/api/Home/tpupload',
            filePath: filePaths[i],
            name: 'file',
            success: function (res) {
                var res_data = JSON.parse(res.data);

                if (res_data.status == 200) {
                    successUp++;

                    var arrimg = that.data.poster_src;
                    var now_upload_img = that.data.upload_img

                    arrimg.push(filePaths[i]);
                    now_upload_img.push(res_data.data);
                    // console.log("now_upload_img=" + now_upload_img);
                    // console.log("arrimg=" + arrimg);
                    that.setData({
                        poster_src: arrimg,
                        upload_img: now_upload_img
                    });

                } else {
                    wx.showToast({
                        title: res_data.error,
                        icon: 'loading',
                        duration: 1000
                    })
                }

            },
            fail: function (e) {
                failUp++;
                wx.showToast({
                    title: '请求失败',
                    icon: 'loading',
                    duration: 1000
                })
            },
            complete: function () {
                i++;
                if (i == length) {
                    wx.showToast({
                        title: '总共' + successUp + '张上传成功,' + failUp + '张上传失败！',
                        icon: 'loading',
                        duration: 1000
                    })
                }
                else {  //递归调用uploadDIY函数
                    that.upload(filePaths, successUp, failUp, i, length);
                }
            }
        })
    },
    // 删除图片
    delimg: function (e) {
        var imgs = this.data.poster_src;
        var index = e.currentTarget.dataset.index;
        imgs.splice(index, 1);
        this.setData({
            poster_src: imgs
        });
    },
    formsubmit: function (e) {
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
        } else if (!that.data.area_id) {
            wx.showToast({
                title: '请选择所在区域',
                icon: 'loading',
                duration: 1000
            })
            return;
        } else if (!e.detail.value.useraddress) {
            wx.showToast({
                title: '请输入具体地址',
                icon: 'loading',
                duration: 1000
            })
            return;
        } else if (!e.detail.value.describtion) {
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
            });
            return;
        }

        var upload_img_str = null;

        for (var i = 0; i < that.data.upload_img.length; i++) {

            if (i == 0) {

                upload_img_str = that.data.upload_img[i];

            } else {

                upload_img_str += ',' + that.data.upload_img[i];
            }

        }
        if (upload_img_str==null){
            wx.showToast({
                title: '请上传图片',
                icon: 'loading',
                duration: 1000
            })
            return;
        }
        // upload_img_str.toString();
        // console.log(upload_img_str);
        // console.log("area_id="+that.data.area_id);

        // return;
        wx.request({
            url: app.globalData.url + 'index.php/api/Home/add_supervise',
            data: {
                // code: e.detail.value.usercode,
                uid: wx.getStorageSync("uid"),
                name: e.detail.value.username,
                mobile: e.detail.value.userphone,
                area_id: that.data.area_id,
                address: e.detail.value.useraddress,
                describtion: e.detail.value.describtion,
                images: upload_img_str
            },
            success: function (res) {
                if (res.data.status == 200) {
                    wx.showToast({
                        title: '提交成功',
                        duration: 1000
                    })
                    wx.reLaunch({
                        url: '/pages/home_page/index'
                    });
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

});
