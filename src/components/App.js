import React, { Component } from "react";
import { debounce } from "lodash";
import GlobalStyles from "./styled/GlobalStyles";
import Wrapper from "./styled/Wrapper";
import Header from "./styled/Header";
import Input from "./styled/Input";
import BooksBox from "./styled/BooksBox";
import Book from "./styled/Book";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      startIndex: 0,
      books: [],
      totalItems: 0,
      searching: false
    };
  }

  changeTitleInState = debounce(value => {
    const title = value;
    this.setState({
      title
    });
    if (title !== "") {
      this.fetchData();
    }
  }, 500);
  searchInputHandle = value => {
    if (value !== "") {
      this.setState({
        searching: true,
        books: [],
        booksList: [],
        startIndex: 0
      });
    } else {
      this.setState({
        searching: false,
        books: [],
        booksList: [],
        startIndex: 0
      });
    }
    this.changeTitleInState(value);
  };
  fetchData = async () => {
    const startIndex = this.state.startIndex;
    let title = this.state.title;
    title = title.split(" ").join("+");
    const API = `https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=12&startIndex=${startIndex}&key=AIzaSyAtCvuJ-HXacti2KlamrHaOqecPcIyvMHE`;
    await fetch(API)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then(response => {
        if (response.totalItems === 0) {
          this.setState({
            booksList: "not found matching books"
          });
        }
        let books = this.state.books.concat(response.items);
        const totalItems = response.totalItems;
        this.setState({
          books,
          totalItems,
          searching: false,
          startIndex: startIndex + response.items.length
        });
      })
      .catch(error => console.error(error));
  };
  loadMoreData = debounce(() => {
    if (this.state.totalItems > this.state.startIndex) {
      this.fetchData();
    }
  }, 500);
  shortenTitleOrDesc = (words, numbers) => {
    if (words !== undefined) {
      words = words.split(" ");
      if (words.length > numbers) {
        words = words.slice(0, numbers);
        words.push("...");
      }
      words = words.join(" ");
    }
    return words;
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.state.books !== prevState.books) {
      if (this.state.totalItems > 0) {
        const books = this.state.books;
        const booksList = [];
        books.forEach((book, index) => {
          const id = book.id;
          let title = this.shortenTitleOrDesc(book.volumeInfo.title, 7);
          const image = `http://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`;
          let description = this.shortenTitleOrDesc(book.volumeInfo.description,15);
          const element = (
            <Book key={index}>
              <img src={image} alt={title} />
              <h3>{title}</h3>
              <p>{description}</p>
            </Book>
          );
          booksList.push(element);
        });
        this.setState({
          booksList
        });
      }
    }
  }
  scrollHandle = () => {
    if (
      document.querySelector("#wrapper").offsetHeight <=
      window.innerHeight + window.scrollY
    ) {
      this.loadMoreData();
    }
  };
  componentDidMount() {
    window.addEventListener("scroll", () => this.scrollHandle());
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", () => this.scrollHandle());
  }
  render() {
    return (
      <>
        <GlobalStyles />
        <Wrapper id="wrapper">
          <Header>Book Search</Header>
          <Input
            type="text"
            name="title"
            placeholder="your are looking for?"
            onChange={e => {
              this.searchInputHandle(e.target.value);
            }}
          />
          <BooksBox>
            {this.state.searching ? "Searching..." : this.state.booksList}
          </BooksBox>
        </Wrapper>
      </>
    );
  }
}

export default App;
