var BigBox = React.createClass({
  getInitialState: function(){
    return {
      firstPlayerTurn: true,
      board: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  },
  toggleTurn: function(event){
    var myboard = this.state.board
    if(this.state.firstPlayerTurn){
      myboard[event] = 1
    }
    else {
      myboard[event] = 2
    }
    this.setState({firstPlayerTurn: !this.state.firstPlayerTurn, board: myboard}, function(){
      this.checkWin()
    })
  },
  checkWin: function(){
    var b = this.state.board
    if(b[0] == 1 && b[1] == 1 && b[2] == 1 || b[3] == 1 && b[4] == 1 && b[5] == 1 || b[6] == 1 && b[7] == 1 && b[8] == 1 || b[0] == 1 && b[3] == 1 && b[6] == 1 || b[1] == 1 && b[4] == 1 && b[7] == 1 || b[2] == 1 && b[5] == 1 && b[8] == 1 || b[0] == 1 && b[4] == 1 && b[8] == 1 || b[2] == 1 && b[4] == 1 && b[6] == 1){
      alert('Winner Player One')
      location.reload()
    }
    else if(b[0] == 2 && b[1] == 2 && b[2] == 2 || b[3] == 2 && b[4] == 2 && b[5] == 2 || b[6] == 2 && b[7] == 2 && b[8] == 2 || b[0] == 2 && b[3] == 2 && b[6] == 2 || b[1] == 2 && b[4] == 2 && b[7] == 2 || b[2] == 2 && b[5] == 2 && b[8] == 2 || b[0] == 2 && b[4] == 2 && b[8] == 2 || b[2] == 2 && b[4] == 2 && b[6] == 2){
      alert('Winner Player Two')
      location.reload()
    }
    else if(b.indexOf(0) == -1){
      alert("It's a draw!")
      location.reload()
    }
  },
  render: function() {
    return (
      <div>
        <div>
          <BasicBox toggleTurn={this.toggleTurn} id={1} firstTurn={this.state.firstPlayerTurn} /><BasicBox toggleTurn={this.toggleTurn} id={2} firstTurn={this.state.firstPlayerTurn} /><BasicBox toggleTurn={this.toggleTurn} id={3} firstTurn={this.state.firstPlayerTurn} />
        </div><br /><br /><br /><br />
        <div>
          <BasicBox toggleTurn={this.toggleTurn} id={4} firstTurn={this.state.firstPlayerTurn} /><BasicBox toggleTurn={this.toggleTurn} id={5} firstTurn={this.state.firstPlayerTurn} /><BasicBox toggleTurn={this.toggleTurn} id={6} firstTurn={this.state.firstPlayerTurn} />
        </div><br /><br /><br /><br />
        <div>
          <BasicBox toggleTurn={this.toggleTurn} id={7} firstTurn={this.state.firstPlayerTurn} /><BasicBox toggleTurn={this.toggleTurn} id={8} firstTurn={this.state.firstPlayerTurn} /><BasicBox toggleTurn={this.toggleTurn} id={9} firstTurn={this.state.firstPlayerTurn} />
        </div>
      </div>
    )
  }
})

var BasicBox = React.createClass({
  getInitialState: function(){
    return {
      text: ""
    }
  },
  markSquare: function(event){
    if(this.state.text == ""){
      if(this.props.firstTurn){
        this.setState({text: "X"}, function(){
          this.props.toggleTurn(this.props.id-1)
        }.bind(this))
      }
      else {
        this.setState({text: "O"}, function(){
          this.props.toggleTurn(this.props.id-1)
        }.bind(this))
      }
    }
  },
  render: function(){
    var s = {
      "width": "100",
      "height": "75",
      "float": "left",
      "borderStyle": "solid",
      "borderWidth": "5px",
      "fontSize": "3em",
      "padding": "0",
      "margin": "0"
    }
    return (
      <div><div style={s} className="span2" onClick={this.markSquare}>{this.state.text}</div><div style={{"width": "15", "height": "10", "float": "left"}}> </div></div>
    )
  }
})

ReactDOM.render(
  <BigBox message="box" />,
  document.getElementById('content')
)
