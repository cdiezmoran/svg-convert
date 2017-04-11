import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// Import Components
import PostList from '../../components/PostList';
import PostCreateWidget from '../../components/PostCreateWidget/PostCreateWidget';

// Import Actions
import { addPostRequest, fetchPosts, deletePostRequest } from '../../PostActions';
import { toggleAddPost } from '../../../App/AppActions';

// Import Selectors
import { getShowAddPost } from '../../../App/AppReducer';
import { getPosts } from '../../PostReducer';

class PostListPage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchPosts());
  }

  handleDeletePost = post => {
    if (confirm('Do you want to delete this post')) { // eslint-disable-line
      this.props.dispatch(deletePostRequest(post));
    }
  };

  handleAddPost = (name, title, content) => {
    this.props.dispatch(toggleAddPost());
    this.props.dispatch(addPostRequest({ name, title, content }));
  };

  render() {
    return (
      <form ref="FormData" encType="multipart/form-data" onSubmit={this.onSubmit.bind(this)}>
        <input type="file" ref="file" name="upload" />
        <button type="submit">Submit</button>
      </form>
    );
  }

  onSubmit(ev) {
    ev.preventDefault();
    const file = new FormData(this.refs.FormData);
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
      console.log(e.target.responseText);
      var file = new Blob(e.target.responseText)
      var url = URL.createObjectURL(file)
      const elm = document.createElement("a");
      elm.href = url
      elm.click();
    };
    xhr.open("POST", "/image");
    xhr.send(file);
    console.log(file);
  }
}

// Actions required to provide data for this component to render in sever side.
PostListPage.need = [() => { return fetchPosts(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    showAddPost: getShowAddPost(state),
    posts: getPosts(state),
  };
}

PostListPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  })).isRequired,
  showAddPost: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

PostListPage.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(PostListPage);
