// pages/wc_area/wc_area_map/index.js
const app = getApp();
Page({
    data: {
        markers: [{
            id: "1",
            latitude: 39.92,
            longitude: 116.46,
            width: 16,
            height: 20,
            iconPath: "../../../img/addressOn.png",
            callout: {
                content: "西北旺角公厕\n点击图标将进入路线查询",
                color: "#535353",
                fontSize: "24",
                borderRadius: "10",
                bgColor: "#ffffff",
                padding: 20,
                display: "ALWAYS"
            }
        }],
        view: {
            height: null
        }
    },
    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.log(res)
                //设置map高度，根据当前设备宽高满屏显示
                that.setData({
                    view: {
                        height: res.windowHeight
                    }
                })
            }
        });

        that.getinfo();
    },
    location: function () {
        wx.openLocation({
            latitude: 39.92,
            longitude: 116.46,
            name: "西北旺角公厕",
            scale: 28
        })
    }
})