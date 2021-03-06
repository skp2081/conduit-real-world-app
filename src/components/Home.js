import React, { Component } from 'react';
import {connect} from 'react-redux';
import Tags from './Tags';
import {NavLink} from 'react-router-dom';
import Pages from './Pages';

class Home extends Component {

  componentDidMount() {
    fetch('https://conduit.productionready.io/api/tags')
    .then(res => res.json())
    .then(({tags}) => this.props.dispatch({type:"ADD_TAGS",payload:tags})
    )}

  handleUser = (username) => {
    this.fetchUserArticles(username);
    fetch(`https://conduit.productionready.io/api/profiles/${username}`)
    .then(res => res.json()).then(user => this.props.dispatch({type: "USER_PROFILE", payload: user.profile})
    )}
  
  fetchUserArticles = (username) => {
    fetch(`https://conduit.productionready.io/api/articles?author=${username}`)
    .then(res => res.json())
    .then(({articles}) => this.props.dispatch({type: "USER_ARTICLES", payload: articles}))
  }
  
  
  render() {
    const {articles, filterTags} = this.props;
    let arr = (filterTags.length) ? filterTags : articles;
    let heading =(filterTags.length) ? filterTags.tagList : "";
    console.log(arr, 'this is arr');

    return (
      <div>
        {/* Hero section */}
        <section>
          <div className="hero">
            <h2>conduit</h2>
            <p>A place to share your knowledge.</p>
          </div>
        </section>
        
        {/* Global Feed section */}
        <section>
          <div className="super">
            <article className="article-wrapper">
              {/* conditional rendering for tag required */}
              <h2>{"Global Feed" || heading}</h2>

              {
                arr.map(article => (

              <div className="post">

                <div className="post-header">
                  <div className="post-details">
                    <img src="https://static.productionready.io/images/smiley-cyrus.jpg" alt="user-img" />
                    <div className="user-info">
                      <NavLink onClick={() => this.handleUser(article.author.username)} exact activeClassName = 'active' className="navigation-link" to="/user" >
                        <h4>{article.author.username}</h4>
                      </NavLink>
                      <p>{new Date(article.createdAt).toString().slice(4, 15).split('-').reverse().join()}</p>
                    </div>
                  </div>

                  {/* Heart */}
                  <div className="likes">
                    <NavLink exact className="navigation-link nav-logo" to='/register' >
                      <p className="heart">&#9829;</p>
                      <p className="article-count">{article.favoritesCount}</p>
                    </NavLink>
                  </div>
                </div>
                
                {/* Post content */}
                <div className="post-content">
                  <NavLink exact activeClassName = 'active' className="navigation-link" to='/article' >
                    <p className="post-title">{article.title}</p>
                  </NavLink>
                  
                  <p className="post-description">{article.description}</p>
                  <button type="submit">Read more...</button>

                </div>
              </div>

              ))
              }
            </article>
          {/* Tag */}
            <Tags />
          </div>
          <Pages />
        </section>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    articles: state.reducer.articles,
    filterTags: state.filterTags
  }
}

export default connect(mapStateToProps)(Home);