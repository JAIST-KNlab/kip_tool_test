import React from 'react';
import './App.css';
import { Rnd } from 'react-rnd';

let common = {
  socket: null, metric_rel: [],
  metric_name: [
  "温度", "湿度", "照度", "UV", "不快指数", "気圧", "騒音",
  "暑さ指数",
  "総人数",
  "平均人数",
  "休憩人数",
   "休憩女性数", "休憩笑顔数" ,"休憩感情(hapiness)","休憩感情(surprise)", "休憩感情(neutral)", "休憩感情(sadness)", "休憩感情(anger)","休憩感情(contempt)","休憩感情(disgust)","休憩感情(fear)"],
  metric_prop: { width: 150, height: 50 }
};
//let common = {socket: null, metric_rel: [], metric_name: ["温度", "湿度", "照度", "UV", "不快指数", "気圧", "騒音", "暑さ指数", "総人数"], metric_prop: { width: 150, height: 50 } };

common.socket = io.connect();

for(let cmi = 0; cmi < common.metric_name.length; cmi++)
common.metric_rel.push({ name: "", id: [cmi], weight:[1], x: Math.random() * 1000, y: Math.random() * 700, focus: false })

class Metric extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();

    let minfo, name;

    this.basic_style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '30px',
      border: 'none'
    }

    //display none if out of common.metric_rel info range
    if (this.props.key_num > common.metric_rel.length - 1) {
      this.active = false;
      this.basic_style.display = "none";
      this.state = {
        name: "",
        id: [-1],
        weight: [1],
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        focus: false,
        style: this.basic_style
      }

    } else {
      this.active = true;
      minfo = common.metric_rel[this.props.key_num];
      /**
      name = "";
      if (!minfo.name) {
        for (let mii = 0; mii < minfo.id.length; mii++) {
          name = name + common.metric_name[minfo.id[mii]];
        }
      } else {
        name = minfo.name;
      }
      */

      let size_height = minfo.id.length * common.metric_prop.height + 40;

      if (minfo.id.length > 1) {
        this.basic_style.border = 'solid 1px #000000';
      }

      if(minfo.focus){
        this.basic_style.border = 'solid 3px #ff0000';
      }

      this.state = {
        name: minfo.name,
        id: minfo.id,
        weight: minfo.weight,
        position: { x: minfo.x, y: minfo.y },
        size: { width: common.metric_prop.width, size_height },
        focus: minfo.focus,
        style: this.basic_style
      }
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps() {

    if (this.props.key_num > common.metric_rel.length - 1) {
      this.active = false;
      this.basic_style.display = "none";
      this.basic_style.border = 'none';
      this.setState({
        name: "",
        id: [-1],
        weight: [1],
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        focus: false,
        style: this.basic_style
      })
    } else {
      this.active = true;

      let minfo = common.metric_rel[this.props.key_num];
      /**
      let name = "";
      if (!minfo.name) {
        for (let mii = 0; mii < minfo.id.length; mii++) {
          name = name + common.metric_name[minfo.id[mii]];
        }
      } else {
        name = minfo.name;
      }
      */
      this.basic_style.display = "flex";
      this.basic_style.border = 'none';

      let size_height = minfo.id.length * common.metric_prop.height + 40;

      if (minfo.id.length > 1) {
        this.basic_style.border = 'solid 1px #000000';
      }

      if(minfo.focus){
        this.basic_style.border = 'solid 3px #ff0000';
      }

      ////console.log(minfo);
      ////console.log(this.inputRef.current.draggable);

      this.setState({
        name: minfo.name,
        id: minfo.id,
        weight: minfo.weight,
        position: { x: minfo.x, y: minfo.y },
        size: { width: common.metric_prop.width, height: size_height },
        focus: minfo.focus,
        style: this.basic_style
      })
    }
  }

  componentWillUnmount() {
  }

  //detect leave
  detectLeave(_d) {
  }

  //detect collision
  detectCollision(_d) {
    let min_distance = null;
    let collision_id = -1;

    ////console.log(this.props.info);
    for (let mri = 0; mri < common.metric_rel.length; mri++) {
      if (common.metric_rel[mri].id != this.state.id) {

        let opponent_width = common.metric_prop.width;
        let opponent_height = common.metric_rel[mri].id.length * common.metric_prop.height;

        let distance_x = _d.x - common.metric_rel[mri].x;
        let distance_y = _d.y - common.metric_rel[mri].y;

        //judge with x y distance.
        if (((distance_x > -1 * this.state.size.width) && (distance_x < opponent_width)) && ((distance_y > -1 * this.state.size.height) && (distance_y < (opponent_height)))) {

          //update closest mri
          if (!min_distance) {
            collision_id = common.metric_rel[mri].id;
          } else {
            if ((distance_x + distance_y) < min_distance) {
              min_distance = distance_x + distance_y;
              collision_id = common.metric_rel[mri].id;
            }
          }
        }
      }
    }
    return collision_id;
  }

  updateCommon(_m, _d) {

    //keep id and update position
    if (_m == "updateFocus") {
      for (let mri = 0; mri < common.metric_rel.length; mri++) {
        if (common.metric_rel[mri].id == this.state.id) {
          common.metric_rel[mri].focus = true;
        } else {
          common.metric_rel[mri].focus = false;
        }
      }
    }

    //keep id and update position
    if (_m == "updatePos") {
      for (let mri = 0; mri < common.metric_rel.length; mri++) {
        if (common.metric_rel[mri].id == this.state.id) {
          common.metric_rel[mri].x = _d.x;
          common.metric_rel[mri].y = _d.y;
        }
      }
    }

    //delete id
    if (_m == "clearId") {
      let remove_mri_index = -1;
      for (let mri = 0; mri < common.metric_rel.length; mri++) {
        if (common.metric_rel[mri].id == this.state.id) {
          remove_mri_index = mri;
        }
      }
      common.metric_rel.splice(remove_mri_index, 1);
    }

    //add id and weight
    if (_m == "addId") {
      //if add to exisiting set
      if (_d.target_id != -1) {
        for (let mri = 0; mri < common.metric_rel.length; mri++) {
          if (common.metric_rel[mri].id == _d.target_id) {
            common.metric_rel[mri].id = common.metric_rel[mri].id.concat(this.state.id);
            common.metric_rel[mri].weight = common.metric_rel[mri].weight.concat(this.state.weight);
            common.metric_rel[mri].focus = true;
          }
        }
        //add set itself
      } else {
        //common.metric_rel.push({id:[this.state.id],x:_d.x, y:_d.y});
      }
    }

    //separate id and weight
    if (_m == "separateId") {
      //delete id weight
      for (let mri = 0; mri < common.metric_rel.length; mri++) {
        if (common.metric_rel[mri].id.indexOf(_d.target_id) != -1) {
          common.metric_rel[mri].weight.splice(common.metric_rel[mri].id.indexOf(_d.target_id), 1); //delete weight
          common.metric_rel[mri].id.splice(common.metric_rel[mri].id.indexOf(_d.target_id), 1); //delete id
          //reset name if remained metric_rel have single id
          if(common.metric_rel[mri].id.length == 1){
            common.metric_rel[mri].name = "";
            common.metric_rel[mri].weight = [1];
          }
        }
      }
      common.metric_rel.push({ name: "", weight:[1], id: [_d.target_id], x: _d.x, y: _d.y, focus: false });
    }

    if (_m == "updateName") {
      for (let mri = 0; mri < common.metric_rel.length; mri++) {
        if (common.metric_rel[mri].id == this.state.id) {
          common.metric_rel[mri].name = _d.name;
        }
      }
    }

    if (_m == "updateWeight") {
      for (let mri = 0; mri < common.metric_rel.length; mri++) {
        if (common.metric_rel[mri].id == this.state.id) {
          common.metric_rel[mri].weight = _d.weight;
        }
      }
    }

    //console.log(common.metric_rel);
  }

  separate(_id) {
    ////console.log(_id);
    this.updateCommon("separateId", {name:-1, weight:-1, target_id: _id, x: this.state.position.x + common.metric_prop.width + 10, y: this.state.position.y });
    this.props.updateApp();
  }

  updatename_from_metricname(_name) {
    this.updateCommon("updateName", {name:_name, weight:-1, target_id: -1, x: -1, y: -1 });
    this.props.updateApp();
  }

  //update weight by _weight {weight_num(list num of target weight),add}
  weight_change(_weight) {
    let newweight = this.state.weight;
    newweight[_weight.weight_num] = newweight[_weight.weight_num] + _weight.add;
    this.updateCommon("updateWeight", {name:-1, weight:newweight, target_id: -1, x: -1, y: -1 });
    this.props.updateApp();
  }

  render() {

    //console.log(this.state);

    if (this.inputRef.current) {
      ////console.log(this.inputRef.current);
      ////console.log(this.inputRef.current.draggable.state);
    }

    let inner_component = "";
    inner_component = [<MetricName key={this.props.key_num + "mn"} info={this.state} updatename_from_metricname={(_name)=>this.updatename_from_metricname(_name)}/>, <InnerMeteric key={this.props.key_num + "im"} key_num={this.props.key_num} info={this.state} onClick={(_id) => this.separate(_id)} onWeightChange={(_weight) => this.weight_change(_weight)}/>]

    return (
      <Rnd
        //ref={c => { this.rnd = c; }}
        ref={this.inputRef}
        position={this.state.position}
        enableResizing={false}
        cancel={".nodrag"}
        //cancel={["input","div.innermetric_delete","div.weight_plus","div.weight_minus"]}
        style={this.state.style}
        size={{ width: this.state.size.width, height: this.state.size.height }}

        onDragStart={(e, d) => {
          this.updateCommon("updateFocus", {name:-1, weight:-1, target_id: -1, x: d.x, y: d.y })
          this.props.updateApp();
        }}

        onDragStop={(e, d) => {

          ////console.log(this.state);
          //detect collision
          let collision_id = this.detectCollision({ x: d.x, y: d.y });
          ////console.log(collision_id);

          if (collision_id != -1) {
            //add this id to collision mri
            this.updateCommon("clearId", {name:-1, weight:-1, target_id: -1, x: -1, y: -1 });
            this.updateCommon("addId", {name:-1, weight:-1, target_id: collision_id, x: -1, y: -1 });
            this.props.updateApp();
          } else {
            //else where user drop
            //this.setState({ position: { x: d.x, y: d.y } })
            this.updateCommon("updatePos", {name:-1, weight:-1, target_id: -1, x: d.x, y: d.y })
            this.props.updateApp();
          }
        }}
      >
        {inner_component}
      </Rnd>
    );
  }
}

