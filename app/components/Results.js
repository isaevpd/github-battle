import React from 'react';
import queryString from 'query-string';
import * as api from '../utils/api';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PlayerPreview from './PlayerPreview';
import Loading from './Loading';

const Profile = ({ info }) => (
  <PlayerPreview username={info.login} avatar={info.avatar_url}>
    <ul className="space-list-items">
      {info.name && <li>{info.name}</li>}
      {info.location && <li>{info.location}</li>}
      {info.company && <li>{info.company}</li>}
      <li>Followers: {info.followers}</li>
      <li>Following: {info.following}</li>
      <li>Public Repos: {info.public_repos}</li>
      {info.blog && (
        <li>
          <a href={info.blog}>{info.blog}</a>
        </li>
      )}
    </ul>
  </PlayerPreview>
);

Profile.propTypes = {
  info: PropTypes.object.isRequired,
};

const Player = ({ label, score, profile }) => (
  <div>
    <h1 className="header">{label}</h1>
    <h3 style={{ textAlign: 'center' }}>Score: {score}</h3>
    <Profile info={profile} />
  </div>
);

Player.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired,
};

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: null,
      loser: null,
      error: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    const { playerOneName, playerTwoName } = queryString.parse(
      this.props.location.search,
    );
    console.log(playerOneName, playerTwoName);
    // console.log(battle(playerOneName));
    api.battle([playerOneName, playerTwoName]).then(results => {
      if (!results) {
        this.setState({
          error: 'Something went wrong, check API call',
          isLoading: false,
        });
      } else {
        const [winner, loser] = results;
        return this.setState({
          winner: winner,
          loser: loser,
          error: null,
          isLoading: false,
        });
      }
    });
  }

  render() {
    const error = this.state.error;
    const winner = this.state.winner;
    const loser = this.state.loser;
    if (this.state.isLoading) {
      return <Loading />;
    }
    if (this.state.error) {
      return (
        <div>
          <p>{error}</p>
          <Link to="/battle">Reset</Link>
        </div>
      );
    }
    return (
      <div className="row">
        <Player label="Winner" score={winner.score} profile={winner.profile} />
        <Player label="Loser" score={loser.score} profile={loser.profile} />
      </div>
    );
  }
}

export default Results;
