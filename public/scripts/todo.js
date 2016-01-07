'use strict'

var Todo = React.createClass({
  getInitialState: function(){
    return {
      todos: []
    }
  },
  componentWillMount: function(){
    emitter.on(constatns.changed, function(todos){
      this.setState({todos: todos})
    }.bind(this))
  },
  componentDidMount: function(){
    dispatcher.dispatch({ type: constants.all })
  },
  componentsWillUnmount: function(){
    emitter.off(constants.all)
  },
  create: function(){
    this.refs.create.show()
  },
  renderList: function(complete){
    return <List todos={_.filter(this.state.todos, function(X) { return X.isComplete === complete })} />
  },
  render: function(){
    return <div className="container">
      <div className="row">
        <div className="col-md-8">
          <h1>Todo List </h1>
        </div>
        <div className="col-md-4">
          <button type="button" className="btn btn-primary pull-right spacing-top" onClick={this.create}>New Task</button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h2 className="spacing-bottom">Incomplete</h2>
          {this.renderList(false)}
        </div>
        <div className="col-md-6">
          <h2 className="spacing-bottom">Complete</h2>
          {this.renderList(true)}
        </div>
      </div>
      <Modal ref="create" />
    </div>
  }
})

var Item = React.createClass({
  toggle: function(){
    this.props.todo.isComplete = !this.props.todo.isComplete
    dispatcher.dispatch({type: constants.update, content: this.props.todo})
  }
  render: function(){
    return <li className="list-group-item ponter" onClick={this.toggle}>{this.props.todo.name}</li>
  }
})

var Modal = React.createClass({
	getInitialState: function(){
		return {
			value: ""
		};
	},
	componentDidMount: function(){
		this.$el = $(this.getDOMNode());
		this.$el.on("hidden.bs.modal", this.reset)

		emitter.on(constants.changed, function(){
			this.$el.modal("hide");
		}.bind(this));
	},
	componentWillUnmount: function(){
		emitter.off(constants.changed);
	},
	show: function(){
		this.$el.modal("show");
	},
	reset: function(){
		this.setState({ value: "" });
	},
	save: function(){
		dispatcher.dispatch({ type: constants.create, content: {name: this.state.value, isComplete: false }})
	},
	onChange: function(e){
		this.setState({value: e.target.value })
	},
	render: function(){
		return <div className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true">
			<div className="modal-dialog modal-sm">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" className="close" data-dismiss="modal">
							<span aria-hidden="true">x</span>
							<span className="sr-only">Close</span>
						</button>
						<h2 className="modal-title">New Task</h2>
					</div>
					<div className="modal-body">
						<input placeholder="Task name..." type="text" value={this.state.value} onChange={this.onChange} />
					</div>
					<div className="modal-footer">
						<div className="row">
							<div className="col col-md-12">
								<button type="button" className="btn btn-primary pull-right" onClick={this.save}>Save</button>
								<button type="button" className="btn btn-default pull-right spacing-right" onClick={this.reset} data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
});

var Store = function(url, constants){
  this._url = url
  this._collection = []
  dispatcher.register(function(payload){
    switch(payload.type){
      case constants.all:
        this._all()
        break
      case constants.update:
        this._update(payload.content)
        break
      case constants.create:
        this._create(payload.content)
        break
      }
  }.bind(this))
  this._all = function(){
    $.get(this._url).then(function(data){
      this._collection = data
      _notify.call(this)
    }.bind(this))
  }.bind(this)
  this._update = function(content){
    var found = _.find(this._collection, function(X) { return X.id === content.id})
    for (var name in found)
      found[name] = content[name]
    $.post(this.url, found).then(function(){
      _notify.call(this)
    }.bind(this))
  }
  this._create = function(context){
    content.id = _.max(this.collection, function(X) { return X.id }).id + 1
    this._collection.push(content)
    $.post(this.url + '/' + content.id).then(function(){
      _notify.call(this)
    })
  }
  function _notify(){
    emitter.emit(constants.changed, this._collection)
  }
}

var TodoStore = new Store("fixtures/todos.json", require("constants").todo)