class MetricName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.info.name}
  }

  componentDidUpdate(){
  }

  //receive and input saved value after update common.metric_rel
  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.info.name});
  }

  //input type value to input (in react way)
  //save input value to common.metric_rel
   changeText(e){
    //this.setState({value: e.target.value});
    this.props.updatename_from_metricname(e.target.value);
  }

  //prevent submit when press enter key
  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    let mn;
    if (this.props.info.id.length > 1) {
      //mn = <div className="metricname">{this.props.info.name}</div>
      mn = <input type="text" className={"metricname" + " " + "nodrag"} value={this.state.value} onChange={(e) => this.changeText(e)} />
    } else {
      mn = <div className="metricname_none"></div>
    }
    return (
      <form onSubmit={this.handleSubmit}>{mn}</form>
    );
  }
}

class InnerMeteric extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weight:this.props.info.weight
    }
    this.press_count = 0
  }

  componentWillReceiveProps(nextProps) {
    this.setState({weight: nextProps.info.weight});
  }

  //when press weight start
  handleButtonPress (_mrii, _add) {
    this.props.onWeightChange({weight_num:_mrii, add:_add}) //for first click
    this.buttonPressTimer = setInterval(() => this.countManager(_mrii, _add),250); //call every 250ms
  }

  countManager(_mrii, _add){
    //generate acout up waeght for qucik increase or decrease
    this.press_count++;
    let add_weight = Math.pow(10, Math.floor(this.press_count / 10));
    this.props.onWeightChange({weight_num:_mrii, add:_add * add_weight});
  }

  //reset count up
  handleButtonRelease () {
    this.press_count = 0;
    clearInterval(this.buttonPressTimer);
  }

  render() {
    this.metric = [];
    /**
    if (this.props.info.id ) {
      let mrii = 0;
      this.metric.push(
        <div key={this.props.info + "-" + mrii} className="innermetric">
          <div className="innermetric_name">
            &nbsp;
          </div>
          <div key={this.props.info + "-" + mrii + "dl"} className="innermetric_delete">
            &nbsp;
          </div>
        </div>
      )
    } else {
      */

     if (this.props.info.id.length > 1) {
        for (let mrii = 0; mrii < this.props.info.id.length; mrii++) {
          this.metric.push(
            <div key={this.props.key_num + "-" + mrii} className="innermetric">
              <div className="innermetric_name">
                ({this.props.info.id[mrii]}){common.metric_name[this.props.info.id[mrii]]}
                ×{this.state.weight[mrii]}
                <div>
                  {/*<div className={"weight_plus" + " " + "nodrag"} onClick={() => this.props.onWeightChange({weight_num:mrii, add:1})}>+</div>*/}
                  <div className={"weight_plus" + " " + "nodrag"}
                   onMouseDown={() => this.handleButtonPress(mrii,1)}
                   onMouseUp={() => this.handleButtonRelease()}
                   onMouseLeave={() => this.handleButtonRelease()}
                   >+</div>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <div className={"weight_minus" + " " + "nodrag"}
                   onMouseDown={() => this.handleButtonPress(mrii,-1)}
                   onMouseUp={() => this.handleButtonRelease()}
                   onMouseLeave={() => this.handleButtonRelease()}
                   >-</div>
                </div>
              </div>
              <div key={this.props.key_num + "-" + mrii + "dl"} className={"innermetric_delete" + " " + "nodrag"} onClick={() => this.props.onClick(this.props.info.id[mrii])}>
                X
          </div>
            </div>
          )
        }
      } else if (this.props.info.id.length == 1) {
        let mrii = 0;
        this.metric.push(
          <div key={this.props.key_num + "-" + mrii} className="innermetric">
            <div className="innermetric_name">
              ({this.props.info.id[mrii]}){common.metric_name[this.props.info.id[mrii]]}
            </div>
            <div key={this.props.key_num + "-" + mrii + "dl"} className="innermetric_delete">
              &nbsp;
          </div>
          </div>
        )
      }
    /** } */
    return (
      <div>{this.metric}</div>
    );
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);

    /**
    this.inputRef = [];
    for (let mi = 0; mi < common.metric_name.length; mi++) {
      this.inputRef.push(React.createRef());
    }
    **/

    this.state = {
      update_count: 0
    }

  }

  updateApp() {
    //delete metric
    let uc = this.state.update_count;
    uc = uc + 1;
    this.setState({ update_count: uc });

    //this.inputRef[_d.id].current.updateStatus(_d)
  }

  render() {
    let metric = [];


    //when load, get data from global common value
    for (let mri = 0; mri < common.metric_rel.length; mri++) {
      metric.push(
        <Metric key={mri} key_num={mri} updateApp={() => { this.updateApp() }} />
      )
      if(common.metric_rel[mri].focus){
        sendSocketIO(common.metric_rel[mri]);
      }
    }
    ////console.log(metric);

    return (
      <div className="App">
        {metric}
      </div>
    );
  }
}

const sendSocketIO = (obj) => {
  common.socket.emit("data", {
    name: obj.name,
    metric: obj.id,
    weight: obj.weight
  });
}

export default App;
