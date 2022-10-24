import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Nav } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { InputTags } from "react-bootstrap-tagsinput";
import { action, observable, toJS } from "mobx";
import axios from "axios";
import { observer } from "mobx-react";
import { Trash3, PencilSquare } from "react-bootstrap-icons";
import Navbar from "react-bootstrap/Navbar";

axios.defaults.baseURL = "http://localhost:8001/api/movie/";

interface Values {
  id: string;
  name: string;
  rating: number;
  cast: string[];
  genre: string;
  release: string;
}

class Store {
  @observable userId: string;
  @observable username: string;
  @observable accessToken: string;

  constructor(props: homeProps) {
    this.userId = props.user.id;
    this.username = props.user.username;
    this.accessToken = props.user.accessToken;
    console.log("this.movieDate :", toJS(this.movieData));
  }

  @observable isLoading: boolean = false;
  @observable setLoading = (value: boolean) => {
    this.isLoading = true;
  };

  @observable
  movieData: Values[] = observable.array();

  @action.bound
  addMovieData = async (values: MovieMeta) => {
    try {
      this.isLoading = true;
      this.movieData = [...this.movieData, { ...values, id: "" }];
      const res = await axios.post("/", values, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      const record = res.data;

      const data = { ...values, id: record.id };

      const movieData = this.movieData.slice();

      this.movieData = [...movieData, data];

      this.load();
    } catch (e) {
      console.error({ e });
    } finally {
      this.isLoading = false;
    }
  };

  @action.bound
  load = async () => {
    try {
      this.isLoading = true;
      const res = await axios.get("/all", {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      const records = res.data.movies;

      console.log({ records });
      const movieData = records.map((r: any) => {
        return {
          id: r.id,
          name: r.name,
          rating: r.rating,
          cast: r.castMembers,
          genre: r.genre,
          release: r.release.split("T")[0],
        };
      });

      this.movieData = movieData;

      console.log(this.movieData);
      this.isLoading = false;
    } catch (e) {
      console.error({ e });
    } finally {
      this.isLoading = false;
    }
  };

  @action.bound
  deleteRow = async (id: string) => {
    const x = [...this.movieData.filter((m) => m.id != id)];
    this.movieData = x;
    console.log(this.movieData);
    await axios.delete("/" + id, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
  };

  @action.bound
  editMovie = async (id: string, values: MovieMeta) => {
    try {
      this.isLoading = true;
      let allData = this.movieData.slice();
      this.movieData = allData.filter((d) => d.id != id);

      const res = await axios.put("/" + id, values, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      const record = res.data.record;

      const data = { ...values, id: record.id };
      allData = this.movieData.slice();

      this.movieData = [...allData, data];

      this.load();
    } catch (e) {
      console.error({ e });
    } finally {
      this.isLoading = false;
    }
  };
}
interface homeProps {
  user: {
    id: string;
    username: string;
    accessToken: string;
  };
}
@observer
export class Home extends React.Component<homeProps, any> {
  store: Store;
  constructor(props: homeProps) {
    super(props);
    this.state = {
      isModalVisible: false,
      isLoading: false,
      isEditModalVisible: false,
      editData: null,
      editId: null,
    };
    this.store = new Store(props);
  }

  handleClickAdd = () => {
    this.setState({ isModalVisible: true });
  };

  componentDidMount(): void {
    this.store.load();
  }

  componentDidUpdate(prevProps: homeProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.user.username !== prevProps.user.username) {
      console.log(this.props.user.username);
    }
  }

  editRow = (data: any) => {
    this.setState({ isEditModalVisible: true });
    this.setState({ editId: data.id });
    delete data.id;
    this.setState({ editData: data });
  };

  deleteRow = (id: string) => (e: any) => {
    this.store.deleteRow(id);
    this.store.load();
    this.store.movieData.slice();
  };

  renderHome = () => {
    const data = this.store.movieData;
    return (
      <div className="container">
        <Navbar>
          <Container>
            <Navbar.Brand>Welcome {this.props.user.username}</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>Logout</Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="row m-10" key={this.props.user.id}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Cast</th>
                <th>Genre</th>
                <th>Release</th>
              </tr>
            </thead>
            <tbody>
              {data.map((_, index) => (
                <tr key={index}>
                  <td>{_.name}</td>
                  <td>{_.rating}</td>
                  <td>{_.cast}</td>
                  <td>{_.genre}</td>
                  <td>{_.release}</td>
                  <td>
                    <div onClick={this.deleteRow(_.id)}>
                      <Trash3 />
                    </div>
                  </td>
                  <td>
                    <div onClick={(e) => this.editRow(_)}>
                      <PencilSquare />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  };

  handleSubmit = (values: MovieMeta) => {
    this.store.addMovieData(values);
  };

  handleSubmitEdit = (values: MovieMeta) => {
    console.log({ values });
    this.setState({ isEditModalVisible: false });
    this.store.editMovie(this.state.editId, values);
  };

  render() {
    console.log(this.store.movieData.slice(), this.store.isLoading);

    return (
      <div>
        {this.state.isModalVisible && (
          <AddEditModal
            onClose={() => this.setState({ isModalVisible: false })}
            handleSubmit={(values) => this.handleSubmit(values)}
            isEdit={false}
            movieData={null}
          />
        )}
        {this.state.isEditModalVisible && (
          <AddEditModal
            onClose={() => this.setState({ isEditModalVisible: false })}
            handleSubmit={(values) => this.handleSubmitEdit(values)}
            isEdit={true}
            movieData={this.state.editData}
          />
        )}
        {this.renderHome()}
        <div className="container">
          <div className="row m-10">
            <Button
              variant="primary"
              disabled={this.state.thisLoading}
              onClick={
                !this.state.thisLoading ? this.handleClickAdd : (e) => {}
              }
            >
              {this.state.isLoading ? "Loading…" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

interface MovieMeta {
  name: string;
  rating: number;
  cast: string[];
  genre: string;
  release: string;
}

interface Props {
  onClose: () => void;
  handleSubmit: (movieMeta: MovieMeta) => void;
  movieData: MovieMeta | null;
  isEdit: boolean;
}

const AddEditModal = ({ onClose, handleSubmit, movieData, isEdit }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [movieName, setMovieName] = useState(movieData?.name || "");
  const [rating, setRating] = useState(movieData?.rating || 0);
  const [cast, setCast] = useState(movieData?.cast || ([] as string[]));
  const [genre, setGenre] = useState(movieData?.genre || "");
  const [date, setDate] = useState(
    movieData?.release || new Date().toLocaleString()
  );

  const handleOnclick = (e: any) => {
    handleSubmit({ name: movieName, rating, cast, genre, release: date });
    setIsOpen(false);
    onClose();
    e.preventDefault();
  };

  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <form
          className="m-2"
          onSubmit={(e) => {
            handleOnclick(e);
          }}
        >
          <div className="form-group">
            <input
              type="text"
              value={movieName}
              className="form-control"
              id="name"
              placeholder="Name"
              onChange={(e) => setMovieName(e.target.value)}
            ></input>
          </div>

          <div className="form-group">
            <label>Rating</label>
            <input
              type="number"
              value={rating}
              className="form-control"
              id="rating"
              placeholder="rating"
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
            ></input>
          </div>
          <div className="form-group">
            <input
              type="text"
              value={genre}
              className="form-control"
              id="genre"
              placeholder="genre"
              onChange={(e) => setGenre(e.target.value)}
            ></input>
          </div>
          <div className="form-group">
            <label>Cast (Press space to select)</label>
            <InputTags
              values={cast}
              onTags={(value) => setCast(value.values)}
            ></InputTags>
            <input
              type="date"
              value={date}
              className="form-control"
              id="date"
              placeholder="genre"
              onChange={(e) => setDate(e.target.value)}
            ></input>
          </div>
          <div className="d-flex flex-row align-items-center justify-content-between">
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Edit" : "Add"}
            </button>
            <button
              onClick={(e) => {
                onClose();
              }}
              className="btn btn-danger"
            >
              Close
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
