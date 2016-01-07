var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment){
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
      );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e){
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if(!text || !author){
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function() {
    return (
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} />
          <input type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange} />
          <input type="submit" value="Post" />
        </form>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function(){
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(tihs.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment){
    var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval)
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
				<Collatz />
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
]

var FancyButton = React.createClass({
	render: function(){
		return <button onClick={this.props.onClick}>
			<i className={"fa "+this.props.icon}></i>
			<span>{this.props.text}</span>
		</button>
	}
});

var Collatz = React.createClass({
		getInitialState: function(){
			return {
				counter: 19
			}
		},
		increment: function(){
			if(this.state.counter%2==0){
				this.setState({ counter: this.state.counter/2 });
			}
			else{
				this.setState({ counter: this.state.counter*3+1 });
			}
		},
    render: function() {
        return <div>
					<div>{this.state.counter}</div>
					<FancyButton text="Increment!" icon="fa-arrow-circle-o-up" onClick={this.increment} />
				</div>;
    }
});

//ReactDOM.render(new HelloWorld({ name: "Chris Harrington" }), document.getElementById('content'));

ReactDOM.render(
  <CommentBox url="/api/comments/" pollInterval={2000}/>,
  document.getElementById('content')
);


