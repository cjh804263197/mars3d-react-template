import React from "react";

// 使用免费开源版本
import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'

import "./style.css";

let Cesium = mars3d.Cesium

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      mapDivId: "mars3dView",
      mainMap: null,
      postInit: true,
      activeNav: "",
      activePage: "三维地球"
    };
  }

  componentDidMount() {
    var mapUrl = "config/config.json"
    mars3d.Resource.fetchJson({ url: mapUrl }).then((data) => {
      this.initMars3d(data.map3d)// 构建地图
    })
  }
  initMars3d(mapOptions) {
    // 创建三维地球场景
    var map = new mars3d.Map(`mars3dView`, mars3d.Util.merge(mapOptions, {
      terrain: false
    }))
    console.log('>>>>> 地图创建成功 >>>>', map)

    this.onMapload(map)
  }


  // 地图构造完成回调
  onMapload(map) {

    const tiles3dLayer = new mars3d.layer.TilesetLayer({
      url: 'https://oss.meshkit.cn/mesh-share-bucket/cc_projects/210317hongxingwenzhoushengmingjiankangxiaozhen/terra_b3dms/tileset.json',
      maximumScreenSpaceError: 1,
      maximumMemoryUsage: 1024,
      flyTo: true,
      // shadows: Cesium.ShadowMode.ENABLED,
    })

    tiles3dLayer.on(mars3d.EventType.initialTilesLoaded,() =>
    {
      // this.loadViewShed3D(map)
      this.loadVolume(map)
    })

    map.addLayer(tiles3dLayer)
  }

  /**
   * 可视域分析
   * @param {*} map
   */
  loadViewShed3D(map)
  {
    const viewShed3D = new mars3d.thing.ViewShed3D({
      cameraPosition: {
        lng: 120.688593,
        lat: 27.94593,
        alt: 20
      },
      visibleAreaColor: new Cesium.Color(0, 255, 0, 1),
      offsetHeight: 1.5
    })

    map.addThing(viewShed3D)
  }

  /**
   * 挖填方算量
   * @param {*} map
   */
  loadVolume(map)
  {
    const measure = new mars3d.thing.Measure({
      label: {
        color: "#ffffff",
        font_family: "楷体",
        font_size: 20,
      },
    });
    map.addThing(measure);

    // 土方算量
    const measureVolume =measure.volume({
      positions: mars3d.PointTrans.lonlats2cartesians([
        [120.688418, 27.946292, 17],
        [120.688774, 27.946256, 17],
        [120.688785,27.945969, 16.9],
        [120.688466, 27.946002, 17.1],
        [120.688168, 27.946131, 17.1]
      ]),
      has3dtiles: true,
      minHeight: 0,
      maxHeight: 25,
      height: 0,
      // splitNum: 10,
    })

    measureVolume.on(mars3d.EventType.end, function (event) {
      console.log("分析完成", event);
    });
  }

  componentWillUnmount() {

  }

  componentDidUpdate() {
    console.log("component did update!");
  }


  render() {
    let mapStyle = { height: "100%", width: "100%" };
    return (
      <React.Fragment>
        <div id="mars3dContainer" className="itemContainer bg-gis collapsed">
          <div id="mars3dView" style={mapStyle} className="appmap" />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
